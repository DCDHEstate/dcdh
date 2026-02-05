-- ============================================================================
-- DCDH Estate - Seed Data
-- Initial locations: Rajasthan > Jaipur > Localities
-- ============================================================================

-- State: Rajasthan
INSERT INTO states (id, name, code, is_active, sort_order)
VALUES ('a0000000-0000-0000-0000-000000000001', 'Rajasthan', 'RJ', TRUE, 1);

-- City: Jaipur
INSERT INTO cities (id, state_id, name, slug, is_active, is_featured, latitude, longitude, sort_order)
VALUES ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Jaipur', 'jaipur', TRUE, TRUE, 26.91240000, 75.78730000, 1);

-- ============================================================================
-- Jaipur Localities
-- ============================================================================

INSERT INTO localities (city_id, name, slug, pincode, is_active, is_popular, latitude, longitude, sort_order) VALUES
-- Popular / High-demand localities
('b0000000-0000-0000-0000-000000000001', 'Malviya Nagar',       'malviya-nagar',        '302017', TRUE, TRUE,  26.85540000, 75.80820000, 1),
('b0000000-0000-0000-0000-000000000001', 'C-Scheme',            'c-scheme',              '302001', TRUE, TRUE,  26.91100000, 75.79300000, 2),
('b0000000-0000-0000-0000-000000000001', 'Vaishali Nagar',      'vaishali-nagar',        '302021', TRUE, TRUE,  26.91200000, 75.72700000, 3),
('b0000000-0000-0000-0000-000000000001', 'Jagatpura',           'jagatpura',             '302017', TRUE, TRUE,  26.82900000, 75.84300000, 4),
('b0000000-0000-0000-0000-000000000001', 'Mansarovar',          'mansarovar',            '302020', TRUE, TRUE,  26.87100000, 75.76200000, 5),
('b0000000-0000-0000-0000-000000000001', 'Tonk Road',           'tonk-road',             '302015', TRUE, TRUE,  26.86200000, 75.80100000, 6),
('b0000000-0000-0000-0000-000000000001', 'Ajmer Road',          'ajmer-road',            '302006', TRUE, TRUE,  26.90200000, 75.72900000, 7),
('b0000000-0000-0000-0000-000000000001', 'Pratap Nagar',        'pratap-nagar',          '302033', TRUE, TRUE,  26.82400000, 75.77800000, 8),
('b0000000-0000-0000-0000-000000000001', 'Nirman Nagar',        'nirman-nagar',          '302019', TRUE, TRUE,  26.89500000, 75.76300000, 9),
('b0000000-0000-0000-0000-000000000001', 'Raja Park',           'raja-park',             '302004', TRUE, TRUE,  26.90800000, 75.80900000, 10),

-- Established residential areas
('b0000000-0000-0000-0000-000000000001', 'Bani Park',           'bani-park',             '302016', TRUE, FALSE, 26.93100000, 75.78400000, 11),
('b0000000-0000-0000-0000-000000000001', 'Tilak Nagar',         'tilak-nagar',           '302004', TRUE, FALSE, 26.90800000, 75.81900000, 12),
('b0000000-0000-0000-0000-000000000001', 'Adarsh Nagar',        'adarsh-nagar',          '302004', TRUE, FALSE, 26.91900000, 75.80800000, 13),
('b0000000-0000-0000-0000-000000000001', 'Shastri Nagar',       'shastri-nagar',         '302016', TRUE, FALSE, 26.93700000, 75.78700000, 14),
('b0000000-0000-0000-0000-000000000001', 'Sodala',              'sodala',                '302019', TRUE, FALSE, 26.90000000, 75.76000000, 15),
('b0000000-0000-0000-0000-000000000001', 'Gopalpura',           'gopalpura',             '302018', TRUE, FALSE, 26.86500000, 75.78000000, 16),
('b0000000-0000-0000-0000-000000000001', 'Durgapura',           'durgapura',             '302018', TRUE, FALSE, 26.85600000, 75.78600000, 17),
('b0000000-0000-0000-0000-000000000001', 'Bapu Nagar',          'bapu-nagar',            '302015', TRUE, FALSE, 26.89600000, 75.81000000, 18),
('b0000000-0000-0000-0000-000000000001', 'Lal Kothi',           'lal-kothi',             '302015', TRUE, FALSE, 26.89200000, 75.79400000, 19),
('b0000000-0000-0000-0000-000000000001', 'Jhotwara',            'jhotwara',              '302012', TRUE, FALSE, 26.93800000, 75.73800000, 20),

