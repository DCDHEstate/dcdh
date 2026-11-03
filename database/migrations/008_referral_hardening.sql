-- Migration: Referral + wallet hardening.
--
-- The application now does its money and attribution work inside transactions,
-- but these constraints are the backstop that makes double payouts and double
-- attribution impossible even if two requests race or a future code path
-- forgets a check. Run after 007. Idempotent.

-- ---------------------------------------------------------------------------
-- 1. Money integrity
-- ---------------------------------------------------------------------------

-- A referral can be credited to a wallet exactly once.
CREATE UNIQUE INDEX IF NOT EXISTS uq_wallet_tx_referral_reward
  ON wallet_transactions (reference_id)
  WHERE reason = 'referral_reward';

-- A balance can never go negative — withdrawals debit with a guarded UPDATE,
-- and this rejects anything that slips past it.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wallets_balance_non_negative') THEN
    ALTER TABLE wallets ADD CONSTRAINT wallets_balance_non_negative CHECK (balance >= 0);
  END IF;
END$$;

-- ---------------------------------------------------------------------------
-- 2. Attribution integrity: a person is credited to at most one referrer.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS uq_referrals_referred_user
  ON referrals (referred_user_id)
  WHERE referred_user_id IS NOT NULL AND referral_type IN ('signup', 'friend');

-- ---------------------------------------------------------------------------
-- 3. Upload ledger for referral photos/videos.
--    Every presigned upload is recorded here. A referral may only attach files
--    from this ledger that belong to the submitter and aren't already used —
--    the client never gets to supply a URL. Rows still unclaimed after a day
--    are abandoned uploads and can be swept from S3.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS referral_uploads (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  s3_key      TEXT NOT NULL UNIQUE,
  public_url  TEXT NOT NULL,
  media_type  VARCHAR(20) NOT NULL,          -- 'image' | 'video'
  file_name   VARCHAR(255),
  file_size   BIGINT NOT NULL,
  referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_referral_uploads_user_created
  ON referral_uploads (user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_referral_uploads_unclaimed
  ON referral_uploads (created_at) WHERE referral_id IS NULL;

-- ---------------------------------------------------------------------------
-- 4. Wallet withdrawals.
--    The amount is debited from the wallet the moment a request is made, so
--    the same balance can't be requested twice; a rejection credits it back.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'withdrawal_status') THEN
    CREATE TYPE withdrawal_status AS ENUM ('pending', 'paid', 'rejected');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS wallet_withdrawals (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  wallet_id           UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  amount              NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  payout_method       payment_method NOT NULL,   -- 'upi' | 'bank_transfer'
  upi_id              VARCHAR(100),
  bank_account_name   VARCHAR(255),
  bank_account_number VARCHAR(50),
  bank_ifsc_code      VARCHAR(20),
  bank_name           VARCHAR(255),
  status              withdrawal_status NOT NULL DEFAULT 'pending',
  payout_reference    VARCHAR(100),              -- UTR / transaction id once paid
  admin_notes         TEXT,
  processed_by        UUID REFERENCES users(id),
  processed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One open request per user at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_wallet_withdrawals_one_pending
  ON wallet_withdrawals (user_id) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_wallet_withdrawals_status
  ON wallet_withdrawals (status, created_at);

-- No updated_at trigger: production has none of schema.sql's triggers (or the
-- update_updated_at_column function), so the application sets updated_at.

-- ---------------------------------------------------------------------------
-- 5. Backfill attribution for person referrals created by the pre-007 signup
--    path, which linked the referral row but had no users.referred_by_* columns
--    to fill. Only rows created alongside the user's own signup are backfilled;
--    referrals submitted for someone who was *already* a member are left for an
--    admin to review (the admin panel flags them).
-- ---------------------------------------------------------------------------
UPDATE users u
SET referred_by_user_id = src.referrer_id,
    referred_by_code    = src.referral_code,
    referred_at         = src.created_at
FROM (
  SELECT DISTINCT ON (r.referred_user_id)
         r.referred_user_id, r.referrer_id, r.created_at, ref.referral_code
  FROM referrals r
  JOIN users ref ON ref.id = r.referrer_id
  JOIN users ru  ON ru.id  = r.referred_user_id
  WHERE r.referral_type = 'friend'
    AND r.created_at <= ru.created_at + INTERVAL '1 hour'
  ORDER BY r.referred_user_id, r.created_at
) src
WHERE u.id = src.referred_user_id
  AND u.referred_by_user_id IS NULL;
