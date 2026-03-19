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

    const conditions = [sql`t.tenant_id = ${user.id}`];
    if (status) conditions.push(sql`t.status = ${status}`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const tenancies = await sql`
      SELECT
        t.id, t.property_id, t.owner_id,
        t.lease_start_date, t.lease_end_date, t.monthly_rent,
        t.security_deposit, t.maintenance_charge, t.rent_due_day,
        t.lock_in_period_months, t.notice_period_days, t.annual_increment_percent,
        t.agreement_document_url, t.agreement_signed_at,
        t.status, t.move_in_date, t.move_out_date, t.created_at,
        p.title as property_title, p.slug as property_slug,
        p.address_line1, p.bedrooms, p.bathrooms, p.furnishing,
        l.name as locality_name, c.name as city_name,
        own.full_name as owner_name, own.phone as owner_phone,
        (SELECT media_url FROM property_media pm WHERE pm.property_id = p.id AND pm.is_primary = true LIMIT 1) as primary_image
      FROM tenancies t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN localities l ON p.locality_id = l.id
      LEFT JOIN cities c ON p.city_id = c.id
      LEFT JOIN users own ON t.owner_id = own.id
      WHERE ${where}
      ORDER BY
        CASE t.status WHEN 'active' THEN 0 WHEN 'upcoming' THEN 1 ELSE 2 END,
        t.created_at DESC
    `;

    return NextResponse.json({ tenancies });
  } catch (err) {
    console.error('[tenancies-mine/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
