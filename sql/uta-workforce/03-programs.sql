-- ============================================================================
-- UTA PROGRAMS - ~180 academic programs across all colleges
-- Run after 02-colleges.sql
-- ============================================================================

-- ============================================================================
-- COLLEGE OF ENGINEERING (~30 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Aerospace Engineering', 'bachelor', 'BS', '14.0201', true, false, 127),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Biomedical Engineering', 'bachelor', 'BS', '14.0501', true, false, 128),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Civil Engineering', 'bachelor', 'BS', '14.0801', true, false, 127),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Computer Engineering', 'bachelor', 'BS', '14.0901', true, false, 126),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Computer Science', 'bachelor', 'BS', '11.0701', true, false, 124),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Electrical Engineering', 'bachelor', 'BS', '14.1001', true, false, 127),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Industrial Engineering', 'bachelor', 'BS', '14.3501', true, false, 126),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Mechanical Engineering', 'bachelor', 'BS', '14.1901', true, false, 128),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Software Engineering', 'bachelor', 'BS', '14.0903', true, false, 124),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Aerospace Engineering', 'master', 'MS', '14.0201', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Biomedical Engineering', 'master', 'MS', '14.0501', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Civil Engineering', 'master', 'MS', '14.0801', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Computer Engineering', 'master', 'MS', '14.0901', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Computer Science', 'master', 'MS', '11.0701', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Electrical Engineering', 'master', 'MS', '14.1001', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Industrial Engineering', 'master', 'MS', '14.3501', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Mechanical Engineering', 'master', 'MS', '14.1901', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Software Engineering', 'master', 'MS', '14.0903', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Data Science', 'master', 'MS', '30.7001', true, true, 33),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Aerospace Engineering', 'doctoral', 'PhD', '14.0201', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Biomedical Engineering', 'doctoral', 'PhD', '14.0501', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Civil Engineering', 'doctoral', 'PhD', '14.0801', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Computer Science', 'doctoral', 'PhD', '11.0701', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Electrical Engineering', 'doctoral', 'PhD', '14.1001', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Industrial Engineering', 'doctoral', 'PhD', '14.3501', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Mechanical Engineering', 'doctoral', 'PhD', '14.1901', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Materials Science and Engineering', 'master', 'MS', '14.1801', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Engineering'), 'Materials Science and Engineering', 'doctoral', 'PhD', '14.1801', true, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- COLLEGE OF BUSINESS (~22 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Accounting', 'bachelor', 'BBA', '52.0301', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Economics', 'bachelor', 'BS', '45.0601', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Finance', 'bachelor', 'BBA', '52.0801', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Information Systems', 'bachelor', 'BBA', '52.1201', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Management', 'bachelor', 'BBA', '52.0201', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Marketing', 'bachelor', 'BBA', '52.1401', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Real Estate', 'bachelor', 'BBA', '52.1501', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Operations Management', 'bachelor', 'BBA', '52.0205', false, false, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Business Administration', 'master', 'MBA', '52.0201', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Accounting', 'master', 'MS', '52.0301', false, true, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Finance', 'master', 'MS', '52.0801', false, false, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Information Systems', 'master', 'MS', '52.1201', true, true, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Marketing Research', 'master', 'MS', '52.1402', false, false, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Real Estate', 'master', 'MS', '52.1501', false, false, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Quantitative Finance', 'master', 'MS', '52.0803', true, false, 30),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Health Care Administration', 'master', 'MS', '51.0701', false, true, 36),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Business Administration', 'doctoral', 'PhD', '52.0201', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Accounting', 'doctoral', 'PhD', '52.0301', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Finance', 'doctoral', 'PhD', '52.0801', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Information Systems', 'doctoral', 'PhD', '52.1201', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Management', 'doctoral', 'PhD', '52.0201', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Business'), 'Marketing', 'doctoral', 'PhD', '52.1401', false, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- COLLEGE OF LIBERAL ARTS (~45 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Art', 'bachelor', 'BA', '50.0701', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Art History', 'bachelor', 'BA', '50.0703', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Communication', 'bachelor', 'BA', '09.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Communication Technology', 'bachelor', 'BS', '09.0702', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Criminology and Criminal Justice', 'bachelor', 'BA', '45.0401', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'English', 'bachelor', 'BA', '23.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'History', 'bachelor', 'BA', '54.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Linguistics', 'bachelor', 'BA', '16.0102', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Modern Languages', 'bachelor', 'BA', '16.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Music', 'bachelor', 'BA', '50.0901', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Music', 'bachelor', 'BM', '50.0903', false, false, 128),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Philosophy', 'bachelor', 'BA', '38.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Political Science', 'bachelor', 'BA', '45.1001', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Sociology', 'bachelor', 'BA', '45.1101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Theatre Arts', 'bachelor', 'BA', '50.0501', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'University Studies', 'bachelor', 'BA', '24.0102', false, true, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Anthropology', 'bachelor', 'BA', '45.0201', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'African American Studies', 'bachelor', 'BA', '05.0201', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Mexican American Studies', 'bachelor', 'BA', '05.0203', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Women and Gender Studies', 'bachelor', 'BA', '05.0207', false, false, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Communication', 'master', 'MA', '09.0101', false, false, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Criminology and Criminal Justice', 'master', 'MA', '45.0401', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'English', 'master', 'MA', '23.0101', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'History', 'master', 'MA', '54.0101', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Linguistics', 'master', 'MA', '16.0102', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Political Science', 'master', 'MA', '45.1001', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Sociology', 'master', 'MA', '45.1101', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Art', 'master', 'MFA', '50.0702', false, false, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Music', 'master', 'MM', '50.0901', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Transatlantic History', 'master', 'MA', '54.0108', false, false, 33),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'English', 'doctoral', 'PhD', '23.0101', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'History', 'doctoral', 'PhD', '54.0101', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Linguistics', 'doctoral', 'PhD', '16.0102', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Political Science', 'doctoral', 'PhD', '45.1001', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Liberal Arts'), 'Criminology and Criminal Justice', 'doctoral', 'PhD', '45.0401', false, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- COLLEGE OF NURSING AND HEALTH INNOVATION (~14 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing', 'bachelor', 'BSN', '51.3801', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing (RN-BSN)', 'bachelor', 'BSN', '51.3801', false, true, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Exercise Science', 'bachelor', 'BS', '31.0505', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Public Health', 'bachelor', 'BS', '51.2201', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Healthcare Administration', 'bachelor', 'BS', '51.0701', false, true, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing', 'master', 'MSN', '51.3801', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing Education', 'master', 'MSN', '51.3817', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Public Health', 'master', 'MPH', '51.2201', false, true, 42),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Athletic Training', 'master', 'MAT', '51.0913', false, false, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Kinesiology', 'master', 'MS', '31.0505', true, false, 33),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing Practice', 'doctoral', 'DNP', '51.3818', false, true, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Nursing', 'doctoral', 'PhD', '51.3808', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Kinesiology', 'doctoral', 'PhD', '31.0505', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Nursing and Health Innovation'), 'Public Health', 'doctoral', 'DrPH', '51.2201', false, true, 60)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- COLLEGE OF SCIENCE (~30 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Biology', 'bachelor', 'BS', '26.0101', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Biochemistry', 'bachelor', 'BS', '26.0202', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Chemistry', 'bachelor', 'BS', '40.0501', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Data Science', 'bachelor', 'BS', '30.7001', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Earth Sciences', 'bachelor', 'BS', '40.0601', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Mathematics', 'bachelor', 'BS', '27.0101', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Physics', 'bachelor', 'BS', '40.0801', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Psychology', 'bachelor', 'BS', '42.0101', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Geology', 'bachelor', 'BS', '40.0601', true, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Environmental Science', 'bachelor', 'BS', '03.0104', true, false, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Biology', 'master', 'MS', '26.0101', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Chemistry', 'master', 'MS', '40.0501', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Data Science', 'master', 'MS', '30.7001', true, true, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Earth Sciences', 'master', 'MS', '40.0601', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Mathematics', 'master', 'MS', '27.0101', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Physics', 'master', 'MS', '40.0801', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Psychology', 'master', 'MS', '42.0101', true, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Applied Statistics', 'master', 'MS', '27.0501', true, true, 33),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Biology', 'doctoral', 'PhD', '26.0101', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Chemistry', 'doctoral', 'PhD', '40.0501', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Earth Sciences', 'doctoral', 'PhD', '40.0601', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Mathematics', 'doctoral', 'PhD', '27.0101', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Physics', 'doctoral', 'PhD', '40.0801', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Psychology', 'doctoral', 'PhD', '42.0101', true, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Science'), 'Quantitative Biology', 'doctoral', 'PhD', '26.0101', true, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- COLLEGE OF EDUCATION (~12 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Interdisciplinary Studies (EC-6)', 'bachelor', 'BS', '13.0101', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Kinesiology', 'bachelor', 'BS', '31.0501', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Exercise Science', 'bachelor', 'BS', '31.0505', true, false, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Curriculum and Instruction', 'master', 'MEd', '13.0301', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Educational Leadership and Policy Studies', 'master', 'MEd', '13.0401', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Special Education', 'master', 'MEd', '13.1001', false, true, 36),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Kinesiology', 'master', 'MS', '31.0501', false, false, 33),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Higher Education', 'master', 'MEd', '13.0406', false, true, 36),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Educational Leadership and Policy Studies', 'doctoral', 'EdD', '13.0401', false, true, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Curriculum and Instruction', 'doctoral', 'PhD', '13.0301', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Educational Leadership and Policy Studies', 'doctoral', 'PhD', '13.0401', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Education'), 'Kinesiology', 'doctoral', 'PhD', '31.0501', false, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- CAPPA (~8 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  -- Bachelor's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Architecture', 'bachelor', 'BS', '04.0201', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Interior Design', 'bachelor', 'BS', '04.0501', false, false, 120),
  -- Master's
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Architecture', 'master', 'MArch', '04.0201', false, false, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Landscape Architecture', 'master', 'MLA', '04.0601', false, false, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'City and Regional Planning', 'master', 'MCRP', '04.0301', false, false, 48),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Public Administration', 'master', 'MPA', '44.0401', false, true, 39),
  -- Doctoral
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Public Affairs', 'doctoral', 'PhD', '44.0501', false, false, 72),
  ((SELECT id FROM uta_colleges WHERE college_name = 'College of Architecture, Planning and Public Affairs'), 'Urban Planning and Public Policy', 'doctoral', 'PhD', '04.0301', false, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- SCHOOL OF SOCIAL WORK (~5 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  ((SELECT id FROM uta_colleges WHERE college_name = 'School of Social Work'), 'Social Work', 'bachelor', 'BSW', '44.0701', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'School of Social Work'), 'Social Work', 'master', 'MSW', '44.0701', false, true, 60),
  ((SELECT id FROM uta_colleges WHERE college_name = 'School of Social Work'), 'Social Work (Advanced Standing)', 'master', 'MSW', '44.0701', false, true, 39),
  ((SELECT id FROM uta_colleges WHERE college_name = 'School of Social Work'), 'Social Work', 'doctoral', 'PhD', '44.0701', false, false, 72)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- HONORS COLLEGE (~2 programs)
-- ============================================================================
INSERT INTO uta_programs (college_id, program_name, degree_level, degree_type, cip_code, is_stem, is_online_available, credit_hours)
VALUES
  ((SELECT id FROM uta_colleges WHERE college_name = 'Honors College'), 'University Honors', 'bachelor', 'BA', '24.0199', false, false, 120),
  ((SELECT id FROM uta_colleges WHERE college_name = 'Honors College'), 'University Honors', 'bachelor', 'BS', '24.0199', true, false, 120)
ON CONFLICT (program_name, degree_level, degree_type) DO NOTHING;

-- ============================================================================
-- DONE - ~180 programs inserted
-- Next: Run 04-outcomes.sql
-- ============================================================================
