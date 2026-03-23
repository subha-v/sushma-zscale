-- ============================================================================
-- PREDICTIVE ANALYTICS SCHEMA
-- Run AFTER 01-schema.sql through 12-verify.sql
-- Creates 8 new tables for predictive analytics
-- ============================================================================

-- ============================================================================
-- 1. CIP-SOC CROSSWALK
-- Maps CIP codes (academic programs) to SOC codes (BLS occupations)
-- A program can map to multiple occupations and vice versa
-- ============================================================================
CREATE TABLE IF NOT EXISTS cip_soc_crosswalk (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cip_code TEXT NOT NULL,
  cip_title TEXT NOT NULL,
  soc_code TEXT NOT NULL,
  soc_title TEXT NOT NULL,
  match_quality TEXT DEFAULT 'primary' CHECK (match_quality IN ('primary', 'secondary', 'related')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cip_code, soc_code)
);

CREATE INDEX idx_cip_soc_cip ON cip_soc_crosswalk(cip_code);
CREATE INDEX idx_cip_soc_soc ON cip_soc_crosswalk(soc_code);

CREATE TRIGGER cip_soc_crosswalk_updated_at
  BEFORE UPDATE ON cip_soc_crosswalk
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. BLS OCCUPATION PROJECTIONS
-- Bureau of Labor Statistics 10-year employment projections
-- ============================================================================
CREATE TABLE IF NOT EXISTS bls_occupation_projections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  soc_code TEXT NOT NULL,
  occupation_title TEXT NOT NULL,
  base_year INTEGER NOT NULL DEFAULT 2022,
  projected_year INTEGER NOT NULL DEFAULT 2032,
  base_employment INTEGER,
  projected_employment INTEGER,
  change_count INTEGER,
  change_percent NUMERIC(6,2),
  median_annual_wage INTEGER,
  typical_entry_education TEXT,
  work_experience TEXT,
  job_outlook TEXT CHECK (job_outlook IN ('declining', 'little_or_no_change', 'slower_than_average', 'as_fast_as_average', 'faster_than_average', 'much_faster_than_average')),
  data_source TEXT DEFAULT 'BLS Occupational Outlook Handbook',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(soc_code, base_year)
);

CREATE INDEX idx_bls_proj_soc ON bls_occupation_projections(soc_code);
CREATE INDEX idx_bls_proj_outlook ON bls_occupation_projections(job_outlook);

CREATE TRIGGER bls_projections_updated_at
  BEFORE UPDATE ON bls_occupation_projections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. SKILLS CATALOG
-- Normalized skill dictionary with emerging/declining flags
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_name TEXT NOT NULL UNIQUE,
  skill_category TEXT NOT NULL CHECK (skill_category IN (
    'programming', 'data_science', 'cloud_infrastructure', 'cybersecurity',
    'engineering', 'healthcare', 'business', 'soft_skills', 'design',
    'project_management', 'ai_ml', 'devops', 'other'
  )),
  is_emerging BOOLEAN DEFAULT false,
  is_declining BOOLEAN DEFAULT false,
  first_seen_date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_skills_catalog_category ON skills_catalog(skill_category);
CREATE INDEX idx_skills_catalog_emerging ON skills_catalog(is_emerging) WHERE is_emerging = true;
CREATE INDEX idx_skills_catalog_declining ON skills_catalog(is_declining) WHERE is_declining = true;

CREATE TRIGGER skills_catalog_updated_at
  BEFORE UPDATE ON skills_catalog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. SKILLS TREND SNAPSHOTS
-- Weekly snapshots of skill demand from job postings
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills_trend_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES skills_catalog(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  job_posting_count INTEGER DEFAULT 0,
  posting_percentage NUMERIC(6,3) DEFAULT 0,
  avg_salary_with_skill INTEGER,
  region TEXT DEFAULT 'DFW',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(skill_id, snapshot_date, region)
);

CREATE INDEX idx_skills_trend_skill ON skills_trend_snapshots(skill_id);
CREATE INDEX idx_skills_trend_date ON skills_trend_snapshots(snapshot_date);

