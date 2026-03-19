import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';

// GET — list all referrals with filters
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const q = searchParams.get('q');
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const conditions = [sql`1=1`];
    if (status) conditions.push(sql`r.status = ${status}`);
    if (type) conditions.push(sql`r.referral_type = ${type}`);
    if (q) conditions.push(sql`(
      u.full_name ILIKE ${'%' + q + '%'} OR
      r.referred_phone ILIKE ${'%' + q + '%'} OR
      r.property_location ILIKE ${'%' + q + '%'} OR
      r.owner_contact_number ILIKE ${'%' + q + '%'}
    )`);

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const [referrals, countResult] = await Promise.all([
      sql`
        SELECT
          r.*,
          u.full_name as referrer_name, u.phone as referrer_phone,
          ru.full_name as referred_user_name
        FROM referrals r
        JOIN users u ON r.referrer_id = u.id
        LEFT JOIN users ru ON r.referred_user_id = ru.id
        WHERE ${where}
        ORDER BY
          CASE r.status WHEN 'pending' THEN 0 WHEN 'registered' THEN 1 WHEN 'deal_closed' THEN 2 ELSE 3 END,
          r.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`
        SELECT COUNT(*)::int as total
        FROM referrals r
        JOIN users u ON r.referrer_id = u.id
        WHERE ${where}
      `,
    ]);

    return NextResponse.json({
      referrals,
      total: countResult[0].total,
      page,
      limit,
    });
  } catch (err) {
    console.error('[admin-referrals/GET]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — update referral status / trigger reward
export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { referralId, status, rewardAmount, linkedPropertyId, referredUserId } = body;

    if (!referralId) {
      return NextResponse.json({ error: 'referralId is required' }, { status: 400 });
    }

    const [referral] = await sql`SELECT * FROM referrals WHERE id = ${referralId}`;
    if (!referral) {
      return NextResponse.json({ error: 'Referral not found' }, { status: 404 });
    }

    const updates = [];
    if (status) updates.push(sql`status = ${status}`);
    if (referredUserId) updates.push(sql`referred_user_id = ${referredUserId}`);
    if (linkedPropertyId) updates.push(sql`linked_property_id = ${linkedPropertyId}`);

    // If rewarding, credit the wallet
    if (status === 'rewarded' && rewardAmount && rewardAmount > 0) {
      updates.push(sql`reward_amount = ${rewardAmount}`);
      updates.push(sql`rewarded_at = NOW()`);

      // Ensure wallet exists
      let wallet = await sql`SELECT id, balance FROM wallets WHERE user_id = ${referral.referrer_id}`;
      if (wallet.length === 0) {
        wallet = await sql`
          INSERT INTO wallets (user_id, balance) VALUES (${referral.referrer_id}, 0)
          RETURNING id, balance
        `;
      }

      const newBalance = Number(wallet[0].balance) + Number(rewardAmount);

      await sql`UPDATE wallets SET balance = ${newBalance} WHERE id = ${wallet[0].id}`;
      await sql`
        INSERT INTO wallet_transactions (wallet_id, transaction_type, amount, reason, description, reference_id, balance_after)
        VALUES (
          ${wallet[0].id}, 'credit', ${rewardAmount}, 'referral_reward',
          ${`Reward for ${referral.referral_type} referral`},
          ${referralId}, ${newBalance}
        )
      `;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No updates provided' }, { status: 400 });
    }

    const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : sql`${acc}, ${u}`));
    await sql`UPDATE referrals SET ${setClause} WHERE id = ${referralId}`;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-referrals/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
