/**
 * Shared hover-tooltip for table column headers and metric labels.
 * Replicates the pattern from EDCDashboard's Risk tooltip.
 *
 * Usage:
 *   <InfoTooltip text="Explanation here" />
 *   <InfoTooltip text={<>Multi-line <strong>JSX</strong></>} />
 *   <InfoTooltip text="..." align="left" />
 */
import { type ReactNode } from 'react'

interface InfoTooltipProps {
  /** Plain string or JSX for the tooltip body */
  text: ReactNode
  /** Horizontal alignment of the popover relative to the icon. Default: 'right' (anchors to the right edge). */
  align?: 'left' | 'right' | 'center'
  /** Optional max width override (default 288px / w-72) */
  className?: string
}

export default function InfoTooltip({ text, align = 'right', className }: InfoTooltipProps) {
  const alignClass =
    align === 'left' ? 'left-0' :
    align === 'center' ? 'left-1/2 -translate-x-1/2' :
    'right-0'

  return (
    <span className="relative group/tip inline-flex items-center">
      <svg
        className="w-3.5 h-3.5 text-neutral-600 group-hover/tip:text-neutral-400 transition-colors ml-1.5 shrink-0 cursor-help"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <circle cx="8" cy="8" r="6.5" />
        <line x1="8" y1="7" x2="8" y2="11.5" strokeLinecap="round" />
        <circle cx="8" cy="5" r="0.75" fill="currentColor" stroke="none" />
      </svg>
      <span
        className={`absolute top-full mt-2 bg-ink-card border border-ink-border rounded-lg shadow-lg text-xs text-neutral-300 p-3 z-50 pointer-events-none opacity-0 group-hover/tip:opacity-100 transition-opacity duration-200 text-left font-normal ${alignClass} ${className || 'w-72'}`}
      >
        {text}
      </span>
    </span>
  )
}
