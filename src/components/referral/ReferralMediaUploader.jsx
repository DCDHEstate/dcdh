"use client";

import { useEffect, useRef, useState } from "react";
import {
  MEDIA_CATEGORIES,
  isValidPhone,
  normalizePhone,
} from "@/lib/referralOptions";
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
 *
 * The parent owns the list (`media`, updated through `onChange` with a
 * functional update) and is told when uploads are in flight via
 * `onUploadingChange`, so it can hold Submit until they finish. Uploads need
 * the owner's phone number first: the server refuses to store files for a
 * number that can't be referred.
 */
export default function ReferralMediaUploader({
  media,
  onChange,
  onUploadingChange,
  ownerPhone,
  max = 30,
}) {
  const inputRef = useRef(null);
  const mountedRef = useRef(true);
  const [category, setCategory] = useState("exterior");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [notice, setNotice] = useState({ text: "", isError: false });

  const phone = normalizePhone(ownerPhone);
  const phoneReady = isValidPhone(phone);
  const remaining = max - media.length;

  // Uploads that finish after the form closed (or was reset) must not write
  // their files into whatever referral is being filled in next.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      // Closing the form mid-upload must not leave the parent's Submit held.
      onUploadingChange?.(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const handleFiles = async (fileList) => {
    setNotice({ text: "", isError: false });
    if (!fileList?.length || !phoneReady) return;

    const { accepted, rejected } = partitionAllowedFiles(fileList);
    const messages = rejected.length ? [rejectionMessage(rejected)] : [];

    const toUpload = accepted.slice(0, Math.max(0, remaining));
    if (accepted.length > toUpload.length) {
      messages.push(`Only ${max} files can be attached — extras were skipped.`);
    }

    if (toUpload.length === 0) {
      setNotice({ text: messages.join(" "), isError: true });
      return;
    }

    setUploading(true);
    setProgress({ done: 0, total: toUpload.length });
    let hadErrors = false;
    try {
      const { uploaded, errors } = await uploadReferralMedia(toUpload, {
        category,
        ownerPhone: phone,
        isCancelled: () => !mountedRef.current,
        onFileDone: () => {
          if (mountedRef.current) setProgress((p) => ({ ...p, done: p.done + 1 }));
        },
      });
      if (!mountedRef.current) return;

      if (errors.length) {
        hadErrors = true;
        messages.push(...errors);
      }
      onChange((prev) => [...prev, ...uploaded].slice(0, max));
    } catch {
      hadErrors = true;
      messages.push("Upload failed. Please try again.");
    } finally {
      if (mountedRef.current) {
        setUploading(false);
        setProgress({ done: 0, total: 0 });
        setNotice({ text: messages.join(" "), isError: hadErrors || rejected.length > 0 });
      }
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeFile = (uploadId) => {
    onChange((prev) => prev.filter((m) => m.uploadId !== uploadId));
  };

  const setFileCategory = (uploadId, value) => {
    onChange((prev) =>
      prev.map((m) => (m.uploadId === uploadId ? { ...m, category: value } : m)),
    );
  };

  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">
        Photos &amp; Videos
      </label>
      <p className="mb-3 text-xs text-muted">
        Exterior of the building plus each room helps the team assess the
        property without a visit. You can change a file&apos;s room after
        adding it.
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={!phoneReady}
          aria-label="Room for the next files"
          className="rounded-xl border border-border bg-surface-white px-3 py-2 text-sm text-body outline-none focus:border-accent disabled:opacity-50"
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
          disabled={!phoneReady || uploading || remaining <= 0}
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

      {!phoneReady && (
        <p className="mt-2 text-xs text-muted">
          Enter the owner&apos;s phone number above to add photos.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {notice.text && (
        <p className={`mt-2 text-xs ${notice.isError ? "text-red-600" : "text-amber-700"}`}>
          {notice.text}
        </p>
      )}

      {media.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {media.map((m) => (
            <div
              key={m.uploadId}
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
              <select
                value={m.category}
                onChange={(e) => setFileCategory(m.uploadId, e.target.value)}
                aria-label="Room shown in this file"
                className="w-full border-t border-border bg-surface-white px-1.5 py-1 text-[11px] text-body outline-none"
              >
                {MEDIA_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
              {/* Always visible on touch screens, which have no hover — that is
                  where most of these photos are taken. */}
              <button
                type="button"
                onClick={() => removeFile(m.uploadId)}
                aria-label="Remove file"
                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-base text-white transition focus:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
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
