-- ============================================================================
-- PREDICTION VERIFICATION QUERIES
-- Run AFTER 13-17 SQL files to verify data integrity
-- ============================================================================

-- ============================================================================
-- 1. ROW COUNTS
-- ============================================================================
SELECT 'cip_soc_crosswalk' AS table_name, COUNT(*) AS row_count FROM cip_soc_crosswalk
UNION ALL
SELECT 'bls_occupation_projections', COUNT(*) FROM bls_occupation_projections
UNION ALL
SELECT 'skills_catalog', COUNT(*) FROM skills_catalog
UNION ALL
SELECT 'skills_trend_snapshots', COUNT(*) FROM skills_trend_snapshots
UNION ALL
SELECT 'program_predictions', COUNT(*) FROM program_predictions
UNION ALL
SELECT 'employer_predictions', COUNT(*) FROM employer_predictions
UNION ALL
SELECT 'salary_predictions', COUNT(*) FROM salary_predictions
UNION ALL
SELECT 'prediction_accuracy_log', COUNT(*) FROM prediction_accuracy_log
ORDER BY table_name;

-- ============================================================================
-- 2. CROSSWALK COVERAGE — CIP codes in uta_programs that have SOC mappings
-- ============================================================================
SELECT
  p.cip_code,
  p.program_name,
  COUNT(c.soc_code) AS mapped_soc_codes,
  ARRAY_AGG(c.soc_title) AS occupation_titles
FROM uta_programs p
LEFT JOIN cip_soc_crosswalk c ON p.cip_code = c.cip_code
WHERE p.is_active = true
GROUP BY p.cip_code, p.program_name
ORDER BY mapped_soc_codes DESC;

-- ============================================================================
-- 3. PROGRAM PREDICTION DETAILS — Top programs by score
-- ============================================================================
SELECT
  p.program_name,
  p.degree_type,
  pp.overall_score,
  pp.employment_outlook_score,
  pp.salary_growth_score,
  pp.skills_alignment_score,
  pp.employer_demand_score,
  pp.confidence_level,
  sp.current_median_salary,
  sp.year_5_projected AS salary_5yr,
  sp.annual_growth_rate
FROM program_predictions pp
JOIN uta_programs p ON pp.program_id = p.id
LEFT JOIN salary_predictions sp ON sp.program_id = p.id
ORDER BY pp.overall_score DESC;

-- ============================================================================
-- 4. EMPLOYER OUTLOOK SUMMARY
-- ============================================================================
SELECT
  e.company_name,
  e.industry,
  ep.hiring_outlook,
  ep.projected_openings_6mo,
  ep.projected_openings_12mo,
  ep.industry_growth_rate,
  ep.confidence_level
FROM employer_predictions ep
JOIN arlington_employers e ON ep.employer_id = e.id
ORDER BY ep.projected_openings_12mo DESC;

-- ============================================================================
-- 5. EMERGING SKILLS WITH TREND DATA
-- ============================================================================
SELECT
  sc.skill_name,
  sc.skill_category,
  sc.is_emerging,
  COUNT(sts.id) AS snapshot_count,
  MAX(sts.posting_percentage) AS peak_posting_pct,
  MAX(sts.avg_salary_with_skill) AS max_avg_salary
FROM skills_catalog sc
LEFT JOIN skills_trend_snapshots sts ON sts.skill_id = sc.id
WHERE sc.is_emerging = true
GROUP BY sc.id, sc.skill_name, sc.skill_category, sc.is_emerging
ORDER BY peak_posting_pct DESC NULLS LAST;

-- ============================================================================
-- 6. BLS OUTLOOK DISTRIBUTION
-- ============================================================================
SELECT
  job_outlook,
  COUNT(*) AS occupation_count,
  ROUND(AVG(change_percent), 2) AS avg_change_pct,
  ROUND(AVG(median_annual_wage), 0) AS avg_median_wage
FROM bls_occupation_projections
GROUP BY job_outlook
ORDER BY avg_change_pct DESC;

-- ============================================================================
-- 7. CROSS-TABLE JOIN TEST — Program → CIP → SOC → BLS projections
-- ============================================================================
SELECT
  p.program_name,
  p.degree_type,
  c.soc_code,
  c.soc_title,
  b.change_percent AS bls_growth_pct,
  b.median_annual_wage AS bls_median_wage,
  b.job_outlook
FROM uta_programs p
JOIN cip_soc_crosswalk c ON p.cip_code = c.cip_code AND c.match_quality = 'primary'
JOIN bls_occupation_projections b ON c.soc_code = b.soc_code
WHERE p.is_active = true
ORDER BY b.change_percent DESC;
