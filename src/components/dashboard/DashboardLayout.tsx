import { ReactNode, useState, useEffect, useRef, createContext, useContext, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { getStoredUser, clearStoredUser } from '../../lib/supabase'
import { useChat } from '../../hooks/useChat'
import { ChatMessage } from '../agent/ChatMessage'
import { ChatInput } from '../agent/ChatInput'
import { SuggestedQuestions } from '../agent/SuggestedQuestions'

interface NavItem {
  label: string
  path: string
  icon: string
  category?: string
}

interface QuickAction {
  label: string
  question: string
}

interface DashboardLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
  navItems: NavItem[]
  role?: 'college' | 'edc' | 'student' | 'twc'
  quickActions?: QuickAction[]
}

// Context for sub-pages to open the chat panel
const AskAgentContext = createContext<((question: string) => void) | null>(null)
export function useAskAgent() {
  return useContext(AskAgentContext)
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  navItems,
  role,
  quickActions,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [chatWidth, setChatWidth] = useState(384) // default w-96 = 384px
  const [isExpanded, setIsExpanded] = useState(false)
  const isDraggingRef = useRef(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = getStoredUser()
  const askAiButtonRef = useRef<HTMLButtonElement>(null)
  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  const CHAT_MIN_WIDTH = 320
  const CHAT_DEFAULT_WIDTH = 384
  const CHAT_EXPANDED_WIDTH = 700

  const { messages, isLoading, error, sendMessage, stopStreaming, clearMessages } = useChat(role)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Escape closes chat panel
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && chatOpen) {
        setChatOpen(false)
        askAiButtonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [chatOpen])

  // Focus chat input when panel opens
  useEffect(() => {
    if (chatOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 100)
    }
  }, [chatOpen])

  // Auto-close mobile menu on nav click
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  // Drag-to-resize chat panel
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isDraggingRef.current = true
    const startX = e.clientX
    const startWidth = chatWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return
      const delta = startX - moveEvent.clientX
      const maxWidth = Math.min(window.innerWidth * 0.85, 1200)
      const newWidth = Math.max(CHAT_MIN_WIDTH, Math.min(startWidth + delta, maxWidth))
      setChatWidth(newWidth)
      setIsExpanded(newWidth > CHAT_DEFAULT_WIDTH + 50)
    }

    const handleMouseUp = () => {
      isDraggingRef.current = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }, [chatWidth])

  const toggleExpand = useCallback(() => {
    if (isExpanded) {
      setChatWidth(CHAT_DEFAULT_WIDTH)
      setIsExpanded(false)
    } else {
      setChatWidth(CHAT_EXPANDED_WIDTH)
      setIsExpanded(true)
    }
  }, [isExpanded])

  const handleLogout = () => {
    clearStoredUser()
    navigate('/demo-login')
  }

  const handleAskAgent = useCallback((question: string) => {
    setChatOpen(true)
    if (question) {
      setTimeout(() => sendMessage(question), 150)
    }
  }, [sendMessage])

  const handleQuestionSelect = (question: string) => {
    sendMessage(question)
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

  const hasMessages = messages.length > 0

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 px-4 border-b border-ink-border flex items-center">
        <Link to="/" className="flex items-center">
          <img
            src="/images/zscale-logo.png"
            alt="zScale"
            className={`${!sidebarCollapsed ? 'h-10 w-auto' : 'h-8 w-auto'} object-contain transition-all duration-300`}
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-ink-border">
        {!sidebarCollapsed ? (
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
            {!sidebarCollapsed && (
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
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'text-neutral-400 hover:text-white hover:bg-ink-medium border border-transparent'
                    }`}
                  >
                    {item.icon && <span className="text-lg flex-shrink-0">{item.icon}</span>}
                    {!sidebarCollapsed && <span className="text-sm">{item.label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}

        {/* Quick Actions */}
        {quickActions && quickActions.length > 0 && !sidebarCollapsed && (
          <div className="mb-4">
            <p className="text-neutral-600 text-xs uppercase tracking-wider px-3 mb-2 font-medium">
              Quick Actions
            </p>
            <div className="space-y-1">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => handleAskAgent(action.question)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-neutral-400 hover:text-white hover:bg-ink-medium border border-transparent transition-all duration-200 text-left"
                >
                  <span className="text-sm">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-ink-border space-y-1">
        <button
          ref={askAiButtonRef}
          onClick={() => setChatOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-3 text-accent hover:bg-accent/10 rounded-lg transition-colors border border-accent/20 hover:border-accent/40"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
          {!sidebarCollapsed && <span className="text-sm font-medium">Ask AI Agent</span>}
        </button>
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-full flex items-center gap-3 px-3 py-3 text-neutral-500 hover:text-white hover:bg-ink-medium rounded-lg transition-colors hidden lg:flex"
        >
          <span className="text-lg">{sidebarCollapsed ? '>' : '<'}</span>
          {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
        </button>
        <Link
          to="/demo-login"
          className="w-full flex items-center gap-3 px-3 py-3 text-neutral-500 hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
        >
          <span className="text-lg flex-shrink-0">~</span>
          {!sidebarCollapsed && <span className="text-sm">Switch Role</span>}
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
          </svg>
          {!sidebarCollapsed && <span className="text-sm">Logout</span>}
        </button>
      </div>
    </>
  )

  const chatPanel = chatOpen ? createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={() => setChatOpen(false)}
      />
      {/* Panel */}
      <aside
        className="fixed inset-y-0 right-0 z-50 bg-ink-light border-l border-ink-border flex flex-col"
        style={{ width: window.innerWidth < 640 ? '100%' : `${chatWidth}px` }}
        aria-label="AI chat panel"
        role="complementary"
      >
        {/* Drag handle (left edge) */}
        <div
          onMouseDown={handleResizeStart}
          className="absolute inset-y-0 left-0 w-1.5 cursor-col-resize hover:bg-accent/30 active:bg-accent/50 transition-colors z-10 hidden sm:block"
          aria-label="Resize chat panel"
        />

        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-ink-border shrink-0">
          <div>
            <h2 className="text-sm font-semibold text-white">AI Agent</h2>
            {role && (
              <span className="text-xs text-accent capitalize">{role} mode</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                onClick={clearMessages}
                className="px-2.5 py-1 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-ink-medium border border-ink-border transition-colors"
              >
                Clear
              </button>
            )}
            {/* Expand / Collapse toggle */}
            <button
              onClick={toggleExpand}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-ink-medium transition-colors hidden sm:flex"
              aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
              title={isExpanded ? 'Collapse' : 'Expand'}
            >
              {isExpanded ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                setChatOpen(false)
                askAiButtonRef.current?.focus()
              }}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-ink-medium transition-colors"
              aria-label="Close chat panel"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto" role="log" aria-live="polite">
          {!hasMessages ? (
            <div className="p-4">
              <SuggestedQuestions onSelect={handleQuestionSelect} isLoading={isLoading} role={role} countyFips={user.countyFips} />
            </div>
          ) : (
            <div className="p-4">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {error && (
                <div className="flex justify-start mb-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                    <button
                      onClick={() => sendMessage('retry')}
                      className="text-xs text-accent hover:text-accent-hover mt-1 transition-colors"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Chat Input */}
        <ChatInput
          onSend={sendMessage}
          onStop={stopStreaming}
          isLoading={isLoading}
          inputRef={chatInputRef}
          placeholder={role === 'edc' && user.countyFips === '48439'
            ? 'Ask about Grapevine employers, hiring trends, site selection...'
            : undefined
          }
        />
      </aside>
    </>,
    document.body
  ) : null

  return (
    <AskAgentContext.Provider value={handleAskAgent}>
      <div className="min-h-screen bg-ink flex">
        {/* Mobile sidebar backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar — desktop: static, mobile: overlay */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 lg:static
            ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} w-72
            bg-ink-light border-r border-ink-border flex flex-col
            transition-all duration-300 ease-out-expo
            lg:translate-x-0
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          {sidebarContent}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-ink-light border-b border-ink-border flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-ink-medium transition-colors"
                aria-label="Toggle navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <div>
                <h1 className="text-h4 text-white">{title}</h1>
                {subtitle && <p className="text-caption text-neutral-500">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-ink-medium rounded-lg border border-ink-border">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                <span className="text-neutral-400 text-sm">{user.countyName} County</span>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
            {children}
          </div>
        </main>

        {/* Chat Panel (portal) */}
        {chatPanel}
      </div>
    </AskAgentContext.Provider>
  )
}
