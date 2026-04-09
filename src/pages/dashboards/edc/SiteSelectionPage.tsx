import { useState, useEffect } from 'react'
import { useAskAgent } from '../../../components/dashboard/DashboardLayout'
import { supabase } from '../../../lib/supabase'
import InfoTooltip from '../../../components/dashboard/InfoTooltip'

interface SitePackage {
  id: string
  company_name: string
  industry: string
  target_roles: string[]
  headcount_needed: number
  status: 'draft' | 'complete' | 'delivered' | 'archived'
  key_highlights: string[]
}

const MOCK_PACKAGES: SitePackage[] = [
  { id: "ssp-1", company_name: "TechCorp Industries", industry: "Technology & Software", target_roles: ["Software Engineer", "Data Scientist", "Cloud Architect", "AI/ML Engineer"], headcount_needed: 175, status: "complete", key_highlights: ["UTA produces 620+ CS/SE/DS graduates annually (up 7% from 2024)", "Median starting salary competitive at $69-72K", "Arlington offers 28% lower office costs than Dallas core", "DFW tech workforce grew 6.2% in 2024"] },
  { id: "ssp-2", company_name: "MedTech Solutions", industry: "Healthcare Technology", target_roles: ["Biomedical Engineer", "Data Analyst", "Clinical Systems Specialist", "Health Informatics"], headcount_needed: 90, status: "delivered", key_highlights: ["UTA CONHI graduates 540+ nursing/health professionals annually", "Texas Health Resources partnership provides direct clinical pipeline", "New telehealth certification program launched 2024", "Healthcare AI demand surging 15% YoY in DFW"] },
  { id: "ssp-3", company_name: "AeroVista Defense", industry: "Aerospace & Defense", target_roles: ["Systems Engineer", "Aerospace Engineer", "Software Developer", "Autonomy Engineer"], headcount_needed: 250, status: "draft", key_highlights: ["DFW has 30,000+ aerospace workers with 4.3 location quotient", "Bell FLRAA V-280 Valor production ramping — 500+ new jobs by 2027", "Lockheed F-35 production increase creating sustained demand", "UTA Engineering produces 850+ graduates in relevant disciplines"] },
  { id: "ssp-4", company_name: "DataFlow Analytics", industry: "Data & AI", target_roles: ["ML Engineer", "Data Engineer", "Product Manager", "LLM Specialist"], headcount_needed: 120, status: "complete", key_highlights: ["UTA Data Science program growing 15% annually in enrollment", "AI/ML specialization track launched Spring 2026", "Strong emerging skills alignment (GenAI, LLMs, MLOps, RAG)", "DFW ranked #4 in AI job growth nationally in 2024"] },
  // Grapevine packages
  { id: "ssp-5", company_name: "Corporate HQ Prospect - Grapevine", industry: "Corporate / Technology", target_roles: ["Executive", "Software Engineer", "Operations Manager", "Marketing Manager"], headcount_needed: 200, status: "complete", key_highlights: ["Adjacent to DFW International Airport (4th busiest US airport)", "Median household income $112K — affluent, educated workforce", "$2B+ Grapevine EDC track record of corporate attraction", "Kubota chose Grapevine for NA HQ ($51M campus)", "SH-114 Class-A office corridor with expansion capacity", "TEXRail commuter rail connects to Fort Worth and DFW Airport"] },
  { id: "ssp-6", company_name: "Hospitality & Tourism Expansion - Grapevine", industry: "Hospitality & Tourism", target_roles: ["Hotel Manager", "Event Coordinator", "Food Service Manager", "Guest Services"], headcount_needed: 150, status: "complete", key_highlights: ["8,500+ hospitality workers already in Grapevine", "Gaylord Texan (2,000 employees) + Great Wolf Lodge anchors", "500K+ annual visitors to Grapevine attractions", "Historic Main Street + Grapevine Mills + DFW hotel cluster", "New Hotel Vin Reserve expanding boutique hospitality capacity"] },
]

const STATUS_CONFIG: Record<string, { bg: string; text: string; label: string }> = {
  draft: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', label: 'Draft' },
  complete: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Complete' },
  delivered: { bg: 'bg-accent/20', text: 'text-accent', label: 'Delivered' },
  archived: { bg: 'bg-neutral-500/20', text: 'text-neutral-500', label: 'Archived' },
}

