import { useState, useEffect } from 'react'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, supabase } from '../../../lib/supabase'

const NAV_ITEMS = [
  { label: 'Overview', path: '/dashboard/twc', icon: '📊', category: 'Sponsorship Suite' },
  { label: 'Apprentice Manual', path: '/dashboard/twc/manual', icon: '📖', category: 'Sponsorship Suite' },
  { label: 'Work Process', path: '/dashboard/twc/work-process', icon: '⚙️', category: 'Sponsorship Suite' },
  { label: 'Wage Schedule', path: '/dashboard/twc/wages', icon: '💵', category: 'Sponsorship Suite' },
  { label: 'RTI Matcher', path: '/dashboard/twc/rti', icon: '🎓', category: 'Sponsorship Suite' },
  { label: 'Subsidies', path: '/dashboard/twc/subsidies', icon: '💰', category: 'Funding' },
  { label: 'Tax Credits', path: '/dashboard/twc/tax-credits', icon: '📋', category: 'Funding' },
  { label: 'Compliance', path: '/dashboard/twc/compliance', icon: '✅', category: 'Funding' },
]

const SUBSIDY_PROGRAMS = [
  {
    name: 'TWC Apprenticeship Grant',
    maxAmount: 5000,
    perApprentice: true,
    eligibility: 'Registered apprenticeship programs',
    status: 'active',
    deadline: 'Rolling',
  },
  {
    name: 'Skills Development Fund',
    maxAmount: 500000,
    perApprentice: false,
    eligibility: 'Texas businesses with training needs',
    status: 'active',
    deadline: 'Mar 31, 2026',
  },
  {
    name: 'Federal Tax Credit (WOTC)',
    maxAmount: 9600,
    perApprentice: true,
    eligibility: 'Hiring from target groups',
    status: 'active',
    deadline: 'Ongoing',
  },
  {
    name: 'State Apprenticeship Expansion',
    maxAmount: 2500,
    perApprentice: true,
    eligibility: 'New apprenticeship sponsors',
    status: 'upcoming',
    deadline: 'Apr 1, 2026',
  },
]

// RAPIDS occupation data with real codes
const RAPIDS_OCCUPATIONS = [
  { title: 'Electrician', rapids_code: '0159', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'Plumber', rapids_code: '0432', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'HVAC Technician', rapids_code: '0308', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'Welder', rapids_code: '0796', term_months: 36, rti_hours: 432, ojt_hours: 6000 },
  { title: 'CNC Machinist', rapids_code: '0492', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'Industrial Maintenance Mechanic', rapids_code: '0381', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'Carpenter', rapids_code: '0101', term_months: 48, rti_hours: 576, ojt_hours: 8000 },
  { title: 'Pipefitter', rapids_code: '0433', term_months: 60, rti_hours: 720, ojt_hours: 10000 },
]

interface CareerPathway {
  id: string
  occupation_title: string
  median_wage_annual: number
  local_employer_count: number
  local_job_openings: number
  time_to_credential_months: number
}

interface Institution {
  id: string
  name: string
  type: string
  city: string
  county_fips: string
}

