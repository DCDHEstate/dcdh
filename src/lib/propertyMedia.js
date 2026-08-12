// Shared client-side helpers for property photo / video uploads.

const UPLOAD_CONCURRENCY = 4;

// Some browsers report an empty `file.type` for certain containers, so fall
// back to the extension rather than sending an empty fileType to the presign
// endpoint.
const EXT_TYPES = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  mp4: "video/mp4",
};

// Kept in sync with ALLOWED_TYPES in /api/properties/upload-url. Videos are
// MP4 only: .mov files routinely contain HEVC, which uploads without complaint
// and then won't decode in Chrome or Firefox.
export const ACCEPT_ATTR = "image/jpeg,image/png,image/webp,video/mp4";
const ALLOWED_TYPES = Object.values(EXT_TYPES);

export function resolveFileType(file) {
  if (file.type) return file.type;
  const ext = file.name.split(".").pop()?.toLowerCase();
  return EXT_TYPES[ext] || "";
}

/**
 * Splits a selection into files we can upload and ones to reject up front.
 * The `accept` attribute is only a hint — users can switch the file picker to
 * "All Files" — so the same rule is enforced here and again on the server.
 */
export function partitionAllowedFiles(files) {
  const accepted = [];
  const rejected = [];
  for (const file of Array.from(files)) {
    if (ALLOWED_TYPES.includes(resolveFileType(file))) accepted.push(file);
    else rejected.push(file);
  }
  return { accepted, rejected };
}

export function rejectionMessage(rejected) {
  if (rejected.length === 0) return "";
  const names = rejected.map((f) => f.name).join(", ");
  return `Skipped ${names} — videos must be MP4. Convert .mov or other formats to MP4 first, otherwise they won't play for buyers on Chrome or Firefox.`;
}

async function uploadOne(file, isPrimary) {
  const fileType = resolveFileType(file);
  if (!fileType) throw new Error("Unsupported file type");

  const res = await fetch("/api/properties/upload-url", {
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
    isPrimary,
    preview: URL.createObjectURL(file),
    mediaType: fileType.startsWith("video/") ? "video" : "image",
  };
}

/**
 * Uploads files to S3 a few at a time, preserving the selection order in the
 * returned list. Files that fail are skipped — the caller compares lengths to
 * find out how many didn't make it.
 */
export async function uploadFilesToS3(files, isPrimary, onFileDone) {
  const list = Array.from(files);
  const results = new Array(list.length).fill(null);
  let cursor = 0;

  const worker = async () => {
    while (cursor < list.length) {
      const index = cursor++;
      try {
        results[index] = await uploadOne(list[index], isPrimary);
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
