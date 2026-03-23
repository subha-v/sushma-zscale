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
