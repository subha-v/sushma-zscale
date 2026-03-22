-- ============================================================================
-- ARLINGTON JOB OPENINGS - 80 representative job openings
-- Run after 05-employers.sql
-- ============================================================================

-- ENGINEERING JOBS
INSERT INTO arlington_job_openings (employer_id, job_title, department, salary_min, salary_max, salary_type, education_required, experience_years_min, required_skills, preferred_skills, is_entry_level, job_type, remote_option, openings_count)
VALUES
  -- GM Arlington Assembly
  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Manufacturing Engineer', 'Production Engineering', 65000, 85000, 'annual', 'bachelor', 0,
   ARRAY['AutoCAD', 'Lean Manufacturing', 'Six Sigma', 'GD&T'],
   ARRAY['PLC Programming', 'Robotics', 'SAP'],
   true, 'full-time', 'on-site', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Quality Engineer', 'Quality Assurance', 68000, 88000, 'annual', 'bachelor', 1,
   ARRAY['Statistical Process Control', 'Root Cause Analysis', 'FMEA', 'Quality Management'],
   ARRAY['Six Sigma Green Belt', 'Minitab', 'ISO 9001'],
   true, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Production Supervisor', 'Assembly', 62000, 78000, 'annual', 'bachelor', 2,
   ARRAY['Team Leadership', 'Safety Management', 'Production Planning', 'Lean Principles'],
   ARRAY['Automotive Manufacturing', 'SAP', 'Bilingual Spanish'],
   false, 'full-time', 'on-site', 4),

  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Assembly Line Technician', 'Production', 22, 28, 'hourly', 'high_school', 0,
   ARRAY['Mechanical Aptitude', 'Quality Inspection', 'Team Work'],
   ARRAY['Automotive Experience', 'Forklift Certification'],
   true, 'full-time', 'on-site', 25),

  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Supply Chain Analyst', 'Logistics', 60000, 80000, 'annual', 'bachelor', 0,
   ARRAY['Supply Chain Management', 'Excel', 'Data Analysis', 'ERP Systems'],
   ARRAY['SAP', 'Tableau', 'SQL'],
   true, 'full-time', 'hybrid', 2),

  -- Bell Textron
  ((SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'Aerospace Engineer', 'Engineering', 72000, 95000, 'annual', 'bachelor', 0,
   ARRAY['Aerodynamics', 'MATLAB', 'CAD/CAM', 'FEA', 'Structural Analysis'],
   ARRAY['Rotorcraft', 'CATIA', 'Python'],
   true, 'full-time', 'on-site', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'Flight Test Engineer', 'Flight Test', 78000, 100000, 'annual', 'bachelor', 2,
   ARRAY['Flight Test Operations', 'Data Acquisition', 'MATLAB', 'Instrumentation'],
   ARRAY['FAA Regulations', 'Helicopter Systems'],
   false, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'Software Engineer - Avionics', 'Avionics', 80000, 110000, 'annual', 'bachelor', 1,
   ARRAY['C/C++', 'Embedded Systems', 'RTOS', 'DO-178C'],
   ARRAY['Ada', 'Model-Based Design', 'ARINC 429'],
   false, 'full-time', 'on-site', 4),

  -- Lockheed Martin
  ((SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'Systems Engineer', 'Systems Engineering', 75000, 100000, 'annual', 'bachelor', 0,
   ARRAY['Systems Engineering', 'MATLAB', 'Requirements Management', 'Model-Based Systems Engineering'],
   ARRAY['DOORS', 'Cameo', 'DoD Programs'],
   true, 'full-time', 'on-site', 12),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'Cybersecurity Analyst', 'Information Security', 72000, 95000, 'annual', 'bachelor', 0,
   ARRAY['Network Security', 'SIEM', 'Vulnerability Assessment', 'Security+'],
   ARRAY['CISSP', 'Splunk', 'Python', 'DoD 8570'],
   true, 'full-time', 'on-site', 6),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'Data Scientist', 'Analytics', 85000, 115000, 'annual', 'master', 0,
   ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics', 'Deep Learning'],
   ARRAY['TensorFlow', 'PyTorch', 'NLP', 'Computer Vision'],
   true, 'full-time', 'hybrid', 4),

  -- Texas Health Resources
  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'Registered Nurse - Med/Surg', 'Nursing', 62000, 82000, 'annual', 'bachelor', 0,
   ARRAY['Patient Assessment', 'EMR', 'Medication Administration', 'BSN', 'NCLEX-RN'],
   ARRAY['Med/Surg Certification', 'Epic EHR'],
   true, 'full-time', 'on-site', 30),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'ICU Nurse', 'Critical Care', 70000, 95000, 'annual', 'bachelor', 1,
   ARRAY['Critical Care', 'Ventilator Management', 'ACLS', 'BSN'],
   ARRAY['CCRN Certification', 'Charge Nurse Experience'],
   false, 'full-time', 'on-site', 15),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'Health Information Analyst', 'HIT', 55000, 72000, 'annual', 'bachelor', 0,
   ARRAY['Health Informatics', 'SQL', 'Data Analysis', 'HIPAA'],
   ARRAY['Epic', 'Tableau', 'Python'],
   true, 'full-time', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'Physical Therapist', 'Rehabilitation', 78000, 98000, 'annual', 'doctoral', 0,
   ARRAY['DPT', 'Patient Assessment', 'Treatment Planning', 'Documentation'],
   ARRAY['Orthopedic Specialization', 'Sports Medicine'],
   true, 'full-time', 'on-site', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'Clinical Lab Technologist', 'Laboratory', 52000, 68000, 'annual', 'bachelor', 0,
   ARRAY['Laboratory Techniques', 'Quality Control', 'Hematology', 'Chemistry Analyzers'],
   ARRAY['ASCP Certification', 'Blood Banking'],
   true, 'full-time', 'on-site', 4),

  -- D.R. Horton
  ((SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'Financial Analyst', 'Finance', 58000, 75000, 'annual', 'bachelor', 0,
   ARRAY['Financial Modeling', 'Excel', 'Accounting', 'Data Analysis'],
   ARRAY['Real Estate Finance', 'SAP', 'Power BI'],
   true, 'full-time', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'Construction Project Manager', 'Construction', 72000, 95000, 'annual', 'bachelor', 2,
   ARRAY['Project Management', 'Construction Management', 'Blueprint Reading', 'Budgeting'],
   ARRAY['PMP', 'Procore', 'Residential Construction'],
   false, 'full-time', 'on-site', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'Marketing Coordinator', 'Marketing', 45000, 58000, 'annual', 'bachelor', 0,
   ARRAY['Digital Marketing', 'Social Media', 'Content Creation', 'Adobe Creative Suite'],
   ARRAY['Real Estate Marketing', 'SEO', 'Google Analytics'],
   true, 'full-time', 'hybrid', 2),

  ((SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'IT Business Analyst', 'Information Technology', 65000, 85000, 'annual', 'bachelor', 1,
   ARRAY['Business Analysis', 'SQL', 'Requirements Gathering', 'Agile'],
   ARRAY['Salesforce', 'Power BI', 'JIRA'],
   false, 'full-time', 'hybrid', 2),

  -- Arlington ISD
  ((SELECT id FROM arlington_employers WHERE company_name = 'Arlington ISD'),
   'High School Math Teacher', 'Academics', 58000, 72000, 'annual', 'bachelor', 0,
   ARRAY['Mathematics', 'Curriculum Design', 'Classroom Management', 'Texas Teaching Certification'],
   ARRAY['AP Calculus', 'Bilingual', 'STEM Integration'],
   true, 'full-time', 'on-site', 12),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Arlington ISD'),
   'School Counselor', 'Student Services', 56000, 72000, 'annual', 'master', 0,
   ARRAY['Counseling', 'Student Assessment', 'College Readiness', 'Texas School Counselor Certification'],
   ARRAY['Bilingual', 'ASCA Model', 'Crisis Intervention'],
   true, 'full-time', 'on-site', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Arlington ISD'),
   'Special Education Teacher', 'Special Education', 58000, 74000, 'annual', 'bachelor', 0,
   ARRAY['Special Education', 'IEP Development', 'Differentiated Instruction', 'Texas SpEd Certification'],
   ARRAY['ABA', 'Assistive Technology', 'Bilingual'],
   true, 'full-time', 'on-site', 8),

  -- UTA
  ((SELECT id FROM arlington_employers WHERE company_name = 'University of Texas at Arlington'),
   'Research Associate', 'Research', 45000, 58000, 'annual', 'master', 0,
   ARRAY['Research Methods', 'Data Analysis', 'Technical Writing', 'Lab Management'],
   ARRAY['Python', 'R', 'Grant Writing'],
   true, 'full-time', 'on-site', 6),

  ((SELECT id FROM arlington_employers WHERE company_name = 'University of Texas at Arlington'),
   'IT Systems Administrator', 'OIT', 58000, 78000, 'annual', 'bachelor', 1,
   ARRAY['Linux', 'Windows Server', 'Networking', 'Cloud Infrastructure'],
   ARRAY['AWS', 'Azure', 'Kubernetes', 'Ansible'],
   false, 'full-time', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'University of Texas at Arlington'),
   'Academic Advisor', 'Student Success', 42000, 52000, 'annual', 'bachelor', 0,
   ARRAY['Student Advising', 'Communication', 'Degree Planning', 'Student Success'],
   ARRAY['Banner', 'DegreeWorks', 'Bilingual'],
   true, 'full-time', 'on-site', 4),

  -- Six Flags
  ((SELECT id FROM arlington_employers WHERE company_name = 'Six Flags Over Texas'),
   'Ride Operations Supervisor', 'Operations', 18, 22, 'hourly', 'high_school', 1,
   ARRAY['Safety Management', 'Team Leadership', 'Customer Service'],
   ARRAY['Amusement Park Experience', 'CPR/First Aid'],
   false, 'full-time', 'on-site', 6),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Six Flags Over Texas'),
   'Marketing Intern', 'Marketing', 17, 20, 'hourly', 'none', 0,
   ARRAY['Social Media', 'Content Creation', 'Communication'],
   ARRAY['Adobe Creative Suite', 'Video Editing'],
   true, 'internship', 'hybrid', 4),

  -- City of Arlington
  ((SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'Civil Engineer', 'Public Works', 68000, 88000, 'annual', 'bachelor', 0,
   ARRAY['Civil Engineering', 'AutoCAD', 'Stormwater Management', 'PE License Eligible'],
   ARRAY['GIS', 'Project Management', 'Municipal Engineering'],
   true, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'Urban Planner', 'Planning and Development', 55000, 72000, 'annual', 'master', 0,
   ARRAY['Urban Planning', 'GIS', 'Zoning', 'Community Engagement'],
   ARRAY['AICP Certification', 'ArcGIS Pro', 'Comprehensive Planning'],
   true, 'full-time', 'on-site', 2),

  ((SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'Police Officer', 'Police Department', 62000, 85000, 'annual', 'associate', 0,
   ARRAY['Law Enforcement', 'TCOLE Certification', 'Physical Fitness', 'Communication'],
   ARRAY['Bilingual', 'Criminal Justice Degree', 'Military Experience'],
   true, 'full-time', 'on-site', 15),

  ((SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'Data Analyst', 'Information Technology', 55000, 72000, 'annual', 'bachelor', 0,
   ARRAY['SQL', 'Python', 'Data Visualization', 'Statistics'],
   ARRAY['Power BI', 'Tableau', 'GIS'],
   true, 'full-time', 'hybrid', 2),

  -- GM Financial
  ((SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'Software Developer', 'Technology', 72000, 95000, 'annual', 'bachelor', 0,
   ARRAY['Java', 'Spring Boot', 'SQL', 'Git', 'REST APIs'],
   ARRAY['AWS', 'Microservices', 'React', 'Docker'],
   true, 'full-time', 'hybrid', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'Credit Risk Analyst', 'Risk Management', 62000, 82000, 'annual', 'bachelor', 0,
   ARRAY['Credit Analysis', 'Financial Modeling', 'Excel', 'Statistics'],
   ARRAY['SAS', 'Python', 'Risk Management Certification'],
   true, 'full-time', 'hybrid', 4),

  ((SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'Data Engineer', 'Data & Analytics', 85000, 115000, 'annual', 'bachelor', 2,
   ARRAY['Python', 'SQL', 'ETL', 'Cloud Platforms', 'Spark'],
   ARRAY['AWS Glue', 'Snowflake', 'Kafka', 'Airflow'],
   false, 'full-time', 'hybrid', 3),

  -- E-Space
  ((SELECT id FROM arlington_employers WHERE company_name = 'E-Space'),
   'Satellite Systems Engineer', 'Engineering', 85000, 120000, 'annual', 'master', 0,
   ARRAY['Systems Engineering', 'Orbital Mechanics', 'RF Systems', 'MATLAB'],
   ARRAY['Satellite Constellation', 'Link Budget Analysis'],
   true, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'E-Space'),
   'Software Engineer - Ground Systems', 'Software', 80000, 110000, 'annual', 'bachelor', 1,
   ARRAY['Python', 'C++', 'Distributed Systems', 'Linux'],
   ARRAY['Space Ground Systems', 'Cloud Architecture', 'Kubernetes'],
   false, 'full-time', 'hybrid', 2),

  -- Amazon DFW
  ((SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'Area Manager', 'Operations', 60000, 78000, 'annual', 'bachelor', 0,
   ARRAY['Operations Management', 'Team Leadership', 'Data Analysis', 'Safety'],
   ARRAY['Lean/Six Sigma', 'Logistics', 'WMS'],
   true, 'full-time', 'on-site', 10),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Amazon - DFW Fulfillment'),
   'Software Development Engineer', 'AWS / Technology', 110000, 150000, 'annual', 'bachelor', 1,
   ARRAY['Java', 'Python', 'Distributed Systems', 'Data Structures', 'Algorithms'],
   ARRAY['AWS Services', 'System Design', 'Machine Learning'],
   false, 'full-time', 'hybrid', 5),

  -- Deloitte
  ((SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'Audit Associate', 'Audit & Assurance', 62000, 72000, 'annual', 'bachelor', 0,
   ARRAY['Accounting', 'Auditing', 'Excel', 'CPA Eligible'],
   ARRAY['CPA', 'Big 4 Internship', 'Data Analytics'],
   true, 'full-time', 'hybrid', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'Technology Consultant', 'Consulting', 78000, 100000, 'annual', 'bachelor', 0,
   ARRAY['Business Analysis', 'Project Management', 'Client Communication', 'Problem Solving'],
   ARRAY['SAP', 'Salesforce', 'Cloud', 'Agile'],
   true, 'full-time', 'hybrid', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Deloitte'),
   'Data Analytics Consultant', 'Advisory', 72000, 92000, 'annual', 'bachelor', 0,
   ARRAY['SQL', 'Python', 'Tableau', 'Statistics', 'Communication'],
   ARRAY['R', 'Machine Learning', 'Cloud Analytics'],
   true, 'full-time', 'hybrid', 4),

  -- American Airlines
  ((SELECT id FROM arlington_employers WHERE company_name = 'American Airlines'),
   'Business Analyst - Revenue Management', 'Revenue Management', 65000, 85000, 'annual', 'bachelor', 0,
   ARRAY['Data Analysis', 'SQL', 'Excel', 'Business Intelligence'],
   ARRAY['Revenue Management', 'Python', 'Tableau'],
   true, 'full-time', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'American Airlines'),
   'Software Engineer', 'Digital Technology', 82000, 110000, 'annual', 'bachelor', 1,
   ARRAY['Java', 'React', 'SQL', 'REST APIs', 'Agile'],
   ARRAY['AWS', 'Microservices', 'Kotlin'],
   false, 'full-time', 'hybrid', 6),

  -- JPMorgan Chase
  ((SELECT id FROM arlington_employers WHERE company_name = 'JPMorgan Chase'),
   'Investment Banking Analyst', 'Investment Banking', 95000, 115000, 'annual', 'bachelor', 0,
   ARRAY['Financial Modeling', 'Valuation', 'Excel', 'PowerPoint', 'Accounting'],
   ARRAY['Bloomberg Terminal', 'M&A', 'Capital Markets'],
   true, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'JPMorgan Chase'),
   'Software Engineer', 'Technology', 85000, 120000, 'annual', 'bachelor', 0,
   ARRAY['Java', 'Python', 'SQL', 'Data Structures', 'Cloud'],
   ARRAY['AWS', 'React', 'GraphQL', 'Kubernetes'],
   true, 'full-time', 'hybrid', 5),

  -- BNSF Railway
  ((SELECT id FROM arlington_employers WHERE company_name = 'BNSF Railway'),
   'Management Trainee', 'Operations', 62000, 75000, 'annual', 'bachelor', 0,
   ARRAY['Leadership', 'Problem Solving', 'Communication', 'Willingness to Relocate'],
   ARRAY['Logistics', 'Transportation', 'Engineering Background'],
   true, 'full-time', 'on-site', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'BNSF Railway'),
   'Data Scientist', 'Technology Services', 80000, 110000, 'annual', 'master', 0,
   ARRAY['Python', 'Machine Learning', 'SQL', 'Statistics'],
   ARRAY['TensorFlow', 'Spark', 'Time Series Analysis'],
   true, 'full-time', 'hybrid', 2),

  -- Medical City Arlington
  ((SELECT id FROM arlington_employers WHERE company_name = 'Medical City Arlington'),
   'Emergency Room Nurse', 'Emergency Department', 68000, 88000, 'annual', 'bachelor', 1,
   ARRAY['Emergency Nursing', 'ACLS', 'TNCC', 'BSN'],
   ARRAY['CEN Certification', 'Trauma Experience'],
   false, 'full-time', 'on-site', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Medical City Arlington'),
   'Medical Lab Technician', 'Pathology', 48000, 62000, 'annual', 'associate', 0,
   ARRAY['Lab Procedures', 'Phlebotomy', 'Quality Control', 'MLT Certification'],
   ARRAY['ASCP', 'Blood Banking', 'Microbiology'],
   true, 'full-time', 'on-site', 3),

  -- Salcomp (new manufacturer)
  ((SELECT id FROM arlington_employers WHERE company_name = 'Salcomp'),
   'Production Engineer', 'Manufacturing', 65000, 82000, 'annual', 'bachelor', 0,
   ARRAY['Manufacturing Processes', 'Lean Manufacturing', 'Quality Systems', 'AutoCAD'],
   ARRAY['Electronics Manufacturing', 'SMT', 'ISO 9001'],
   true, 'full-time', 'on-site', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Salcomp'),
   'Electrical Engineer', 'R&D', 70000, 92000, 'annual', 'bachelor', 0,
   ARRAY['Circuit Design', 'PCB Layout', 'Power Electronics', 'Testing'],
   ARRAY['Switch Mode Power Supplies', 'EMI/EMC', 'Altium'],
   true, 'full-time', 'on-site', 3),

  -- Charles Schwab
  ((SELECT id FROM arlington_employers WHERE company_name = 'Charles Schwab'),
   'Financial Consultant', 'Wealth Management', 55000, 72000, 'annual', 'bachelor', 0,
   ARRAY['Financial Planning', 'Client Relations', 'Investment Products', 'Series 7 Eligible'],
   ARRAY['CFP', 'Series 66', 'Wealth Management'],
   true, 'full-time', 'hybrid', 6),

  -- Accenture
  ((SELECT id FROM arlington_employers WHERE company_name = 'Accenture'),
   'Cloud Engineer', 'Technology', 78000, 105000, 'annual', 'bachelor', 0,
   ARRAY['AWS', 'Azure', 'Terraform', 'Linux', 'Python'],
   ARRAY['Kubernetes', 'CI/CD', 'Ansible'],
   true, 'full-time', 'hybrid', 4),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Accenture'),
   'Management Consulting Analyst', 'Strategy & Consulting', 72000, 88000, 'annual', 'bachelor', 0,
   ARRAY['Problem Solving', 'Data Analysis', 'PowerPoint', 'Communication'],
   ARRAY['MBA', 'Industry Expertise', 'Change Management'],
   true, 'full-time', 'hybrid', 3),

  -- Internship / Co-op positions
  ((SELECT id FROM arlington_employers WHERE company_name = 'General Motors Arlington Assembly'),
   'Engineering Co-op', 'Various Engineering', 24, 30, 'hourly', 'none', 0,
   ARRAY['Engineering Coursework', 'AutoCAD', 'Problem Solving'],
   ARRAY['Manufacturing Experience', 'GPA 3.0+'],
   true, 'co-op', 'on-site', 6),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Bell Textron'),
   'Engineering Intern', 'Engineering', 25, 32, 'hourly', 'none', 0,
   ARRAY['Engineering Major', 'MATLAB', 'CAD'],
   ARRAY['Aerospace Interest', 'GPA 3.0+'],
   true, 'internship', 'on-site', 10),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Lockheed Martin Aeronautics'),
   'Software Engineering Intern', 'Software', 28, 35, 'hourly', 'none', 0,
   ARRAY['Computer Science Major', 'Java or C++', 'Data Structures'],
   ARRAY['Secret Clearance Eligible', 'Agile', 'US Citizen Required'],
   true, 'internship', 'on-site', 8),

  ((SELECT id FROM arlington_employers WHERE company_name = 'D.R. Horton'),
   'Finance Intern', 'Finance', 20, 24, 'hourly', 'none', 0,
   ARRAY['Finance or Accounting Major', 'Excel', 'Analytical Skills'],
   ARRAY['Real Estate Interest', 'GPA 3.0+'],
   true, 'internship', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Texas Health Resources'),
   'Nursing Extern', 'Nursing', 18, 22, 'hourly', 'none', 0,
   ARRAY['Nursing Student', 'BLS Certification', 'Clinical Rotation Completed'],
   ARRAY['Med/Surg Interest', 'Junior/Senior Standing'],
   true, 'internship', 'on-site', 15),

  ((SELECT id FROM arlington_employers WHERE company_name = 'City of Arlington'),
   'Public Administration Intern', 'City Manager Office', 17, 20, 'hourly', 'none', 0,
   ARRAY['Public Admin or Political Science Major', 'Communication', 'Research'],
   ARRAY['GIS', 'Data Analysis'],
   true, 'internship', 'hybrid', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'GM Financial'),
   'IT Summer Intern', 'Technology', 25, 30, 'hourly', 'none', 0,
   ARRAY['CS or IS Major', 'Programming Fundamentals', 'Problem Solving'],
   ARRAY['Java', 'Python', 'Cloud'],
   true, 'internship', 'hybrid', 10),

  -- Additional full-time positions
  ((SELECT id FROM arlington_employers WHERE company_name = 'Oncor Electric'),
   'Electrical Engineer', 'Grid Operations', 72000, 92000, 'annual', 'bachelor', 0,
   ARRAY['Power Systems', 'Electrical Engineering', 'SCADA', 'Protection Systems'],
   ARRAY['PE License', 'Smart Grid', 'GIS'],
   true, 'full-time', 'on-site', 4),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Vistra Energy'),
   'Environmental Engineer', 'Environmental Compliance', 68000, 88000, 'annual', 'bachelor', 0,
   ARRAY['Environmental Science', 'EPA Regulations', 'Air Quality', 'Water Treatment'],
   ARRAY['PE License', 'HAZWOPER', 'Environmental Modeling'],
   true, 'full-time', 'hybrid', 2),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Keurig Dr Pepper'),
   'Supply Chain Manager', 'Supply Chain', 75000, 95000, 'annual', 'bachelor', 3,
   ARRAY['Supply Chain Management', 'Logistics', 'SAP', 'Demand Planning'],
   ARRAY['APICS', 'Lean Manufacturing', 'S&OP'],
   false, 'full-time', 'hybrid', 2),

  ((SELECT id FROM arlington_employers WHERE company_name = 'L3Harris Technologies'),
   'RF Engineer', 'Communications Systems', 78000, 105000, 'annual', 'bachelor', 0,
   ARRAY['RF Design', 'Electromagnetic Theory', 'Signal Processing', 'Test Equipment'],
   ARRAY['MATLAB', 'ADS', 'Security Clearance'],
   true, 'full-time', 'on-site', 3),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Ernst & Young'),
   'Tax Associate', 'Tax Services', 60000, 70000, 'annual', 'bachelor', 0,
   ARRAY['Tax Accounting', 'Excel', 'Research Skills', 'CPA Eligible'],
   ARRAY['CPA', 'Tax Software', 'International Tax'],
   true, 'full-time', 'hybrid', 5),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Cook Childrens Health Care System'),
   'Pediatric Nurse', 'Nursing', 64000, 84000, 'annual', 'bachelor', 0,
   ARRAY['Pediatric Nursing', 'BSN', 'PALS', 'Family-Centered Care'],
   ARRAY['CPN Certification', 'NICU Experience'],
   true, 'full-time', 'on-site', 10),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Tarrant County College'),
   'Adjunct Professor - Computer Science', 'Academic', 2800, 3200, 'hourly', 'master', 2,
   ARRAY['Computer Science', 'Teaching', 'Programming Languages', 'Curriculum Development'],
   ARRAY['PhD', 'Industry Experience', 'Online Teaching'],
   false, 'part-time', 'hybrid', 4),

  ((SELECT id FROM arlington_employers WHERE company_name = 'Tarrant County Government'),
   'Public Health Specialist', 'Public Health', 52000, 68000, 'annual', 'bachelor', 0,
   ARRAY['Public Health', 'Epidemiology', 'Community Health', 'Data Analysis'],
   ARRAY['MPH', 'Bilingual', 'GIS'],
   true, 'full-time', 'on-site', 3)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- DONE - ~80 job openings inserted
-- Next: Run 07-development.sql
-- ============================================================================
