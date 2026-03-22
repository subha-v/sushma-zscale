-- ============================================================================
-- UTA WORKFORCE INTELLIGENCE DATASET - SCHEMA
-- Run this FIRST in Supabase SQL Editor
-- ============================================================================

-- Auto-update trigger function (reusable)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 1. UTA COLLEGES
-- ============================================================================
CREATE TABLE IF NOT EXISTS uta_colleges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_name TEXT NOT NULL UNIQUE,
  abbreviation TEXT,
  dean_name TEXT,
  enrollment INTEGER,
  website_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER uta_colleges_updated_at
  BEFORE UPDATE ON uta_colleges
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. UTA PROGRAMS
-- ============================================================================
CREATE TABLE IF NOT EXISTS uta_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  college_id UUID NOT NULL REFERENCES uta_colleges(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('certificate', 'associate', 'bachelor', 'master', 'doctoral', 'post-baccalaureate')),
  degree_type TEXT, -- BS, BA, BBA, MS, MA, PhD, DNP, etc.
  cip_code TEXT,
  is_stem BOOLEAN DEFAULT false,
  is_online_available BOOLEAN DEFAULT false,
  credit_hours INTEGER,
  description TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_name, degree_level, degree_type)
);

CREATE INDEX idx_uta_programs_college ON uta_programs(college_id);
CREATE INDEX idx_uta_programs_degree_level ON uta_programs(degree_level);
CREATE INDEX idx_uta_programs_stem ON uta_programs(is_stem);

CREATE TRIGGER uta_programs_updated_at
  BEFORE UPDATE ON uta_programs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 3. UTA PROGRAM OUTCOMES
-- ============================================================================
CREATE TABLE IF NOT EXISTS uta_program_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES uta_programs(id) ON DELETE CASCADE,
  outcome_year INTEGER NOT NULL DEFAULT 2024,
  graduation_rate NUMERIC(5,2),
  employment_rate NUMERIC(5,2),
  median_starting_salary INTEGER,
  median_mid_career_salary INTEGER,
  avg_time_to_degree_months INTEGER,
  total_graduates INTEGER,
  employed_in_field_pct NUMERIC(5,2),
  continuing_education_pct NUMERIC(5,2),
  top_employers TEXT[],
  top_job_titles TEXT[],
  data_source TEXT DEFAULT 'UTA Institutional Research',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, outcome_year)
);

CREATE INDEX idx_uta_program_outcomes_program ON uta_program_outcomes(program_id);

CREATE TRIGGER uta_program_outcomes_updated_at
  BEFORE UPDATE ON uta_program_outcomes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 4. ARLINGTON EMPLOYERS
-- ============================================================================
CREATE TABLE IF NOT EXISTS arlington_employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL UNIQUE,
  industry TEXT NOT NULL,
  naics_code TEXT,
  employee_count INTEGER,
  employee_range TEXT, -- '1000-4999', '5000+', etc.
  city TEXT DEFAULT 'Arlington',
  state TEXT DEFAULT 'TX',
  zip_code TEXT,
  is_fortune_500 BOOLEAN DEFAULT false,
  is_headquartered_locally BOOLEAN DEFAULT false,
  website_url TEXT,
  description TEXT,
  year_established INTEGER,
  hires_uta_grads BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_arlington_employers_industry ON arlington_employers(industry);
CREATE INDEX idx_arlington_employers_hires_uta ON arlington_employers(hires_uta_grads);

CREATE TRIGGER arlington_employers_updated_at
  BEFORE UPDATE ON arlington_employers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 5. ARLINGTON JOB OPENINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS arlington_job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES arlington_employers(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  department TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  salary_type TEXT DEFAULT 'annual' CHECK (salary_type IN ('annual', 'hourly')),
  education_required TEXT CHECK (education_required IN ('high_school', 'certificate', 'associate', 'bachelor', 'master', 'doctoral', 'none')),
  experience_years_min INTEGER DEFAULT 0,
  required_skills TEXT[],
  preferred_skills TEXT[],
  is_entry_level BOOLEAN DEFAULT false,
  is_internship BOOLEAN DEFAULT false,
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'internship', 'co-op')),
  remote_option TEXT DEFAULT 'on-site' CHECK (remote_option IN ('on-site', 'hybrid', 'remote')),
  openings_count INTEGER DEFAULT 1,
  posted_date DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_arlington_jobs_employer ON arlington_job_openings(employer_id);
CREATE INDEX idx_arlington_jobs_education ON arlington_job_openings(education_required);
CREATE INDEX idx_arlington_jobs_entry ON arlington_job_openings(is_entry_level);
CREATE INDEX idx_arlington_jobs_active ON arlington_job_openings(is_active);

CREATE TRIGGER arlington_job_openings_updated_at
  BEFORE UPDATE ON arlington_job_openings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 6. ARLINGTON ECONOMIC DEVELOPMENT PROJECTS
