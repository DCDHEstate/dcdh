import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)));
    const offset = (page - 1) * limit;

    const properties = await sql`
      SELECT
        p.id, p.slug, p.title, p.category, p.transaction_type, p.property_type,
        p.status, p.price, p.bedrooms, p.bathrooms, p.area_sqft, p.furnishing,
        p.created_at, p.view_count,
        c.name as city_name, l.name as locality_name,
        pm.media_url as primary_image,
        sp.created_at as saved_at
      FROM saved_properties sp
      JOIN properties p ON p.id = sp.property_id
      JOIN cities c ON c.id = p.city_id
      JOIN localities l ON l.id = p.locality_id
      LEFT JOIN property_media pm ON pm.property_id = p.id AND pm.is_primary = true
      WHERE sp.user_id = ${user.id}
      ORDER BY sp.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total FROM saved_properties WHERE user_id = ${user.id}
    `;

    return NextResponse.json({
      properties,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[properties/saved]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
