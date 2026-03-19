import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getSessionFromRequest } from "@/lib/session";
import { randomUUID } from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

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
      { error: "Only JPEG, PNG, WebP images and PDF files are allowed" },
      { status: 400 }
    );
  }

  if (fileSize > MAX_FILE_SIZE) {
    return Response.json(
      { error: "File size must not exceed 10MB" },
      { status: 400 }
    );
  }

  const ext = fileType === "application/pdf" ? "pdf" : fileType.split("/")[1].replace("jpeg", "jpg");
  const key = `agreements/${session.id}/${randomUUID()}.${ext}`;
  const bucket = process.env.AWS_S3_BUCKET;

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const publicUrl = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return Response.json({ uploadUrl, publicUrl });
  } catch (error) {
    console.error("Failed to generate presigned URL:", error);
    return Response.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
