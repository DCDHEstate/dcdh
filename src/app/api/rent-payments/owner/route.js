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

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    const status = searchParams.get('status');
    const month = searchParams.get('month');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`rp.owner_id = ${user.id}`];
    if (propertyId) conditions.push(sql`t.property_id = ${propertyId}`);
    if (status) conditions.push(sql`rp.status = ${status}`);
    if (month) conditions.push(sql`rp.payment_for_month = ${month}`);
    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const [payments, countResult, summary] = await Promise.all([
      sql`
        SELECT
          rp.id, rp.payment_for_month, rp.amount_due, rp.electricity_charge,
          rp.amount_paid, rp.late_fee, rp.total_due, rp.status, rp.payment_method,
          rp.payment_date, rp.due_date, rp.notes, rp.transaction_reference,
          p.title as property_title,
          ten.full_name as tenant_name, ten.phone as tenant_phone
        FROM rent_payments rp
        LEFT JOIN tenancies t ON rp.tenancy_id = t.id
        LEFT JOIN properties p ON t.property_id = p.id
        LEFT JOIN users ten ON rp.tenant_id = ten.id
        WHERE ${where}
        ORDER BY rp.due_date DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*)::int as total
        FROM rent_payments rp
        LEFT JOIN tenancies t ON rp.tenancy_id = t.id
        WHERE ${where}
      `,
      sql`
        SELECT
          COALESCE(SUM(CASE WHEN status = 'paid' THEN amount_paid ELSE 0 END), 0)::numeric as total_collected,
          COALESCE(SUM(CASE WHEN status = 'pending' THEN total_due ELSE 0 END), 0)::numeric as total_pending,
          COALESCE(SUM(CASE WHEN status = 'overdue' THEN total_due ELSE 0 END), 0)::numeric as total_overdue
        FROM rent_payments
        WHERE owner_id = ${user.id}
      `,
    ]);

    return NextResponse.json({
      payments,
      total: countResult[0].total,
      page,
      limit,
      summary: {
        totalCollected: summary[0].total_collected,
        totalPending: summary[0].total_pending,
        totalOverdue: summary[0].total_overdue,
      },
    });
  } catch (err) {
    console.error('[rent-payments-owner/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { paymentId, status, amountPaid, paymentMethod, transactionReference, notes, lateFee, electricityCharge } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
    }

    // Verify the payment belongs to this owner
    const payment = await sql`
      SELECT id, status as old_status FROM rent_payments
      WHERE id = ${paymentId} AND owner_id = ${user.id}
    `;
    if (payment.length === 0) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const updates = [];
    if (status) updates.push(sql`status = ${status}`);
    if (amountPaid !== undefined) updates.push(sql`amount_paid = ${amountPaid}`);
    if (paymentMethod) updates.push(sql`payment_method = ${paymentMethod}`);
    if (transactionReference) updates.push(sql`transaction_reference = ${transactionReference}`);
    if (notes !== undefined) updates.push(sql`notes = ${notes}`);
    if (lateFee !== undefined) updates.push(sql`late_fee = ${lateFee}`);
    if (electricityCharge !== undefined) updates.push(sql`electricity_charge = ${electricityCharge}`);
    if (status === 'paid' || status === 'partially_paid') {
      updates.push(sql`payment_date = NOW()`);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));
    await sql`UPDATE rent_payments SET ${setClause} WHERE id = ${paymentId} AND owner_id = ${user.id}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[rent-payments-owner/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
