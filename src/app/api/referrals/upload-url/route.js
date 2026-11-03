// Presigned uploads for property-referral photos and videos.
//
// Deliberately separate from /api/properties/upload-url: that endpoint is
// restricted to owners and admins, but *any* signed-in user can refer a
// property. Keys live under a `referrals/` prefix so referral media is easy to
// sweep separately from listing media.
//
// Every presign is recorded in `referral_uploads`. That ledger is what a
// referral submission attaches from — the client never supplies a URL — and it
// is also what the per-user rate limit counts and the abandoned-upload cleanup
// sweeps.

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { randomUUID } from "crypto";
import sql from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";
import { checkReferablePhone } from "@/lib/referral";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
// MP4 only, matching the listing uploader — .mov containers routinely carry
// HEVC, which uploads fine and then won't decode in Chrome or Firefox.
const VIDEO_TYPES = ["video/mp4"];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB (the client compresses photos to fit)
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB

// A referral holds at most 30 files, so these leave room for retries and a
// couple of referrals in a sitting while stopping anyone from using the bucket
// as free storage.
const MAX_UPLOADS_PER_HOUR = 60;
const MAX_UPLOADS_PER_DAY = 200;

const EXT_MAP = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
};

export async function POST(request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { fileName, fileType, fileSize, ownerPhone } = body;

  if (!fileName || !fileType || !fileSize) {
    return Response.json(
      { error: "fileName, fileType, and fileSize are required" },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP images and MP4 videos are allowed" },
      { status: 400 },
    );
  }

  const isVideo = VIDEO_TYPES.includes(fileType);
  const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (!(Number(fileSize) > 0) || Number(fileSize) > maxSize) {
    return Response.json(
      { error: `${fileName} is too large — ${isVideo ? "videos" : "photos"} must be under ${isVideo ? "100MB" : "5MB"}` },
      { status: 400 },
    );
  }

  try {
    // Refuse uploads for a number the referral would be rejected for anyway,
    // so a duplicate never leaves orphaned files behind.
    const phoneCheck = await checkReferablePhone(session, ownerPhone, {
      label: "owner",
      forProperty: true,
    });
    if (!phoneCheck.ok) {
      return Response.json({ error: phoneCheck.error }, { status: phoneCheck.status });
    }

    const [usage] = await sql`
      SELECT
        COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour')::int AS last_hour,
        COUNT(*)::int AS last_day
      FROM referral_uploads
      WHERE user_id = ${session.id} AND created_at > NOW() - INTERVAL '1 day'
    `;
    if (usage.last_hour >= MAX_UPLOADS_PER_HOUR || usage.last_day >= MAX_UPLOADS_PER_DAY) {
      return Response.json(
        { error: "Upload limit reached. Please try again later." },
        { status: 429 },
      );
    }

    const key = `referrals/${session.id}/${randomUUID()}.${EXT_MAP[fileType]}`;
    const bucket = process.env.AWS_S3_BUCKET;

    const { url, fields } = await createPresignedPost(s3, {
      Bucket: bucket,
      Key: key,
      Conditions: [
        ["content-length-range", 1, maxSize],
        ["eq", "$Content-Type", fileType],
      ],
      Fields: { "Content-Type": fileType },
      Expires: 300,
    });

    const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    const [upload] = await sql`
      INSERT INTO referral_uploads (user_id, s3_key, public_url, media_type, file_name, file_size)
      VALUES (
        ${session.id}, ${key}, ${publicUrl}, ${isVideo ? "video" : "image"},
        ${String(fileName).slice(0, 255)}, ${Number(fileSize)}
      )
      RETURNING id
    `;

    return Response.json({
      uploadId: upload.id,
      uploadUrl: url,
      uploadFields: fields,
      publicUrl,
    });
  } catch (error) {
    console.error("[referrals/upload-url]", error);
    return Response.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
