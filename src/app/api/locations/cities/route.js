import sql from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const stateId = searchParams.get("state_id");

  if (!stateId) {
    return Response.json({ error: "state_id is required" }, { status: 400 });
  }

  try {
    const cities = await sql`
      SELECT id, name, slug
      FROM cities
      WHERE state_id = ${stateId}
        AND is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `;
    return Response.json({ cities });
  } catch (error) {
    console.error("Failed to fetch cities:", error);
    return Response.json({ error: "Failed to fetch cities" }, { status: 500 });
  }
}
