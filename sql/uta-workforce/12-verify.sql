-- ============================================================================
-- VERIFICATION QUERIES - Run after all data files (01-11)
-- Confirms data integrity and expected row counts
-- ============================================================================

-- ============================================================================
-- 1. ROW COUNTS
-- ============================================================================
SELECT 'uta_colleges' AS table_name, COUNT(*) AS row_count, 10 AS expected FROM uta_colleges
UNION ALL
SELECT 'uta_programs', COUNT(*), 170 FROM uta_programs
UNION ALL
SELECT 'uta_program_outcomes', COUNT(*), 30 FROM uta_program_outcomes
UNION ALL
SELECT 'arlington_employers', COUNT(*), 55 FROM arlington_employers
UNION ALL
SELECT 'arlington_job_openings', COUNT(*), 75 FROM arlington_job_openings
UNION ALL
SELECT 'arlington_development', COUNT(*), 15 FROM arlington_development
UNION ALL
SELECT 'arlington_industries', COUNT(*), 18 FROM arlington_industries
UNION ALL
SELECT 'uta_employer_partnerships', COUNT(*), 50 FROM uta_employer_partnerships
UNION ALL
SELECT 'uta_skills_alignment', COUNT(*), 85 FROM uta_skills_alignment
UNION ALL
SELECT 'arlington_labor_stats', COUNT(*), 55 FROM arlington_labor_stats
ORDER BY table_name;

-- ============================================================================
-- 2. FOREIGN KEY INTEGRITY - Check for orphaned records
-- ============================================================================
-- Programs without valid college
SELECT 'Orphaned programs (no college)' AS check_name,
  COUNT(*) AS issues
FROM uta_programs p
LEFT JOIN uta_colleges c ON p.college_id = c.id
WHERE c.id IS NULL;

-- Outcomes without valid program
SELECT 'Orphaned outcomes (no program)' AS check_name,
  COUNT(*) AS issues
FROM uta_program_outcomes o
LEFT JOIN uta_programs p ON o.program_id = p.id
WHERE p.id IS NULL;

-- Partnerships without valid program or employer
SELECT 'Orphaned partnerships (no program)' AS check_name,
  COUNT(*) AS issues
FROM uta_employer_partnerships ep
LEFT JOIN uta_programs p ON ep.program_id = p.id
WHERE p.id IS NULL;

SELECT 'Orphaned partnerships (no employer)' AS check_name,
  COUNT(*) AS issues
FROM uta_employer_partnerships ep
LEFT JOIN arlington_employers e ON ep.employer_id = e.id
WHERE e.id IS NULL;

-- Skills without valid program or industry
SELECT 'Orphaned skills (no program)' AS check_name,
  COUNT(*) AS issues
FROM uta_skills_alignment sa
LEFT JOIN uta_programs p ON sa.program_id = p.id
WHERE p.id IS NULL;

SELECT 'Orphaned skills (no industry)' AS check_name,
  COUNT(*) AS issues
FROM uta_skills_alignment sa
LEFT JOIN arlington_industries i ON sa.industry_id = i.id
WHERE i.id IS NULL;

-- ============================================================================
-- 3. SAMPLE CROSS-TABLE QUERIES (what the AI agent would run)
-- ============================================================================

-- "What engineering programs does UTA offer?"
SELECT p.program_name, p.degree_type, p.degree_level, p.is_stem, p.credit_hours
FROM uta_programs p
JOIN uta_colleges c ON p.college_id = c.id
WHERE c.college_name = 'College of Engineering'
ORDER BY p.degree_level, p.program_name;

-- "What's the average starting salary for UTA nursing graduates?"
SELECT p.program_name, p.degree_type, o.median_starting_salary, o.employment_rate, o.graduation_rate
FROM uta_program_outcomes o
JOIN uta_programs p ON o.program_id = p.id
WHERE p.program_name LIKE '%Nursing%'
ORDER BY o.median_starting_salary DESC;

-- "Which employers hire UTA grads?"
SELECT company_name, industry, employee_count, city
FROM arlington_employers
WHERE hires_uta_grads = true
ORDER BY employee_count DESC
LIMIT 20;

-- "What are the top-paying jobs available for CS graduates?"
SELECT jo.job_title, e.company_name, jo.salary_min, jo.salary_max, jo.education_required
FROM arlington_job_openings jo
JOIN arlington_employers e ON jo.employer_id = e.id
WHERE 'Python' = ANY(jo.required_skills) OR 'Java' = ANY(jo.required_skills)
ORDER BY jo.salary_max DESC
LIMIT 10;

-- "What skills gaps exist in CS vs local tech industry?"
SELECT sa.skill_name, sa.skill_category, sa.demand_level, sa.gap_status,
       sa.program_teaches, sa.industry_demands
FROM uta_skills_alignment sa
JOIN uta_programs p ON sa.program_id = p.id
JOIN arlington_industries i ON sa.industry_id = i.id
WHERE p.program_name = 'Computer Science' AND p.degree_type = 'BS'
ORDER BY sa.gap_status DESC, sa.demand_level DESC;

-- "What economic development projects are creating jobs?"
SELECT project_name, investment_amount, estimated_jobs, status, industries_impacted
FROM arlington_development
WHERE status IN ('under_construction', 'operational')
ORDER BY estimated_jobs DESC;

-- "What partnerships does the nursing program have?"
SELECT e.company_name, ep.partnership_type, ep.avg_hires_per_year, ep.description
FROM uta_employer_partnerships ep
JOIN arlington_employers e ON ep.employer_id = e.id
JOIN uta_programs p ON ep.program_id = p.id
WHERE p.program_name = 'Nursing' AND p.degree_type = 'BSN'
ORDER BY ep.avg_hires_per_year DESC NULLS LAST;

-- "What's the labor market like in Arlington?"
SELECT metric_name, metric_value, metric_unit, time_period, data_source
FROM arlington_labor_stats
WHERE metric_category = 'employment'
ORDER BY metric_name;

-- ============================================================================
-- VERIFICATION COMPLETE
-- All queries should return results without errors
-- Row counts should approximately match expected values
-- FK integrity checks should all show 0 issues
-- ============================================================================
