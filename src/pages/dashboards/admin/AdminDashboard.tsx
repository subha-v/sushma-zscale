import { Routes, Route } from 'react-router-dom'
import DashboardLayout from '../../../components/dashboard/DashboardLayout'
import IntelligenceFeed from './IntelligenceFeed'
import ContentCalendarPage from './ContentCalendarPage'
import SpeakingOpsPage from './SpeakingOpsPage'
import ComingSoonPage from '../../../components/dashboard/ComingSoonPage'

const NAV_ITEMS = [
  { label: 'Intelligence Feed', path: '/dashboard/admin', icon: '', category: 'Intelligence' },
  { label: 'Content Calendar', path: '/dashboard/admin/content', icon: '', category: 'Content' },
  { label: 'Speaking Opps', path: '/dashboard/admin/speaking', icon: '', category: 'Outreach' },
]

export default function AdminDashboard() {
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
