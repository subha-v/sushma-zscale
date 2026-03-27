import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Mock data fallback (subset for when Supabase tables are empty)
const MOCK_COLLEGES = [
  { id: "uta-col-1", college_name: "College of Engineering", abbreviation: "COE", dean_name: "Dr. Peteranova", enrollment: 7200, website_url: "https://www.uta.edu/engineering", description: "One of the largest engineering programs in Texas." },
  { id: "uta-col-2", college_name: "College of Business", abbreviation: "COB", dean_name: "Dr. Harry Dombroski", enrollment: 6800, website_url: "https://www.uta.edu/business", description: "AACSB-accredited business school." },
  { id: "uta-col-3", college_name: "College of Nursing and Health Innovation", abbreviation: "CONHI", dean_name: "Dr. Elizabeth Merwin", enrollment: 4200, website_url: "https://www.uta.edu/nursing", description: "Top-ranked nursing college, one of the largest in the nation." },
  { id: "uta-col-4", college_name: "College of Science", abbreviation: "COS", dean_name: "Dr. Morteza Khaledi", enrollment: 5800, website_url: "https://www.uta.edu/science", description: "Programs in biology, chemistry, data science, math, physics, and psychology." },
  { id: "uta-col-5", college_name: "College of Liberal Arts", abbreviation: "COLA", dean_name: "Dr. Elisabeth Cawthon", enrollment: 8500, website_url: "https://www.uta.edu/liberal-arts", description: "The largest college at UTA." },
];

const MOCK_PROGRAMS = [
  { id: "uta-prog-1", college_id: "uta-col-1", program_name: "Computer Science", degree_level: "bachelor", degree_type: "BS", cip_code: "11.0701", is_stem: true, is_online_available: false, credit_hours: 124, description: "", website_url: "", is_active: true },
  { id: "uta-prog-2", college_id: "uta-col-1", program_name: "Mechanical Engineering", degree_level: "bachelor", degree_type: "BS", cip_code: "14.1901", is_stem: true, is_online_available: false, credit_hours: 128, description: "", website_url: "", is_active: true },
  { id: "uta-prog-3", college_id: "uta-col-3", program_name: "Nursing", degree_level: "bachelor", degree_type: "BSN", cip_code: "51.3801", is_stem: false, is_online_available: false, credit_hours: 120, description: "", website_url: "", is_active: true },
  { id: "uta-prog-4", college_id: "uta-col-2", program_name: "Accounting", degree_level: "bachelor", degree_type: "BBA", cip_code: "52.0301", is_stem: false, is_online_available: false, credit_hours: 120, description: "", website_url: "", is_active: true },
  { id: "uta-prog-5", college_id: "uta-col-4", program_name: "Biology", degree_level: "bachelor", degree_type: "BS", cip_code: "26.0101", is_stem: true, is_online_available: false, credit_hours: 120, description: "", website_url: "", is_active: true },
  { id: "uta-prog-6", college_id: "uta-col-4", program_name: "Data Science", degree_level: "bachelor", degree_type: "BS", cip_code: "30.7001", is_stem: true, is_online_available: false, credit_hours: 120, description: "", website_url: "", is_active: true },
  { id: "uta-prog-7", college_id: "uta-col-1", program_name: "Aerospace Engineering", degree_level: "bachelor", degree_type: "BS", cip_code: "14.0201", is_stem: true, is_online_available: false, credit_hours: 127, description: "", website_url: "", is_active: true },
  { id: "uta-prog-8", college_id: "uta-col-2", program_name: "Finance", degree_level: "bachelor", degree_type: "BBA", cip_code: "52.0801", is_stem: false, is_online_available: false, credit_hours: 120, description: "", website_url: "", is_active: true },
  { id: "uta-prog-9", college_id: "uta-col-1", program_name: "Software Engineering", degree_level: "bachelor", degree_type: "BS", cip_code: "14.0903", is_stem: true, is_online_available: false, credit_hours: 124, description: "", website_url: "", is_active: true },
];

const MOCK_PROGRAM_OUTCOMES = [
  { id: "uta-out-1", program_id: "uta-prog-1", outcome_year: 2024, graduation_rate: 52, employment_rate: 82, median_starting_salary: 68300, median_mid_career_salary: 115000, avg_time_to_degree_months: 48, total_graduates: 485, employed_in_field_pct: 74, continuing_education_pct: 18, top_employers: ["Lockheed Martin", "Texas Instruments", "Amazon"], top_job_titles: ["Software Developer", "Data Engineer"], data_source: "UTA / NACE" },
  { id: "uta-out-2", program_id: "uta-prog-3", outcome_year: 2024, graduation_rate: 72, employment_rate: 93, median_starting_salary: 70300, median_mid_career_salary: 85000, avg_time_to_degree_months: 48, total_graduates: 520, employed_in_field_pct: 90, continuing_education_pct: 8, top_employers: ["Texas Health Resources", "Medical City Arlington"], top_job_titles: ["Registered Nurse", "ICU Nurse"], data_source: "UTA CONHI" },
  { id: "uta-out-3", program_id: "uta-prog-2", outcome_year: 2024, graduation_rate: 50, employment_rate: 78, median_starting_salary: 64800, median_mid_career_salary: 105000, avg_time_to_degree_months: 50, total_graduates: 210, employed_in_field_pct: 70, continuing_education_pct: 20, top_employers: ["Lockheed Martin", "Bell Textron", "GM Arlington"], top_job_titles: ["Mechanical Engineer", "Design Engineer"], data_source: "UTA / NACE" },
  { id: "uta-out-4", program_id: "uta-prog-4", outcome_year: 2024, graduation_rate: 58, employment_rate: 78, median_starting_salary: 56000, median_mid_career_salary: 92000, avg_time_to_degree_months: 48, total_graduates: 280, employed_in_field_pct: 72, continuing_education_pct: 22, top_employers: ["Deloitte", "Ernst & Young", "KPMG"], top_job_titles: ["Staff Accountant", "Auditor"], data_source: "UTA / NACE" },
  { id: "uta-out-5", program_id: "uta-prog-6", outcome_year: 2024, graduation_rate: 55, employment_rate: 85, median_starting_salary: 65000, median_mid_career_salary: 110000, avg_time_to_degree_months: 48, total_graduates: 75, employed_in_field_pct: 76, continuing_education_pct: 16, top_employers: ["Amazon", "Deloitte", "Capital One"], top_job_titles: ["Data Analyst", "Data Scientist"], data_source: "UTA / NACE" },
  { id: "uta-out-6", program_id: "uta-prog-7", outcome_year: 2024, graduation_rate: 46, employment_rate: 81, median_starting_salary: 66000, median_mid_career_salary: 110000, avg_time_to_degree_months: 52, total_graduates: 85, employed_in_field_pct: 73, continuing_education_pct: 25, top_employers: ["Lockheed Martin", "Bell Textron", "Northrop Grumman"], top_job_titles: ["Aerospace Engineer", "Systems Engineer"], data_source: "UTA / NACE" },
  { id: "uta-out-7", program_id: "uta-prog-9", outcome_year: 2024, graduation_rate: 50, employment_rate: 84, median_starting_salary: 67500, median_mid_career_salary: 118000, avg_time_to_degree_months: 48, total_graduates: 95, employed_in_field_pct: 78, continuing_education_pct: 15, top_employers: ["Amazon", "Microsoft", "Lockheed Martin"], top_job_titles: ["Software Engineer", "Full Stack Developer"], data_source: "UTA / NACE" },
];

const MOCK_EMPLOYERS = [
  { id: "arl-emp-1", company_name: "General Motors Arlington Assembly", industry: "Automotive Manufacturing", naics_code: "336111", employee_count: 5200, employee_range: "5000+", city: "Arlington", state: "TX", zip_code: "76011", is_fortune_500: true, is_headquartered_locally: false, website_url: "https://www.gm.com", description: "Full-size SUV assembly plant", year_established: 1954, hires_uta_grads: true },
  { id: "arl-emp-2", company_name: "Texas Health Resources", industry: "Healthcare", naics_code: "622110", employee_count: 29000, employee_range: "5000+", city: "Arlington", state: "TX", zip_code: "76012", is_fortune_500: false, is_headquartered_locally: true, website_url: "https://www.texashealth.org", description: "Faith-based nonprofit health system", year_established: 1997, hires_uta_grads: true },
  { id: "arl-emp-3", company_name: "Arlington ISD", industry: "K-12 Education", naics_code: "611110", employee_count: 8400, employee_range: "5000+", city: "Arlington", state: "TX", zip_code: "76010", is_fortune_500: false, is_headquartered_locally: true, website_url: "https://www.aisd.net", description: "Second-largest school district in Tarrant County", year_established: 1902, hires_uta_grads: true },
  { id: "arl-emp-4", company_name: "D.R. Horton", industry: "Homebuilding", naics_code: "236115", employee_count: 3200, employee_range: "1000-4999", city: "Arlington", state: "TX", zip_code: "76006", is_fortune_500: true, is_headquartered_locally: true, website_url: "https://www.drhorton.com", description: "Americas largest homebuilder", year_established: 1978, hires_uta_grads: true },
  { id: "arl-emp-5", company_name: "Bell Textron", industry: "Aerospace & Defense", naics_code: "336411", employee_count: 7500, employee_range: "5000+", city: "Fort Worth", state: "TX", zip_code: "76101", is_fortune_500: false, is_headquartered_locally: true, website_url: "https://www.bellflight.com", description: "Helicopter and tiltrotor aircraft manufacturer", year_established: 1935, hires_uta_grads: true },
  { id: "arl-emp-6", company_name: "Lockheed Martin Aeronautics", industry: "Aerospace & Defense", naics_code: "336411", employee_count: 18000, employee_range: "5000+", city: "Fort Worth", state: "TX", zip_code: "76108", is_fortune_500: true, is_headquartered_locally: false, website_url: "https://www.lockheedmartin.com", description: "F-35 Lightning II production", year_established: 1995, hires_uta_grads: true },
];

