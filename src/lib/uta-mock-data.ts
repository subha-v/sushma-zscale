// ============================================================================
// FALLBACK MOCK DATA for UTA Workforce Intelligence when Supabase is empty
// Follows the same pattern as mockData.ts
// ============================================================================

import type {
  UTACollege,
  UTAProgram,
  UTAProgramOutcome,
  ArlingtonEmployer,
  ArlingtonJobOpening,
  ArlingtonDevelopment,
  ArlingtonIndustry,
  UTAEmployerPartnership,
  ArlingtonLaborStat,
} from './uta-queries'

// ============================================================================
// UTA COLLEGES (5 of 10)
// ============================================================================
export const MOCK_UTA_COLLEGES: UTACollege[] = [
  { id: 'uta-col-1', college_name: 'College of Engineering', abbreviation: 'COE', dean_name: 'Dr. Peteranova', enrollment: 7200, website_url: 'https://www.uta.edu/engineering', description: 'One of the largest engineering programs in Texas.' },
  { id: 'uta-col-2', college_name: 'College of Business', abbreviation: 'COB', dean_name: 'Dr. Harry Dombroski', enrollment: 6800, website_url: 'https://www.uta.edu/business', description: 'AACSB-accredited business school.' },
  { id: 'uta-col-3', college_name: 'College of Nursing and Health Innovation', abbreviation: 'CONHI', dean_name: 'Dr. Elizabeth Merwin', enrollment: 4200, website_url: 'https://www.uta.edu/nursing', description: 'Top-ranked nursing college, one of the largest in the nation.' },
  { id: 'uta-col-4', college_name: 'College of Science', abbreviation: 'COS', dean_name: 'Dr. Morteza Khaledi', enrollment: 5800, website_url: 'https://www.uta.edu/science', description: 'Programs in biology, chemistry, data science, math, physics, and psychology.' },
  { id: 'uta-col-5', college_name: 'College of Liberal Arts', abbreviation: 'COLA', dean_name: 'Dr. Elisabeth Cawthon', enrollment: 8500, website_url: 'https://www.uta.edu/liberal-arts', description: 'The largest college at UTA.' },
]

// ============================================================================
// UTA PROGRAMS (10 of ~180)
// ============================================================================
export const MOCK_UTA_PROGRAMS: UTAProgram[] = [
  { id: 'uta-prog-1', college_id: 'uta-col-1', program_name: 'Computer Science', degree_level: 'bachelor', degree_type: 'BS', cip_code: '11.0701', is_stem: true, is_online_available: false, credit_hours: 124, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-2', college_id: 'uta-col-1', program_name: 'Mechanical Engineering', degree_level: 'bachelor', degree_type: 'BS', cip_code: '14.1901', is_stem: true, is_online_available: false, credit_hours: 128, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-3', college_id: 'uta-col-3', program_name: 'Nursing', degree_level: 'bachelor', degree_type: 'BSN', cip_code: '51.3801', is_stem: false, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-4', college_id: 'uta-col-2', program_name: 'Accounting', degree_level: 'bachelor', degree_type: 'BBA', cip_code: '52.0301', is_stem: false, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-5', college_id: 'uta-col-4', program_name: 'Biology', degree_level: 'bachelor', degree_type: 'BS', cip_code: '26.0101', is_stem: true, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-6', college_id: 'uta-col-4', program_name: 'Data Science', degree_level: 'bachelor', degree_type: 'BS', cip_code: '30.7001', is_stem: true, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-7', college_id: 'uta-col-1', program_name: 'Aerospace Engineering', degree_level: 'bachelor', degree_type: 'BS', cip_code: '14.0201', is_stem: true, is_online_available: false, credit_hours: 127, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-8', college_id: 'uta-col-2', program_name: 'Finance', degree_level: 'bachelor', degree_type: 'BBA', cip_code: '52.0801', is_stem: false, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-9', college_id: 'uta-col-1', program_name: 'Software Engineering', degree_level: 'bachelor', degree_type: 'BS', cip_code: '14.0903', is_stem: true, is_online_available: false, credit_hours: 124, description: '', website_url: '', is_active: true },
  { id: 'uta-prog-10', college_id: 'uta-col-5', program_name: 'Communication', degree_level: 'bachelor', degree_type: 'BA', cip_code: '09.0101', is_stem: false, is_online_available: false, credit_hours: 120, description: '', website_url: '', is_active: true },
]

