import { useState, useEffect } from 'react'

interface WelcomeBannerProps {
  userName: string
  roleName: string
  countyName?: string
  stats?: { label: string; value: string; color?: string }[]
  primaryAction?: { label: string; onClick: () => void }
  secondaryAction?: { label: string; onClick: () => void }
  storageKey: string
}

export default function WelcomeBanner({
  userName,
  roleName,
  countyName,
  stats,
  primaryAction,
  secondaryAction,
  storageKey,
}: WelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem(storageKey)) {
      setDismissed(true)
    }
  }, [storageKey])

  const handleDismiss = () => {
    sessionStorage.setItem(storageKey, 'true')
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="card-skeuomorphic rounded-xl p-5 mb-6" role="status">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-display font-bold text-white mb-1">
            Welcome, {userName}
          </h2>
          <p className="text-sm text-neutral-400">
            {roleName}
            {countyName && <span> &middot; {countyName}</span>}
          </p>
          {stats && stats.length > 0 && (
            <div className="flex items-center gap-4 mt-2 flex-wrap text-sm">
              {stats.map((stat, i) => (
                <span key={i} className={stat.color || 'text-neutral-300'}>
                  {stat.value} {stat.label}
                </span>
              ))}
            </div>
          )}
          {(primaryAction || secondaryAction) && (
            <div className="flex items-center gap-3 mt-3">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className="px-4 py-2 bg-accent hover:bg-accent-hover text-ink text-sm font-medium rounded-lg transition-colors"
                >
                  {primaryAction.label}
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className="px-4 py-2 bg-ink-medium hover:bg-ink border border-ink-border text-white text-sm rounded-lg transition-colors"
                >
                  {secondaryAction.label}
                </button>
              )}
            </div>
          )}
        </div>
        <button
          onClick={handleDismiss}
          className="p-1 text-neutral-500 hover:text-white transition-colors flex-shrink-0"
          aria-label="Dismiss welcome banner"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
