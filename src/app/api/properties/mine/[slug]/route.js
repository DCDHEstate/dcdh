import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function PATCH(request, { params }) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { slug } = await params;

    const [existing] = await sql`
      SELECT id FROM properties WHERE slug = ${slug} AND owner_id = ${user.id}
    `;
    if (!existing) return NextResponse.json({ error: 'Property not found' }, { status: 404 });

    let body;
    try { body = await request.json(); } catch { return NextResponse.json({ error: 'Invalid body' }, { status: 400 }); }

    const {
      title, category, transactionType, propertyType,
      bedrooms, bathrooms, balconies, furnishing,
      floorNumber, totalFloors, parkingSlots, ageOfProperty, possessionStatus,
      stateId, cityId, localityId, addressLine1, addressLine2, pincode, googleMapsUrl,
      description, areaSqft, carpetAreaSqft, facing, availableFrom, amenities,
      price, rentDeposit, securityDeposit, maintenanceCharge, priceNegotiable,
      mediaUrls,
    } = body;

    if (!title || !category || !transactionType || !propertyType || !price) {
      return NextResponse.json({ error: 'title, category, transactionType, propertyType, and price are required' }, { status: 400 });
    }
    if (!stateId || !cityId || !localityId || !addressLine1) {
      return NextResponse.json({ error: 'stateId, cityId, localityId, and addressLine1 are required' }, { status: 400 });
    }

    await sql`
      UPDATE properties SET
        title = ${title},
        category = ${category},
        transaction_type = ${transactionType},
        property_type = ${propertyType},
        bedrooms = ${bedrooms || null},
        bathrooms = ${bathrooms || null},
        balconies = ${balconies || null},
        furnishing = ${furnishing || null},
        floor_number = ${floorNumber || null},
        total_floors = ${totalFloors || null},
        parking_slots = ${parkingSlots ?? 0},
        age_of_property = ${ageOfProperty || null},
        possession_status = ${possessionStatus || null},
        state_id = ${stateId},
        city_id = ${cityId},
        locality_id = ${localityId},
        address_line1 = ${addressLine1},
        address_line2 = ${addressLine2 || null},
        pincode = ${pincode || null},
        google_maps_url = ${googleMapsUrl || null},
        description = ${description || null},
        area_sqft = ${areaSqft || null},
        carpet_area_sqft = ${carpetAreaSqft || null},
        facing = ${facing || null},
        available_from = ${availableFrom || null},
        amenities = ${JSON.stringify(amenities || [])},
        price = ${price},
        rent_deposit = ${rentDeposit || null},
        security_deposit = ${securityDeposit || null},
        maintenance_charge = ${maintenanceCharge || null},
        price_negotiable = ${priceNegotiable ?? false},
        status = 'pending_approval',
        updated_at = NOW()
      WHERE id = ${existing.id}
    `;

    if (mediaUrls) {
      await sql`DELETE FROM property_media WHERE property_id = ${existing.id}`;
      for (const [index, m] of mediaUrls.entries()) {
        await sql`
          INSERT INTO property_media (property_id, media_url, media_type, sort_order, is_primary)
          VALUES (${existing.id}, ${m.url}, ${m.mediaType || 'image'}, ${index}, ${m.isPrimary ?? index === 0})
        `;
      }
    }

    return NextResponse.json({ slug });
  } catch (error) {
    console.error('Owner property update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      SELECT media_url, is_primary, sort_order, media_type
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
