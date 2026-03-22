import { useState, useEffect } from 'react'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, supabase } from '../../../lib/supabase'

const NAV_ITEMS = [
  // HB8 Funding Category
  { label: 'ROI Heatmap', path: '/dashboard/college', icon: '📊', category: 'HB8 Funding' },
  { label: 'Funding Multiplier', path: '/dashboard/college/funding', icon: '💰', category: 'HB8 Funding' },
  { label: 'Dual Credit Pipeline', path: '/dashboard/college/dual-credit', icon: '🎓', category: 'HB8 Funding' },
  { label: 'ICLC vs Technical', path: '/dashboard/college/iclc', icon: '📋', category: 'HB8 Funding' },
  // Curriculum Category
  { label: 'Curriculum Blueprint', path: '/dashboard/college/curriculum', icon: '📐', category: 'Curriculum' },
  { label: 'Skill-to-Dollar', path: '/dashboard/college/skills', icon: '🎯', category: 'Curriculum' },
  { label: 'Completion Funnel', path: '/dashboard/college/completion', icon: '📈', category: 'Curriculum' },
  { label: 'Employer Catchment', path: '/dashboard/college/employers', icon: '🗺️', category: 'Curriculum' },
  { label: 'Compliance Matrix', path: '/dashboard/college/compliance', icon: '✅', category: 'Curriculum' },
]

interface Program {
  id: string
  program_name: string
  credential_type: string
  total_cost: number
  median_wage_at_exit: number
  roi_years: number
  employment_rate: number
  is_credential_of_value: boolean
  institutions?: {
    name: string
    county_fips: string
  }[]
}

type QuadrantFilter = 'all' | 'star' | 'watch' | 'danger'

function getQuadrant(roiYears: number): 'star' | 'watch' | 'danger' {
  if (roiYears <= 3) return 'star'
  if (roiYears <= 5) return 'watch'
  return 'danger'
}

export default function CollegeDashboard() {
  getStoredUser()
  const [activeTab, setActiveTab] = useState<QuadrantFilter>('all')
  const [programs, setPrograms] = useState<Program[]>([])
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)

  // Fetch programs from Supabase (live data only)
  useEffect(() => {
    async function fetchPrograms() {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('academic_programs')
          .select(`
            id,
            program_name,
            credential_type,
            total_cost,
            median_wage_at_exit,
            roi_years,
            employment_rate,
            is_credential_of_value,
            institutions (
              name,
              county_fips
            )
          `)
          .eq('is_active', true)
          .order('roi_years', { ascending: true })

        if (error) {
          console.error('Supabase academic_programs query failed:', error)
          _setError('Failed to load academic programs from database.')
          return
        }

        setPrograms(data || [])
      } catch (err) {
        console.error('Supabase query failed:', err)
        _setError('Unable to connect to database. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPrograms()
  }, [])

  // Filter programs by quadrant
  const filteredPrograms = activeTab === 'all'
    ? programs
    : programs.filter(p => getQuadrant(p.roi_years) === activeTab)

  // Calculate stats from real data
  const stats = {
    total: programs.length,
    star: programs.filter(p => getQuadrant(p.roi_years) === 'star').length,
    watch: programs.filter(p => getQuadrant(p.roi_years) === 'watch').length,
    danger: programs.filter(p => getQuadrant(p.roi_years) === 'danger').length,
    credentialOfValue: programs.filter(p => p.is_credential_of_value).length,
  }

  const getQuadrantColor = (quadrant: string) => {
    switch (quadrant) {
      case 'star': return { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400' }
      case 'watch': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' }
      case 'danger': return { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' }
      default: return { bg: 'bg-neutral-500/20', text: 'text-neutral-400', dot: 'bg-neutral-400' }
    }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Credential ROI Heatmap"
        subtitle="HB8 Funding Analysis"
        navItems={NAV_ITEMS}
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading programs from database...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Credential ROI Heatmap"
        subtitle="HB8 Funding Analysis"
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
      title="Credential ROI Heatmap"
      subtitle="HB8 Funding Analysis"
      navItems={NAV_ITEMS}
    >
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Total Programs</p>
          <p className="text-3xl font-display font-bold text-white">{stats.total}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Credentials of Value</p>
          <p className="text-3xl font-display font-bold text-accent">{stats.credentialOfValue}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5 border-l-4 border-l-green-500">
          <p className="text-neutral-500 text-sm mb-1">Star Performers</p>
          <p className="text-3xl font-display font-bold text-green-400">{stats.star}</p>
          <p className="text-xs text-neutral-600 mt-1">ROI ≤ 3 yrs</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5 border-l-4 border-l-yellow-500">
          <p className="text-neutral-500 text-sm mb-1">Watch List</p>
          <p className="text-3xl font-display font-bold text-yellow-400">{stats.watch}</p>
          <p className="text-xs text-neutral-600 mt-1">ROI 3-5 yrs</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5 border-l-4 border-l-red-500">
          <p className="text-neutral-500 text-sm mb-1">At Risk</p>
          <p className="text-3xl font-display font-bold text-red-400">{stats.danger}</p>
          <p className="text-xs text-neutral-600 mt-1">ROI &gt; 5 yrs</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['all', 'star', 'watch', 'danger'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === tab
                ? 'bg-accent text-ink'
                : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
            }`}
          >
            {tab === 'all' ? `All Programs (${stats.total})` :
             tab === 'star' ? `⭐ Stars (${stats.star})` :
             tab === 'watch' ? `👁 Watch (${stats.watch})` : `⚠️ At Risk (${stats.danger})`}
          </button>
        ))}
      </div>

      {/* Programs Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Program</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Institution</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Credential</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Cost</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Median Wage</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">ROI</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Employment</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrograms.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-neutral-500">
                    No programs found in this category
                  </td>
                </tr>
              ) : (
                filteredPrograms.map((program) => {
                  const quadrant = getQuadrant(program.roi_years)
                  const colors = getQuadrantColor(quadrant)
                  return (
                    <tr
                      key={program.id}
                      className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                    >
                      <td className="p-4">
                        <p className="text-white font-medium">{program.program_name}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-neutral-400 text-sm">
                          {program.institutions?.[0]?.name || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-ink-medium rounded text-xs text-neutral-300 capitalize">
                          {program.credential_type}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-neutral-300 font-mono text-sm">
                          ${program.total_cost?.toLocaleString() || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-accent font-mono text-sm">
                          ${program.median_wage_at_exit?.toLocaleString() || 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className={`font-mono text-sm ${colors.text}`}>
                          {program.roi_years?.toFixed(1) || 'N/A'} yrs
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-neutral-300 text-sm">
                          {program.employment_rate ? `${program.employment_rate}%` : 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
                          {quadrant === 'star' ? 'Star' :
                           quadrant === 'watch' ? 'Watch' : 'At Risk'}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Source Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
            Live data from Supabase
          </span>
          <span>Source: THECB, IPEDS</span>
        </div>
        <button className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
          Export Report
          <span>→</span>
        </button>
      </div>
    </DashboardLayout>
  )
}
