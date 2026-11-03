import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyOTP } from '@/lib/otp';
import { createSession, setSessionCookie } from '@/lib/session';
import { linkNewUser, ensureReferralCode, normalizeCode } from '@/lib/referral';

const MAX_ATTEMPTS = 5;
const REF_COOKIE_NAME = 'dcdh_ref';

export async function POST(request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { error: 'Phone and OTP are required' },
        { status: 400 }
      );
    }

    const cleaned = phone.replace(/\D/g, '');
    const otpStr = String(otp).trim();

    if (!/^\d{6}$/.test(otpStr)) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Find the latest valid (unused, non-expired) OTP for this phone
    const otpRows = await sql`
      SELECT id, otp_hash, attempts
      FROM otp_verifications
      WHERE phone = ${cleaned}
        AND is_used = FALSE
        AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT 1
    `;

    if (otpRows.length === 0) {
      return NextResponse.json(
        { error: 'OTP expired or not found. Please request a new one.' },
        { status: 400 }
      );
    }

    const otpRecord = otpRows[0];

    // Block if attempt limit reached
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await sql`UPDATE otp_verifications SET is_used = TRUE WHERE id = ${otpRecord.id}`;
      return NextResponse.json(
        { error: 'Too many incorrect attempts. Please request a new OTP.' },
        { status: 400 }
      );
    }

    // Verify the OTP hash
    const isValid = verifyOTP(otpStr, otpRecord.otp_hash);

    if (!isValid) {
      await sql`
        UPDATE otp_verifications SET attempts = attempts + 1 WHERE id = ${otpRecord.id}
      `;
      const attemptsLeft = MAX_ATTEMPTS - (otpRecord.attempts + 1);
      return NextResponse.json(
        {
          error: `Incorrect OTP. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining.`,
        },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await sql`UPDATE otp_verifications SET is_used = TRUE WHERE id = ${otpRecord.id}`;

    // Upsert user by phone — atomic, no race condition
    const userRows = await sql`
      INSERT INTO users (phone, is_phone_verified, last_login_at)
      VALUES (${cleaned}, TRUE, NOW())
      ON CONFLICT (phone) DO UPDATE
        SET last_login_at = NOW(),
            is_phone_verified = TRUE
      RETURNING id, phone, email, full_name, role, status
    `;

    const user = userRows[0];

    // Detect new user: full_name and email are both null only for freshly created users
    const isNewUser = !user.full_name && !user.email;

    // Referral attribution for a brand-new account. Runs even without a code:
    // if someone submitted a person referral for this number before it signed
    // up, that referrer is credited (first claim wins). Otherwise the link's
    // code applies — parked in a cookie by middleware when the invitee opened
    // the link, and sent in the body as a fallback for blocked cookies.
    // An existing user following a link is not a new referral. Failures are
    // logged and swallowed: attribution must never block a login.
    const referralCode =
      normalizeCode(body.referralCode) ||
      normalizeCode(request.cookies.get(REF_COOKIE_NAME)?.value);

    let referredBy = null;
    if (isNewUser) {
      try {
        await ensureReferralCode(user.id, null);
        const result = await linkNewUser(user, referralCode);
        if (result.ok) referredBy = result.referrerName || 'a DCDH member';
      } catch (refErr) {
        console.error('[verify-otp] referral attribution failed', refErr);
      }
    }

    // Create DB session
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;

    const { token, expiresAt } = await createSession(user.id, { ipAddress, userAgent });

    // Determine post-login redirect
    let redirectTo;
    if (user.role === 'admin') {
      redirectTo = '/admin';
    } else if (isNewUser) {
      redirectTo = '/auth/role-select';
    } else if (user.role === 'owner') {
      redirectTo = '/dashboard/owner';
    } else {
      redirectTo = '/dashboard/tenant';
    }

    const response = NextResponse.json({
      message: 'Login successful',
      isNewUser,
      role: user.role,
      redirectTo,
      referredBy,
    });

    setSessionCookie(response, token, expiresAt);

    // Attribution is decided once per new account — drop the code either way so
    // a later signup on the same device isn't silently credited to this referrer.
    if (isNewUser && referralCode) {
      response.cookies.set(REF_COOKIE_NAME, '', { path: '/', expires: new Date(0) });
    }

    return response;
  } catch (err) {
    console.error('[verify-otp]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
