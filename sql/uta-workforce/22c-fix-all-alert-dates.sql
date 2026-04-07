-- ============================================================================
-- 22c-fix-all-alert-dates.sql
-- Updates ALL employer_monitoring records from 2025 → 2026
-- Fixes both detected_at timestamps AND source text
-- ============================================================================

-- Step 1: Update detected_at dates for ALL alerts still in 2025
UPDATE employer_monitoring
SET detected_at = detected_at + INTERVAL '1 year'
WHERE detected_at >= '2025-01-01' AND detected_at < '2026-01-01';

-- Step 2: Fix source text — replace all year references
UPDATE employer_monitoring
SET source = REPLACE(source, '2025', '2026')
WHERE source LIKE '%2025%';

-- Step 3: Fix title text that references years
UPDATE employer_monitoring
SET title = REPLACE(title, '2025', '2026')
WHERE title LIKE '%2025%';

-- Step 4: Fix description text that references years
UPDATE employer_monitoring
SET description = REPLACE(description, 'through 2025', 'through 2026')
WHERE description LIKE '%through 2025%';

UPDATE employer_monitoring
SET description = REPLACE(description, 'Q1 2025', 'Q1 2026')
WHERE description LIKE '%Q1 2025%';

UPDATE employer_monitoring
SET description = REPLACE(description, '2025-2026', '2026-2027')
WHERE description LIKE '%2025-2026%';

-- Step 5: Also fix job posting dates for ALL employers (not just Grapevine)
UPDATE arlington_job_openings
SET posted_date = posted_date + INTERVAL '1 year'
WHERE posted_date >= '2025-01-01' AND posted_date < '2026-01-01';

-- Verify everything
SELECT 'Alerts with 2026 dates' AS check_type, COUNT(*) AS count
FROM employer_monitoring WHERE detected_at >= '2026-01-01'
UNION ALL
SELECT 'Alerts still with 2025 dates', COUNT(*)
FROM employer_monitoring WHERE detected_at >= '2025-01-01' AND detected_at < '2026-01-01'
UNION ALL
SELECT 'Source text still has 2025', COUNT(*)
FROM employer_monitoring WHERE source LIKE '%2025%'
UNION ALL
SELECT 'Jobs with 2026 dates', COUNT(*)
FROM arlington_job_openings WHERE posted_date >= '2026-01-01'
UNION ALL
SELECT 'Jobs still with 2025 dates', COUNT(*)
FROM arlington_job_openings WHERE posted_date >= '2025-01-01' AND posted_date < '2026-01-01';
