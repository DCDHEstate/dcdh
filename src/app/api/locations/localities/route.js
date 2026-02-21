import sql from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cityId = searchParams.get("city_id");

  if (!cityId) {
    return Response.json({ error: "city_id is required" }, { status: 400 });
  }

  try {
    const localities = await sql`
      SELECT id, name, slug, pincode
      FROM localities
      WHERE city_id = ${cityId}
        AND is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `;
    return Response.json({ localities });
  } catch (error) {
    console.error("Failed to fetch localities:", error);
    return Response.json({ error: "Failed to fetch localities" }, { status: 500 });
  }
}
