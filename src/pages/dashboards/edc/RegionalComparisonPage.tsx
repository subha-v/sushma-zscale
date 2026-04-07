import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface CityData {
  city: string
  population: number
  medianHouseholdIncome: number
  unemploymentRate: number
  avgWeeklyWages: number
  totalEmployment: number
  topIndustry: string
  majorEmployer: string
}

const MOCK_CITIES: CityData[] = [
  { city: 'Grapevine', population: 51320, medianHouseholdIncome: 112000, unemploymentRate: 3.4, avgWeeklyWages: 1450, totalEmployment: 29218, topIndustry: 'Hospitality', majorEmployer: 'Gaylord Texan' },
  { city: 'Southlake', population: 32376, medianHouseholdIncome: 250000, unemploymentRate: 2.8, avgWeeklyWages: 1800, totalEmployment: 15000, topIndustry: 'Professional Services', majorEmployer: 'Sabre HQ (nearby)' },
  { city: 'Frisco', population: 219587, medianHouseholdIncome: 135000, unemploymentRate: 3.2, avgWeeklyWages: 1550, totalEmployment: 120000, topIndustry: 'Technology', majorEmployer: 'PGA of America' },
  { city: 'Colleyville', population: 27113, medianHouseholdIncome: 168000, unemploymentRate: 3.0, avgWeeklyWages: 1600, totalEmployment: 8500, topIndustry: 'Healthcare', majorEmployer: 'Baylor Scott & White' },
]

const METRICS: { key: keyof CityData; label: string; format: (v: unknown) => string; best: 'high' | 'low' }[] = [
  { key: 'population', label: 'Population', format: (v) => (v as number).toLocaleString(), best: 'high' },
  { key: 'medianHouseholdIncome', label: 'Median HH Income', format: (v) => `$${((v as number) / 1000).toFixed(0)}K`, best: 'high' },
  { key: 'unemploymentRate', label: 'Unemployment Rate', format: (v) => `${v}%`, best: 'low' },
  { key: 'avgWeeklyWages', label: 'Avg Weekly Wages', format: (v) => `$${(v as number).toLocaleString()}`, best: 'high' },
  { key: 'totalEmployment', label: 'Total Employment', format: (v) => (v as number).toLocaleString(), best: 'high' },
  { key: 'topIndustry', label: 'Top Industry', format: (v) => v as string, best: 'high' },
  { key: 'majorEmployer', label: 'Major Employer', format: (v) => v as string, best: 'high' },
]

function isBest(metric: typeof METRICS[number], value: unknown, allValues: unknown[]): boolean {
  if (typeof value !== 'number') return false
  const nums = allValues.filter((v): v is number => typeof v === 'number')
  if (metric.best === 'low') return value === Math.min(...nums)
  return value === Math.max(...nums)
}

