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
    const cityId = searchParams.get('cityId');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];

    if (status) conditions.push(sql`p.status = ${status}`);
    if (cityId) conditions.push(sql`p.city_id = ${cityId}::uuid`);
    if (q) conditions.push(sql`(p.title ILIKE ${'%' + q + '%'} OR p.description ILIKE ${'%' + q + '%'})`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const properties = await sql`
      SELECT
        p.id, p.slug, p.title, p.category, p.transaction_type, p.property_type,
        p.price, p.status, p.bedrooms, p.area_sqft,
        p.created_at, p.view_count, p.inquiry_count,
        p.reviewed_by, p.reviewed_at, p.rejection_reason,
        u.full_name as owner_name, u.phone as owner_phone,
        c.name as city_name, l.name as locality_name,
        pm.media_url as primary_image
      FROM properties p
      JOIN users u ON u.id = p.owner_id
      JOIN cities c ON c.id = p.city_id
      JOIN localities l ON l.id = p.locality_id
      LEFT JOIN property_media pm ON pm.property_id = p.id AND pm.is_primary = true
      WHERE ${where}
      ORDER BY
        CASE p.status WHEN 'pending_approval' THEN 0 ELSE 1 END,
        p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total
      FROM properties p
      WHERE ${where}
    `;

    return NextResponse.json({
      properties,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-properties/GET]', err);
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
    const { propertyId, action, rejectionReason } = body;

    if (!propertyId || !action) {
      return NextResponse.json({ error: 'propertyId and action are required' }, { status: 400 });
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 });
    }

    // Verify property exists
    const property = await sql`SELECT id, status FROM properties WHERE id = ${propertyId}`;
    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    if (action === 'approve') {
      await sql`
        UPDATE properties
        SET status = 'active', reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;
    } else {
      if (!rejectionReason) {
        return NextResponse.json({ error: 'rejectionReason is required for rejection' }, { status: 400 });
      }
      await sql`
        UPDATE properties
        SET status = 'rejected', reviewed_by = ${user.id}, reviewed_at = NOW(), rejection_reason = ${rejectionReason}
        WHERE id = ${propertyId}
      `;
    }

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, ${action === 'approve' ? 'approve_property' : 'reject_property'}, 'property', ${propertyId}, ${JSON.stringify({ rejectionReason: rejectionReason || null })})
    `;

    return NextResponse.json({ success: true, action });
  } catch (err) {
    console.error('[admin-properties/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
