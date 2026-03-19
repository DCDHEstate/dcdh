import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'tenant') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [savedCount, inquiryCount, tenancyCount, nextRent, openComplaints] = await Promise.all([
      sql`SELECT COUNT(*)::int as count FROM saved_properties WHERE user_id = ${user.id}`,
      sql`SELECT COUNT(*)::int as count FROM leads WHERE tenant_id = ${user.id}`,
      sql`SELECT COUNT(*)::int as count FROM tenancies WHERE tenant_id = ${user.id} AND status = 'active'`,
      sql`SELECT amount_due, due_date, status FROM rent_payments WHERE tenant_id = ${user.id} AND status IN ('pending', 'overdue') ORDER BY due_date ASC LIMIT 1`,
      sql`SELECT COUNT(*)::int as count FROM complaints WHERE raised_by = ${user.id} AND status NOT IN ('resolved', 'closed')`,
    ]);

    return NextResponse.json({
      savedProperties: savedCount[0].count,
      totalInquiries: inquiryCount[0].count,
      activeTenancy: tenancyCount[0].count,
      nextRentDue: nextRent.length > 0 ? { amount: nextRent[0].amount_due, dueDate: nextRent[0].due_date, status: nextRent[0].status } : null,
      openComplaints: openComplaints[0].count,
    });
  } catch (err) {
    console.error('[tenant-stats]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
