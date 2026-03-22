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

// Demo user accounts for login identity (required for dashboard navigation)
const DEMO_USERS: Record<string, User> = {
  'DEMO-COLLEGE-DEAN-2024': {
    id: 'demo-college-dean',
    email: 'dean@demo.zscale.com',
    firstName: 'Dr. Sarah',
    lastName: 'Mitchell',
    role: 'college',
    subRole: 'Dean',
    countyFips: '48113',
    countyName: 'Dallas',
    region: 'North Texas'
  },
  'DEMO-COLLEGE-FACULTY-2024': {
    id: 'demo-college-faculty',
    email: 'faculty@demo.zscale.com',
    firstName: 'Prof. James',
    lastName: 'Chen',
    role: 'college',
    subRole: 'Faculty',
    countyFips: '48085',
    countyName: 'Collin',
    region: 'North Texas'
  },
  'DEMO-COLLEGE-REGISTRAR-2024': {
    id: 'demo-college-registrar',
    email: 'registrar@demo.zscale.com',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    role: 'college',
    subRole: 'Registrar',
    countyFips: '48439',
    countyName: 'Tarrant',
    region: 'North Texas'
  },
  'DEMO-EDC-DIRECTOR-2024': {
    id: 'demo-edc-director',
    email: 'director@demo.zscale.com',
    firstName: 'Michael',
    lastName: 'Thompson',
    role: 'edc',
    subRole: 'Director',
    countyFips: '48113',
    countyName: 'Dallas',
    region: 'North Texas'
  },
  'DEMO-EDC-ANALYST-2024': {
    id: 'demo-edc-analyst',
    email: 'analyst@demo.zscale.com',
    firstName: 'Emily',
    lastName: 'Park',
    role: 'edc',
    subRole: 'Analyst',
    countyFips: '48085',
    countyName: 'Collin',
    region: 'North Texas'
  },
  'DEMO-STUDENT-COUNSELOR-2024': {
    id: 'demo-student-counselor',
    email: 'counselor@demo.zscale.com',
    firstName: 'Lisa',
    lastName: 'Washington',
    role: 'student',
    subRole: 'Counselor',
    countyFips: '48121',
    countyName: 'Denton',
    region: 'North Texas'
  },
  'DEMO-STUDENT-STUDENT-2024': {
    id: 'demo-student-student',
    email: 'student@demo.zscale.com',
    firstName: 'Alex',
    lastName: 'Rivera',
    role: 'student',
    subRole: 'Student',
    countyFips: '48113',
    countyName: 'Dallas',
    region: 'North Texas'
  },
  'DEMO-TWC-OWNER-2024': {
    id: 'demo-twc-owner',
    email: 'owner@demo.zscale.com',
    firstName: 'Robert',
    lastName: 'Hayes',
    role: 'twc',
    subRole: 'Business Owner',
    countyFips: '48439',
    countyName: 'Tarrant',
    region: 'North Texas'
  },
  'DEMO-TWC-HR-2024': {
    id: 'demo-twc-hr',
    email: 'hr@demo.zscale.com',
    firstName: 'Jennifer',
    lastName: 'Kumar',
    role: 'twc',
    subRole: 'HR Director',
    countyFips: '48113',
    countyName: 'Dallas',
    region: 'North Texas'
  }
}

export async function demoLogin(demoToken: string): Promise<{ user: User }> {
  // Try Supabase first for live user records
  try {
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

    if (!error && user) {
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
  } catch (err) {
    console.warn('Supabase demo login unavailable, using local identity:', err)
  }

  // Use local demo identity for login navigation
  const localUser = DEMO_USERS[demoToken]
  if (!localUser) {
    throw new Error('Invalid demo token')
  }

  return { user: localUser }
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

export async function getAcademicPrograms(_countyFips?: string) {
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
