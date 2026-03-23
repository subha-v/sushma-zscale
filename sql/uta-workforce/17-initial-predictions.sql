-- ============================================================================
-- INITIAL PREDICTION SEED DATA
-- Seeds program_predictions, employer_predictions, salary_predictions,
-- skills_catalog, and skills_trend_snapshots
-- Run AFTER 13-16 SQL files
-- ============================================================================

-- ============================================================================
-- SKILLS CATALOG — ~30 skills with emerging/declining flags
-- ============================================================================
INSERT INTO skills_catalog (skill_name, skill_category, is_emerging, is_declining, description) VALUES
-- Emerging skills
('Generative AI / LLMs', 'ai_ml', true, false, 'Building applications with large language models (GPT, Claude, Gemini)'),
('Prompt Engineering', 'ai_ml', true, false, 'Designing effective prompts for AI models'),
('Kubernetes', 'cloud_infrastructure', true, false, 'Container orchestration for microservices'),
('Terraform', 'devops', true, false, 'Infrastructure as Code (IaC) for cloud provisioning'),
('Rust', 'programming', true, false, 'Systems programming language with memory safety'),
('MLOps', 'ai_ml', true, false, 'Operationalizing machine learning models in production'),
('Cybersecurity (Zero Trust)', 'cybersecurity', true, false, 'Zero-trust security architecture and implementation'),
('Data Engineering (dbt/Spark)', 'data_science', true, false, 'Building and managing data pipelines at scale'),
('React/Next.js', 'programming', true, false, 'Modern frontend frameworks for web applications'),
('Cloud Architecture (Multi-Cloud)', 'cloud_infrastructure', true, false, 'Designing systems across AWS, Azure, and GCP'),
('Robotic Process Automation', 'ai_ml', true, false, 'Automating repetitive business processes'),
('Telehealth Systems', 'healthcare', true, false, 'Virtual healthcare delivery platforms'),

-- Declining skills
('jQuery', 'programming', false, true, 'Legacy JavaScript library being replaced by modern frameworks'),
('COBOL', 'programming', false, true, 'Legacy mainframe language with shrinking demand'),
('On-Premise Server Admin', 'cloud_infrastructure', false, true, 'Being replaced by cloud infrastructure management'),
('Manual QA Testing', 'other', false, true, 'Being replaced by automated testing frameworks'),
('Flash/ActionScript', 'programming', false, true, 'Deprecated multimedia platform'),

-- Stable/core skills (neither emerging nor declining)
('Python', 'programming', false, false, 'General-purpose programming language'),
('SQL', 'data_science', false, false, 'Database query language'),
('Java', 'programming', false, false, 'Enterprise programming language'),
('JavaScript/TypeScript', 'programming', false, false, 'Web development languages'),
('AWS', 'cloud_infrastructure', false, false, 'Amazon Web Services cloud platform'),
('Machine Learning', 'ai_ml', false, false, 'Statistical learning algorithms'),
('Docker', 'devops', false, false, 'Containerization platform'),
('Agile/Scrum', 'project_management', false, false, 'Agile project management methodology'),
('Patient Assessment', 'healthcare', false, false, 'Clinical patient evaluation skills'),
('Financial Analysis', 'business', false, false, 'Financial modeling and analysis'),
('AutoCAD', 'engineering', false, false, 'Computer-aided design software'),
('MATLAB', 'engineering', false, false, 'Numerical computing environment'),
('Six Sigma', 'project_management', false, false, 'Quality management methodology')
ON CONFLICT (skill_name) DO NOTHING;

