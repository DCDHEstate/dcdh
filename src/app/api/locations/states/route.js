import sql from "@/lib/db";

export async function GET() {
  try {
    const states = await sql`
      SELECT id, name, code
      FROM states
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, name ASC
    `;
    return Response.json({ states });
  } catch (error) {
    console.error("Failed to fetch states:", error);
    return Response.json({ error: "Failed to fetch states" }, { status: 500 });
  }
}
