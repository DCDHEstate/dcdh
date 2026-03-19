import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [userCount, propertyCount, pendingCount, leadCount, tenancyCount, overdueCount, complaintCount] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM users WHERE role IN ('owner', 'tenant')`,
      sql`SELECT COUNT(*)::int as count FROM properties`,
      sql`SELECT COUNT(*)::int as count FROM properties WHERE status = 'pending_approval'`,
      sql`SELECT COUNT(*)::int as count FROM leads`,
      sql`SELECT COUNT(*)::int as count FROM tenancies WHERE status = 'active'`,
      sql`SELECT COUNT(*)::int as count FROM rent_payments WHERE status = 'overdue'`,
      sql`SELECT COUNT(*)::int as count FROM complaints WHERE status NOT IN ('resolved', 'closed')`,
    ]);

    return NextResponse.json({
      totalUsers: userCount[0].count,
      totalProperties: propertyCount[0].count,
      pendingApprovals: pendingCount[0].count,
      totalLeads: leadCount[0].count,
      activeTenancies: tenancyCount[0].count,
      overduePayments: overdueCount[0].count,
      openComplaints: complaintCount[0].count,
    });
  } catch (err) {
    console.error('[admin-stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
