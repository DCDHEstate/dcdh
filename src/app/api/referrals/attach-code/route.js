// Lets a user who signed up without a referral link add the code afterwards,
// from their profile page.

import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { getSessionFromRequest } from '@/lib/session';
import { attachReferralCode, ensureReferralCode, referralLink } from '@/lib/referral';

// GET — current attribution state, so the profile page can show either the
// "enter a code" form or who referred them.
export async function GET(request) {
  const user = await getSessionFromRequest(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [row] = await sql`
    SELECT u.referred_by_code, u.referred_at, ref.full_name AS referrer_name
    FROM users u
    LEFT JOIN users ref ON ref.id = u.referred_by_user_id
    WHERE u.id = ${user.id}
  `;

  const code = await ensureReferralCode(user.id, user.referral_code);

  return NextResponse.json({
    myCode: code,
    myLink: referralLink(code),
    referredBy: row?.referred_by_code
      ? {
          code: row.referred_by_code,
          name: row.referrer_name,
          at: row.referred_at,
        }
      : null,
  });
}

// POST — attach a referral code to my account
export async function POST(request) {
  try {
    const user = await getSessionFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();

    // The session row may predate the code being minted, so make sure the
    // self-referral guard in attachReferralCode has something to compare.
    const myCode = await ensureReferralCode(user.id, user.referral_code);
    const result = await attachReferralCode({ ...user, referral_code: myCode }, code);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Referral linked',
      referrerName: result.referrerName,
    });
  } catch (err) {
    console.error('[referrals/attach-code]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
