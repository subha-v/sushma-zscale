import { useRef, useEffect } from 'react'
import { useChat } from '../../../hooks/useChat'
import { ChatMessage } from '../../../components/agent/ChatMessage'
import { ChatInput } from '../../../components/agent/ChatInput'
import { SuggestedQuestions } from '../../../components/agent/SuggestedQuestions'

export default function CareerAdvisorPage() {
  const { messages, isLoading, error, sendMessage, stopStreaming } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="h-full flex items-center justify-center p-6">
            <div className="text-center max-w-xl">
              <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                </svg>
              </div>
              <h2 className="text-2xl font-display font-bold text-white mb-3">
                AI Career Advisor
              </h2>
              <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                Your personal AI career advisor powered by UTA workforce intelligence.
                Ask about programs, salaries, employers, skills gaps, interview prep, and more.
              </p>
              <div className="max-w-sm mx-auto">
                <SuggestedQuestions onSelect={sendMessage} isLoading={isLoading} role="student" />
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto p-4">
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

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
      <div className="shrink-0">
        <ChatInput onSend={sendMessage} onStop={stopStreaming} isLoading={isLoading} />
      </div>
    </div>
  )
}
