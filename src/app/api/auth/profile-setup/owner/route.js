import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'owner') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const rows = await sql`
      SELECT
        u.full_name, u.phone, u.whatsapp_number,
        op.company_name, op.address, op.pincode,
        op.preferred_payout_method, op.upi_id,
        op.bank_account_name, op.bank_account_number, op.bank_ifsc_code, op.bank_name
      FROM users u
      LEFT JOIN owner_profiles op ON op.user_id = u.id
      WHERE u.id = ${user.id}
    `;

    const row = rows[0];
    return NextResponse.json({
      fullName: row.full_name || '',
      phone: row.phone || '',
      whatsappNumber: row.whatsapp_number || '',
      companyName: row.company_name || '',
      address: row.address || '',
      pincode: row.pincode || '',
      preferredPayoutMethod: row.preferred_payout_method || 'upi',
      upiId: row.upi_id || '',
      bankAccountName: row.bank_account_name || '',
      bankAccountNumber: row.bank_account_number || '',
      bankIfscCode: row.bank_ifsc_code || '',
      bankName: row.bank_name || '',
    });
  } catch (err) {
    console.error('[profile-setup/owner GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const {
      fullName,
      whatsappNumber,
      companyName,
      address,
      pincode,
      propertyCategories,
      preferredPayoutMethod,
      upiId,
      bankAccountName,
      bankAccountNumber,
      bankIfscCode,
      bankName,
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

    // Upsert owner profile
    await sql`
      INSERT INTO owner_profiles (user_id, company_name, address, pincode, preferred_payout_method, upi_id, bank_account_name, bank_account_number, bank_ifsc_code, bank_name)
      VALUES (
        ${user.id},
        ${companyName || null},
        ${address || null},
        ${pincode || null},
        ${preferredPayoutMethod || null},
        ${upiId || null},
        ${bankAccountName || null},
        ${bankAccountNumber || null},
        ${bankIfscCode || null},
        ${bankName || null}
      )
      ON CONFLICT (user_id) DO UPDATE SET
        company_name = EXCLUDED.company_name,
        address = EXCLUDED.address,
        pincode = EXCLUDED.pincode,
        preferred_payout_method = EXCLUDED.preferred_payout_method,
        upi_id = EXCLUDED.upi_id,
        bank_account_name = EXCLUDED.bank_account_name,
        bank_account_number = EXCLUDED.bank_account_number,
        bank_ifsc_code = EXCLUDED.bank_ifsc_code,
        bank_name = EXCLUDED.bank_name
    `;

    return NextResponse.json({
      message: 'Profile saved',
      redirectTo: '/dashboard/owner',
    });
  } catch (err) {
    console.error('[profile-setup/owner]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
