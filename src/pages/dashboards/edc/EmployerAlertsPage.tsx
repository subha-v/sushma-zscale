import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'
import InfoTooltip from '../../../components/dashboard/InfoTooltip'

interface EmployerAlert {
  id: string
  company_name: string
  signal_type: 'hiring_surge' | 'hiring_freeze' | 'expansion' | 'contraction' | 'new_facility' | 'layoff' | 'partnership'
  signal_strength: 'weak' | 'moderate' | 'strong' | 'critical'
  title: string
  description: string
  source: string
  detected_at: string
}

const MOCK_ALERTS: EmployerAlert[] = [
  { id: "ea-1", company_name: "Texas Health Resources", signal_type: "hiring_surge", signal_strength: "strong", title: "35% increase in nursing postings", description: "RN job postings surged 35% month-over-month across all DFW facilities. Critical care, emergency, and telehealth positions lead growth. New Mansfield campus driving additional demand.", source: "Job posting analysis — March 2026", detected_at: "2026-03-21" },
  { id: "ea-2", company_name: "General Motors Arlington", signal_type: "expansion", signal_strength: "critical", title: "Full EV production line operational", description: "GM Arlington Assembly fully transitioned to electric SUV production. $1.2B total investment now operational. Hiring 350+ battery systems technicians, automation engineers, and software developers through 2026.", source: "Press release + SEC filing — Q1 2026", detected_at: "2026-03-18" },
  { id: "ea-3", company_name: "Lockheed Martin", signal_type: "hiring_surge", signal_strength: "strong", title: "F-35 Lot 18 production surge", description: "F-35 production rate increasing to 156 aircraft/year. DFW operations adding 120+ software engineers, systems engineers, and cybersecurity specialists. Active UTA recruiting pipeline.", source: "Defense contract + job posting analysis — March 2026", detected_at: "2026-03-19" },
  { id: "ea-4", company_name: "Bell Textron", signal_type: "new_facility", signal_strength: "critical", title: "FLRAA V-280 Valor production begins", description: "V-280 Valor FLRAA program entering low-rate initial production. New DFW engineering center operational. 500+ positions opening across manufacturing, software, and flight test. Largest defense hiring event in Arlington history.", source: "DoD contract award — February 2026", detected_at: "2026-03-15" },
  { id: "ea-5", company_name: "D.R. Horton", signal_type: "hiring_surge", signal_strength: "moderate", title: "Q1 2026 expansion — 45 new positions", description: "Homebuilder expanding project management, sales, and sustainability teams. DFW housing starts up 12% in Q1 2026. New sustainable construction division creating demand for green building expertise.", source: "Q1 2026 earnings call + job postings", detected_at: "2026-03-20" },
  { id: "ea-6", company_name: "Arlington ISD", signal_type: "contraction", signal_strength: "moderate", title: "Budget reduction for 2026-2027", description: "District approved 4.2% budget reduction for 2026-2027. Eliminating 85 non-teaching positions through attrition. Core teaching and special education positions protected. STEM program expansion delayed.", source: "School board vote — March 2026", detected_at: "2026-03-17" },
  // Grapevine alerts
  { id: "ea-7", company_name: "Kubota North America HQ", signal_type: "expansion", signal_strength: "strong", title: "R&D center and dealer training expansion", description: "Kubota expanding Grapevine campus with new R&D center and dealer training facility. Estimated 100+ new positions in engineering, product development, and training. Expansion leverages $51M campus investment.", source: "Corporate press release + Grapevine EDC — March 2026", detected_at: "2026-03-22" },
  { id: "ea-8", company_name: "Paycom Grapevine", signal_type: "hiring_surge", signal_strength: "strong", title: "40+ new positions — CEO cites DFW talent", description: "Paycom Grapevine operations center posting 40+ positions across software engineering, client services, and data analytics. CEO cited DFW candidate quality as expansion driver.", source: "Job posting analysis + earnings call — Q1 2026", detected_at: "2026-03-20" },
  { id: "ea-9", company_name: "DFW International Airport", signal_type: "new_facility", signal_strength: "critical", title: "$4B Terminal F — Phase 1 opening 2027", description: "DFW Airport Board approved $4B Terminal F modernization, the largest airport capital program in the US. Phase 1 opens 2027. 5,000+ construction and 500+ permanent operations jobs.", source: "DFW Airport Board + Dallas Innovates — March 2026", detected_at: "2026-03-18" },
]

