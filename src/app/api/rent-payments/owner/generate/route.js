import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner' && user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { tenancyId } = body;

    // Auto-activate upcoming tenancies whose lease has started
    const activated = await sql`
      UPDATE tenancies
      SET status = 'active', move_in_date = COALESCE(move_in_date, lease_start_date)
      WHERE status = 'upcoming'
        AND owner_id = ${user.id}
        AND lease_start_date <= CURRENT_DATE
      RETURNING id
    `;

    // Get active tenancies belonging to this owner
    const conditions = [sql`t.status = 'active'`, sql`t.owner_id = ${user.id}`];
    if (tenancyId) conditions.push(sql`t.id = ${tenancyId}`);
    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const tenancies = await sql`
      SELECT id, tenant_id, owner_id, monthly_rent, rent_due_day,
             lease_start_date, lease_end_date
      FROM tenancies t
      WHERE ${where}
    `;

    let generated = 0;
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    for (const t of tenancies) {
      const leaseStart = new Date(t.lease_start_date);
      const leaseEnd = new Date(t.lease_end_date);
      const startMonth = new Date(leaseStart.getFullYear(), leaseStart.getMonth(), 1);
      const endMonth = new Date(Math.min(leaseEnd.getTime(), currentMonth.getTime()));

      let month = new Date(startMonth);
      while (month <= endMonth) {
        const paymentForMonth = month.toISOString().slice(0, 10);
        const dueDay = Math.min(t.rent_due_day, 28);
        const dueDate = new Date(month.getFullYear(), month.getMonth(), dueDay);
        const dueDateStr = dueDate.toISOString().slice(0, 10);

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

        month = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      }
    }

    // Mark overdue — only for this owner's payments
    const overdueResult = await sql`
      UPDATE rent_payments
      SET status = 'overdue'
      WHERE owner_id = ${user.id}
        AND status = 'pending'
        AND due_date < CURRENT_DATE
      RETURNING id
    `;

    return NextResponse.json({ generated, overdueMarked: overdueResult.length, activated: activated.length });
  } catch (err) {
    console.error('[owner-generate-rent/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
