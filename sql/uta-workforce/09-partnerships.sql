-- ============================================================================
-- UTA EMPLOYER PARTNERSHIPS - Program-to-employer links
-- Run after 03-programs.sql AND 05-employers.sql
-- ============================================================================

-- ENGINEERING PARTNERSHIPS
INSERT INTO uta_employer_partnerships (program_id, employer_id, partnership_type, avg_hires_per_year, avg_intern_salary, description, is_active)
VALUES
  -- Computer Science → Multiple Employers
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'hiring_pipeline', 25, 62000, 'Lockheed Martin recruits heavily from UTA CS for software engineering positions on defense programs.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'internship', 15, 58000, 'GM Financial offers summer internships to UTA CS students in software development and data engineering.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'hiring_pipeline', 20, 62000, 'Amazon recruits UTA CS graduates for SDE and data engineering roles at DFW offices.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'hiring_pipeline', 10, 56000, 'Deloitte hires UTA CS graduates for technology consulting and implementation roles.', true),

  -- Mechanical Engineering → Defense/Auto
  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'co-op', 8, 52000, 'GM offers co-op positions to UTA ME students in manufacturing engineering and quality.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'internship', 12, 55000, 'Bell hires UTA ME interns for rotorcraft design, stress analysis, and manufacturing.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Mechanical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'hiring_pipeline', 15, 60000, 'Lockheed Martin is a top employer of UTA ME graduates for F-35 and advanced programs.', true),

  -- Aerospace Engineering → Defense
  ((SELECT id FROM uta_programs WHERE program_name = 'Aerospace Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'hiring_pipeline', 10, 58000, 'Bell Textron is the top employer of UTA Aerospace Engineering graduates.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Aerospace Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'internship', 8, 60000, 'Lockheed Martin offers summer internships and co-ops to UTA AE students.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Aerospace Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'E-Space'),
   'capstone', 3, NULL, 'E-Space sponsors UTA AE capstone projects related to satellite constellation design.', true),

  -- Electrical Engineering
  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'L3Harris Technologies'),
   'hiring_pipeline', 8, 56000, 'L3Harris hires UTA EE graduates for communications systems and defense electronics.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Salcomp'),
   'internship', 5, 48000, 'Salcomp offers internships to UTA EE students in power electronics design and testing.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Electrical Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Oncor Electric'),
   'hiring_pipeline', 6, 54000, 'Oncor recruits UTA EE graduates for grid operations and power systems engineering.', true),

  -- Civil Engineering
  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'internship', 4, 44000, 'City of Arlington offers CE internships in public works, transportation, and stormwater.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Civil Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'hiring_pipeline', 5, 50000, 'D.R. Horton hires UTA CE graduates for land development and construction management.', true),

  -- Industrial Engineering
  ((SELECT id FROM uta_programs WHERE program_name = 'Industrial Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'hiring_pipeline', 8, 52000, 'Amazon hires UTA IE graduates as Area Managers and operations engineers.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Industrial Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'co-op', 5, 50000, 'GM offers co-ops to UTA IE students in manufacturing process improvement and supply chain.', true),

  -- Software Engineering
  ((SELECT id FROM uta_programs WHERE program_name = 'Software Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'American Airlines'),
   'hiring_pipeline', 8, 58000, 'American Airlines hires UTA SE graduates for digital technology and mobile app development.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Software Engineering' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Accenture'),
   'hiring_pipeline', 6, 55000, 'Accenture recruits UTA SE graduates for technology consulting and cloud engineering.', true),

  -- NURSING PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'hiring_pipeline', 45, 58000, 'Texas Health Resources is the #1 employer of UTA BSN graduates with clinical rotation partnerships.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Medical City Arlington'),
   'hiring_pipeline', 20, 56000, 'Medical City Arlington partners with UTA CONHI for clinical rotations and hires BSN graduates.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'JPS Health Network'),
   'hiring_pipeline', 15, 55000, 'JPS Health Network provides clinical rotation sites and hires UTA nursing graduates.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Cook Childrens Health Care System'),
   'internship', 10, 48000, 'Cook Childrens offers externship and residency programs for UTA nursing students.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Baylor Scott & White Health'),
   'hiring_pipeline', 18, 57000, 'Baylor Scott & White is a major employer of UTA BSN graduates across DFW.', true),

  -- BUSINESS PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'hiring_pipeline', 12, 52000, 'Deloitte actively recruits from UTA COB accounting program for audit and tax positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Ernst & Young'),
   'internship', 8, 50000, 'EY offers summer internships to UTA accounting students with high conversion rates.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Finance' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'JPMorgan Chase'),
   'internship', 6, 55000, 'JPMorgan Chase recruits UTA finance students for summer analyst programs.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Finance' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Charles Schwab'),
   'hiring_pipeline', 8, 48000, 'Charles Schwab hires UTA finance graduates for financial consultant roles.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Finance' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'hiring_pipeline', 10, 52000, 'GM Financial is a top employer of UTA finance graduates for credit analysis and risk management.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Information Systems' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Accenture'),
   'hiring_pipeline', 8, 54000, 'Accenture recruits UTA IS graduates for technology consulting and ERP implementation.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Marketing' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'American Airlines'),
   'internship', 4, 42000, 'American Airlines offers marketing internships to UTA students.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Business Administration' AND degree_type = 'MBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'hiring_pipeline', 8, 78000, 'Deloitte recruits UTA MBA graduates for strategy consulting and advisory roles.', true),

  -- LIBERAL ARTS / EDUCATION PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Criminology and Criminal Justice' AND degree_type = 'BA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'hiring_pipeline', 10, 48000, 'Arlington PD recruits UTA criminology graduates for police officer and crime analyst positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Criminology and Criminal Justice' AND degree_type = 'BA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Tarrant County Government'),
   'internship', 5, 38000, 'Tarrant County DA and probation offices offer internships to UTA CJ students.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Arlington ISD'),
   'hiring_pipeline', 30, 50000, 'Arlington ISD is the primary employer of UTA education graduates for teaching positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Interdisciplinary Studies (EC-6)' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Mansfield ISD'),
   'hiring_pipeline', 15, 50000, 'Mansfield ISD recruits UTA education graduates for teaching positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Communication' AND degree_type = 'BA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'American Airlines'),
   'internship', 3, 40000, 'American Airlines offers communications internships to UTA students.', true),

  -- SCIENCE PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Biology' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'hiring_pipeline', 8, 42000, 'Texas Health Resources hires UTA biology graduates for lab and clinical support roles.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'hiring_pipeline', 5, 60000, 'Amazon hires UTA data science graduates for data analyst and ML roles.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Psychology' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'JPS Health Network'),
   'hiring_pipeline', 6, 38000, 'JPS hires UTA psychology graduates for behavioral health technician and case management roles.', true),

  -- CAPPA / SOCIAL WORK PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'City and Regional Planning' AND degree_type = 'MCRP'),
   (SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'internship', 3, 42000, 'City of Arlington planning department offers graduate internships to UTA MCRP students.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Architecture' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'advisory_board', 2, NULL, 'D.R. Horton participates on UTA CAPPA advisory board for residential architecture curriculum.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_employers WHERE company_name = 'JPS Health Network'),
   'hiring_pipeline', 8, 48000, 'JPS Health Network hires UTA MSW graduates for clinical social work positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Social Work' AND degree_type = 'MSW'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Cook Childrens Health Care System'),
   'hiring_pipeline', 4, 46000, 'Cook Childrens hires UTA MSW graduates for pediatric social work positions.', true),

  -- GRADUATE ENGINEERING PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'MS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'hiring_pipeline', 15, 95000, 'Amazon hires UTA MS CS graduates for senior SDE and ML engineer positions.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'MS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'hiring_pipeline', 10, 88000, 'Lockheed Martin hires UTA MS CS graduates for AI/ML and advanced software roles.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Data Science' AND degree_type = 'MS' AND college_id = (SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering')),
   (SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'hiring_pipeline', 8, 85000, 'Deloitte hires UTA MS Data Science graduates for analytics consulting roles.', true),

  -- ADVISORY BOARD PARTNERSHIPS
  ((SELECT id FROM uta_programs WHERE program_name = 'Computer Science' AND degree_type = 'BS'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'advisory_board', NULL, NULL, 'Bell Textron serves on UTA CSE Industry Advisory Board for curriculum alignment.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Nursing' AND degree_type = 'BSN'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'advisory_board', NULL, NULL, 'Texas Health Resources serves on CONHI advisory committee for clinical curriculum.', true),

  ((SELECT id FROM uta_programs WHERE program_name = 'Accounting' AND degree_type = 'BBA'),
   (SELECT id FROM arlington_employers WHERE company_name = 'Ernst & Young'),
   'advisory_board', NULL, NULL, 'EY serves on UTA COB Accounting Advisory Board.', true)
ON CONFLICT (program_id, employer_id, partnership_type) DO NOTHING;

-- ============================================================================
-- DONE - ~50 partnerships inserted
-- Next: Run 10-skills.sql
-- ============================================================================
