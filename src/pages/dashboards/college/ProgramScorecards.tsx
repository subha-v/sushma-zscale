import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface Scorecard {
  program_name: string
  degree_type: string
  college_name: string
  overall_score: number
  health_status: 'healthy' | 'watch' | 'at_risk' | 'critical'
  employment_rate: number
  median_salary: number
  employer_demand_score: number
  skills_alignment_pct: number
  graduation_rate: number
  credential_of_value: boolean
  hb8_compliant: boolean
  trend_direction: 'improving' | 'stable' | 'declining'
  ai_recommendation: string
}

const MOCK_SCORECARDS: Scorecard[] = [
  { program_name: "Computer Science", degree_type: "BS", college_name: "College of Engineering", overall_score: 89.2, health_status: "healthy", employment_rate: 84.0, median_salary: 71500, employer_demand_score: 92.0, skills_alignment_pct: 80.0, graduation_rate: 54.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Strong program with excellent employer demand. GenAI and cloud-native coursework additions in Spring 2025 are closing skills gaps." },
  { program_name: "Nursing", degree_type: "BSN", college_name: "CONHI", overall_score: 86.5, health_status: "healthy", employment_rate: 94.0, median_salary: 73200, employer_demand_score: 93.0, skills_alignment_pct: 96.0, graduation_rate: 73.0, credential_of_value: true, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Top-performing program with highest employment rate. Telehealth certification launched Fall 2024 showing early positive outcomes." },
  { program_name: "Software Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 87.4, health_status: "healthy", employment_rate: 85.0, median_salary: 70800, employer_demand_score: 90.0, skills_alignment_pct: 82.0, graduation_rate: 52.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Growing demand driven by defense and tech sectors. Bell FLRAA program creating additional software engineering pipeline." },
  { program_name: "Data Science", degree_type: "BS", college_name: "College of Science", overall_score: 86.8, health_status: "healthy", employment_rate: 87.0, median_salary: 69500, employer_demand_score: 88.0, skills_alignment_pct: 76.0, graduation_rate: 56.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "Fastest-growing program by employer demand. AI/ML specialization track launched Spring 2025. Amazon and Capital One actively recruiting." },
  { program_name: "Aerospace Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 80.1, health_status: "watch", employment_rate: 82.0, median_salary: 69000, employer_demand_score: 86.0, skills_alignment_pct: 77.0, graduation_rate: 48.0, credential_of_value: true, hb8_compliant: true, trend_direction: "improving", ai_recommendation: "FLRAA contract driving strong local demand. Graduation rate improving with new peer tutoring program." },
  { program_name: "Mechanical Engineering", degree_type: "BS", college_name: "College of Engineering", overall_score: 73.5, health_status: "watch", employment_rate: 79.0, median_salary: 67500, employer_demand_score: 79.0, skills_alignment_pct: 72.0, graduation_rate: 51.0, credential_of_value: true, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Industry 4.0 curriculum update in progress for Fall 2025. GM Arlington EV transition creating new demand." },
  { program_name: "Accounting", degree_type: "BBA", college_name: "College of Business", overall_score: 64.0, health_status: "at_risk", employment_rate: 77.0, median_salary: 57800, employer_demand_score: 68.0, skills_alignment_pct: 66.0, graduation_rate: 57.0, credential_of_value: false, hb8_compliant: false, trend_direction: "declining", ai_recommendation: "Below HB8 wage threshold for second consecutive year. Data analytics pilot in Spring 2025 showing early promise." },
  { program_name: "Biology", degree_type: "BS", college_name: "College of Science", overall_score: 56.5, health_status: "at_risk", employment_rate: 63.0, median_salary: 43500, employer_demand_score: 54.0, skills_alignment_pct: 58.0, graduation_rate: 44.0, credential_of_value: false, hb8_compliant: false, trend_direction: "declining", ai_recommendation: "Lowest employment rate and below living wage. New biotech partnership with Arlington research corridor announced Q1 2025." },
  { program_name: "Finance", degree_type: "BBA", college_name: "College of Business", overall_score: 72.0, health_status: "watch", employment_rate: 79.0, median_salary: 58200, employer_demand_score: 73.0, skills_alignment_pct: 67.0, graduation_rate: 59.0, credential_of_value: false, hb8_compliant: true, trend_direction: "stable", ai_recommendation: "Fintech curriculum integration underway for 2025-2026. CFA prep partnership with local firms established." },
]

type FilterStatus = 'all' | 'healthy' | 'watch' | 'at_risk'

const STATUS_CONFIG = {
  healthy: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-400', label: 'Healthy' },
  watch: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400', label: 'Watch' },
  at_risk: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'At Risk' },
  critical: { bg: 'bg-red-700/20', text: 'text-red-300', dot: 'bg-red-300', label: 'Critical' },
}

const TREND_ICONS = {
  improving: { icon: '↑', color: 'text-green-400' },
  stable: { icon: '→', color: 'text-yellow-400' },
  declining: { icon: '↓', color: 'text-red-400' },
}

function getScoreColor(score: number) {
  if (score >= 80) return 'text-green-400'
  if (score >= 70) return 'text-yellow-400'
  return 'text-red-400'
}

export default function ProgramScorecards() {
  const askAgent = useAskAgent()
  const [filter, setFilter] = useState<FilterStatus>('all')
  const [scorecards, setScorecards] = useState<Scorecard[]>(MOCK_SCORECARDS)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchScorecards() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('program_scorecards')
          .select('*, uta_programs(program_name, degree_type, uta_colleges(college_name))')
          .order('overall_score', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase program_scorecards unavailable, using fallback data')
          setScorecards(MOCK_SCORECARDS)
          setDataSource('fallback')
        } else {
          const mapped: Scorecard[] = data.map((row: Record<string, unknown>) => {
            const prog = row.uta_programs as Record<string, unknown> | null
            const college = prog?.uta_colleges as Record<string, unknown> | null
            return {
              program_name: (prog?.program_name as string) || 'Unknown',
              degree_type: (prog?.degree_type as string) || '',
              college_name: (college?.college_name as string) || '',
              overall_score: Number(row.overall_score) || 0,
              health_status: (row.health_status as Scorecard['health_status']) || 'watch',
              employment_rate: Number(row.employment_rate) || 0,
              median_salary: Number(row.median_salary) || 0,
              employer_demand_score: Number(row.employer_demand_score) || 0,
              skills_alignment_pct: Number(row.skills_alignment_pct) || 0,
              graduation_rate: Number(row.graduation_rate) || 0,
              credential_of_value: row.credential_of_value as boolean ?? false,
              hb8_compliant: row.hb8_compliant as boolean ?? true,
              trend_direction: (row.trend_direction as Scorecard['trend_direction']) || 'stable',
              ai_recommendation: (row.ai_recommendation as string) || '',
            }
          })
          setScorecards(mapped)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setScorecards(MOCK_SCORECARDS)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchScorecards()
  }, [])

  const filtered = filter === 'all'
    ? scorecards
    : scorecards.filter(s => s.health_status === filter)

  const stats = {
    total: scorecards.length,
    healthy: scorecards.filter(s => s.health_status === 'healthy').length,
    watch: scorecards.filter(s => s.health_status === 'watch').length,
    atRisk: scorecards.filter(s => s.health_status === 'at_risk' || s.health_status === 'critical').length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading scorecards from database...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{stats.total} scored</span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-neutral-300">{stats.healthy} healthy</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-neutral-300">{stats.watch} watch</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-neutral-300">{stats.atRisk} at risk</span>
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['all', 'healthy', 'watch', 'at_risk'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              filter === tab
                ? 'bg-accent text-ink'
                : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
            }`}
          >
            {tab === 'all' ? `All (${stats.total})` :
             tab === 'healthy' ? `Healthy (${stats.healthy})` :
             tab === 'watch' ? `Watch (${stats.watch})` : `At Risk (${stats.atRisk})`}
          </button>
        ))}
      </div>

      {/* Scorecard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.map((card) => {
          const status = STATUS_CONFIG[card.health_status]
          const trend = TREND_ICONS[card.trend_direction]

          return (
            <div key={`${card.program_name}-${card.degree_type}`} className="card-skeuomorphic rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300">
              {/* Header */}
              <div className="p-5 border-b border-ink-border">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="text-white font-medium">{card.program_name} {card.degree_type}</h4>
                    <p className="text-neutral-500 text-xs">{card.college_name}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-3xl font-display font-bold ${getScoreColor(card.overall_score)}`}>
                    {card.overall_score}
                  </span>
                  <span className="text-neutral-500 text-sm">/100</span>
                  <span className={`ml-auto text-sm ${trend.color}`}>{trend.icon} {card.trend_direction}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-px bg-ink-border">
                <div className="bg-ink-light p-3">
                  <p className="text-neutral-500 text-xs mb-1">Employment</p>
                  <p className="text-white font-mono text-sm">{card.employment_rate}%</p>
                </div>
                <div className="bg-ink-light p-3">
                  <p className="text-neutral-500 text-xs mb-1">Median Salary</p>
                  <p className="text-accent font-mono text-sm">${card.median_salary.toLocaleString()}</p>
                </div>
                <div className="bg-ink-light p-3">
                  <p className="text-neutral-500 text-xs mb-1">Employer Demand</p>
                  <p className={`font-mono text-sm ${getScoreColor(card.employer_demand_score)}`}>{card.employer_demand_score}</p>
                </div>
                <div className="bg-ink-light p-3">
                  <p className="text-neutral-500 text-xs mb-1">Skills Alignment</p>
                  <p className={`font-mono text-sm ${getScoreColor(card.skills_alignment_pct)}`}>{card.skills_alignment_pct}%</p>
                </div>
              </div>

              {/* Badges */}
              <div className="p-4 border-t border-ink-border space-y-2">
                <div className="flex flex-wrap gap-2">
                  {card.credential_of_value && (
                    <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-xs rounded">CoV</span>
                  )}
                  {card.hb8_compliant ? (
                    <span className="px-2 py-0.5 bg-accent/10 text-accent text-xs rounded">HB8 Compliant</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-xs rounded">HB8 Non-Compliant</span>
                  )}
                </div>
                <p className="text-neutral-400 text-xs leading-relaxed">{card.ai_recommendation}</p>
              </div>

              {/* Action */}
              <div className="p-4 border-t border-ink-border">
                <button
                  onClick={() => askAgent?.(`Tell me about the ${card.program_name} ${card.degree_type} program scorecard, performance, and recommendations`)}
                  className="w-full py-2 bg-accent/10 hover:bg-accent/20 text-accent text-sm font-medium rounded-lg transition-colors"
                >
                  Ask AI About This Program
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between text-xs text-neutral-600 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
            {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
          </span>
          <span>Source: UTA Institutional Research, BLS, THECB</span>
        </div>
        <button
          onClick={() => askAgent?.('Give me a deep analysis of all program scorecards')}
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Deep analysis with AI Agent
        </button>
      </div>
    </div>
  )
}
