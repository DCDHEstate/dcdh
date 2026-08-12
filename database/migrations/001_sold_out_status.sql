-- Migration: Add inactive/sold_out statuses and sold-out tracking columns
-- Run once against your PostgreSQL database.

ALTER TYPE property_status ADD VALUE IF NOT EXISTS 'inactive';
ALTER TYPE property_status ADD VALUE IF NOT EXISTS 'sold_out';

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS sold_out_date      TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS sold_to_user_id    UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_properties_sold_to_user ON properties(sold_to_user_id) WHERE sold_to_user_id IS NOT NULL;
