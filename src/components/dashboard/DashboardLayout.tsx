import { ReactNode, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getStoredUser, clearStoredUser } from '../../lib/supabase'

interface NavItem {
  label: string
  path: string
  icon: string
  category?: string
}

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  navItems: NavItem[]
}

export default function DashboardLayout({ 
  children, 
  title,
  subtitle,
  navItems
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()

  const handleLogout = () => {
    clearStoredUser()
    navigate('/demo-login')
  }

  if (!user) {
    navigate('/demo-login')
    return null
  }

  // Group nav items by category
  const groupedNav = navItems.reduce((acc, item) => {
    const cat = item.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(item)
    return acc
  }, {} as Record<string, NavItem[]>)

  return (
    <div className="min-h-screen bg-ink flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-ink-light border-r border-ink-border flex flex-col transition-all duration-300 ease-out-expo`}>
        {/* Logo */}
        <div className="h-16 px-4 border-b border-ink-border flex items-center">
          <Link to="/" className="flex items-center">
            <img
              src="/images/zscale-capital-logo.png"
              alt="zScale Capital"
              className={`${sidebarOpen ? 'h-10 w-auto' : 'h-8 w-auto'} object-contain transition-all duration-300`}
            />
          </Link>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-ink-border">
          {sidebarOpen ? (
            <div>
              <p className="text-white font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-neutral-500 text-sm capitalize">
                {user.subRole?.replace('_', ' ') || user.role}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
                <span className="text-neutral-600 text-xs">{user.countyName} County</span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-ink-medium rounded-full flex items-center justify-center mx-auto">
              <span className="text-white font-medium text-sm">
                {user.firstName[0]}{user.lastName[0]}
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto">
          {Object.entries(groupedNav).map(([category, items]) => (
            <div key={category} className="mb-4">
              {sidebarOpen && (
                <p className="text-neutral-600 text-xs uppercase tracking-wider px-3 mb-2 font-medium">
                  {category}
                </p>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                        isActive 
                          ? 'bg-accent/10 text-accent border border-accent/20' 
                          : 'text-neutral-400 hover:text-white hover:bg-ink-medium border border-transparent'
                      }`}
                    >
                      <span className="text-lg flex-shrink-0">{item.icon}</span>
                      {sidebarOpen && <span className="text-sm">{item.label}</span>}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-ink-border space-y-1">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-white hover:bg-ink-medium rounded-lg transition-colors"
          >
            <span className="text-lg">{sidebarOpen ? '◀' : '▶'}</span>
            {sidebarOpen && <span className="text-sm">Collapse</span>}
          </button>
          <Link
            to="/demo-login"
            className="w-full flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
          >
            <span className="text-lg">↔</span>
            {sidebarOpen && <span className="text-sm">Switch Role</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <span className="text-lg">↩</span>
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-ink-light border-b border-ink-border flex items-center justify-between px-6 flex-shrink-0">
          <div>
            <h1 className="text-h4 text-white">{title}</h1>
            {subtitle && <p className="text-caption text-neutral-500">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-ink-medium rounded-lg border border-ink-border">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              <span className="text-neutral-400 text-sm">{user.countyName} County</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
