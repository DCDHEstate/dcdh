import { NextResponse } from "next/server";
import sql from "@/lib/db";
import { getSessionFromRequest } from "@/lib/session";

// Public GET — browse/search properties
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const transactionType = searchParams.get("transactionType");
    const propertyType = searchParams.get("propertyType");
    const cityId = searchParams.get("cityId");
    const localityId = searchParams.get("localityId");
    const bedroomsParam = searchParams.get("bedrooms");
    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const furnishing = searchParams.get("furnishing");
    const sort = searchParams.get("sort") || "newest";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));
    const offset = (page - 1) * limit;
    const q = searchParams.get("q");

    const conditions = [sql`p.status = 'active'`];

    if (category) conditions.push(sql`p.category = ${category}`);
    if (transactionType) conditions.push(sql`p.transaction_type = ${transactionType}`);
    if (propertyType) conditions.push(sql`p.property_type = ${propertyType}`);
    if (cityId) conditions.push(sql`p.city_id = ${cityId}::uuid`);
    if (localityId) conditions.push(sql`p.locality_id = ${localityId}::uuid`);
    if (bedroomsParam) conditions.push(sql`p.bedrooms = ${parseInt(bedroomsParam, 10)}`);
    if (priceMin) conditions.push(sql`p.price >= ${parseFloat(priceMin)}`);
    if (priceMax) conditions.push(sql`p.price <= ${parseFloat(priceMax)}`);
    if (furnishing) conditions.push(sql`p.furnishing = ${furnishing}`);
    if (q) conditions.push(sql`(p.title ILIKE ${"%" + q + "%"} OR p.description ILIKE ${"%" + q + "%"})`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const orderBy =
      sort === "price_asc" ? sql`p.price ASC` :
      sort === "price_desc" ? sql`p.price DESC` :
      sort === "popular" ? sql`p.view_count DESC` :
      sql`p.created_at DESC`;

    const properties = await sql`
      SELECT
        p.id, p.slug, p.title, p.category, p.transaction_type, p.property_type,
        p.price, p.bedrooms, p.bathrooms, p.area_sqft, p.furnishing,
        p.created_at, p.view_count,
        c.name as city_name, l.name as locality_name,
        pm.media_url as primary_image
      FROM properties p
      JOIN cities c ON c.id = p.city_id
      JOIN localities l ON l.id = p.locality_id
      LEFT JOIN property_media pm ON pm.property_id = p.id AND pm.is_primary = true
      WHERE ${where}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total FROM properties p WHERE ${where}
    `;

    return NextResponse.json({
      properties,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error("[properties/GET]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function generateSlug(title, cityName) {
  const base = slugify(`${title}-${cityName}`);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function POST(request) {
  const session = await getSessionFromRequest(request);
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.role !== "owner" && session.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const {
    title,
    category,
    transactionType,
    propertyType,
    bedrooms,
    bathrooms,
    balconies,
    furnishing,
    floorNumber,
    totalFloors,
    parkingSlots,
    ageOfProperty,
    possessionStatus,
    stateId,
    cityId,
    localityId,
    addressLine1,
    addressLine2,
    pincode,
    googleMapsUrl,
    description,
    areaSqft,
    carpetAreaSqft,
    facing,
    availableFrom,
    amenities,
    price,
    rentDeposit,
    securityDeposit,
    maintenanceCharge,
    priceNegotiable,
    mediaUrls,
  } = body;

  // Required field validation
  if (!title || !category || !transactionType || !propertyType || !price) {
    return Response.json(
      { error: "title, category, transactionType, propertyType, and price are required" },
      { status: 400 }
    );
  }
  if (!stateId || !cityId || !localityId || !addressLine1) {
    return Response.json(
      { error: "stateId, cityId, localityId, and addressLine1 are required" },
      { status: 400 }
    );
  }

  // Fetch city name for slug generation
  const [city] = await sql`SELECT name FROM cities WHERE id = ${cityId}`;
  if (!city) {
    return Response.json({ error: "Invalid cityId" }, { status: 400 });
  }

  const slug = generateSlug(title, city.name);

  try {
    const [property] = await sql`
      INSERT INTO properties (
        owner_id,
        slug,
        category,
        transaction_type,
        property_type,
        status,
        title,
        description,
        price,
        price_negotiable,
        rent_deposit,
        security_deposit,
        maintenance_charge,
        area_sqft,
        carpet_area_sqft,
        bedrooms,
        bathrooms,
        balconies,
        floor_number,
        total_floors,
        facing,
        age_of_property,
        furnishing,
        parking_slots,
        address_line1,
        address_line2,
        locality_id,
        city_id,
        state_id,
        pincode,
        google_maps_url,
        amenities,
        available_from,
        possession_status
      )
      VALUES (
        ${session.id},
        ${slug},
        ${category},
        ${transactionType},
        ${propertyType},
        'pending_approval',
        ${title},
        ${description || null},
        ${price},
        ${priceNegotiable ?? false},
        ${rentDeposit || null},
        ${securityDeposit || null},
        ${maintenanceCharge || null},
        ${areaSqft || null},
        ${carpetAreaSqft || null},
        ${bedrooms || null},
        ${bathrooms || null},
        ${balconies || null},
        ${floorNumber || null},
        ${totalFloors || null},
        ${facing || null},
        ${ageOfProperty || null},
        ${furnishing || null},
        ${parkingSlots ?? 0},
        ${addressLine1},
        ${addressLine2 || null},
        ${localityId},
        ${cityId},
        ${stateId},
        ${pincode || null},
        ${googleMapsUrl || null},
        ${JSON.stringify(amenities || [])},
        ${availableFrom || null},
        ${possessionStatus || null}
      )
      RETURNING id, slug
    `;

    // Insert media records if any
    if (mediaUrls && mediaUrls.length > 0) {
      const mediaInserts = mediaUrls.map((m, index) => ({
        property_id: property.id,
        media_url: m.url,
        media_type: "image",
        sort_order: index,
        is_primary: m.isPrimary ?? index === 0,
      }));

      for (const media of mediaInserts) {
        await sql`
          INSERT INTO property_media (property_id, media_url, media_type, sort_order, is_primary)
          VALUES (${media.property_id}, ${media.media_url}, ${media.media_type}, ${media.sort_order}, ${media.is_primary})
        `;
      }
    }

    return Response.json(
      { propertyId: property.id, slug: property.slug },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create property:", error);
    return Response.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
