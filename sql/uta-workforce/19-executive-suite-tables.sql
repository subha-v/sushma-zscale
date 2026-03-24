-- ============================================================================
-- 19-executive-suite-tables.sql
-- Executive Suite tables: Program Scorecards, Compliance Reports,
-- Site Selection Packages, Employer Monitoring, Career Advisor Sessions
-- ============================================================================

-- 1. program_scorecards — Program ROI scorecards
CREATE TABLE IF NOT EXISTS program_scorecards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id UUID REFERENCES uta_programs(id),
  overall_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  health_status TEXT NOT NULL DEFAULT 'healthy' CHECK (health_status IN ('healthy','watch','at_risk','critical')),
  employment_rate NUMERIC(5,2),
  median_salary NUMERIC(10,2),
  employer_demand_score NUMERIC(5,2),
  skills_alignment_pct NUMERIC(5,2),
  graduation_rate NUMERIC(5,2),
  credential_of_value BOOLEAN DEFAULT false,
  hb8_compliant BOOLEAN DEFAULT true,
  trend_direction TEXT DEFAULT 'stable' CHECK (trend_direction IN ('improving','stable','declining')),
  ai_recommendation TEXT,
  last_reviewed_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE program_scorecards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access on program_scorecards" ON program_scorecards;
CREATE POLICY "Public read access on program_scorecards" ON program_scorecards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write on program_scorecards" ON program_scorecards;
CREATE POLICY "Service role write on program_scorecards" ON program_scorecards FOR ALL USING (auth.role() = 'service_role');

