import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import {
  ensureReferralCode,
  referralLink,
  isValidPurpose,
  isValidMediaCategory,
  findReferralClaim,
} from '@/lib/referral';

const MAX_MEDIA_PER_REFERRAL = 30;

/**
 * A phone number can only be referred once. Whether the earlier claim was the
 * caller's own or someone else's changes the wording — but not the outcome, so
 * neither can be submitted twice.
 *
 * The "another user" message stays deliberately vague: naming the earlier
 * referrer would leak who is talking to whom.
 */
function duplicateMessage(claim, userId, label) {
  if (claim.referrer_id === userId) {
    return `You have already submitted a referral for this ${label}'s number.`;
  }
  return `This number has already been referred by another user, so it can't be submitted again. If you think this is a mistake, please contact our team.`;
}

// GET — my referral code + link, my referrals, and my earnings summary
export async function GET(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const referralCode = await ensureReferralCode(user.id, user.referral_code);

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    const [referrals, countResult, summary, wallet, referredBy] = await Promise.all([
      sql`
        SELECT
          r.id, r.referral_type, r.status, r.purpose,
          r.referred_name, r.referred_phone,
          r.property_category, r.property_type, r.property_location, r.property_notes,
          r.owner_name, r.owner_contact_number,
          r.reward_amount, r.rewarded_at, r.created_at,
          u.full_name AS referred_user_name,
          COALESCE(
            (SELECT json_agg(json_build_object(
                'id', m.id, 'url', m.media_url, 'mediaType', m.media_type,
                'category', m.category
              ) ORDER BY m.sort_order, m.created_at)
             FROM referral_media m WHERE m.referral_id = r.id),
            '[]'::json
          ) AS media
        FROM referrals r
        LEFT JOIN users u ON r.referred_user_id = u.id
        WHERE r.referrer_id = ${user.id}
        ORDER BY r.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `,
      sql`SELECT COUNT(*)::int AS total FROM referrals WHERE referrer_id = ${user.id}`,
      sql`
        SELECT
          COUNT(*)::int AS total_referrals,
          COUNT(*) FILTER (WHERE status = 'rewarded')::int AS rewarded_count,
          COALESCE(SUM(reward_amount) FILTER (WHERE status = 'rewarded'), 0)::numeric AS total_earned
        FROM referrals
        WHERE referrer_id = ${user.id}
      `,
      sql`SELECT balance FROM wallets WHERE user_id = ${user.id}`,
      sql`
        SELECT ref.full_name, u.referred_by_code
        FROM users u
        LEFT JOIN users ref ON ref.id = u.referred_by_user_id
        WHERE u.id = ${user.id}
      `,
    ]);

    return NextResponse.json({
      referralCode,
      referralLink: referralLink(referralCode),
      referredBy: referredBy[0]?.referred_by_code
        ? { name: referredBy[0].full_name, code: referredBy[0].referred_by_code }
        : null,
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

// POST — submit a person ('friend') or property referral
export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { referralType } = body;

    if (!['friend', 'property'].includes(referralType)) {
      return NextResponse.json({ error: 'Invalid referral type' }, { status: 400 });
    }

    const purpose = body.purpose;
    if (!isValidPurpose(purpose)) {
      return NextResponse.json({ error: 'Select a valid purpose' }, { status: 400 });
    }

    // ── Person referral ─────────────────────────────────────────────────────
    if (referralType === 'friend') {
      const referredName = body.referredName?.trim();
      const referredPhone = normalizePhone(body.referredPhone);

      if (!referredName) {
        return NextResponse.json({ error: 'Client name is required' }, { status: 400 });
      }
      if (!isValidPhone(referredPhone)) {
        return NextResponse.json({ error: 'Enter a valid phone number' }, { status: 400 });
      }
      if (isSameNumber(referredPhone, user.phone) || isSameNumber(referredPhone, user.whatsapp_number)) {
        return NextResponse.json({ error: 'You cannot refer yourself' }, { status: 400 });
      }

      const claim = await findReferralClaim(referredPhone);
      if (claim) {
        return NextResponse.json(
          { error: duplicateMessage(claim, user.id, 'client') },
          { status: 409 },
        );
      }

      // If they're already on the platform, the referral starts at 'registered'
      // so admins don't chase a signup that already happened.
      const [existingUser] = await sql`SELECT id FROM users WHERE phone = ${referredPhone}`;

      const [referral] = await sql`
        INSERT INTO referrals (
          referrer_id, referral_type, purpose,
          referred_name, referred_phone, referred_user_id, status
        ) VALUES (
          ${user.id}, 'friend', ${purpose},
          ${referredName}, ${referredPhone}, ${existingUser?.id ?? null},
          ${existingUser ? 'registered' : 'pending'}
        )
        RETURNING id, status
      `;

      return NextResponse.json({ referral }, { status: 201 });
    }

    // ── Property referral ───────────────────────────────────────────────────
    const ownerName = body.ownerName?.trim();
    const ownerContactNumber = normalizePhone(body.ownerContactNumber);
    const media = Array.isArray(body.media) ? body.media : [];

    if (!ownerName) {
      return NextResponse.json({ error: "Owner's name is required" }, { status: 400 });
    }
    if (!isValidPhone(ownerContactNumber)) {
      return NextResponse.json({ error: "Enter a valid owner's phone number" }, { status: 400 });
    }
    if (isSameNumber(ownerContactNumber, user.phone) || isSameNumber(ownerContactNumber, user.whatsapp_number)) {
      return NextResponse.json({ error: 'You cannot refer yourself' }, { status: 400 });
    }

    // Checked before the media rows go in, so a rejected duplicate never leaves
    // uploaded files pointing at a referral that was never created.
    const ownerClaim = await findReferralClaim(ownerContactNumber);
    if (ownerClaim) {
      return NextResponse.json(
        { error: duplicateMessage(ownerClaim, user.id, 'owner') },
        { status: 409 },
      );
    }

    if (media.length > MAX_MEDIA_PER_REFERRAL) {
      return NextResponse.json(
        { error: `Attach at most ${MAX_MEDIA_PER_REFERRAL} files` },
        { status: 400 },
      );
    }

    const [referral] = await sql`
      INSERT INTO referrals (
        referrer_id, referral_type, purpose,
        owner_name, owner_contact_number,
        property_category, property_type, property_location, property_notes
      ) VALUES (
        ${user.id}, 'property', ${purpose},
        ${ownerName}, ${ownerContactNumber},
        ${body.propertyCategory || null}, ${body.propertyType || null},
        ${body.propertyLocation?.trim() || null}, ${body.propertyNotes?.trim() || null}
      )
      RETURNING id, status
    `;

    // Media rows are inserted after the parent so a failed upload can't leave
    // an orphaned referral — the referral itself is the thing admins act on.
    const rows = media
      .filter((m) => typeof m?.url === 'string' && m.url.startsWith('https://'))
      .map((m, i) => ({
        referral_id: referral.id,
        media_url: m.url,
        media_type: m.mediaType === 'video' ? 'video' : 'image',
        category: isValidMediaCategory(m.category) ? m.category : 'other',
        file_name: typeof m.fileName === 'string' ? m.fileName.slice(0, 255) : null,
        sort_order: i,
      }));

    if (rows.length > 0) {
      await sql`
        INSERT INTO referral_media ${sql(
          rows,
          'referral_id',
          'media_url',
          'media_type',
          'category',
          'file_name',
          'sort_order',
        )}
      `;
    }

    return NextResponse.json({ referral }, { status: 201 });
  } catch (err) {
    console.error('[referrals-mine/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Numbers arrive as "+91 98765 43210", "098765 43210", "9876543210" — store the
// bare 10-digit form so duplicate checks and user lookups actually match.
function normalizePhone(input) {
  const digits = String(input ?? '').replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function isValidPhone(digits) {
  return /^[6-9]\d{9}$/.test(digits);
}

function isSameNumber(a, b) {
  return Boolean(a) && a === normalizePhone(b);
}
