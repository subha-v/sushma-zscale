-- ============================================================================
-- UTA SKILLS ALIGNMENT - Skills mapping between programs and industries
-- Run after 03-programs.sql AND 08-industries.sql
-- ============================================================================

-- ============================================================================
-- COMPUTER SCIENCE → TECHNOLOGY
-- ============================================================================
INSERT INTO uta_skills_alignment (program_id, industry_id, skill_name, skill_category, program_teaches, industry_demands, demand_level, gap_status)
VALUES
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Python', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Java', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Data Structures & Algorithms', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'SQL & Databases', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Machine Learning', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Cloud Computing (AWS/Azure)', 'software', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'DevOps & CI/CD', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Agile/Scrum Methodology', 'communication', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'React/Angular Frontend', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Operating Systems', 'technical', true, true, 'medium', 'aligned'),

  -- CS → Aerospace & Defense
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'C/C++', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Cybersecurity Fundamentals', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Security Clearance Eligibility', 'certification', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Embedded Systems', 'technical', true, true, 'high', 'aligned'),

-- ============================================================================
-- MECHANICAL ENGINEERING → AUTOMOTIVE & AEROSPACE
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Automotive Manufacturing'),
   'CAD/CAM (SolidWorks/CATIA)', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Automotive Manufacturing'),
   'Finite Element Analysis', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Automotive Manufacturing'),
   'Lean Manufacturing/Six Sigma', 'analytical', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Automotive Manufacturing'),
   'GD&T', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Automotive Manufacturing'),
   'PLC Programming', 'software', false, true, 'medium', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Aerodynamics & Flight Mechanics', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Composite Materials', 'technical', true, true, 'medium', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'MATLAB/Simulink', 'software', true, true, 'high', 'aligned'),

-- ============================================================================
-- NURSING → HEALTHCARE
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Patient Assessment', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Electronic Health Records (Epic)', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Medication Administration', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Critical Care', 'domain', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Telehealth Technology', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Evidence-Based Practice', 'analytical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Health Informatics', 'software', false, true, 'medium', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Cultural Competency', 'communication', true, true, 'high', 'aligned'),

-- ============================================================================
-- ACCOUNTING → FINANCIAL SERVICES / PROFESSIONAL SERVICES
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Financial Services'),
   'GAAP/IFRS Accounting', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Financial Services'),
   'Financial Analysis', 'analytical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Financial Services'),
   'Excel Advanced', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'Audit Methodology', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'Data Analytics (Power BI/Tableau)', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'CPA Preparation', 'certification', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'ERP Systems (SAP/Oracle)', 'software', false, true, 'high', 'gap'),

-- ============================================================================
-- CIVIL ENGINEERING → CONSTRUCTION / GOVERNMENT
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'AutoCAD/Civil 3D', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Structural Analysis', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Project Management (Procore)', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Government'),
   'GIS/Mapping', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Government'),
   'Stormwater Management', 'domain', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Government'),
   'Transportation Planning', 'domain', true, true, 'medium', 'aligned'),

-- ============================================================================
-- DATA SCIENCE → TECHNOLOGY / FINANCIAL SERVICES
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Python/R Programming', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Machine Learning & AI', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Statistical Modeling', 'analytical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Technology & Software'),
   'Big Data (Spark/Hadoop)', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Financial Services'),
   'Business Intelligence', 'analytical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Financial Services'),
   'Data Visualization (Tableau)', 'software', true, true, 'high', 'aligned'),

-- ============================================================================
-- EDUCATION → EDUCATION SERVICES
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Education Services'),
   'Classroom Management', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Education Services'),
   'Curriculum Design', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Education Services'),
   'Educational Technology', 'software', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Education Services'),
   'Bilingual Education', 'domain', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Education Services'),
   'Special Education Basics', 'domain', true, true, 'high', 'aligned'),

-- ============================================================================
-- ELECTRICAL ENGINEERING → ENERGY / AEROSPACE
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Energy & Utilities'),
   'Power Systems Design', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Energy & Utilities'),
   'SCADA Systems', 'software', false, true, 'high', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Energy & Utilities'),
   'Renewable Energy Systems', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'Signal Processing', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Aerospace & Defense'),
   'RF Design', 'technical', true, true, 'high', 'aligned'),

-- ============================================================================
-- SOCIAL WORK → HEALTHCARE
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Clinical Assessment', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Trauma-Informed Care', 'domain', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Case Management', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'LCSW Preparation', 'certification', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Healthcare & Social Assistance'),
   'Electronic Health Records', 'software', false, true, 'medium', 'gap'),

-- ============================================================================
-- ARCHITECTURE → CONSTRUCTION
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Revit BIM', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Sustainable Design (LEED)', 'domain', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Construction Documents', 'domain', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Homebuilding & Construction'),
   'Building Codes & Zoning', 'domain', true, true, 'high', 'aligned'),

-- ============================================================================
-- BIOMEDICAL ENGINEERING → MEDICAL TECHNOLOGY
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Biomedical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Medical Technology & Devices'),
   'Medical Device Design', 'technical', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Biomedical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Medical Technology & Devices'),
   'FDA Regulatory Affairs', 'domain', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Biomedical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Medical Technology & Devices'),
   'Biomechanics', 'technical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Biomedical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Medical Technology & Devices'),
   'Quality Management (ISO 13485)', 'certification', false, true, 'high', 'gap'),

-- ============================================================================
-- INFORMATION SYSTEMS → PROFESSIONAL SERVICES
-- ============================================================================
  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'ERP Implementation (SAP)', 'software', true, true, 'critical', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'Business Process Modeling', 'analytical', true, true, 'high', 'aligned'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'Cloud Platforms', 'software', false, true, 'critical', 'gap'),
  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_industries WHERE industry_name = 'Professional & Technical Services'),
   'Salesforce Administration', 'software', false, true, 'high', 'gap')
ON CONFLICT (program_id, industry_id, skill_name) DO NOTHING;

-- ============================================================================
-- DONE - ~90 skills alignment records inserted
-- Next: Run 11-labor-stats.sql
-- ============================================================================
