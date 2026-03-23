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
