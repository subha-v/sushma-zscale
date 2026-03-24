import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface ComplianceReport {
  id: string
  report_type: string
  program_name: string | null
  title: string
  status: 'draft' | 'pending_review' | 'approved' | 'submitted' | 'expired'
  credential_value_pass: boolean | null
  wage_threshold_pass: boolean | null
  employment_threshold_pass: boolean | null
  key_findings: string[]
  recommendations: string[]
  created_at: string
}

const MOCK_REPORTS: ComplianceReport[] = [
  { id: "cr-1", report_type: "hb8", program_name: "Computer Science BS", title: "HB8 Compliance Report - Computer Science BS (2025)", status: "approved", credential_value_pass: true, wage_threshold_pass: true, employment_threshold_pass: true, key_findings: ["Median starting salary $71,500 exceeds HB8 wage threshold by 19%", "Employment rate 84% well above required 70%", "Strong employer demand from Lockheed Martin, Amazon, TI, and Bell Textron", "GenAI coursework addition improved skills alignment to 80%"], recommendations: ["Continue expanding cloud computing and AI/ML lab capacity", "Develop cybersecurity specialization track"], created_at: "2025-03-01" },
  { id: "cr-2", report_type: "hb8", program_name: "Nursing BSN", title: "HB8 Compliance Report - Nursing BSN (2025)", status: "approved", credential_value_pass: true, wage_threshold_pass: true, employment_threshold_pass: true, key_findings: ["Highest employment rate at 94% across all programs", "Median salary $73,200 well above threshold", "DFW nursing shortage accelerating demand", "Telehealth certification achieving 85% uptake"], recommendations: ["Expand clinical simulation capacity", "Develop nurse practitioner pathway"], created_at: "2025-03-01" },
  { id: "cr-3", report_type: "hb8", program_name: "Accounting BBA", title: "HB8 Compliance Report - Accounting BBA (2025)", status: "pending_review", credential_value_pass: false, wage_threshold_pass: false, employment_threshold_pass: true, key_findings: ["Median salary $57,800 still below HB8 credential-of-value threshold", "Employment rate 77% meets minimum but declining", "CPA pass rate declined 3% year over year", "Data analytics pilot showing early promise"], recommendations: ["Accelerate data analytics integration", "Launch forensic accounting specialization by Fall 2025", "Establish Big 4 firm placement guarantee program"], created_at: "2025-02-15" },
  { id: "cr-4", report_type: "board_report", program_name: null, title: "Q1 2025 Board of Regents Report - Program Performance", status: "submitted", credential_value_pass: null, wage_threshold_pass: null, employment_threshold_pass: null, key_findings: ["4 of 9 programs meet credential-of-value standards (unchanged)", "2 programs remain at-risk — Accounting and Biology", "Average employment rate: 81.1% (up from 80.1%)", "Overall salary growth of 4.1% year-over-year"], recommendations: ["Prioritize at-risk program intervention plans by May 2025", "Expand industry advisory boards to include AI/tech sector", "Invest in career services AI advisor expansion"], created_at: "2025-03-15" },
  { id: "cr-5", report_type: "hb8", program_name: "Biology BS", title: "HB8 Compliance Report - Biology BS (2025)", status: "draft", credential_value_pass: false, wage_threshold_pass: false, employment_threshold_pass: false, key_findings: ["Employment rate 63% still below 70% threshold", "Median salary $43,500 significantly below threshold", "New biotech corridor partnership announced but not yet reflected in outcomes"], recommendations: ["Fast-track biotech industry partnership pipeline", "Launch accelerated BS-to-MS pathway by Fall 2025", "Explore bioinformatics cross-listing with Data Science"], created_at: "2025-02-01" },
]

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', label: 'Draft' },
  pending_review: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Pending Review' },
  approved: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Approved' },
  submitted: { bg: 'bg-accent/20', text: 'text-accent', label: 'Submitted' },
  expired: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Expired' },
}

function PassFailBadge({ pass }: { pass: boolean | null }) {
  if (pass === null) return <span className="text-neutral-600 text-xs">N/A</span>
  return pass ? (
    <span className="text-green-400 text-xs font-medium">PASS</span>
  ) : (
    <span className="text-red-400 text-xs font-medium">FAIL</span>
  )
}

