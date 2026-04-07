-- ============================================================================
-- 22-grapevine-data.sql
-- Grapevine, TX — Employer, Job, Development, Industry, Labor & EDC data
-- Safe to re-run (all INSERTs use ON CONFLICT DO NOTHING)
-- ============================================================================

-- ============================================================================
-- 22A. EMPLOYERS (10 records → arlington_employers with city='Grapevine')
-- ============================================================================

INSERT INTO arlington_employers (company_name, industry, naics_code, employee_count, employee_range, city, state, zip_code, is_fortune_500, is_headquartered_locally, website_url, description, year_established, hires_uta_grads)
VALUES
  ('DFW International Airport', 'Aviation & Logistics', '488119', 1500, '1000-4999', 'Grapevine', 'TX', '76051', false, true, 'https://www.dfwairport.com', '4th busiest US airport, major economic engine for DFW region', 1974, false),
  ('Kubota North America HQ', 'Manufacturing & Equipment', '333111', 500, '100-499', 'Grapevine', 'TX', '76051', false, true, 'https://www.kubotausa.com', '$51M headquarters campus (193,000 sq ft), relocated from CA in 2017 with Gov. Abbott', 2017, false),
  ('Paycom', 'Software & HR Technology', '511210', 1000, '500-999', 'Grapevine', 'TX', '76051', false, false, 'https://www.paycom.com', '150,000 sq ft operations center on 14-acre campus, 2nd largest Paycom office', 2018, false),
  ('GameStop Corp HQ', 'Retail & Gaming', '443142', 500, '100-499', 'Grapevine', 'TX', '76051', false, true, 'https://www.gamestop.com', 'Global headquarters for video game retailer', 1996, false),
  ('Gaylord Texan Resort', 'Hospitality & Tourism', '721110', 2000, '1000-4999', 'Grapevine', 'TX', '76051', false, false, 'https://www.marriott.com/gaylord-texan', '1,814 rooms + 127 suites, 486,000 sq ft meeting space, 2nd-largest non-gaming convention hotel in US', 2004, false),
  ('Great Wolf Lodge Grapevine', 'Hospitality & Entertainment', '721110', 500, '100-499', 'Grapevine', 'TX', '76051', false, false, 'https://www.greatwolf.com', '605-room indoor waterpark resort', 2005, false),
  ('Baylor Scott & White - Grapevine', 'Healthcare', '622110', 2000, '1000-4999', 'Grapevine', 'TX', '76051', false, false, 'https://www.bswhealth.com', '302-bed Level II Trauma Center, nearly 70 years serving NE Tarrant County', 1957, false),
  ('Grapevine-Colleyville ISD', 'K-12 Education', '611110', 1861, '1000-4999', 'Grapevine', 'TX', '76051', false, true, 'https://www.gcisd.net', '13,536 students, 21 schools, highly rated district', 1902, false),
  ('Hilton DFW Lakes', 'Hospitality', '721110', 300, '100-499', 'Grapevine', 'TX', '76051', false, false, 'https://www.hilton.com', 'Executive conference center and resort near DFW Airport', 1985, false),
  ('Grapevine Mills Mall (Simon)', 'Retail & Entertainment', '531120', 2000, '1000-4999', 'Grapevine', 'TX', '76051', false, false, 'https://www.simon.com/mall/grapevine-mills', '180 stores, 96.5% occupancy, major DFW retail destination', 1997, false)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22B. JOB OPENINGS (10 records → arlington_job_openings)
-- ============================================================================

