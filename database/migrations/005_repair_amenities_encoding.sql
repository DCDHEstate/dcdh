-- Migration: repair double-encoded `amenities`.
--
-- Historically the API bound amenities with `${JSON.stringify(arr)}`, which
-- postgres.js sends as a text parameter and then JSON-encodes a second time, so
-- the jsonb column ended up holding a JSON *string* ("[\"lift\"]") rather than a
-- JSON array. Reads were unaffected (every call site re-parses), but any
-- server-side containment filter — `amenities @> '["parking"]'` — matched zero
-- rows. The write path now uses sql.json(); this repairs the existing rows.
--
-- Run once. Idempotent: rows already stored as arrays are left alone.

UPDATE properties
SET amenities = (amenities #>> '{}')::jsonb
WHERE jsonb_typeof(amenities) = 'string';

-- Sanity check after running:
--   SELECT jsonb_typeof(amenities), COUNT(*) FROM properties GROUP BY 1;
--   -- expect a single 'array' row