export default function TWCDashboard() {
  const user = getStoredUser()
  const [apprenticeCount, setApprenticeCount] = useState(5)
  const [pathways, setPathways] = useState<CareerPathway[]>([])
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch data from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch career pathways for wage data
        let pathwaysQuery = supabase
          .from('career_pathways')
          .select('id, occupation_title, median_wage_annual, local_employer_count, local_job_openings, time_to_credential_months')
          .order('local_job_openings', { ascending: false })

        if (user?.countyFips) {
          pathwaysQuery = pathwaysQuery.eq('county_fips', user.countyFips)
        }

        const { data: pathwaysData, error: pathwaysError } = await pathwaysQuery.limit(10)
        if (pathwaysError) throw pathwaysError

        // Fetch local institutions for RTI matching
        let institutionsQuery = supabase
          .from('institutions')
          .select('id, name, type, city, county_fips')
          .eq('is_active', true)

        if (user?.countyFips) {
          institutionsQuery = institutionsQuery.eq('county_fips', user.countyFips)
        }

        const { data: institutionsData, error: institutionsError } = await institutionsQuery.limit(10)
        if (institutionsError) throw institutionsError

        setPathways(pathwaysData || [])
        setInstitutions(institutionsData || [])
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user?.countyFips])

  // Calculate estimated subsidies
  const estimatedSubsidies = apprenticeCount * 5000 + apprenticeCount * 9600

  // Calculate total local job openings
  const totalOpenings = pathways.reduce((sum, p) => sum + (p.local_job_openings || 0), 0)

  if (loading) {
    return (
      <DashboardLayout
        title="Apprenticeship Sponsorship Suite"
        subtitle="Build Your Workforce Pipeline"
        navItems={NAV_ITEMS}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading apprenticeship data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Apprenticeship Sponsorship Suite"
        subtitle="Build Your Workforce Pipeline"
        navItems={NAV_ITEMS}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-400 mb-2">Error loading data</p>
            <p className="text-neutral-500 text-sm">{error}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      title="Apprenticeship Sponsorship Suite"
      subtitle="Build Your Workforce Pipeline"
      navItems={NAV_ITEMS}
    >
      {/* Welcome & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 card-skeuomorphic rounded-2xl p-6">
          <h2 className="text-h3 text-white mb-2">
            Welcome, {user?.firstName}! 🏭
          </h2>
          <p className="text-body text-neutral-400 mb-4">
            Start or expand your registered apprenticeship program in {user?.countyName || 'your'} County.
            We've found <span className="text-accent font-semibold">{totalOpenings.toLocaleString()} job openings</span> and <span className="text-accent font-semibold">{institutions.length} training providers</span> in your area.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors">
              Start New Program
            </button>
            <button className="px-4 py-2.5 bg-ink-medium hover:bg-ink border border-ink-border hover:border-accent/30 text-white rounded-lg transition-colors">
              View Existing Programs
            </button>
          </div>
        </div>

        <div className="card-skeuomorphic rounded-2xl p-6 border-l-4 border-l-accent">
          <p className="text-neutral-500 text-sm mb-1">Potential Funding</p>
          <p className="text-3xl font-display font-bold text-accent">
            ${estimatedSubsidies.toLocaleString()}
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Based on {apprenticeCount} apprentices
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-neutral-500 text-xs">Adjust:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={apprenticeCount}
              onChange={(e) => setApprenticeCount(parseInt(e.target.value))}
              className="flex-1 accent-accent"
            />
            <span className="text-white text-sm w-6">{apprenticeCount}</span>
          </div>
        </div>
      </div>

      {/* Local Labor Market Snapshot */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Local Labor Market - Top Occupations</h3>
          <span className="text-caption text-neutral-500">{user?.countyName || 'Your'} County</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Occupation</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Median Wage</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Local Openings</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Employers</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Training Time</th>
              </tr>
            </thead>
            <tbody>
              {pathways.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No occupation data found for this county
                  </td>
                </tr>
              ) : (
                pathways.map((pathway) => (
                  <tr
                    key={pathway.id}
                    className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-white font-medium">{pathway.occupation_title}</p>
                    </td>
                    <td className="p-4 text-right">
                      <p className="text-accent font-mono">
                        ${pathway.median_wage_annual?.toLocaleString() || 'N/A'}
                      </p>
                    </td>
                    <td className="p-4 text-right text-green-400">
                      {pathway.local_job_openings?.toLocaleString() || 0}
                    </td>
                    <td className="p-4 text-right text-neutral-300">
                      {pathway.local_employer_count || 0}
                    </td>
                    <td className="p-4 text-right text-neutral-300">
                      {pathway.time_to_credential_months || 0} months
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Subsidies */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border">
          <h3 className="text-h4 text-white">Available Subsidies & Tax Credits</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Program</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Max Amount</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Eligibility</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Status</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {SUBSIDY_PROGRAMS.map((program, idx) => (
                <tr
                  key={idx}
                  className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="text-white font-medium">{program.name}</p>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-accent font-mono">
                      ${program.maxAmount.toLocaleString()}
                      {program.perApprentice && <span className="text-neutral-500 text-xs ml-1">/ea</span>}
                    </p>
                  </td>
                  <td className="p-4">
                    <p className="text-neutral-400 text-sm">{program.eligibility}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      program.status === 'active'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {program.status === 'active' ? '● Active' : '◐ Upcoming'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-neutral-400 text-sm">
                    {program.deadline}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Occupation Standards (RAPIDS) */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Occupation Standards (RAPIDS)</h3>
          <span className="text-caption text-neutral-500">DOL Registered</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Occupation</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">RAPIDS Code</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Term</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">RTI Hours</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">OJT Hours</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {RAPIDS_OCCUPATIONS.map((occ, idx) => (
                <tr
                  key={idx}
                  className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="text-white font-medium">{occ.title}</p>
                  </td>
                  <td className="p-4 text-center">
                    <span className="font-mono text-accent">{occ.rapids_code}</span>
                  </td>
                  <td className="p-4 text-center text-neutral-300">
                    {occ.term_months} months
                  </td>
                  <td className="p-4 text-center text-neutral-300">
                    {occ.rti_hours.toLocaleString()}
                  </td>
                  <td className="p-4 text-center text-neutral-300">
                    {occ.ojt_hours.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <button className="px-3 py-1.5 bg-accent/10 hover:bg-accent/20 text-accent text-xs rounded-lg transition-colors">
                      Generate Plan
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Local RTI Providers */}
      {institutions.length > 0 && (
        <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
          <div className="p-4 border-b border-ink-border flex items-center justify-between">
            <h3 className="text-h4 text-white">Local Training Providers (RTI)</h3>
            <span className="text-caption text-neutral-500">{institutions.length} found in {user?.countyName || 'your'} County</span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {institutions.map((inst) => (
              <div key={inst.id} className="bg-ink-medium rounded-xl p-4 border border-ink-border hover:border-accent/30 transition-colors">
                <p className="text-white font-medium mb-1">{inst.name}</p>
                <p className="text-neutral-500 text-sm">{inst.city}</p>
                <span className="inline-block mt-2 px-2 py-0.5 bg-accent/10 text-accent text-xs rounded capitalize">
                  {inst.type.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="card-skeuomorphic rounded-xl p-5 text-left hover:border-accent/30 transition-all group">
          <span className="text-2xl mb-2 block">📖</span>
          <p className="text-white font-medium group-hover:text-accent transition-colors">
            Apprentice Manual
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Auto-generate your program handbook
          </p>
        </button>
        <button className="card-skeuomorphic rounded-xl p-5 text-left hover:border-accent/30 transition-all group">
          <span className="text-2xl mb-2 block">⚙️</span>
          <p className="text-white font-medium group-hover:text-accent transition-colors">
            Work Process Schedule
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Build competency milestones
          </p>
        </button>
        <button className="card-skeuomorphic rounded-xl p-5 text-left hover:border-accent/30 transition-all group">
          <span className="text-2xl mb-2 block">🎓</span>
          <p className="text-white font-medium group-hover:text-accent transition-colors">
            RTI Provider Matcher
          </p>
          <p className="text-neutral-500 text-sm mt-1">
            Find classroom instruction partners
          </p>
        </button>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            Live data from Supabase
          </span>
          <span>Source: DOL RAPIDS, TWC</span>
        </div>
        <button className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
          Download Starter Kit
          <span>→</span>
        </button>
      </div>
    </DashboardLayout>
  )
}
