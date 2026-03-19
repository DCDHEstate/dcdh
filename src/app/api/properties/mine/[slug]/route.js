import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request, { params }) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { slug } = await params;

    const [property] = await sql`
      SELECT
        p.*,
        s.name AS state_name,
        c.name AS city_name,
        l.name AS locality_name
      FROM properties p
      JOIN states s ON s.id = p.state_id
      JOIN cities c ON c.id = p.city_id
      JOIN localities l ON l.id = p.locality_id
      WHERE p.slug = ${slug}
        AND p.owner_id = ${user.id}
    `;

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    const media = await sql`
      SELECT media_url, is_primary, sort_order
      FROM property_media
      WHERE property_id = ${property.id}
      ORDER BY is_primary DESC, sort_order ASC
    `;

    return NextResponse.json({ property: { ...property, media } });
  } catch (error) {
    console.error('Owner property detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
