import { useRef, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useChat } from '../hooks/useChat'
import { ChatMessage } from '../components/agent/ChatMessage'
import { ChatInput } from '../components/agent/ChatInput'
import { SuggestedQuestions } from '../components/agent/SuggestedQuestions'
import { getStoredUser } from '../lib/supabase'

export default function AgentChat() {
  const user = getStoredUser()
  const userRole = user?.role as 'college' | 'edc' | 'student' | 'twc' | undefined
  const { messages, isLoading, error, sendMessage, stopStreaming, clearMessages } = useChat(userRole)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleQuestionSelect = (question: string) => {
    setSidebarOpen(false)
    sendMessage(question)
  }

  const hasMessages = messages.length > 0

  return (
    <div className="h-screen flex bg-ink">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — suggested questions */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-ink-card border-r border-ink-border flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-ink-border">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/zscale-logo.svg?v=2.1" alt="zScale Capital" className="h-8 w-auto" />
            <span className="text-lg font-display font-bold text-white">zScale</span>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <SuggestedQuestions onSelect={handleQuestionSelect} isLoading={isLoading} role={userRole} />
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-ink-border bg-ink shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-ink-light transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>

            <div>
              <h1 className="text-sm font-semibold text-white">UTA Workforce Intelligence Agent</h1>
              <p className="text-xs text-neutral-500">Powered by Claude + Supabase</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasMessages && (
              <button
                onClick={clearMessages}
                className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-ink-light border border-ink-border transition-colors"
              >
                Clear chat
              </button>
            )}
            <Link
              to={user ? `/dashboard/${user.role}` : '/demo-login'}
              className="px-3 py-1.5 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-ink-light border border-ink-border transition-colors"
            >
              Back
            </Link>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          {!hasMessages ? (
            // Welcome state
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-lg">
                <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-display font-bold text-white mb-3">
                  UTA Workforce Intelligence
                </h2>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  Ask me anything about UTA's 180+ academic programs, Arlington/DFW employers,
                  job openings, starting salaries, skills gaps, and labor market trends.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'What are the highest-paying programs?',
                    'Which employers hire the most UTA grads?',
                    'What jobs are available in aerospace?',
                    'Show me skills gaps for CS students',
                  ].map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-4 py-2.5 rounded-xl text-xs text-left text-neutral-400 hover:text-white bg-ink-light border border-ink-border hover:border-accent/30 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Message list
            <div className="max-w-3xl mx-auto p-4">
              {messages.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Error message */}
              {error && (
                <div className="flex justify-start mb-4">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 max-w-[75%]">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} onStop={stopStreaming} isLoading={isLoading} />
      </div>
    </div>
  )
}
