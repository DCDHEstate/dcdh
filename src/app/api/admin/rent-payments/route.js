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

    const { searchParams } = new URL(request.url);
    const tenancyId = searchParams.get('tenancyId');
    const status = searchParams.get('status');
    const ownerId = searchParams.get('ownerId');
    const tenantId = searchParams.get('tenantId');
    const month = searchParams.get('month'); // YYYY-MM-01
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];
    if (tenancyId) conditions.push(sql`rp.tenancy_id = ${tenancyId}`);
    if (status) conditions.push(sql`rp.status = ${status}`);
    if (ownerId) conditions.push(sql`rp.owner_id = ${ownerId}`);
    if (tenantId) conditions.push(sql`rp.tenant_id = ${tenantId}`);
    if (month) conditions.push(sql`rp.payment_for_month = ${month}`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const payments = await sql`
      SELECT
        rp.id, rp.tenancy_id, rp.tenant_id, rp.owner_id,
        rp.payment_for_month, rp.amount_due, rp.electricity_charge, rp.amount_paid, rp.late_fee, rp.total_due,
        rp.status, rp.payment_method, rp.payment_date, rp.transaction_reference,
        rp.due_date, rp.notes, rp.created_at,
        p.title as property_title,
        ten.full_name as tenant_name, ten.phone as tenant_phone,
        own.full_name as owner_name
      FROM rent_payments rp
      LEFT JOIN tenancies t ON rp.tenancy_id = t.id
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN users ten ON rp.tenant_id = ten.id
      LEFT JOIN users own ON rp.owner_id = own.id
      WHERE ${where}
      ORDER BY rp.due_date DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total FROM rent_payments rp WHERE ${where}
    `;

    return NextResponse.json({
      payments,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-rent-payments/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { paymentId, status, amountPaid, paymentMethod, transactionReference, notes, lateFee, electricityCharge } = body;

    if (!paymentId) {
      return NextResponse.json({ error: 'paymentId is required' }, { status: 400 });
    }

    const payment = await sql`SELECT id, status as old_status FROM rent_payments WHERE id = ${paymentId}`;
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
    await sql`UPDATE rent_payments SET ${setClause} WHERE id = ${paymentId}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-rent-payments/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
