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

    const conditions = [sql`t.owner_id = ${user.id}`];
    if (propertyId) conditions.push(sql`t.property_id = ${propertyId}`);
    if (status) conditions.push(sql`t.status = ${status}`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const tenancies = await sql`
      SELECT
        t.id, t.property_id, t.tenant_id,
        t.lease_start_date, t.lease_end_date, t.monthly_rent,
        t.security_deposit, t.maintenance_charge, t.rent_due_day,
        t.lock_in_period_months, t.notice_period_days, t.annual_increment_percent,
        t.agreement_document_url, t.status, t.move_in_date, t.move_out_date, t.created_at,
        p.title as property_title, p.slug as property_slug,
        ten.full_name as tenant_name, ten.phone as tenant_phone
      FROM tenancies t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN users ten ON t.tenant_id = ten.id
      WHERE ${where}
      ORDER BY
        CASE t.status WHEN 'active' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END,
        t.created_at DESC
    `;

    return NextResponse.json({ tenancies });
  } catch (err) {
    console.error('[tenancies-property/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
