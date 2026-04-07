import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface PipelineRecord {
  program_name: string
  degree_type: string
  college_name: string
  employer_name: string
  industry: string
  partnership_type: string
  annual_hires: number
  avg_intern_salary: number
  description: string
}

const MOCK_PIPELINE: PipelineRecord[] = [
  { program_name: 'Nursing', degree_type: 'BSN', college_name: 'College of Nursing and Health Innovation', employer_name: 'Texas Health Resources', industry: 'Healthcare', partnership_type: 'hiring_pipeline', annual_hires: 45, avg_intern_salary: 58000, description: 'Texas Health Resources is the #1 employer of UTA BSN grads.' },
  { program_name: 'Computer Science', degree_type: 'BS', college_name: 'College of Engineering', employer_name: 'Lockheed Martin Aeronautics', industry: 'Aerospace & Defense', partnership_type: 'hiring_pipeline', annual_hires: 25, avg_intern_salary: 62000, description: 'Lockheed Martin recruits heavily from UTA CS.' },
  { program_name: 'Computer Science', degree_type: 'BS', college_name: 'College of Engineering', employer_name: 'Amazon - DFW Fulfillment', industry: 'E-Commerce / Logistics', partnership_type: 'hiring_pipeline', annual_hires: 20, avg_intern_salary: 62000, description: 'Amazon recruits UTA CS grads for SDE roles.' },
  { program_name: 'Mechanical Engineering', degree_type: 'BS', college_name: 'College of Engineering', employer_name: 'Bell Textron', industry: 'Aerospace & Defense', partnership_type: 'internship', annual_hires: 12, avg_intern_salary: 55000, description: 'Bell hires UTA ME interns for rotorcraft design.' },
  { program_name: 'Accounting', degree_type: 'BBA', college_name: 'College of Business', employer_name: 'Deloitte', industry: 'Professional Services', partnership_type: 'hiring_pipeline', annual_hires: 12, avg_intern_salary: 52000, description: 'Deloitte recruits from UTA accounting program.' },
  { program_name: 'Aerospace Engineering', degree_type: 'BS', college_name: 'College of Engineering', employer_name: 'Bell Textron', industry: 'Aerospace & Defense', partnership_type: 'hiring_pipeline', annual_hires: 10, avg_intern_salary: 58000, description: 'Bell Textron hires UTA Aerospace graduates for rotorcraft programs.' },
  { program_name: 'Data Science', degree_type: 'BS', college_name: 'College of Science', employer_name: 'Amazon - DFW Fulfillment', industry: 'E-Commerce / Logistics', partnership_type: 'hiring_pipeline', annual_hires: 8, avg_intern_salary: 60000, description: 'Amazon recruits Data Science grads for analytics roles.' },
  { program_name: 'Software Engineering', degree_type: 'BS', college_name: 'College of Engineering', employer_name: 'Lockheed Martin Aeronautics', industry: 'Aerospace & Defense', partnership_type: 'hiring_pipeline', annual_hires: 8, avg_intern_salary: 62000, description: 'Lockheed recruits UTA SE grads for F-35 software teams.' },
  { program_name: 'Finance', degree_type: 'BBA', college_name: 'College of Business', employer_name: 'GM Financial', industry: 'Financial Services', partnership_type: 'hiring_pipeline', annual_hires: 6, avg_intern_salary: 50000, description: 'GM Financial recruits UTA finance grads.' },
]

const PARTNERSHIP_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  hiring_pipeline: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Hiring Pipeline' },
  internship: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Internship' },
  co_op: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Co-Op' },
  advisory_board: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Advisory Board' },
  research: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Research' },
}

