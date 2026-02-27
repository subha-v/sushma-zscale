import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// TYPES
// ============================================================================

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'college' | 'edc' | 'student' | 'twc'
  subRole: string
  countyFips: string
  countyName: string
  region: string
}

export interface Business {
  id: string
  company_name: string
  county_fips: string
  naics_code: string
  company_size: string
  employee_count: number
  city: string
  structural_risk_score: number
  open_positions: number
}

export interface CareerPathway {
  id: string
  county_fips: string
  onet_soc_code: string
  occupation_title: string
  entry_wage_annual: number
  median_wage_annual: number
  time_to_credential_months: number
  local_employer_count: number
  local_job_openings: number
  growth_rate: number
  key_skills: string[]
}

// ============================================================================
// DEMO LOGIN
// ============================================================================

export async function demoLogin(demoToken: string): Promise<{ user: User }> {
  // Find demo user by token
  const { data: user, error } = await supabase
    .from('users')
    .select(`
      *,
      texas_counties!primary_county_fips (
        county_name,
        region
      )
    `)
    .eq('demo_token', demoToken)
    .eq('is_demo_account', true)
    .single()

  if (error || !user) {
    console.error('Demo login error:', error)
    throw new Error('Invalid demo token')
  }

  // Update access tracking
  await supabase
    .from('users')
    .update({
      demo_access_count: (user.demo_access_count || 0) + 1,
      demo_last_accessed_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    })
    .eq('id', user.id)

  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role,
      subRole: user.sub_role || '',
      countyFips: user.primary_county_fips || '',
      countyName: user.texas_counties?.county_name || '',
      region: user.texas_counties?.region || ''
    }
  }
}

// ============================================================================
// DATA FETCHING
// ============================================================================

export async function getBusinessesByCounty(countyFips: string): Promise<Business[]> {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('county_fips', countyFips)
    .order('company_name')

  if (error) throw error
  return data || []
}

export async function getCareerPathways(countyFips: string): Promise<CareerPathway[]> {
  const { data, error } = await supabase
    .from('career_pathways')
    .select('*')
    .eq('county_fips', countyFips)
    .order('median_wage_annual', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getAcademicPrograms(countyFips?: string) {
  const { data, error } = await supabase
    .from('academic_programs')
    .select('*, institutions(name, county_fips)')
    .eq('is_active', true)
    .order('program_name')

  if (error) throw error
  return data || []
}

export async function getReportsByRole(role: string) {
  const { data, error } = await supabase
    .from('report_definitions')
    .select('*')
    .contains('role_access', [role])
    .eq('is_active', true)

  if (error) throw error
  return data || []
}

export async function getCountyInfo(countyFips: string) {
  const { data, error } = await supabase
    .from('texas_counties')
    .select('*')
    .eq('fips_code', countyFips)
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// USER STORAGE (localStorage)
// ============================================================================

const USER_STORAGE_KEY = 'zscale_user'

export function storeUser(user: User): void {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export function getStoredUser(): User | null {
  const stored = localStorage.getItem(USER_STORAGE_KEY)
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_STORAGE_KEY)
}

export function isLoggedIn(): boolean {
  return getStoredUser() !== null
}
