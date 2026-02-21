import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { propertyId } = await request.json();

    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Check if property exists
    const property = await sql`SELECT id FROM properties WHERE id = ${propertyId}`;
    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check if already saved
    const existing = await sql`
      SELECT id FROM saved_properties WHERE user_id = ${user.id} AND property_id = ${propertyId}
    `;

    if (existing.length > 0) {
      // Unsave
      await sql`DELETE FROM saved_properties WHERE user_id = ${user.id} AND property_id = ${propertyId}`;
      return NextResponse.json({ saved: false, message: 'Property unsaved' });
    }

    // Save
    await sql`INSERT INTO saved_properties (user_id, property_id) VALUES (${user.id}, ${propertyId})`;
    return NextResponse.json({ saved: true, message: 'Property saved' });
  } catch (err) {
    console.error('[properties/save]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
