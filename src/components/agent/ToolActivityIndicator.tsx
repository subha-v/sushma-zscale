import type { ToolActivity } from '../../hooks/useChat'

const TOOL_LABELS: Record<string, string> = {
  get_colleges: 'Searching colleges',
  get_programs: 'Searching programs',
  get_program_outcomes: 'Looking up career outcomes',
  get_employers: 'Searching employers',
  get_job_openings: 'Searching job openings',
  get_development_projects: 'Checking development projects',
  get_industries: 'Analyzing industries',
  get_partnerships: 'Looking up partnerships',
  get_skills_alignment: 'Analyzing skills alignment',
  get_labor_stats: 'Pulling labor statistics',
}

export function ToolActivityIndicator({ activities }: { activities: ToolActivity[] }) {
  if (activities.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mb-2">
      {activities.map((activity, i) => {
        const label = TOOL_LABELS[activity.tool] || activity.tool
        const isRunning = activity.status === 'running'
        const isError = activity.status === 'error'

        return (
          <span
            key={`${activity.tool}-${i}`}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
              isRunning
                ? 'bg-accent/10 text-accent border border-accent/20'
                : isError
                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                : 'bg-green-500/10 text-green-400 border border-green-500/20'
            }`}
          >
            {isRunning && (
              <span className="flex gap-0.5">
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1 h-1 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            )}
            {!isRunning && !isError && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {isError && (
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {label}
          </span>
        )
      })}
    </div>
  )
}
