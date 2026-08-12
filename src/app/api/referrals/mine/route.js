import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// GET — list my referrals + my referral code
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure user has a referral code
    let referralCode = user.referral_code;
    if (!referralCode) {
      let code;
      let exists = true;
      while (exists) {
        code = generateCode();
        const check = await sql`SELECT id FROM users WHERE referral_code = ${code}`;
        exists = check.length > 0;
      }
      await sql`UPDATE users SET referral_code = ${code} WHERE id = ${user.id}`;
      referralCode = code;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const [referrals, countResult, summary] = await Promise.all([
      sql`
        SELECT
          r.id, r.referral_type, r.status, r.referred_phone,
          r.property_category, r.property_type, r.property_location, r.property_notes,
          r.owner_contact_number, r.reward_amount, r.rewarded_at, r.created_at,
          u.full_name as referred_user_name
        FROM referrals r
        LEFT JOIN users u ON r.referred_user_id = u.id
        WHERE r.referrer_id = ${user.id}
        ORDER BY r.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`SELECT COUNT(*)::int as total FROM referrals WHERE referrer_id = ${user.id}`,
      sql`
        SELECT
          COUNT(*)::int as total_referrals,
          COUNT(*) FILTER (WHERE status = 'rewarded')::int as rewarded_count,
          COALESCE(SUM(reward_amount) FILTER (WHERE status = 'rewarded'), 0)::numeric as total_earned
        FROM referrals
        WHERE referrer_id = ${user.id}
      `,
    ]);

    // Get wallet balance
    const wallet = await sql`SELECT balance FROM wallets WHERE user_id = ${user.id}`;

    return NextResponse.json({
      referralCode,
      referrals,
      total: countResult[0].total,
      page,
      limit,
      summary: {
        totalReferrals: summary[0].total_referrals,
        rewardedCount: summary[0].rewarded_count,
        totalEarned: summary[0].total_earned,
        walletBalance: wallet.length > 0 ? wallet[0].balance : 0,
      },
    });
  } catch (err) {
    console.error('[referrals-mine/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST — submit a new referral
export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referralType } = body;

    if (!referralType || !['friend', 'property'].includes(referralType)) {
      return NextResponse.json({ error: 'Invalid referral type' }, { status: 400 });
    }

    if (referralType === 'friend') {
      const { referredPhone } = body;
      if (!referredPhone) {
        return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
      }

      // Check not referring themselves
      if (referredPhone === user.phone || referredPhone === user.whatsapp_number) {
        return NextResponse.json({ error: 'You cannot refer yourself' }, { status: 400 });
      }

      // Check if already referred this phone
      const existing = await sql`
        SELECT id FROM referrals
        WHERE referrer_id = ${user.id} AND referred_phone = ${referredPhone}
      `;
      if (existing.length > 0) {
        return NextResponse.json({ error: 'You have already referred this number' }, { status: 400 });
      }

      // Check if this phone is already a registered user
      const existingUser = await sql`SELECT id FROM users WHERE phone = ${referredPhone}`;
      const referredUserId = existingUser.length > 0 ? existingUser[0].id : null;
      const status = referredUserId ? 'registered' : 'pending';

      const [referral] = await sql`
        INSERT INTO referrals (referrer_id, referral_type, referred_phone, referred_user_id, status)
        VALUES (${user.id}, 'friend', ${referredPhone}, ${referredUserId}, ${status})
        RETURNING id, status
      `;

      return NextResponse.json({ referral }, { status: 201 });
    }

    if (referralType === 'property') {
      const { propertyCategory, propertyType, ownerContactNumber, propertyLocation, propertyNotes } = body;
      if (!ownerContactNumber || !propertyLocation) {
        return NextResponse.json({ error: 'Owner contact and property location are required' }, { status: 400 });
      }

      const [referral] = await sql`
        INSERT INTO referrals (
          referrer_id, referral_type,
          property_category, property_type, owner_contact_number,
          property_location, property_notes
        ) VALUES (
          ${user.id}, 'property',
          ${propertyCategory || null}, ${propertyType || null}, ${ownerContactNumber},
          ${propertyLocation}, ${propertyNotes || null}
        )
        RETURNING id, status
      `;

      return NextResponse.json({ referral }, { status: 201 });
    }
  } catch (err) {
    console.error('[referrals-mine/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