export default function ComplianceReportsPage() {
  const askAgent = useAskAgent()
  const [reports, setReports] = useState<ComplianceReport[]>(MOCK_REPORTS)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchReports() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('compliance_reports')
          .select('*, uta_programs(program_name)')
          .order('created_at', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase compliance_reports unavailable, using fallback data')
          setReports(MOCK_REPORTS)
          setDataSource('fallback')
        } else {
          const mapped: ComplianceReport[] = data.map((row: Record<string, unknown>) => {
            const prog = row.uta_programs as Record<string, unknown> | null
            return {
              id: row.id as string,
              report_type: row.report_type as string,
              program_name: (prog?.program_name as string) || null,
              title: row.title as string,
              status: row.status as ComplianceReport['status'],
              credential_value_pass: row.credential_value_pass as boolean | null,
              wage_threshold_pass: row.wage_threshold_pass as boolean | null,
              employment_threshold_pass: row.employment_threshold_pass as boolean | null,
              key_findings: (row.key_findings as string[]) || [],
              recommendations: (row.recommendations as string[]) || [],
              created_at: row.created_at as string,
            }
          })
          setReports(mapped)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setReports(MOCK_REPORTS)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading compliance reports from database...</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'approved').length,
    pending: reports.filter(r => r.status === 'pending_review').length,
    failing: reports.filter(r => r.credential_value_pass === false).length,
  }

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{stats.total} reports</span>
          <span className="text-neutral-600">|</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-neutral-300">{stats.approved} approved</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-neutral-300">{stats.pending} pending</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-neutral-300">{stats.failing} non-compliant</span>
          </span>
        </div>
      </div>

      {/* Generate New Report Button */}
      <div className="mb-6">
        <button
          onClick={() => askAgent?.('Generate a new HB8 compliance report for all programs')}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors"
        >
          Generate New Report with AI
        </button>
      </div>

      {/* Reports Table */}
      <div className="card-skeuomorphic rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-ink-border bg-ink-medium/50">
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Report</th>
                <th className="text-left p-4 text-neutral-500 text-sm font-medium">Type</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Status</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">CoV</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Wage</th>
                <th className="text-center p-4 text-neutral-500 text-sm font-medium">Employment</th>
                <th className="text-right p-4 text-neutral-500 text-sm font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => {
                const statusConfig = STATUS_CONFIG[report.status]
                return (
                  <tr
                    key={report.id}
                    className="border-b border-ink-border/50 hover:bg-ink-medium/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-white font-medium text-sm">{report.title}</p>
                      {report.program_name && (
                        <p className="text-neutral-500 text-xs mt-0.5">{report.program_name}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-ink-medium rounded text-xs text-neutral-300 capitalize">
                        {report.report_type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <PassFailBadge pass={report.credential_value_pass} />
                    </td>
                    <td className="p-4 text-center">
                      <PassFailBadge pass={report.wage_threshold_pass} />
                    </td>
                    <td className="p-4 text-center">
                      <PassFailBadge pass={report.employment_threshold_pass} />
                    </td>
                    <td className="p-4 text-right text-neutral-400 text-sm">
                      {new Date(report.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Detail Cards */}
      <div className="mt-8 space-y-4">
        <h3 className="text-h4 text-white">Report Details</h3>
        {reports.filter(r => r.key_findings.length > 0).map((report) => {
          const statusConfig = STATUS_CONFIG[report.status]
          return (
            <div key={report.id} className="card-skeuomorphic rounded-xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="text-white font-medium text-sm">{report.title}</h4>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs ${statusConfig.bg} ${statusConfig.text}`}>
                    {statusConfig.label}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Key Findings</p>
                  <ul className="space-y-1">
                    {report.key_findings.map((f, i) => (
                      <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Recommendations</p>
                  <ul className="space-y-1">
                    {report.recommendations.map((r, i) => (
                      <li key={i} className="text-neutral-300 text-xs flex items-start gap-2">
                        <span className="text-yellow-400 mt-0.5">→</span>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>
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
          <span>Source: THECB, UTA Institutional Research</span>
        </div>
        <button
          onClick={() => askAgent?.('Generate a custom compliance report')}
          className="text-accent hover:text-accent-hover transition-colors"
        >
          Generate custom report with AI
        </button>
      </div>
    </div>
  )
}