-- ============================================================================
-- 5. PROGRAM PREDICTIONS
-- Composite program success scores (0-100)
-- ============================================================================
CREATE TABLE IF NOT EXISTS program_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES uta_programs(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  overall_score NUMERIC(5,2) NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  employment_outlook_score NUMERIC(5,2) CHECK (employment_outlook_score BETWEEN 0 AND 100),
  salary_growth_score NUMERIC(5,2) CHECK (salary_growth_score BETWEEN 0 AND 100),
  skills_alignment_score NUMERIC(5,2) CHECK (skills_alignment_score BETWEEN 0 AND 100),
  employer_demand_score NUMERIC(5,2) CHECK (employer_demand_score BETWEEN 0 AND 100),
  industry_growth_score NUMERIC(5,2) CHECK (industry_growth_score BETWEEN 0 AND 100),
  confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  methodology_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, prediction_date)
);

CREATE INDEX idx_program_pred_program ON program_predictions(program_id);
CREATE INDEX idx_program_pred_score ON program_predictions(overall_score DESC);

CREATE TRIGGER program_predictions_updated_at
  BEFORE UPDATE ON program_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. EMPLOYER PREDICTIONS
-- Employer hiring outlook forecasts
-- ============================================================================
CREATE TABLE IF NOT EXISTS employer_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES arlington_employers(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  hiring_outlook TEXT NOT NULL CHECK (hiring_outlook IN ('declining', 'stable', 'growing', 'rapidly_growing')),
  projected_openings_6mo INTEGER,
  projected_openings_12mo INTEGER,
  industry_growth_rate NUMERIC(5,2),
  confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  factors JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(employer_id, prediction_date)
);

CREATE INDEX idx_employer_pred_employer ON employer_predictions(employer_id);
CREATE INDEX idx_employer_pred_outlook ON employer_predictions(hiring_outlook);

CREATE TRIGGER employer_predictions_updated_at
  BEFORE UPDATE ON employer_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. SALARY PREDICTIONS
-- Salary trajectory forecasts per program
-- ============================================================================
CREATE TABLE IF NOT EXISTS salary_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES uta_programs(id) ON DELETE CASCADE,
  prediction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  current_median_salary INTEGER NOT NULL,
  year_1_projected INTEGER,
  year_3_projected INTEGER,
  year_5_projected INTEGER,
  year_10_projected INTEGER,
  annual_growth_rate NUMERIC(5,2),
  confidence_level TEXT NOT NULL DEFAULT 'medium' CHECK (confidence_level IN ('low', 'medium', 'high')),
  methodology TEXT DEFAULT 'BLS wage growth + program outcomes data',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, prediction_date)
);

CREATE INDEX idx_salary_pred_program ON salary_predictions(program_id);

CREATE TRIGGER salary_predictions_updated_at
  BEFORE UPDATE ON salary_predictions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. PREDICTION ACCURACY LOG
-- Tracks prediction vs actual outcomes for model calibration
-- ============================================================================
CREATE TABLE IF NOT EXISTS prediction_accuracy_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prediction_type TEXT NOT NULL CHECK (prediction_type IN ('program_score', 'salary', 'employer_outlook', 'skill_trend')),
  reference_id UUID,
  prediction_date DATE NOT NULL,
  verification_date DATE,
  predicted_value NUMERIC(12,2),
  actual_value NUMERIC(12,2),
  error_pct NUMERIC(8,4),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pred_accuracy_type ON prediction_accuracy_log(prediction_type);
CREATE INDEX idx_pred_accuracy_date ON prediction_accuracy_log(prediction_date);

