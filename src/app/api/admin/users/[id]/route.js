import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request, { params }) {
  try {
    const admin = await getSessionFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;

    const [user] = await sql`
      SELECT
        id, phone, email, full_name, role, status,
        is_phone_verified, created_at, last_login_at,
        whatsapp_number
      FROM users
      WHERE id = ${id} AND role IN ('owner', 'tenant')
    `;

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Properties (owners)
    const properties = await sql`
      SELECT
        p.id, p.title, p.slug, p.status, p.transaction_type,
        p.category, p.price, p.created_at,
        c.name AS city_name, l.name AS locality_name,
        (SELECT COUNT(*)::int FROM leads WHERE property_id = p.id) AS lead_count
      FROM properties p
      LEFT JOIN cities c ON c.id = p.city_id
      LEFT JOIN localities l ON l.id = p.locality_id
      WHERE p.owner_id = ${id}
      ORDER BY p.created_at DESC
      LIMIT 20
    `;

    // Tenancies (as tenant)
    const tenanciesAsTenant = await sql`
      SELECT
        t.id, t.status, t.lease_start_date, t.lease_end_date,
        t.monthly_rent, t.security_deposit, t.created_at,
        p.title AS property_title, p.slug AS property_slug,
        own.full_name AS owner_name, own.phone AS owner_phone
      FROM tenancies t
      LEFT JOIN properties p ON p.id = t.property_id
      LEFT JOIN users own ON own.id = t.owner_id
      WHERE t.tenant_id = ${id}
      ORDER BY t.created_at DESC
      LIMIT 20
    `;

    // Tenancies (as owner)
    const tenanciesAsOwner = await sql`
      SELECT
        t.id, t.status, t.lease_start_date, t.lease_end_date,
        t.monthly_rent, t.security_deposit, t.created_at,
        p.title AS property_title, p.slug AS property_slug,
        ten.full_name AS tenant_name, ten.phone AS tenant_phone
      FROM tenancies t
      LEFT JOIN properties p ON p.id = t.property_id
      LEFT JOIN users ten ON ten.id = t.tenant_id
      WHERE t.owner_id = ${id}
      ORDER BY t.created_at DESC
      LIMIT 20
    `;

    // Leads submitted by this user
    const leads = await sql`
      SELECT
        l.id, l.name, l.phone, l.status, l.source, l.created_at,
        p.title AS property_title, p.slug AS property_slug
      FROM leads l
      LEFT JOIN properties p ON p.id = l.property_id
      WHERE l.phone = ${user.phone}
      ORDER BY l.created_at DESC
      LIMIT 20
    `;

    const [ownerProfile] = await sql`
      SELECT company_name, address, pincode FROM owner_profiles WHERE user_id = ${id}
    `;
    const [tenantProfile] = await sql`
      SELECT occupation, company_name FROM tenant_profiles WHERE user_id = ${id}
    `;

    return NextResponse.json({
      user,
      properties,
      tenanciesAsTenant,
      tenanciesAsOwner,
      leads,
      ownerProfile: ownerProfile || null,
      tenantProfile: tenantProfile || null,
    });
  } catch (err) {
    console.error('[admin-users/[id]/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const admin = await getSessionFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const body = await request.json();
    const {
      fullName, phone, email, whatsappNumber, role, status,
      // owner profile fields
      companyName, address, pincode,
      // tenant profile fields
      occupation, tenantCompanyName,
    } = body;

    const [target] = await sql`SELECT id, role FROM users WHERE id = ${id}`;
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (target.role === 'admin' && role !== 'admin') {
      return NextResponse.json({ error: 'Cannot demote admin accounts' }, { status: 400 });
    }

    // Phone uniqueness check (only if phone is being changed)
    if (phone) {
      const cleaned = phone.replace(/\D/g, '');
      if (cleaned.length !== 10) {
        return NextResponse.json({ error: 'Phone must be 10 digits' }, { status: 400 });
      }
      const conflict = await sql`SELECT id FROM users WHERE phone = ${cleaned} AND id != ${id}`;
      if (conflict.length > 0) {
        return NextResponse.json({ error: 'Phone number already in use by another user' }, { status: 409 });
      }
      await sql`
        UPDATE users SET
          phone = ${cleaned},
          full_name = ${fullName?.trim() || null},
          email = ${email?.trim() || null},
          whatsapp_number = ${whatsappNumber?.trim() || null},
          role = ${role || target.role},
          status = ${status || 'active'}
        WHERE id = ${id}
      `;
    } else {
      await sql`
        UPDATE users SET
          full_name = ${fullName?.trim() || null},
          email = ${email?.trim() || null},
          whatsapp_number = ${whatsappNumber?.trim() || null},
          role = ${role || target.role},
          status = ${status || 'active'}
        WHERE id = ${id}
      `;
    }

    const effectiveRole = role || target.role;

    if (effectiveRole === 'owner') {
      await sql`
        INSERT INTO owner_profiles (user_id, company_name, address, pincode)
        VALUES (${id}, ${companyName || null}, ${address || null}, ${pincode || null})
        ON CONFLICT (user_id) DO UPDATE SET
          company_name = EXCLUDED.company_name,
          address = EXCLUDED.address,
          pincode = EXCLUDED.pincode
      `;
    } else if (effectiveRole === 'tenant') {
      await sql`
        INSERT INTO tenant_profiles (user_id, occupation, company_name)
        VALUES (${id}, ${occupation || null}, ${tenantCompanyName || null})
        ON CONFLICT (user_id) DO UPDATE SET
          occupation = EXCLUDED.occupation,
          company_name = EXCLUDED.company_name
      `;
    }

    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${admin.id}, 'edit_user', 'user', ${id}, '{}')
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-users/[id]/PUT]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const admin = await getSessionFromRequest(request);
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (admin.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id } = await params;
    const { action } = await request.json();

    if (!['suspend', 'activate'].includes(action)) {
      return NextResponse.json({ error: 'action must be suspend or activate' }, { status: 400 });
    }

    const [target] = await sql`SELECT id, role FROM users WHERE id = ${id}`;
    if (!target) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (target.role === 'admin') {
      return NextResponse.json({ error: 'Cannot modify admin accounts' }, { status: 400 });
    }

    const newStatus = action === 'suspend' ? 'suspended' : 'active';
    await sql`UPDATE users SET status = ${newStatus} WHERE id = ${id}`;

    await sql`
      INSERT INTO admin_activity_log (admin_id, action, entity_type, entity_id, details)
      VALUES (${admin.id}, ${action === 'suspend' ? 'suspend_user' : 'activate_user'}, 'user', ${id}, '{}')
    `;

    return NextResponse.json({ success: true, newStatus });
  } catch (err) {
    console.error('[admin-users/[id]/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
