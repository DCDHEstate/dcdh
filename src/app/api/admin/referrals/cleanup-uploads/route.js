// Sweeps abandoned referral uploads: files that were uploaded to S3 but never
// attached to a submitted referral (the form was abandoned, or files were
// removed before submitting). There is no scheduler in this project, so an
// admin runs it from the referrals page; it's safe to run at any time.

import { NextResponse } from 'next/server';
import { S3Client, DeleteObjectsCommand } from '@aws-sdk/client-s3';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Long enough that nobody is still filling in the form that uploaded them.
const ABANDONED_AFTER = '24 hours';
const S3_BATCH = 1000; // DeleteObjects limit
const MAX_PER_RUN = 5000;

async function requireAdmin(request) {
  const user = await getSessionFromRequest(request);
  return user?.role === 'admin' ? user : null;
}

// GET — how much is waiting to be cleaned up
export async function GET(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  const [row] = await sql`
    SELECT COUNT(*)::int AS files, COALESCE(SUM(file_size), 0)::bigint AS bytes
    FROM referral_uploads
    WHERE referral_id IS NULL AND created_at < NOW() - ${ABANDONED_AFTER}::interval
  `;
  return NextResponse.json({ files: row.files, bytes: Number(row.bytes) });
}

// POST — delete abandoned files: ledger rows first, then the S3 objects
export async function POST(request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    // Rows are removed from the ledger *before* touching S3. The DELETE takes
    // row locks and re-checks `referral_id IS NULL`, so it can't race a
    // referral submission: either the submission claimed the file first (and
    // the row is skipped here), or the row is gone and that submission is told
    // to re-upload. Deleting from S3 first could remove a file a referral had
    // just attached.
    const claimed = await sql`
      DELETE FROM referral_uploads
      WHERE id IN (
        SELECT id FROM referral_uploads
        WHERE referral_id IS NULL AND created_at < NOW() - ${ABANDONED_AFTER}::interval
        ORDER BY created_at
        LIMIT ${MAX_PER_RUN}
      )
      AND referral_id IS NULL
      RETURNING id, user_id, s3_key, public_url, media_type, file_name, file_size, created_at
    `;

    let deleted = 0;
    const failedRows = [];
    for (let i = 0; i < claimed.length; i += S3_BATCH) {
      const batch = claimed.slice(i, i + S3_BATCH);
      try {
        const result = await s3.send(
          new DeleteObjectsCommand({
            Bucket: process.env.AWS_S3_BUCKET,
            Delete: { Objects: batch.map((u) => ({ Key: u.s3_key })), Quiet: false },
          }),
        );
        // A key that was never uploaded (the presign went unused) also comes
        // back as deleted, which is what we want.
        const errored = new Set((result.Errors ?? []).map((e) => e.Key));
        deleted += batch.length - errored.size;
        failedRows.push(...batch.filter((u) => errored.has(u.s3_key)));
      } catch (s3Err) {
        console.error('[cleanup-uploads] S3 batch failed', s3Err);
        failedRows.push(...batch);
      }
    }

    // Put back anything S3 didn't delete, so it's retried on the next run
    // instead of becoming an untracked file.
    if (failedRows.length > 0) {
      await sql`
        INSERT INTO referral_uploads ${sql(
          failedRows,
          'id', 'user_id', 's3_key', 'public_url', 'media_type', 'file_name', 'file_size', 'created_at',
        )}
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return NextResponse.json({
      deleted,
      failed: failedRows.length,
      more: claimed.length === MAX_PER_RUN,
    });
  } catch (err) {
    console.error('[admin-referrals/cleanup-uploads]', err);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