export default function RegionalComparisonPage() {
  const askAgent = useAskAgent()
  const [cities, setCities] = useState<CityData[]>(MOCK_CITIES)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchRegionalData() {
      try {
        setLoading(true)
        // geography column uses "City, TX" format
        const geoValues = ['Grapevine, TX', 'Southlake, TX', 'Frisco, TX', 'Colleyville, TX']
        const { data, error } = await supabase
          .from('arlington_labor_stats')
          .select('geography, metric_name, metric_value, metric_category')
          .in('geography', geoValues)

        if (error || !data || data.length === 0) {
          setCities(MOCK_CITIES)
          setDataSource('fallback')
        } else {
          // Map "Grapevine, TX" → "Grapevine"
          const cityMap: Record<string, Partial<CityData>> = {}
          for (const row of data) {
            const cityName = (row.geography || '').replace(', TX', '')
            if (!cityName) continue
            if (!cityMap[cityName]) cityMap[cityName] = { city: cityName }
            const val = parseFloat(row.metric_value) || 0
            const name = (row.metric_name || '').toLowerCase()
            if (name.includes('population')) cityMap[cityName].population = val
            else if (name.includes('median') && name.includes('income')) cityMap[cityName].medianHouseholdIncome = val
            else if (name.includes('unemployment')) cityMap[cityName].unemploymentRate = val
            else if (name.includes('weekly') && name.includes('wage')) cityMap[cityName].avgWeeklyWages = val
            else if (name === 'total employment') cityMap[cityName].totalEmployment = val
          }

          const result = Object.values(cityMap)
          if (result.length >= 2) {
            // Merge live data on top of mock defaults for any missing fields
            const merged = MOCK_CITIES.map(mock => {
              const live = cityMap[mock.city]
              return live ? { ...mock, ...live } : mock
            })
            setCities(merged)
            setDataSource('live')
          } else {
            setCities(MOCK_CITIES)
            setDataSource('fallback')
          }
        }
      } catch {
        setCities(MOCK_CITIES)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchRegionalData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading regional comparison data...</p>
        </div>
      </div>
    )
  }

  const grapevine = cities.find(c => c.city === 'Grapevine')

  return (
    <div>
      {/* Header */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-h3 text-white mb-2">Regional Comparison</h2>
            <p className="text-body text-neutral-400">
              Benchmark Grapevine against competitive DFW cities. Compare labor markets, income levels, and economic indicators side-by-side.
            </p>
          </div>
          <button
            onClick={() => askAgent?.('Compare Grapevine vs Southlake vs Frisco vs Colleyville labor markets and economic indicators')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors shrink-0"
          >
            Analyze with AI Agent
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-8">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">Cities Compared: <span className="text-white font-medium">{cities.length}</span></span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Grapevine Pop: <span className="text-accent font-medium">{grapevine?.population.toLocaleString()}</span></span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Median Income: <span className="text-white font-medium">${grapevine ? (grapevine.medianHouseholdIncome / 1000).toFixed(0) : '—'}K</span></span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-400">Unemployment: <span className="text-green-400 font-medium">{grapevine?.unemploymentRate}%</span></span>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border">
          <h3 className="text-h4 text-white">City-by-City Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium w-44">Metric</th>
                {cities.map(city => (
                  <th
                    key={city.city}
                    className={`text-right p-4 text-sm font-medium ${
                      city.city === 'Grapevine'
                        ? 'text-accent bg-accent/5 border-l-2 border-accent'
                        : 'text-neutral-500'
                    }`}
                  >
                    {city.city}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((metric) => {
                const allValues = cities.map(c => c[metric.key])
                return (
                  <tr key={metric.key} className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors">
                    <td className="p-4 text-neutral-400 text-sm">{metric.label}</td>
                    {cities.map(city => {
                      const val = city[metric.key]
                      const best = isBest(metric, val, allValues)
                      const isGrapevine = city.city === 'Grapevine'
                      return (
                        <td
                          key={city.city}
                          className={`p-4 text-right text-sm ${
                            isGrapevine ? 'bg-accent/5 border-l-2 border-accent' : ''
                          } ${best ? 'text-green-400 font-medium' : 'text-neutral-300'}`}
                        >
                          {metric.format(val)}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Competitive Advantages */}
      <div className="mb-8">
        <h3 className="text-h4 text-white mb-4">Grapevine Competitive Advantages</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-skeuomorphic rounded-xl p-5">
            <p className="text-accent text-xs uppercase tracking-wider mb-2">Infrastructure</p>
            <h4 className="text-white font-medium mb-2">DFW Airport Gateway</h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Only city in this comparison directly adjacent to DFW International Airport, the 4th busiest in the US.
            </p>
          </div>
          <div className="card-skeuomorphic rounded-xl p-5">
            <p className="text-accent text-xs uppercase tracking-wider mb-2">Track Record</p>
            <h4 className="text-white font-medium mb-2">$2B+ EDC Investment</h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Largest proven investment attraction portfolio among compared cities since 2014.
            </p>
          </div>
          <div className="card-skeuomorphic rounded-xl p-5">
            <p className="text-accent text-xs uppercase tracking-wider mb-2">Specialization</p>
            <h4 className="text-white font-medium mb-2">Hospitality Capital of DFW</h4>
            <p className="text-neutral-400 text-sm leading-relaxed">
              8,500+ hospitality workers, highest concentration in the DFW metroplex.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
            {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
          </span>
          <span>Source: Census Bureau, BLS, TX Comptroller, EDC filings</span>
        </div>
        <button
          onClick={() => askAgent?.('Compare Grapevine vs Southlake vs Frisco labor markets')}
          className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          Expand with AI Agent
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