-- 2. compliance_reports — Compliance report tracking
CREATE TABLE IF NOT EXISTS compliance_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL DEFAULT 'hb8' CHECK (report_type IN ('hb8','board_report','accreditation','wioa','custom')),
  program_id UUID REFERENCES uta_programs(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','pending_review','approved','submitted','expired')),
  generated_by TEXT DEFAULT 'ai_agent',
  report_data JSONB DEFAULT '{}'::jsonb,
  credential_value_pass BOOLEAN,
  wage_threshold_pass BOOLEAN,
  employment_threshold_pass BOOLEAN,
  key_findings TEXT[],
  recommendations TEXT[],
  submitted_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE compliance_reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access on compliance_reports" ON compliance_reports;
CREATE POLICY "Public read access on compliance_reports" ON compliance_reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write on compliance_reports" ON compliance_reports;
CREATE POLICY "Service role write on compliance_reports" ON compliance_reports FOR ALL USING (auth.role() = 'service_role');

-- 3. site_selection_packages — EDC site selection data packages
CREATE TABLE IF NOT EXISTS site_selection_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  target_roles TEXT[],
  headcount_needed INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','complete','delivered','archived')),
  talent_summary JSONB DEFAULT '{}'::jsonb,
  employer_landscape JSONB DEFAULT '{}'::jsonb,
  labor_market_data JSONB DEFAULT '{}'::jsonb,
  training_pipeline JSONB DEFAULT '{}'::jsonb,
  incentive_summary JSONB DEFAULT '{}'::jsonb,
  key_highlights TEXT[],
  generated_by TEXT DEFAULT 'ai_agent',
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE site_selection_packages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access on site_selection_packages" ON site_selection_packages;
CREATE POLICY "Public read access on site_selection_packages" ON site_selection_packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write on site_selection_packages" ON site_selection_packages;
CREATE POLICY "Service role write on site_selection_packages" ON site_selection_packages FOR ALL USING (auth.role() = 'service_role');

-- 4. employer_monitoring — Employer hiring signals/alerts
CREATE TABLE IF NOT EXISTS employer_monitoring (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  employer_id UUID REFERENCES arlington_employers(id),
  signal_type TEXT NOT NULL CHECK (signal_type IN ('hiring_surge','hiring_freeze','expansion','contraction','new_facility','layoff','partnership')),
  signal_strength TEXT NOT NULL DEFAULT 'moderate' CHECK (signal_strength IN ('weak','moderate','strong','critical')),
  title TEXT NOT NULL,
  description TEXT,
  source TEXT,
  is_acknowledged BOOLEAN DEFAULT false,
  acknowledged_by TEXT,
  acknowledged_at TIMESTAMPTZ,
  detected_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE employer_monitoring ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access on employer_monitoring" ON employer_monitoring;
CREATE POLICY "Public read access on employer_monitoring" ON employer_monitoring FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write on employer_monitoring" ON employer_monitoring;
CREATE POLICY "Service role write on employer_monitoring" ON employer_monitoring FOR ALL USING (auth.role() = 'service_role');

-- 5. career_advisor_sessions — Student AI advisor session tracking
CREATE TABLE IF NOT EXISTS career_advisor_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT,
  session_type TEXT NOT NULL DEFAULT 'career_exploration' CHECK (session_type IN ('career_exploration','resume_review','interview_prep','salary_negotiation','skill_assessment','general')),
  messages_count INTEGER DEFAULT 0,
  tools_used TEXT[],
  programs_discussed TEXT[],
  employers_discussed TEXT[],
  satisfaction_rating INTEGER CHECK (satisfaction_rating >= 1 AND satisfaction_rating <= 5),
  session_summary TEXT,
  started_at TIMESTAMPTZ DEFAULT now(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE career_advisor_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access on career_advisor_sessions" ON career_advisor_sessions;
CREATE POLICY "Public read access on career_advisor_sessions" ON career_advisor_sessions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Service role write on career_advisor_sessions" ON career_advisor_sessions;
CREATE POLICY "Service role write on career_advisor_sessions" ON career_advisor_sessions FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- SEED DATA (2025)
-- ============================================================================

-- Clear old seed data for re-runs with updated 2025 values
DELETE FROM career_advisor_sessions WHERE student_id LIKE 'demo-student-%';
DELETE FROM employer_monitoring;
DELETE FROM site_selection_packages;
DELETE FROM compliance_reports;
DELETE FROM program_scorecards;

-- Program Scorecards (2025 data — ~4% salary YoY increase, updated scores)
INSERT INTO program_scorecards (program_id, overall_score, health_status, employment_rate, median_salary, employer_demand_score, skills_alignment_pct, graduation_rate, credential_of_value, hb8_compliant, trend_direction, ai_recommendation)
VALUES
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS' LIMIT 1), 89.2, 'healthy', 84.0, 71500, 92.0, 80.0, 54.0, true, true, 'improving', 'Strong program with excellent employer demand. GenAI and cloud-native coursework additions in Spring 2025 are closing skills gaps. Continued investment in AI/ML lab infrastructure recommended.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN' LIMIT 1), 86.5, 'healthy', 94.0, 73200, 93.0, 96.0, 73.0, true, true, 'stable', 'Top-performing program with highest employment rate. Telehealth certification launched Fall 2024 is showing early positive outcomes. DFW nursing shortage continues to drive demand.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Software Engineering' AND degree_type = 'BS' LIMIT 1), 87.4, 'healthy', 85.0, 70800, 90.0, 82.0, 52.0, true, true, 'improving', 'Growing demand driven by defense and tech sectors. New DevOps and cloud-native modules added for 2025. Bell FLRAA program creating additional software engineering pipeline.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS' LIMIT 1), 86.8, 'healthy', 87.0, 69500, 88.0, 76.0, 56.0, true, true, 'improving', 'Fastest-growing program by employer demand. AI/ML specialization track launched Spring 2025. MLOps and LLM fine-tuning skills now covered. Amazon and Capital One actively recruiting.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Aerospace Engineering' AND degree_type = 'BS' LIMIT 1), 80.1, 'watch', 82.0, 69000, 86.0, 77.0, 48.0, true, true, 'improving', 'FLRAA contract driving strong local demand. Graduation rate improving with new peer tutoring program. Bell Textron and Lockheed actively expanding internship slots.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS' LIMIT 1), 73.5, 'watch', 79.0, 67500, 79.0, 72.0, 51.0, true, true, 'stable', 'Industry 4.0 curriculum update in progress for Fall 2025. GM Arlington EV transition creating new demand for automation and battery systems skills.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA' LIMIT 1), 64.0, 'at_risk', 77.0, 57800, 68.0, 66.0, 57.0, false, false, 'declining', 'Below HB8 wage threshold for second consecutive year. Data analytics module pilot in Spring 2025 showing early promise. Forensic accounting specialization under development.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Biology' AND degree_type = 'BS' LIMIT 1), 56.5, 'at_risk', 63.0, 43500, 54.0, 58.0, 44.0, false, false, 'declining', 'Lowest employment rate and well below living wage. New biotech partnership with Arlington research corridor announced Q1 2025. Accelerated BS-to-MS pathway launching Fall 2025.'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Finance' AND degree_type = 'BBA' LIMIT 1), 72.0, 'watch', 79.0, 58200, 73.0, 67.0, 59.0, false, true, 'stable', 'Fintech curriculum integration underway for 2025-2026. CFA prep partnership with local firms established. Data analytics cross-listing with College of Science approved.')
ON CONFLICT DO NOTHING;

-- Compliance Reports (2025)
INSERT INTO compliance_reports (report_type, program_id, title, status, credential_value_pass, wage_threshold_pass, employment_threshold_pass, key_findings, recommendations)
VALUES
  ('hb8', (SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS' LIMIT 1), 'HB8 Compliance Report - Computer Science BS (2025)', 'approved', true, true, true, ARRAY['Median starting salary $71,500 exceeds HB8 wage threshold by 19%', 'Employment rate 84% well above required 70%', 'Strong employer demand from Lockheed Martin, Amazon, TI, and Bell Textron', 'GenAI coursework addition improved skills alignment to 80%'], ARRAY['Continue expanding cloud computing and AI/ML lab capacity', 'Develop cybersecurity specialization track', 'Expand co-op program with defense contractors']),
  ('hb8', (SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN' LIMIT 1), 'HB8 Compliance Report - Nursing BSN (2025)', 'approved', true, true, true, ARRAY['Highest employment rate at 94% across all programs', 'Median salary $73,200 well above threshold', 'Critical healthcare workforce shortage in DFW accelerating demand', 'Telehealth certification add-on achieving 85% uptake'], ARRAY['Expand clinical simulation capacity', 'Develop nurse practitioner pathway', 'Add mental health nursing specialization']),
  ('hb8', (SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA' LIMIT 1), 'HB8 Compliance Report - Accounting BBA (2025)', 'pending_review', false, false, true, ARRAY['Median salary $57,800 still below HB8 credential-of-value threshold', 'Employment rate 77% meets minimum but declining from 78%', 'CPA pass rate declined 3% year over year', 'Data analytics pilot module showing early promise'], ARRAY['Accelerate data analytics integration across all courses', 'Launch forensic accounting specialization by Fall 2025', 'Establish Big 4 firm placement guarantee program', 'Consider automation and AI auditing coursework']),
  ('board_report', NULL, 'Q1 2025 Board of Regents Report - Program Performance', 'submitted', NULL, NULL, NULL, ARRAY['4 of 9 scored programs meet credential-of-value standards (unchanged from 2024)', '2 programs remain at-risk — Accounting and Biology', 'Average employment rate across all programs: 81.1% (up from 80.1%)', 'Data Science program showed strongest improvement (+2.3 points)', 'Overall salary growth of 4.1% year-over-year across all programs'], ARRAY['Prioritize at-risk program intervention plans by May 2025', 'Expand industry advisory boards to include AI/tech sector', 'Invest in career services AI advisor tool expansion', 'Review credential-of-value criteria for 2025-2026 cycle']),
  ('hb8', (SELECT id FROM uta_programs WHERE program_name = 'Biology' AND degree_type = 'BS' LIMIT 1), 'HB8 Compliance Report - Biology BS (2025)', 'draft', false, false, false, ARRAY['Employment rate 63% still below 70% threshold', 'Median salary $43,500 significantly below HB8 threshold', 'Most graduates require additional education for career-level employment', 'New biotech corridor partnership announced but not yet reflected in outcomes'], ARRAY['Fast-track biotech industry partnership pipeline', 'Launch accelerated BS-to-MS pathway by Fall 2025', 'Create pre-professional advising center', 'Explore bioinformatics cross-listing with Data Science'])
ON CONFLICT DO NOTHING;

-- Site Selection Packages (2025 data)
INSERT INTO site_selection_packages (company_name, industry, target_roles, headcount_needed, status, key_highlights)
VALUES
  ('TechCorp Industries', 'Technology & Software', ARRAY['Software Engineer', 'Data Scientist', 'Cloud Architect', 'AI/ML Engineer'], 175, 'complete', ARRAY['UTA produces 620+ CS/SE/DS graduates annually (up 7% from 2024)', 'Median starting salary competitive at $69-72K', '5 active employer partnerships in technology sector', 'Arlington offers 28% lower office costs than Dallas core', 'DFW tech workforce grew 6.2% in 2024']),
  ('MedTech Solutions', 'Healthcare Technology', ARRAY['Biomedical Engineer', 'Data Analyst', 'Clinical Systems Specialist', 'Health Informatics'], 90, 'delivered', ARRAY['UTA CONHI graduates 540+ nursing/health professionals annually', 'Texas Health Resources partnership provides direct clinical pipeline', 'New telehealth certification program launched 2024', 'Arlington positioned between Fort Worth and Dallas medical districts', 'Healthcare AI demand surging 15% YoY in DFW']),
  ('AeroVista Defense', 'Aerospace & Defense', ARRAY['Systems Engineer', 'Aerospace Engineer', 'Software Developer', 'Autonomy Engineer'], 250, 'draft', ARRAY['DFW has 30,000+ aerospace workers with 4.3 location quotient', 'Bell FLRAA V-280 Valor production ramping — 500+ new jobs by 2027', 'Lockheed F-35 production increase creating sustained demand', 'UTA Engineering produces 850+ graduates in relevant disciplines', 'Arlington designated as defense innovation corridor by state']),
  ('GreenBuild Homes', 'Construction & Homebuilding', ARRAY['Project Manager', 'Civil Engineer', 'Sustainability Specialist'], 60, 'complete', ARRAY['D.R. Horton HQ in Arlington provides industry ecosystem', 'Construction sector employs 9,200+ in Arlington area (up 8%)', 'UTA offers relevant civil engineering and environmental programs', 'New sustainable construction certificate program launching 2025']),
  ('DataFlow Analytics', 'Data & AI', ARRAY['ML Engineer', 'Data Engineer', 'Product Manager', 'LLM Specialist'], 120, 'complete', ARRAY['UTA Data Science program growing 15% annually in enrollment', 'AI/ML specialization track launched Spring 2025', 'Strong emerging skills alignment (GenAI, LLMs, MLOps, RAG)', 'Competitive cost of living with $70,200 median household income', 'DFW ranked #4 in AI job growth nationally in 2024'])
ON CONFLICT DO NOTHING;

-- Employer Monitoring Alerts (2025 — uses now() for relative timestamps)
INSERT INTO employer_monitoring (employer_id, signal_type, signal_strength, title, description, source, detected_at)
VALUES
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%Texas Health%' LIMIT 1), 'hiring_surge', 'strong', 'Texas Health Resources 35% increase in nursing postings', 'RN job postings surged 35% month-over-month across all DFW facilities. Critical care, emergency, and telehealth positions lead growth. New Mansfield campus driving additional demand.', 'Job posting analysis — March 2025', now() - interval '2 days'),
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%General Motors%' LIMIT 1), 'expansion', 'critical', 'GM Arlington full EV production line operational', 'GM Arlington Assembly fully transitioned to electric SUV production. $1.2B total investment now operational. Hiring 350+ battery systems technicians, automation engineers, and software developers through 2025.', 'Press release + SEC filing — Q1 2025', now() - interval '5 days'),
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%Lockheed%' LIMIT 1), 'hiring_surge', 'strong', 'Lockheed Martin F-35 Lot 18 production surge', 'F-35 production rate increasing to 156 aircraft/year. DFW operations adding 120+ software engineers, systems engineers, and cybersecurity specialists. Active UTA recruiting pipeline.', 'Defense contract + job posting analysis — March 2025', now() - interval '4 days'),
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%Bell%' LIMIT 1), 'new_facility', 'critical', 'Bell Textron FLRAA V-280 Valor production begins', 'V-280 Valor FLRAA program entering low-rate initial production. New DFW engineering center operational. 500+ positions opening across manufacturing, software, and flight test. Largest defense hiring event in Arlington history.', 'DoD contract award + company announcement — February 2025', now() - interval '8 days'),
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%D.R. Horton%' LIMIT 1), 'hiring_surge', 'moderate', 'D.R. Horton Q1 2025 expansion — 45 new positions', 'Homebuilder expanding project management, sales, and sustainability teams. DFW housing starts up 12% in Q1 2025. New sustainable construction division creating demand for green building expertise.', 'Q1 2025 earnings call + job postings', now() - interval '3 days'),
  ((SELECT id FROM arlington_employers WHERE company_name ILIKE '%Arlington ISD%' LIMIT 1), 'contraction', 'moderate', 'Arlington ISD budget reduction for 2025-2026', 'District approved 4.2% budget reduction for 2025-2026. Eliminating 85 non-teaching positions through attrition. Core teaching and special education positions protected. STEM program expansion delayed.', 'School board vote — March 2025', now() - interval '6 days')
ON CONFLICT DO NOTHING;

-- Career Advisor Sessions (2025 demo data)
INSERT INTO career_advisor_sessions (student_id, session_type, messages_count, tools_used, programs_discussed, employers_discussed, satisfaction_rating, session_summary, started_at, ended_at)
VALUES
  ('demo-student-1', 'career_exploration', 14, ARRAY['get_program_outcomes', 'get_employers', 'get_salary_forecast', 'get_emerging_skills'], ARRAY['Computer Science', 'Software Engineering'], ARRAY['Lockheed Martin', 'Bell Textron', 'Amazon'], 5, 'Student explored CS vs SE programs with focus on defense AI roles. FLRAA program creating strong demand for both. Recommended Bell Textron internship pipeline and AI/ML specialization.', now() - interval '2 hours', now() - interval '1 hour'),
  ('demo-student-2', 'salary_negotiation', 10, ARRAY['get_salary_forecast', 'get_labor_stats', 'get_employer_intelligence'], ARRAY['Nursing'], ARRAY['Texas Health Resources'], 5, 'BSN student preparing for first job negotiation at Texas Health. 2025 salary benchmarks show $73.2K median — strong leverage given 35% hiring surge. Provided negotiation strategy and benefits comparison.', now() - interval '1 day', now() - interval '23 hours'),
  ('demo-student-3', 'skill_assessment', 18, ARRAY['get_skills_alignment', 'get_emerging_skills', 'get_predictive_skills_gap', 'compare_programs'], ARRAY['Data Science', 'Computer Science'], ARRAY['Amazon', 'Capital One', 'DataFlow Analytics'], 5, 'Data Science student assessed skills gaps against 2025 market. LLM fine-tuning, RAG architectures, and MLOps identified as top priorities. AI/ML specialization track recommended.', now() - interval '3 days', now() - interval '3 days' + interval '45 minutes'),
  ('demo-student-4', 'interview_prep', 12, ARRAY['get_employers', 'get_job_openings', 'get_employer_intelligence'], ARRAY['Aerospace Engineering'], ARRAY['Bell Textron', 'Lockheed Martin'], 4, 'AeroE student preparing for Bell Textron FLRAA team interview. Reviewed V-280 Valor program details, autonomy engineering requirements, and technical interview topics for 2025 hiring wave.', now() - interval '5 days', now() - interval '5 days' + interval '30 minutes'),
  ('demo-student-5', 'career_exploration', 22, ARRAY['get_program_prediction', 'compare_programs', 'get_salary_forecast', 'get_emerging_skills', 'get_employer_outlook'], ARRAY['Computer Science', 'Data Science', 'Software Engineering'], ARRAY['Amazon', 'Microsoft', 'Google', 'Bell Textron'], 5, 'Undeclared student explored three tech programs with 2025 market data. Data Science showing fastest growth (+15% enrollment, +$4.5K salary YoY). Chose Data Science with AI/ML specialization track.', now() - interval '7 days', now() - interval '7 days' + interval '1 hour')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION
-- ============================================================================
SELECT 'program_scorecards' AS table_name, COUNT(*) AS row_count FROM program_scorecards
UNION ALL SELECT 'compliance_reports', COUNT(*) FROM compliance_reports
UNION ALL SELECT 'site_selection_packages', COUNT(*) FROM site_selection_packages
UNION ALL SELECT 'employer_monitoring', COUNT(*) FROM employer_monitoring
UNION ALL SELECT 'career_advisor_sessions', COUNT(*) FROM career_advisor_sessions;