INSERT INTO arlington_job_openings (employer_id, job_title, department, salary_min, salary_max, salary_type, education_required, experience_years_min, required_skills, preferred_skills, is_entry_level, is_internship, job_type, remote_option, openings_count, posted_date, is_active)
VALUES
  ((SELECT id FROM arlington_employers WHERE company_name = 'DFW International Airport' LIMIT 1), 'Airport Operations Coordinator', 'Operations', 52000, 68000, 'annual', 'bachelor', 0, ARRAY['Operations Management', 'FAA Regulations', 'Emergency Response'], ARRAY['Aviation Management', 'TSA Protocols'], true, false, 'full-time', 'on-site', 8, '2026-03-15', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Kubota North America HQ' LIMIT 1), 'Marketing Manager', 'Marketing', 85000, 110000, 'annual', 'bachelor', 3, ARRAY['Brand Management', 'Digital Marketing', 'Market Analysis'], ARRAY['Manufacturing Industry Experience', 'Bilingual Japanese'], false, false, 'full-time', 'hybrid', 3, '2026-03-10', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Kubota North America HQ' LIMIT 1), 'Supply Chain Analyst', 'Operations', 62000, 80000, 'annual', 'bachelor', 0, ARRAY['Supply Chain Management', 'Data Analysis', 'SAP'], ARRAY['Six Sigma', 'Lean Manufacturing'], true, false, 'full-time', 'on-site', 5, '2026-03-12', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Paycom' AND city = 'Grapevine' LIMIT 1), 'Software Developer', 'Engineering', 78000, 105000, 'annual', 'bachelor', 0, ARRAY['Java', 'SQL', 'REST APIs', 'Agile'], ARRAY['React', 'AWS', 'TypeScript'], true, false, 'full-time', 'hybrid', 6, '2026-03-18', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Paycom' AND city = 'Grapevine' LIMIT 1), 'Client Relations Representative', 'Sales', 52000, 65000, 'annual', 'bachelor', 0, ARRAY['Client Management', 'CRM Software', 'Communication'], ARRAY['HR/Payroll Industry Knowledge'], true, false, 'full-time', 'on-site', 4, '2026-03-14', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'GameStop Corp HQ' LIMIT 1), 'E-Commerce Product Manager', 'Digital Commerce', 90000, 120000, 'annual', 'bachelor', 3, ARRAY['Product Management', 'E-Commerce Platforms', 'A/B Testing', 'Analytics'], ARRAY['Gaming Industry', 'Shopify Plus'], false, false, 'full-time', 'hybrid', 2, '2026-03-08', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Gaylord Texan Resort' LIMIT 1), 'Hospitality Manager', 'Hotel Operations', 55000, 72000, 'annual', 'bachelor', 2, ARRAY['Hotel Operations', 'Team Management', 'Guest Services'], ARRAY['Marriott Brand Standards', 'Revenue Management'], false, false, 'full-time', 'on-site', 4, '2026-03-20', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Gaylord Texan Resort' LIMIT 1), 'Event Coordinator', 'Events & Conferences', 42000, 55000, 'annual', 'associate', 0, ARRAY['Event Planning', 'Client Communication', 'Project Management'], ARRAY['Cvent', 'Corporate Events'], true, false, 'full-time', 'on-site', 6, '2026-03-17', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Baylor Scott & White - Grapevine' LIMIT 1), 'Registered Nurse', 'Nursing', 64000, 85000, 'annual', 'bachelor', 0, ARRAY['Patient Assessment', 'EMR', 'NCLEX-RN', 'Critical Care'], ARRAY['Epic EHR', 'Trauma Experience'], true, false, 'full-time', 'on-site', 12, '2026-03-19', true),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Grapevine-Colleyville ISD' LIMIT 1), 'STEM Teacher', 'Instruction', 56000, 72000, 'annual', 'bachelor', 0, ARRAY['STEM Curriculum', 'Classroom Management', 'Differentiated Instruction'], ARRAY['Robotics', 'AP Certified'], true, false, 'full-time', 'on-site', 8, '2026-03-16', true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22C. DEVELOPMENT PROJECTS (6 records → arlington_development)
-- ============================================================================

