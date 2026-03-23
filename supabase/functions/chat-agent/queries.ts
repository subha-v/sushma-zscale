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
