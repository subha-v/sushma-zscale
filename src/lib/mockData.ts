// ============================================================================
// FALLBACK MOCK DATA for dashboards when Supabase tables are empty
// ============================================================================

// College Dashboard - Academic Programs
export const MOCK_PROGRAMS = [
  {
    id: 'mock-1',
    program_name: 'Registered Nursing (RN)',
    credential_type: 'associate',
    total_cost: 12400,
    median_wage_at_exit: 78350,
    roi_years: 1.8,
    employment_rate: 96,
    is_credential_of_value: true,
    institutions: [{ name: 'El Centro College', county_fips: '48113' }]
  },
  {
    id: 'mock-2',
    program_name: 'Electrical Technology',
    credential_type: 'certificate',
    total_cost: 6800,
    median_wage_at_exit: 62480,
    roi_years: 2.1,
    employment_rate: 94,
    is_credential_of_value: true,
    institutions: [{ name: 'Cedar Valley College', county_fips: '48113' }]
  },
  {
    id: 'mock-3',
    program_name: 'Cybersecurity',
    credential_type: 'associate',
    total_cost: 14200,
    median_wage_at_exit: 85200,
    roi_years: 1.5,
    employment_rate: 92,
    is_credential_of_value: true,
    institutions: [{ name: 'Richland College', county_fips: '48113' }]
  },
  {
    id: 'mock-4',
    program_name: 'HVAC Technician',
    credential_type: 'certificate',
    total_cost: 5900,
    median_wage_at_exit: 52300,
    roi_years: 2.4,
    employment_rate: 95,
    is_credential_of_value: true,
    institutions: [{ name: 'Mountain View College', county_fips: '48113' }]
  },
  {
    id: 'mock-5',
    program_name: 'Welding Technology',
    credential_type: 'certificate',
    total_cost: 7200,
    median_wage_at_exit: 48750,
    roi_years: 2.8,
    employment_rate: 91,
    is_credential_of_value: true,
    institutions: [{ name: 'Eastfield College', county_fips: '48113' }]
  },
  {
    id: 'mock-6',
    program_name: 'Dental Hygiene',
    credential_type: 'associate',
    total_cost: 18500,
    median_wage_at_exit: 81340,
    roi_years: 2.2,
    employment_rate: 97,
    is_credential_of_value: true,
    institutions: [{ name: 'El Centro College', county_fips: '48113' }]
  },
  {
    id: 'mock-7',
    program_name: 'CNC Machining',
    credential_type: 'certificate',
    total_cost: 8100,
    median_wage_at_exit: 46200,
    roi_years: 3.2,
    employment_rate: 89,
    is_credential_of_value: true,
    institutions: [{ name: 'Cedar Valley College', county_fips: '48113' }]
  },
  {
    id: 'mock-8',
    program_name: 'Automotive Technology',
    credential_type: 'associate',
    total_cost: 15600,
    median_wage_at_exit: 45800,
    roi_years: 3.8,
    employment_rate: 86,
    is_credential_of_value: false,
    institutions: [{ name: 'Eastfield College', county_fips: '48113' }]
  },
  {
    id: 'mock-9',
    program_name: 'Business Administration',
    credential_type: 'associate',
    total_cost: 11800,
    median_wage_at_exit: 42500,
    roi_years: 4.2,
    employment_rate: 78,
    is_credential_of_value: false,
    institutions: [{ name: 'Richland College', county_fips: '48113' }]
  },
  {
    id: 'mock-10',
    program_name: 'Culinary Arts',
    credential_type: 'certificate',
    total_cost: 16200,
    median_wage_at_exit: 35800,
    roi_years: 5.5,
    employment_rate: 74,
    is_credential_of_value: false,
    institutions: [{ name: 'El Centro College', county_fips: '48113' }]
  },
  {
    id: 'mock-11',
    program_name: 'Graphic Design',
    credential_type: 'associate',
    total_cost: 14800,
    median_wage_at_exit: 38200,
    roi_years: 5.8,
    employment_rate: 68,
    is_credential_of_value: false,
    institutions: [{ name: 'Brookhaven College', county_fips: '48113' }]
  },
  {
    id: 'mock-12',
    program_name: 'Paralegal Studies',
    credential_type: 'associate',
    total_cost: 13400,
    median_wage_at_exit: 41200,
    roi_years: 4.6,
    employment_rate: 76,
    is_credential_of_value: false,
    institutions: [{ name: 'Cedar Valley College', county_fips: '48113' }]
  },
  {
    id: 'mock-13',
    program_name: 'Software Development',
    credential_type: 'certificate',
    total_cost: 9800,
    median_wage_at_exit: 72500,
    roi_years: 1.9,
    employment_rate: 88,
    is_credential_of_value: true,
    institutions: [{ name: 'Richland College', county_fips: '48113' }]
  },
  {
    id: 'mock-14',
    program_name: 'Diagnostic Medical Sonography',
    credential_type: 'associate',
    total_cost: 19200,
    median_wage_at_exit: 75600,
    roi_years: 2.6,
    employment_rate: 93,
    is_credential_of_value: true,
    institutions: [{ name: 'El Centro College', county_fips: '48113' }]
  },
  {
    id: 'mock-15',
    program_name: 'Criminal Justice',
    credential_type: 'associate',
    total_cost: 11200,
    median_wage_at_exit: 38500,
    roi_years: 6.2,
    employment_rate: 72,
    is_credential_of_value: false,
    institutions: [{ name: 'Mountain View College', county_fips: '48113' }]
  },
]

