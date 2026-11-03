// Shared referral logic — code generation, phone checks, and the only places
// that attribute a user to a referrer.
//
// Three flows feed into the same `referrals` table:
//   'signup'   — someone signed up through a referral link, or typed a code in
//                within the attach window
//   'friend'   — a user hands us a person's details for the team to follow up
//   'property' — a user hands us an owner + their property, with photos/videos
//
// Attribution rules (enforced here and backed by unique indexes, migration 008):
//   • A person is credited to at most one referrer, ever.
//   • First claim wins: if someone submitted a person referral for a number
//     before that number signed up, that referrer gets the signup — even if the
//     new member arrived through somebody else's link.
//   • A code can be entered later only within ATTACH_WINDOW_DAYS of signup, and
//     never back to someone you referred yourself.
//   • A number that already has an account can't be referred at all.

import sql from '@/lib/db';
import {
  ATTACH_WINDOW_DAYS,
  normalizeCode,
  normalizePhone,
  isValidPhone,
} from '@/lib/referralOptions';

// Pure constants and link helpers live in referralOptions so client components
// can import them without pulling the database client into the bundle.
export * from '@/lib/referralOptions';

// I/O/0/1 are excluded — codes get read aloud and retyped by hand.
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;
const DAY_MS = 24 * 60 * 60 * 1000;

function randomCode() {
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return code;
}

const fail = (error, status = 400) => ({ ok: false, error, status });

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

/** Last moment a user who signed up at `createdAt` may still enter a code. */
export function attachWindowEndsAt(createdAt) {
  return new Date(new Date(createdAt).getTime() + ATTACH_WINDOW_DAYS * DAY_MS);
}

/**
 * Serialises everything that decides who owns a phone number — submitting a
 * referral for it, and that number signing up — so two of them can't both pass
 * their "is it free?" check at the same moment. Must run inside a transaction;
 * the lock is released when it ends.
 */
export async function lockPhone(tx, phone) {
  await tx`SELECT pg_advisory_xact_lock(hashtext(${`referral-phone:${phone}`}))`;
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
 * Link signups don't count as a claim: nobody submitted that number. For a
 * person referral the member check already covers them (a signup row means an
 * account exists), and an owner who joined through someone's link can still
 * have their property referred.
 */
export async function findReferralClaim(phone, db = sql) {
  const digits = String(phone ?? '').replace(/\D/g, '').slice(-10);
  if (digits.length < 10) return undefined;

  const [claim] = await db`
    SELECT id, referrer_id, referral_type, status, created_at
    FROM referrals
    WHERE status <> 'expired'
      AND referral_type <> 'signup'
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
 * Can `user` refer `rawPhone`? Used by the referral form's submit and by the
 * media presign endpoint, so a number that will be rejected is caught before
 * any photos are uploaded for it.
 *
 * `label` is "client" or "owner", for the wording. Returns
 * { ok: true, phone } or { ok: false, status, error }.
 */
export async function checkReferablePhone(user, rawPhone, { label, forProperty = false }, db = sql) {
  const phone = normalizePhone(rawPhone);

  if (!isValidPhone(phone)) {
    return fail(label === 'owner' ? "Enter a valid owner's phone number" : 'Enter a valid phone number');
  }
  if (phone === normalizePhone(user.phone) || phone === normalizePhone(user.whatsapp_number)) {
    return fail('You cannot refer yourself');
  }

  // Someone who already has an account joined without this referrer, so there
  // is no signup to credit. Property referrals are about the property rather
  // than the person, so an owner who happens to be a member can still be
  // referred for a listing.
  if (!forProperty) {
    const [member] = await db`
      SELECT id FROM users WHERE right(regexp_replace(phone, '\\D', '', 'g'), 10) = ${phone} LIMIT 1
    `;
    if (member) {
      return fail(
        "This person is already registered on DCDH Empire, so they can't be referred.",
        409,
      );
    }
  }

  const claim = await findReferralClaim(phone, db);
  if (claim) {
    // Naming the earlier referrer would leak who is talking to whom.
    return fail(
      claim.referrer_id === user.id
        ? `You have already submitted a referral for this ${label}'s number.`
        : "This number has already been referred by another user, so it can't be submitted again. If you think this is a mistake, please contact our team.",
      409,
    );
  }

  return { ok: true, phone };
}

async function setReferredBy(tx, userId, referrerId, code) {
  await tx`
    UPDATE users
    SET referred_by_user_id = ${referrerId},
        referred_by_code = ${code},
        referred_at = NOW()
    WHERE id = ${userId}
  `;
}

/**
 * Credits `me` to `referrer`. If the referrer had already submitted a person
 * referral for this number, that row is marked converted instead of adding a
 * second row beside it.
 */
