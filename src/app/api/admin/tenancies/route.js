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
    const status = searchParams.get('status');
    const propertyId = searchParams.get('propertyId');
    const tenantId = searchParams.get('tenantId');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];

    if (status) conditions.push(sql`t.status = ${status}`);
    if (propertyId) conditions.push(sql`t.property_id = ${propertyId}`);
    if (tenantId) conditions.push(sql`t.tenant_id = ${tenantId}`);
    if (q) conditions.push(sql`(p.title ILIKE ${'%' + q + '%'} OR ten.full_name ILIKE ${'%' + q + '%'} OR own.full_name ILIKE ${'%' + q + '%'})`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const tenancies = await sql`
      SELECT
        t.id, t.property_id, t.tenant_id, t.owner_id,
        t.lease_start_date, t.lease_end_date, t.monthly_rent,
        t.security_deposit, t.maintenance_charge, t.rent_due_day,
        t.lock_in_period_months, t.notice_period_days, t.annual_increment_percent,
        t.agreement_document_url, t.agreement_signed_at,
        t.status, t.move_in_date, t.move_out_date, t.created_at,
        p.title as property_title, p.slug as property_slug,
        ten.full_name as tenant_name, ten.phone as tenant_phone,
        own.full_name as owner_name, own.phone as owner_phone
      FROM tenancies t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN users ten ON t.tenant_id = ten.id
      LEFT JOIN users own ON t.owner_id = own.id
      WHERE ${where}
      ORDER BY t.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const countResult = await sql`
      SELECT COUNT(*)::int as total
      FROM tenancies t
      LEFT JOIN properties p ON t.property_id = p.id
      LEFT JOIN users ten ON t.tenant_id = ten.id
      LEFT JOIN users own ON t.owner_id = own.id
      WHERE ${where}
    `;

    return NextResponse.json({
      tenancies,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-tenancies/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      propertyId, tenantId, leaseStartDate, leaseEndDate,
      monthlyRent, securityDeposit, maintenanceCharge, rentDueDay,
      lockInPeriodMonths, noticePeriodDays, annualIncrementPercent,
      agreementDocumentUrl,
    } = body;

    if (!propertyId || !tenantId || !leaseStartDate || !leaseEndDate || !monthlyRent) {
      return NextResponse.json(
        { error: 'propertyId, tenantId, leaseStartDate, leaseEndDate, and monthlyRent are required' },
        { status: 400 }
      );
    }

    // Verify property exists and get owner
    const property = await sql`SELECT id, owner_id FROM properties WHERE id = ${propertyId}`;
    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Verify tenant exists with role=tenant
    const tenant = await sql`SELECT id FROM users WHERE id = ${tenantId} AND role = 'tenant'`;
    if (tenant.length === 0) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
    }

    // Check no overlapping active/upcoming tenancy on this property
    const overlap = await sql`
      SELECT id FROM tenancies
      WHERE property_id = ${propertyId}
        AND status IN ('active', 'upcoming')
        AND lease_start_date <= ${leaseEndDate}
        AND lease_end_date >= ${leaseStartDate}
    `;
    if (overlap.length > 0) {
      return NextResponse.json(
        { error: 'An active or upcoming tenancy already exists on this property for the given dates' },
        { status: 409 }
      );
    }

    const ownerId = property[0].owner_id;

    const result = await sql`
      INSERT INTO tenancies (
        property_id, tenant_id, owner_id,
        lease_start_date, lease_end_date, monthly_rent,
        security_deposit, maintenance_charge, rent_due_day,
        lock_in_period_months, notice_period_days, annual_increment_percent,
        agreement_document_url, managed_by
      ) VALUES (
        ${propertyId}, ${tenantId}, ${ownerId},
        ${leaseStartDate}, ${leaseEndDate}, ${monthlyRent},
        ${securityDeposit || null}, ${maintenanceCharge || 0}, ${rentDueDay || 1},
        ${lockInPeriodMonths || null}, ${noticePeriodDays || 30}, ${annualIncrementPercent || null},
        ${agreementDocumentUrl || null}, ${user.id}
      )
      RETURNING id
    `;

    // Insert security deposit record if provided
    if (securityDeposit) {
      await sql`
        INSERT INTO security_deposits (tenancy_id, tenant_id, owner_id, amount)
        VALUES (${result[0].id}, ${tenantId}, ${ownerId}, ${securityDeposit})
      `;
    }

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, 'create_tenancy', 'tenancy', ${result[0].id}, ${JSON.stringify({
        propertyId, tenantId, monthlyRent, leaseStartDate, leaseEndDate,
      })})
    `;

    return NextResponse.json({ tenancyId: result[0].id }, { status: 201 });
  } catch (err) {
    console.error('[admin-tenancies/POST]', err);
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
    const { tenancyId, status, moveInDate, moveOutDate, terminationReason, agreementDocumentUrl, agreementSignedAt } = body;

    if (!tenancyId) {
      return NextResponse.json({ error: 'tenancyId is required' }, { status: 400 });
    }

    const tenancy = await sql`SELECT id, status as old_status FROM tenancies WHERE id = ${tenancyId}`;
    if (tenancy.length === 0) {
      return NextResponse.json({ error: 'Tenancy not found' }, { status: 404 });
    }

    const updates = [];
    if (status) updates.push(sql`status = ${status}`);
    if (moveInDate) updates.push(sql`move_in_date = ${moveInDate}`);
    if (moveOutDate) updates.push(sql`move_out_date = ${moveOutDate}`);
    if (terminationReason) updates.push(sql`termination_reason = ${terminationReason}`);
    if (agreementDocumentUrl) updates.push(sql`agreement_document_url = ${agreementDocumentUrl}`);
    if (agreementSignedAt) updates.push(sql`agreement_signed_at = ${agreementSignedAt}`);
    if (status === 'terminated') updates.push(sql`terminated_by = ${user.id}`);

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));
    await sql`UPDATE tenancies SET ${setClause} WHERE id = ${tenancyId}`;

    // Log admin activity
    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${user.id}, 'update_tenancy', 'tenancy', ${tenancyId}, ${JSON.stringify({
        oldStatus: tenancy[0].old_status, newStatus: status, terminationReason,
      })})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-tenancies/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
