import { supabase } from './supabase'

// ============================================================================
// TYPES
// ============================================================================

export interface UTACollege {
  id: string
  college_name: string
  abbreviation: string
  dean_name: string
  enrollment: number
  website_url: string
  description: string
}

export interface UTAProgram {
  id: string
  college_id: string
  program_name: string
  degree_level: 'certificate' | 'associate' | 'bachelor' | 'master' | 'doctoral' | 'post-baccalaureate'
  degree_type: string
  cip_code: string
  is_stem: boolean
  is_online_available: boolean
  credit_hours: number
  description: string
  website_url: string
  is_active: boolean
  uta_colleges?: UTACollege
}

export interface UTAProgramOutcome {
  id: string
  program_id: string
  outcome_year: number
  graduation_rate: number
  employment_rate: number
  median_starting_salary: number
  median_mid_career_salary: number
  avg_time_to_degree_months: number
  total_graduates: number
  employed_in_field_pct: number
  continuing_education_pct: number
  top_employers: string[]
  top_job_titles: string[]
  data_source: string
  uta_programs?: UTAProgram
}

export interface ArlingtonEmployer {
  id: string
  company_name: string
  industry: string
  naics_code: string
  employee_count: number
  employee_range: string
  city: string
  state: string
  zip_code: string
  is_fortune_500: boolean
  is_headquartered_locally: boolean
  website_url: string
  description: string
  year_established: number
  hires_uta_grads: boolean
}

export interface ArlingtonJobOpening {
  id: string
  employer_id: string
  job_title: string
  department: string
  salary_min: number
  salary_max: number
  salary_type: 'annual' | 'hourly'
  education_required: string
  experience_years_min: number
  required_skills: string[]
  preferred_skills: string[]
  is_entry_level: boolean
  is_internship: boolean
  job_type: string
  remote_option: string
  openings_count: number
  posted_date: string
  is_active: boolean
  arlington_employers?: ArlingtonEmployer
}

export interface ArlingtonDevelopment {
  id: string
  project_name: string
  project_type: string
  developer: string
  investment_amount: number
  estimated_jobs: number
  status: string
  location_description: string
  start_year: number
  completion_year: number
  description: string
  industries_impacted: string[]
}

export interface ArlingtonIndustry {
  id: string
  industry_name: string
  naics_sector: string
  employment_count: number
  avg_annual_wage: number
  growth_rate: number
  location_quotient: number
  top_occupations: string[]
  key_employers: string[]
  description: string
  data_year: number
  data_source: string
}

export interface UTAEmployerPartnership {
  id: string
  program_id: string
  employer_id: string
  partnership_type: string
  avg_hires_per_year: number
  avg_intern_salary: number
  description: string
  is_active: boolean
  uta_programs?: UTAProgram
  arlington_employers?: ArlingtonEmployer
}

export interface UTASkillsAlignment {
  id: string
  program_id: string
  industry_id: string
  skill_name: string
  skill_category: string
  program_teaches: boolean
  industry_demands: boolean
  demand_level: string
  gap_status: 'aligned' | 'gap' | 'surplus'
  uta_programs?: UTAProgram
  arlington_industries?: ArlingtonIndustry
}

export interface ArlingtonLaborStat {
  id: string
  metric_name: string
  metric_category: string
  metric_value: number
  metric_unit: string
  geography: string
  time_period: string
  data_source: string
  notes: string
}

// ============================================================================
// QUERY FUNCTIONS
// ============================================================================

export async function getUTAColleges(): Promise<UTACollege[]> {
  const { data, error } = await supabase
    .from('uta_colleges')
    .select('*')
    .order('college_name')

  if (error) throw error
  return data || []
}

export async function getUTAPrograms(collegeId?: string): Promise<UTAProgram[]> {
  let query = supabase
    .from('uta_programs')
    .select('*, uta_colleges(college_name, abbreviation)')
    .eq('is_active', true)
    .order('program_name')

  if (collegeId) {
    query = query.eq('college_id', collegeId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getUTAProgramOutcomes(programId?: string): Promise<UTAProgramOutcome[]> {
  let query = supabase
    .from('uta_program_outcomes')
    .select('*, uta_programs(program_name, degree_type, degree_level)')
    .order('median_starting_salary', { ascending: false })

  if (programId) {
    query = query.eq('program_id', programId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getArlingtonEmployers(industry?: string): Promise<ArlingtonEmployer[]> {
  let query = supabase
    .from('arlington_employers')
    .select('*')
    .order('employee_count', { ascending: false })

  if (industry) {
    query = query.eq('industry', industry)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getArlingtonJobOpenings(employerId?: string): Promise<ArlingtonJobOpening[]> {
  let query = supabase
    .from('arlington_job_openings')
    .select('*, arlington_employers(company_name, industry)')
    .eq('is_active', true)
    .order('salary_max', { ascending: false })

  if (employerId) {
    query = query.eq('employer_id', employerId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getArlingtonDevelopment(): Promise<ArlingtonDevelopment[]> {
  const { data, error } = await supabase
    .from('arlington_development')
    .select('*')
    .order('estimated_jobs', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getArlingtonIndustries(): Promise<ArlingtonIndustry[]> {
  const { data, error } = await supabase
    .from('arlington_industries')
    .select('*')
    .order('employment_count', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getUTAEmployerPartnerships(programId?: string): Promise<UTAEmployerPartnership[]> {
  let query = supabase
    .from('uta_employer_partnerships')
    .select('*, uta_programs(program_name, degree_type), arlington_employers(company_name, industry)')
    .eq('is_active', true)
    .order('avg_hires_per_year', { ascending: false })

  if (programId) {
    query = query.eq('program_id', programId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function getUTASkillsAlignment(programId?: string): Promise<UTASkillsAlignment[]> {
  let query = supabase
    .from('uta_skills_alignment')
    .select('*, uta_programs(program_name, degree_type), arlington_industries(industry_name)')

  if (programId) {
    query = query.eq('program_id', programId)
  }

  const { data, error } = await query.order('gap_status').order('demand_level', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getArlingtonLaborStats(category?: string): Promise<ArlingtonLaborStat[]> {
  let query = supabase
    .from('arlington_labor_stats')
    .select('*')
    .order('metric_category')
    .order('metric_name')

  if (category) {
    query = query.eq('metric_category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// ============================================================================
// DASHBOARD SUMMARY (aggregated view)
// ============================================================================

export async function getUTADashboardSummary() {
  const [colleges, programs, outcomes, employers, jobs, development, industries, partnerships, laborStats] =
    await Promise.all([
      getUTAColleges(),
      getUTAPrograms(),
      getUTAProgramOutcomes(),
      getArlingtonEmployers(),
      getArlingtonJobOpenings(),
      getArlingtonDevelopment(),
      getArlingtonIndustries(),
      getUTAEmployerPartnerships(),
      getArlingtonLaborStats(),
    ])

  return {
    colleges,
    programs,
    outcomes,
    employers,
    jobs,
    development,
    industries,
    partnerships,
    laborStats,
    summary: {
      totalColleges: colleges.length,
      totalPrograms: programs.length,
      totalEmployers: employers.length,
      totalJobOpenings: jobs.reduce((sum, j) => sum + j.openings_count, 0),
      totalPartnerships: partnerships.length,
      activeDevelopmentProjects: development.filter(d => d.status === 'under_construction' || d.status === 'operational').length,
      totalEstimatedNewJobs: development.reduce((sum, d) => sum + (d.estimated_jobs || 0), 0),
    },
  }
}
