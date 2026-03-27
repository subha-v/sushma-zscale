import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'

interface IntelligenceItem {
  id: string
  title: string
  url: string
  source: string
  source_category: string
  published_at: string | null
  scraped_at: string
  summary: string | null
  key_insight: string | null
  relevance: 'high' | 'medium' | 'low'
  status: 'new' | 'reviewed' | 'used' | 'archived' | 'priority'
  topic_tags: string[]
  audience_tags: string[]
}

const MOCK_ITEMS: IntelligenceItem[] = [
  { id: "intel-1", title: "Texas HB8 Implementation Update: Credential of Value Standards Tighten", url: "#", source: "Texas Higher Ed Coordinator", source_category: "policy_regulatory", published_at: "2026-03-20T12:00:00Z", scraped_at: "2026-03-21T06:30:00Z", summary: "New HB8 guidelines raise the wage threshold for credential-of-value designation. Programs must now demonstrate median wages 10% above regional median within 1 year of graduation.", key_insight: "Universities should audit programs against the new threshold now — non-compliant programs face funding cuts starting FY2027.", relevance: "high", status: "reviewed", topic_tags: ["hb8", "compliance"], audience_tags: ["universities"] },
  { id: "intel-2", title: "DFW Aerospace Sector Adds 2,400 Jobs in Q1 2026", url: "#", source: "Dallas Business Journal", source_category: "local_dfw", published_at: "2026-03-18T09:00:00Z", scraped_at: "2026-03-19T06:30:00Z", summary: "Bell Textron's V-280 Valor production ramp and Lockheed Martin F-35 sustainment operations drive DFW aerospace growth.", key_insight: "EDCs should prepare site selection packages targeting aerospace suppliers — Tier 2/3 supplier ecosystem is the next growth wave.", relevance: "high", status: "reviewed", topic_tags: ["aerospace", "jobs"], audience_tags: ["edcs"] },
  { id: "intel-3", title: "AI Literacy Requirements Expanding Across Texas Community Colleges", url: "#", source: "Community College Daily", source_category: "higher_ed", published_at: "2026-03-15T14:00:00Z", scraped_at: "2026-03-16T06:30:00Z", summary: "12 Texas community colleges piloting AI literacy modules in general education for Fall 2026.", key_insight: "Partnership opportunities for workforce platforms offering AI skills assessment.", relevance: "medium", status: "reviewed", topic_tags: ["ai", "curriculum"], audience_tags: ["universities"] },
  { id: "intel-4", title: "Labor Department Releases Updated O*NET Skills Framework", url: "#", source: "DOL Employment & Training", source_category: "federal_workforce", published_at: "2026-03-12T10:00:00Z", scraped_at: "2026-03-13T06:30:00Z", summary: "O*NET adds 47 new AI/ML competencies and revises 120+ occupation profiles.", key_insight: "Programs should map curriculum against updated O*NET framework — compliance reports will reference new competencies starting Q3 2026.", relevance: "high", status: "new", topic_tags: ["skills", "federal"], audience_tags: ["universities", "workforce_boards"] },
  { id: "intel-5", title: "Arlington EDC Announces $40M Innovation District Plan", url: "#", source: "Fort Worth Star-Telegram", source_category: "local_dfw", published_at: "2026-03-10T08:00:00Z", scraped_at: "2026-03-11T06:30:00Z", summary: "Arlington EDC plans $40M innovation district adjacent to UTA targeting biotech and AI startups.", key_insight: "Direct pipeline opportunity — UTA biotech and CS graduates will have immediate local employment pathways.", relevance: "high", status: "priority", topic_tags: ["arlington", "edc"], audience_tags: ["edcs", "universities"] },
  { id: "intel-6", title: "Workforce Innovation Act Reauthorization Moves Forward", url: "#", source: "National Skills Coalition", source_category: "federal_workforce", published_at: "2026-03-08T11:00:00Z", scraped_at: "2026-03-09T06:30:00Z", summary: "Senate committee advances WIOA reauthorization with expanded AI skills training funding.", key_insight: "TWC should prepare grant applications now — new funding formula favors regions with documented AI skills gap data.", relevance: "medium", status: "reviewed", topic_tags: ["wioa", "federal"], audience_tags: ["workforce_boards"] },
]

const RELEVANCE_CONFIG = {
  high: { bg: 'bg-accent/10', text: 'text-accent', label: 'High' },
  medium: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', label: 'Medium' },
  low: { bg: 'bg-neutral-500/10', text: 'text-neutral-400', label: 'Low' },
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  new: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'New' },
  reviewed: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Reviewed' },
  used: { bg: 'bg-neutral-500/10', text: 'text-neutral-400', label: 'Used' },
  archived: { bg: 'bg-neutral-700/10', text: 'text-neutral-500', label: 'Archived' },
  priority: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Priority' },
}