// EDC Dashboard - Businesses
export const MOCK_BUSINESSES = [
  { id: 'biz-1', company_name: 'Texas Instruments', county_fips: '48113', naics_code: '334413', company_size: 'large', employee_count: 14200, city: 'Dallas', structural_risk_score: 0.12, open_positions: 340 },
  { id: 'biz-2', company_name: 'AT&T', county_fips: '48113', naics_code: '517311', company_size: 'large', employee_count: 12800, city: 'Dallas', structural_risk_score: 0.18, open_positions: 285 },
  { id: 'biz-3', company_name: 'Southwest Airlines', county_fips: '48113', naics_code: '481111', company_size: 'large', employee_count: 9600, city: 'Dallas', structural_risk_score: 0.22, open_positions: 195 },
  { id: 'biz-4', company_name: 'Baylor Scott & White Health', county_fips: '48113', naics_code: '622110', company_size: 'large', employee_count: 8500, city: 'Dallas', structural_risk_score: 0.08, open_positions: 520 },
  { id: 'biz-5', company_name: 'Jacobs Engineering', county_fips: '48113', naics_code: '541330', company_size: 'large', employee_count: 6200, city: 'Dallas', structural_risk_score: 0.15, open_positions: 145 },
  { id: 'biz-6', company_name: 'Tenet Healthcare', county_fips: '48113', naics_code: '622110', company_size: 'large', employee_count: 5800, city: 'Dallas', structural_risk_score: 0.14, open_positions: 380 },
  { id: 'biz-7', company_name: 'Kimberly-Clark', county_fips: '48113', naics_code: '322121', company_size: 'large', employee_count: 4200, city: 'Irving', structural_risk_score: 0.28, open_positions: 85 },
  { id: 'biz-8', company_name: 'Builders FirstSource', county_fips: '48113', naics_code: '423310', company_size: 'large', employee_count: 3800, city: 'Dallas', structural_risk_score: 0.32, open_positions: 110 },
  { id: 'biz-9', company_name: 'Match Group', county_fips: '48113', naics_code: '519130', company_size: 'medium', employee_count: 2200, city: 'Dallas', structural_risk_score: 0.25, open_positions: 65 },
  { id: 'biz-10', company_name: 'Topgolf Entertainment', county_fips: '48113', naics_code: '713940', company_size: 'medium', employee_count: 1800, city: 'Dallas', structural_risk_score: 0.38, open_positions: 95 },
  { id: 'biz-11', company_name: 'Think Finance', county_fips: '48113', naics_code: '522390', company_size: 'medium', employee_count: 1400, city: 'Dallas', structural_risk_score: 0.42, open_positions: 35 },
  { id: 'biz-12', company_name: 'Razor Manufacturing', county_fips: '48113', naics_code: '332710', company_size: 'medium', employee_count: 950, city: 'Grand Prairie', structural_risk_score: 0.35, open_positions: 42 },
  { id: 'biz-13', company_name: 'DFW Airport Hotels Group', county_fips: '48113', naics_code: '721110', company_size: 'medium', employee_count: 820, city: 'Irving', structural_risk_score: 0.45, open_positions: 68 },
  { id: 'biz-14', company_name: 'North Texas Food Bank', county_fips: '48113', naics_code: '624210', company_size: 'small', employee_count: 340, city: 'Plano', structural_risk_score: 0.10, open_positions: 15 },
  { id: 'biz-15', company_name: 'Dallas Digital Solutions', county_fips: '48113', naics_code: '541511', company_size: 'small', employee_count: 180, city: 'Dallas', structural_risk_score: 0.20, open_positions: 22 },
  // Grapevine businesses
  { id: 'biz-16', company_name: 'Gaylord Texan Resort', county_fips: '48439', naics_code: '721110', company_size: 'large', employee_count: 2000, city: 'Grapevine', structural_risk_score: 0.10, open_positions: 85 },
  { id: 'biz-17', company_name: 'Baylor Scott & White - Grapevine', county_fips: '48439', naics_code: '622110', company_size: 'large', employee_count: 2000, city: 'Grapevine', structural_risk_score: 0.08, open_positions: 120 },
  { id: 'biz-18', company_name: 'Grapevine Mills Mall (Simon)', county_fips: '48439', naics_code: '531120', company_size: 'large', employee_count: 2000, city: 'Grapevine', structural_risk_score: 0.15, open_positions: 95 },
  { id: 'biz-19', company_name: 'Grapevine-Colleyville ISD', county_fips: '48439', naics_code: '611110', company_size: 'large', employee_count: 1861, city: 'Grapevine', structural_risk_score: 0.22, open_positions: 45 },
  { id: 'biz-20', company_name: 'DFW Airport (Grapevine)', county_fips: '48439', naics_code: '488119', company_size: 'large', employee_count: 1500, city: 'Grapevine', structural_risk_score: 0.05, open_positions: 65 },
  { id: 'biz-21', company_name: 'Paycom Grapevine', county_fips: '48439', naics_code: '511210', company_size: 'large', employee_count: 1000, city: 'Grapevine', structural_risk_score: 0.08, open_positions: 42 },
  { id: 'biz-22', company_name: 'Kubota NA HQ', county_fips: '48439', naics_code: '333111', company_size: 'medium', employee_count: 500, city: 'Grapevine', structural_risk_score: 0.12, open_positions: 28 },
  { id: 'biz-23', company_name: 'Great Wolf Lodge Grapevine', county_fips: '48439', naics_code: '721110', company_size: 'medium', employee_count: 500, city: 'Grapevine', structural_risk_score: 0.18, open_positions: 35 },
]