-- ============================================================================
CREATE TABLE IF NOT EXISTS arlington_development (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_name TEXT NOT NULL UNIQUE,
  project_type TEXT NOT NULL, -- 'commercial', 'industrial', 'mixed-use', 'infrastructure', 'institutional'
  developer TEXT,
  investment_amount BIGINT, -- in dollars
  estimated_jobs INTEGER,
  status TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'under_construction', 'completed', 'operational')),
  location_description TEXT,
  start_year INTEGER,
  completion_year INTEGER,
  description TEXT,
  industries_impacted TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER arlington_development_updated_at
  BEFORE UPDATE ON arlington_development
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 7. ARLINGTON INDUSTRIES
-- ============================================================================
CREATE TABLE IF NOT EXISTS arlington_industries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  industry_name TEXT NOT NULL UNIQUE,
  naics_sector TEXT,
  employment_count INTEGER,
  avg_annual_wage INTEGER,
  growth_rate NUMERIC(5,2), -- percentage
  location_quotient NUMERIC(5,2),
  top_occupations TEXT[],
  key_employers TEXT[],
  description TEXT,
  data_year INTEGER DEFAULT 2024,
  data_source TEXT DEFAULT 'BLS / TWC',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER arlington_industries_updated_at
  BEFORE UPDATE ON arlington_industries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 8. UTA EMPLOYER PARTNERSHIPS
-- ============================================================================
CREATE TABLE IF NOT EXISTS uta_employer_partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES uta_programs(id) ON DELETE CASCADE,
  employer_id UUID NOT NULL REFERENCES arlington_employers(id) ON DELETE CASCADE,
  partnership_type TEXT NOT NULL CHECK (partnership_type IN ('internship', 'co-op', 'hiring_pipeline', 'advisory_board', 'research', 'sponsorship', 'capstone', 'guest_lecture')),
  avg_hires_per_year INTEGER,
  avg_intern_salary INTEGER,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, employer_id, partnership_type)
);

CREATE INDEX idx_uta_partnerships_program ON uta_employer_partnerships(program_id);
CREATE INDEX idx_uta_partnerships_employer ON uta_employer_partnerships(employer_id);

CREATE TRIGGER uta_employer_partnerships_updated_at
  BEFORE UPDATE ON uta_employer_partnerships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 9. UTA SKILLS ALIGNMENT
-- ============================================================================
CREATE TABLE IF NOT EXISTS uta_skills_alignment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES uta_programs(id) ON DELETE CASCADE,
  industry_id UUID NOT NULL REFERENCES arlington_industries(id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_category TEXT CHECK (skill_category IN ('technical', 'software', 'analytical', 'communication', 'leadership', 'domain', 'certification')),
  program_teaches BOOLEAN DEFAULT true,
  industry_demands BOOLEAN DEFAULT true,
  demand_level TEXT DEFAULT 'medium' CHECK (demand_level IN ('low', 'medium', 'high', 'critical')),
  gap_status TEXT DEFAULT 'aligned' CHECK (gap_status IN ('aligned', 'gap', 'surplus')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(program_id, industry_id, skill_name)
);

CREATE INDEX idx_uta_skills_program ON uta_skills_alignment(program_id);
CREATE INDEX idx_uta_skills_industry ON uta_skills_alignment(industry_id);
CREATE INDEX idx_uta_skills_gap ON uta_skills_alignment(gap_status);

CREATE TRIGGER uta_skills_alignment_updated_at
  BEFORE UPDATE ON uta_skills_alignment
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 10. ARLINGTON LABOR STATISTICS
-- ============================================================================
CREATE TABLE IF NOT EXISTS arlington_labor_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_category TEXT NOT NULL CHECK (metric_category IN ('employment', 'wages', 'education', 'demographics', 'industry', 'occupation')),
  metric_value NUMERIC(12,2) NOT NULL,
  metric_unit TEXT NOT NULL, -- 'count', 'dollars', 'percent', 'ratio'
  geography TEXT DEFAULT 'Arlington, TX',
  time_period TEXT, -- 'Q4 2024', '2024', 'May 2025'
  data_source TEXT DEFAULT 'BLS',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(metric_name, metric_category, geography, time_period)
);

CREATE INDEX idx_labor_stats_category ON arlington_labor_stats(metric_category);
CREATE INDEX idx_labor_stats_geography ON arlington_labor_stats(geography);

CREATE TRIGGER arlington_labor_stats_updated_at
  BEFORE UPDATE ON arlington_labor_stats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (public read, authenticated write)
-- ============================================================================
ALTER TABLE uta_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE uta_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE uta_program_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE arlington_employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE arlington_job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE arlington_development ENABLE ROW LEVEL SECURITY;
ALTER TABLE arlington_industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE uta_employer_partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE uta_skills_alignment ENABLE ROW LEVEL SECURITY;
ALTER TABLE arlington_labor_stats ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read uta_colleges" ON uta_colleges FOR SELECT USING (true);
CREATE POLICY "Public read uta_programs" ON uta_programs FOR SELECT USING (true);
CREATE POLICY "Public read uta_program_outcomes" ON uta_program_outcomes FOR SELECT USING (true);
CREATE POLICY "Public read arlington_employers" ON arlington_employers FOR SELECT USING (true);
CREATE POLICY "Public read arlington_job_openings" ON arlington_job_openings FOR SELECT USING (true);
CREATE POLICY "Public read arlington_development" ON arlington_development FOR SELECT USING (true);
CREATE POLICY "Public read arlington_industries" ON arlington_industries FOR SELECT USING (true);
CREATE POLICY "Public read uta_employer_partnerships" ON uta_employer_partnerships FOR SELECT USING (true);
CREATE POLICY "Public read uta_skills_alignment" ON uta_skills_alignment FOR SELECT USING (true);
CREATE POLICY "Public read arlington_labor_stats" ON arlington_labor_stats FOR SELECT USING (true);

-- ============================================================================
-- DONE - Schema created successfully
-- Next: Run 02-colleges.sql
-- ============================================================================
