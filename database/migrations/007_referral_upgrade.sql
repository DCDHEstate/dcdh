-- Migration: Three referral flows — link signup, person referral, property referral.
-- Run AFTER 006 (which adds the 'signup' enum value). Idempotent.

-- ---------------------------------------------------------------------------
-- Purpose: what the referred person / owner actually wants to do.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_purpose') THEN
    CREATE TYPE referral_purpose AS ENUM ('sell_purchase', 'rent', 'lease', 'other');
  END IF;
END$$;

-- ---------------------------------------------------------------------------
-- referrals: name + purpose for person referrals, owner name for property ones.
-- ---------------------------------------------------------------------------
ALTER TABLE referrals
  ADD COLUMN IF NOT EXISTS referred_name  VARCHAR(255),   -- person referral: client name
  ADD COLUMN IF NOT EXISTS owner_name     VARCHAR(255),   -- property referral: owner name
  ADD COLUMN IF NOT EXISTS purpose        referral_purpose,
  ADD COLUMN IF NOT EXISTS admin_notes    TEXT;

-- property_location was NOT NULL-ish by convention only; purpose-driven forms
-- may omit it, so nothing to relax here.

-- ---------------------------------------------------------------------------
-- referral_media: group shots by what they show so admins can review quickly.
-- ---------------------------------------------------------------------------
ALTER TABLE referral_media
  ADD COLUMN IF NOT EXISTS category   VARCHAR(30),  -- exterior | living_room | bedroom | kitchen | bathroom | balcony | other
  ADD COLUMN IF NOT EXISTS sort_order SMALLINT NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_referral_media_referral ON referral_media(referral_id);

-- ---------------------------------------------------------------------------
-- users: remember who invited whom, independent of the referrals row.
-- ---------------------------------------------------------------------------
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS referred_by_user_id UUID REFERENCES users(id),
  ADD COLUMN IF NOT EXISTS referred_by_code    VARCHAR(10),
  ADD COLUMN IF NOT EXISTS referred_at         TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_users_referred_by ON users(referred_by_user_id);

-- ---------------------------------------------------------------------------
-- Backfill referral codes. Codes were generated lazily on first visit to the
-- referrals page, so most users have none — and a shareable link needs one to
-- exist up front. Ambiguous glyphs (I/O/0/1) are excluded to keep codes
-- readable when someone types one in by hand.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
  target   UUID;
  new_code VARCHAR(10);
BEGIN
  FOR target IN SELECT id FROM users WHERE referral_code IS NULL LOOP
    LOOP
      new_code := (
        SELECT string_agg(
          substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
                 (floor(random() * 32) + 1)::int, 1), '')
        FROM generate_series(1, 6)
      );
      EXIT WHEN NOT EXISTS (SELECT 1 FROM users WHERE referral_code = new_code);
    END LOOP;
    UPDATE users SET referral_code = new_code WHERE id = target;
  END LOOP;
END$$;

-- A partial unique index already exists via the UNIQUE constraint on the column.
