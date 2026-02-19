import { NextResponse } from 'next/server';
import sql from '@/lib/db';
import { verifyOTP } from '@/lib/otp';
import { createSession, setSessionCookie } from '@/lib/session';

const MAX_ATTEMPTS = 5;

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

    // Create DB session
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      null;
    const userAgent = request.headers.get('user-agent') || null;

    const { token, expiresAt } = await createSession(user.id, { ipAddress, userAgent });

    // Determine post-login redirect
    let redirectTo;
    if (isNewUser) {
      redirectTo = '/auth/role-select';
    } else if (user.role === 'owner') {
      redirectTo = '/dashboard/owner';
    } else if (user.role === 'admin') {
      redirectTo = '/admin';
    } else {
      redirectTo = '/dashboard/tenant';
    }

    const response = NextResponse.json({
      message: 'Login successful',
      isNewUser,
      role: user.role,
      redirectTo,
    });

    setSessionCookie(response, token, expiresAt);

    return response;
  } catch (err) {
    console.error('[verify-otp]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
