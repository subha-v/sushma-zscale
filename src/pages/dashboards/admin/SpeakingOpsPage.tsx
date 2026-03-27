import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface SpeakingOp {
  id: string
  conference_name: string
  organizer: string | null
  cfp_deadline: string | null
  event_date_start: string | null
  event_date_end: string | null
  location: string | null
  audience_size: number | null
  status: 'researching' | 'drafting' | 'submitted' | 'accepted' | 'rejected'
  proposal_title: string | null
  estimated_cost: number | null
  topic_tags: string[]
}

const MOCK_OPS: SpeakingOp[] = [
  // FREE / LOW-COST LOCAL OPPORTUNITIES (prioritized)
  { id: "sp-10", conference_name: "Rotary Club of Arlington", organizer: "Rotary International", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Arlington, TX", audience_size: 50, status: "researching", proposal_title: "How AI Is Transforming Workforce Development in Arlington", estimated_cost: 0, topic_tags: ["civic", "local", "ai"] },
  { id: "sp-11", conference_name: "Workforce Solutions Tarrant County Board Meeting", organizer: "Workforce Solutions Tarrant County", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Fort Worth, TX", audience_size: 30, status: "researching", proposal_title: "AI-Powered Workforce Intelligence for Regional Planning", estimated_cost: 0, topic_tags: ["workforce", "b2g"] },
  { id: "sp-12", conference_name: "Arlington EDC Board Meeting", organizer: "Arlington Economic Development Corp", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "Arlington City Hall", audience_size: 20, status: "researching", proposal_title: "Workforce Data to Support Site Selection Decisions", estimated_cost: 0, topic_tags: ["edc", "local"] },
  { id: "sp-13", conference_name: "Global AI DFW Meetup at UTA", organizer: "Global AI Community", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "UTA SEIR Building, Arlington, TX", audience_size: 60, status: "researching", proposal_title: "Building an AI Agent for Workforce Intelligence with Claude and Supabase", estimated_cost: 0, topic_tags: ["ai", "tech", "uta"] },
  { id: "sp-14", conference_name: "AI Tinkerers DFW", organizer: "AI Tinkerers", cfp_deadline: null, event_date_start: null, event_date_end: null, location: "DFW, TX", audience_size: 50, status: "researching", proposal_title: "Live Demo: AI Workforce Intelligence Agent", estimated_cost: 0, topic_tags: ["ai", "demo", "tech"] },
  { id: "sp-15", conference_name: "Cross Timbers APEX Accelerator GPC 2026", organizer: "UTA / APEX Accelerator", cfp_deadline: "2026-05-15", event_date_start: "2026-07-29", event_date_end: "2026-07-29", location: "UTA, Arlington, TX", audience_size: 200, status: "researching", proposal_title: "How AI and Data Analytics Can Win Government Contracts", estimated_cost: 50, topic_tags: ["govcon", "wosb", "uta"] },
  { id: "sp-16", conference_name: "TWC Texas Conference for Employers", organizer: "Texas Workforce Commission", cfp_deadline: "2026-04-30", event_date_start: null, event_date_end: null, location: "Dallas, TX", audience_size: 200, status: "researching", proposal_title: "AI-Powered Workforce Analytics for Employer Decision-Making", estimated_cost: 0, topic_tags: ["workforce", "employers"] },
  { id: "sp-17", conference_name: "DFW Startup Week 2026", organizer: "Launch DFW", cfp_deadline: "2026-05-30", event_date_start: "2026-08-17", event_date_end: "2026-08-21", location: "Dallas/Fort Worth, TX", audience_size: 2000, status: "researching", proposal_title: "B2G Startups: Selling AI to Government", estimated_cost: 0, topic_tags: ["startup", "b2g"] },
  { id: "sp-18", conference_name: "Higher Education Compliance Conference", organizer: "HCCA/SCCE", cfp_deadline: "2026-04-15", event_date_start: "2026-06-07", event_date_end: "2026-06-09", location: "San Antonio, TX", audience_size: 400, status: "researching", proposal_title: "HB8 Compliance Automation Through AI-Powered Program ROI Scoring", estimated_cost: 600, topic_tags: ["hb8", "compliance", "higher_ed"] },
  { id: "sp-19", conference_name: "TEDC Mid-Year Conference", organizer: "Texas Economic Development Council", cfp_deadline: "2026-04-30", event_date_start: "2026-06-17", event_date_end: "2026-06-19", location: "Plano, TX", audience_size: 300, status: "researching", proposal_title: "Real-Time Talent Pipeline Data for Site Selection", estimated_cost: 500, topic_tags: ["edc", "texas"] },
  // NATIONAL CONFERENCES (higher cost, kept for reference)
  { id: "sp-1", conference_name: "Texas Workforce Conference 2026", organizer: "Texas Workforce Commission", cfp_deadline: "2026-04-15", event_date_start: "2026-06-18", event_date_end: "2026-06-20", location: "Austin, TX", audience_size: 800, status: "drafting", proposal_title: "AI-Powered Workforce Intelligence: From Data Silos to Decision Engines", estimated_cost: 1200, topic_tags: ["workforce", "ai"] },
  { id: "sp-2", conference_name: "NACUBO Annual Meeting", organizer: "NACUBO", cfp_deadline: "2026-05-01", event_date_start: "2026-07-19", event_date_end: "2026-07-22", location: "Nashville, TN", audience_size: 2500, status: "researching", proposal_title: "Program ROI Scoring: A Data-Driven Approach to HB8 Compliance", estimated_cost: 2800, topic_tags: ["higher_ed", "roi"] },
  { id: "sp-3", conference_name: "IEDC Annual Conference", organizer: "International Economic Development Council", cfp_deadline: "2026-06-01", event_date_start: "2026-09-14", event_date_end: "2026-09-17", location: "Denver, CO", audience_size: 1800, status: "researching", proposal_title: "Site Selection in the AI Era: Real-Time Talent Pipeline Data", estimated_cost: 3200, topic_tags: ["edc", "site_selection"] },
  { id: "sp-4", conference_name: "South by Southwest EDU", organizer: "SXSW", cfp_deadline: "2026-08-15", event_date_start: "2027-03-03", event_date_end: "2027-03-06", location: "Austin, TX", audience_size: 5000, status: "researching", proposal_title: null, estimated_cost: 1500, topic_tags: ["edtech"] },
]

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  researching: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Researching' },
  drafting: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Drafting' },
  submitted: { color: 'text-accent', bg: 'bg-accent/10', label: 'Submitted' },
  accepted: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Accepted' },
  rejected: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Rejected' },
}

type FilterTab = 'all' | 'upcoming' | 'confirmed' | 'submitted'

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export default function SpeakingOpsPage() {
  const askAgent = useAskAgent()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [ops, setOps] = useState<SpeakingOp[]>(MOCK_OPS)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchOps() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('speaking_opportunities')
          .select('*')
          .order('cfp_deadline', { ascending: true })

        if (error || !data || data.length === 0) {
          console.warn('Supabase speaking_opportunities unavailable, using fallback data')
          setOps(MOCK_OPS)
          setDataSource('fallback')
        } else {
          setOps(data as SpeakingOp[])
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setOps(MOCK_OPS)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchOps()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading speaking opportunities...</p>
        </div>
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const filtered = filter === 'all' ? ops
    : filter === 'upcoming' ? ops.filter(o => o.cfp_deadline && o.cfp_deadline >= today)
    : filter === 'confirmed' ? ops.filter(o => o.status === 'accepted')
    : ops.filter(o => o.status === 'submitted')

  const stats = {
    total: ops.length,
    upcoming: ops.filter(o => o.cfp_deadline && o.cfp_deadline >= today).length,
    confirmed: ops.filter(o => o.status === 'accepted').length,
    totalCost: ops.reduce((sum, o) => sum + (o.estimated_cost || 0), 0),
  }

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{stats.total} opportunities</span>
          <span className="text-neutral-600">|</span>
          <span className="text-accent">{stats.upcoming} upcoming deadlines</span>
          <span className="text-neutral-600">|</span>
          <span className="text-green-400">{stats.confirmed} confirmed</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300">Est. ${stats.totalCost.toLocaleString()} total</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {([
          { key: 'all', label: `All (${stats.total})` },
          { key: 'upcoming', label: `Upcoming Deadlines (${stats.upcoming})` },
          { key: 'confirmed', label: `Confirmed (${stats.confirmed})` },
          { key: 'submitted', label: `Submitted (${ops.filter(o => o.status === 'submitted').length})` },
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

      {/* Speaking Opportunity Cards */}
      <div className="space-y-4">
        {filtered.map((op) => {
          const status = STATUS_CONFIG[op.status]
          const deadlineDays = daysUntil(op.cfp_deadline)
          const isUrgent = deadlineDays !== null && deadlineDays >= 0 && deadlineDays <= 14

          return (
            <div key={op.id} className="card-skeuomorphic rounded-xl p-5 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium">{op.conference_name}</h4>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {op.organizer && <span className="text-neutral-500 text-xs">{op.organizer}</span>}
                    {op.location && (
                      <>
                        <span className="text-neutral-700">|</span>
                        <span className="text-neutral-500 text-xs">{op.location}</span>
                      </>
                    )}
                    {op.audience_size && (
                      <>
                        <span className="text-neutral-700">|</span>
                        <span className="text-neutral-500 text-xs">{op.audience_size.toLocaleString()} attendees</span>
                      </>
                    )}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                  {status.label}
                </span>
              </div>

              {/* Dates Row */}
              <div className="flex items-center gap-6 mb-3 flex-wrap text-sm">
                {op.event_date_start && (
                  <div>
                    <span className="text-neutral-500 text-xs block">Event</span>
                    <span className="text-neutral-300">
                      {new Date(op.event_date_start).toLocaleDateString()}
                      {op.event_date_end && ` - ${new Date(op.event_date_end).toLocaleDateString()}`}
                    </span>
                  </div>
                )}
                {op.cfp_deadline && (
                  <div>
                    <span className="text-neutral-500 text-xs block">CFP Deadline</span>
                    <span className={isUrgent ? 'text-red-400 font-medium' : 'text-neutral-300'}>
                      {new Date(op.cfp_deadline).toLocaleDateString()}
                      {deadlineDays !== null && deadlineDays >= 0 && (
                        <span className={`ml-1 text-xs ${isUrgent ? 'text-red-400' : 'text-neutral-500'}`}>
                          ({deadlineDays} days left)
                        </span>
                      )}
                      {deadlineDays !== null && deadlineDays < 0 && (
                        <span className="ml-1 text-xs text-neutral-500">(passed)</span>
                      )}
                    </span>
                  </div>
                )}
                {op.estimated_cost !== null && (
                  <div>
                    <span className="text-neutral-500 text-xs block">Est. Cost</span>
                    <span className="text-neutral-300 font-mono">${op.estimated_cost.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {op.proposal_title && (
                <div className="bg-ink-medium/50 rounded-lg px-3 py-2 mb-3">
                  <span className="text-neutral-500 text-xs">Proposal: </span>
                  <span className="text-neutral-300 text-sm">{op.proposal_title}</span>
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {op.topic_tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-ink-medium rounded text-xs text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => askAgent?.(`Help me draft a proposal for ${op.conference_name}: "${op.proposal_title || 'workforce intelligence topic'}"`)}
                className="text-accent hover:text-accent-hover text-xs transition-colors"
              >
                Draft Proposal with AI
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-skeuomorphic rounded-xl p-8 text-center">
          <p className="text-neutral-400">No opportunities matching this filter.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
          {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
        </span>
      </div>
    </div>
  )
}
