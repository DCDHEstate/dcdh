import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'tenant') {
      return NextResponse.json({ error: 'Only tenants can raise complaints' }, { status: 403 });
    }

    const body = await request.json();
    const { tenancyId, category, priority, title, description, mediaUrls } = body;

    if (!tenancyId || !category || !title || !description) {
      return NextResponse.json(
        { error: 'tenancyId, category, title, and description are required' },
        { status: 400 }
      );
    }

    // Verify tenancy belongs to this tenant and is active
    const tenancy = await sql`
      SELECT id, property_id, owner_id FROM tenancies
      WHERE id = ${tenancyId} AND tenant_id = ${user.id} AND status = 'active'
    `;
    if (tenancy.length === 0) {
      return NextResponse.json({ error: 'Active tenancy not found' }, { status: 404 });
    }

    const result = await sql`
      INSERT INTO complaints (
        tenancy_id, property_id, raised_by, against_property_owner,
        category, priority, title, description, media_urls
      ) VALUES (
        ${tenancyId}, ${tenancy[0].property_id}, ${user.id}, ${tenancy[0].owner_id},
        ${category}, ${priority || 'medium'}, ${title}, ${description},
        ${JSON.stringify(mediaUrls || [])}
      )
      RETURNING id
    `;

    return NextResponse.json({ complaintId: result[0].id }, { status: 201 });
  } catch (err) {
    console.error('[complaints/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const tenancyId = searchParams.get('tenancyId');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];

    // Role-based filtering
    if (user.role === 'tenant') {
      conditions.push(sql`c.raised_by = ${user.id}`);
    } else if (user.role === 'owner') {
      conditions.push(sql`c.against_property_owner = ${user.id}`);
    }
    // admin sees all

    if (status) conditions.push(sql`c.status = ${status}`);
    if (category) conditions.push(sql`c.category = ${category}`);
    if (priority) conditions.push(sql`c.priority = ${priority}`);
    if (tenancyId) conditions.push(sql`c.tenancy_id = ${tenancyId}`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const complaints = await sql`
      SELECT
        c.id, c.tenancy_id, c.property_id, c.category, c.priority,
        c.title, c.description, c.status, c.media_urls,
        c.satisfaction_rating, c.created_at, c.resolved_at,
        p.title as property_title,
        ten.full_name as tenant_name, ten.phone as tenant_phone,
        own.full_name as owner_name
      FROM complaints c
      LEFT JOIN properties p ON c.property_id = p.id
      LEFT JOIN users ten ON c.raised_by = ten.id
      LEFT JOIN users own ON c.against_property_owner = own.id
      WHERE ${where}
      ORDER BY
        CASE c.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
        c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total FROM complaints c WHERE ${where}
    `;

    return NextResponse.json({
      complaints,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[complaints/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
