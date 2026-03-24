import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, supabase } from '../../../lib/supabase'
import { MOCK_BUSINESSES } from '../../../lib/mockData'
import SiteSelectionPage from './SiteSelectionPage'
import EmployerAlertsPage from './EmployerAlertsPage'
import ComingSoonPage from '../../../components/dashboard/ComingSoonPage'

const NAV_ITEMS = [
  { label: 'Sectoral Health', path: '/dashboard/edc', icon: '', category: 'Analysis' },
  { label: 'Site Selection', path: '/dashboard/edc/site-selection', icon: '', category: 'Analysis' },
  { label: 'Employer Alerts', path: '/dashboard/edc/employer-alerts', icon: '', category: 'Analysis' },
]

// NAICS code to sector name mapping
const NAICS_TO_SECTOR: Record<string, string> = {
  '11': 'Agriculture',
  '21': 'Mining & Oil/Gas',
  '22': 'Utilities',
  '23': 'Construction',
  '31': 'Manufacturing',
  '32': 'Manufacturing',
  '33': 'Manufacturing',
  '42': 'Wholesale Trade',
  '44': 'Retail Trade',
  '45': 'Retail Trade',
  '48': 'Transportation',
  '49': 'Warehousing',
  '51': 'Information',
  '52': 'Finance & Insurance',
  '53': 'Real Estate',
  '54': 'Professional Services',
  '55': 'Management',
  '56': 'Administrative Services',
  '61': 'Education',
  '62': 'Healthcare',
  '71': 'Arts & Entertainment',
  '72': 'Hospitality',
  '81': 'Other Services',
  '92': 'Public Administration',
}

function getSectorFromNaics(naicsCode: string): string {
  if (!naicsCode) return 'Other'
  const prefix = naicsCode.substring(0, 2)
  return NAICS_TO_SECTOR[prefix] || 'Other'
}