-- ============================================================================
-- SKILLS TREND SNAPSHOTS — 4 weeks of data for emerging skills
-- ============================================================================
INSERT INTO skills_trend_snapshots (skill_id, snapshot_date, job_posting_count, posting_percentage, avg_salary_with_skill, region)
SELECT sc.id, '2026-03-01'::date, counts.count_w1, counts.pct_w1, counts.salary, 'DFW'
FROM skills_catalog sc
JOIN (VALUES
  ('Generative AI / LLMs', 245, 8.2, 142000),
  ('Prompt Engineering', 128, 4.3, 135000),
  ('Kubernetes', 310, 10.3, 138000),
  ('Terraform', 185, 6.2, 134000),
  ('Rust', 62, 2.1, 145000),
  ('MLOps', 95, 3.2, 140000),
  ('Cybersecurity (Zero Trust)', 175, 5.8, 132000),
  ('Data Engineering (dbt/Spark)', 220, 7.3, 136000),
  ('React/Next.js', 380, 12.7, 125000),
  ('Cloud Architecture (Multi-Cloud)', 155, 5.2, 148000),
  ('Python', 890, 29.7, 128000),
  ('SQL', 750, 25.0, 118000),
  ('Machine Learning', 310, 10.3, 142000)
) AS counts(name, count_w1, pct_w1, salary) ON sc.skill_name = counts.name
ON CONFLICT (skill_id, snapshot_date, region) DO NOTHING;

INSERT INTO skills_trend_snapshots (skill_id, snapshot_date, job_posting_count, posting_percentage, avg_salary_with_skill, region)
SELECT sc.id, '2026-03-08'::date, counts.count_w2, counts.pct_w2, counts.salary, 'DFW'
FROM skills_catalog sc
JOIN (VALUES
  ('Generative AI / LLMs', 268, 8.9, 143000),
  ('Prompt Engineering', 142, 4.7, 136000),
  ('Kubernetes', 318, 10.6, 139000),
  ('Terraform', 192, 6.4, 135000),
  ('Rust', 68, 2.3, 146000),
  ('MLOps', 102, 3.4, 141000),
  ('Cybersecurity (Zero Trust)', 182, 6.1, 133000),
  ('Data Engineering (dbt/Spark)', 235, 7.8, 137000),
  ('React/Next.js', 392, 13.1, 126000),
  ('Cloud Architecture (Multi-Cloud)', 163, 5.4, 149000),
  ('Python', 905, 30.2, 129000),
  ('SQL', 745, 24.8, 118000),
  ('Machine Learning', 325, 10.8, 143000)
) AS counts(name, count_w2, pct_w2, salary) ON sc.skill_name = counts.name
ON CONFLICT (skill_id, snapshot_date, region) DO NOTHING;

INSERT INTO skills_trend_snapshots (skill_id, snapshot_date, job_posting_count, posting_percentage, avg_salary_with_skill, region)
SELECT sc.id, '2026-03-15'::date, counts.count_w3, counts.pct_w3, counts.salary, 'DFW'
FROM skills_catalog sc
JOIN (VALUES
  ('Generative AI / LLMs', 290, 9.5, 144000),
  ('Prompt Engineering', 155, 5.1, 137000),
  ('Kubernetes', 325, 10.7, 139000),
  ('Terraform', 198, 6.5, 135000),
  ('Rust', 72, 2.4, 147000),
  ('MLOps', 110, 3.6, 142000),
  ('Cybersecurity (Zero Trust)', 190, 6.2, 134000),
  ('Data Engineering (dbt/Spark)', 248, 8.1, 138000),
  ('React/Next.js', 405, 13.3, 127000),
  ('Cloud Architecture (Multi-Cloud)', 170, 5.6, 150000),
  ('Python', 918, 30.1, 129000),
  ('SQL', 740, 24.3, 119000),
  ('Machine Learning', 338, 11.1, 144000)
) AS counts(name, count_w3, pct_w3, salary) ON sc.skill_name = counts.name
ON CONFLICT (skill_id, snapshot_date, region) DO NOTHING;

