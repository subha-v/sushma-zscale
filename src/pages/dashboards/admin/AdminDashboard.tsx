import { useState, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, storeUser } from '../../../lib/supabase'
import IntelligenceFeed from './IntelligenceFeed'
import ContentCalendarPage from './ContentCalendarPage'
import SpeakingOpsPage from './SpeakingOpsPage'
import PipelineCRM from './PipelineCRM'
import NewsletterDraft from './NewsletterDraft'
import ComingSoonPage from '../../../components/dashboard/ComingSoonPage'

const NAV_ITEMS = [
  { label: 'Intelligence Feed', path: '/dashboard/admin', icon: '', category: 'Intelligence' },
  { label: 'Content Calendar', path: '/dashboard/admin/content', icon: '', category: 'Content' },
  { label: 'Speaking Opps', path: '/dashboard/admin/speaking', icon: '', category: 'Outreach' },
  { label: 'Pipeline CRM', path: '/dashboard/admin/pipeline', icon: '', category: 'Tracker' },
  { label: 'Newsletter Draft', path: '/dashboard/admin/newsletter-draft', icon: '', category: 'Tracker' },
]

const ADMIN_PIN = 'zscale2026'
const ADMIN_SESSION_KEY = 'zscale_admin_auth'

const ADMIN_USER = {
  id: 'admin-founder',
  firstName: 'Sushma',
  lastName: 'Vadlamannati',
  email: 'admin@zscalecapital.com',
  role: 'college' as const,
  subRole: 'admin',
  countyFips: '48439',
  countyName: 'Tarrant',
  region: 'DFW',
}

function AdminLogin({ onAuth }: { onAuth: () => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))

    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, 'true')
      storeUser(ADMIN_USER)
      onAuth()
    } else {
      setError('Invalid access code')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/images/zscale-logo.png"
              alt="zScale"
              className="h-14 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-h3 text-white mb-2">Admin Access</h1>
          <p className="text-body text-neutral-500">Internal use only</p>
        </div>

        <form onSubmit={handleSubmit} className="card-skeuomorphic rounded-2xl p-8">
          <div className="mb-6">
            <label htmlFor="admin-pin" className="block text-sm text-neutral-400 mb-2">
              Access Code
            </label>
            <input
              id="admin-pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter admin access code"
              autoFocus
              className="w-full px-4 py-3 bg-ink-medium border border-ink-border rounded-lg text-white placeholder-neutral-600 focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {error && (
            <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !pin}
            className="w-full py-3 bg-accent text-ink font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Access Dashboard'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true') {
      if (!getStoredUser()) storeUser(ADMIN_USER)
      setAuthenticated(true)
    }
  }, [])

  if (!authenticated) {
    return <AdminLogin onAuth={() => setAuthenticated(true)} />
  }

  return (
    <DashboardLayout
      title="Intelligence Command Center"
      subtitle="Content & Outreach Pipeline"
      navItems={NAV_ITEMS}
      role="college"
    >
      <Routes>
        <Route index element={<IntelligenceFeed />} />
        <Route path="content" element={<ContentCalendarPage />} />
        <Route path="speaking" element={<SpeakingOpsPage />} />
        <Route path="pipeline" element={<PipelineCRM />} />
        <Route path="newsletter-draft" element={<NewsletterDraft />} />
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
    </DashboardLayout>
  )
}
