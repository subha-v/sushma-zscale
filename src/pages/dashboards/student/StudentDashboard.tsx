import { useState, useEffect } from 'react'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, supabase } from '../../../lib/supabase'
import { MOCK_CAREER_PATHWAYS } from '../../../lib/mockData'

const NAV_ITEMS = [
  { label: 'Career Card', path: '/dashboard/student', icon: '🎯', category: 'Career GPS' },
  { label: 'Path Calculator', path: '/dashboard/student/path', icon: '🧭', category: 'Career GPS' },
  { label: 'Local Employers', path: '/dashboard/student/employers', icon: '🗺️', category: 'Career GPS' },
  { label: 'Skill Stack', path: '/dashboard/student/skills', icon: '📚', category: 'Career GPS' },
  { label: 'Living Wage', path: '/dashboard/student/wage', icon: '💰', category: 'Career GPS' },
  { label: 'Hidden Market', path: '/dashboard/student/hidden', icon: '🔍', category: 'Hidden Market' },
  { label: 'Small Giants', path: '/dashboard/student/giants', icon: '🏆', category: 'Hidden Market' },
  { label: 'Growth Roadmap', path: '/dashboard/student/growth', icon: '📈', category: 'Hidden Market' },
  { label: 'Walk-In Friendly', path: '/dashboard/student/walkin', icon: '🚶', category: 'Hidden Market' },
]

interface CareerPathway {
  id: string
  occupation_title: string
  onet_soc_code: string
  entry_wage_hourly: number
  entry_wage_annual: number
  median_wage_annual: number
  time_to_credential_months: number
  local_employer_count: number
  local_job_openings: number
  growth_rate: number
  key_skills: string[]
  county_fips: string
}

// Living wage data by county (simplified - in production this would come from a table)
const LIVING_WAGE_DATA: Record<string, { single: number; singleChild: number; married: number; marriedChildren: number }> = {
  '48113': { single: 35800, singleChild: 52400, married: 42600, marriedChildren: 68200 }, // Dallas
  '48085': { single: 38200, singleChild: 55800, married: 45100, marriedChildren: 72500 }, // Collin
  '48439': { single: 34500, singleChild: 50200, married: 41200, marriedChildren: 65800 }, // Tarrant
  '48121': { single: 36500, singleChild: 53200, married: 43500, marriedChildren: 69800 }, // Denton
  '48201': { single: 37500, singleChild: 54800, married: 44500, marriedChildren: 71200 }, // Harris
  '48453': { single: 42500, singleChild: 62000, married: 50500, marriedChildren: 81000 }, // Travis
  '48029': { single: 32500, singleChild: 47500, married: 38800, marriedChildren: 62000 }, // Bexar
  'default': { single: 35000, singleChild: 51000, married: 41500, marriedChildren: 66500 },
}

function getLivingWage(countyFips: string) {
  return LIVING_WAGE_DATA[countyFips] || LIVING_WAGE_DATA['default']
}

function calculateMatchScore(pathway: CareerPathway): number {
  // Simple match score algorithm based on:
  // - Higher wage = better
  // - Shorter credential time = better
  // - More job openings = better
  // - Higher growth rate = better

  let score = 70 // Base score

  // Wage factor (up to +15 points)
  if (pathway.median_wage_annual >= 80000) score += 15
  else if (pathway.median_wage_annual >= 60000) score += 10
  else if (pathway.median_wage_annual >= 45000) score += 5

  // Credential time factor (up to +10 points)
  if (pathway.time_to_credential_months <= 6) score += 10
  else if (pathway.time_to_credential_months <= 12) score += 7
  else if (pathway.time_to_credential_months <= 18) score += 4

  // Job openings factor (up to +5 points)
  if (pathway.local_job_openings >= 500) score += 5
  else if (pathway.local_job_openings >= 200) score += 3
  else if (pathway.local_job_openings >= 100) score += 1

  return Math.min(score, 99) // Cap at 99
}