// ============================================================================
// PROGRAM OUTCOMES (8 of ~30)
// ============================================================================
export const MOCK_UTA_PROGRAM_OUTCOMES: UTAProgramOutcome[] = [
  { id: 'uta-out-1', program_id: 'uta-prog-1', outcome_year: 2024, graduation_rate: 52, employment_rate: 82, median_starting_salary: 68300, median_mid_career_salary: 115000, avg_time_to_degree_months: 48, total_graduates: 485, employed_in_field_pct: 74, continuing_education_pct: 18, top_employers: ['Lockheed Martin', 'Texas Instruments', 'Amazon'], top_job_titles: ['Software Developer', 'Data Engineer'], data_source: 'UTA / NACE' },
  { id: 'uta-out-2', program_id: 'uta-prog-3', outcome_year: 2024, graduation_rate: 72, employment_rate: 93, median_starting_salary: 70300, median_mid_career_salary: 85000, avg_time_to_degree_months: 48, total_graduates: 520, employed_in_field_pct: 90, continuing_education_pct: 8, top_employers: ['Texas Health Resources', 'Medical City Arlington'], top_job_titles: ['Registered Nurse', 'ICU Nurse'], data_source: 'UTA CONHI' },
  { id: 'uta-out-3', program_id: 'uta-prog-2', outcome_year: 2024, graduation_rate: 50, employment_rate: 78, median_starting_salary: 64800, median_mid_career_salary: 105000, avg_time_to_degree_months: 50, total_graduates: 210, employed_in_field_pct: 70, continuing_education_pct: 20, top_employers: ['Lockheed Martin', 'Bell Textron', 'GM Arlington'], top_job_titles: ['Mechanical Engineer', 'Design Engineer'], data_source: 'UTA / NACE' },
  { id: 'uta-out-4', program_id: 'uta-prog-4', outcome_year: 2024, graduation_rate: 58, employment_rate: 78, median_starting_salary: 56000, median_mid_career_salary: 92000, avg_time_to_degree_months: 48, total_graduates: 280, employed_in_field_pct: 72, continuing_education_pct: 22, top_employers: ['Deloitte', 'Ernst & Young', 'KPMG'], top_job_titles: ['Staff Accountant', 'Auditor'], data_source: 'UTA / NACE' },
  { id: 'uta-out-5', program_id: 'uta-prog-6', outcome_year: 2024, graduation_rate: 55, employment_rate: 85, median_starting_salary: 65000, median_mid_career_salary: 110000, avg_time_to_degree_months: 48, total_graduates: 75, employed_in_field_pct: 76, continuing_education_pct: 16, top_employers: ['Amazon', 'Deloitte', 'Capital One'], top_job_titles: ['Data Analyst', 'Data Scientist'], data_source: 'UTA / NACE' },
  { id: 'uta-out-6', program_id: 'uta-prog-7', outcome_year: 2024, graduation_rate: 46, employment_rate: 81, median_starting_salary: 66000, median_mid_career_salary: 110000, avg_time_to_degree_months: 52, total_graduates: 85, employed_in_field_pct: 73, continuing_education_pct: 25, top_employers: ['Lockheed Martin', 'Bell Textron', 'Northrop Grumman'], top_job_titles: ['Aerospace Engineer', 'Systems Engineer'], data_source: 'UTA / NACE' },
  { id: 'uta-out-7', program_id: 'uta-prog-8', outcome_year: 2024, graduation_rate: 56, employment_rate: 76, median_starting_salary: 55000, median_mid_career_salary: 95000, avg_time_to_degree_months: 48, total_graduates: 195, employed_in_field_pct: 68, continuing_education_pct: 18, top_employers: ['Goldman Sachs', 'JPMorgan Chase', 'GM Financial'], top_job_titles: ['Financial Analyst', 'Credit Analyst'], data_source: 'UTA / NACE' },
  { id: 'uta-out-8', program_id: 'uta-prog-9', outcome_year: 2024, graduation_rate: 50, employment_rate: 84, median_starting_salary: 67500, median_mid_career_salary: 118000, avg_time_to_degree_months: 48, total_graduates: 95, employed_in_field_pct: 78, continuing_education_pct: 15, top_employers: ['Amazon', 'Microsoft', 'Lockheed Martin'], top_job_titles: ['Software Engineer', 'Full Stack Developer'], data_source: 'UTA / NACE' },
]

