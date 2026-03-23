import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { VisualizationData } from '../../../lib/agent-api'
import { ChartRenderer } from './ChartRenderer'

const CHART_TYPE_ICONS: Record<string, string> = {
  bar: '📊',
  horizontal_bar: '📊',
  pie: '🥧',
  donut: '🍩',
  line: '📈',
}

function ChartModal({ visualization, onClose }: { visualization: VisualizationData; onClose: () => void }) {
  const icon = CHART_TYPE_ICONS[visualization.chart_type] || '📊'

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[95vw] max-w-4xl max-h-[90vh] bg-ink-card border border-ink-border rounded-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-border">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
            <span>{icon}</span>
            {visualization.title}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-ink-light hover:bg-ink-medium border border-ink-border text-neutral-400 hover:text-white transition-colors flex items-center justify-center"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chart area */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-[#1F2937] rounded-xl p-4">
            <ChartRenderer visualization={visualization} />
          </div>

          {visualization.insight && (
            <p className="text-sm text-neutral-400 mt-4 italic">
              {visualization.insight}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export function ChartCard({ visualization }: { visualization: VisualizationData }) {
  const [open, setOpen] = useState(false)
  const icon = CHART_TYPE_ICONS[visualization.chart_type] || '📊'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 hover:border-accent/30 transition-colors text-left group"
      >
        <span className="text-base">{icon}</span>
        <span className="text-sm text-accent group-hover:text-accent-hover font-medium truncate">
          {visualization.title}
        </span>
        <svg className="w-3.5 h-3.5 text-accent/60 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
        </svg>
      </button>

      {open && <ChartModal visualization={visualization} onClose={() => setOpen(false)} />}
    </>
  )
}
