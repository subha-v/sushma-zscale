-- ============================================================================
-- 22d-verify-fix-grapevine.sql
-- Verifies and fixes ALL Grapevine data in Supabase
-- Run this to ensure complete data for the Grapevine EDC demo
-- ============================================================================

-- ============================================================================
-- STEP 1: DIAGNOSTICS — Run first to see what's missing
-- ============================================================================

SELECT '--- DIAGNOSTICS ---' AS section;

-- Check arlington_employers
SELECT 'arlington_employers (Grapevine)' AS table_name, COUNT(*) AS count
FROM arlington_employers WHERE city = 'Grapevine';

-- Check businesses
SELECT 'businesses (Grapevine/48439)' AS table_name, COUNT(*) AS count
FROM businesses WHERE county_fips = '48439';

-- Check employer_monitoring for Grapevine employers
SELECT 'employer_monitoring (Grapevine)' AS table_name, COUNT(*) AS count
FROM employer_monitoring
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine');

-- Check site_selection_packages
SELECT 'site_selection_packages (Grapevine)' AS table_name, COUNT(*) AS count
FROM site_selection_packages WHERE company_name ILIKE '%grapevine%';

-- Check job openings
SELECT 'arlington_job_openings (Grapevine)' AS table_name, COUNT(*) AS count
FROM arlington_job_openings
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine');

-- Check industries
SELECT 'arlington_industries (Grapevine)' AS table_name, COUNT(*) AS count
FROM arlington_industries WHERE industry_name ILIKE '%grapevine%';

-- Check labor stats
SELECT 'arlington_labor_stats (Grapevine)' AS table_name, COUNT(*) AS count
FROM arlington_labor_stats WHERE geography = 'Grapevine, TX';

-- Check development projects
SELECT 'arlington_development (Grapevine)' AS table_name, COUNT(*) AS count
FROM arlington_development WHERE location_description ILIKE '%grapevine%';


-- ============================================================================
-- STEP 2: FIX BUSINESSES TABLE — Delete and re-insert to handle conflicts
-- ============================================================================

-- Delete existing Grapevine businesses (safe — only affects Grapevine records)
DELETE FROM businesses WHERE county_fips = '48439' AND city = 'Grapevine';

-- Re-insert all 8 Grapevine businesses with correct data
INSERT INTO businesses (company_name, county_fips, naics_code, company_size, employee_count, city, structural_risk_score, open_positions, is_active)
VALUES
  ('Gaylord Texan Resort', '48439', '721110', 'large', 2000, 'Grapevine', 0.10, 85, true),
  ('Baylor Scott & White - Grapevine', '48439', '622110', 'large', 2000, 'Grapevine', 0.08, 120, true),
  ('Grapevine Mills Mall (Simon)', '48439', '531120', 'large', 2000, 'Grapevine', 0.15, 95, true),
  ('Grapevine-Colleyville ISD', '48439', '611110', 'large', 1861, 'Grapevine', 0.22, 45, true),
  ('DFW Airport (Grapevine)', '48439', '488119', 'large', 1500, 'Grapevine', 0.05, 65, true),
  ('Paycom Grapevine', '48439', '511210', 'large', 1000, 'Grapevine', 0.08, 42, true),
  ('Kubota NA HQ', '48439', '333111', 'medium', 500, 'Grapevine', 0.12, 28, true),
  ('Great Wolf Lodge Grapevine', '48439', '721110', 'medium', 500, 'Grapevine', 0.18, 35, true);


-- ============================================================================
-- STEP 3: FIX EMPLOYER MONITORING — Delete and re-insert Grapevine alerts
-- ============================================================================

-- Delete existing Grapevine employer monitoring records
DELETE FROM employer_monitoring
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine');

