// Shared referral logic — code generation, link building, and the one place
// that attributes a user to a referrer.
//
// Three flows feed into the same `referrals` table:
//   'signup'   — someone opened a /?ref=CODE link, or typed a code in later
//   'friend'   — a user hands us a person's details for the team to follow up
//   'property' — a user hands us an owner + their property, with photos/videos

import sql from '@/lib/db';
import { normalizeCode } from '@/lib/referralOptions';

// Pure constants and link helpers live in referralOptions so client components
// can import them without pulling the database client into the bundle.
export {
  SITE_URL,
  REFERRAL_PURPOSES,
  PURPOSE_LABELS,
  MEDIA_CATEGORIES,
  MEDIA_CATEGORY_LABELS,
  REFERRAL_TYPE_LABELS,
  isValidPurpose,
  isValidMediaCategory,
  normalizeCode,
  referralLink,
  referralShareMessage,
  referralWhatsAppLink,
} from '@/lib/referralOptions';

// I/O/0/1 are excluded — codes get read aloud and retyped by hand.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

function randomCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

/**
 * Returns the user's referral code, minting one if they don't have it yet.
 * Codes are also backfilled by migration 007 — this covers users created
 * after it ran.
 */
export async function ensureReferralCode(userId, existingCode) {
  if (existingCode) return existingCode;

  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    // The NOT EXISTS guard runs inside the UPDATE so the collision check and
    // the write are one statement; a separate SELECT-then-UPDATE can hand the
    // same code to two concurrent requests. The UNIQUE constraint is the
    // backstop — a lost race returns no rows and we retry.
    const rows = await sql`
      UPDATE users SET referral_code = ${code}
      WHERE id = ${userId}
        AND referral_code IS NULL
        AND NOT EXISTS (SELECT 1 FROM users WHERE referral_code = ${code})
      RETURNING referral_code
    `;
    if (rows.length > 0) return rows[0].referral_code;

    // Either we lost the race on the code, or the row already had one.
    const [current] = await sql`SELECT referral_code FROM users WHERE id = ${userId}`;
    if (current?.referral_code) return current.referral_code;
  }

  throw new Error('Could not allocate a referral code');
}

/**
 * Finds a live referral that already claims `phone`, across every referrer and
 * both phone columns — `referred_phone` (person referrals and link signups)
 * and `owner_contact_number` (property referrals). A number belongs to whoever
 * submitted it first, whichever form they used.
 *
 * Comparison is on the last 10 digits rather than plain equality: rows written
 * before the POST handler started normalising phones still hold values like
 * "+91 98765 43210", and those must not slip past as fresh numbers.
 *
 * Expired referrals are deliberately ignored — that lead went cold, so the
 * number is fair game for someone else to refer.
 *
 * Returns the claiming row, or undefined when the number is free.
 */
export async function findReferralClaim(phone) {
  const digits = String(phone ?? '').replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return undefined;

  const [claim] = await sql`
    SELECT id, referrer_id, referral_type, status, created_at
    FROM referrals
    WHERE status <> 'expired'
      AND (
        right(regexp_replace(COALESCE(referred_phone, ''), '\\D', '', 'g'), 10) = ${digits}
        OR right(regexp_replace(COALESCE(owner_contact_number, ''), '\\D', '', 'g'), 10) = ${digits}
      )
    ORDER BY created_at
    LIMIT 1
  `;

  return claim;
}

/**
 * Attributes `user` to the owner of `rawCode`.
 *
 * Used by three callers — OTP signup with a ?ref= link, profile-setup, and the
 * "I was referred" form in profile — so the guards live here rather than being
 * repeated (and drifting) at each call site.
 *
 * Returns { ok: true, referrerName } or { ok: false, error }. Callers decide
 * whether a failure is worth surfacing: the signup path swallows it (a bad code
 * must never block a login), the profile path shows it.
 */
export async function attachReferralCode(user, rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) return { ok: false, error: 'Enter a referral code.' };

  if (user.referral_code && code === user.referral_code) {
    return { ok: false, error: 'You cannot use your own referral code.' };
  }

  const [existing] = await sql`
    SELECT referred_by_user_id FROM users WHERE id = ${user.id}
  `;
  if (existing?.referred_by_user_id) {
    return { ok: false, error: 'A referral is already linked to your account.' };
  }

  const [referrer] = await sql`
    SELECT id, full_name FROM users
    WHERE referral_code = ${code} AND id != ${user.id}
  `;
  if (!referrer) return { ok: false, error: 'That referral code is not valid.' };

  await sql`
    UPDATE users
    SET referred_by_user_id = ${referrer.id},
        referred_by_code = ${code},
        referred_at = NOW()
    WHERE id = ${user.id}
  `;

  // A person referral submitted earlier for this same phone should be marked
  // as converted rather than leaving a duplicate 'signup' row beside it.
  const [claimed] = await sql`
    UPDATE referrals
    SET referred_user_id = ${user.id},
        status = CASE WHEN status = 'pending' THEN 'registered' ELSE status END
    WHERE referrer_id = ${referrer.id}
      AND referral_type = 'friend'
      AND referred_user_id IS NULL
      AND referred_phone IS NOT NULL
      AND regexp_replace(referred_phone, '\\D', '', 'g') LIKE ${'%' + String(user.phone ?? '').slice(-10)}
    RETURNING id
  `;

  if (!claimed) {
    await sql`
      INSERT INTO referrals (referrer_id, referral_type, referred_name, referred_phone, referred_user_id, status)
      VALUES (${referrer.id}, 'signup', ${user.full_name || null}, ${user.phone || null}, ${user.id}, 'registered')
    `;
  }

  return { ok: true, referrerName: referrer.full_name };
}