// ============================================================================
// ARLINGTON EMPLOYERS (10 of 55)
// ============================================================================
export const MOCK_ARLINGTON_EMPLOYERS: ArlingtonEmployer[] = [
  { id: 'arl-emp-1', company_name: 'General Motors Arlington Assembly', industry: 'Automotive Manufacturing', naics_code: '336111', employee_count: 5200, employee_range: '5000+', city: 'Arlington', state: 'TX', zip_code: '76011', is_fortune_500: true, is_headquartered_locally: false, website_url: 'https://www.gm.com', description: 'Full-size SUV assembly plant', year_established: 1954, hires_uta_grads: true },
  { id: 'arl-emp-2', company_name: 'Texas Health Resources', industry: 'Healthcare', naics_code: '622110', employee_count: 29000, employee_range: '5000+', city: 'Arlington', state: 'TX', zip_code: '76012', is_fortune_500: false, is_headquartered_locally: true, website_url: 'https://www.texashealth.org', description: 'Faith-based nonprofit health system', year_established: 1997, hires_uta_grads: true },
  { id: 'arl-emp-3', company_name: 'Arlington ISD', industry: 'K-12 Education', naics_code: '611110', employee_count: 8400, employee_range: '5000+', city: 'Arlington', state: 'TX', zip_code: '76010', is_fortune_500: false, is_headquartered_locally: true, website_url: 'https://www.aisd.net', description: 'Second-largest school district in Tarrant County', year_established: 1902, hires_uta_grads: true },
  { id: 'arl-emp-4', company_name: 'D.R. Horton', industry: 'Homebuilding', naics_code: '236115', employee_count: 3200, employee_range: '1000-4999', city: 'Arlington', state: 'TX', zip_code: '76006', is_fortune_500: true, is_headquartered_locally: true, website_url: 'https://www.drhorton.com', description: 'Americas largest homebuilder', year_established: 1978, hires_uta_grads: true },
  { id: 'arl-emp-5', company_name: 'Bell Textron', industry: 'Aerospace & Defense', naics_code: '336411', employee_count: 7500, employee_range: '5000+', city: 'Fort Worth', state: 'TX', zip_code: '76101', is_fortune_500: false, is_headquartered_locally: true, website_url: 'https://www.bellflight.com', description: 'Helicopter and tiltrotor aircraft manufacturer', year_established: 1935, hires_uta_grads: true },
  { id: 'arl-emp-6', company_name: 'Lockheed Martin Aeronautics', industry: 'Aerospace & Defense', naics_code: '336411', employee_count: 18000, employee_range: '5000+', city: 'Fort Worth', state: 'TX', zip_code: '76108', is_fortune_500: true, is_headquartered_locally: false, website_url: 'https://www.lockheedmartin.com', description: 'F-35 Lightning II production', year_established: 1995, hires_uta_grads: true },
  { id: 'arl-emp-7', company_name: 'Six Flags Over Texas', industry: 'Entertainment', naics_code: '713110', employee_count: 3500, employee_range: '1000-4999', city: 'Arlington', state: 'TX', zip_code: '76010', is_fortune_500: false, is_headquartered_locally: false, website_url: 'https://www.sixflags.com/overtexas', description: 'Original Six Flags theme park', year_established: 1961, hires_uta_grads: true },
  { id: 'arl-emp-8', company_name: 'GM Financial', industry: 'Financial Services', naics_code: '522220', employee_count: 3500, employee_range: '1000-4999', city: 'Fort Worth', state: 'TX', zip_code: '76102', is_fortune_500: false, is_headquartered_locally: true, website_url: 'https://www.gmfinancial.com', description: 'GM captive lending arm', year_established: 1992, hires_uta_grads: true },
  { id: 'arl-emp-9', company_name: 'Deloitte', industry: 'Professional Services', naics_code: '541211', employee_count: 2500, employee_range: '1000-4999', city: 'Dallas', state: 'TX', zip_code: '75201', is_fortune_500: false, is_headquartered_locally: false, website_url: 'https://www.deloitte.com', description: 'Big Four professional services', year_established: 1845, hires_uta_grads: true },
  { id: 'arl-emp-10', company_name: 'Amazon - DFW Fulfillment', industry: 'E-Commerce / Logistics', naics_code: '493110', employee_count: 5000, employee_range: '5000+', city: 'Fort Worth', state: 'TX', zip_code: '76177', is_fortune_500: true, is_headquartered_locally: false, website_url: 'https://www.amazon.com', description: 'Multiple fulfillment centers across DFW', year_established: 1994, hires_uta_grads: true },
]

