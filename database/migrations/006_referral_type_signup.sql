-- Migration: Add 'signup' referral type for link-based referrals.
-- Kept in its own file because PostgreSQL will not let a newly added enum
-- value be *used* in the same transaction that adds it — run this one first,
-- then 007.

ALTER TYPE referral_type ADD VALUE IF NOT EXISTS 'signup';
