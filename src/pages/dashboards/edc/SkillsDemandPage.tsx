import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'
import InfoTooltip from '../../../components/dashboard/InfoTooltip'

interface EmergingSkill {
  skill_name: string
  skill_category: string
  job_posting_count: number
  posting_percentage: number
  avg_salary_with_skill: number
}

interface DecliningSkill {
  skill_name: string
  skill_category: string
  description: string
}

interface SkillsGapRecord {
  skill_name: string
  program_name: string
  gap_status: 'aligned' | 'gap' | 'surplus'
  demand_level: string
  is_emerging: boolean
}

const MOCK_EMERGING_SKILLS: EmergingSkill[] = [
  { skill_name: 'Generative AI / LLMs', skill_category: 'ai_ml', job_posting_count: 290, posting_percentage: 9.5, avg_salary_with_skill: 144000 },
  { skill_name: 'React/Next.js', skill_category: 'programming', job_posting_count: 405, posting_percentage: 13.3, avg_salary_with_skill: 127000 },
  { skill_name: 'Kubernetes', skill_category: 'cloud_infrastructure', job_posting_count: 325, posting_percentage: 10.7, avg_salary_with_skill: 139000 },
  { skill_name: 'Data Engineering (dbt/Spark)', skill_category: 'data_science', job_posting_count: 248, posting_percentage: 8.1, avg_salary_with_skill: 138000 },
  { skill_name: 'Terraform', skill_category: 'devops', job_posting_count: 198, posting_percentage: 6.5, avg_salary_with_skill: 135000 },
  { skill_name: 'Cybersecurity (Zero Trust)', skill_category: 'cybersecurity', job_posting_count: 190, posting_percentage: 6.2, avg_salary_with_skill: 134000 },
  { skill_name: 'Cloud Architecture (Multi-Cloud)', skill_category: 'cloud_infrastructure', job_posting_count: 170, posting_percentage: 5.6, avg_salary_with_skill: 150000 },
  { skill_name: 'Prompt Engineering', skill_category: 'ai_ml', job_posting_count: 155, posting_percentage: 5.1, avg_salary_with_skill: 137000 },
]

const MOCK_DECLINING_SKILLS: DecliningSkill[] = [
  { skill_name: 'jQuery', skill_category: 'programming', description: 'Legacy JavaScript library being replaced by modern frameworks' },
  { skill_name: 'COBOL', skill_category: 'programming', description: 'Legacy mainframe language with shrinking demand' },
  { skill_name: 'On-Premise Server Admin', skill_category: 'cloud_infrastructure', description: 'Being replaced by cloud infrastructure management' },
  { skill_name: 'Manual QA Testing', skill_category: 'other', description: 'Being replaced by automated testing frameworks' },
  { skill_name: 'Flash/ActionScript', skill_category: 'programming', description: 'Deprecated multimedia platform' },
]

const MOCK_SKILLS_GAP: SkillsGapRecord[] = [
  { skill_name: 'Generative AI / LLMs', program_name: 'Computer Science', gap_status: 'gap', demand_level: 'high', is_emerging: true },
  { skill_name: 'Cloud Computing (AWS/Azure)', program_name: 'Computer Science', gap_status: 'gap', demand_level: 'high', is_emerging: false },
  { skill_name: 'Kubernetes', program_name: 'Computer Science', gap_status: 'gap', demand_level: 'high', is_emerging: true },
  { skill_name: 'Python', program_name: 'Computer Science', gap_status: 'aligned', demand_level: 'high', is_emerging: false },
  { skill_name: 'SQL/NoSQL', program_name: 'Data Science', gap_status: 'aligned', demand_level: 'high', is_emerging: false },
  { skill_name: 'Terraform', program_name: 'Software Engineering', gap_status: 'gap', demand_level: 'medium', is_emerging: true },
  { skill_name: 'React/Next.js', program_name: 'Software Engineering', gap_status: 'gap', demand_level: 'high', is_emerging: true },
  { skill_name: 'Java', program_name: 'Computer Science', gap_status: 'aligned', demand_level: 'high', is_emerging: false },
  { skill_name: 'Cybersecurity (Zero Trust)', program_name: 'Computer Science', gap_status: 'gap', demand_level: 'medium', is_emerging: true },
  { skill_name: 'Data Visualization', program_name: 'Data Science', gap_status: 'aligned', demand_level: 'medium', is_emerging: false },
  { skill_name: 'Prompt Engineering', program_name: 'Data Science', gap_status: 'gap', demand_level: 'medium', is_emerging: true },
  { skill_name: 'MLOps', program_name: 'Data Science', gap_status: 'gap', demand_level: 'high', is_emerging: true },
]

