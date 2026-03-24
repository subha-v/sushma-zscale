interface ComingSoonPageProps {
  onAskAgent?: (question: string) => void
}

export default function ComingSoonPage({ onAskAgent }: ComingSoonPageProps) {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="text-center max-w-md">
        <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
          </svg>
        </div>
        <h2 className="text-xl font-display font-bold text-white mb-3">
          This page is coming soon
        </h2>
        <p className="text-neutral-400 text-sm leading-relaxed mb-6">
          Use the AI Agent to explore this data now. It has access to real-time workforce intelligence, program analytics, and employer data.
        </p>
        {onAskAgent && (
          <button
            onClick={() => onAskAgent('What data is available for this topic?')}
            className="px-5 py-2.5 bg-accent hover:bg-accent-hover text-ink font-medium rounded-lg transition-colors"
          >
            Ask AI Agent
          </button>
        )}
      </div>
    </div>
  )
}
