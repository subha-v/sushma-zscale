-- ============================================================================
-- PREDICTIVE ANALYTICS VIEWS
-- Run AFTER 13-prediction-schema.sql
-- ============================================================================

-- ============================================================================
-- 1. PROGRAM PREDICTION DETAILS
-- Joins predictions with program info, outcomes, and college
-- ============================================================================
CREATE OR REPLACE VIEW v_program_prediction_details AS
SELECT
  pp.id AS prediction_id,
  pp.program_id,
  p.program_name,
  p.degree_type,
  p.degree_level,
  p.cip_code,
  p.is_stem,
  c.college_name,
  c.abbreviation AS college_abbreviation,
  pp.overall_score,
  pp.employment_outlook_score,
  pp.salary_growth_score,
  pp.skills_alignment_score,
  pp.employer_demand_score,
  pp.industry_growth_score,
  pp.confidence_level,
  pp.prediction_date,
  po.median_starting_salary,
  po.median_mid_career_salary,
  po.employment_rate,
  po.graduation_rate,
  po.top_employers,
  po.top_job_titles
FROM program_predictions pp
JOIN uta_programs p ON pp.program_id = p.id
JOIN uta_colleges c ON p.college_id = c.id
LEFT JOIN uta_program_outcomes po ON po.program_id = p.id
WHERE p.is_active = true
ORDER BY pp.overall_score DESC;

-- ============================================================================
-- 2. EMERGING SKILLS VIEW
-- Skills flagged as emerging with latest trend data
-- ============================================================================
CREATE OR REPLACE VIEW v_emerging_skills AS
SELECT
  sc.id AS skill_id,
  sc.skill_name,
  sc.skill_category,
  sc.first_seen_date,
  sc.description,
  sts.snapshot_date AS latest_snapshot,
  sts.job_posting_count,
  sts.posting_percentage,
  sts.avg_salary_with_skill
FROM skills_catalog sc
LEFT JOIN LATERAL (
  SELECT *
  FROM skills_trend_snapshots s
  WHERE s.skill_id = sc.id
  ORDER BY s.snapshot_date DESC
  LIMIT 1
) sts ON true
WHERE sc.is_emerging = true
ORDER BY sts.posting_percentage DESC NULLS LAST;

-- ============================================================================
-- 3. DECLINING SKILLS VIEW
-- Skills flagged as declining with latest trend data
-- ============================================================================
CREATE OR REPLACE VIEW v_declining_skills AS
SELECT
  sc.id AS skill_id,
  sc.skill_name,
  sc.skill_category,
  sc.first_seen_date,
  sc.description,
  sts.snapshot_date AS latest_snapshot,
  sts.job_posting_count,
  sts.posting_percentage,
  sts.avg_salary_with_skill
FROM skills_catalog sc
LEFT JOIN LATERAL (
  SELECT *
  FROM skills_trend_snapshots s
  WHERE s.skill_id = sc.id
  ORDER BY s.snapshot_date DESC
  LIMIT 1
) sts ON true
WHERE sc.is_declining = true
ORDER BY sts.posting_percentage ASC NULLS LAST;

-- ============================================================================
-- 4. PROGRAM COMPARISON VIEW
-- Wide view for side-by-side program comparison
-- ============================================================================
CREATE OR REPLACE VIEW v_program_comparison AS
SELECT
  p.id AS program_id,
  p.program_name,
  p.degree_type,
  p.degree_level,
  p.is_stem,
  c.college_name,
  -- Current outcomes
  po.median_starting_salary,
  po.median_mid_career_salary,
  po.employment_rate,
  po.graduation_rate,
  po.total_graduates,
  -- Prediction scores
  pp.overall_score,
  pp.employment_outlook_score,
  pp.salary_growth_score,
  pp.skills_alignment_score,
  pp.employer_demand_score,
  pp.confidence_level,
  -- Salary projections
  sp.year_1_projected AS salary_year_1,
  sp.year_3_projected AS salary_year_3,
  sp.year_5_projected AS salary_year_5,
  sp.year_10_projected AS salary_year_10,
  sp.annual_growth_rate AS salary_annual_growth,
  -- Skills counts
  (SELECT COUNT(*) FROM uta_skills_alignment sa WHERE sa.program_id = p.id AND sa.gap_status = 'aligned') AS skills_aligned_count,
  (SELECT COUNT(*) FROM uta_skills_alignment sa WHERE sa.program_id = p.id AND sa.gap_status = 'gap') AS skills_gap_count,
  -- Partnership counts
  (SELECT COUNT(*) FROM uta_employer_partnerships ep WHERE ep.program_id = p.id AND ep.is_active = true) AS active_partnerships
FROM uta_programs p
JOIN uta_colleges c ON p.college_id = c.id
LEFT JOIN uta_program_outcomes po ON po.program_id = p.id
LEFT JOIN program_predictions pp ON pp.program_id = p.id
LEFT JOIN salary_predictions sp ON sp.program_id = p.id
WHERE p.is_active = true
ORDER BY pp.overall_score DESC NULLS LAST;
