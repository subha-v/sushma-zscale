-- ============================================================================
-- 22b-grapevine-date-fix.sql
-- Updates all 2025 dates to 2026 in existing Grapevine records
-- Run AFTER 22-grapevine-data.sql has already been inserted
-- ============================================================================

-- Fix job posting dates (Grapevine employers only)
UPDATE arlington_job_openings
SET posted_date = posted_date + INTERVAL '1 year'
WHERE employer_id IN (
  SELECT id FROM arlington_employers WHERE city = 'Grapevine'
)
AND posted_date >= '2025-01-01' AND posted_date < '2026-01-01';

-- Fix employer monitoring alert dates and source text
UPDATE employer_monitoring
SET
  detected_at = detected_at + INTERVAL '1 year',
  source = REPLACE(REPLACE(source, '2025', '2026'), 'Q1 2025', 'Q1 2026')
WHERE employer_id IN (
  SELECT id FROM arlington_employers WHERE city = 'Grapevine'
)
AND detected_at >= '2025-01-01' AND detected_at < '2026-01-01';

-- Verify the updates
SELECT 'Job Openings Updated' AS check_type, COUNT(*) AS count
FROM arlington_job_openings
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine')
AND posted_date >= '2026-01-01'
UNION ALL
SELECT 'Employer Alerts Updated', COUNT(*)
FROM employer_monitoring
WHERE employer_id IN (SELECT id FROM arlington_employers WHERE city = 'Grapevine')
AND detected_at >= '2026-01-01';