type FilterTab = 'all' | 'high' | 'new' | 'priority'

export default function IntelligenceFeed() {
  const askAgent = useAskAgent()
  const [filter, setFilter] = useState<FilterTab>('all')
  const [items, setItems] = useState<IntelligenceItem[]>(MOCK_ITEMS)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('intelligence_items')
          .select('*')
          .order('scraped_at', { ascending: false })
          .limit(100)

        if (error || !data || data.length === 0) {
          console.warn('Supabase intelligence_items unavailable, using fallback data')
          setItems(MOCK_ITEMS)
          setDataSource('fallback')
        } else {
          setItems(data as IntelligenceItem[])
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setItems(MOCK_ITEMS)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchItems()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading intelligence feed...</p>
        </div>
      </div>
    )
  }

  const filtered = filter === 'all' ? items
    : filter === 'high' ? items.filter(i => i.relevance === 'high')
    : filter === 'new' ? items.filter(i => i.status === 'new')
    : items.filter(i => i.status === 'priority')

  const stats = {
    total: items.length,
    enriched: items.filter(i => i.summary).length,
    highRelevance: items.filter(i => i.relevance === 'high').length,
    thisWeek: items.filter(i => {
      const d = new Date(i.scraped_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return d >= weekAgo
    }).length,
  }

  return (
    <div>
      {/* Compact Metrics Bar */}
      <div className="card-skeuomorphic rounded-xl px-5 py-3 mb-6">
        <div className="flex items-center gap-6 flex-wrap text-sm">
          <span className="text-neutral-400">{stats.total} items</span>
          <span className="text-neutral-600">|</span>
          <span className="text-accent">{stats.enriched} enriched</span>
          <span className="text-neutral-600">|</span>
          <span className="text-green-400">{stats.highRelevance} high relevance</span>
          <span className="text-neutral-600">|</span>
          <span className="text-neutral-300">{stats.thisWeek} this week</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {([
          { key: 'all', label: `All (${stats.total})` },
          { key: 'high', label: `High Relevance (${stats.highRelevance})` },
          { key: 'new', label: `New (${items.filter(i => i.status === 'new').length})` },
          { key: 'priority', label: `Priority (${items.filter(i => i.status === 'priority').length})` },
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

      {/* Item Cards */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const relevance = RELEVANCE_CONFIG[item.relevance]
          const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.new

          return (
            <div key={item.id} className="card-skeuomorphic rounded-xl p-5 hover:border-accent/30 transition-all duration-300">
              <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-medium hover:text-accent transition-colors"
                  >
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-neutral-500 text-xs">{item.source}</span>
                    <span className="text-neutral-700">|</span>
                    <span className="text-neutral-500 text-xs">
                      {item.published_at ? new Date(item.published_at).toLocaleDateString() : 'No date'}
                    </span>
                    {item.url && item.url !== '#' && (
                      <>
                        <span className="text-neutral-700">|</span>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-neutral-500 text-xs hover:text-accent transition-colors truncate max-w-[200px]"
                        >
                          {item.url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
                        </a>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${relevance.bg} ${relevance.text}`}>
                    {relevance.label}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${status.bg} ${status.text}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {item.summary && (
                <p className="text-neutral-400 text-sm mb-2 leading-relaxed">{item.summary}</p>
              )}

              {item.key_insight && (
                <div className="bg-accent/5 border border-accent/10 rounded-lg px-3 py-2 mb-3">
                  <p className="text-accent text-sm">{item.key_insight}</p>
                </div>
              )}

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {item.topic_tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-ink-medium rounded text-xs text-neutral-400">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => askAgent?.(`Tell me more about this intelligence item: "${item.title}"`)}
                  className="text-accent hover:text-accent-hover text-xs transition-colors"
                >
                  Ask AI
                </button>
                <button
                  onClick={() => askAgent?.(`Draft a LinkedIn post based on this article: "${item.title}" — source: ${item.url} (intelligence item ID: ${item.id})`)}
                  className="text-accent hover:text-accent-hover text-xs transition-colors"
                >
                  Draft LinkedIn Post
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="card-skeuomorphic rounded-xl p-8 text-center">
          <p className="text-neutral-400">No items matching this filter.</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex items-center gap-4 text-xs text-neutral-600 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${dataSource === 'live' ? 'bg-accent animate-pulse-dot' : 'bg-yellow-400'}`} />
          {dataSource === 'live' ? 'Live data from Supabase' : 'Fallback demo data'}
        </span>
        <span>Source: RSS intelligence pipeline</span>
      </div>
    </div>
  )
}