interface Business {
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

interface SectorData {
  sector: string
  businesses: number
  jobs: number
  avgRisk: number
  openings: number
}

export default function EDCDashboard() {
  const user = getStoredUser()
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)
  const [error, _setError] = useState<string | null>(null)
  const [, setSelectedSector] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  // Fetch businesses from Supabase with fallback to mock data
  useEffect(() => {
    async function fetchBusinesses() {
      try {
        setLoading(true)

        // Get businesses - optionally filter by user's county
        let query = supabase
          .from('businesses')
          .select('*')
          .eq('is_active', true)
          .order('employee_count', { ascending: false })

        // If user has a county, filter by it
        if (user?.countyFips) {
          query = query.eq('county_fips', user.countyFips)
        }

        const { data, error } = await query

        if (error || !data || data.length === 0) {
          console.warn('Supabase businesses unavailable, using fallback data')
          const filtered = user?.countyFips
            ? MOCK_BUSINESSES.filter(b => b.county_fips === user.countyFips)
            : MOCK_BUSINESSES
          setBusinesses(filtered)
          setDataSource('fallback')
        } else {
          setBusinesses(data)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setBusinesses(MOCK_BUSINESSES)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }

    fetchBusinesses()
  }, [user?.countyFips])

  // Aggregate data by sector
  const sectorData: SectorData[] = Object.entries(
    businesses.reduce((acc, biz) => {
      const sector = getSectorFromNaics(biz.naics_code)
      if (!acc[sector]) {
        acc[sector] = { businesses: 0, jobs: 0, totalRisk: 0, openings: 0 }
      }
      acc[sector].businesses += 1
      acc[sector].jobs += biz.employee_count || 0
      acc[sector].totalRisk += biz.structural_risk_score || 0
      acc[sector].openings += biz.open_positions || 0
      return acc
    }, {} as Record<string, { businesses: number; jobs: number; totalRisk: number; openings: number }>)
  ).map(([sector, data]) => ({
    sector,
    businesses: data.businesses,
    jobs: data.jobs,
    avgRisk: data.businesses > 0 ? data.totalRisk / data.businesses : 0,
    openings: data.openings,
  })).sort((a, b) => b.jobs - a.jobs)

  // Calculate totals
  const totals = {
    businesses: businesses.length,
    jobs: businesses.reduce((sum, b) => sum + (b.employee_count || 0), 0),
    avgRisk: businesses.length > 0
      ? businesses.reduce((sum, b) => sum + (b.structural_risk_score || 0), 0) / businesses.length
      : 0,
    openings: businesses.reduce((sum, b) => sum + (b.open_positions || 0), 0),
  }

  const getRiskColor = (risk: number) => {
    if (risk < 0.2) return { bg: 'bg-green-500/20', text: 'text-green-400' }
    if (risk < 0.35) return { bg: 'bg-yellow-500/20', text: 'text-yellow-400' }
    return { bg: 'bg-red-500/20', text: 'text-red-400' }
  }

  if (loading) {
    return (
      <DashboardLayout
        title="Sectoral Health Dashboard"
        subtitle="Economic Development Intelligence"
        navItems={NAV_ITEMS}
        role="edc"
      >
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-neutral-400">Loading business data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout
        title="Sectoral Health Dashboard"
        subtitle="Economic Development Intelligence"
        navItems={NAV_ITEMS}
        role="edc"
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

  const defaultContent = (
    <>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-8">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{totals.businesses.toLocaleString()} businesses</span>
          <span className="text-neutral-600">|</span>
          <span className="text-accent">{totals.jobs.toLocaleString()} jobs</span>
          <span className="text-neutral-600">|</span>
          <span className={`${getRiskColor(totals.avgRisk).text}`}>Risk: {totals.avgRisk.toFixed(2)}</span>
          <span className="text-neutral-600">|</span>
          <span className="text-green-400">{totals.openings.toLocaleString()} open positions</span>
          <span className="text-neutral-500 text-xs ml-auto">{user?.countyName || 'All'} County</span>
        </div>
      </div>

      {/* Risk Distribution Visual */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <h3 className="text-h4 text-white mb-4">Risk Distribution by Sector</h3>
        <div className="space-y-3">
          {sectorData.slice(0, 8).map((sector) => {
            const colors = getRiskColor(sector.avgRisk)
            const widthPercent = Math.min(Math.round(sector.avgRisk * 100), 100)
            return (
              <div key={sector.sector} className="flex items-center gap-4">
                <div className="w-36 text-sm text-neutral-400 flex-shrink-0 truncate">
                  {sector.sector}
                </div>
                <div className="flex-1 h-6 bg-ink-medium rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${colors.bg} transition-all duration-500`}
                    style={{ width: `${widthPercent}%` }}
                  />
                </div>
                <div className={`w-16 text-right font-mono text-sm ${colors.text}`}>
                  {sector.avgRisk.toFixed(2)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sectors Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Sector Overview</h3>
          <span className="text-caption text-neutral-500">{sectorData.length} sectors</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Sector</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Businesses</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Jobs</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Open Positions</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Avg Risk</th>
              </tr>
            </thead>
            <tbody>
              {sectorData.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No business data found for this county
                  </td>
                </tr>
              ) : (
                sectorData.map((sector, idx) => {
                  const colors = getRiskColor(sector.avgRisk)
                  return (
                    <tr
                      key={idx}
                      className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedSector(sector.sector)}
                    >
                      <td className="p-4">
                        <p className="text-white font-medium">{sector.sector}</p>
                      </td>
                      <td className="p-4 text-right text-neutral-300">
                        {sector.businesses.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-neutral-300">
                        {sector.jobs.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-green-400">
                        {sector.openings.toLocaleString()}
                      </td>
                      <td className="p-4 text-right">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-mono ${colors.bg} ${colors.text}`}>
                          {sector.avgRisk.toFixed(2)}
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

      {/* Top Employers Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Top Employers</h3>
          <span className="text-caption text-neutral-500">By employee count</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Company</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Sector</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">City</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Employees</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Openings</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {businesses.slice(0, 10).map((biz) => {
                const colors = getRiskColor(biz.structural_risk_score || 0)
                return (
                  <tr
                    key={biz.id}
                    className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-white font-medium">{biz.company_name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-400 text-sm">{getSectorFromNaics(biz.naics_code)}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-400 text-sm">{biz.city}</p>
                    </td>
                    <td className="p-4 text-right text-neutral-300">
                      {biz.employee_count?.toLocaleString() || 'N/A'}
                    </td>
                    <td className="p-4 text-right text-green-400">
                      {biz.open_positions || 0}
                    </td>
                    <td className="p-4 text-right">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-mono ${colors.bg} ${colors.text}`}>
                        {biz.structural_risk_score?.toFixed(2) || 'N/A'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
            {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
          </span>
          <span>Source: TX Comptroller, BLS</span>
        </div>
        <button className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1">
          Export Report
          <span>→</span>
        </button>
      </div>
    </>
  )

  return (
    <DashboardLayout
      title="Sectoral Health Dashboard"
      subtitle="Economic Development Intelligence"
      navItems={NAV_ITEMS}
    >
      <Routes>
        <Route index element={defaultContent} />
        <Route path="site-selection" element={<SiteSelectionPage />} />
        <Route path="employer-alerts" element={<EmployerAlertsPage />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
    </DashboardLayout>
  )
}
