import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import { getStoredUser, storeUser } from '../../../lib/supabase'
import IntelligenceFeed from './IntelligenceFeed'
import ContentCalendarPage from './ContentCalendarPage'
import SpeakingOpsPage from './SpeakingOpsPage'
import ComingSoonPage from '../../../components/dashboard/ComingSoonPage'

const NAV_ITEMS = [
  { label: 'Intelligence Feed', path: '/dashboard/admin', icon: '', category: 'Intelligence' },
  { label: 'Content Calendar', path: '/dashboard/admin/content', icon: '', category: 'Content' },
  { label: 'Speaking Opps', path: '/dashboard/admin/speaking', icon: '', category: 'Outreach' },
]

// Internal admin user — auto-created if no user is stored
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

export default function AdminDashboard() {
  // Auto-store admin user if not logged in, so DashboardLayout auth check passes
  useEffect(() => {
    if (!getStoredUser()) {
      storeUser(ADMIN_USER)
    }
  }, [])

  // Ensure user exists for initial render
  if (!getStoredUser()) {
    storeUser(ADMIN_USER)
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
        <Route path="*" element={<ComingSoonPage />} />
      </Routes>
    </DashboardLayout>
  )
}