async function linkToReferrer(tx, me, referrer, code) {
  const phone = normalizePhone(me.phone);

  const [claimed] = await tx`
    UPDATE referrals
    SET referred_user_id = ${me.id},
        status = CASE WHEN status = 'pending' THEN 'registered' ELSE status END
    WHERE id = (
      SELECT id FROM referrals
      WHERE referrer_id = ${referrer.id}
        AND referral_type = 'friend'
        AND referred_user_id IS NULL
        AND status <> 'expired'
        AND right(regexp_replace(COALESCE(referred_phone, ''), '\\D', '', 'g'), 10) = ${phone}
      ORDER BY created_at
      LIMIT 1
    )
    RETURNING id
  `;

  if (!claimed) {
    await tx`
      INSERT INTO referrals (referrer_id, referral_type, referred_name, referred_phone, referred_user_id, status)
      VALUES (${referrer.id}, 'signup', ${me.full_name || null}, ${phone || null}, ${me.id}, 'registered')
    `;
  }

  await setReferredBy(tx, me.id, referrer.id, code);
}

// A unique-index violation here means a concurrent request attributed the same
// user first — report it the same way as the up-front check would have.
function isUniqueViolation(err) {
  return err?.code === '23505';
}

/**
 * Attribution for a brand-new account, run straight after OTP verification.
 *
 * First claim wins: an open person referral submitted for this number before
 * it signed up takes priority over the link the person arrived through. Without
 * a prior claim, the link's code (if any) is used.
 *
 * Never throws for a bad code — a stale or bogus code must not block a login.
 */
export async function linkNewUser(user, rawCode) {
  const code = normalizeCode(rawCode);
  const phone = normalizePhone(user.phone);

  try {
    return await sql.begin(async (tx) => {
      const [me] = await tx`
        SELECT id, phone, full_name, referred_by_user_id
        FROM users WHERE id = ${user.id} FOR UPDATE
      `;
      if (!me) return fail('User not found', 404);
      if (me.referred_by_user_id) return fail('A referral is already linked to your account.');

      if (isValidPhone(phone)) {
        await lockPhone(tx, phone);

        const [earlier] = await tx`
          SELECT r.id, r.referrer_id, ref.full_name, ref.referral_code
          FROM referrals r
          JOIN users ref ON ref.id = r.referrer_id
          WHERE r.referral_type = 'friend'
            AND r.referred_user_id IS NULL
            AND r.status <> 'expired'
            AND r.referrer_id <> ${me.id}
            AND right(regexp_replace(COALESCE(r.referred_phone, ''), '\\D', '', 'g'), 10) = ${phone}
          ORDER BY r.created_at
          LIMIT 1
          FOR UPDATE OF r
        `;

        if (earlier) {
          await tx`
            UPDATE referrals
            SET referred_user_id = ${me.id},
                status = CASE WHEN status = 'pending' THEN 'registered' ELSE status END
            WHERE id = ${earlier.id}
          `;
          await setReferredBy(tx, me.id, earlier.referrer_id, earlier.referral_code);
          return { ok: true, referrerName: earlier.full_name, via: 'person_referral' };
        }
      }

      if (!code) return fail('No referral code');

      const [referrer] = await tx`
        SELECT id, full_name, referred_by_user_id FROM users WHERE referral_code = ${code}
      `;
      if (!referrer || referrer.id === me.id) return fail('That referral code is not valid.');
      if (referrer.referred_by_user_id === me.id) {
        return fail("You referred this person, so you can't use their code.");
      }

      await linkToReferrer(tx, me, referrer, code);
      return { ok: true, referrerName: referrer.full_name, via: 'link' };
    });
  } catch (err) {
    if (isUniqueViolation(err)) return fail('A referral is already linked to your account.');
    throw err;
  }
}

/**
 * "I was referred by…" — a code entered after signup, from the profile page
 * (or profile setup). Returns { ok: true, referrerName } or
 * { ok: false, status, error }.
 */
export async function attachReferralCode(user, rawCode) {
  const code = normalizeCode(rawCode);
  if (!code) return fail('Enter a referral code.');

  try {
    return await sql.begin(async (tx) => {
      // Row lock: a double-submitted form must not attribute the user twice.
      const [me] = await tx`
        SELECT id, phone, full_name, referred_by_user_id, created_at
        FROM users WHERE id = ${user.id} FOR UPDATE
      `;
      if (!me) return fail('User not found', 404);
      if (me.referred_by_user_id) return fail('A referral is already linked to your account.');

      const [referrer] = await tx`
        SELECT id, full_name, referred_by_user_id FROM users WHERE referral_code = ${code}
      `;
      if (referrer?.id === me.id) return fail('You cannot use your own referral code.');

      if (Date.now() > attachWindowEndsAt(me.created_at).getTime()) {
        return fail(
          `Referral codes can only be added within ${ATTACH_WINDOW_DAYS} days of signing up.`,
          403,
        );
      }

      if (!referrer) return fail('That referral code is not valid.');
      if (referrer.referred_by_user_id === me.id) {
        return fail("You referred this person, so you can't use their code.");
      }

      await linkToReferrer(tx, me, referrer, code);
      return { ok: true, referrerName: referrer.full_name };
    });
  } catch (err) {
    if (isUniqueViolation(err)) return fail('A referral is already linked to your account.');
    throw err;
  }
}
