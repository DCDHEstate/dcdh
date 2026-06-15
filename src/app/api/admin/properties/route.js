import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

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
        p.sold_out_date, p.sold_to_user_id,
        u.full_name  AS owner_name,
        u.phone      AS owner_phone,
        c.name       AS city_name,
        l.name       AS locality_name,
        pm.media_url AS primary_image,
        buyer.full_name AS buyer_name,
        buyer.phone     AS buyer_phone
      FROM properties p
      JOIN users      u  ON u.id  = p.owner_id
      JOIN cities     c  ON c.id  = p.city_id
      JOIN localities l  ON l.id  = p.locality_id
      LEFT JOIN property_media pm ON pm.property_id = p.id AND pm.is_primary = true
      LEFT JOIN users buyer ON buyer.id = p.sold_to_user_id
      WHERE ${where}
      ORDER BY
        CASE p.status WHEN 'pending_approval' THEN 0 ELSE 1 END,
        p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const [{ total }] = await sql`
      SELECT COUNT(*)::int AS total FROM properties p WHERE ${where}
    `;

    return NextResponse.json({ properties, total, page, limit });
  } catch (err) {
    console.error('[admin-properties/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { propertyId, action, rejectionReason, soldOutDate, buyerPhone } = body;

    if (!propertyId || !action) {
      return NextResponse.json({ error: 'propertyId and action are required' }, { status: 400 });
    }

    const VALID_ACTIONS = ['approve', 'reject', 'deactivate', 'reactivate', 'mark_sold_out', 'archive', 'toggle_featured'];
    if (!VALID_ACTIONS.includes(action)) {
      return NextResponse.json({ error: `action must be one of: ${VALID_ACTIONS.join(', ')}` }, { status: 400 });
    }

    const [property] = await sql`SELECT id, status FROM properties WHERE id = ${propertyId}`;
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    let logAction = action;

    if (action === 'approve') {
      await sql`
        UPDATE properties
        SET status = 'active', reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;

    } else if (action === 'reject') {
      if (!rejectionReason?.trim()) {
        return NextResponse.json({ error: 'rejectionReason is required for rejection' }, { status: 400 });
      }
      await sql`
        UPDATE properties
        SET status = 'rejected', reviewed_by = ${user.id}, reviewed_at = NOW(),
            rejection_reason = ${rejectionReason}
        WHERE id = ${propertyId}
      `;

    } else if (action === 'deactivate') {
      await sql`
        UPDATE properties
        SET status = 'inactive', reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;

    } else if (action === 'reactivate') {
      await sql`
        UPDATE properties
        SET status = 'active', reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;

    } else if (action === 'mark_sold_out') {
      if (!soldOutDate) {
        return NextResponse.json({ error: 'soldOutDate is required for mark_sold_out' }, { status: 400 });
      }

      let soldToUserId = null;
      if (buyerPhone?.trim()) {
        const [buyer] = await sql`SELECT id FROM users WHERE phone = ${buyerPhone.trim()}`;
        if (!buyer) {
          return NextResponse.json({ error: 'No user found with that phone number' }, { status: 404 });
        }
        soldToUserId = buyer.id;
      }

      await sql`
        UPDATE properties
        SET status = 'sold_out', sold_out_date = ${soldOutDate}, sold_to_user_id = ${soldToUserId},
            reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;

    } else if (action === 'archive') {
      await sql`
        UPDATE properties
        SET status = 'archived', reviewed_by = ${user.id}, reviewed_at = NOW()
        WHERE id = ${propertyId}
      `;

    } else if (action === 'toggle_featured') {
      await sql`
        UPDATE properties
        SET is_featured = NOT is_featured
        WHERE id = ${propertyId}
      `;
    }

    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (
        ${user.id}, ${logAction}, 'property', ${propertyId},
        ${JSON.stringify({ rejectionReason: rejectionReason || null, soldOutDate: soldOutDate || null })}
      )
    `;

    return NextResponse.json({ success: true, action });
  } catch (err) {
    console.error('[admin-properties/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
