import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const source = searchParams.get('source');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];

    if (status) conditions.push(sql`l.status = ${status}`);
    if (source) conditions.push(sql`l.source = ${source}`);
    if (q) conditions.push(sql`(l.name ILIKE ${'%' + q + '%'} OR l.phone ILIKE ${'%' + q + '%'} OR p.title ILIKE ${'%' + q + '%'})`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const leads = await sql`
      SELECT
        l.id, l.name, l.phone, l.email, l.message, l.status, l.source,
        l.created_at, l.assigned_to, l.last_contacted_at, l.notes,
        p.title as property_title, p.slug as property_slug,
        o.full_name as owner_name, o.phone as owner_phone
      FROM leads l
      LEFT JOIN properties p ON l.property_id = p.id
      LEFT JOIN users o ON p.owner_id = o.id
      WHERE ${where}
      ORDER BY l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total
      FROM leads l
      LEFT JOIN properties p ON l.property_id = p.id
      WHERE ${where}
    `;

    return NextResponse.json({
      leads,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-leads/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { leadId, status, assignedTo, notes } = body;

    if (!leadId) {
      return NextResponse.json({ error: 'leadId is required' }, { status: 400 });
    }

    // Verify lead exists
    const lead = await sql`SELECT id, status as old_status FROM leads WHERE id = ${leadId}`;
    if (lead.length === 0) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const updates = [];
    if (status) updates.push(sql`status = ${status}`);
    if (assignedTo) updates.push(sql`assigned_to = ${assignedTo}, assigned_at = NOW()`);
    if (notes !== undefined) updates.push(sql`notes = ${notes}`);

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));

    await sql`UPDATE leads SET ${setClause} WHERE id = ${leadId}`;

    // Log status change to lead_activities if status changed
    if (status) {
      await sql`
        INSERT INTO lead_activities (lead_id, performed_by, old_status, new_status, note)
        VALUES (${leadId}, ${user.id}, ${lead[0].old_status}, ${status}, ${notes || null})
      `;
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-leads/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
