import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { demoLogin, storeUser } from '../../lib/supabase'

const DEMO_ACCOUNTS = [
  {
    role: 'College',
    description: 'HB8 Funding & Curriculum Reports',
    accounts: [
      { label: 'Dean', token: 'DEMO-COLLEGE-DEAN-2026', county: 'Dallas', desc: 'Full access to all reports' },
      { label: 'Faculty', token: 'DEMO-COLLEGE-FACULTY-2026', county: 'Collin', desc: 'Curriculum alignment view' },
      { label: 'Registrar', token: 'DEMO-COLLEGE-REGISTRAR-2026', county: 'Tarrant', desc: 'ICLC & Compliance' },
    ]
  },
  {
    role: 'EDC',
    description: 'Sectoral Health & Talent Analytics',
    accounts: [
      { label: 'Director', token: 'DEMO-EDC-DIRECTOR-2026', county: 'Dallas', desc: 'Full sectoral reports' },
      { label: 'Analyst', token: 'DEMO-EDC-ANALYST-2026', county: 'Collin', desc: 'Read-only analysis' },
    ]
  },
  {
    role: 'Student',
    description: 'Career GPS & Hidden Market',
    accounts: [
      { label: 'Counselor', token: 'DEMO-STUDENT-COUNSELOR-2026', county: 'Denton', desc: 'Multi-student guidance' },
      { label: 'Student', token: 'DEMO-STUDENT-STUDENT-2026', county: 'Dallas', desc: 'Personal career GPS' },
    ]
  },
  {
    role: 'TWC',
    description: 'Apprenticeship Sponsorship Suite',
    accounts: [
      { label: 'Business Owner', token: 'DEMO-TWC-OWNER-2026', county: 'Tarrant', desc: 'Full sponsorship tools' },
      { label: 'HR Director', token: 'DEMO-TWC-HR-2026', county: 'Dallas', desc: 'Workforce planning' },
    ]
  }
]

export default function DemoLogin() {
  const [loading, setLoading] = useState(false)
  const [loadingToken, setLoadingToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  // Check if user is authenticated
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('zscale_authenticated')
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login')
    }
  }, [navigate])

  const handleLogin = async (token: string) => {
    setLoading(true)
    setLoadingToken(token)
    setError(null)

    try {
      const { user } = await demoLogin(token)
      storeUser(user)

      const routes: Record<string, string> = {
        college: '/dashboard/college',
        edc: '/dashboard/edc',
        student: '/dashboard/student',
        twc: '/dashboard/twc'
      }
      navigate(routes[user.role] || '/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setLoading(false)
      setLoadingToken(null)
    }
  }

  const handleLogout = () => {
    sessionStorage.removeItem('zscale_authenticated')
    sessionStorage.removeItem('zscale_user')
    navigate('/login')
  }

  // Get logged in user email
  const userEmail = sessionStorage.getItem('zscale_user') || ''

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/images/zscale-capital-logo.png"
              alt="zScale Capital"
              className="h-14 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-h2 text-white mb-3">
            Role-Based Intelligence Platform
          </h1>
          <p className="text-body text-neutral-400">
            Select a demo account to explore dashboards by role
          </p>

          {/* Logged in indicator */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            <span className="text-green-400 text-sm">Signed in as {userEmail}</span>
            <button
              onClick={handleLogout}
              className="ml-2 text-neutral-500 hover:text-red-400 text-sm transition-colors"
            >
              (Sign out)
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Demo Account Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DEMO_ACCOUNTS.map(roleGroup => (
            <div
              key={roleGroup.role}
              className="card-skeuomorphic rounded-2xl p-6"
            >
              {/* Role Header */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse-dot" />
                <h2 className="text-h3 text-white">
                  {roleGroup.role}
                </h2>
              </div>
              <p className="text-caption text-neutral-500 mb-5 ml-5">
                {roleGroup.description}
              </p>

              {/* Account Buttons */}
              <div className="space-y-3">
                {roleGroup.accounts.map(account => (
                  <button
                    key={account.token}
                    onClick={() => handleLogin(account.token)}
                    disabled={loading}
                    className="w-full flex items-center justify-between p-4 bg-ink-light hover:bg-ink-medium border border-ink-border hover:border-accent/30 rounded-xl transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="text-left">
                      <p className="text-button text-white group-hover:text-accent transition-colors">
                        {account.label}
                        {loadingToken === account.token && (
                          <span className="ml-2 text-neutral-500 text-sm">Loading...</span>
                        )}
                      </p>
                      <p className="text-caption text-neutral-500">
                        {account.county} County
                      </p>
                      <p className="text-caption text-neutral-600 mt-1">
                        {account.desc}
                      </p>
                    </div>
                    <span className="text-neutral-600 group-hover:text-accent transition-colors text-xl">
                      →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* AI Agent Card */}
        <div className="mt-6">
          <div className="card-skeuomorphic rounded-2xl p-6 border border-accent/20 bg-gradient-to-r from-accent/5 to-transparent">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 border border-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-h3 text-white">AI Agent</h2>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-accent/20 text-accent border border-accent/30 uppercase tracking-wider">
                      New
                    </span>
                  </div>
                  <p className="text-caption text-neutral-400">
                    Ask anything about UTA programs, Arlington jobs, employer partnerships, or career outcomes
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate('/agent')}
                className="flex-shrink-0 px-6 py-3 bg-accent hover:bg-accent-hover text-ink-DEFAULT font-semibold rounded-xl transition-colors text-sm"
              >
                Launch AI Agent
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center space-y-3">
          <p className="text-caption text-neutral-600">
            Each account shows data filtered by assigned county
          </p>
          <div className="flex items-center justify-center gap-2 text-caption text-neutral-700 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              Dallas
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              Collin
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              Tarrant
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
              Denton
            </span>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 text-neutral-500 hover:text-accent text-sm transition-colors"
          >
            <span>←</span>
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