-- ============================================================================
-- PROGRAM PREDICTIONS — Score each UTA program
-- Uses subquery references by program name (not hardcoded UUIDs)
-- ============================================================================
INSERT INTO program_predictions (program_id, prediction_date, overall_score, employment_outlook_score, salary_growth_score, skills_alignment_score, employer_demand_score, industry_growth_score, confidence_level, methodology_notes)
SELECT p.id, '2026-03-22'::date, scores.overall, scores.emp_outlook, scores.sal_growth, scores.skills_align, scores.emp_demand, scores.ind_growth, scores.confidence, scores.notes
FROM uta_programs p
JOIN (VALUES
  ('Computer Science', 'bachelor', 'BS', 88.5, 92.0, 85.0, 82.0, 90.0, 88.0, 'high', 'BLS projects 26% growth for software developers. Strong DFW tech demand.'),
  ('Software Engineering', 'bachelor', 'BS', 86.2, 90.0, 84.0, 80.0, 88.0, 85.0, 'high', 'Nearly identical outlook to CS with strong industry demand.'),
  ('Nursing', 'bachelor', 'BSN', 85.8, 78.0, 82.0, 95.0, 92.0, 80.0, 'high', 'Steady healthcare demand. Highest employment rate at UTA.'),
  ('Data Science', 'bachelor', 'BS', 84.5, 95.0, 88.0, 78.0, 80.0, 85.0, 'high', 'BLS projects 35% growth. Emerging field with rapidly growing demand.'),
  ('Aerospace Engineering', 'bachelor', 'BS', 79.3, 72.0, 78.0, 75.0, 85.0, 82.0, 'medium', 'Stable aerospace sector in DFW. Lockheed Martin & Bell are major employers.'),
  ('Mechanical Engineering', 'bachelor', 'BS', 72.8, 60.0, 72.0, 70.0, 78.0, 75.0, 'medium', 'BLS projects minimal growth (1.3%). DFW manufacturing provides local demand.'),
  ('Finance', 'bachelor', 'BBA', 71.5, 75.0, 70.0, 65.0, 72.0, 68.0, 'medium', 'Financial analyst roles growing 9.5%. Fintech creating new opportunities.'),
  ('Accounting', 'bachelor', 'BBA', 65.2, 55.0, 60.0, 68.0, 70.0, 62.0, 'medium', 'Minimal BLS growth (0.5%). AI automation affecting entry-level roles.'),
  ('Biology', 'bachelor', 'BS', 62.0, 58.0, 55.0, 60.0, 65.0, 70.0, 'medium', 'Limited bachelor-level growth. Best outcomes with graduate education.')
) AS scores(prog_name, deg_level, deg_type, overall, emp_outlook, sal_growth, skills_align, emp_demand, ind_growth, confidence, notes)
ON p.program_name = scores.prog_name AND p.degree_level = scores.deg_level AND p.degree_type = scores.deg_type
ON CONFLICT (program_id, prediction_date) DO NOTHING;