-- Developing / Upcoming areas
('b0000000-0000-0000-0000-000000000001', 'Sitapura',            'sitapura',              '302022', TRUE, FALSE, 26.78600000, 75.84600000, 21),
('b0000000-0000-0000-0000-000000000001', 'Sanganer',            'sanganer',              '302029', TRUE, FALSE, 26.81600000, 75.79100000, 22),
('b0000000-0000-0000-0000-000000000001', 'Muhana',              'muhana',                '302029', TRUE, FALSE, 26.79800000, 75.80800000, 23),
('b0000000-0000-0000-0000-000000000001', 'Kalwar Road',         'kalwar-road',           '302012', TRUE, FALSE, 26.96800000, 75.73500000, 24),
('b0000000-0000-0000-0000-000000000001', 'Sirsi Road',          'sirsi-road',            '302012', TRUE, FALSE, 26.94600000, 75.72100000, 25),
('b0000000-0000-0000-0000-000000000001', 'New Sanganer Road',   'new-sanganer-road',     '302019', TRUE, FALSE, 26.87000000, 75.76800000, 26),
('b0000000-0000-0000-0000-000000000001', 'Khatipura',           'khatipura',             '302012', TRUE, FALSE, 26.94500000, 75.74900000, 27),

-- Premium / Upscale localities
('b0000000-0000-0000-0000-000000000001', 'Civil Lines',         'civil-lines',           '302006', TRUE, FALSE, 26.92300000, 75.78500000, 28),
('b0000000-0000-0000-0000-000000000001', 'Ashok Nagar',         'ashok-nagar',           '302001', TRUE, FALSE, 26.91100000, 75.78500000, 29),
('b0000000-0000-0000-0000-000000000001', 'Vidhyadhar Nagar',    'vidhyadhar-nagar',      '302039', TRUE, FALSE, 26.95100000, 75.77200000, 30),

-- Highway / Outskirt corridors
('b0000000-0000-0000-0000-000000000001', 'Jaipur-Delhi Highway','jaipur-delhi-highway',  '303012', TRUE, FALSE, 26.98500000, 75.83000000, 31),
('b0000000-0000-0000-0000-000000000001', 'Agra Road',           'agra-road',             '302031', TRUE, FALSE, 26.96000000, 75.82800000, 32),

-- Old city areas
('b0000000-0000-0000-0000-000000000001', 'Chandpole',           'chandpole',             '302001', TRUE, FALSE, 26.92200000, 75.81000000, 33),
('b0000000-0000-0000-0000-000000000001', 'Johari Bazaar',       'johari-bazaar',         '302003', TRUE, FALSE, 26.92000000, 75.82200000, 34),
('b0000000-0000-0000-0000-000000000001', 'Tripolia Bazaar',     'tripolia-bazaar',       '302002', TRUE, FALSE, 26.92400000, 75.82500000, 35),
('b0000000-0000-0000-0000-000000000001', 'Kishanpole',          'kishanpole',            '302001', TRUE, FALSE, 26.92100000, 75.81500000, 36),

-- Additional well-known areas
('b0000000-0000-0000-0000-000000000001', 'Mansarovar Extension','mansarovar-extension',  '302020', TRUE, FALSE, 26.86500000, 75.75000000, 37),
('b0000000-0000-0000-0000-000000000001', 'Kardhani',            'kardhani',              '302029', TRUE, FALSE, 26.80000000, 75.78300000, 38),
('b0000000-0000-0000-0000-000000000001', 'Murlipura',           'murlipura',             '302039', TRUE, FALSE, 26.95400000, 75.77000000, 39),
('b0000000-0000-0000-0000-000000000001', 'Ambabari',            'ambabari',              '302039', TRUE, FALSE, 26.94800000, 75.76300000, 40);