const SIGNAL_CONFIG: Record<string, { icon: string; color: string; bg: string }> = {
  hiring_surge: { icon: '📈', color: 'text-green-400', bg: 'bg-green-500/10' },
  hiring_freeze: { icon: '🧊', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  expansion: { icon: '🚀', color: 'text-accent', bg: 'bg-accent/10' },
  contraction: { icon: '📉', color: 'text-red-400', bg: 'bg-red-500/10' },
  new_facility: { icon: '🏗️', color: 'text-purple-400', bg: 'bg-purple-500/10' },
  layoff: { icon: '⚠️', color: 'text-red-400', bg: 'bg-red-500/10' },
  partnership: { icon: '🤝', color: 'text-accent', bg: 'bg-accent/10' },
}

const STRENGTH_CONFIG: Record<string, { color: string; label: string }> = {
  weak: { color: 'text-neutral-400', label: 'Weak' },
  moderate: { color: 'text-yellow-400', label: 'Moderate' },
  strong: { color: 'text-green-400', label: 'Strong' },
  critical: { color: 'text-red-400', label: 'Critical' },
}

type FilterType = 'all' | 'hiring_surge' | 'expansion' | 'new_facility' | 'contraction'

export default function EmployerAlertsPage() {
  const askAgent = useAskAgent()
  const [filter, setFilter] = useState<FilterType>('all')
  const [alerts, setAlerts] = useState<EmployerAlert[]>(MOCK_ALERTS)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchAlerts() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('employer_monitoring')
          .select('*, arlington_employers(company_name)')
          .order('detected_at', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase employer_monitoring unavailable, using fallback data')
          setAlerts(MOCK_ALERTS)
          setDataSource('fallback')
        } else {
          const mapped: EmployerAlert[] = data.map((row: Record<string, unknown>) => {
            const employer = row.arlington_employers as Record<string, unknown> | null
            return {
              id: row.id as string,
              company_name: (employer?.company_name as string) || 'Unknown',
              signal_type: row.signal_type as EmployerAlert['signal_type'],
              signal_strength: row.signal_strength as EmployerAlert['signal_strength'],
              title: row.title as string,
              description: (row.description as string) || '',
              source: (row.source as string) || '',
              detected_at: row.detected_at as string,
            }
          })
          setAlerts(mapped)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setAlerts(MOCK_ALERTS)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading employer alerts from database...</p>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all'
    ? alerts
    : alerts.filter(a => a.signal_type === filter)

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400 inline-flex items-center">{alerts.length} active alerts<InfoTooltip align="left" text={<><p className="mb-1.5">Signals detected from job posting analysis, SEC filings, press releases, and public records.</p><p className="mb-1.5"><span className="text-green-400">Hiring Surge</span> — Rapid increase in job postings. <span className="text-accent">Expansion</span> — Facility or team growth. <span className="text-purple-400">New Facility</span> — Greenfield project.</p><p><span className="text-red-400">Contraction</span> — Headcount reduction. <span className="text-red-400">Layoff</span> — Workforce reduction event.</p></>} /></span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-neutral-300">{alerts.filter(a => a.signal_type === 'hiring_surge').length} hiring surges</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-neutral-300">{alerts.filter(a => a.signal_type === 'expansion' || a.signal_type === 'new_facility').length} expansions</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-neutral-300">{alerts.filter(a => a.signal_type === 'contraction' || a.signal_type === 'layoff').length} contractions</span>
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {([
          { key: 'all', label: 'All Alerts' },
          { key: 'hiring_surge', label: 'Hiring Surges' },
          { key: 'expansion', label: 'Expansions' },
          { key: 'new_facility', label: 'New Facilities' },
          { key: 'contraction', label: 'Contractions' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === key
                ? 'bg-accent text-ink'
                : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="space-y-4">
        {filtered.map((alert) => {
          const signal = SIGNAL_CONFIG[alert.signal_type]
          const strength = STRENGTH_CONFIG[alert.signal_strength]

          return (
            <div key={alert.id} className="card-skeuomorphic rounded-xl p-5 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${signal.bg}`}>
                  {signal.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h4 className="text-white font-medium">{alert.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-sm font-medium ${signal.color}`}>{alert.company_name}</span>
                        <span className="text-neutral-600">|</span>
                        <span className={`text-xs ${strength.color} inline-flex items-center`}>{strength.label} signal<InfoTooltip text={<><p className="mb-1.5">Signal strength indicates confidence level based on source quality and data volume.</p><p><span className="text-neutral-400">Weak</span> = single source, low volume. <span className="text-yellow-400">Moderate</span> = multiple indicators. <span className="text-green-400">Strong</span> = high confidence, corroborated. <span className="text-red-400">Critical</span> = urgent, high-impact event.</p></>} /></span>
                      </div>
                    </div>
                    <span className="text-neutral-500 text-xs shrink-0">
                      {new Date(alert.detected_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-400 text-sm mt-2 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-neutral-600 text-xs">Source: {alert.source}</span>
                    <button
                      onClick={() => askAgent?.(`Get detailed intelligence on ${alert.company_name}: ${alert.title}`)}
                      className="text-accent hover:text-accent-hover text-xs transition-colors"
                    >
                      Get Details from AI
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-skeuomorphic rounded-xl p-8 text-center">
          <p className="text-neutral-400">No alerts matching this filter.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
          {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
        </span>
        <span>Source: Job posting analysis, SEC filings, press releases, public records</span>
      </div>
    </div>
  )
}