// Student Dashboard - Career Pathways
export const MOCK_CAREER_PATHWAYS = [
  { id: 'cp-1', occupation_title: 'Registered Nurse', onet_soc_code: '29-1141', entry_wage_hourly: 28.50, entry_wage_annual: 59280, median_wage_annual: 78350, time_to_credential_months: 24, local_employer_count: 185, local_job_openings: 1240, growth_rate: 6.2, key_skills: ['Patient Care', 'Clinical Assessment', 'Medication Administration', 'EMR Systems', 'Critical Thinking'], county_fips: '48113' },
  { id: 'cp-2', occupation_title: 'Software Developer', onet_soc_code: '15-1256', entry_wage_hourly: 32.40, entry_wage_annual: 67392, median_wage_annual: 92450, time_to_credential_months: 6, local_employer_count: 320, local_job_openings: 2150, growth_rate: 25.7, key_skills: ['JavaScript', 'Python', 'React', 'SQL', 'Git', 'APIs'], county_fips: '48113' },
  { id: 'cp-3', occupation_title: 'Electrician', onet_soc_code: '47-2111', entry_wage_hourly: 21.80, entry_wage_annual: 45344, median_wage_annual: 62480, time_to_credential_months: 12, local_employer_count: 145, local_job_openings: 680, growth_rate: 7.1, key_skills: ['Electrical Systems', 'Blueprint Reading', 'NEC Code', 'Troubleshooting', 'Safety'], county_fips: '48113' },
  { id: 'cp-4', occupation_title: 'Cybersecurity Analyst', onet_soc_code: '15-1212', entry_wage_hourly: 35.20, entry_wage_annual: 73216, median_wage_annual: 102600, time_to_credential_months: 8, local_employer_count: 210, local_job_openings: 890, growth_rate: 33.3, key_skills: ['Network Security', 'SIEM', 'Incident Response', 'Compliance', 'Penetration Testing'], county_fips: '48113' },
  { id: 'cp-5', occupation_title: 'HVAC Technician', onet_soc_code: '49-9021', entry_wage_hourly: 18.90, entry_wage_annual: 39312, median_wage_annual: 52300, time_to_credential_months: 10, local_employer_count: 98, local_job_openings: 420, growth_rate: 5.8, key_skills: ['Refrigeration', 'Electrical', 'EPA Certification', 'Customer Service', 'Diagnostics'], county_fips: '48113' },
  { id: 'cp-6', occupation_title: 'Dental Hygienist', onet_soc_code: '29-2021', entry_wage_hourly: 34.50, entry_wage_annual: 71760, median_wage_annual: 81340, time_to_credential_months: 24, local_employer_count: 165, local_job_openings: 310, growth_rate: 9.4, key_skills: ['Oral Health Assessment', 'Radiography', 'Periodontal Care', 'Patient Education'], county_fips: '48113' },
  { id: 'cp-7', occupation_title: 'Welder', onet_soc_code: '51-4121', entry_wage_hourly: 18.20, entry_wage_annual: 37856, median_wage_annual: 48750, time_to_credential_months: 8, local_employer_count: 120, local_job_openings: 540, growth_rate: 4.2, key_skills: ['MIG Welding', 'TIG Welding', 'Blueprint Reading', 'Metal Fabrication'], county_fips: '48113' },
  { id: 'cp-8', occupation_title: 'Medical Lab Technician', onet_soc_code: '29-2012', entry_wage_hourly: 22.60, entry_wage_annual: 47008, median_wage_annual: 57380, time_to_credential_months: 18, local_employer_count: 75, local_job_openings: 280, growth_rate: 7.8, key_skills: ['Phlebotomy', 'Lab Analysis', 'Quality Control', 'Hematology', 'Microbiology'], county_fips: '48113' },
  { id: 'cp-9', occupation_title: 'Cloud Engineer', onet_soc_code: '15-1244', entry_wage_hourly: 38.50, entry_wage_annual: 80080, median_wage_annual: 112000, time_to_credential_months: 6, local_employer_count: 180, local_job_openings: 760, growth_rate: 28.5, key_skills: ['AWS', 'Azure', 'Kubernetes', 'Terraform', 'Linux', 'CI/CD'], county_fips: '48113' },
  { id: 'cp-10', occupation_title: 'Plumber', onet_soc_code: '47-2152', entry_wage_hourly: 19.80, entry_wage_annual: 41184, median_wage_annual: 58200, time_to_credential_months: 12, local_employer_count: 110, local_job_openings: 380, growth_rate: 5.2, key_skills: ['Pipe Fitting', 'Plumbing Code', 'Blueprint Reading', 'Troubleshooting'], county_fips: '48113' },
]

// TWC Dashboard - Institutions for RTI matching
export const MOCK_INSTITUTIONS = [
  { id: 'inst-1', name: 'El Centro College', type: 'community_college', city: 'Dallas', county_fips: '48113' },
  { id: 'inst-2', name: 'Cedar Valley College', type: 'community_college', city: 'Lancaster', county_fips: '48113' },
  { id: 'inst-3', name: 'Eastfield College', type: 'community_college', city: 'Mesquite', county_fips: '48113' },
  { id: 'inst-4', name: 'Mountain View College', type: 'community_college', city: 'Dallas', county_fips: '48113' },
  { id: 'inst-5', name: 'Richland College', type: 'community_college', city: 'Dallas', county_fips: '48113' },
  { id: 'inst-6', name: 'North Lake College', type: 'community_college', city: 'Irving', county_fips: '48113' },
  { id: 'inst-7', name: 'Dallas ISD CTE Center', type: 'technical_center', city: 'Dallas', county_fips: '48113' },
  { id: 'inst-8', name: 'Universal Technical Institute', type: 'technical_school', city: 'Dallas', county_fips: '48113' },
]