const MOCK_JOB_OPENINGS = [
  { id: "arl-job-1", employer_id: "arl-emp-1", job_title: "Manufacturing Engineer", department: "Production Engineering", salary_min: 65000, salary_max: 85000, salary_type: "annual", education_required: "bachelor", experience_years_min: 0, required_skills: ["AutoCAD", "Lean Manufacturing", "Six Sigma"], preferred_skills: ["PLC Programming", "Robotics"], is_entry_level: true, is_internship: false, job_type: "full-time", remote_option: "on-site", openings_count: 5, posted_date: "2024-11-01", is_active: true },
  { id: "arl-job-2", employer_id: "arl-emp-2", job_title: "Registered Nurse - Med/Surg", department: "Nursing", salary_min: 62000, salary_max: 82000, salary_type: "annual", education_required: "bachelor", experience_years_min: 0, required_skills: ["Patient Assessment", "EMR", "NCLEX-RN"], preferred_skills: ["Epic EHR"], is_entry_level: true, is_internship: false, job_type: "full-time", remote_option: "on-site", openings_count: 30, posted_date: "2024-11-01", is_active: true },
  { id: "arl-job-3", employer_id: "arl-emp-5", job_title: "Aerospace Engineer", department: "Engineering", salary_min: 72000, salary_max: 95000, salary_type: "annual", education_required: "bachelor", experience_years_min: 0, required_skills: ["Aerodynamics", "MATLAB", "CAD/CAM", "FEA"], preferred_skills: ["Rotorcraft", "CATIA"], is_entry_level: true, is_internship: false, job_type: "full-time", remote_option: "on-site", openings_count: 8, posted_date: "2024-11-01", is_active: true },
  { id: "arl-job-4", employer_id: "arl-emp-6", job_title: "Systems Engineer", department: "Systems Engineering", salary_min: 75000, salary_max: 100000, salary_type: "annual", education_required: "bachelor", experience_years_min: 0, required_skills: ["Systems Engineering", "MATLAB", "Requirements Management"], preferred_skills: ["DOORS", "DoD Programs"], is_entry_level: true, is_internship: false, job_type: "full-time", remote_option: "on-site", openings_count: 12, posted_date: "2024-11-01", is_active: true },
];

const MOCK_DEVELOPMENT = [
  { id: "arl-dev-1", project_name: "GM Arlington Assembly Plant Modernization", project_type: "industrial", developer: "General Motors", investment_amount: 500000000, estimated_jobs: 200, status: "operational", location_description: "GM Assembly Plant, Arlington", start_year: 2019, completion_year: 2024, description: "$500M+ investment for next-gen SUV production.", industries_impacted: ["Automotive Manufacturing", "Robotics"] },
  { id: "arl-dev-2", project_name: "Globe Life Field", project_type: "commercial", developer: "City of Arlington / Texas Rangers", investment_amount: 1200000000, estimated_jobs: 5000, status: "operational", location_description: "Globe Life Field, Arlington", start_year: 2017, completion_year: 2020, description: "40,300-seat retractable roof baseball stadium.", industries_impacted: ["Entertainment", "Hospitality"] },
  { id: "arl-dev-3", project_name: "E-Space Global Headquarters", project_type: "commercial", developer: "E-Space", investment_amount: 50000000, estimated_jobs: 300, status: "operational", location_description: "E-Space HQ, Arlington", start_year: 2022, completion_year: 2024, description: "New global HQ for satellite constellation company.", industries_impacted: ["Aerospace & Defense", "Technology"] },
];

const MOCK_INDUSTRIES = [
  { id: "arl-ind-1", industry_name: "Healthcare & Social Assistance", naics_sector: "62", employment_count: 35000, avg_annual_wage: 58000, growth_rate: 4.2, location_quotient: 1.3, top_occupations: ["Registered Nurses", "Medical Assistants", "Physicians"], key_employers: ["Texas Health Resources", "Medical City Arlington", "JPS Health Network"], description: "Fastest-growing sector in Arlington-Fort Worth.", data_year: 2024, data_source: "BLS / TWC" },
  { id: "arl-ind-2", industry_name: "Aerospace & Defense", naics_sector: "3364", employment_count: 28000, avg_annual_wage: 95000, growth_rate: 3.5, location_quotient: 4.2, top_occupations: ["Aerospace Engineers", "Systems Engineers", "Software Engineers"], key_employers: ["Lockheed Martin", "Bell Textron", "L3Harris"], description: "DFW is a national center for aerospace and defense.", data_year: 2024, data_source: "BLS / TWC" },
  { id: "arl-ind-3", industry_name: "Technology & Software", naics_sector: "5112", employment_count: 5500, avg_annual_wage: 98000, growth_rate: 8.2, location_quotient: 0.7, top_occupations: ["Software Developers", "Data Scientists", "Cloud Engineers"], key_employers: ["Various Tech Companies", "GM Financial Tech", "E-Space"], description: "Growing technology sector with strong demand.", data_year: 2024, data_source: "BLS / TWC" },
  { id: "arl-ind-4", industry_name: "Automotive Manufacturing", naics_sector: "336", employment_count: 8500, avg_annual_wage: 72000, growth_rate: 2.1, location_quotient: 3.8, top_occupations: ["Assembly Workers", "Manufacturing Engineers", "Quality Engineers"], key_employers: ["General Motors Arlington Assembly", "Peterbilt Motors"], description: "Cornerstone of the local economy.", data_year: 2024, data_source: "BLS / TWC" },
];

const MOCK_PARTNERSHIPS = [
  { id: "arl-part-1", program_id: "uta-prog-1", employer_id: "arl-emp-6", partnership_type: "hiring_pipeline", avg_hires_per_year: 25, avg_intern_salary: 62000, description: "Lockheed Martin recruits heavily from UTA CS.", is_active: true },
  { id: "arl-part-2", program_id: "uta-prog-3", employer_id: "arl-emp-2", partnership_type: "hiring_pipeline", avg_hires_per_year: 45, avg_intern_salary: 58000, description: "Texas Health Resources is the #1 employer of UTA BSN grads.", is_active: true },
  { id: "arl-part-3", program_id: "uta-prog-2", employer_id: "arl-emp-5", partnership_type: "internship", avg_hires_per_year: 12, avg_intern_salary: 55000, description: "Bell hires UTA ME interns for rotorcraft design.", is_active: true },
  { id: "arl-part-4", program_id: "uta-prog-4", employer_id: "arl-emp-9", partnership_type: "hiring_pipeline", avg_hires_per_year: 12, avg_intern_salary: 52000, description: "Deloitte recruits from UTA accounting program.", is_active: true },
];

const MOCK_SKILLS = [
  { id: "sk-1", program_id: "uta-prog-1", industry_id: "arl-ind-3", skill_name: "Python", skill_category: "programming", program_teaches: true, industry_demands: true, demand_level: "high", gap_status: "aligned" },
  { id: "sk-2", program_id: "uta-prog-1", industry_id: "arl-ind-3", skill_name: "Cloud Computing (AWS/Azure)", skill_category: "infrastructure", program_teaches: false, industry_demands: true, demand_level: "high", gap_status: "gap" },
  { id: "sk-3", program_id: "uta-prog-3", industry_id: "arl-ind-1", skill_name: "Patient Assessment", skill_category: "clinical", program_teaches: true, industry_demands: true, demand_level: "critical", gap_status: "aligned" },
  { id: "sk-4", program_id: "uta-prog-1", industry_id: "arl-ind-3", skill_name: "Machine Learning", skill_category: "data_science", program_teaches: true, industry_demands: true, demand_level: "high", gap_status: "aligned" },
  { id: "sk-5", program_id: "uta-prog-2", industry_id: "arl-ind-2", skill_name: "CAD/CAM", skill_category: "engineering", program_teaches: true, industry_demands: true, demand_level: "high", gap_status: "aligned" },
];

const MOCK_LABOR_STATS = [
  { id: "arl-stat-1", metric_name: "Total Nonfarm Employment", metric_category: "employment", metric_value: 1212800, metric_unit: "count", geography: "Fort Worth-Arlington MD", time_period: "May 2025", data_source: "BLS CES", notes: "" },
  { id: "arl-stat-2", metric_name: "Unemployment Rate", metric_category: "employment", metric_value: 3.8, metric_unit: "percent", geography: "Fort Worth-Arlington MD", time_period: "Q4 2024", data_source: "BLS LAUS", notes: "" },
  { id: "arl-stat-3", metric_name: "Average Weekly Wages", metric_category: "wages", metric_value: 1501, metric_unit: "dollars", geography: "Tarrant County, TX", time_period: "Q3 2024", data_source: "BLS QCEW", notes: "" },
  { id: "arl-stat-4", metric_name: "UTA Total Enrollment", metric_category: "education", metric_value: 44956, metric_unit: "count", geography: "Arlington, TX", time_period: "Fall 2024", data_source: "UTA Institutional Research", notes: "" },
  { id: "arl-stat-5", metric_name: "UTA 6-Year Graduation Rate", metric_category: "education", metric_value: 54.0, metric_unit: "percent", geography: "Arlington, TX", time_period: "2024", data_source: "UTA Institutional Research", notes: "" },
  { id: "arl-stat-6", metric_name: "Median Household Income", metric_category: "wages", metric_value: 68500, metric_unit: "dollars", geography: "Arlington, TX", time_period: "2024", data_source: "Census ACS", notes: "" },
];

// Helper: cap results at 30 records
function truncateResults(data: unknown[], label: string) {
  if (data.length <= 30) return data;
  return {
    results: data.slice(0, 30),
    total_count: data.length,
    note: `Showing first 30 of ${data.length} ${label}. Ask me to narrow down if needed.`,
  };
}

function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL")!;
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  return createClient(url, key);
}

export async function queryColleges() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("uta_colleges")
    .select("*")
    .order("college_name");
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_COLLEGES;
  return truncateResults(results, "colleges");
}

