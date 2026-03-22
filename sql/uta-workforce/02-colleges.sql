-- ============================================================================
-- UTA COLLEGES - 10 colleges/schools
-- Run after 01-schema.sql
-- ============================================================================

INSERT INTO uta_colleges (college_name, abbreviation, dean_name, enrollment, website_url, description)
VALUES
  ('College of Engineering', 'COE', 'Dr. Peteranova', 7200, 'https://www.uta.edu/engineering', 'One of the largest engineering programs in Texas, offering degrees in aerospace, biomedical, civil, computer science, electrical, industrial, mechanical, and software engineering.'),
  ('College of Business', 'COB', 'Dr. Harry Dombroski', 6800, 'https://www.uta.edu/business', 'AACSB-accredited business school offering BBA, MBA, MS, and PhD programs in accounting, finance, information systems, management, marketing, and real estate.'),
  ('College of Liberal Arts', 'COLA', 'Dr. Elisabeth Cawthon', 8500, 'https://www.uta.edu/liberal-arts', 'The largest college at UTA with programs spanning humanities, social sciences, communications, and performing arts.'),
  ('College of Nursing and Health Innovation', 'CONHI', 'Dr. Elizabeth Merwin', 4200, 'https://www.uta.edu/nursing', 'Top-ranked nursing college offering BSN, RN-BSN, MSN, DNP, and PhD programs. One of the largest nursing programs in the nation.'),
  ('College of Science', 'COS', 'Dr. Morteza Khaledi', 5800, 'https://www.uta.edu/science', 'Programs in biology, chemistry, data science, earth sciences, mathematics, physics, and psychology with strong research output.'),
  ('College of Education', 'COEd', 'Dr. Teresa Huerta', 3200, 'https://www.uta.edu/education', 'Preparing educators and educational leaders with programs in curriculum, kinesiology, educational leadership, and special education.'),
  ('College of Architecture, Planning and Public Affairs', 'CAPPA', 'Dr. Nan Ellin', 1800, 'https://www.uta.edu/cappa', 'Interdisciplinary college combining architecture, landscape architecture, city planning, and public administration.'),
  ('School of Social Work', 'SSW', 'Dr. Scott Ryan', 1600, 'https://www.uta.edu/social-work', 'CSWE-accredited social work programs at BSW, MSW, and PhD levels with emphasis on community practice and policy.'),
  ('Honors College', 'HC', 'Dr. Dustin Tahmahkera', 1200, 'https://www.uta.edu/honors', 'Selective honors programs offering enhanced academic experiences, research opportunities, and interdisciplinary coursework.'),
  ('Graduate School', 'GS', 'Dr. James Grover', 4600, 'https://www.uta.edu/graduate', 'Oversees all graduate-level education, research assistantships, and doctoral programs across all colleges.')
ON CONFLICT (college_name) DO NOTHING;

-- ============================================================================
-- DONE - 10 colleges inserted
-- Next: Run 03-programs.sql
-- ============================================================================
