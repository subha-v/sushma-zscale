import { useState, useRef, useEffect } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  onStop: () => void
  isLoading: boolean
}

export function ChatInput({ onSend, onStop, isLoading }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return
    onSend(value)
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
      <div className="max-w-3xl mx-auto flex gap-3 items-end">
        <textarea
          ref={textareaRef}
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
      <p className="text-center text-[11px] text-neutral-600 mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  )
}
