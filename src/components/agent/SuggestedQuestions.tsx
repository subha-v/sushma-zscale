const CATEGORIES = [
  {
    title: 'Career Exploration',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
      </svg>
    ),
    questions: [
      'What are the top 5 highest-paying UTA programs?',
      'Which programs have the best employment rates?',
      'What STEM programs does the College of Engineering offer?',
    ],
  },
  {
    title: 'Employer Intelligence',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
    questions: [
      'Which Fortune 500 companies hire UTA grads?',
      'What aerospace & defense employers are in the area?',
      'Which employers have the most job openings right now?',
    ],
  },
  {
    title: 'Labor Market',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
      </svg>
    ),
    questions: [
      'What is the unemployment rate in Fort Worth-Arlington?',
      'Which industries are growing fastest in DFW?',
      'What major development projects are underway in Arlington?',
    ],
  },
  {
    title: 'Skills & Alignment',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
      </svg>
    ),
    questions: [
      'What are the skills gaps for Computer Science graduates?',
      'Which UTA programs align with healthcare industry needs?',
      'What employer partnerships does the Engineering college have?',
    ],
  },
  {
    title: 'Predictions & Trends',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
    questions: [
      'Which UTA programs have the best future job outlook?',
      'What are the most in-demand emerging skills in DFW?',
      'Compare Computer Science vs Data Science vs Software Engineering',
    ],
  },
]

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void
  isLoading: boolean
}

export function SuggestedQuestions({ onSelect, isLoading }: SuggestedQuestionsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-1">
        Suggested Questions
      </h3>
      {CATEGORIES.map(category => (
        <div key={category.title}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="text-accent">{category.icon}</span>
            <span className="text-xs font-medium text-neutral-400">{category.title}</span>
          </div>
          <div className="space-y-1">
            {category.questions.map(q => (
              <button
                key={q}
                onClick={() => onSelect(q)}
                disabled={isLoading}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-neutral-400 hover:text-white hover:bg-ink-light/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
