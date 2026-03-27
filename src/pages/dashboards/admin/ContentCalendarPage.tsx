import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface ContentEntry {
  id: string
  platform: 'linkedin' | 'twitter' | 'blog' | 'newsletter'
  content_pillar: string | null
  draft_text: string | null
  scheduled_date: string | null
  status: 'draft' | 'scheduled' | 'posted' | 'skipped'
  topic_tags: string[]
  intelligence_item_title: string | null
}

const MOCK_ENTRIES: ContentEntry[] = [
  { id: "cc-1", platform: "linkedin", content_pillar: "thought_leadership", draft_text: "Texas just raised the bar on what counts as a 'credential of value.' Under updated HB8 guidelines, programs must demonstrate median wages 10% above regional median within 1 year of graduation.\n\nThis isn't just a compliance update — it's a signal.\n\n#WorkforceDevelopment #HigherEd #HB8", scheduled_date: "2026-03-24", status: "draft", topic_tags: ["hb8", "compliance"], intelligence_item_title: "Texas HB8 Implementation Update" },
  { id: "cc-2", platform: "linkedin", content_pillar: "market_intel", draft_text: "DFW aerospace just added 2,400 jobs in Q1 2026. Bell's V-280 Valor and Lockheed's F-35 programs are driving a talent surge.\n\nBut here's the real story: Tier 2/3 suppliers are now competing for the same engineers.\n\n#AerospaceDFW #EconomicDevelopment", scheduled_date: "2026-03-25", status: "scheduled", topic_tags: ["aerospace", "dfw"], intelligence_item_title: "DFW Aerospace Sector Adds 2,400 Jobs" },
  { id: "cc-3", platform: "newsletter", content_pillar: "weekly_digest", draft_text: "This week in workforce intelligence: HB8 threshold changes, DFW aerospace boom, AI literacy in community colleges, and Arlington's new innovation district.", scheduled_date: "2026-03-28", status: "draft", topic_tags: ["digest"], intelligence_item_title: null },
  { id: "cc-4", platform: "twitter", content_pillar: "data_point", draft_text: "2,400 new aerospace jobs in DFW in Q1 2026 alone. The talent pipeline question isn't IF — it's HOW FAST.", scheduled_date: "2026-03-26", status: "draft", topic_tags: ["aerospace"], intelligence_item_title: "DFW Aerospace Sector Adds 2,400 Jobs" },
  { id: "cc-5", platform: "linkedin", content_pillar: "product_update", draft_text: "We just shipped a new feature: real-time program ROI scoring against HB8 thresholds.\n\nEvery program. Every metric. Updated weekly.\n\nNo more waiting for annual compliance reports to find out your program is at risk.", scheduled_date: "2026-03-31", status: "scheduled", topic_tags: ["product", "hb8"], intelligence_item_title: null },
]

const PLATFORM_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  linkedin: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'LinkedIn' },
  twitter: { color: 'text-sky-400', bg: 'bg-sky-500/10', label: 'Twitter/X' },
  blog: { color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Blog' },
  newsletter: { color: 'text-orange-400', bg: 'bg-orange-500/10', label: 'Newsletter' },
}