const CATEGORY_LABELS: Record<string, string> = {
  ai_ml: 'AI & ML',
  programming: 'Programming',
  cloud_infrastructure: 'Cloud & Infra',
  data_science: 'Data Science',
  devops: 'DevOps',
  cybersecurity: 'Cybersecurity',
  healthcare: 'Healthcare',
  engineering: 'Engineering',
  business: 'Business',
  other: 'Other',
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  ai_ml: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
  programming: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
  cloud_infrastructure: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
  data_science: { bg: 'bg-green-500/20', text: 'text-green-400' },
  devops: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
  cybersecurity: { bg: 'bg-red-500/20', text: 'text-red-400' },
  other: { bg: 'bg-neutral-500/20', text: 'text-neutral-400' },
}

export default function SkillsDemandPage() {
  const askAgent = useAskAgent()
  const [emerging, setEmerging] = useState<EmergingSkill[]>(MOCK_EMERGING_SKILLS)
  const [declining, setDeclining] = useState<DecliningSkill[]>(MOCK_DECLINING_SKILLS)
  const [skillsGap, setSkillsGap] = useState<SkillsGapRecord[]>(MOCK_SKILLS_GAP)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchSkillsData() {
      try {
        setLoading(true)
        let isLive = false

        // Fetch emerging skills
        const { data: emergingData, error: emergingError } = await supabase
          .from('skills_catalog')
          .select('skill_name, skill_category, job_posting_count, posting_percentage, avg_salary_with_skill')
          .eq('is_emerging', true)
          .order('posting_percentage', { ascending: false })

        if (!emergingError && emergingData && emergingData.length > 0) {
          setEmerging(emergingData as EmergingSkill[])
          isLive = true
        }

        // Fetch declining skills
        const { data: decliningData, error: decliningError } = await supabase
          .from('skills_catalog')
          .select('skill_name, skill_category, description')
          .eq('is_declining', true)
          .order('skill_name')

        if (!decliningError && decliningData && decliningData.length > 0) {
          setDeclining(decliningData as DecliningSkill[])
          isLive = true
        }

        // Fetch skills gap
        const { data: gapData, error: gapError } = await supabase
          .from('uta_skills_alignment')
          .select('skill_name, gap_status, demand_level, program_teaches, industry_demands, uta_programs(program_name)')
          .order('demand_level', { ascending: false })

        if (!gapError && gapData && gapData.length > 0) {
          const mapped: SkillsGapRecord[] = gapData.map((row: Record<string, unknown>) => {
            const prog = row.uta_programs as Record<string, unknown> | null
            return {
              skill_name: row.skill_name as string,
              program_name: (prog?.program_name as string) || 'Unknown',
              gap_status: row.gap_status as SkillsGapRecord['gap_status'],
              demand_level: row.demand_level as string,
              is_emerging: false,
            }
          })
          setSkillsGap(mapped)
          isLive = true
        }

        setDataSource(isLive ? 'live' : 'fallback')
      } catch (err) {
        console.warn('Supabase skills data unavailable, using fallback:', err)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchSkillsData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading skills demand data...</p>
        </div>
      </div>
    )
  }

  const gapCount = skillsGap.filter(s => s.gap_status === 'gap').length
  const alignedCount = skillsGap.filter(s => s.gap_status === 'aligned').length
  const maxPostingPct = emerging.length > 0 ? Math.max(...emerging.map(s => s.posting_percentage || 0)) : 1

  return (
    <div>
      {/* Header */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-h3 text-white mb-2">Skills Demand Intelligence</h2>
            <p className="text-body text-neutral-400">
              Real-time analysis of emerging and declining skills in the DFW job market, with gap analysis showing
              what employers need vs. what the university pipeline produces.
            </p>
          </div>
          <button
            onClick={() => askAgent?.('What are the most in-demand emerging skills in DFW and how do they map to Grapevine employers?')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors shrink-0"
          >
            Analyze with AI Agent
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-8">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-green-400">{emerging.length} emerging skills</span>
          <span className="text-neutral-600">|</span>
          <span className="text-red-400">{declining.length} declining skills</span>
          <span className="text-neutral-600">|</span>
          <span className="text-yellow-400">{gapCount} skill gaps</span>
          <span className="text-neutral-600">|</span>
          <span className="text-accent">{alignedCount} aligned</span>
          <span className="text-neutral-500 text-xs ml-auto">Source: DFW Job Postings Analysis</span>
        </div>
      </div>

      {/* Emerging Skills */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Emerging Skills in DFW</h3>
          <span className="text-caption text-neutral-500 inline-flex items-center">By job posting share<InfoTooltip text="Percentage of all DFW job postings that mention this skill. Bar width is normalized to the top skill." /></span>
        </div>
        <div className="p-6 space-y-4">
          {emerging.map((skill) => {
            const cat = CATEGORY_COLORS[skill.skill_category] || CATEGORY_COLORS.other
            const widthPct = maxPostingPct > 0 ? Math.round(((skill.posting_percentage || 0) / maxPostingPct) * 100) : 0
            return (
              <div key={skill.skill_name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium">{skill.skill_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat.bg} ${cat.text}`}>
                      {CATEGORY_LABELS[skill.skill_category] || skill.skill_category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-neutral-400">{skill.job_posting_count} postings</span>
                    <span className="text-accent font-mono">${((skill.avg_salary_with_skill || 0) / 1000).toFixed(0)}K avg</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-5 bg-ink-medium rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-accent/30 rounded-lg transition-all duration-500 group-hover:bg-accent/50"
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <span className="text-accent font-mono text-sm w-14 text-right">{skill.posting_percentage}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Skills Gap Analysis */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Skills Gap Analysis</h3>
          <span className="text-caption text-neutral-500">What employers need vs. what the pipeline produces</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Skill</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Program</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium"><span className="inline-flex items-center justify-center">Status<InfoTooltip align="center" text={<><p className="mb-1.5"><span className="text-red-400 font-medium">Gap</span> — Skill in demand by employers but not taught in the program curriculum.</p><p className="mb-1.5"><span className="text-green-400 font-medium">Aligned</span> — Program teaches this skill and employers demand it.</p><p><span className="text-blue-400 font-medium">Surplus</span> — Program teaches this skill but employer demand is low.</p></>} /></span></th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium"><span className="inline-flex items-center justify-center">Demand<InfoTooltip align="center" text={<><p><span className="text-red-400 font-medium">High</span> — Skill appears in 20%+ of relevant DFW job postings.</p><p><span className="text-yellow-400 font-medium">Medium</span> — Skill appears in 10–20% of postings.</p><p><span className="text-neutral-400 font-medium">Low</span> — Skill appears in fewer than 10% of postings.</p></>} /></span></th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium"><span className="inline-flex items-center justify-center">Trend<InfoTooltip align="right" text="Rising = skill is growing in market demand based on 12-week job posting trend analysis. Stable = consistent baseline demand with no significant change." /></span></th>
              </tr>
            </thead>
            <tbody>
              {skillsGap.map((record, idx) => {
                const statusConfig = {
                  gap: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Gap' },
                  aligned: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Aligned' },
                  surplus: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Surplus' },
                }
                const demandConfig: Record<string, { text: string }> = {
                  high: { text: 'text-red-400' },
                  medium: { text: 'text-yellow-400' },
                  low: { text: 'text-neutral-400' },
                }
                const status = statusConfig[record.gap_status]
                const demand = demandConfig[record.demand_level] || demandConfig.medium
                return (
                  <tr key={idx} className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors">
                    <td className="p-4">
                      <span className="text-white text-sm">{record.skill_name}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-neutral-400 text-sm">{record.program_name}</span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`text-xs font-medium capitalize ${demand.text}`}>
                        {record.demand_level}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {record.is_emerging ? (
                        <span className="text-green-400 text-xs font-medium">Rising</span>
                      ) : (
                        <span className="text-neutral-500 text-xs">Stable</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Declining Skills */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border">
          <h3 className="text-h4 text-white">Declining Skills</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {declining.map((skill) => {
              const cat = CATEGORY_COLORS[skill.skill_category] || CATEGORY_COLORS.other
              return (
                <div key={skill.skill_name} className="bg-ink-medium/50 border border-ink-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white text-sm font-medium">{skill.skill_name}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${cat.bg} ${cat.text}`}>
                      {CATEGORY_LABELS[skill.skill_category] || skill.skill_category}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-xs leading-relaxed">{skill.description}</p>
                </div>
              )
            })}
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
          <span>Source: DFW job posting analysis, BLS, skills_catalog</span>
        </div>
        <button
          onClick={() => askAgent?.('What skills gaps should Grapevine employers be most concerned about?')}
          className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          Expand with AI Agent
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