export default function SiteSelectionPage() {
  const askAgent = useAskAgent()
  const [packages, setPackages] = useState<SitePackage[]>(MOCK_PACKAGES)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<'live' | 'fallback'>('fallback')

  useEffect(() => {
    async function fetchPackages() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('site_selection_packages')
          .select('id, company_name, industry, target_roles, headcount_needed, status, key_highlights')
          .order('created_at', { ascending: false })

        if (error || !data || data.length === 0) {
          console.warn('Supabase site_selection_packages unavailable, using fallback data')
          setPackages(MOCK_PACKAGES)
          setDataSource('fallback')
        } else {
          setPackages(data as SitePackage[])
          setDataSource('live')
        }
      } catch (err) {
        console.warn('Supabase query failed, using fallback data:', err)
        setPackages(MOCK_PACKAGES)
        setDataSource('fallback')
      } finally {
        setLoading(false)
      }
    }
    fetchPackages()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading site selection packages from database...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header with CTA */}
      <div className="card-skeuomorphic rounded-2xl p-6 mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-h3 text-white mb-2">Site Selection Packages</h2>
            <p className="text-body text-neutral-400">
              Generate comprehensive talent and labor market packages for companies considering Arlington/Grapevine/DFW.
              Each package includes talent supply data, employer landscape, cost of living, and training pipeline information.
            </p>
          </div>
          <button
            onClick={() => askAgent?.('Generate a site selection package for a technology company considering Arlington or Grapevine')}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors shrink-0"
          >
            Generate Package with AI
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Total Packages</p>
          <p className="text-3xl font-display font-bold text-white">{packages.length}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1 inline-flex items-center">Delivered<InfoTooltip align="left" text="Packages completed and sent to company stakeholders for their site selection evaluation." /></p>
          <p className="text-3xl font-display font-bold text-accent">{packages.filter(p => p.status === 'delivered').length}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1 inline-flex items-center">Total Headcount<InfoTooltip align="center" text="Sum of all positions needed across all site selection packages. Represents total hiring demand from active prospects." /></p>
          <p className="text-3xl font-display font-bold text-green-400">{packages.reduce((s, p) => s + p.headcount_needed, 0).toLocaleString()}</p>
        </div>
        <div className="card-skeuomorphic rounded-xl p-5">
          <p className="text-neutral-500 text-sm mb-1">Industries</p>
          <p className="text-3xl font-display font-bold text-white">{new Set(packages.map(p => p.industry)).size}</p>
        </div>
      </div>

      {/* Package Cards */}
      <div className="space-y-6">
        {packages.map((pkg) => {
          const status = STATUS_CONFIG[pkg.status]
          return (
            <div key={pkg.id} className="card-skeuomorphic rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <h3 className="text-white font-medium text-lg">{pkg.company_name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-neutral-400 text-sm">{pkg.industry}</span>
                      <span className="text-neutral-600">|</span>
                      <span className="text-accent text-sm font-medium">{pkg.headcount_needed} positions</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center ${status.bg} ${status.text}`}>
                    {status.label}
                    <InfoTooltip className="w-64" text={<><p><span className="text-neutral-400">Draft</span> — In preparation. <span className="text-green-400">Complete</span> — Ready to deliver. <span className="text-accent">Delivered</span> — Sent to prospect. <span className="text-neutral-500">Archived</span> — Closed/inactive.</p></>} />
                  </span>
                </div>

                {/* Target Roles */}
                <div className="mb-4">
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Target Roles</p>
                  <div className="flex flex-wrap gap-2">
                    {pkg.target_roles.map((role) => (
                      <span key={role} className="px-2.5 py-1 bg-ink-medium border border-ink-border rounded-lg text-xs text-neutral-300">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Key Highlights */}
                <div>
                  <p className="text-neutral-500 text-xs uppercase tracking-wider mb-2">Key Highlights</p>
                  <ul className="space-y-1">
                    {pkg.key_highlights.map((h, i) => (
                      <li key={i} className="text-neutral-300 text-sm flex items-start gap-2">
                        <span className="text-accent mt-0.5">•</span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="px-6 py-3 border-t border-ink-border bg-ink-medium/30 flex items-center justify-between">
                <button
                  onClick={() => askAgent?.(`Expand the site selection package for ${pkg.company_name} in ${pkg.industry}`)}
                  className="text-accent hover:text-accent-hover text-sm transition-colors"
                >
                  Expand with AI Agent
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
          <span>Source: UTA Institutional Research, BLS, Arlington EDC</span>
        </div>
      </div>
    </div>
  )
}
