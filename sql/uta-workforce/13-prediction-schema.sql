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
