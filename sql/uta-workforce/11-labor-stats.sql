-- ============================================================================
-- ARLINGTON LABOR STATISTICS - BLS, TWC, and Census data
-- Run after 01-schema.sql
-- Sources: BLS QCEW, BLS OES, TWC LMCI, Census ACS, UTA Institutional Research
-- ============================================================================

-- ============================================================================
-- EMPLOYMENT METRICS
-- ============================================================================
INSERT INTO arlington_labor_stats (metric_name, metric_category, metric_value, metric_unit, geography, time_period, data_source, notes)
VALUES
  ('Total Nonfarm Employment', 'employment', 1212800, 'count', 'Fort Worth-Arlington MD', 'May 2025', 'BLS CES', 'Fort Worth-Arlington Metropolitan Division total nonfarm employment'),
  ('Total Nonfarm Employment', 'employment', 142000, 'count', 'Arlington, TX', '2024', 'BLS / TWC', 'Estimated total employment within Arlington city limits'),
  ('Unemployment Rate', 'employment', 3.8, 'percent', 'Fort Worth-Arlington MD', 'Q4 2024', 'BLS LAUS', 'Seasonally adjusted unemployment rate'),
  ('Unemployment Rate', 'employment', 3.6, 'percent', 'Tarrant County, TX', 'Q4 2024', 'BLS LAUS', 'Tarrant County unemployment rate'),
  ('Labor Force Size', 'employment', 1150000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS LAUS', 'Total civilian labor force'),
  ('Labor Force Participation Rate', 'employment', 67.2, 'percent', 'Fort Worth-Arlington MD', '2024', 'BLS / Census ACS', 'Civilian labor force participation rate'),
  ('Job Growth Rate (YoY)', 'employment', 2.8, 'percent', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Year-over-year nonfarm employment growth'),
  ('Total Establishments', 'employment', 8500, 'count', 'Arlington, TX', '2024', 'BLS QCEW', 'Total business establishments in Arlington'),

-- ============================================================================
-- WAGE METRICS
-- ============================================================================
  ('Average Weekly Wages', 'wages', 1501, 'dollars', 'Tarrant County, TX', 'Q3 2024', 'BLS QCEW', 'Average weekly wages across all industries, all ownership'),
  ('Average Annual Salary', 'wages', 78052, 'dollars', 'Tarrant County, TX', '2024', 'BLS QCEW', 'Average annual wages (weekly * 52)'),
  ('Median Household Income', 'wages', 68500, 'dollars', 'Arlington, TX', '2024', 'Census ACS', 'Median household income'),
  ('Average Annual Salary - Manufacturing', 'wages', 72000, 'dollars', 'Arlington, TX', '2024', 'BLS OES', 'Average annual salary in manufacturing sector'),
  ('Average Annual Salary - Healthcare', 'wages', 58000, 'dollars', 'Arlington, TX', '2024', 'BLS OES', 'Average annual salary in healthcare sector'),
  ('Average Annual Salary - Technology', 'wages', 98000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Average annual salary for computer and mathematical occupations'),
  ('Average Annual Salary - Education', 'wages', 52000, 'dollars', 'Arlington, TX', '2024', 'BLS OES', 'Average annual salary in education sector'),
  ('Average Annual Salary - Entertainment', 'wages', 38000, 'dollars', 'Arlington, TX', '2024', 'BLS OES', 'Average annual salary in arts, entertainment, recreation'),
  ('Average Annual Salary - Construction', 'wages', 55000, 'dollars', 'Arlington, TX', '2024', 'BLS OES', 'Average annual salary in construction sector'),
  ('Average Annual Salary - Professional Services', 'wages', 82000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Average annual salary in professional and technical services'),
  ('Cost of Living Index', 'wages', 96.2, 'ratio', 'Arlington, TX', '2024', 'COLI / BEA', 'Cost of living index vs national average (100)'),

-- ============================================================================
-- EDUCATION METRICS
-- ============================================================================
  ('Population with Bachelors Degree or Higher', 'education', 32.4, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Percentage of adults 25+ with bachelors degree or higher'),
  ('Population with Graduate Degree', 'education', 11.8, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Percentage of adults 25+ with masters, professional, or doctoral degree'),
  ('Population with Some College/Associates', 'education', 28.6, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Percentage of adults 25+ with some college or associates degree'),
  ('High School Graduation Rate', 'education', 89.2, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Percentage of adults 25+ with high school diploma or equivalent'),
  ('UTA Total Enrollment', 'education', 44956, 'count', 'Arlington, TX', 'Fall 2024', 'UTA Institutional Research', 'Total student enrollment at UT Arlington'),
  ('UTA Undergraduate Enrollment', 'education', 33200, 'count', 'Arlington, TX', 'Fall 2024', 'UTA Institutional Research', 'Undergraduate student enrollment'),
  ('UTA Graduate Enrollment', 'education', 11756, 'count', 'Arlington, TX', 'Fall 2024', 'UTA Institutional Research', 'Graduate and professional student enrollment'),
  ('UTA 6-Year Graduation Rate', 'education', 54.0, 'percent', 'Arlington, TX', '2024', 'UTA Institutional Research', 'Six-year graduation rate for first-time full-time freshmen'),
  ('UTA Annual Degrees Awarded', 'education', 10800, 'count', 'Arlington, TX', '2023-24', 'UTA Institutional Research', 'Total degrees and certificates awarded in academic year'),
  ('UTA Employment Rate (6 months)', 'education', 75.0, 'percent', 'Arlington, TX', '2024', 'UTA Career Development Center', 'Percentage of graduates employed within 6 months of graduation'),
  ('UTA Average Starting Salary (Bachelors)', 'education', 63199, 'dollars', 'Arlington, TX', '2024', 'UTA Career Development Center / NACE', 'Average starting salary for UTA bachelors degree graduates'),

-- ============================================================================
-- DEMOGRAPHIC METRICS
-- ============================================================================
  ('Total Population', 'demographics', 394266, 'count', 'Arlington, TX', '2024', 'Census ACS', 'Estimated total population of Arlington'),
  ('Population Growth Rate (YoY)', 'demographics', 1.2, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Year-over-year population growth'),
  ('Median Age', 'demographics', 33.1, 'count', 'Arlington, TX', '2024', 'Census ACS', 'Median age of Arlington residents'),
  ('Working Age Population (18-64)', 'demographics', 65.8, 'percent', 'Arlington, TX', '2024', 'Census ACS', 'Percentage of population aged 18-64'),
  ('Tarrant County Population', 'demographics', 2150000, 'count', 'Tarrant County, TX', '2024', 'Census ACS', 'Estimated total population of Tarrant County'),
  ('DFW Metro Population', 'demographics', 8100000, 'count', 'Dallas-Fort Worth-Arlington MSA', '2024', 'Census ACS', 'Estimated total population of the DFW metropolitan area'),

-- ============================================================================
-- INDUSTRY-SPECIFIC METRICS
-- ============================================================================
  ('Healthcare Job Openings (Monthly)', 'industry', 3200, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS JOLTS / Indeed', 'Average monthly healthcare job postings in the metro division'),
  ('Technology Job Openings (Monthly)', 'industry', 1800, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS JOLTS / Indeed', 'Average monthly technology job postings in the metro division'),
  ('Manufacturing Employment', 'industry', 85000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Total manufacturing employment in metro division'),
  ('Education & Health Services Employment', 'industry', 195000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Combined education and health services employment'),
  ('Professional & Business Services Employment', 'industry', 175000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Professional and business services employment'),
  ('Leisure & Hospitality Employment', 'industry', 125000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Leisure and hospitality employment'),
  ('Financial Activities Employment', 'industry', 78000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Financial activities employment'),
  ('Construction Employment', 'industry', 95000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Construction employment in metro division'),
  ('Government Employment', 'industry', 145000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Total government employment'),
  ('Trade, Transportation, Utilities Employment', 'industry', 210000, 'count', 'Fort Worth-Arlington MD', '2024', 'BLS CES', 'Trade, transportation, and utilities employment'),

-- ============================================================================
-- OCCUPATION-SPECIFIC METRICS
-- ============================================================================
  ('Software Developers - Median Salary', 'occupation', 105000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for software developers'),
  ('Registered Nurses - Median Salary', 'occupation', 78350, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for registered nurses'),
  ('Mechanical Engineers - Median Salary', 'occupation', 92000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for mechanical engineers'),
  ('Accountants & Auditors - Median Salary', 'occupation', 72000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for accountants and auditors'),
  ('Teachers (K-12) - Median Salary', 'occupation', 62000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for K-12 teachers'),
  ('Civil Engineers - Median Salary', 'occupation', 88000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for civil engineers'),
  ('Data Scientists - Median Salary', 'occupation', 110000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for data scientists'),
  ('Financial Analysts - Median Salary', 'occupation', 82000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for financial analysts'),
  ('Cybersecurity Analysts - Median Salary', 'occupation', 102000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for information security analysts'),
  ('Industrial Engineers - Median Salary', 'occupation', 88000, 'dollars', 'Fort Worth-Arlington MD', '2024', 'BLS OES', 'Median annual wage for industrial engineers')
ON CONFLICT (metric_name, metric_category, geography, time_period) DO NOTHING;

-- ============================================================================
-- DONE - ~60 labor statistics inserted
-- Next: Run 12-verify.sql
-- ============================================================================