const STATUS_COLORS: Record<string, { color: string; bg: string; label: string }> = {
  draft: { color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Draft' },
  scheduled: { color: 'text-accent', bg: 'bg-accent/10', label: 'Scheduled' },
  posted: { color: 'text-green-400', bg: 'bg-green-500/10', label: 'Posted' },
  skipped: { color: 'text-neutral-400', bg: 'bg-neutral-500/10', label: 'Skipped' },
}

type FilterTab = 'all' | 'draft' | 'scheduled' | 'posted'
type PlatformFilter = 'all' | 'linkedin' | 'twitter' | 'blog' | 'newsletter'

export default function ContentCalendarPage() {
  const askAgent = useAskAgent()
  const [statusFilter, setStatusFilter] = useState<FilterTab>('all')
  const [platformFilter, setPlatformFilter] = useState<PlatformFilter>('all')
  const [entries, setEntries] = useState<ContentEntry[]>(MOCK_ENTRIES)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchEntries() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('content_calendar')
          .select('*, intelligence_items(title)')
          .order('scheduled_date', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase content_calendar unavailable, using fallback data')
          setEntries(MOCK_ENTRIES)
          setDataSource('fallback')
        } else {
          const mapped: ContentEntry[] = data.map((row: Record<string, unknown>) => {
            const intel = row.intelligence_items as Record<string, unknown> | null
            return {
              id: row.id as string,
              platform: row.platform as ContentEntry['platform'],
              content_pillar: row.content_pillar as string | null,
              draft_text: row.draft_text as string | null,
              scheduled_date: row.scheduled_date as string | null,
              status: row.status as ContentEntry['status'],
              topic_tags: (row.topic_tags as string[]) || [],
              intelligence_item_title: (intel?.title as string) || null,
            }
          })
          setEntries(mapped)
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setEntries(MOCK_ENTRIES)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchEntries()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading content calendar...</p>
        </div>
      </div>
    )
  }

  let filtered = statusFilter === 'all' ? entries : entries.filter(e => e.status === statusFilter)
  if (platformFilter !== 'all') filtered = filtered.filter(e => e.platform === platformFilter)

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{entries.length} entries</span>
          <span className="text-neutral-600">|</span>
          <span className="text-yellow-400">{entries.filter(e => e.status === 'draft').length} drafts</span>
          <span className="text-neutral-600">|</span>
          <span className="text-accent">{entries.filter(e => e.status === 'scheduled').length} scheduled</span>
          <span className="text-neutral-600">|</span>
          <span className="text-green-400">{entries.filter(e => e.status === 'posted').length} posted</span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {(['all', 'draft', 'scheduled', 'posted'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === tab
                ? 'bg-accent text-ink'
                : 'bg-ink-medium text-neutral-400 hover:text-white border border-ink-border hover:border-accent/30'
            }`}
          >
            {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {(['all', 'linkedin', 'twitter', 'blog', 'newsletter'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPlatformFilter(p)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              platformFilter === p
                ? 'bg-ink-medium text-white border border-accent/30'
                : 'bg-ink-medium/50 text-neutral-500 hover:text-neutral-300 border border-ink-border'
            }`}
          >
            {p === 'all' ? 'All Platforms' : PLATFORM_CONFIG[p]?.label || p}
          </button>
        ))}
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {filtered.map((entry) => {
          const platform = PLATFORM_CONFIG[entry.platform]
          const status = STATUS_COLORS[entry.status]

          return (
            <div key={entry.id} className="card-skeuomorphic rounded-xl p-5 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${platform.bg} ${platform.color}`}>
                    {platform.label}
                  </span>
                  <span className={`px-2.5 py-1 rounded text-xs font-medium ${status.bg} ${status.color}`}>
                    {status.label}
                  </span>
                </div>
                <span className="text-neutral-500 text-xs">
                  {entry.scheduled_date ? new Date(entry.scheduled_date).toLocaleDateString() : 'No date'}
                </span>
              </div>

              {entry.draft_text && (
                <p className="text-neutral-300 text-sm whitespace-pre-line leading-relaxed mb-3">
                  {entry.draft_text.length > 300 ? entry.draft_text.slice(0, 300) + '...' : entry.draft_text}
                </p>
              )}

              {entry.intelligence_item_title && (
                <p className="text-neutral-500 text-xs mb-3">
                  Source: {entry.intelligence_item_title}
                </p>
              )}

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {entry.topic_tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-ink-medium rounded text-xs text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => askAgent?.(`Help me edit and improve this content draft: "${entry.draft_text?.slice(0, 100)}..."`)}
                className="text-accent hover:text-accent-hover text-xs transition-colors"
              >
                Edit with AI
              </button>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-skeuomorphic rounded-xl p-8 text-center">
          <p className="text-neutral-400">No content matching these filters.</p>
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
