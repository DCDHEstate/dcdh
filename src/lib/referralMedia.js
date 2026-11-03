// Client-side uploader for property-referral media.
//
// File-type rules are shared with the listing uploader (same S3 bucket, same
// browser-playback constraints); only the presign endpoint and the per-file
// metadata differ — referral media is tagged with which room it shows rather
// than with a primary flag.

import {
  ACCEPT_ATTR,
  partitionAllowedFiles,
  rejectionMessage,
  resolveFileType,
} from "@/lib/propertyMedia";

export { ACCEPT_ATTR, partitionAllowedFiles, rejectionMessage };

const UPLOAD_CONCURRENCY = 4;

// Server limit is 5MB. Photos straight off a phone camera are often bigger, so
// anything over this is scaled down in the browser before uploading rather than
// being rejected.
const IMAGE_UPLOAD_LIMIT = 5 * 1024 * 1024;
const COMPRESS_ABOVE = 4.5 * 1024 * 1024;
const COMPRESSION_STEPS = [
  { maxSide: 2560, quality: 0.85 },
  { maxSide: 2048, quality: 0.8 },
  { maxSide: 1600, quality: 0.75 },
];

async function loadBitmap(file) {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file);
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** Returns the file unchanged, or a JPEG re-encode small enough to upload. */
async function compressIfNeeded(file, fileType) {
  if (!fileType.startsWith("image/") || file.size <= COMPRESS_ABOVE) return file;

  let bitmap;
  try {
    bitmap = await loadBitmap(file);
  } catch {
    return file; // Can't decode it here — let the server's size check decide.
  }

  const width = bitmap.width;
  const height = bitmap.height;

  try {
    for (const { maxSide, quality } of COMPRESSION_STEPS) {
      const scale = Math.min(1, maxSide / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      const ctx = canvas.getContext("2d");
      // JPEG has no transparency; paint white so transparent PNGs don't go black.
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
      if (blob && blob.size <= IMAGE_UPLOAD_LIMIT) {
        const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
        return new File([blob], name, { type: "image/jpeg" });
      }
    }
    return file;
  } finally {
    bitmap.close?.();
  }
}

async function uploadOne(file, category, ownerPhone) {
  const originalType = resolveFileType(file);
  if (!originalType) throw new Error(`${file.name}: unsupported file type`);

  const prepared = await compressIfNeeded(file, originalType);
  const fileType = resolveFileType(prepared);

  const res = await fetch("/api/referrals/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fileName: prepared.name,
      fileType,
      fileSize: prepared.size,
      ownerPhone,
    }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    const error = new Error(d.error || `${file.name}: upload failed`);
    // A phone-number rejection applies to every file — the caller stops early.
    error.fatal = res.status === 409 || res.status === 429;
    throw error;
  }
  const { uploadId, uploadUrl, uploadFields, publicUrl } = await res.json();

  const fd = new FormData();
  Object.entries(uploadFields).forEach(([k, v]) => fd.append(k, v));
  // S3 requires the file to be the last field in the POST body.
  fd.append("file", prepared);

  const uploadRes = await fetch(uploadUrl, { method: "POST", body: fd });
  if (!uploadRes.ok && uploadRes.status !== 0 && uploadRes.status !== 204) {
    throw new Error(`${file.name}: upload failed (${uploadRes.status})`);
  }

  return {
    uploadId,
    url: publicUrl,
    category,
    fileName: prepared.name,
    preview: URL.createObjectURL(prepared),
    mediaType: fileType.startsWith("video/") ? "video" : "image",
  };
}

/**
 * Uploads a selection to S3 a few at a time, preserving order.
 * Returns { uploaded, errors } — errors carry a human-readable message per file.
 */
export async function uploadReferralMedia(files, { category, ownerPhone, onFileDone, isCancelled }) {
  const list = Array.from(files);
  const results = new Array(list.length).fill(null);
  const errors = [];
  let cursor = 0;
  let halted = false;

  const worker = async () => {
    while (cursor < list.length && !halted && !isCancelled?.()) {
      const index = cursor++;
      try {
        results[index] = await uploadOne(list[index], category, ownerPhone);
      } catch (err) {
        errors.push(err.message);
        if (err.fatal) halted = true;
      }
      onFileDone?.();
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(UPLOAD_CONCURRENCY, list.length) }, worker),
  );

  return {
    uploaded: results.filter(Boolean),
    // A halted run reports its reason once, not once per file.
    errors: [...new Set(errors)],
  };
}