-- Re-insert with correct 2026 dates
INSERT INTO employer_monitoring (employer_id, signal_type, signal_strength, title, description, source, is_acknowledged, detected_at)
VALUES
  ((SELECT id FROM arlington_employers WHERE company_name = 'Kubota North America HQ' LIMIT 1), 'expansion', 'strong', 'R&D center and dealer training facility expansion', 'Kubota expanding Grapevine campus with new R&D center and dealer training facility. Estimated 100+ new positions in engineering, product development, and training. Expansion leverages $51M campus investment.', 'Corporate press release + Grapevine EDC — March 2026', false, '2026-03-22'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Paycom' AND city = 'Grapevine' LIMIT 1), 'hiring_surge', 'strong', '40+ new positions — CEO cites DFW talent quality', 'Paycom Grapevine operations center posting 40+ positions across software engineering, client services, and data analytics. CEO cited DFW candidate quality and UTA/UNT pipeline as expansion drivers.', 'Job posting analysis + earnings call — Q1 2026', false, '2026-03-20'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Gaylord Texan Resort' LIMIT 1), 'expansion', 'strong', '$54M renovation underway, Vineyard Tower completed', 'Gaylord Texan completing $54M renovation of original property after opening $120M Vineyard Tower (303 rooms). Resort now has 1,814+ rooms. Hiring for expanded F&B, events, and guest services roles.', 'Community Impact + Marriott investor filings — Q1 2026', false, '2026-03-15'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'DFW International Airport' LIMIT 1), 'new_facility', 'critical', '$4B Terminal F — Phase 1 opening 2027', 'DFW Airport Board approved $4B Terminal F modernization, the largest airport capital program in the US. Phase 1 opens 2027. 5,000+ construction and 500+ permanent operations jobs. Will reshape Grapevine-side employment.', 'DFW Airport Board + Dallas Innovates — March 2026', false, '2026-03-18');


-- ============================================================================
-- STEP 4: FIX ALL REMAINING 2025 DATES in employer_monitoring (Arlington too)
-- ============================================================================

UPDATE employer_monitoring
SET detected_at = detected_at + INTERVAL '1 year'
WHERE detected_at >= '2025-01-01' AND detected_at < '2026-01-01';

UPDATE employer_monitoring
SET source = REPLACE(source, '2025', '2026')
WHERE source LIKE '%2025%';

UPDATE employer_monitoring
SET title = REPLACE(title, '2025', '2026')
WHERE title LIKE '%2025%';

UPDATE employer_monitoring
SET description = REPLACE(description, 'through 2025', 'through 2026')
WHERE description LIKE '%through 2025%';

UPDATE employer_monitoring
SET description = REPLACE(description, 'Q1 2025', 'Q1 2026')
WHERE description LIKE '%Q1 2025%';

UPDATE employer_monitoring
SET description = REPLACE(description, '2025-2026', '2026-2027')
WHERE description LIKE '%2025-2026%';

-- Fix job posting dates too
UPDATE arlington_job_openings
SET posted_date = posted_date + INTERVAL '1 year'
WHERE posted_date >= '2025-01-01' AND posted_date < '2026-01-01';


-- ============================================================================
-- STEP 5: FINAL VERIFICATION — Expected counts
-- ============================================================================

SELECT '--- FINAL VERIFICATION ---' AS section;

SELECT 'businesses (Grapevine)' AS check_item, COUNT(*) AS count,
  CASE WHEN COUNT(*) = 8 THEN 'OK' ELSE 'MISSING' END AS status
FROM businesses WHERE county_fips = '48439' AND city = 'Grapevine'

UNION ALL
SELECT 'employer_monitoring (Grapevine)', COUNT(*),
  CASE WHEN COUNT(*) = 4 THEN 'OK' ELSE 'MISSING' END
FROM employer_monitoring
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine')

UNION ALL
SELECT 'arlington_employers (Grapevine)', COUNT(*),
  CASE WHEN COUNT(*) >= 10 THEN 'OK' ELSE 'MISSING' END
FROM arlington_employers WHERE city = 'Grapevine'

UNION ALL
SELECT 'arlington_job_openings (Grapevine)', COUNT(*),
  CASE WHEN COUNT(*) >= 10 THEN 'OK' ELSE 'MISSING' END
FROM arlington_job_openings
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine')

UNION ALL
SELECT 'alerts with 2025 dates', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'NEEDS FIX' END
FROM employer_monitoring WHERE detected_at < '2026-01-01'

UNION ALL
SELECT 'source text with 2025', COUNT(*),
  CASE WHEN COUNT(*) = 0 THEN 'OK' ELSE 'NEEDS FIX' END
FROM employer_monitoring WHERE source LIKE '%2025%';

-- Show all Grapevine businesses
SELECT '--- GRAPEVINE BUSINESSES ---' AS section;
SELECT company_name, employee_count, open_positions, structural_risk_score, is_active
FROM businesses WHERE county_fips = '48439' ORDER BY employee_count DESC;

-- Show all Grapevine employer alerts
SELECT '--- GRAPEVINE ALERTS ---' AS section;
SELECT ae.company_name, em.signal_type, em.signal_strength, em.title, em.detected_at, em.source
FROM employer_monitoring em
JOIN arlington_employers ae ON em.employer_id = ae.id
WHERE ae.city = 'Grapevine'
ORDER BY em.detected_at DESC;
