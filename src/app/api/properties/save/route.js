import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ saved: false, unauthenticated: true });

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    if (!propertyId) return NextResponse.json({ saved: false });

    const rows = await sql`
      SELECT id FROM saved_properties WHERE user_id = ${user.id} AND property_id = ${propertyId}
    `;
    return NextResponse.json({ saved: rows.length > 0 });
  } catch (err) {
    console.error('[properties/save/GET]', err);
    return NextResponse.json({ saved: false });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { propertyId } = await request.json();
    if (!propertyId) return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });

    const [property] = await sql`SELECT id FROM properties WHERE id = ${propertyId}`;
    if (!property) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    const [existing] = await sql`
      SELECT id FROM saved_properties WHERE user_id = ${user.id} AND property_id = ${propertyId}
    `;

    if (existing) {
      await sql`DELETE FROM saved_properties WHERE user_id = ${user.id} AND property_id = ${propertyId}`;
      return NextResponse.json({ saved: false });
    }

    await sql`INSERT INTO saved_properties (user_id, property_id) VALUES (${user.id}, ${propertyId})`;
    return NextResponse.json({ saved: true });
  } catch (err) {
    console.error('[properties/save/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
