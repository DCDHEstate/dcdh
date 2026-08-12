-- Migration: Add '1rk' (1 Room Kitchen) residential property type
-- Run once against your PostgreSQL database.

ALTER TYPE property_type ADD VALUE IF NOT EXISTS '1rk';
