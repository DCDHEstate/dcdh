import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import {
  ensureReferralCode,
  referralLink,
  checkReferablePhone,
  lockPhone,
  isValidPurpose,
  isValidMediaCategory,
  isValidPropertyCategory,
  isValidPropertyType,
  isValidPhone,
  maskPhone,
  normalizePhone,
} from '@/lib/referral';

const MAX_MEDIA_PER_REFERRAL = 30;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

    const [referrals, summary, wallet, referredBy] = await Promise.all([
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

    // A link signup's number is the new member's own — the referrer may have
    // posted the link in a group and never had it. Numbers the referrer typed
    // in themselves are shown as entered.
    const visible = referrals.map((r) =>
      r.referral_type === 'signup' ? { ...r, referred_phone: maskPhone(r.referred_phone) } : r,
    );

    const total = summary[0].total_referrals;

    return NextResponse.json({
      referralCode,
      referralLink: referralLink(referralCode),
      referredBy: referredBy[0]?.referred_by_code
        ? { name: referredBy[0].full_name, code: referredBy[0].referred_by_code }
        : null,
      referrals: visible,
      total,
      page,
      limit,
      hasMore: offset + referrals.length < total,
      summary: {
        totalReferrals: total,
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

const trimTo = (value, max) => {
  const text = typeof value === 'string' ? value.trim() : '';
  return text ? text.slice(0, max) : null;
};

// POST — submit a person ('friend') or property referral
export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { referralType, purpose } = body;
    if (!['friend', 'property'].includes(referralType)) {
      return NextResponse.json({ error: 'Invalid referral type' }, { status: 400 });
    }
    if (!isValidPurpose(purpose)) {
      return NextResponse.json({ error: 'Select a valid purpose' }, { status: 400 });
    }

    const isProperty = referralType === 'property';
    const name = trimTo(isProperty ? body.ownerName : body.referredName, 255);
    if (!name) {
      return NextResponse.json(
        { error: isProperty ? "Owner's name is required" : 'Client name is required' },
        { status: 400 },
      );
    }

    let propertyFields = null;
    let mediaRequest = [];
    if (isProperty) {
      if (body.propertyCategory && !isValidPropertyCategory(body.propertyCategory)) {
        return NextResponse.json({ error: 'Select a valid property category' }, { status: 400 });
      }
      if (body.propertyType && !isValidPropertyType(body.propertyType)) {
        return NextResponse.json({ error: 'Select a valid property type' }, { status: 400 });
      }
      propertyFields = {
        category: body.propertyCategory || null,
        type: body.propertyType || null,
        location: trimTo(body.propertyLocation, 500),
        notes: trimTo(body.propertyNotes, 2000),
      };

      // Media is attached by upload id only. The URL, owner and media type all
      // come from the upload ledger, so a client can't slip in an arbitrary
      // link (a tracking pixel, a phishing page) for admins to open.
      const requested = Array.isArray(body.media) ? body.media : [];
      const seen = new Set();
      for (const m of requested) {
        if (!UUID_RE.test(m?.uploadId ?? '') || seen.has(m.uploadId)) continue;
        seen.add(m.uploadId);
        mediaRequest.push({
          uploadId: m.uploadId,
          category: isValidMediaCategory(m.category) ? m.category : 'other',
        });
      }
      if (mediaRequest.length > MAX_MEDIA_PER_REFERRAL) {
        return NextResponse.json(
          { error: `Attach at most ${MAX_MEDIA_PER_REFERRAL} files` },
          { status: 400 },
        );
      }
    }

    const rawPhone = normalizePhone(isProperty ? body.ownerContactNumber : body.referredPhone);

    const result = await sql.begin(async (tx) => {
      // Checked under a per-number lock: two users submitting the same number at
      // the same moment would otherwise both find it free.
      if (isValidPhone(rawPhone)) await lockPhone(tx, rawPhone);

      const phoneCheck = await checkReferablePhone(
        user,
        rawPhone,
        { label: isProperty ? 'owner' : 'client', forProperty: isProperty },
        tx,
      );
      if (!phoneCheck.ok) return phoneCheck;
      const phone = phoneCheck.phone;

      if (!isProperty) {
        const [referral] = await tx`
          INSERT INTO referrals (referrer_id, referral_type, purpose, referred_name, referred_phone, status)
          VALUES (${user.id}, 'friend', ${purpose}, ${name}, ${phone}, 'pending')
          RETURNING id, status
        `;
        return { ok: true, referral };
      }

      let uploads = [];
      if (mediaRequest.length > 0) {
        const ids = mediaRequest.map((m) => m.uploadId);
        uploads = await tx`
          SELECT id, public_url, media_type, file_name
          FROM referral_uploads
          WHERE id IN ${tx(ids)}
            AND user_id = ${user.id}
            AND referral_id IS NULL
          FOR UPDATE
        `;
        if (uploads.length !== ids.length) {
          return {
            ok: false,
            status: 400,
            error: 'Some photos or videos could not be attached. Please remove them and upload again.',
          };
        }
      }

      const [referral] = await tx`
        INSERT INTO referrals (
          referrer_id, referral_type, purpose,
          owner_name, owner_contact_number,
          property_category, property_type, property_location, property_notes
        ) VALUES (
          ${user.id}, 'property', ${purpose},
          ${name}, ${phone},
          ${propertyFields.category}, ${propertyFields.type},
          ${propertyFields.location}, ${propertyFields.notes}
        )
        RETURNING id, status
      `;

      if (uploads.length > 0) {
        const byId = new Map(uploads.map((u) => [u.id, u]));
        const rows = mediaRequest.map((m, i) => {
          const upload = byId.get(m.uploadId);
          return {
            referral_id: referral.id,
            media_url: upload.public_url,
            media_type: upload.media_type,
            category: m.category,
            file_name: upload.file_name,
            sort_order: i,
          };
        });

        await tx`
          INSERT INTO referral_media ${tx(
            rows,
            'referral_id',
            'media_url',
            'media_type',
            'category',
            'file_name',
            'sort_order',
          )}
        `;
        await tx`
          UPDATE referral_uploads SET referral_id = ${referral.id}
          WHERE id IN ${tx(mediaRequest.map((m) => m.uploadId))}
        `;
      }

      return { ok: true, referral };
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status || 400 });
    }
    return NextResponse.json({ referral: result.referral }, { status: 201 });
  } catch (err) {
    console.error('[referrals-mine/POST]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
