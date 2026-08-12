import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [propCount, activeCount, leadCount, viewCount, tenancyCount, rentCollected, openComplaints] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM properties WHERE owner_id = ${user.id}`,
      sql`SELECT COUNT(*)::int as count FROM properties WHERE owner_id = ${user.id} AND status = 'active'`,
      sql`SELECT COUNT(*)::int as count FROM leads l JOIN properties p ON l.property_id = p.id WHERE p.owner_id = ${user.id}`,
      sql`SELECT COALESCE(SUM(view_count), 0)::int as count FROM properties WHERE owner_id = ${user.id}`,
      sql`SELECT COUNT(*)::int as count FROM tenancies WHERE owner_id = ${user.id} AND status = 'active'`,
      sql`SELECT COALESCE(SUM(amount_paid), 0)::numeric as total FROM rent_payments WHERE owner_id = ${user.id} AND status = 'paid' AND payment_for_month >= date_trunc('month', NOW())`,
      sql`SELECT COUNT(*)::int as count FROM complaints WHERE against_property_owner = ${user.id} AND status NOT IN ('resolved', 'closed')`,
    ]);

    return NextResponse.json({
      totalProperties: propCount[0].count,
      activeListings: activeCount[0].count,
      totalLeads: leadCount[0].count,
      totalViews: viewCount[0].count,
      activeTenancies: tenancyCount[0].count,
      rentCollectedThisMonth: rentCollected[0].total,
      openComplaints: openComplaints[0].count,
    });
  } catch (err) {
    console.error('[owner-stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
