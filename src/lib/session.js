import crypto from 'crypto';
import sql from '@/lib/db';

export const SESSION_COOKIE_NAME = 'dcdh_session';
const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generates a 64-char hex token, inserts a sessions row, returns the token.
 * Call this after successful OTP verification.
 */
export async function createSession(userId, { ipAddress = null, userAgent = null } = {}) {
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await sql`
    INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent)
    VALUES (${userId}, ${token}, ${expiresAt}, ${ipAddress}, ${userAgent})
  `;

  return { token, expiresAt };
}

/**
 * Validates session token against DB. If valid and not expired,
 * performs rolling session (extends expires_at by 30 days) and returns the user row.
 */
export async function getSession(token) {
  if (!token) return null;

  const rows = await sql`
    SELECT
      s.id AS session_id,
      s.expires_at,
      u.id,
      u.phone,
      u.email,
      u.full_name,
      u.role,
      u.status,
      u.is_phone_verified,
      u.avatar_url,
      u.whatsapp_number,
      u.referral_code
    FROM sessions s
    JOIN users u ON u.id = s.user_id
    WHERE s.token = ${token}
      AND s.expires_at > NOW()
    LIMIT 1
  `;

  if (rows.length === 0) return null;

  const session = rows[0];

  // Rolling session: extend expiry on every valid request
  const newExpiry = new Date(Date.now() + SESSION_DURATION_MS);
  await sql`
    UPDATE sessions SET expires_at = ${newExpiry} WHERE token = ${token}
  `;

  return session;
}

/**
 * Extracts session token from the httpOnly cookie and validates it.
 * Convenience wrapper for use in API route handlers.
 */
export async function getSessionFromRequest(request) {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return null;
  return getSession(cookie.value);
}

/**
 * Removes the session row from DB. Used by the logout route.
 */
export async function deleteSession(token) {
  if (!token) return;
  await sql`DELETE FROM sessions WHERE token = ${token}`;
}

/**
 * Sets the httpOnly session cookie on the given NextResponse object.
 */
export function setSessionCookie(response, token, expiresAt) {
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
}

/**
 * Clears the session cookie by setting it to an expired date.
 */
export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
}