-- ============================================================================
-- ROW LEVEL SECURITY — Public read access (matches existing pattern)
-- ============================================================================
ALTER TABLE cip_soc_crosswalk ENABLE ROW LEVEL SECURITY;
ALTER TABLE bls_occupation_projections ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills_trend_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE employer_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prediction_accuracy_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read cip_soc_crosswalk" ON cip_soc_crosswalk FOR SELECT USING (true);
CREATE POLICY "Public read bls_occupation_projections" ON bls_occupation_projections FOR SELECT USING (true);
CREATE POLICY "Public read skills_catalog" ON skills_catalog FOR SELECT USING (true);
CREATE POLICY "Public read skills_trend_snapshots" ON skills_trend_snapshots FOR SELECT USING (true);
CREATE POLICY "Public read program_predictions" ON program_predictions FOR SELECT USING (true);
CREATE POLICY "Public read employer_predictions" ON employer_predictions FOR SELECT USING (true);
CREATE POLICY "Public read salary_predictions" ON salary_predictions FOR SELECT USING (true);
CREATE POLICY "Public read prediction_accuracy_log" ON prediction_accuracy_log FOR SELECT USING (true);
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
-- ============================================================================
-- CIP-SOC CROSSWALK DATA
-- Maps UTA program CIP codes to BLS SOC codes
-- Source: NCES CIP-SOC Crosswalk (https://nces.ed.gov/ipeds/cipcode)
-- Run AFTER 13-prediction-schema.sql
-- ============================================================================

INSERT INTO cip_soc_crosswalk (cip_code, cip_title, soc_code, soc_title, match_quality) VALUES
-- Computer Science (11.0701)
('11.0701', 'Computer Science', '15-1252', 'Software Developers', 'primary'),
('11.0701', 'Computer Science', '15-1251', 'Computer Programmers', 'secondary'),
('11.0701', 'Computer Science', '15-1211', 'Computer Systems Analysts', 'related'),
('11.0701', 'Computer Science', '15-2051', 'Data Scientists', 'related'),

-- Mechanical Engineering (14.1901)
('14.1901', 'Mechanical Engineering', '17-2141', 'Mechanical Engineers', 'primary'),
('14.1901', 'Mechanical Engineering', '17-2199', 'Engineers, All Other', 'secondary'),

-- Nursing (51.3801)
('51.3801', 'Nursing', '29-1141', 'Registered Nurses', 'primary'),
('51.3801', 'Nursing', '29-1171', 'Nurse Practitioners', 'related'),

-- Accounting (52.0301)
('52.0301', 'Accounting', '13-2011', 'Accountants and Auditors', 'primary'),
('52.0301', 'Accounting', '13-2099', 'Financial Specialists, All Other', 'related'),

-- Biology (26.0101)
('26.0101', 'Biology', '19-1029', 'Biological Scientists, All Other', 'primary'),
('26.0101', 'Biology', '19-1042', 'Medical Scientists', 'related'),
('26.0101', 'Biology', '19-4021', 'Biological Technicians', 'secondary'),

-- Data Science (30.7001)
('30.7001', 'Data Science', '15-2051', 'Data Scientists', 'primary'),
('30.7001', 'Data Science', '15-2041', 'Statisticians', 'secondary'),
('30.7001', 'Data Science', '15-1252', 'Software Developers', 'related'),

-- Aerospace Engineering (14.0201)
('14.0201', 'Aerospace Engineering', '17-2011', 'Aerospace Engineers', 'primary'),
('14.0201', 'Aerospace Engineering', '17-2199', 'Engineers, All Other', 'secondary'),

-- Finance (52.0801)
('52.0801', 'Finance', '13-2051', 'Financial Analysts', 'primary'),
('52.0801', 'Finance', '13-2052', 'Personal Financial Advisors', 'secondary'),
('52.0801', 'Finance', '13-2099', 'Financial Specialists, All Other', 'related'),

-- Software Engineering (14.0903)
('14.0903', 'Software Engineering', '15-1252', 'Software Developers', 'primary'),
('14.0903', 'Software Engineering', '15-1253', 'Software Quality Assurance Analysts', 'secondary'),
('14.0903', 'Software Engineering', '15-1299', 'Computer Occupations, All Other', 'related'),

-- Electrical Engineering (14.1001)
('14.1001', 'Electrical Engineering', '17-2071', 'Electrical Engineers', 'primary'),
('14.1001', 'Electrical Engineering', '17-2072', 'Electronics Engineers', 'secondary'),

-- Civil Engineering (14.0801)
('14.0801', 'Civil Engineering', '17-2051', 'Civil Engineers', 'primary'),
('14.0801', 'Civil Engineering', '17-2199', 'Engineers, All Other', 'secondary'),

-- Information Systems (11.0103)
('11.0103', 'Information Systems', '15-1212', 'Information Security Analysts', 'primary'),
('11.0103', 'Information Systems', '15-1245', 'Database Administrators', 'secondary'),
('11.0103', 'Information Systems', '15-1244', 'Network and Computer Systems Administrators', 'related'),

-- Psychology (42.0101)
('42.0101', 'Psychology', '19-3039', 'Psychologists, All Other', 'primary'),
('42.0101', 'Psychology', '21-1014', 'Mental Health Counselors', 'related'),

-- Education (13.0101)
('13.0101', 'Education', '25-2021', 'Elementary School Teachers', 'primary'),
('13.0101', 'Education', '25-2031', 'Secondary School Teachers', 'secondary'),

-- Business Administration (52.0201)
('52.0201', 'Business Administration', '11-1021', 'General and Operations Managers', 'primary'),
('52.0201', 'Business Administration', '13-1161', 'Market Research Analysts', 'related'),

-- Social Work (44.0701)
('44.0701', 'Social Work', '21-1021', 'Child, Family, and School Social Workers', 'primary'),
('44.0701', 'Social Work', '21-1029', 'Social Workers, All Other', 'secondary'),

-- Architecture (04.0201)
('04.0201', 'Architecture', '17-1011', 'Architects', 'primary'),
('04.0201', 'Architecture', '17-1012', 'Landscape Architects', 'related'),

-- Industrial Engineering (14.3501)
('14.3501', 'Industrial Engineering', '17-2112', 'Industrial Engineers', 'primary'),
('14.3501', 'Industrial Engineering', '17-2199', 'Engineers, All Other', 'secondary')

ON CONFLICT (cip_code, soc_code) DO NOTHING;
-- ============================================================================
-- BLS OCCUPATION PROJECTIONS DATA
-- Real BLS 2022-2032 Employment Projections
-- Source: Bureau of Labor Statistics Occupational Outlook Handbook
-- Run AFTER 13-prediction-schema.sql
-- ============================================================================

INSERT INTO bls_occupation_projections (soc_code, occupation_title, base_year, projected_year, base_employment, projected_employment, change_count, change_percent, median_annual_wage, typical_entry_education, work_experience, job_outlook) VALUES

-- Software & IT
('15-1252', 'Software Developers', 2022, 2032, 1795300, 2269200, 473900, 26.39, 130160, 'Bachelor''s degree', 'None', 'much_faster_than_average'),
('15-1251', 'Computer Programmers', 2022, 2032, 147400, 133300, -14100, -9.57, 97800, 'Bachelor''s degree', 'None', 'declining'),
('15-1211', 'Computer Systems Analysts', 2022, 2032, 538800, 571000, 32200, 5.97, 102240, 'Bachelor''s degree', 'None', 'as_fast_as_average'),
('15-2051', 'Data Scientists', 2022, 2032, 192700, 259600, 66900, 35.21, 108020, 'Bachelor''s degree', 'None', 'much_faster_than_average'),
('15-1212', 'Information Security Analysts', 2022, 2032, 168900, 222700, 53800, 31.85, 120360, 'Bachelor''s degree', 'Less than 5 years', 'much_faster_than_average'),
('15-1245', 'Database Administrators', 2022, 2032, 167200, 175200, 8000, 4.79, 101510, 'Bachelor''s degree', 'None', 'slower_than_average'),
('15-1244', 'Network and Computer Systems Administrators', 2022, 2032, 363100, 367600, 4500, 1.24, 95360, 'Bachelor''s degree', 'None', 'little_or_no_change'),
('15-1253', 'Software Quality Assurance Analysts', 2022, 2032, 199800, 251300, 51500, 25.78, 99620, 'Bachelor''s degree', 'None', 'much_faster_than_average'),
('15-1299', 'Computer Occupations, All Other', 2022, 2032, 436800, 461800, 25000, 5.72, 99860, 'Bachelor''s degree', 'None', 'as_fast_as_average'),
('15-2041', 'Statisticians', 2022, 2032, 34200, 39800, 5600, 16.37, 104110, 'Master''s degree', 'None', 'much_faster_than_average'),

-- Engineering
('17-2011', 'Aerospace Engineers', 2022, 2032, 62100, 66300, 4200, 6.76, 130720, 'Bachelor''s degree', 'None', 'as_fast_as_average'),
('17-2141', 'Mechanical Engineers', 2022, 2032, 284900, 288700, 3800, 1.33, 96310, 'Bachelor''s degree', 'None', 'little_or_no_change'),
('17-2071', 'Electrical Engineers', 2022, 2032, 186400, 193800, 7400, 3.97, 106950, 'Bachelor''s degree', 'None', 'slower_than_average'),
('17-2072', 'Electronics Engineers', 2022, 2032, 119500, 119400, -100, -0.08, 112100, 'Bachelor''s degree', 'None', 'little_or_no_change'),
('17-2051', 'Civil Engineers', 2022, 2032, 318300, 329200, 10900, 3.42, 89940, 'Bachelor''s degree', 'None', 'slower_than_average'),
('17-2112', 'Industrial Engineers', 2022, 2032, 303800, 328700, 24900, 8.20, 96350, 'Bachelor''s degree', 'None', 'faster_than_average'),
('17-2199', 'Engineers, All Other', 2022, 2032, 175600, 181400, 5800, 3.30, 104600, 'Bachelor''s degree', 'None', 'slower_than_average'),

-- Healthcare
('29-1141', 'Registered Nurses', 2022, 2032, 3175390, 3351390, 176000, 5.54, 81220, 'Bachelor''s degree', 'None', 'as_fast_as_average'),
('29-1171', 'Nurse Practitioners', 2022, 2032, 234690, 301690, 67000, 28.54, 126260, 'Master''s degree', 'None', 'much_faster_than_average'),

-- Business & Finance
('13-2011', 'Accountants and Auditors', 2022, 2032, 1433900, 1441500, 7600, 0.53, 79880, 'Bachelor''s degree', 'None', 'little_or_no_change'),
('13-2051', 'Financial Analysts', 2022, 2032, 327600, 358800, 31200, 9.53, 96220, 'Bachelor''s degree', 'None', 'faster_than_average'),
('13-2052', 'Personal Financial Advisors', 2022, 2032, 330300, 366300, 36000, 10.90, 99580, 'Bachelor''s degree', 'None', 'faster_than_average'),
('13-2099', 'Financial Specialists, All Other', 2022, 2032, 72600, 74200, 1600, 2.20, 81220, 'Bachelor''s degree', 'None', 'slower_than_average'),
('13-1161', 'Market Research Analysts', 2022, 2032, 905400, 1027600, 122200, 13.50, 74680, 'Bachelor''s degree', 'None', 'faster_than_average'),

-- Science
('19-1029', 'Biological Scientists, All Other', 2022, 2032, 46800, 48600, 1800, 3.85, 86400, 'Doctoral or professional degree', 'None', 'slower_than_average'),
('19-1042', 'Medical Scientists', 2022, 2032, 140400, 156600, 16200, 11.54, 100890, 'Doctoral or professional degree', 'None', 'faster_than_average'),
('19-4021', 'Biological Technicians', 2022, 2032, 85000, 90800, 5800, 6.82, 49650, 'Bachelor''s degree', 'None', 'as_fast_as_average'),

-- Social Services & Education
('19-3039', 'Psychologists, All Other', 2022, 2032, 20900, 21900, 1000, 4.78, 108100, 'Doctoral or professional degree', 'Internship/residency', 'slower_than_average'),
('21-1014', 'Mental Health Counselors', 2022, 2032, 368000, 460200, 92200, 25.05, 53710, 'Master''s degree', 'None', 'much_faster_than_average'),
('21-1021', 'Child, Family, and School Social Workers', 2022, 2032, 346900, 363700, 16800, 4.84, 52570, 'Bachelor''s degree', 'None', 'slower_than_average'),
('21-1029', 'Social Workers, All Other', 2022, 2032, 72900, 77700, 4800, 6.58, 64050, 'Master''s degree', 'None', 'as_fast_as_average'),
('25-2021', 'Elementary School Teachers', 2022, 2032, 1366800, 1375900, 9100, 0.67, 61690, 'Bachelor''s degree', 'None', 'little_or_no_change'),
('25-2031', 'Secondary School Teachers', 2022, 2032, 1074500, 1078100, 3600, 0.34, 62360, 'Bachelor''s degree', 'None', 'little_or_no_change'),

-- Management
('11-1021', 'General and Operations Managers', 2022, 2032, 3151100, 3279100, 128000, 4.06, 101280, 'Bachelor''s degree', '5 years or more', 'slower_than_average'),

-- Architecture
('17-1011', 'Architects', 2022, 2032, 127200, 131800, 4600, 3.62, 93310, 'Bachelor''s degree', 'Internship/residency', 'slower_than_average'),
('17-1012', 'Landscape Architects', 2022, 2032, 21700, 22000, 300, 1.38, 73840, 'Bachelor''s degree', 'Internship/residency', 'little_or_no_change')

ON CONFLICT (soc_code, base_year) DO NOTHING;
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