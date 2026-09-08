-- Migration: Itemised furnishings for furnished / semi-furnished listings.
-- Kept separate from `amenities` — amenities are society-level (gym, lift,
-- security), furnishings are what is physically inside the unit.
-- Run once. Idempotent.

ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS furnishings JSONB DEFAULT '[]'::jsonb;

-- e.g. ["modular_kitchen", "sofa", "bed", "wardrobe", "ac", "geyser"]
