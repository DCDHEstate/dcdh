-- Migration: International property support (UAE / Dubai)
-- Run once. All statements are idempotent.

-- ── 1. Add country + currency columns to properties ───────────────────────────
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS country  VARCHAR(100) DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10)  DEFAULT 'INR';

-- ── 2. UAE as a state ─────────────────────────────────────────────────────────
INSERT INTO states (name, code, sort_order)
VALUES ('UAE', 'UAE', 100)
ON CONFLICT (code) DO NOTHING;

-- ── 3. Emirates as cities ─────────────────────────────────────────────────────
WITH uae AS (SELECT id FROM states WHERE code = 'UAE')
INSERT INTO cities (state_id, name, slug, sort_order)
SELECT uae.id, t.name, t.slug, t.ord
FROM uae,
(VALUES
  ('Dubai',           'uae-dubai',           1),
  ('Abu Dhabi',       'uae-abu-dhabi',        2),
  ('Sharjah',         'uae-sharjah',          3),
  ('Ajman',           'uae-ajman',            4),
  ('Ras Al Khaimah',  'uae-ras-al-khaimah',   5),
  ('Fujairah',        'uae-fujairah',         6),
  ('Umm Al Quwain',   'uae-umm-al-quwain',    7)
) AS t(name, slug, ord)
ON CONFLICT (state_id, name) DO NOTHING;

-- ── 4. Dubai areas as localities ──────────────────────────────────────────────
WITH dubai AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Dubai'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'dubai-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM dubai d,
(VALUES
  ('Downtown Dubai',              1),
  ('Dubai Marina',                2),
  ('Palm Jumeirah',               3),
  ('Business Bay',                4),
  ('DIFC (Financial Centre)',     5),
  ('JBR (Jumeirah Beach Residence)', 6),
  ('JLT (Jumeirah Lakes Towers)',  7),
  ('JVC (Jumeirah Village Circle)', 8),
  ('JVT (Jumeirah Village Triangle)', 9),
  ('Al Barsha',                   10),
  ('Mirdif',                      11),
  ('Deira',                       12),
  ('Bur Dubai',                   13),
  ('Karama',                      14),
  ('Dubai Creek Harbour',         15),
  ('Arabian Ranches',             16),
  ('Dubai Hills Estate',          17),
  ('The Springs',                 18),
  ('The Meadows',                 19),
  ('The Lakes',                   20),
  ('The Greens',                  21),
  ('Silicon Oasis (DSO)',         22),
  ('Al Furjan',                   23),
  ('Motor City',                  24),
  ('Sports City',                 25),
  ('Discovery Gardens',           26),
  ('Town Square',                 27),
  ('Damac Hills',                 28),
  ('Bluewaters Island',           29),
  ('International City',          30),
  ('Al Nahda',                    31),
  ('Jumeirah',                    32),
  ('Umm Suqeim',                  33),
  ('Al Satwa',                    34),
  ('Rashidiya',                   35),
  ('Sheikh Zayed Road',           36),
  ('Arjan',                       37),
  ('Dubai South',                 38),
  ('Emaar Beachfront',            39),
  ('Remraam',                     40),
  ('Port De La Mer',              41)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 5. Abu Dhabi areas ────────────────────────────────────────────────────────
WITH abudhabi AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Abu Dhabi'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'abudhabi-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM abudhabi d,
(VALUES
  ('Al Reem Island',           1),
  ('Yas Island',               2),
  ('Saadiyat Island',          3),
  ('Al Khalidiyah',            4),
  ('Corniche Area',            5),
  ('Al Raha Beach',            6),
  ('Khalifa City',             7),
  ('Mohammed Bin Zayed City',  8),
  ('Al Mushrif',               9),
  ('Al Nahyan',                10),
  ('Masdar City',              11),
  ('Al Reef',                  12)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 6. Sharjah areas ──────────────────────────────────────────────────────────
WITH sharjah AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Sharjah'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'sharjah-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM sharjah d,
(VALUES
  ('Al Majaz',         1),
  ('Al Nahda',         2),
  ('Al Khan',          3),
  ('Muwaileh',         4),
  ('Al Taawun',        5),
  ('Al Qasimia',       6),
  ('Corniche Sharjah', 7)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 7. Ajman areas ────────────────────────────────────────────────────────────
WITH ajman AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Ajman'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'ajman-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM ajman d,
(VALUES
  ('Al Nuaimia',        1),
  ('Al Rashidiya',      2),
  ('Ajman Downtown',    3),
  ('Al Jurf',           4)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 8. Ras Al Khaimah areas ───────────────────────────────────────────────────
WITH rak AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Ras Al Khaimah'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'rak-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM rak d,
(VALUES
  ('Al Nakheel',     1),
  ('Al Hamra Village', 2),
  ('Mina Al Arab',   3),
  ('Marjan Island',  4)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 9. Fujairah areas ─────────────────────────────────────────────────────────
WITH fujairah AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Fujairah'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'fujairah-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM fujairah d,
(VALUES
  ('Fujairah City',      1),
  ('Dibba Al Fujairah',  2)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;

-- ── 10. Umm Al Quwain areas ───────────────────────────────────────────────────
WITH uaq AS (
  SELECT c.id FROM cities c
  JOIN states s ON s.id = c.state_id
  WHERE s.code = 'UAE' AND c.name = 'Umm Al Quwain'
)
INSERT INTO localities (city_id, name, slug, sort_order)
SELECT d.id, t.name, 'uaq-' || lower(regexp_replace(t.name, '[^a-zA-Z0-9]+', '-', 'g')), t.ord
FROM uaq d,
(VALUES
  ('UAQ Marina',   1),
  ('Al Salamah',   2)
) AS t(name, ord)
ON CONFLICT (city_id, name) DO NOTHING;