export default function TalentPipelinePage() {
  const askAgent = useAskAgent()
  const [pipeline, setPipeline] = useState<PipelineRecord[]>(MOCK_PIPELINE)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')
  const [filterIndustry, setFilterIndustry] = useState<string>('all')

  useEffect(() => {
    async function fetchPipeline() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('uta_employer_partnerships')
          .select('*, uta_programs(program_name, degree_type, uta_colleges(college_name)), arlington_employers(company_name, industry, employee_count)')
          .eq('is_active', true)
          .order('avg_hires_per_year', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase talent pipeline unavailable, using fallback data')
          setPipeline(MOCK_PIPELINE)
          setDataSource('fallback')
        } else {
          const mapped: PipelineRecord[] = data.map((row: Record<string, unknown>) => {
            const prog = row.uta_programs as Record<string, unknown> | null
            const college = prog?.uta_colleges as Record<string, unknown> | null
            const employer = row.arlington_employers as Record<string, unknown> | null
            return {
              program_name: (prog?.program_name as string) || 'Unknown',
              degree_type: (prog?.degree_type as string) || '',
              college_name: (college?.college_name as string) || '',
              employer_name: (employer?.company_name as string) || 'Unknown',
              industry: (employer?.industry as string) || '',
              partnership_type: (row.partnership_type as string) || 'hiring_pipeline',
              annual_hires: Number(row.avg_hires_per_year) || 0,
              avg_intern_salary: Number(row.avg_intern_salary) || 0,
              description: (row.description as string) || '',
            }
          })
          setPipeline(mapped)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setPipeline(MOCK_PIPELINE)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchPipeline()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading talent pipeline data...</p>
        </div>
      </div>
    )
  }

  const industries = Array.from(new Set(pipeline.map(p => p.industry).filter(Boolean))).sort()
  const filtered = filterIndustry === 'all' ? pipeline : pipeline.filter(p => p.industry === filterIndustry)

  const totalHires = pipeline.reduce((s, p) => s + (p.annual_hires || 0), 0)
  const uniquePrograms = new Set(pipeline.map(p => p.program_name)).size
  const uniqueEmployers = new Set(pipeline.map(p => p.employer_name)).size

  // Aggregate by program for the flow visualization
  const programAgg = Object.entries(
    filtered.reduce((acc, r) => {
      const name = r.program_name || 'Unknown'
      if (!acc[name]) acc[name] = { hires: 0, employers: new Set<string>(), salary: 0, count: 0 }
      acc[name].hires += (r.annual_hires || 0)
      acc[name].employers.add(r.employer_name || 'Unknown')
      acc[name].salary += (r.avg_intern_salary || 0)
      acc[name].count += 1
      return acc
    }, {} as Record<string, { hires: number; employers: Set<string>; salary: number; count: number }>)
  ).map(([name, data]) => ({
    name,
    hires: data.hires,
    employerCount: data.employers.size,
    avgSalary: data.count > 0 ? Math.round(data.salary / data.count) : 0,
  })).sort((a, b) => b.hires - a.hires)

  const maxHires = programAgg.length > 0 ? Math.max(...programAgg.map(p => p.hires)) : 1

  return (
    <div>
      {/* Header */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-h3 text-white mb-2">Talent Pipeline</h2>
            <p className="text-body text-neutral-400">
              UTA program-to-employer talent flow. See which academic programs feed into which DFW employers,
              annual hire volumes, and partnership types.
            </p>
          </div>
          <button
            onClick={() => askAgent?.('What is the talent pipeline for technology companies considering Grapevine?')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors shrink-0"
          >
            Analyze with AI Agent
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Annual Hires</p>
          <p className="text-3xl font-display font-bold text-white">{totalHires.toLocaleString()}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">UTA Programs</p>
          <p className="text-3xl font-display font-bold text-accent">{uniquePrograms}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Employers</p>
          <p className="text-3xl font-display font-bold text-green-400">{uniqueEmployers}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Partnerships</p>
          <p className="text-3xl font-display font-bold text-white">{pipeline.length}</p>
        </div>
      </div>

      {/* Industry Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setFilterIndustry('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filterIndustry === 'all'
              ? 'bg-accent text-ink'
              : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
          }`}
        >
          All Industries
        </button>
        {industries.map(ind => (
          <button
            key={ind}
            onClick={() => setFilterIndustry(ind)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filterIndustry === ind
                ? 'bg-accent text-ink'
                : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Program Flow Visualization */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border">
          <h3 className="text-h4 text-white">Annual Hires by Program</h3>
        </div>
        <div className="p-6 space-y-4">
          {programAgg.length === 0 ? (
            <p className="text-neutral-500 text-sm text-center py-4">No pipeline data for this filter</p>
          ) : programAgg.map((prog) => {
            const widthPct = maxHires > 0 ? Math.round((prog.hires / maxHires) * 100) : 0
            return (
              <div key={prog.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-white text-sm font-medium">{prog.name}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-neutral-400">{prog.employerCount} employer{prog.employerCount !== 1 ? 's' : ''}</span>
                    <span className="text-neutral-400">${Math.round(prog.avgSalary / 1000)}K avg salary</span>
                    <span className="text-accent font-mono font-medium">{prog.hires}/yr</span>
                  </div>
                </div>
                <div className="h-5 bg-ink-medium rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-accent/30 rounded-lg transition-all duration-500 group-hover:bg-accent/50"
                    style={{ width: `${widthPct}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Partnership Details Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden mb-8">
        <div className="p-4 border-b border-ink-border flex items-center justify-between">
          <h3 className="text-h4 text-white">Partnership Details</h3>
          <span className="text-caption text-neutral-500">{filtered.length} partnerships</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Program</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Employer</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Type</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Hires/Yr</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Avg Salary</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-neutral-500">
                    No partnerships found for this industry
                  </td>
                </tr>
              ) : filtered.map((record, idx) => {
                const ptype = PARTNERSHIP_CONFIG[record.partnership_type] || PARTNERSHIP_CONFIG.hiring_pipeline
                return (
                  <tr key={idx} className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors">
                    <td className="p-4">
                      <p className="text-white text-sm font-medium">{record.program_name} {record.degree_type}</p>
                      <p className="text-neutral-500 text-xs">{record.college_name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-neutral-300 text-sm">{record.employer_name}</p>
                      <p className="text-neutral-500 text-xs">{record.industry}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${ptype.bg} ${ptype.text}`}>
                        {ptype.label}
                      </span>
                    </td>
                    <td className="p-4 text-right text-accent font-mono text-sm">
                      {record.annual_hires || 0}
                    </td>
                    <td className="p-4 text-right text-neutral-300 font-mono text-sm">
                      ${(record.avg_intern_salary || 0).toLocaleString()}
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
          <span>Source: UTA Institutional Research, employer partnerships, career center data</span>
        </div>
        <button
          onClick={() => askAgent?.('Show me the full talent pipeline from UTA programs to Grapevine and Arlington employers')}
          className="text-accent hover:text-accent-hover transition-colors flex items-center gap-1"
        >
          Expand with AI Agent
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
