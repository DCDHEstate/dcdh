// Presigned uploads for property-referral photos and videos.
//
// Deliberately separate from /api/properties/upload-url: that endpoint is
// restricted to owners and admins, but *any* signed-in user can refer a
// property. Keys live under a `referrals/` prefix so referral media is easy to
// sweep separately from listing media.

import { S3Client } from "@aws-sdk/client-s3";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { getSessionFromRequest } from "@/lib/session";
import { randomUUID } from "crypto";

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
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB

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

  const { fileName, fileType, fileSize } = body;

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
  if (fileSize > maxSize) {
    return Response.json(
      { error: `File size must not exceed ${isVideo ? "100MB" : "5MB"}` },
      { status: 400 },
    );
  }

  const key = `referrals/${session.id}/${randomUUID()}.${EXT_MAP[fileType] || "bin"}`;
  const bucket = process.env.AWS_S3_BUCKET;

  try {
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

    return Response.json({ uploadUrl: url, uploadFields: fields, publicUrl });
  } catch (error) {
    console.error("[referrals/upload-url]", error);
    return Response.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
