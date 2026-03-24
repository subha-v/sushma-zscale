import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  isLoading: boolean
  inputRef?: React.RefObject<HTMLTextAreaElement | null>
}

export function ChatInput({ onSend, onStop, isLoading, inputRef }: ChatInputProps) {
  const [value, setValue] = useState('')
  const [visualize, setVisualize] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const setRef = (el: HTMLTextAreaElement | null) => {
    textareaRef.current = el
    if (inputRef && 'current' in inputRef) {
      (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = el
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return
    const message = visualize ? `[VISUALIZE] ${value}` : value
    onSend(message)
    setValue('')
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="border-t border-ink-border bg-ink p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-3 items-end">
          <textarea
            ref={setRef}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about UTA programs, employers, salaries, job openings..."
            rows={1}
            className="flex-1 bg-ink-light border border-ink-border rounded-xl px-4 py-3 text-sm text-white placeholder:text-neutral-500 resize-none focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/25 transition-colors"
          />
          {isLoading ? (
            <button
              onClick={onStop}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors flex items-center justify-center"
              title="Stop generating"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="1" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim()}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-accent text-ink-DEFAULT font-bold hover:bg-accent-hover transition-colors flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed"
              title="Send message"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
              </svg>
            </button>
          )}
        </div>
        {/* Visualize toggle + hint */}
        <div className="flex items-center justify-between mt-2">
          <button
            onClick={() => setVisualize(!visualize)}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
              visualize
                ? 'bg-accent/15 text-accent border border-accent/30'
                : 'bg-ink-light text-neutral-400 border border-ink-border hover:border-neutral-500 hover:text-neutral-300'
            }`}
          >
            {visualize ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Visualize data
                <svg className="w-3 h-3 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                </svg>
                Visualize data
              </>
            )}
          </button>
          <p className="text-[11px] text-neutral-600">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </div>
  )
}