INSERT INTO arlington_development (project_name, project_type, developer, investment_amount, estimated_jobs, status, location_description, start_year, completion_year, description, industries_impacted)
VALUES
  ('Kubota North America HQ Campus', 'commercial', 'Kubota Tractor Corporation', 51000000, 500, 'operational', 'Kubota NA HQ, Grapevine TX', 2015, 2017, '$51M, 193,000 sq ft corporate headquarters. Relocated from Torrance, CA. Grand opening with Gov. Abbott in 2017.', ARRAY['Manufacturing & Equipment', 'Corporate HQ']),
  ('DFW Terminal F Modernization', 'infrastructure', 'DFW Airport Board', 4000000000, 5000, 'under_construction', 'DFW International Airport, Grapevine TX', 2023, 2030, '$4B Terminal F expansion and modernization. Phase 1 opening in 2027. Largest airport capital improvement program in the US.', ARRAY['Aviation & Logistics', 'Construction', 'Technology']),
  ('Grapevine Main Station / TEXRail TOD', 'infrastructure', 'City of Grapevine / Trinity Metro', 114000000, 400, 'operational', 'Main Street Station, Grapevine TX', 2016, 2019, '$114M transit-oriented development including TEXRail commuter rail station connecting Grapevine to Fort Worth and DFW Airport.', ARRAY['Transportation', 'Mixed-Use Development']),
  ('Gaylord Texan Vineyard Tower + Renovation', 'commercial', 'Ryman Hospitality / Marriott', 174000000, 400, 'operational', 'Gaylord Texan Resort, Grapevine TX', 2018, 2024, '$120M Vineyard Tower addition (303 rooms) + $54M renovation of existing property. Cemented status as 2nd-largest non-gaming convention hotel in US.', ARRAY['Hospitality & Tourism', 'Construction']),
  ('SH-114 Corridor Expansion', 'infrastructure', 'TxDOT', 99000000, 300, 'under_construction', 'SH-114, Grapevine/Southlake TX', 2022, 2026, '$99M highway expansion improving connectivity between Grapevine, Southlake, and DFW Airport. Includes new interchanges and frontage roads.', ARRAY['Transportation', 'Economic Development']),
  ('Hotel Vin Reserve (2nd Tower)', 'commercial', 'Harvest Hall Hospitality', 40000000, 100, 'under_construction', 'Historic Main Street, Grapevine TX', 2024, 2026, '$40M second tower addition to boutique Hotel Vin adjacent to TEXRail station. Expanding Historic Main Street as a destination district.', ARRAY['Hospitality & Tourism', 'Mixed-Use Development'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22D. INDUSTRIES (7 records → arlington_industries with "(Grapevine)" suffix)
-- ============================================================================

INSERT INTO arlington_industries (industry_name, naics_sector, employment_count, avg_annual_wage, growth_rate, location_quotient, top_occupations, key_employers, description, data_year, data_source)
VALUES
  ('Hospitality & Tourism (Grapevine)', '721', 8500, 42000, 5.8, 2.5, ARRAY['Hotel Managers', 'Event Coordinators', 'Food Service Managers'], ARRAY['Gaylord Texan', 'Great Wolf Lodge', 'Hilton DFW Lakes'], 'Grapevine is a premier hospitality destination anchored by the Gaylord Texan and proximity to DFW Airport.', 2024, 'TWC / BLS'),
  ('Aviation & Logistics (Grapevine)', '488', 4200, 65000, 4.1, 3.2, ARRAY['Airport Operations', 'Air Traffic Control', 'Cargo Handlers'], ARRAY['DFW International Airport', 'American Airlines', 'FedEx'], 'DFW Airport (4th busiest US) drives significant aviation employment in Grapevine.', 2024, 'TWC / BLS'),
  ('Technology & Software (Grapevine)', '5112', 2800, 95000, 7.5, 0.9, ARRAY['Software Developers', 'Systems Analysts', 'Data Engineers'], ARRAY['Paycom', 'GameStop Digital', 'Various Tech Companies'], 'Growing tech presence anchored by Paycom operations center and GameStop HQ digital teams.', 2024, 'TWC / BLS'),
  ('Healthcare (Grapevine)', '622', 3200, 62000, 3.8, 1.1, ARRAY['Registered Nurses', 'Medical Technologists', 'Physicians'], ARRAY['Baylor Scott & White - Grapevine', 'Texas Health Harris Methodist'], 'BSW Grapevine (302-bed Level II Trauma Center) anchors healthcare employment.', 2024, 'TWC / BLS'),
  ('Retail & Entertainment (Grapevine)', '44-45', 5500, 36000, 3.2, 1.8, ARRAY['Store Managers', 'Sales Associates', 'Visual Merchandisers'], ARRAY['Grapevine Mills Mall', 'Historic Main Street Shops', 'Bass Pro Shops'], 'Grapevine Mills (180 stores, 96.5% occupancy) and Historic Main Street drive retail employment.', 2024, 'TWC / BLS'),
  ('Manufacturing & Equipment (Grapevine)', '333', 1200, 72000, 4.5, 1.6, ARRAY['Manufacturing Engineers', 'Quality Technicians', 'Supply Chain Managers'], ARRAY['Kubota North America', 'Various Industrial'], 'Kubota NA HQ anchors manufacturing with a $51M campus and 500+ employees.', 2024, 'TWC / BLS'),
  ('Education (Grapevine)', '611', 4000, 55000, 2.1, 1.2, ARRAY['Teachers', 'Administrators', 'Counselors'], ARRAY['Grapevine-Colleyville ISD', 'Tarrant County College'], 'GCISD employs 1,861 staff across 21 schools. Highly rated district.', 2024, 'TWC / BLS')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22E. LABOR STATS (8 records → arlington_labor_stats with geography='Grapevine, TX')
-- ============================================================================

INSERT INTO arlington_labor_stats (metric_name, metric_category, metric_value, metric_unit, geography, time_period, data_source, notes)
VALUES
  ('Total Population', 'demographics', 51320, 'count', 'Grapevine, TX', '2024', 'Census ACS', 'City of Grapevine population estimate'),
  ('Median Household Income', 'wages', 112000, 'dollars', 'Grapevine, TX', '2024', 'Census ACS', 'Significantly above DFW average ($68,500 for Arlington)'),
  ('Unemployment Rate', 'employment', 3.4, 'percent', 'Grapevine, TX', 'Q4 2024', 'BLS LAUS', 'Tarrant County rate, proxy for Grapevine'),
  ('Total Employment', 'employment', 29218, 'count', 'Grapevine, TX', '2024', 'Data USA / Census', 'Employed residents of Grapevine'),
  ('Average Weekly Wages', 'wages', 1450, 'dollars', 'Grapevine, TX', 'Q3 2024', 'BLS QCEW', 'Estimated from Tarrant County data'),
  ('Hospitality Employment', 'employment', 8500, 'count', 'Grapevine, TX', '2024', 'TWC', 'Largest employment sector in Grapevine'),
  ('Total Investment Since 2014', 'industry', 2000000000, 'dollars', 'Grapevine, TX', '2014-2024', 'Grapevine EDC', '$2B+ in total investment attracted by Grapevine EDC'),
  ('Software Developer Median Salary', 'occupation', 102000, 'dollars', 'Grapevine, TX', '2024', 'BLS OES', 'Fort Worth-Arlington metro area median for software developers')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22F. SITE SELECTION PACKAGES (2 records)
-- ============================================================================

INSERT INTO site_selection_packages (company_name, industry, target_roles, headcount_needed, status, key_highlights)
VALUES
  ('Corporate HQ Prospect - Grapevine', 'Corporate / Technology', ARRAY['Executive', 'Software Engineer', 'Operations Manager', 'Marketing Manager'], 200, 'complete', ARRAY['Adjacent to DFW International Airport (4th busiest US airport)', 'Median household income $112K — affluent, educated workforce', '$2B+ Grapevine EDC track record of corporate attraction', 'Kubota chose Grapevine for NA HQ ($51M campus)', 'SH-114 Class-A office corridor with expansion capacity', 'TEXRail commuter rail connects to Fort Worth and DFW Airport']),
  ('Hospitality & Tourism Expansion - Grapevine', 'Hospitality & Tourism', ARRAY['Hotel Manager', 'Event Coordinator', 'Food Service Manager', 'Guest Services'], 150, 'complete', ARRAY['8,500+ hospitality workers already in Grapevine', 'Gaylord Texan (2,000 employees) + Great Wolf Lodge anchors', '500K+ annual visitors to Grapevine attractions', 'Historic Main Street + Grapevine Mills + DFW hotel cluster', 'New Hotel Vin Reserve expanding boutique hospitality capacity', 'Tarrant County College hospitality training pipeline'])
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22G. EMPLOYER MONITORING ALERTS (4 records)
-- ============================================================================

INSERT INTO employer_monitoring (employer_id, signal_type, signal_strength, title, description, source, is_acknowledged, detected_at)
VALUES
  ((SELECT id FROM arlington_employers WHERE company_name = 'Kubota North America HQ' LIMIT 1), 'expansion', 'strong', 'R&D center and dealer training facility expansion', 'Kubota expanding Grapevine campus with new R&D center and dealer training facility. Estimated 100+ new positions in engineering, product development, and training. Expansion leverages $51M campus investment.', 'Corporate press release + Grapevine EDC — March 2026', false, '2026-03-22'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Paycom' AND city = 'Grapevine' LIMIT 1), 'hiring_surge', 'strong', '40+ new positions — CEO cites DFW talent quality', 'Paycom Grapevine operations center posting 40+ positions across software engineering, client services, and data analytics. CEO cited DFW candidate quality and UTA/UNT pipeline as expansion drivers.', 'Job posting analysis + earnings call — Q1 2026', false, '2026-03-20'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'Gaylord Texan Resort' LIMIT 1), 'expansion', 'strong', '$54M renovation underway, Vineyard Tower completed', 'Gaylord Texan completing $54M renovation of original property after opening $120M Vineyard Tower (303 rooms). Resort now has 1,814+ rooms. Hiring for expanded F&B, events, and guest services roles.', 'Community Impact + Marriott investor filings — Q1 2026', false, '2026-03-15'),
  ((SELECT id FROM arlington_employers WHERE company_name = 'DFW International Airport' LIMIT 1), 'new_facility', 'critical', '$4B Terminal F — Phase 1 opening 2027', 'DFW Airport Board approved $4B Terminal F modernization, the largest airport capital program in the US. Phase 1 opens 2027. 5,000+ construction and 500+ permanent operations jobs. Will reshape Grapevine-side employment.', 'DFW Airport Board + Dallas Innovates — March 2026', false, '2026-03-18')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 22H. REGIONAL COMPARISON STATS (9 records for Grapevine + Southlake + Frisco)
-- ============================================================================

INSERT INTO arlington_labor_stats (metric_name, metric_category, metric_value, metric_unit, geography, time_period, data_source, notes)
VALUES
  -- Southlake
  ('Total Employment', 'employment', 15000, 'count', 'Southlake, TX', '2024', 'Data USA / Census', 'Employed residents of Southlake'),
  ('Average Weekly Wages', 'wages', 1800, 'dollars', 'Southlake, TX', 'Q3 2024', 'BLS QCEW', 'Estimated from Tarrant County data'),
  ('Unemployment Rate', 'employment', 2.8, 'percent', 'Southlake, TX', 'Q4 2024', 'BLS LAUS', 'Tarrant County rate, proxy for Southlake'),
  -- Frisco
  ('Total Employment', 'employment', 120000, 'count', 'Frisco, TX', '2024', 'Data USA / Census', 'Employed residents of Frisco'),
  ('Average Weekly Wages', 'wages', 1550, 'dollars', 'Frisco, TX', 'Q3 2024', 'BLS QCEW', 'Estimated from Collin County data'),
  ('Unemployment Rate', 'employment', 3.2, 'percent', 'Frisco, TX', 'Q4 2024', 'BLS LAUS', 'Collin County rate, proxy for Frisco')
ON CONFLICT DO NOTHING;

-- Note: Grapevine stats already inserted in section 22E above

-- ============================================================================
-- 22I. BUSINESSES (8 records → businesses table for EDC default dashboard)
-- ============================================================================

INSERT INTO businesses (company_name, county_fips, naics_code, company_size, employee_count, city, structural_risk_score, open_positions, is_active)
VALUES
  ('Gaylord Texan Resort', '48439', '721110', 'large', 2000, 'Grapevine', 0.10, 85, true),
  ('Baylor Scott & White - Grapevine', '48439', '622110', 'large', 2000, 'Grapevine', 0.08, 120, true),
  ('Grapevine Mills Mall (Simon)', '48439', '531120', 'large', 2000, 'Grapevine', 0.15, 95, true),
  ('Grapevine-Colleyville ISD', '48439', '611110', 'large', 1861, 'Grapevine', 0.22, 45, true),
  ('DFW Airport (Grapevine)', '48439', '488119', 'large', 1500, 'Grapevine', 0.05, 65, true),
  ('Paycom Grapevine', '48439', '511210', 'large', 1000, 'Grapevine', 0.08, 42, true),
  ('Kubota NA HQ', '48439', '333111', 'medium', 500, 'Grapevine', 0.12, 28, true),
  ('Great Wolf Lodge Grapevine', '48439', '721110', 'medium', 500, 'Grapevine', 0.18, 35, true)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (run these after inserting)
-- ============================================================================
-- SELECT city, COUNT(*) FROM arlington_employers GROUP BY city;
-- SELECT * FROM arlington_employers WHERE city = 'Grapevine';
-- SELECT * FROM arlington_industries WHERE industry_name ILIKE '%grapevine%';
-- SELECT * FROM arlington_development WHERE location_description ILIKE '%grapevine%';
-- SELECT * FROM arlington_labor_stats WHERE geography = 'Grapevine, TX';
-- SELECT * FROM employer_monitoring em JOIN arlington_employers ae ON em.employer_id = ae.id WHERE ae.city = 'Grapevine';
-- SELECT * FROM businesses WHERE city = 'Grapevine';
-- SELECT * FROM site_selection_packages WHERE company_name ILIKE '%grapevine%';
