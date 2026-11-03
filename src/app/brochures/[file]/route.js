import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PROJECTS } from "@/lib/projects";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Only brochures listed on a project page can be fetched — the bucket's
// brochures/ prefix is private, so this allowlist is the whole access rule.
const BROCHURE_FILES = new Set(
  PROJECTS.flatMap((project) => project.brochures.map((b) => b.file)),
);

export async function GET(request, { params }) {
  const { file } = await params;
  if (!BROCHURE_FILES.has(file)) {
    return new Response("Not found", { status: 404 });
  }

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: `brochures/${file}`,
  });
  const url = await getSignedUrl(s3, command, { expiresIn: 300 });

  return new Response(null, {
    status: 302,
    headers: { Location: url, "Cache-Control": "no-store" },
  });
}