-- ============================================================================
-- SALARY PREDICTIONS — Salary trajectory for each program
-- ============================================================================
INSERT INTO salary_predictions (program_id, prediction_date, current_median_salary, year_1_projected, year_3_projected, year_5_projected, year_10_projected, annual_growth_rate, confidence_level, methodology)
SELECT p.id, '2026-03-22'::date, sal.current_sal, sal.y1, sal.y3, sal.y5, sal.y10, sal.growth, sal.confidence, sal.method
FROM uta_programs p
JOIN (VALUES
  ('Computer Science', 'bachelor', 'BS', 68300, 72400, 82500, 95000, 130000, 4.8, 'high', 'BLS + industry salary surveys. Strong demand drives above-average growth.'),
  ('Software Engineering', 'bachelor', 'BS', 67500, 71600, 81500, 93800, 128000, 4.7, 'high', 'Similar trajectory to CS. Full-stack and DevOps roles command premiums.'),
  ('Nursing', 'bachelor', 'BSN', 70300, 73200, 79800, 86500, 98000, 3.2, 'high', 'Steady wage growth driven by nursing shortage. NP path accelerates earnings.'),
  ('Data Science', 'bachelor', 'BS', 65000, 70200, 83500, 98000, 135000, 5.5, 'high', 'Fastest salary growth due to AI/ML demand. Specialists earn 20-30% premium.'),
  ('Aerospace Engineering', 'bachelor', 'BS', 66000, 69300, 76800, 85000, 110000, 3.8, 'medium', 'Defense sector provides steady wage growth. Clearance holders earn more.'),
  ('Mechanical Engineering', 'bachelor', 'BS', 64800, 67500, 74200, 82000, 105000, 3.5, 'medium', 'Manufacturing modernization and EV transition sustain demand.'),
  ('Finance', 'bachelor', 'BBA', 56000, 59400, 67800, 78000, 105000, 4.6, 'medium', 'CFA/fintech specialization accelerates mid-career growth.'),
  ('Accounting', 'bachelor', 'BBA', 56000, 58000, 63500, 70000, 92000, 3.0, 'medium', 'CPA credential essential. Automation risk at entry level.'),
  ('Biology', 'bachelor', 'BS', 42000, 44100, 49500, 56000, 75000, 3.8, 'low', 'Bachelor-level salaries modest. Graduate degree significantly boosts trajectory.')
) AS sal(prog_name, deg_level, deg_type, current_sal, y1, y3, y5, y10, growth, confidence, method)
ON p.program_name = sal.prog_name AND p.degree_level = sal.deg_level AND p.degree_type = sal.deg_type
ON CONFLICT (program_id, prediction_date) DO NOTHING;

-- ============================================================================
-- EMPLOYER PREDICTIONS — Hiring outlook for major employers
-- ============================================================================
INSERT INTO employer_predictions (employer_id, prediction_date, hiring_outlook, projected_openings_6mo, projected_openings_12mo, industry_growth_rate, confidence_level, factors)
SELECT e.id, '2026-03-22'::date, pred.outlook, pred.open_6mo, pred.open_12mo, pred.growth, pred.confidence, pred.factors_json
FROM arlington_employers e
JOIN (VALUES
  ('General Motors Arlington Assembly', 'stable', 45, 80, 2.1, 'medium',
   '{"ev_transition": "Creating new roles in battery/electric systems", "automation": "Reducing some assembly positions", "plant_investment": "$500M+ modernization complete"}'::jsonb),
  ('Texas Health Resources', 'rapidly_growing', 120, 250, 4.2, 'high',
   '{"nursing_shortage": "Critical shortage driving aggressive hiring", "aging_population": "Increasing demand for services", "telehealth": "Expanding virtual care positions"}'::jsonb),
  ('Arlington ISD', 'stable', 35, 65, 1.5, 'medium',
   '{"enrollment": "Stable enrollment trends", "stem_initiative": "New STEM teacher positions", "turnover": "Teacher retention challenges"}'::jsonb),
  ('D.R. Horton', 'growing', 30, 55, 3.8, 'medium',
   '{"housing_demand": "DFW population growth driving demand", "interest_rates": "Rate uncertainty creates volatility", "technology": "Adopting construction tech"}'::jsonb),
  ('Bell Textron', 'growing', 55, 100, 3.5, 'high',
   '{"v280_valor": "V-280 Valor FLRAA contract driving hiring", "future_vertical_lift": "DOD investment in next-gen rotorcraft", "engineering": "Strong demand for AeroE and ME"}'::jsonb),
  ('Lockheed Martin Aeronautics', 'growing', 80, 160, 3.5, 'high',
   '{"f35_production": "Sustained F-35 production ramp", "cyber_roles": "Growing cybersecurity division", "software": "Digital transformation initiatives"}'::jsonb)
) AS pred(company_name, outlook, open_6mo, open_12mo, growth, confidence, factors_json)
ON e.company_name = pred.company_name
ON CONFLICT (employer_id, prediction_date) DO NOTHING;
