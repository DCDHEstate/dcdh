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

async function uploadOne(file, category) {
  const fileType = resolveFileType(file);
  if (!fileType) throw new Error("Unsupported file type");

  const res = await fetch("/api/referrals/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, fileType, fileSize: file.size }),
  });
  if (!res.ok) {
    const d = await res.json().catch(() => ({}));
    throw new Error(d.error || "Upload failed");
  }
  const { uploadUrl, uploadFields, publicUrl } = await res.json();

  const fd = new FormData();
  Object.entries(uploadFields).forEach(([k, v]) => fd.append(k, v));
  // S3 requires the file to be the last field in the POST body.
  fd.append("file", file);

  const uploadRes = await fetch(uploadUrl, { method: "POST", body: fd });
  if (!uploadRes.ok && uploadRes.status !== 0 && uploadRes.status !== 204) {
    throw new Error(`Upload failed: ${uploadRes.status}`);
  }

  return {
    url: publicUrl,
    category,
    fileName: file.name,
    preview: URL.createObjectURL(file),
    mediaType: fileType.startsWith("video/") ? "video" : "image",
  };
}

/**
 * Uploads a selection to S3 a few at a time, preserving order. Failed files
 * are dropped — the caller compares lengths to report how many didn't make it.
 */
export async function uploadReferralMedia(files, category, onFileDone) {
  const list = Array.from(files);
  const results = new Array(list.length).fill(null);
  let cursor = 0;

  const worker = async () => {
    while (cursor < list.length) {
      const index = cursor++;
      try {
        results[index] = await uploadOne(list[index], category);
      } catch {
        results[index] = null;
      }
      onFileDone?.();
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(UPLOAD_CONCURRENCY, list.length) }, worker),
  );

  return results.filter(Boolean);
}
