import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request, { params }) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { comment, mediaUrls } = body;

    if (!comment || !comment.trim()) {
      return NextResponse.json({ error: 'comment is required' }, { status: 400 });
    }

    // Verify complaint exists and user is a participant
    const complaint = await sql`
      SELECT id, raised_by, against_property_owner FROM complaints WHERE id = ${id}
    `;
    if (complaint.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const c = complaint[0];
    const isParticipant =
      user.role === 'admin' ||
      c.raised_by === user.id ||
      c.against_property_owner === user.id;

    if (!isParticipant) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const result = await sql`
      INSERT INTO complaint_comments (complaint_id, user_id, comment, media_urls)
      VALUES (${id}, ${user.id}, ${comment.trim()}, ${JSON.stringify(mediaUrls || [])})
      RETURNING id
    `;

    return NextResponse.json({ commentId: result[0].id }, { status: 201 });
  } catch (err) {
    console.error('[complaint-comments/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
