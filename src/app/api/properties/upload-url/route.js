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
const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const ALLOWED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;    // 5 MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024;  // 100 MB

export async function POST(request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "owner" && session.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
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
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    return Response.json(
      { error: "Only JPEG, PNG, WebP images and MP4, WebM, MOV videos are allowed" },
      { status: 400 }
    );
  }

  const maxSize = VIDEO_TYPES.includes(fileType) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (fileSize > maxSize) {
    const limit = VIDEO_TYPES.includes(fileType) ? "100MB" : "5MB";
    return Response.json(
      { error: `File size must not exceed ${limit}` },
      { status: 400 }
    );
  }

  const EXT_MAP = {
    "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp",
    "video/mp4": "mp4", "video/webm": "webm", "video/quicktime": "mov",
  };
  const ext = EXT_MAP[fileType] || "bin";
  const key = `properties/${session.id}/${randomUUID()}.${ext}`;
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
    console.error("Failed to generate upload URL:", error);
    return Response.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
