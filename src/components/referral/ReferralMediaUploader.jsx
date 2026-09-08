"use client";

import { useRef, useState } from "react";
import { MEDIA_CATEGORIES } from "@/lib/referralOptions";
import {
  ACCEPT_ATTR,
  partitionAllowedFiles,
  rejectionMessage,
  uploadReferralMedia,
} from "@/lib/referralMedia";

/**
 * Photo / video picker for a property referral.
 *
 * Files upload to S3 as soon as they're picked rather than on submit — a
 * referral can carry a couple of hundred MB of video, and holding that until
 * the user hits Submit makes the whole form feel broken while it drains.
 * The parent only ever receives the finished S3 URLs.
 */
export default function ReferralMediaUploader({ media, onChange, max = 30 }) {
  const inputRef = useRef(null);
  const [category, setCategory] = useState("exterior");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [notice, setNotice] = useState("");

  const remaining = max - media.length;

  const handleFiles = async (fileList) => {
    setNotice("");
    if (!fileList?.length) return;

    const { accepted, rejected } = partitionAllowedFiles(fileList);
    let messages = rejected.length ? [rejectionMessage(rejected)] : [];

    const toUpload = accepted.slice(0, remaining);
    if (accepted.length > remaining) {
      messages.push(`Only ${max} files can be attached — extras were skipped.`);
    }

    if (toUpload.length === 0) {
      setNotice(messages.join(" "));
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: toUpload.length });
    try {
      const uploaded = await uploadReferralMedia(toUpload, category, () =>
        setProgress((p) => ({ ...p, done: p.done + 1 })),
      );
      if (uploaded.length < toUpload.length) {
        messages.push(`${toUpload.length - uploaded.length} file(s) failed to upload.`);
      }
      onChange([...media, ...uploaded]);
    } catch {
      messages.push("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress({ done: 0, total: 0 });
      setNotice(messages.join(" "));
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeAt = (index) => {
    const next = media.filter((_, i) => i !== index);
    onChange(next);
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">
        Photos &amp; Videos
      </label>
      <p className="mb-3 text-xs text-muted">
        Pick what the shots show, then add them. Exterior of the building plus
        each room helps the team assess the property without a visit.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-xl border border-border bg-surface-white px-3 py-2 text-sm text-body outline-none focus:border-accent"
        >
          {MEDIA_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || remaining <= 0}
          className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-body transition hover:bg-surface-subtle disabled:opacity-50"
        >
          {uploading
            ? `Uploading ${progress.done}/${progress.total}...`
            : "Add files"}
        </button>

        <span className="text-xs text-muted">
          {media.length}/{max} attached
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {notice && <p className="mt-2 text-xs text-amber-700">{notice}</p>}

      {media.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {media.map((m, i) => (
            <div
              key={m.url}
              className="group relative overflow-hidden rounded-xl border border-border bg-surface-subtle"
            >
              {m.mediaType === "video" ? (
                <video
                  src={m.preview || m.url}
                  className="h-24 w-full object-cover"
                  muted
                  playsInline
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={m.preview || m.url}
                  alt=""
                  className="h-24 w-full object-cover"
                />
              )}
              <span className="absolute inset-x-0 bottom-0 truncate bg-black/55 px-1.5 py-0.5 text-[10px] text-white">
                {MEDIA_CATEGORIES.find((c) => c.value === m.category)?.label ||
                  "Other"}
              </span>
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove file"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
