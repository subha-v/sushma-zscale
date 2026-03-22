-- ============================================================================
-- UTA PROGRAM OUTCOMES - Salary, employment, graduation data
-- Run after 03-programs.sql
-- Sources: UTA Institutional Research, NACE, BLS, Texas Higher Education Data
-- ============================================================================

-- Helper: Insert outcomes using program name + degree type subquery
-- Engineering Programs
INSERT INTO uta_program_outcomes (program_id, outcome_year, graduation_rate, employment_rate, median_starting_salary, median_mid_career_salary, avg_time_to_degree_months, total_graduates, employed_in_field_pct, continuing_education_pct, top_employers, top_job_titles, data_source)
VALUES
  -- Computer Science BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   2024, 52.0, 82.0, 68300, 115000, 48, 485, 74.0, 18.0,
   ARRAY['Lockheed Martin', 'Texas Instruments', 'Bell Textron', 'Amazon', 'Deloitte'],
   ARRAY['Software Developer', 'Data Engineer', 'Systems Analyst', 'QA Engineer'],
   'UTA Career Development Center / NACE'),

  -- Computer Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Engineering' AND degree_type = 'BS'),
   2024, 48.0, 80.0, 66700, 112000, 50, 120, 72.0, 22.0,
   ARRAY['Texas Instruments', 'Lockheed Martin', 'Raytheon', 'Bell Textron', 'Samsung'],
   ARRAY['Hardware Engineer', 'Embedded Systems Engineer', 'FPGA Developer'],
   'UTA Career Development Center / NACE'),

  -- Software Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Software Engineering' AND degree_type = 'BS'),
   2024, 50.0, 84.0, 67500, 118000, 48, 95, 78.0, 15.0,
   ARRAY['Amazon', 'Microsoft', 'Lockheed Martin', 'GM Financial', 'Deloitte'],
   ARRAY['Software Engineer', 'Full Stack Developer', 'DevOps Engineer'],
   'UTA Career Development Center / NACE'),

  -- Mechanical Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   2024, 50.0, 78.0, 64800, 105000, 50, 210, 70.0, 20.0,
   ARRAY['Lockheed Martin', 'Bell Textron', 'GM Arlington', 'Toyota', 'Peterbilt'],
   ARRAY['Mechanical Engineer', 'Design Engineer', 'Manufacturing Engineer', 'Project Engineer'],
   'UTA Career Development Center / NACE'),

  -- Electrical Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   2024, 47.0, 79.0, 65200, 108000, 50, 165, 71.0, 22.0,
   ARRAY['Texas Instruments', 'Lockheed Martin', 'Raytheon', 'L3Harris', 'Samsung'],
   ARRAY['Electrical Engineer', 'RF Engineer', 'Power Systems Engineer', 'Controls Engineer'],
   'UTA Career Development Center / NACE'),

  -- Civil Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   2024, 52.0, 76.0, 62000, 98000, 50, 145, 68.0, 18.0,
   ARRAY['Jacobs Engineering', 'Kimley-Horn', 'TxDOT', 'City of Arlington', 'Freese and Nichols'],
   ARRAY['Civil Engineer', 'Structural Engineer', 'Transportation Engineer', 'Project Manager'],
   'UTA Career Development Center / NACE'),

  -- Aerospace Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Aerospace Engineering' AND degree_type = 'BS'),
   2024, 46.0, 81.0, 66000, 110000, 52, 85, 73.0, 25.0,
   ARRAY['Lockheed Martin', 'Bell Textron', 'Northrop Grumman', 'Raytheon', 'NASA'],
   ARRAY['Aerospace Engineer', 'Flight Test Engineer', 'Systems Engineer', 'Propulsion Engineer'],
   'UTA Career Development Center / NACE'),

  -- Industrial Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Industrial Engineering' AND degree_type = 'BS'),
   2024, 53.0, 80.0, 63500, 102000, 48, 90, 72.0, 16.0,
   ARRAY['Amazon', 'GM Arlington', 'Lockheed Martin', 'D.R. Horton', 'BNSF'],
   ARRAY['Industrial Engineer', 'Supply Chain Analyst', 'Process Engineer', 'Quality Engineer'],
   'UTA Career Development Center / NACE'),

  -- Biomedical Engineering BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Biomedical Engineering' AND degree_type = 'BS'),
   2024, 45.0, 70.0, 60500, 95000, 52, 65, 55.0, 35.0,
   ARRAY['Texas Health Resources', 'JPS Health Network', 'Medtronic', 'Abbott', 'Stryker'],
   ARRAY['Biomedical Engineer', 'Clinical Engineer', 'Research Associate', 'Medical Device Specialist'],
   'UTA Career Development Center / NACE'),

  -- Nursing BSN
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   2024, 72.0, 93.0, 70300, 85000, 48, 520, 90.0, 8.0,
   ARRAY['Texas Health Resources', 'Medical City Arlington', 'JPS Health Network', 'Baylor Scott & White', 'Cook Childrens'],
   ARRAY['Registered Nurse', 'ICU Nurse', 'ER Nurse', 'Pediatric Nurse', 'OR Nurse'],
   'UTA CONHI / NCLEX Data'),

  -- Public Health BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Public Health' AND degree_type = 'BS'),
   2024, 58.0, 72.0, 45000, 65000, 48, 110, 60.0, 28.0,
   ARRAY['Tarrant County Public Health', 'Texas Health Resources', 'CDC', 'UTA'],
   ARRAY['Health Educator', 'Epidemiologist', 'Community Health Worker', 'Public Health Analyst'],
   'UTA Career Development Center'),

  -- Biology BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Biology' AND degree_type = 'BS'),
   2024, 50.0, 65.0, 42000, 72000, 48, 340, 45.0, 42.0,
   ARRAY['Texas Health Resources', 'JPS Health Network', 'Quest Diagnostics', 'UT Southwestern'],
   ARRAY['Lab Technician', 'Research Assistant', 'Medical School', 'Pharmaceutical Sales'],
   'UTA Career Development Center'),

  -- Chemistry BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Chemistry' AND degree_type = 'BS'),
   2024, 48.0, 62.0, 44000, 78000, 48, 85, 42.0, 48.0,
   ARRAY['Alcon', 'BASF', 'UT Southwestern', 'EPA'],
   ARRAY['Chemist', 'Lab Analyst', 'Quality Control Analyst', 'Research Associate'],
   'UTA Career Development Center'),

  -- Data Science BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   2024, 55.0, 85.0, 65000, 110000, 48, 75, 76.0, 16.0,
   ARRAY['Amazon', 'Deloitte', 'Capital One', 'American Airlines', 'AT&T'],
   ARRAY['Data Analyst', 'Data Scientist', 'Business Intelligence Analyst', 'ML Engineer'],
   'UTA Career Development Center / NACE'),

  -- Mathematics BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Mathematics' AND degree_type = 'BS'),
   2024, 46.0, 68.0, 52000, 88000, 48, 60, 50.0, 38.0,
   ARRAY['Financial Institutions', 'Insurance Companies', 'School Districts', 'Defense Contractors'],
   ARRAY['Actuary', 'Data Analyst', 'Math Teacher', 'Financial Analyst'],
   'UTA Career Development Center'),

  -- Psychology BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Psychology' AND degree_type = 'BS'),
   2024, 56.0, 60.0, 38000, 58000, 48, 420, 35.0, 40.0,
   ARRAY['JPS Health Network', 'MHMR Tarrant', 'School Districts', 'Private Practice'],
   ARRAY['Case Manager', 'Research Coordinator', 'Behavioral Health Tech', 'HR Specialist'],
   'UTA Career Development Center'),

  -- Accounting BBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   2024, 58.0, 78.0, 56000, 92000, 48, 280, 72.0, 22.0,
   ARRAY['Deloitte', 'Ernst & Young', 'KPMG', 'PwC', 'Grant Thornton'],
   ARRAY['Staff Accountant', 'Auditor', 'Tax Associate', 'Financial Analyst'],
   'UTA Career Development Center / NACE'),

  -- Finance BBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Finance' AND degree_type = 'BBA'),
   2024, 56.0, 76.0, 55000, 95000, 48, 195, 68.0, 18.0,
   ARRAY['Goldman Sachs', 'JPMorgan Chase', 'GM Financial', 'Charles Schwab', 'Bank of America'],
   ARRAY['Financial Analyst', 'Investment Banking Analyst', 'Credit Analyst', 'Wealth Advisor'],
   'UTA Career Development Center / NACE'),

  -- Management BBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Management' AND degree_type = 'BBA'),
   2024, 54.0, 72.0, 48000, 82000, 48, 250, 58.0, 14.0,
   ARRAY['Amazon', 'D.R. Horton', 'GM Arlington', 'Enterprise', 'Target'],
   ARRAY['Management Trainee', 'Operations Coordinator', 'Project Coordinator', 'Business Analyst'],
   'UTA Career Development Center'),

  -- Marketing BBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Marketing' AND degree_type = 'BBA'),
   2024, 55.0, 74.0, 46000, 78000, 48, 180, 60.0, 12.0,
   ARRAY['AT&T', 'American Airlines', 'Match Group', 'Six Flags', 'Keurig Dr Pepper'],
   ARRAY['Marketing Coordinator', 'Digital Marketing Specialist', 'Brand Associate', 'Sales Representative'],
   'UTA Career Development Center'),

  -- Information Systems BBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   2024, 52.0, 82.0, 60000, 100000, 48, 140, 74.0, 16.0,
   ARRAY['Deloitte', 'Accenture', 'AT&T', 'American Airlines', 'Capital One'],
   ARRAY['Business Systems Analyst', 'IT Consultant', 'ERP Specialist', 'Data Analyst'],
   'UTA Career Development Center / NACE'),

  -- Communication BA
  ((SELECT id FROM uta_programs WHERE program_name = 'Communication' AND degree_type = 'BA'),
   2024, 58.0, 68.0, 40000, 62000, 48, 210, 52.0, 12.0,
   ARRAY['NBC Universal', 'AT&T', 'Various Agencies', 'Dallas Morning News', 'iHeart Media'],
   ARRAY['Communications Specialist', 'PR Coordinator', 'Social Media Manager', 'Content Creator'],
   'UTA Career Development Center'),

  -- Criminology BA
  ((SELECT id FROM uta_programs WHERE program_name = 'Criminology and Criminal Justice' AND degree_type = 'BA'),
   2024, 54.0, 70.0, 42000, 65000, 48, 185, 60.0, 18.0,
   ARRAY['Arlington PD', 'Tarrant County', 'Texas DPS', 'FBI', 'US Marshals'],
   ARRAY['Police Officer', 'Probation Officer', 'Crime Analyst', 'Corrections Officer', 'Federal Agent'],
   'UTA Career Development Center'),

  -- Architecture BS
  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   2024, 48.0, 72.0, 48000, 82000, 52, 55, 62.0, 35.0,
   ARRAY['HKS', 'Gensler', 'Corgan', 'BOKA Powell', 'Perkins&Will'],
   ARRAY['Architectural Designer', 'Junior Architect', 'BIM Specialist', 'Urban Designer'],
   'UTA Career Development Center'),

  -- Social Work BSW
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'BSW'),
   2024, 60.0, 75.0, 40000, 52000, 48, 90, 65.0, 30.0,
   ARRAY['MHMR Tarrant', 'JPS Health Network', 'CPS', 'ACH Child and Family Services', 'Catholic Charities'],
   ARRAY['Case Manager', 'Social Worker', 'Family Advocate', 'Youth Counselor'],
   'UTA Career Development Center'),

  -- MBA
  ((SELECT id FROM uta_programs WHERE program_name = 'Business Administration' AND degree_type = 'MBA'),
   2024, 82.0, 88.0, 78000, 125000, 24, 340, 80.0, 2.0,
   ARRAY['Deloitte', 'American Airlines', 'AT&T', 'GM Financial', 'JPMorgan Chase'],
   ARRAY['Strategy Consultant', 'Product Manager', 'Finance Manager', 'Operations Director'],
   'UTA Career Development Center / NACE'),

  -- Computer Science MS
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'MS'),
   2024, 85.0, 90.0, 92000, 140000, 24, 280, 82.0, 8.0,
   ARRAY['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
   ARRAY['Senior Software Engineer', 'ML Engineer', 'Cloud Architect', 'Data Scientist'],
   'UTA Career Development Center / NACE'),

  -- Data Science MS (COE)
  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'MS' AND college_id = (SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering')),
   2024, 88.0, 92.0, 95000, 145000, 20, 120, 84.0, 5.0,
   ARRAY['Amazon', 'Capital One', 'AT&T', 'Deloitte', 'Goldman Sachs'],
   ARRAY['Data Scientist', 'ML Engineer', 'AI Research Scientist', 'Analytics Manager'],
   'UTA Career Development Center / NACE'),

  -- Nursing DNP
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing Practice' AND degree_type = 'DNP'),
   2024, 90.0, 98.0, 115000, 140000, 36, 65, 95.0, 2.0,
   ARRAY['Texas Health Resources', 'JPS Health Network', 'Baylor Scott & White', 'Private Practice'],
   ARRAY['Nurse Practitioner', 'Clinical Nurse Specialist', 'Nurse Anesthetist', 'Director of Nursing'],
   'UTA CONHI'),

  -- Nursing MSN
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'MSN'),
   2024, 88.0, 96.0, 88000, 105000, 24, 180, 90.0, 6.0,
   ARRAY['Texas Health Resources', 'Medical City', 'JPS Health Network', 'Baylor Scott & White'],
   ARRAY['Nurse Manager', 'Clinical Nurse Leader', 'Nurse Educator', 'Nurse Practitioner'],
   'UTA CONHI'),

  -- Social Work MSW
  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   2024, 85.0, 90.0, 52000, 68000, 24, 145, 82.0, 5.0,
   ARRAY['MHMR Tarrant', 'JPS Health Network', 'VA Hospital', 'CPS', 'Hospitals'],
   ARRAY['Licensed Clinical Social Worker', 'Therapist', 'Clinical Director', 'School Social Worker'],
   'UTA SSW')
ON CONFLICT (program_id, outcome_year) DO NOTHING;

-- ============================================================================
-- DONE - ~30 program outcomes inserted
-- Next: Run 05-employers.sql
-- ============================================================================