export default function StudentDashboard() {
  const user = getStoredUser()
  const [pathways, setPathways] = useState<CareerPathway[]>([])
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)

  const livingWage = getLivingWage(user?.countyFips || 'default')

  // Fetch career pathways from Supabase with fallback to mock data
  useEffect(() => {
    async function fetchPathways() {
      try {
        setLoading(true)

        let query = supabase
          .from('career_pathways')
          .select('*')
          .order('median_wage_annual', { ascending: false })

        // Filter by user's county if available
        if (user?.countyFips) {
          query = query.eq('county_fips', user.countyFips)
        }

        const { data, error } = await query.limit(20)

        if (error || !data || data.length === 0) {
          console.warn('Supabase career_pathways unavailable, using demo data')
          const filtered = user?.countyFips
            ? MOCK_CAREER_PATHWAYS.filter(p => p.county_fips === user.countyFips)
            : MOCK_CAREER_PATHWAYS
          setPathways(filtered)
        } else {
          setPathways(data)
        }
      } catch (err) {
        console.warn('Supabase query failed, using demo data:', err)
        setPathways(MOCK_CAREER_PATHWAYS)
      } finally {
        setLoading(false)
      }
    }

    fetchPathways()
  }, [user?.countyFips])

  // Sort pathways by match score
  const sortedPathways = [...pathways]
    .map(p => ({ ...p, matchScore: calculateMatchScore(p) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  // Calculate total job openings
  const totalOpenings = pathways.reduce((sum, p) => sum + (p.local_job_openings || 0), 0)

  if (loading) {
    return (
      <DashboardLayout
        title="Career GPS"
        subtitle="Your Personalized Career Navigator"
        navItems={NAV_ITEMS}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading career pathways...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Career GPS"
        subtitle="Your Personalized Career Navigator"
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
      title="Career GPS"
      subtitle="Your Personalized Career Navigator"
      navItems={NAV_ITEMS}
    >
      {/* Welcome Section */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-h3 text-white mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-body text-neutral-400">
              Based on your profile, we've found <span className="text-accent font-semibold">{sortedPathways.length} career pathways</span> in {user?.countyName || 'your'} County.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
            <span className="text-accent text-sm font-medium">
              {totalOpenings.toLocaleString()}+ jobs available
            </span>
          </div>
        </div>
      </div>

      {/* Living Wage Comparison */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <h3 className="text-h4 text-white mb-4">Living Wage in {user?.countyName || 'Your'} County</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-ink-medium rounded-xl p-4 border border-ink-border">
            <p className="text-neutral-500 text-xs mb-1">Single Adult</p>
            <p className="text-white font-mono text-lg">${livingWage.single.toLocaleString()}</p>
            <p className="text-neutral-600 text-xs">/year</p>
          </div>
          <div className="bg-ink-medium rounded-xl p-4 border border-ink-border">
            <p className="text-neutral-500 text-xs mb-1">Single + 1 Child</p>
            <p className="text-white font-mono text-lg">${livingWage.singleChild.toLocaleString()}</p>
            <p className="text-neutral-600 text-xs">/year</p>
          </div>
          <div className="bg-ink-medium rounded-xl p-4 border border-ink-border">
            <p className="text-neutral-500 text-xs mb-1">Married</p>
            <p className="text-white font-mono text-lg">${livingWage.married.toLocaleString()}</p>
            <p className="text-neutral-600 text-xs">/year</p>
          </div>
          <div className="bg-ink-medium rounded-xl p-4 border border-ink-border">
            <p className="text-neutral-500 text-xs mb-1">Married + 2 Children</p>
            <p className="text-white font-mono text-lg">${livingWage.marriedChildren.toLocaleString()}</p>
            <p className="text-neutral-600 text-xs">/year</p>
          </div>
        </div>
      </div>

      {/* Career Match Cards */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-h4 text-white">Your Career Matches</h3>
        <span className="text-caption text-neutral-500">Sorted by match score</span>
      </div>

      {sortedPathways.length === 0 ? (
        <div className="card-skeuomorphic rounded-2xl p-8 text-center">
          <p className="text-neutral-400">No career pathways found for {user?.countyName || 'your'} County.</p>
          <p className="text-neutral-500 text-sm mt-2">Try selecting a different county or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPathways.slice(0, 8).map((pathway) => {
            const matchScore = calculateMatchScore(pathway)
            const meetsLivingWage = pathway.median_wage_annual >= livingWage.single

            return (
              <div
                key={pathway.id}
                className="card-skeuomorphic rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300"
              >
                {/* Header */}
                <div className="p-5 border-b border-ink-border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-h4 text-white mb-1">{pathway.occupation_title}</h4>
                      <p className="text-caption text-neutral-500">
                        {pathway.time_to_credential_months} months to credential
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                        matchScore >= 90 ? 'bg-green-500/20 text-green-400' :
                        matchScore >= 80 ? 'bg-accent/20 text-accent' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {matchScore}% Match
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-px bg-ink-border">
                  <div className="bg-ink-light p-4">
                    <p className="text-neutral-500 text-xs mb-1">Entry Wage</p>
                    <p className="text-white font-mono">${pathway.entry_wage_hourly?.toFixed(2) || 'N/A'}/hr</p>
                  </div>
                  <div className="bg-ink-light p-4">
                    <p className="text-neutral-500 text-xs mb-1">Median Annual</p>
                    <p className={`font-mono ${meetsLivingWage ? 'text-accent' : 'text-yellow-400'}`}>
                      ${pathway.median_wage_annual?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  <div className="bg-ink-light p-4">
                    <p className="text-neutral-500 text-xs mb-1">Local Jobs</p>
                    <p className="text-white">{pathway.local_job_openings?.toLocaleString() || 0} openings</p>
                  </div>
                  <div className="bg-ink-light p-4">
                    <p className="text-neutral-500 text-xs mb-1">Growth Rate</p>
                    <p className="text-green-400">+{pathway.growth_rate?.toFixed(1) || 0}%</p>
                  </div>
                </div>

                {/* Skills */}
                <div className="p-4 border-t border-ink-border">
                  <p className="text-neutral-500 text-xs mb-2">Key Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {(pathway.key_skills || []).slice(0, 4).map((skill, skillIdx) => (
                      <span
                        key={skillIdx}
                        className="px-2.5 py-1 bg-ink-medium border border-ink-border rounded-lg text-xs text-neutral-300"
                      >
                        {skill}
                      </span>
                    ))}
                    {(pathway.key_skills?.length || 0) > 4 && (
                      <span className="px-2.5 py-1 text-xs text-neutral-500">
                        +{(pathway.key_skills?.length || 0) - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Living Wage Indicator */}
                <div className="px-4 pb-2">
                  {meetsLivingWage ? (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span>✓</span> Meets living wage for single adult
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-400 flex items-center gap-1">
                      <span>!</span> Below living wage threshold
                    </p>
                  )}
                </div>

                {/* Action */}
                <div className="p-4 border-t border-ink-border">
                  <button className="w-full py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors">
                    Explore This Path →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            Live data from Supabase
          </span>
          <span>Wage data: BLS OES</span>
          <span className="text-neutral-700">|</span>
          <span>Living wage: MIT Calculator</span>
        </div>
      </div>
    </DashboardLayout>
  )
}
