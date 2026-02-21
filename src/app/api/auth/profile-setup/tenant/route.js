import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'tenant') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const rows = await sql`
      SELECT
        u.full_name, u.phone, u.whatsapp_number,
        tp.occupation, tp.company_name,
        tp.preferred_property_type, tp.preferred_bhk,
        tp.preferred_budget_min, tp.preferred_budget_max,
        tp.family_size, tp.has_pets
      FROM users u
      LEFT JOIN tenant_profiles tp ON tp.user_id = u.id
      WHERE u.id = ${user.id}
    `;

    const row = rows[0];
    return NextResponse.json({
      fullName: row.full_name || '',
      phone: row.phone || '',
      whatsappNumber: row.whatsapp_number || '',
      occupation: row.occupation || '',
      companyName: row.company_name || '',
      preferredPropertyType: row.preferred_property_type || '',
      preferredBhk: row.preferred_bhk ? String(row.preferred_bhk) : '',
      budgetMin: row.preferred_budget_min ? String(row.preferred_budget_min) : '',
      budgetMax: row.preferred_budget_max ? String(row.preferred_budget_max) : '',
      familySize: row.family_size ? String(row.family_size) : '',
      hasPets: row.has_pets ?? false,
    });
  } catch (err) {
    console.error('[profile-setup/tenant GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'tenant') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      fullName,
      whatsappNumber,
      occupation,
      companyName,
      preferredPropertyType,
      preferredBhk,
      budgetMin,
      budgetMax,
      familySize,
      hasPets,
    } = body;

    if (!fullName?.trim()) {
      return NextResponse.json({ error: 'Full name is required' }, { status: 400 });
    }

    // Update user record
    await sql`
      UPDATE users
      SET full_name = ${fullName.trim()},
          whatsapp_number = ${whatsappNumber || null}
      WHERE id = ${user.id}
    `;

    // Upsert tenant profile
    await sql`
      INSERT INTO tenant_profiles (user_id, occupation, company_name, preferred_property_type, preferred_bhk, preferred_budget_min, preferred_budget_max, family_size, has_pets)
      VALUES (
        ${user.id},
        ${occupation || null},
        ${companyName || null},
        ${preferredPropertyType || null},
        ${preferredBhk ? Number(preferredBhk) : null},
        ${budgetMin ? Number(budgetMin) : null},
        ${budgetMax ? Number(budgetMax) : null},
        ${familySize ? Number(familySize) : null},
        ${hasPets ?? false}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        occupation = EXCLUDED.occupation,
        company_name = EXCLUDED.company_name,
        preferred_property_type = EXCLUDED.preferred_property_type,
        preferred_bhk = EXCLUDED.preferred_bhk,
        preferred_budget_min = EXCLUDED.preferred_budget_min,
        preferred_budget_max = EXCLUDED.preferred_budget_max,
        family_size = EXCLUDED.family_size,
        has_pets = EXCLUDED.has_pets
    `;

    return NextResponse.json({
      message: 'Profile saved',
      redirectTo: '/dashboard/tenant',
    });
  } catch (err) {
    console.error('[profile-setup/tenant]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
