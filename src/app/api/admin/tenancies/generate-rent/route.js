import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { tenancyId } = body;

    // Auto-activate upcoming tenancies whose lease has started
    const activated = await sql`
      UPDATE tenancies
      SET status = 'active', move_in_date = COALESCE(move_in_date, lease_start_date)
      WHERE status = 'upcoming'
        AND lease_start_date <= CURRENT_DATE
      RETURNING id
    `;

    // Get active tenancies (optionally filtered by tenancyId)
    const conditions = [sql`t.status = 'active'`];
    if (tenancyId) conditions.push(sql`t.id = ${tenancyId}`);
    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const tenancies = await sql`
      SELECT id, tenant_id, owner_id, monthly_rent, rent_due_day,
             lease_start_date, lease_end_date
      FROM tenancies t
      WHERE ${where}
    `;

    let generated = 0;
    let overdueMarked = 0;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const t of tenancies) {
      const leaseStart = new Date(t.lease_start_date);
      const leaseEnd = new Date(t.lease_end_date);
      const startMonth = new Date(leaseStart.getFullYear(), leaseStart.getMonth(), 1);
      const endMonth = new Date(Math.min(leaseEnd.getTime(), currentMonth.getTime()));

      // Generate missing rent records from lease start to current month
      let month = new Date(startMonth);
      while (month <= endMonth) {
        const paymentForMonth = month.toISOString().slice(0, 10); // YYYY-MM-01
        const dueDay = Math.min(t.rent_due_day, 28);
        const dueDate = new Date(month.getFullYear(), month.getMonth(), dueDay);
        const dueDateStr = dueDate.toISOString().slice(0, 10);

        // Check if record already exists
        const existing = await sql`
          SELECT id FROM rent_payments
          WHERE tenancy_id = ${t.id} AND payment_for_month = ${paymentForMonth}
        `;

        if (existing.length === 0) {
          await sql`
            INSERT INTO rent_payments (
              tenancy_id, tenant_id, owner_id,
              payment_for_month, amount_due, due_date, status
            ) VALUES (
              ${t.id}, ${t.tenant_id}, ${t.owner_id},
              ${paymentForMonth}, ${t.monthly_rent}, ${dueDateStr}, 'pending'
            )
          `;
          generated++;
        }

        // Move to next month
        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      }
    }

    // Mark overdue payments
    const overdueResult = await sql`
      UPDATE rent_payments
      SET status = 'overdue'
      WHERE status = 'pending' AND due_date < CURRENT_DATE
      RETURNING id
    `;
    overdueMarked = overdueResult.length;

    return NextResponse.json({ generated, overdueMarked, activated: activated.length });
  } catch (err) {
    console.error('[generate-rent/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