export async function queryPrograms(args: { college_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_programs")
    .select("*, uta_colleges(college_name, abbreviation)")
    .eq("is_active", true)
    .order("program_name");
  if (args.college_id) query = query.eq("college_id", args.college_id);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PROGRAMS;
  return truncateResults(results, "programs");
}

export async function queryProgramOutcomes(args: { program_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_program_outcomes")
    .select("*, uta_programs(program_name, degree_type, degree_level)")
    .order("median_starting_salary", { ascending: false });
  if (args.program_id) query = query.eq("program_id", args.program_id);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PROGRAM_OUTCOMES;
  return truncateResults(results, "program outcomes");
}

export async function queryEmployers(args: { industry?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("arlington_employers")
    .select("*")
    .order("employee_count", { ascending: false });
  if (args.industry) query = query.ilike("industry", `%${args.industry}%`);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_EMPLOYERS;
  return truncateResults(results, "employers");
}

export async function queryJobOpenings(args: { employer_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("arlington_job_openings")
    .select("*, arlington_employers(company_name, industry)")
    .eq("is_active", true)
    .order("salary_max", { ascending: false });
  if (args.employer_id) query = query.eq("employer_id", args.employer_id);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_JOB_OPENINGS;
  return truncateResults(results, "job openings");
}

export async function queryDevelopment() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("arlington_development")
    .select("*")
    .order("estimated_jobs", { ascending: false });
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_DEVELOPMENT;
  return truncateResults(results, "development projects");
}

export async function queryIndustries() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("arlington_industries")
    .select("*")
    .order("employment_count", { ascending: false });
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_INDUSTRIES;
  return truncateResults(results, "industries");
}

export async function queryPartnerships(args: { program_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_employer_partnerships")
    .select("*, uta_programs(program_name, degree_type), arlington_employers(company_name, industry)")
    .eq("is_active", true)
    .order("avg_hires_per_year", { ascending: false });
  if (args.program_id) query = query.eq("program_id", args.program_id);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PARTNERSHIPS;
  return truncateResults(results, "partnerships");
}

export async function querySkillsAlignment(args: { program_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_skills_alignment")
    .select("*, uta_programs(program_name, degree_type), arlington_industries(industry_name)");
  if (args.program_id) query = query.eq("program_id", args.program_id);
  const { data, error } = await query.order("gap_status").order("demand_level", { ascending: false });
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_SKILLS;
  return truncateResults(results, "skills alignment records");
}

export async function queryLaborStats(args: { category?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("arlington_labor_stats")
    .select("*")
    .order("metric_category")
    .order("metric_name");
  if (args.category) query = query.eq("metric_category", args.category);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_LABOR_STATS;
  return truncateResults(results, "labor statistics");
}

// ============================================================================
// PREDICTIVE ANALYTICS QUERIES
// ============================================================================

const MOCK_PROGRAM_PREDICTIONS = [
  { program_name: "Computer Science", degree_type: "BS", college_name: "College of Engineering", overall_score: 88.5, employment_outlook_score: 92.0, salary_growth_score: 85.0, skills_alignment_score: 82.0, employer_demand_score: 90.0, industry_growth_score: 88.0, confidence_level: "high", median_starting_salary: 68300, employment_rate: 82 },
  { program_name: "Software Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 86.2, employment_outlook_score: 90.0, salary_growth_score: 84.0, skills_alignment_score: 80.0, employer_demand_score: 88.0, industry_growth_score: 85.0, confidence_level: "high", median_starting_salary: 67500, employment_rate: 84 },
  { program_name: "Nursing", degree_type: "BSN", college_name: "College of Nursing and Health Innovation", overall_score: 85.8, employment_outlook_score: 78.0, salary_growth_score: 82.0, skills_alignment_score: 95.0, employer_demand_score: 92.0, industry_growth_score: 80.0, confidence_level: "high", median_starting_salary: 70300, employment_rate: 93 },
  { program_name: "Data Science", degree_type: "BS", college_name: "College of Science", overall_score: 84.5, employment_outlook_score: 95.0, salary_growth_score: 88.0, skills_alignment_score: 78.0, employer_demand_score: 80.0, industry_growth_score: 85.0, confidence_level: "high", median_starting_salary: 65000, employment_rate: 85 },
  { program_name: "Aerospace Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 79.3, employment_outlook_score: 72.0, salary_growth_score: 78.0, skills_alignment_score: 75.0, employer_demand_score: 85.0, industry_growth_score: 82.0, confidence_level: "medium", median_starting_salary: 66000, employment_rate: 81 },
  { program_name: "Mechanical Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 72.8, employment_outlook_score: 60.0, salary_growth_score: 72.0, skills_alignment_score: 70.0, employer_demand_score: 78.0, industry_growth_score: 75.0, confidence_level: "medium", median_starting_salary: 64800, employment_rate: 78 },
  { program_name: "Finance", degree_type: "BBA", college_name: "College of Business", overall_score: 71.5, employment_outlook_score: 75.0, salary_growth_score: 70.0, skills_alignment_score: 65.0, employer_demand_score: 72.0, industry_growth_score: 68.0, confidence_level: "medium", median_starting_salary: 56000, employment_rate: 78 },
  { program_name: "Accounting", degree_type: "BBA", college_name: "College of Business", overall_score: 65.2, employment_outlook_score: 55.0, salary_growth_score: 60.0, skills_alignment_score: 68.0, employer_demand_score: 70.0, industry_growth_score: 62.0, confidence_level: "medium", median_starting_salary: 56000, employment_rate: 78 },
];

const MOCK_EMERGING_SKILLS = [
  { skill_name: "Generative AI / LLMs", skill_category: "ai_ml", job_posting_count: 290, posting_percentage: 9.5, avg_salary_with_skill: 144000 },
  { skill_name: "React/Next.js", skill_category: "programming", job_posting_count: 405, posting_percentage: 13.3, avg_salary_with_skill: 127000 },
  { skill_name: "Kubernetes", skill_category: "cloud_infrastructure", job_posting_count: 325, posting_percentage: 10.7, avg_salary_with_skill: 139000 },
  { skill_name: "Data Engineering (dbt/Spark)", skill_category: "data_science", job_posting_count: 248, posting_percentage: 8.1, avg_salary_with_skill: 138000 },
  { skill_name: "Terraform", skill_category: "devops", job_posting_count: 198, posting_percentage: 6.5, avg_salary_with_skill: 135000 },
  { skill_name: "Cybersecurity (Zero Trust)", skill_category: "cybersecurity", job_posting_count: 190, posting_percentage: 6.2, avg_salary_with_skill: 134000 },
  { skill_name: "Cloud Architecture (Multi-Cloud)", skill_category: "cloud_infrastructure", job_posting_count: 170, posting_percentage: 5.6, avg_salary_with_skill: 150000 },
  { skill_name: "Prompt Engineering", skill_category: "ai_ml", job_posting_count: 155, posting_percentage: 5.1, avg_salary_with_skill: 137000 },
];

const MOCK_DECLINING_SKILLS = [
  { skill_name: "jQuery", skill_category: "programming", description: "Legacy JavaScript library being replaced by modern frameworks" },
  { skill_name: "COBOL", skill_category: "programming", description: "Legacy mainframe language with shrinking demand" },
  { skill_name: "On-Premise Server Admin", skill_category: "cloud_infrastructure", description: "Being replaced by cloud infrastructure management" },
  { skill_name: "Manual QA Testing", skill_category: "other", description: "Being replaced by automated testing frameworks" },
  { skill_name: "Flash/ActionScript", skill_category: "programming", description: "Deprecated multimedia platform" },
];

const MOCK_EMPLOYER_PREDICTIONS = [
  { company_name: "Texas Health Resources", industry: "Healthcare", hiring_outlook: "rapidly_growing", projected_openings_6mo: 120, projected_openings_12mo: 250, industry_growth_rate: 4.2, confidence_level: "high", factors: { nursing_shortage: "Critical shortage driving aggressive hiring", telehealth: "Expanding virtual care positions" } },
  { company_name: "Lockheed Martin Aeronautics", industry: "Aerospace & Defense", hiring_outlook: "growing", projected_openings_6mo: 80, projected_openings_12mo: 160, industry_growth_rate: 3.5, confidence_level: "high", factors: { f35_production: "Sustained F-35 production ramp", software: "Digital transformation initiatives" } },
  { company_name: "Bell Textron", industry: "Aerospace & Defense", hiring_outlook: "growing", projected_openings_6mo: 55, projected_openings_12mo: 100, industry_growth_rate: 3.5, confidence_level: "high", factors: { v280_valor: "V-280 Valor FLRAA contract driving hiring" } },
  { company_name: "General Motors Arlington Assembly", industry: "Automotive Manufacturing", hiring_outlook: "stable", projected_openings_6mo: 45, projected_openings_12mo: 80, industry_growth_rate: 2.1, confidence_level: "medium", factors: { ev_transition: "Creating new roles in battery/electric systems" } },
  { company_name: "Arlington ISD", industry: "K-12 Education", hiring_outlook: "stable", projected_openings_6mo: 35, projected_openings_12mo: 65, industry_growth_rate: 1.5, confidence_level: "medium", factors: { turnover: "Teacher retention challenges" } },
  { company_name: "D.R. Horton", industry: "Homebuilding", hiring_outlook: "growing", projected_openings_6mo: 30, projected_openings_12mo: 55, industry_growth_rate: 3.8, confidence_level: "medium", factors: { housing_demand: "DFW population growth driving demand" } },
];

const MOCK_SALARY_PREDICTIONS = [
  { program_name: "Computer Science", degree_type: "BS", current_median_salary: 68300, year_1_projected: 72400, year_3_projected: 82500, year_5_projected: 95000, year_10_projected: 130000, annual_growth_rate: 4.8, confidence_level: "high" },
  { program_name: "Nursing", degree_type: "BSN", current_median_salary: 70300, year_1_projected: 73200, year_3_projected: 79800, year_5_projected: 86500, year_10_projected: 98000, annual_growth_rate: 3.2, confidence_level: "high" },
  { program_name: "Data Science", degree_type: "BS", current_median_salary: 65000, year_1_projected: 70200, year_3_projected: 83500, year_5_projected: 98000, year_10_projected: 135000, annual_growth_rate: 5.5, confidence_level: "high" },
  { program_name: "Software Engineering", degree_type: "BS", current_median_salary: 67500, year_1_projected: 71600, year_3_projected: 81500, year_5_projected: 93800, year_10_projected: 128000, annual_growth_rate: 4.7, confidence_level: "high" },
  { program_name: "Aerospace Engineering", degree_type: "BS", current_median_salary: 66000, year_1_projected: 69300, year_3_projected: 76800, year_5_projected: 85000, year_10_projected: 110000, annual_growth_rate: 3.8, confidence_level: "medium" },
  { program_name: "Mechanical Engineering", degree_type: "BS", current_median_salary: 64800, year_1_projected: 67500, year_3_projected: 74200, year_5_projected: 82000, year_10_projected: 105000, annual_growth_rate: 3.5, confidence_level: "medium" },
];

const MOCK_PREDICTIVE_SKILLS_GAP = [
  { program_name: "Computer Science", skill_name: "Generative AI / LLMs", gap_status: "gap", is_emerging: true, demand_level: "high", posting_percentage: 9.5 },
  { program_name: "Computer Science", skill_name: "Cloud Computing (AWS/Azure)", gap_status: "gap", is_emerging: false, demand_level: "high", posting_percentage: 15.2 },
  { program_name: "Computer Science", skill_name: "Kubernetes", gap_status: "gap", is_emerging: true, demand_level: "high", posting_percentage: 10.7 },
  { program_name: "Computer Science", skill_name: "Python", gap_status: "aligned", is_emerging: false, demand_level: "high", posting_percentage: 30.1 },
  { program_name: "Computer Science", skill_name: "Machine Learning", gap_status: "aligned", is_emerging: false, demand_level: "high", posting_percentage: 11.1 },
  { program_name: "Nursing", skill_name: "Telehealth Systems", gap_status: "gap", is_emerging: true, demand_level: "medium", posting_percentage: 3.2 },
  { program_name: "Nursing", skill_name: "Patient Assessment", gap_status: "aligned", is_emerging: false, demand_level: "critical", posting_percentage: 18.5 },
  { program_name: "Data Science", skill_name: "MLOps", gap_status: "gap", is_emerging: true, demand_level: "high", posting_percentage: 3.6 },
];

const MOCK_PROGRAM_COMPARISON = [
  { program_name: "Computer Science", degree_type: "BS", college_name: "College of Engineering", overall_score: 88.5, median_starting_salary: 68300, employment_rate: 82, year_5_projected: 95000, annual_growth_rate: 4.8, skills_aligned_count: 3, skills_gap_count: 2, active_partnerships: 2 },
  { program_name: "Data Science", degree_type: "BS", college_name: "College of Science", overall_score: 84.5, median_starting_salary: 65000, employment_rate: 85, year_5_projected: 98000, annual_growth_rate: 5.5, skills_aligned_count: 2, skills_gap_count: 3, active_partnerships: 1 },
  { program_name: "Software Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 86.2, median_starting_salary: 67500, employment_rate: 84, year_5_projected: 93800, annual_growth_rate: 4.7, skills_aligned_count: 3, skills_gap_count: 1, active_partnerships: 2 },
];

export async function queryProgramPredictions(args: { program_id?: string; min_score?: number }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("program_predictions")
    .select("*, uta_programs(program_name, degree_type, degree_level, is_stem, uta_colleges(college_name))")
    .order("overall_score", { ascending: false });
  if (args.program_id) query = query.eq("program_id", args.program_id);
  if (args.min_score) query = query.gte("overall_score", args.min_score);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PROGRAM_PREDICTIONS;
  return truncateResults(results, "program predictions");
}

export async function queryEmergingSkills(args: { category?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("skills_catalog")
    .select("*, skills_trend_snapshots(snapshot_date, job_posting_count, posting_percentage, avg_salary_with_skill)")
    .eq("is_emerging", true)
    .order("skill_name");
  if (args.category) query = query.eq("skill_category", args.category);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_EMERGING_SKILLS;
  return truncateResults(results, "emerging skills");
}

export async function queryDecliningSkills(args: { category?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("skills_catalog")
    .select("*")
    .eq("is_declining", true)
    .order("skill_name");
  if (args.category) query = query.eq("skill_category", args.category);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_DECLINING_SKILLS;
  return truncateResults(results, "declining skills");
}

export async function queryEmployerPredictions(args: { employer_id?: string; outlook?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("employer_predictions")
    .select("*, arlington_employers(company_name, industry, employee_count)")
    .order("projected_openings_12mo", { ascending: false });
  if (args.employer_id) query = query.eq("employer_id", args.employer_id);
  if (args.outlook) query = query.eq("hiring_outlook", args.outlook);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_EMPLOYER_PREDICTIONS;
  return truncateResults(results, "employer predictions");
}

export async function querySalaryPredictions(args: { program_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("salary_predictions")
    .select("*, uta_programs(program_name, degree_type, degree_level)")
    .order("annual_growth_rate", { ascending: false });
  if (args.program_id) query = query.eq("program_id", args.program_id);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_SALARY_PREDICTIONS;
  return truncateResults(results, "salary predictions");
}

export async function queryPredictiveSkillsGap(args: { program_id?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_skills_alignment")
    .select("*, uta_programs(program_name, degree_type), arlington_industries(industry_name)");
  if (args.program_id) query = query.eq("program_id", args.program_id);
  const { data: skills, error: skillsError } = await query;
  if (skillsError) throw skillsError;

  // Enrich with emerging skill data
  const { data: emerging } = await sb
    .from("skills_catalog")
    .select("skill_name, is_emerging, is_declining, skill_category")
    .or("is_emerging.eq.true,is_declining.eq.true");

  const emergingMap = new Map((emerging || []).map((s: { skill_name: string }) => [s.skill_name, s]));
  const enriched = (skills || []).map((s: { skill_name: string }) => ({
    ...s,
    emerging_info: emergingMap.get(s.skill_name) || null,
  }));

  const results = enriched.length > 0 ? enriched : MOCK_PREDICTIVE_SKILLS_GAP;
  return truncateResults(results, "predictive skills gap records");
}

// ============================================================================
// EXECUTIVE SUITE MOCK DATA
// ============================================================================

const MOCK_PROGRAM_SCORECARDS = [
  { program_name: "Computer Science", degree_type: "BS", college_name: "College of Engineering", overall_score: 88.5, health_status: "healthy", employment_rate: 82.0, median_salary: 68300, employer_demand_score: 90.0, skills_alignment_pct: 78.0, graduation_rate: 52.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Strong program with excellent employer demand. Consider adding cloud computing and GenAI coursework to close emerging skills gaps." },
  { program_name: "Nursing", degree_type: "BSN", college_name: "College of Nursing and Health Innovation", overall_score: 85.8, health_status: "healthy", employment_rate: 93.0, median_salary: 70300, employer_demand_score: 92.0, skills_alignment_pct: 95.0, graduation_rate: 72.0, credential_of_value: true, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Top-performing program with highest employment rate. Telehealth curriculum addition recommended." },
  { program_name: "Software Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 86.2, health_status: "healthy", employment_rate: 84.0, median_salary: 67500, employer_demand_score: 88.0, skills_alignment_pct: 80.0, graduation_rate: 50.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Growing demand from tech employers. DevOps and cloud-native development modules would strengthen outcomes." },
  { program_name: "Data Science", degree_type: "BS", college_name: "College of Science", overall_score: 84.5, health_status: "healthy", employment_rate: 85.0, median_salary: 65000, employer_demand_score: 80.0, skills_alignment_pct: 72.0, graduation_rate: 55.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Fastest-growing employer demand. MLOps and data engineering skills gap needs attention." },
  { program_name: "Aerospace Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 79.3, health_status: "watch", employment_rate: 81.0, median_salary: 66000, employer_demand_score: 85.0, skills_alignment_pct: 75.0, graduation_rate: 46.0, credential_of_value: true, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Strong local employer base but graduation rate needs improvement." },
  { program_name: "Accounting", degree_type: "BBA", college_name: "College of Business", overall_score: 65.2, health_status: "at_risk", employment_rate: 78.0, median_salary: 56000, employer_demand_score: 70.0, skills_alignment_pct: 68.0, graduation_rate: 58.0, credential_of_value: false, hb8_compliant: false, trend_direction: "declining", ai_recommendation: "Below HB8 wage threshold. Data analytics and forensic accounting modules needed." },
  { program_name: "Biology", degree_type: "BS", college_name: "College of Science", overall_score: 58.0, health_status: "at_risk", employment_rate: 62.0, median_salary: 42000, employer_demand_score: 55.0, skills_alignment_pct: 60.0, graduation_rate: 45.0, credential_of_value: false, hb8_compliant: false, trend_direction: "declining", ai_recommendation: "Low employment rate and below living wage. Biotech partnerships could improve outcomes." },
  { program_name: "Finance", degree_type: "BBA", college_name: "College of Business", overall_score: 71.5, health_status: "watch", employment_rate: 78.0, median_salary: 56000, employer_demand_score: 72.0, skills_alignment_pct: 65.0, graduation_rate: 58.0, credential_of_value: false, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Fintech and data analytics integration needed. CFA prep partnership could boost salary outcomes." },
];

const MOCK_COMPLIANCE_REPORTS = [
  { id: "cr-1", report_type: "hb8", program_name: "Computer Science BS", title: "HB8 Compliance Report - Computer Science BS (2024)", status: "approved", credential_value_pass: true, wage_threshold_pass: true, employment_threshold_pass: true, key_findings: ["Median starting salary $68,300 exceeds HB8 wage threshold", "Employment rate 82% above required 70%"], recommendations: ["Add cloud computing coursework"], created_at: "2024-12-01" },
  { id: "cr-2", report_type: "hb8", program_name: "Nursing BSN", title: "HB8 Compliance Report - Nursing BSN (2024)", status: "approved", credential_value_pass: true, wage_threshold_pass: true, employment_threshold_pass: true, key_findings: ["Highest employment rate at 93%", "Median salary $70,300 well above threshold"], recommendations: ["Explore telehealth certification"], created_at: "2024-12-01" },
  { id: "cr-3", report_type: "hb8", program_name: "Accounting BBA", title: "HB8 Compliance Report - Accounting BBA (2024)", status: "pending_review", credential_value_pass: false, wage_threshold_pass: false, employment_threshold_pass: true, key_findings: ["Median salary $56,000 below threshold", "CPA pass rate declining"], recommendations: ["Integrate data analytics", "Forensic accounting specialization"], created_at: "2024-11-15" },
  { id: "cr-4", report_type: "board_report", program_name: null, title: "Q4 2024 Board of Regents Report", status: "submitted", credential_value_pass: null, wage_threshold_pass: null, employment_threshold_pass: null, key_findings: ["4 of 9 programs meet credential-of-value standards", "2 programs flagged as at-risk"], recommendations: ["Allocate resources to at-risk programs"], created_at: "2024-12-15" },
  { id: "cr-5", report_type: "hb8", program_name: "Biology BS", title: "HB8 Compliance Report - Biology BS (2024)", status: "draft", credential_value_pass: false, wage_threshold_pass: false, employment_threshold_pass: false, key_findings: ["Employment rate 62% below threshold", "Median salary $42,000 significantly below threshold"], recommendations: ["Develop biotech partnerships", "Create BS-to-MS pathway"], created_at: "2024-11-01" },
];

const MOCK_SITE_SELECTION_PACKAGES = [
  { id: "ssp-1", company_name: "TechCorp Industries", industry: "Technology & Software", target_roles: ["Software Engineer", "Data Scientist", "Cloud Architect"], headcount_needed: 150, status: "complete", key_highlights: ["UTA produces 580+ CS/SE/DS graduates annually", "Competitive starting salaries $65-68K", "Arlington offers 30% lower office costs"] },
  { id: "ssp-2", company_name: "MedTech Solutions", industry: "Healthcare Technology", target_roles: ["Biomedical Engineer", "Data Analyst"], headcount_needed: 75, status: "delivered", key_highlights: ["UTA CONHI graduates 520+ nursing/health professionals annually", "Texas Health Resources partnership"] },
  { id: "ssp-3", company_name: "AeroVista Defense", industry: "Aerospace & Defense", target_roles: ["Systems Engineer", "Aerospace Engineer"], headcount_needed: 200, status: "draft", key_highlights: ["DFW has 28,000 aerospace workers", "Lockheed Martin and Bell provide talent pool"] },
  { id: "ssp-4", company_name: "DataFlow Analytics", industry: "Data & AI", target_roles: ["ML Engineer", "Data Engineer"], headcount_needed: 80, status: "complete", key_highlights: ["UTA Data Science program fastest-growing", "Strong GenAI/MLOps skills alignment"] },
];

const MOCK_EMPLOYER_ALERTS = [
  { id: "ea-1", company_name: "Texas Health Resources", signal_type: "hiring_surge", signal_strength: "strong", title: "30% increase in nursing postings", description: "Job postings for RN positions increased 30% month-over-month across all DFW facilities.", source: "Job posting analysis", is_acknowledged: false, detected_at: "2024-12-20" },
  { id: "ea-2", company_name: "General Motors Arlington Assembly", signal_type: "expansion", signal_strength: "strong", title: "EV transition creating new roles", description: "GM announcing $500M+ investment in electric vehicle production capabilities. Expected 200+ new technical positions.", source: "Press release", is_acknowledged: false, detected_at: "2024-12-17" },
  { id: "ea-3", company_name: "Lockheed Martin Aeronautics", signal_type: "hiring_surge", signal_strength: "moderate", title: "F-35 production ramp hiring", description: "Sustained hiring for software engineers and systems engineers. 80+ positions expected in next 6 months.", source: "Job posting analysis", is_acknowledged: false, detected_at: "2024-12-15" },
  { id: "ea-4", company_name: "Bell Textron", signal_type: "new_facility", signal_strength: "strong", title: "V-280 Valor FLRAA production facility", description: "Bell preparing new production line for V-280 Valor. DFW engineering expansion expected.", source: "Defense contract award", is_acknowledged: false, detected_at: "2024-12-12" },
  { id: "ea-5", company_name: "D.R. Horton", signal_type: "hiring_surge", signal_strength: "moderate", title: "Expanding DFW operations", description: "Homebuilder expanding project management and sales teams. 30+ positions posted.", source: "Job posting analysis", is_acknowledged: false, detected_at: "2024-12-19" },
  { id: "ea-6", company_name: "Arlington ISD", signal_type: "contraction", signal_strength: "weak", title: "Budget tightening signals", description: "District facing potential budget constraints. May slow non-essential hiring.", source: "School board meeting", is_acknowledged: false, detected_at: "2024-12-08" },
];

const MOCK_EMPLOYER_INTELLIGENCE = [
  { company_name: "Lockheed Martin Aeronautics", industry: "Aerospace & Defense", employee_count: 18000, active_postings: 45, recent_signals: ["F-35 production ramp hiring"], top_skills_needed: ["Systems Engineering", "MATLAB", "Software Development", "DoD Clearance"], uta_programs_aligned: ["Computer Science BS", "Software Engineering BS", "Aerospace Engineering BS"], annual_uta_hires: 25, partnership_types: ["hiring_pipeline", "internship", "advisory_board"] },
];

const MOCK_BOARD_REPORT = {
  report_title: "Q4 2024 Board of Regents Report - Program Performance",
  generated_at: "2024-12-22",
  summary: { total_programs_scored: 9, healthy_count: 4, watch_count: 2, at_risk_count: 2, critical_count: 0, avg_overall_score: 76.8, avg_employment_rate: 80.1, credential_of_value_count: 5 },
  top_performers: ["Computer Science BS (88.5)", "Software Engineering BS (86.2)", "Nursing BSN (85.8)"],
  at_risk_programs: ["Accounting BBA (65.2)", "Biology BS (58.0)"],
  key_recommendations: ["Allocate resources to at-risk programs", "Establish industry advisory boards", "Invest in career services expansion"],
};

const MOCK_TALENT_PIPELINE = [
  { program_name: "Computer Science BS", employer_name: "Lockheed Martin Aeronautics", partnership_type: "hiring_pipeline", annual_hires: 25, median_salary: 68300, employment_rate: 82 },
  { program_name: "Nursing BSN", employer_name: "Texas Health Resources", partnership_type: "hiring_pipeline", annual_hires: 45, median_salary: 70300, employment_rate: 93 },
  { program_name: "Mechanical Engineering BS", employer_name: "Bell Textron", partnership_type: "internship", annual_hires: 12, median_salary: 64800, employment_rate: 78 },
  { program_name: "Aerospace Engineering BS", employer_name: "Bell Textron", partnership_type: "hiring_pipeline", annual_hires: 10, median_salary: 66000, employment_rate: 81 },
  { program_name: "Data Science BS", employer_name: "Amazon", partnership_type: "hiring_pipeline", annual_hires: 8, median_salary: 65000, employment_rate: 85 },
];

const MOCK_CAREER_ADVISOR_STATS = {
  total_sessions: 142,
  avg_messages_per_session: 11.3,
  avg_satisfaction: 4.6,
  session_types: { career_exploration: 58, skill_assessment: 32, salary_negotiation: 22, interview_prep: 18, resume_review: 12 },
  top_programs_discussed: ["Computer Science", "Nursing", "Data Science", "Software Engineering", "Aerospace Engineering"],
  top_employers_discussed: ["Lockheed Martin", "Texas Health Resources", "Amazon", "Bell Textron", "GM Arlington"],
  top_tools_used: ["get_program_outcomes", "get_salary_forecast", "get_employers", "get_emerging_skills", "compare_programs"],
};

const MOCK_REGIONAL_COMPARISON = [
  { region: "Fort Worth-Arlington MD", metric: "Total Employment", value: 1212800, unit: "count" },
  { region: "Fort Worth-Arlington MD", metric: "Avg Weekly Wages", value: 1501, unit: "dollars" },
  { region: "Fort Worth-Arlington MD", metric: "Unemployment Rate", value: 3.8, unit: "percent" },
  { region: "Dallas-Plano-Irving MD", metric: "Total Employment", value: 2850000, unit: "count" },
  { region: "Dallas-Plano-Irving MD", metric: "Avg Weekly Wages", value: 1650, unit: "dollars" },
  { region: "Dallas-Plano-Irving MD", metric: "Unemployment Rate", value: 4.1, unit: "percent" },
  { region: "Austin-Round Rock MSA", metric: "Total Employment", value: 1180000, unit: "count" },
  { region: "Austin-Round Rock MSA", metric: "Avg Weekly Wages", value: 1580, unit: "dollars" },
  { region: "Austin-Round Rock MSA", metric: "Unemployment Rate", value: 3.5, unit: "percent" },
];

// ============================================================================
// EXECUTIVE SUITE QUERY FUNCTIONS
// ============================================================================

export async function queryProgramScorecards(args: { program_name?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("program_scorecards")
    .select("*, uta_programs(program_name, degree_type, degree_level, uta_colleges(college_name))")
    .order("overall_score", { ascending: false });
  if (args.program_name) {
    query = query.ilike("uta_programs.program_name", `%${args.program_name}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PROGRAM_SCORECARDS;
  return truncateResults(results, "program scorecards");
}

export async function queryAtRiskPrograms() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("program_scorecards")
    .select("*, uta_programs(program_name, degree_type, uta_colleges(college_name))")
    .in("health_status", ["critical", "at_risk"])
    .order("overall_score", { ascending: true });
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_PROGRAM_SCORECARDS.filter(s => s.health_status === "at_risk" || s.health_status === "critical");
  return truncateResults(results, "at-risk programs");
}

export async function queryCurriculumGaps(args: { program_name?: string }) {
  const sb = getSupabaseClient();

  // Get scorecards with low skills alignment
  let scQuery = sb
    .from("program_scorecards")
    .select("*, uta_programs(id, program_name, degree_type)")
    .lt("skills_alignment_pct", 80)
    .order("skills_alignment_pct", { ascending: true });
  const { data: scorecards } = await scQuery;

  // Get skills gaps
  const programIds = (scorecards || []).map((s: { uta_programs?: { id: string } }) => s.uta_programs?.id).filter(Boolean);
  let skillsQuery = sb
    .from("uta_skills_alignment")
    .select("*, uta_programs(program_name, degree_type), arlington_industries(industry_name)")
    .eq("gap_status", "gap")
    .order("demand_level", { ascending: false });
  if (programIds.length > 0) {
    skillsQuery = skillsQuery.in("program_id", programIds);
  }
  if (args.program_name) {
    skillsQuery = skillsQuery.ilike("uta_programs.program_name", `%${args.program_name}%`);
  }
  const { data: gaps } = await skillsQuery;

  const results = gaps && gaps.length > 0 ? gaps : MOCK_SKILLS.filter(s => s.gap_status === "gap");
  return truncateResults(results, "curriculum gaps");
}

export async function queryComplianceReport(args: { program_name?: string; report_type?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("compliance_reports")
    .select("*, uta_programs(program_name, degree_type)")
    .order("created_at", { ascending: false });
  if (args.report_type) query = query.eq("report_type", args.report_type);
  if (args.program_name) {
    query = query.ilike("uta_programs.program_name", `%${args.program_name}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_COMPLIANCE_REPORTS;
  return truncateResults(results, "compliance reports");
}

export async function queryComplianceStatus() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("compliance_reports")
    .select("id, report_type, title, status, credential_value_pass, wage_threshold_pass, employment_threshold_pass, created_at, uta_programs(program_name, degree_type)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_COMPLIANCE_REPORTS.map(r => ({ id: r.id, report_type: r.report_type, title: r.title, status: r.status, credential_value_pass: r.credential_value_pass, wage_threshold_pass: r.wage_threshold_pass, employment_threshold_pass: r.employment_threshold_pass, created_at: r.created_at }));
  return truncateResults(results, "compliance statuses");
}

export async function querySiteSelectionPackage(args: { company_name?: string; industry?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("site_selection_packages")
    .select("*")
    .order("created_at", { ascending: false });
  if (args.company_name) query = query.ilike("company_name", `%${args.company_name}%`);
  if (args.industry) query = query.ilike("industry", `%${args.industry}%`);
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_SITE_SELECTION_PACKAGES;
  return truncateResults(results, "site selection packages");
}

export async function queryRegionalComparison(args: { regions?: string[]; metric?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("arlington_labor_stats")
    .select("*")
    .order("geography")
    .order("metric_name");
  if (args.metric) query = query.ilike("metric_name", `%${args.metric}%`);
  if (args.regions && args.regions.length > 0) {
    // Filter by multiple geographies
    const conditions = args.regions.map(r => `geography.ilike.%${r}%`).join(",");
    query = query.or(conditions);
  }
  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_REGIONAL_COMPARISON;
  return truncateResults(results, "regional comparisons");
}

export async function queryEmployerAlerts(args: { signal_type?: string; employer_name?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("employer_monitoring")
    .select("*, arlington_employers(company_name, industry, employee_count)")
    .eq("is_acknowledged", false)
    .order("detected_at", { ascending: false });
  if (args.signal_type) query = query.eq("signal_type", args.signal_type);
  const { data, error } = await query;
  if (error) throw error;
  let results = data && data.length > 0 ? data : MOCK_EMPLOYER_ALERTS;
  if (args.employer_name) {
    results = (results as typeof MOCK_EMPLOYER_ALERTS).filter((a) => {
      const name = (a as { company_name?: string; arlington_employers?: { company_name?: string } }).company_name || (a as { arlington_employers?: { company_name?: string } }).arlington_employers?.company_name || "";
      return name.toLowerCase().includes(args.employer_name!.toLowerCase());
    });
  }
  return truncateResults(results, "employer alerts");
}

export async function queryEmployerIntelligence(args: { employer_name?: string; employer_id?: string }) {
  const sb = getSupabaseClient();

  // Get employer info
  let empQuery = sb.from("arlington_employers").select("*");
  if (args.employer_id) empQuery = empQuery.eq("id", args.employer_id);
  if (args.employer_name) empQuery = empQuery.ilike("company_name", `%${args.employer_name}%`);
  const { data: employers } = await empQuery.limit(1);

  if (!employers || employers.length === 0) {
    return MOCK_EMPLOYER_INTELLIGENCE;
  }

  const employer = employers[0];

  // Get job openings for this employer
  const { data: jobs } = await sb
    .from("arlington_job_openings")
    .select("*")
    .eq("employer_id", employer.id)
    .eq("is_active", true);

  // Get monitoring alerts
  const { data: alerts } = await sb
    .from("employer_monitoring")
    .select("*")
    .eq("employer_id", employer.id)
    .order("detected_at", { ascending: false })
    .limit(5);

  // Get partnerships
  const { data: partnerships } = await sb
    .from("uta_employer_partnerships")
    .select("*, uta_programs(program_name, degree_type)")
    .eq("employer_id", employer.id);

  return {
    employer,
    active_postings: jobs?.length || 0,
    job_openings: jobs || [],
    recent_signals: alerts || [],
    uta_partnerships: partnerships || [],
  };
}

export async function queryBoardReportData() {
  const sb = getSupabaseClient();

  // Get all scorecards
  const { data: scorecards } = await sb
    .from("program_scorecards")
    .select("*, uta_programs(program_name, degree_type, uta_colleges(college_name))")
    .order("overall_score", { ascending: false });

  if (!scorecards || scorecards.length === 0) {
    return MOCK_BOARD_REPORT;
  }

  const healthy = scorecards.filter((s: { health_status: string }) => s.health_status === "healthy");
  const watch = scorecards.filter((s: { health_status: string }) => s.health_status === "watch");
  const atRisk = scorecards.filter((s: { health_status: string }) => s.health_status === "at_risk");
  const critical = scorecards.filter((s: { health_status: string }) => s.health_status === "critical");
  const avgScore = scorecards.reduce((sum: number, s: { overall_score: number }) => sum + s.overall_score, 0) / scorecards.length;
  const avgEmployment = scorecards.reduce((sum: number, s: { employment_rate: number }) => sum + (s.employment_rate || 0), 0) / scorecards.length;
  const covCount = scorecards.filter((s: { credential_of_value: boolean }) => s.credential_of_value).length;

  return {
    report_title: "Board of Regents Report - Program Performance",
    generated_at: new Date().toISOString(),
    summary: {
      total_programs_scored: scorecards.length,
      healthy_count: healthy.length,
      watch_count: watch.length,
      at_risk_count: atRisk.length,
      critical_count: critical.length,
      avg_overall_score: Math.round(avgScore * 10) / 10,
      avg_employment_rate: Math.round(avgEmployment * 10) / 10,
      credential_of_value_count: covCount,
    },
    scorecards,
    top_performers: healthy.slice(0, 3),
    at_risk_programs: [...critical, ...atRisk],
    key_recommendations: [
      "Allocate additional resources to at-risk programs",
      "Establish industry advisory boards for each college",
      "Invest in career services expansion",
    ],
  };
}

export async function queryTalentPipeline(args: { program_name?: string; employer_name?: string }) {
  const sb = getSupabaseClient();
  let query = sb
    .from("uta_employer_partnerships")
    .select("*, uta_programs(program_name, degree_type, uta_colleges(college_name)), arlington_employers(company_name, industry, employee_count)")
    .eq("is_active", true)
    .order("avg_hires_per_year", { ascending: false });
  if (args.program_name) {
    query = query.ilike("uta_programs.program_name", `%${args.program_name}%`);
  }
  const { data, error } = await query;
  if (error) throw error;

  let results = data && data.length > 0 ? data : MOCK_TALENT_PIPELINE;
  if (args.employer_name) {
    results = (results as typeof MOCK_TALENT_PIPELINE).filter((r) => {
      const name = (r as { employer_name?: string; arlington_employers?: { company_name?: string } }).employer_name || (r as { arlington_employers?: { company_name?: string } }).arlington_employers?.company_name || "";
      return name.toLowerCase().includes(args.employer_name!.toLowerCase());
    });
  }
  return truncateResults(results, "talent pipeline records");
}

export async function queryCareerAdvisorStats() {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("career_advisor_sessions")
    .select("*")
    .order("started_at", { ascending: false });
  if (error) throw error;

  if (!data || data.length === 0) {
    return MOCK_CAREER_ADVISOR_STATS;
  }

  const sessions = data;
  const totalSessions = sessions.length;
  const avgMessages = sessions.reduce((s: number, sess: { messages_count: number }) => s + sess.messages_count, 0) / totalSessions;
  const ratedSessions = sessions.filter((s: { satisfaction_rating?: number }) => s.satisfaction_rating);
  const avgSatisfaction = ratedSessions.length > 0
    ? ratedSessions.reduce((s: number, sess: { satisfaction_rating: number }) => s + sess.satisfaction_rating, 0) / ratedSessions.length
    : 0;

  // Count session types
  const sessionTypes: Record<string, number> = {};
  sessions.forEach((s: { session_type: string }) => {
    sessionTypes[s.session_type] = (sessionTypes[s.session_type] || 0) + 1;
  });

  // Count program mentions
  const programCounts: Record<string, number> = {};
  sessions.forEach((s: { programs_discussed?: string[] }) => {
    (s.programs_discussed || []).forEach((p: string) => {
      programCounts[p] = (programCounts[p] || 0) + 1;
    });
  });

  return {
    total_sessions: totalSessions,
    avg_messages_per_session: Math.round(avgMessages * 10) / 10,
    avg_satisfaction: Math.round(avgSatisfaction * 10) / 10,
    session_types: sessionTypes,
    top_programs_discussed: Object.entries(programCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name]) => name),
    recent_sessions: sessions.slice(0, 5),
  };
}

export async function logCareerAdvisorSession(args: {
  student_id?: string;
  session_type?: string;
  messages_count?: number;
  tools_used?: string[];
  programs_discussed?: string[];
  employers_discussed?: string[];
  session_summary?: string;
}) {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("career_advisor_sessions")
    .insert({
      student_id: args.student_id || "anonymous",
      session_type: args.session_type || "general",
      messages_count: args.messages_count || 0,
      tools_used: args.tools_used || [],
      programs_discussed: args.programs_discussed || [],
      employers_discussed: args.employers_discussed || [],
      session_summary: args.session_summary || "",
      started_at: new Date().toISOString(),
    })
    .select();
  if (error) {
    return { logged: false, error: error.message };
  }
  return { logged: true, session: data?.[0] };
}

export async function queryProgramComparison(args: { program_ids: string[] }) {
  const sb = getSupabaseClient();
  const ids = args.program_ids;

  // Fetch programs with predictions, outcomes, and salary forecasts
  const { data: programs, error: progError } = await sb
    .from("uta_programs")
    .select("*, uta_colleges(college_name)")
    .in("id", ids);
  if (progError) throw progError;

  const { data: predictions } = await sb
    .from("program_predictions")
    .select("*")
    .in("program_id", ids);

  const { data: outcomes } = await sb
    .from("uta_program_outcomes")
    .select("*")
    .in("program_id", ids);

  const { data: salaries } = await sb
    .from("salary_predictions")
    .select("*")
    .in("program_id", ids);

  const predMap = new Map((predictions || []).map((p: { program_id: string }) => [p.program_id, p]));
  const outMap = new Map((outcomes || []).map((o: { program_id: string }) => [o.program_id, o]));
  const salMap = new Map((salaries || []).map((s: { program_id: string }) => [s.program_id, s]));

  const combined = (programs || []).map((p: { id: string }) => ({
    ...p,
    prediction: predMap.get(p.id) || null,
    outcomes: outMap.get(p.id) || null,
    salary_forecast: salMap.get(p.id) || null,
  }));

  const results = combined.length > 0 ? combined : MOCK_PROGRAM_COMPARISON;
  return truncateResults(results, "program comparisons");
}

// ============================================================================
// INTELLIGENCE PIPELINE MOCK DATA & QUERIES
// ============================================================================

const MOCK_INTELLIGENCE_ITEMS = [
  { id: "intel-1", title: "Texas HB8 Implementation Update: Credential of Value Standards Tighten", url: "https://example.com/hb8-update", source: "Texas Higher Ed Coordinator", source_category: "policy_regulatory", published_at: "2026-03-20T12:00:00Z", scraped_at: "2026-03-21T06:30:00Z", summary: "New HB8 guidelines raise the wage threshold for credential-of-value designation. Programs must now demonstrate median wages 10% above regional median within 1 year of graduation.", key_insight: "Universities should audit programs against the new threshold now — non-compliant programs face funding cuts starting FY2027.", relevance: "high", status: "reviewed", topic_tags: ["hb8", "compliance", "workforce"], audience_tags: ["universities", "workforce_boards"] },
  { id: "intel-2", title: "DFW Aerospace Sector Adds 2,400 Jobs in Q1 2026", url: "https://example.com/dfw-aerospace", source: "Dallas Business Journal", source_category: "local_dfw", published_at: "2026-03-18T09:00:00Z", scraped_at: "2026-03-19T06:30:00Z", summary: "The DFW aerospace and defense sector added 2,400 net new jobs in Q1 2026, driven primarily by Bell Textron's V-280 Valor production ramp and Lockheed Martin F-35 sustainment operations.", key_insight: "EDCs should prepare site selection packages targeting aerospace suppliers — the Tier 2/3 supplier ecosystem is the next growth wave.", relevance: "high", status: "reviewed", topic_tags: ["aerospace", "jobs", "dfw"], audience_tags: ["edcs", "workforce_boards"] },
  { id: "intel-3", title: "AI Literacy Requirements Expanding Across Texas Community Colleges", url: "https://example.com/ai-literacy", source: "Community College Daily", source_category: "higher_ed", published_at: "2026-03-15T14:00:00Z", scraped_at: "2026-03-16T06:30:00Z", summary: "Texas community colleges are adding AI literacy modules to general education requirements, with 12 institutions piloting programs in Fall 2026.", key_insight: "This creates partnership opportunities for workforce platforms that offer AI skills assessment and training pathway recommendations.", relevance: "medium", status: "reviewed", topic_tags: ["ai", "curriculum", "community_colleges"], audience_tags: ["universities", "consultants"] },
  { id: "intel-4", title: "Labor Department Releases Updated O*NET Skills Framework", url: "https://example.com/onet-update", source: "DOL Employment & Training", source_category: "federal_workforce", published_at: "2026-03-12T10:00:00Z", scraped_at: "2026-03-13T06:30:00Z", summary: "The Department of Labor updated the O*NET skills framework to include 47 new AI/ML-related competencies and revised 120+ existing occupation profiles.", key_insight: "Programs should map their curriculum against the updated O*NET framework — compliance reports will reference these new competencies starting Q3 2026.", relevance: "high", status: "new", topic_tags: ["skills", "onet", "federal"], audience_tags: ["universities", "workforce_boards"] },
  { id: "intel-5", title: "Arlington EDC Announces $40M Innovation District Plan", url: "https://example.com/arlington-innovation", source: "Fort Worth Star-Telegram", source_category: "local_dfw", published_at: "2026-03-10T08:00:00Z", scraped_at: "2026-03-11T06:30:00Z", summary: "The Arlington EDC unveiled plans for a $40M innovation district adjacent to UTA, targeting biotech and AI startups with subsidized lab and office space.", key_insight: "This creates a direct pipeline opportunity — UTA programs producing biotech and CS graduates will have immediate local employment pathways.", relevance: "high", status: "priority", topic_tags: ["arlington", "edc", "innovation"], audience_tags: ["edcs", "universities"] },
  { id: "intel-6", title: "Workforce Innovation Act Reauthorization Moves Forward", url: "https://example.com/wioa-reauth", source: "National Skills Coalition", source_category: "federal_workforce", published_at: "2026-03-08T11:00:00Z", scraped_at: "2026-03-09T06:30:00Z", summary: "The Senate committee advanced WIOA reauthorization with expanded funding for AI skills training and regional workforce partnerships.", key_insight: "TWC should prepare grant applications now — the new funding formula favors regions with documented AI skills gap data and employer partnership records.", relevance: "medium", status: "reviewed", topic_tags: ["wioa", "federal", "funding"], audience_tags: ["workforce_boards"] },
];

const MOCK_CONTENT_CALENDAR = [
  { id: "cc-1", platform: "linkedin", content_pillar: "thought_leadership", draft_text: "Texas just raised the bar on what counts as a 'credential of value.' Under updated HB8 guidelines, programs must demonstrate median wages 10% above regional median within 1 year of graduation.\n\nThis isn't just a compliance update — it's a signal. Universities that can't prove ROI will lose funding.\n\nAt zScale, we're helping institutions get ahead of this by scoring every program against live labor market data.\n\n#WorkforceDevelopment #HigherEd #HB8 #Texas", scheduled_date: "2026-03-24", status: "draft", intelligence_item_title: "Texas HB8 Implementation Update", topic_tags: ["hb8", "compliance"] },
  { id: "cc-2", platform: "linkedin", content_pillar: "market_intel", draft_text: "DFW aerospace just added 2,400 jobs in Q1 2026. Bell's V-280 Valor and Lockheed's F-35 programs are driving a talent surge.\n\nBut here's the real story: Tier 2/3 suppliers are now competing for the same engineers.\n\nEDCs that can package workforce data + talent pipeline = winning site selection pitches.\n\n#AerospaceDFW #EconomicDevelopment #WorkforceIntelligence", scheduled_date: "2026-03-25", status: "scheduled", intelligence_item_title: "DFW Aerospace Sector Adds 2,400 Jobs", topic_tags: ["aerospace", "dfw"] },
  { id: "cc-3", platform: "newsletter", content_pillar: "weekly_digest", draft_text: "This week in workforce intelligence: HB8 threshold changes, DFW aerospace boom, AI literacy in community colleges, and Arlington's new innovation district.", scheduled_date: "2026-03-28", status: "draft", intelligence_item_title: null, topic_tags: ["digest"] },
];

const MOCK_SPEAKING_OPPORTUNITIES = [
  // FREE / LOW-COST LOCAL (prioritized)
  { id: "sp-10", conference_name: "Rotary Club of Arlington", organizer: "Rotary International", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Arlington, TX", audience_size: 50, status: "researching", proposal_title: "How AI Is Transforming Workforce Development in Arlington", estimated_cost: 0, topic_tags: ["civic", "local", "ai"] },
  { id: "sp-11", conference_name: "Workforce Solutions Tarrant County Board Meeting", organizer: "Workforce Solutions Tarrant County", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Fort Worth, TX", audience_size: 30, status: "researching", proposal_title: "AI-Powered Workforce Intelligence for Regional Planning", estimated_cost: 0, topic_tags: ["workforce", "b2g"] },
  { id: "sp-12", conference_name: "Arlington EDC Board Meeting", organizer: "Arlington Economic Development Corp", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Arlington City Hall", audience_size: 20, status: "researching", proposal_title: "Workforce Data to Support Site Selection Decisions", estimated_cost: 0, topic_tags: ["edc", "local"] },
  { id: "sp-13", conference_name: "Global AI DFW Meetup at UTA", organizer: "Global AI Community", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "UTA SEIR Building, Arlington, TX", audience_size: 60, status: "researching", proposal_title: "Building an AI Agent for Workforce Intelligence with Claude and Supabase", estimated_cost: 0, topic_tags: ["ai", "tech", "uta"] },
  { id: "sp-14", conference_name: "AI Tinkerers DFW", organizer: "AI Tinkerers", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "DFW, TX", audience_size: 50, status: "researching", proposal_title: "Live Demo: AI Workforce Intelligence Agent", estimated_cost: 0, topic_tags: ["ai", "demo", "tech"] },
  { id: "sp-15", conference_name: "Cross Timbers APEX Accelerator GPC 2026", organizer: "UTA / APEX Accelerator", cfp_deadline: "2026-05-15", event_date_start: "2026-07-29", event_date_end: "2026-07-29", location: "UTA, Arlington, TX", audience_size: 200, status: "researching", proposal_title: "How AI and Data Analytics Can Win Government Contracts", estimated_cost: 50, topic_tags: ["govcon", "wosb", "uta"] },
  { id: "sp-16", conference_name: "TWC Texas Conference for Employers", organizer: "Texas Workforce Commission", cfp_deadline: "2026-04-30", event_date_start: null, event_date_end: null, location: "Dallas, TX", audience_size: 200, status: "researching", proposal_title: "AI-Powered Workforce Analytics for Employer Decision-Making", estimated_cost: 0, topic_tags: ["workforce", "employers"] },
  { id: "sp-17", conference_name: "DFW Startup Week 2026", organizer: "Launch DFW", cfp_deadline: "2026-05-30", event_date_start: "2026-08-17", event_date_end: "2026-08-21", location: "Dallas/Fort Worth, TX", audience_size: 2000, status: "researching", proposal_title: "B2G Startups: Selling AI to Government", estimated_cost: 0, topic_tags: ["startup", "b2g"] },
  { id: "sp-18", conference_name: "Higher Education Compliance Conference", organizer: "HCCA/SCCE", cfp_deadline: "2026-04-15", event_date_start: "2026-06-07", event_date_end: "2026-06-09", location: "San Antonio, TX", audience_size: 400, status: "researching", proposal_title: "HB8 Compliance Automation Through AI-Powered Program ROI Scoring", estimated_cost: 600, topic_tags: ["hb8", "compliance", "higher_ed"] },
  { id: "sp-19", conference_name: "TEDC Mid-Year Conference", organizer: "Texas Economic Development Council", cfp_deadline: "2026-04-30", event_date_start: "2026-06-17", event_date_end: "2026-06-19", location: "Plano, TX", audience_size: 300, status: "researching", proposal_title: "Real-Time Talent Pipeline Data for Site Selection", estimated_cost: 500, topic_tags: ["edc", "texas"] },
  // NATIONAL CONFERENCES (higher cost)
  { id: "sp-1", conference_name: "Texas Workforce Conference 2026", organizer: "Texas Workforce Commission", cfp_deadline: "2026-04-15", event_date_start: "2026-06-18", event_date_end: "2026-06-20", location: "Austin, TX", audience_size: 800, status: "drafting", proposal_title: "AI-Powered Workforce Intelligence: From Data Silos to Decision Engines", estimated_cost: 1200, topic_tags: ["workforce", "ai", "data"] },
  { id: "sp-2", conference_name: "NACUBO Annual Meeting", organizer: "National Association of College and University Business Officers", cfp_deadline: "2026-05-01", event_date_start: "2026-07-19", event_date_end: "2026-07-22", location: "Nashville, TN", audience_size: 2500, status: "researching", proposal_title: "Program ROI Scoring: A Data-Driven Approach to HB8 Compliance", estimated_cost: 2800, topic_tags: ["higher_ed", "roi", "compliance"] },
  { id: "sp-3", conference_name: "IEDC Annual Conference", organizer: "International Economic Development Council", cfp_deadline: "2026-06-01", event_date_start: "2026-09-14", event_date_end: "2026-09-17", location: "Denver, CO", audience_size: 1800, status: "researching", proposal_title: "Site Selection in the AI Era: Real-Time Talent Pipeline Data", estimated_cost: 3200, topic_tags: ["edc", "site_selection", "talent"] },
  { id: "sp-4", conference_name: "South by Southwest EDU", organizer: "SXSW", cfp_deadline: "2026-08-15", event_date_start: "2027-03-03", event_date_end: "2027-03-06", location: "Austin, TX", audience_size: 5000, status: "researching", proposal_title: null, estimated_cost: 1500, topic_tags: ["edtech", "innovation"] },
];

// --- Intelligence Query Functions ---

export async function queryIntelligenceItems(args: {
  topic?: string;
  audience?: string;
  source_category?: string;
  status?: string;
  relevance?: string;
  days_back?: number;
}) {
  const sb = getSupabaseClient();
  let query = sb
    .from("intelligence_items")
    .select("*")
    .order("scraped_at", { ascending: false })
    .limit(50);

  if (args.status) query = query.eq("status", args.status);
  if (args.relevance) query = query.eq("relevance", args.relevance);
  if (args.source_category) query = query.eq("source_category", args.source_category);
  if (args.topic) query = query.contains("topic_tags", [args.topic]);
  if (args.audience) query = query.contains("audience_tags", [args.audience]);
  if (args.days_back) {
    const since = new Date();
    since.setDate(since.getDate() - args.days_back);
    query = query.gte("scraped_at", since.toISOString());
  }

  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_INTELLIGENCE_ITEMS;
  return truncateResults(results, "intelligence items");
}

export async function queryContentCalendar(args: {
  platform?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
}) {
  const sb = getSupabaseClient();
  let query = sb
    .from("content_calendar")
    .select("*, intelligence_items(title)")
    .order("scheduled_date", { ascending: false })
    .limit(30);

  if (args.platform) query = query.eq("platform", args.platform);
  if (args.status) query = query.eq("status", args.status);
  if (args.date_from) query = query.gte("scheduled_date", args.date_from);
  if (args.date_to) query = query.lte("scheduled_date", args.date_to);

  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_CONTENT_CALENDAR;
  return truncateResults(results, "content calendar entries");
}

export async function querySpeakingOpportunities(args: {
  status?: string;
  upcoming_deadlines?: boolean;
}) {
  const sb = getSupabaseClient();
  let query = sb
    .from("speaking_opportunities")
    .select("*")
    .order("cfp_deadline", { ascending: true });

  if (args.status) query = query.eq("status", args.status);
  if (args.upcoming_deadlines) {
    query = query.gte("cfp_deadline", new Date().toISOString().split("T")[0]);
  }

  const { data, error } = await query;
  if (error) throw error;
  const results = data && data.length > 0 ? data : MOCK_SPEAKING_OPPORTUNITIES;
  return truncateResults(results, "speaking opportunities");
}

export async function draftLinkedInPost(args: { intelligence_item_id: string }) {
  const sb = getSupabaseClient();

  // Fetch the intelligence item
  const { data: item, error: fetchError } = await sb
    .from("intelligence_items")
    .select("*")
    .eq("id", args.intelligence_item_id)
    .single();

  if (fetchError || !item) {
    // Try mock data fallback
    const mockItem = MOCK_INTELLIGENCE_ITEMS.find(i => i.id === args.intelligence_item_id);
    if (!mockItem) return { error: "Intelligence item not found" };
    return {
      source_item: mockItem,
      instruction: "Generate a LinkedIn post based on this intelligence item. Keep under 1,300 characters. Use the founder's voice: data-driven, direct, actionable. Include 3-4 relevant hashtags. Then call update_content_status to save it.",
    };
  }

  return {
    source_item: item,
    instruction: "Generate a LinkedIn post based on this intelligence item. Keep under 1,300 characters. Use the founder's voice: data-driven, direct, actionable. Include 3-4 relevant hashtags. Then call update_content_status to save it.",
  };
}

export async function draftNewsletterBlurb(args: { intelligence_item_ids: string[] }) {
  const sb = getSupabaseClient();
  const { data, error } = await sb
    .from("intelligence_items")
    .select("*")
    .in("id", args.intelligence_item_ids);

  const items = data && data.length > 0
    ? data
    : MOCK_INTELLIGENCE_ITEMS.filter(i => args.intelligence_item_ids.includes(i.id));

  if (!items || items.length === 0) {
    return { error: "No intelligence items found for the given IDs" };
  }

  return {
    source_items: items,
    instruction: "Generate a newsletter digest summarizing these intelligence items. Use concise bullet points with key data. Professional tone. 300-500 words total.",
  };
}

export async function updateContentStatus(args: {
  id?: string;
  table: string;
  new_status: string;
  draft_text?: string;
  platform?: string;
  intelligence_item_id?: string;
  scheduled_date?: string;
}) {
  const sb = getSupabaseClient();
  const tableName = args.table === "content" ? "content_calendar"
    : args.table === "speaking" ? "speaking_opportunities"
    : args.table === "intelligence" ? "intelligence_items"
    : args.table;

  // If creating a new content calendar entry (no id)
  if (!args.id && tableName === "content_calendar" && args.draft_text) {
    const { data, error } = await sb
      .from("content_calendar")
      .insert({
        platform: args.platform || "linkedin",
        draft_text: args.draft_text,
        status: args.new_status || "draft",
        intelligence_item_id: args.intelligence_item_id || null,
        scheduled_date: args.scheduled_date || null,
      })
      .select();
    if (error) return { success: false, error: error.message };
    return { success: true, action: "created", entry: data?.[0] };
  }

  // Update existing entry
  if (!args.id) return { error: "id is required for updates" };

  const updateData: Record<string, unknown> = { status: args.new_status };
  if (args.draft_text) updateData.draft_text = args.draft_text;

  const { data, error } = await sb
    .from(tableName)
    .update(updateData)
    .eq("id", args.id)
    .select();

  if (error) return { success: false, error: error.message };
  return { success: true, action: "updated", entry: data?.[0] };
}
