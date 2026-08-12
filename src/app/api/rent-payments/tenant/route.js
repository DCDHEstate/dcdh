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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`rp.tenant_id = ${user.id}`];
    if (status) conditions.push(sql`rp.status = ${status}`);
    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const [payments, countResult, summary] = await Promise.all([
      sql`
        SELECT
          rp.id, rp.payment_for_month, rp.amount_due, rp.amount_paid,
          rp.late_fee, rp.total_due, rp.status, rp.payment_method,
          rp.payment_date, rp.due_date, rp.notes,
          p.title as property_title
        FROM rent_payments rp
        LEFT JOIN tenancies t ON rp.tenancy_id = t.id
        LEFT JOIN properties p ON t.property_id = p.id
        WHERE ${where}
        ORDER BY rp.due_date DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`SELECT COUNT(*)::int as total FROM rent_payments rp WHERE ${where}`,
      sql`
        SELECT
          COALESCE(SUM(CASE WHEN status IN ('pending', 'overdue') THEN total_due ELSE 0 END), 0)::numeric as total_due,
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_paid ELSE 0 END), 0)::numeric as total_paid,
          COUNT(CASE WHEN status = 'overdue' THEN 1 END)::int as overdue_count
        FROM rent_payments
        WHERE tenant_id = ${user.id}
      `,
    ]);

    return NextResponse.json({
      payments,
      total: countResult[0].total,
      page,
      limit,
      summary: {
        totalDue: summary[0].total_due,
        totalPaid: summary[0].total_paid,
        overdueCount: summary[0].overdue_count,
      },
    });
  } catch (err) {
    console.error('[rent-payments-tenant/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
