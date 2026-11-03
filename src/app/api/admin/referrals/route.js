import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import {
  isValidReferralStatus,
  isValidReferralType,
  REFERRAL_TYPE_LABELS,
  MAX_REWARD_AMOUNT,
} from '@/lib/referralOptions';
import { creditWallet, parseAmount } from '@/lib/wallet';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ILIKE treats % and _ as wildcards; a search for "50%" should match literally.
const likePattern = (q) => `%${q.replace(/[\\%_]/g, '\\$&')}%`;

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
    const q = searchParams.get('q')?.trim();
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    if (status && !isValidReferralStatus(status)) {
      return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
    }
    if (type && !isValidReferralType(type)) {
      return NextResponse.json({ error: 'Invalid type filter' }, { status: 400 });
    }

    const conditions = [sql`1=1`];
    if (status) conditions.push(sql`r.status = ${status}`);
    if (type) conditions.push(sql`r.referral_type = ${type}`);
    if (q) {
      const pattern = likePattern(q);
      conditions.push(sql`(
        u.full_name ILIKE ${pattern} OR
        u.phone ILIKE ${pattern} OR
        r.referred_name ILIKE ${pattern} OR
        r.referred_phone ILIKE ${pattern} OR
        r.owner_name ILIKE ${pattern} OR
        r.owner_contact_number ILIKE ${pattern} OR
        r.property_location ILIKE ${pattern}
      )`);
    }

    const where = conditions.reduce((acc, cond, i) => (i === 0 ? cond : sql`${acc} AND ${cond}`));

    const [referrals, countResult] = await Promise.all([
      sql`
        SELECT
          r.*,
          u.full_name AS referrer_name, u.phone AS referrer_phone,
          ru.full_name AS referred_user_name,
          -- A person referral submitted for someone who already had an account
          -- gets no credit under current rules; older rows like this are left
          -- for an admin to review, so flag them.
          (r.referral_type = 'friend' AND ru.created_at < r.created_at - INTERVAL '1 hour')
            AS referred_was_member,
          COALESCE(
            (SELECT json_agg(json_build_object(
                'id', m.id, 'url', m.media_url, 'mediaType', m.media_type,
                'category', m.category, 'fileName', m.file_name
              ) ORDER BY m.sort_order, m.created_at)
             FROM referral_media m WHERE m.referral_id = r.id),
            '[]'::json
          ) AS media
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
        SELECT COUNT(*)::int AS total
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

const reply = (status, error) => ({ status, error });

// PATCH — update status / notes, or reward (credits the referrer's wallet)
export async function PATCH(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json().catch(() => null);
    const { referralId, status, rewardAmount, linkedPropertyId, referredUserId, adminNotes } = body ?? {};

    if (!UUID_RE.test(referralId ?? '')) {
      return NextResponse.json({ error: 'referralId is required' }, { status: 400 });
    }
    if (status !== undefined && !isValidReferralStatus(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    if (referredUserId !== undefined && !UUID_RE.test(referredUserId)) {
      return NextResponse.json({ error: 'Invalid referredUserId' }, { status: 400 });
    }
    if (linkedPropertyId !== undefined && !UUID_RE.test(linkedPropertyId)) {
      return NextResponse.json({ error: 'Invalid linkedPropertyId' }, { status: 400 });
    }
    if (adminNotes !== undefined && typeof adminNotes !== 'string') {
      return NextResponse.json({ error: 'Invalid notes' }, { status: 400 });
    }

    // Rewarding is the only way into 'rewarded', and it always pays.
    let amount = null;
    if (status === 'rewarded') {
      amount = parseAmount(rewardAmount);
      if (!amount) {
        return NextResponse.json(
          { error: `Enter a reward between ₹1 and ₹${MAX_REWARD_AMOUNT.toLocaleString('en-IN')}` },
          { status: 400 },
        );
      }
    }

    const outcome = await sql.begin(async (tx) => {
      // Row lock: a second tab, a second admin or a retried request waits here
      // and then sees the referral already rewarded.
      const [referral] = await tx`SELECT * FROM referrals WHERE id = ${referralId} FOR UPDATE`;
      if (!referral) return reply(404, 'Referral not found');

      const touchesStatus = status !== undefined || referredUserId !== undefined || linkedPropertyId !== undefined;
      if (referral.status === 'rewarded' && touchesStatus) {
        return reply(409, 'This referral has already been rewarded and can no longer be changed.');
      }

      const updates = [];
      if (status !== undefined) updates.push(tx`status = ${status}`);
      if (referredUserId !== undefined) updates.push(tx`referred_user_id = ${referredUserId}`);
      if (linkedPropertyId !== undefined) updates.push(tx`linked_property_id = ${linkedPropertyId}`);
      // Sent as '' to clear a note, so check for presence rather than truthiness.
      if (adminNotes !== undefined) {
        updates.push(tx`admin_notes = ${adminNotes.trim().slice(0, 5000) || null}`);
      }

      if (status === 'rewarded') {
        const subject =
          referral.referral_type === 'property'
            ? referral.owner_name
            : referral.referred_name;
        await creditWallet(tx, {
          userId: referral.referrer_id,
          amount,
          reason: 'referral_reward',
          description: [REFERRAL_TYPE_LABELS[referral.referral_type] || 'Referral', subject]
            .filter(Boolean)
            .join(' — '),
          referenceId: referral.id,
        });
        updates.push(tx`reward_amount = ${amount}`);
        updates.push(tx`rewarded_at = NOW()`);
      }

      if (updates.length === 0) return reply(400, 'No updates provided');

      const setClause = updates.reduce((acc, u, i) => (i === 0 ? u : tx`${acc}, ${u}`));
      await tx`UPDATE referrals SET ${setClause} WHERE id = ${referralId}`;
      return { status: 200 };
    });

    if (outcome.error) {
      return NextResponse.json({ error: outcome.error }, { status: outcome.status });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    // Backstops from migration 008 — a race that got past the row lock.
    if (err?.code === '23505') {
      const message =
        err.constraint_name === 'uq_referrals_referred_user'
          ? 'That user is already credited to another referral.'
          : 'This referral has already been rewarded.';
      return NextResponse.json({ error: message }, { status: 409 });
    }
    console.error('[admin-referrals/PATCH]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