// ============================================================================
// JOB OPENINGS (8 of ~80)
// ============================================================================
export const MOCK_ARLINGTON_JOB_OPENINGS: ArlingtonJobOpening[] = [
  { id: 'arl-job-1', employer_id: 'arl-emp-1', job_title: 'Manufacturing Engineer', department: 'Production Engineering', salary_min: 65000, salary_max: 85000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['AutoCAD', 'Lean Manufacturing', 'Six Sigma'], preferred_skills: ['PLC Programming', 'Robotics'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'on-site', openings_count: 5, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-2', employer_id: 'arl-emp-2', job_title: 'Registered Nurse - Med/Surg', department: 'Nursing', salary_min: 62000, salary_max: 82000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Patient Assessment', 'EMR', 'NCLEX-RN'], preferred_skills: ['Epic EHR'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'on-site', openings_count: 30, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-3', employer_id: 'arl-emp-5', job_title: 'Aerospace Engineer', department: 'Engineering', salary_min: 72000, salary_max: 95000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Aerodynamics', 'MATLAB', 'CAD/CAM', 'FEA'], preferred_skills: ['Rotorcraft', 'CATIA'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'on-site', openings_count: 8, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-4', employer_id: 'arl-emp-8', job_title: 'Software Developer', department: 'Technology', salary_min: 72000, salary_max: 95000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Java', 'Spring Boot', 'SQL', 'Git'], preferred_skills: ['AWS', 'React', 'Docker'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'hybrid', openings_count: 8, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-5', employer_id: 'arl-emp-9', job_title: 'Audit Associate', department: 'Audit & Assurance', salary_min: 62000, salary_max: 72000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Accounting', 'Auditing', 'Excel', 'CPA Eligible'], preferred_skills: ['CPA', 'Data Analytics'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'hybrid', openings_count: 8, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-6', employer_id: 'arl-emp-6', job_title: 'Systems Engineer', department: 'Systems Engineering', salary_min: 75000, salary_max: 100000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Systems Engineering', 'MATLAB', 'Requirements Management'], preferred_skills: ['DOORS', 'DoD Programs'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'on-site', openings_count: 12, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-7', employer_id: 'arl-emp-4', job_title: 'Financial Analyst', department: 'Finance', salary_min: 58000, salary_max: 75000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Financial Modeling', 'Excel', 'Accounting'], preferred_skills: ['Real Estate Finance', 'Power BI'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'hybrid', openings_count: 3, posted_date: '2024-11-01', is_active: true },
  { id: 'arl-job-8', employer_id: 'arl-emp-10', job_title: 'Area Manager', department: 'Operations', salary_min: 60000, salary_max: 78000, salary_type: 'annual', education_required: 'bachelor', experience_years_min: 0, required_skills: ['Operations Management', 'Team Leadership', 'Data Analysis'], preferred_skills: ['Lean/Six Sigma', 'Logistics'], is_entry_level: true, is_internship: false, job_type: 'full-time', remote_option: 'on-site', openings_count: 10, posted_date: '2024-11-01', is_active: true },
]

// ============================================================================
// DEVELOPMENT PROJECTS (5 of 15)
// ============================================================================
export const MOCK_ARLINGTON_DEVELOPMENT: ArlingtonDevelopment[] = [
  { id: 'arl-dev-1', project_name: 'GM Arlington Assembly Plant Modernization', project_type: 'industrial', developer: 'General Motors', investment_amount: 500000000, estimated_jobs: 200, status: 'operational', location_description: 'GM Assembly Plant, Arlington', start_year: 2019, completion_year: 2024, description: '$500M+ investment for next-gen SUV production.', industries_impacted: ['Automotive Manufacturing', 'Robotics'] },
  { id: 'arl-dev-2', project_name: 'Globe Life Field', project_type: 'commercial', developer: 'City of Arlington / Texas Rangers', investment_amount: 1200000000, estimated_jobs: 5000, status: 'operational', location_description: 'Globe Life Field, Arlington', start_year: 2017, completion_year: 2020, description: '40,300-seat retractable roof baseball stadium.', industries_impacted: ['Entertainment', 'Hospitality'] },
  { id: 'arl-dev-3', project_name: 'E-Space Global Headquarters', project_type: 'commercial', developer: 'E-Space', investment_amount: 50000000, estimated_jobs: 300, status: 'operational', location_description: 'E-Space HQ, Arlington', start_year: 2022, completion_year: 2024, description: 'New global HQ for satellite constellation company.', industries_impacted: ['Aerospace & Defense', 'Technology'] },
  { id: 'arl-dev-4', project_name: 'Downtown Arlington Revitalization', project_type: 'mixed-use', developer: 'City of Arlington', investment_amount: 150000000, estimated_jobs: 800, status: 'under_construction', location_description: 'Downtown Arlington', start_year: 2022, completion_year: 2027, description: 'Multi-phase downtown revitalization.', industries_impacted: ['Real Estate', 'Retail', 'Construction'] },
  { id: 'arl-dev-5', project_name: 'UTA Research and Innovation District', project_type: 'institutional', developer: 'UT Arlington', investment_amount: 100000000, estimated_jobs: 500, status: 'under_construction', location_description: 'UTA Campus', start_year: 2023, completion_year: 2028, description: 'New research facilities and innovation hub.', industries_impacted: ['Higher Education', 'Technology', 'R&D'] },
]

// ============================================================================
// INDUSTRIES (5 of 18)
// ============================================================================
export const MOCK_ARLINGTON_INDUSTRIES: ArlingtonIndustry[] = [
  { id: 'arl-ind-1', industry_name: 'Healthcare & Social Assistance', naics_sector: '62', employment_count: 35000, avg_annual_wage: 58000, growth_rate: 4.2, location_quotient: 1.3, top_occupations: ['Registered Nurses', 'Medical Assistants', 'Physicians'], key_employers: ['Texas Health Resources', 'Medical City Arlington', 'JPS Health Network'], description: 'Fastest-growing sector in Arlington-Fort Worth.', data_year: 2024, data_source: 'BLS / TWC' },
  { id: 'arl-ind-2', industry_name: 'Aerospace & Defense', naics_sector: '3364', employment_count: 28000, avg_annual_wage: 95000, growth_rate: 3.5, location_quotient: 4.2, top_occupations: ['Aerospace Engineers', 'Systems Engineers', 'Software Engineers'], key_employers: ['Lockheed Martin', 'Bell Textron', 'L3Harris'], description: 'DFW is a national center for aerospace and defense.', data_year: 2024, data_source: 'BLS / TWC' },
  { id: 'arl-ind-3', industry_name: 'Technology & Software', naics_sector: '5112', employment_count: 5500, avg_annual_wage: 98000, growth_rate: 8.2, location_quotient: 0.7, top_occupations: ['Software Developers', 'Data Scientists', 'Cloud Engineers'], key_employers: ['Various Tech Companies', 'GM Financial Tech', 'E-Space'], description: 'Growing technology sector with strong demand.', data_year: 2024, data_source: 'BLS / TWC' },
  { id: 'arl-ind-4', industry_name: 'Automotive Manufacturing', naics_sector: '336', employment_count: 8500, avg_annual_wage: 72000, growth_rate: 2.1, location_quotient: 3.8, top_occupations: ['Assembly Workers', 'Manufacturing Engineers', 'Quality Engineers'], key_employers: ['General Motors Arlington Assembly', 'Peterbilt Motors'], description: 'Cornerstone of the local economy.', data_year: 2024, data_source: 'BLS / TWC' },
  { id: 'arl-ind-5', industry_name: 'Entertainment & Sports', naics_sector: '71', employment_count: 12000, avg_annual_wage: 38000, growth_rate: 5.1, location_quotient: 2.8, top_occupations: ['Event Staff', 'Operations Managers', 'Marketing Specialists'], key_employers: ['Six Flags', 'Texas Rangers', 'Dallas Cowboys'], description: 'Arlington is the premier DFW entertainment destination.', data_year: 2024, data_source: 'BLS / TWC' },
]

// ============================================================================
// LABOR STATS (10 of ~60)
// ============================================================================
export const MOCK_ARLINGTON_LABOR_STATS: ArlingtonLaborStat[] = [
  { id: 'arl-stat-1', metric_name: 'Total Nonfarm Employment', metric_category: 'employment', metric_value: 1212800, metric_unit: 'count', geography: 'Fort Worth-Arlington MD', time_period: 'May 2025', data_source: 'BLS CES', notes: '' },
  { id: 'arl-stat-2', metric_name: 'Unemployment Rate', metric_category: 'employment', metric_value: 3.8, metric_unit: 'percent', geography: 'Fort Worth-Arlington MD', time_period: 'Q4 2024', data_source: 'BLS LAUS', notes: '' },
  { id: 'arl-stat-3', metric_name: 'Average Weekly Wages', metric_category: 'wages', metric_value: 1501, metric_unit: 'dollars', geography: 'Tarrant County, TX', time_period: 'Q3 2024', data_source: 'BLS QCEW', notes: '' },
  { id: 'arl-stat-4', metric_name: 'UTA Total Enrollment', metric_category: 'education', metric_value: 44956, metric_unit: 'count', geography: 'Arlington, TX', time_period: 'Fall 2024', data_source: 'UTA Institutional Research', notes: '' },
  { id: 'arl-stat-5', metric_name: 'UTA 6-Year Graduation Rate', metric_category: 'education', metric_value: 54.0, metric_unit: 'percent', geography: 'Arlington, TX', time_period: '2024', data_source: 'UTA Institutional Research', notes: '' },
  { id: 'arl-stat-6', metric_name: 'UTA Average Starting Salary (Bachelors)', metric_category: 'education', metric_value: 63199, metric_unit: 'dollars', geography: 'Arlington, TX', time_period: '2024', data_source: 'UTA Career Development Center', notes: '' },
  { id: 'arl-stat-7', metric_name: 'Total Population', metric_category: 'demographics', metric_value: 394266, metric_unit: 'count', geography: 'Arlington, TX', time_period: '2024', data_source: 'Census ACS', notes: '' },
  { id: 'arl-stat-8', metric_name: 'Median Household Income', metric_category: 'wages', metric_value: 68500, metric_unit: 'dollars', geography: 'Arlington, TX', time_period: '2024', data_source: 'Census ACS', notes: '' },
  { id: 'arl-stat-9', metric_name: 'Software Developers - Median Salary', metric_category: 'occupation', metric_value: 105000, metric_unit: 'dollars', geography: 'Fort Worth-Arlington MD', time_period: '2024', data_source: 'BLS OES', notes: '' },
  { id: 'arl-stat-10', metric_name: 'Registered Nurses - Median Salary', metric_category: 'occupation', metric_value: 78350, metric_unit: 'dollars', geography: 'Fort Worth-Arlington MD', time_period: '2024', data_source: 'BLS OES', notes: '' },
]

// ============================================================================
// EMPLOYER PARTNERSHIPS (5 of ~50)
// ============================================================================
export const MOCK_UTA_EMPLOYER_PARTNERSHIPS: UTAEmployerPartnership[] = [
  { id: 'arl-part-1', program_id: 'uta-prog-1', employer_id: 'arl-emp-6', partnership_type: 'hiring_pipeline', avg_hires_per_year: 25, avg_intern_salary: 62000, description: 'Lockheed Martin recruits heavily from UTA CS.', is_active: true },
  { id: 'arl-part-2', program_id: 'uta-prog-3', employer_id: 'arl-emp-2', partnership_type: 'hiring_pipeline', avg_hires_per_year: 45, avg_intern_salary: 58000, description: 'Texas Health Resources is the #1 employer of UTA BSN grads.', is_active: true },
  { id: 'arl-part-3', program_id: 'uta-prog-2', employer_id: 'arl-emp-5', partnership_type: 'internship', avg_hires_per_year: 12, avg_intern_salary: 55000, description: 'Bell hires UTA ME interns for rotorcraft design.', is_active: true },
  { id: 'arl-part-4', program_id: 'uta-prog-4', employer_id: 'arl-emp-9', partnership_type: 'hiring_pipeline', avg_hires_per_year: 12, avg_intern_salary: 52000, description: 'Deloitte recruits from UTA accounting program.', is_active: true },
  { id: 'arl-part-5', program_id: 'uta-prog-1', employer_id: 'arl-emp-10', partnership_type: 'hiring_pipeline', avg_hires_per_year: 20, avg_intern_salary: 62000, description: 'Amazon recruits UTA CS grads for SDE roles.', is_active: true },
]
