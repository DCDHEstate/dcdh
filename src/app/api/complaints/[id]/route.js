import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request, { params }) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const complaint = await sql`
      SELECT
        c.*,
        p.title as property_title, p.slug as property_slug,
        ten.full_name as tenant_name, ten.phone as tenant_phone,
        own.full_name as owner_name, own.phone as owner_phone,
        resolver.full_name as resolved_by_name
      FROM complaints c
      LEFT JOIN properties p ON c.property_id = p.id
      LEFT JOIN users ten ON c.raised_by = ten.id
      LEFT JOIN users own ON c.against_property_owner = own.id
      LEFT JOIN users resolver ON c.resolved_by = resolver.id
      WHERE c.id = ${id}
    `;

    if (complaint.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const c = complaint[0];

    // Access check
    if (user.role === 'tenant' && c.raised_by !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (user.role === 'owner' && c.against_property_owner !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const comments = await sql`
      SELECT
        cc.id, cc.comment, cc.media_urls, cc.created_at,
        u.full_name as user_name, u.role as user_role
      FROM complaint_comments cc
      LEFT JOIN users u ON cc.user_id = u.id
      WHERE cc.complaint_id = ${id}
      ORDER BY cc.created_at ASC
    `;

    return NextResponse.json({ complaint: c, comments });
  } catch (err) {
    console.error('[complaint-detail/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, assignedTo, resolutionNotes, satisfactionRating } = body;

    const complaint = await sql`SELECT id, raised_by, against_property_owner, status as old_status FROM complaints WHERE id = ${id}`;
    if (complaint.length === 0) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const oldStatus = complaint[0].old_status;

    // Tenant: can rate satisfaction OR reopen a resolved complaint
    if (user.role === 'tenant') {
      if (complaint[0].raised_by !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      if (satisfactionRating) {
        await sql`UPDATE complaints SET satisfaction_rating = ${satisfactionRating} WHERE id = ${id}`;
        return NextResponse.json({ success: true });
      }
      if (status === 'reopened' && (oldStatus === 'resolved' || oldStatus === 'closed')) {
        await sql`UPDATE complaints SET status = 'reopened', resolved_at = NULL, resolved_by = NULL, satisfaction_rating = NULL WHERE id = ${id}`;
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Owner: can acknowledge or mark in_progress on their own complaints
    if (user.role === 'owner') {
      if (complaint[0].against_property_owner !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
      const ownerAllowedStatuses = ['acknowledged', 'in_progress'];
      if (status && ownerAllowedStatuses.includes(status)) {
        const updates = [sql`status = ${status}`];
        if (resolutionNotes) updates.push(sql`resolution_notes = ${resolutionNotes}`);
        const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));
        await sql`UPDATE complaints SET ${setClause} WHERE id = ${id}`;
        return NextResponse.json({ success: true });
      }
      return NextResponse.json({ error: 'Owners can only acknowledge or mark complaints in progress' }, { status: 403 });
    }

    // Admin can update status, assign, resolve
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updates = [];
    if (status) updates.push(sql`status = ${status}`);
    if (assignedTo) updates.push(sql`assigned_to = ${assignedTo}`);
    if (resolutionNotes) updates.push(sql`resolution_notes = ${resolutionNotes}`);
    if (status === 'resolved') {
      updates.push(sql`resolved_at = NOW()`);
      updates.push(sql`resolved_by = ${user.id}`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));
    await sql`UPDATE complaints SET ${setClause} WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[complaint-detail/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
