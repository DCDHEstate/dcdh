import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const leads = await sql`
      SELECT
        l.id, l.name, l.phone, l.email, l.message, l.status, l.source, l.created_at,
        p.title as property_title, p.slug as property_slug
      FROM leads l
      JOIN properties p ON l.property_id = p.id
      WHERE p.owner_id = ${user.id}
      ORDER BY l.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total
      FROM leads l
      JOIN properties p ON l.property_id = p.id
      WHERE p.owner_id = ${user.id}
    `;

    return NextResponse.json({
      leads,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[leads GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { propertyId, message } = body;

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check property exists
    const property = await sql`SELECT id, owner_id FROM properties WHERE id = ${propertyId} AND status = 'active'`;
    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Don't allow owner to inquire on own property
    if (property[0].owner_id === user.id) {
      return NextResponse.json({ error: 'Cannot inquire on your own property' }, { status: 400 });
    }

    const lead = await sql`
      INSERT INTO leads (property_id, user_id, name, phone, email, message, source)
      VALUES (
        ${propertyId},
        ${user.id},
        ${user.full_name || 'Unknown'},
        ${user.phone},
        ${user.email || null},
        ${message || null},
        'website_inquiry'
      )
      RETURNING id, status, created_at
    `;

    // Increment inquiry count
    await sql`UPDATE properties SET inquiry_count = inquiry_count + 1 WHERE id = ${propertyId}`;

    return NextResponse.json({ lead: lead[0] }, { status: 201 });
  } catch (err) {
    console.error('[leads POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
