import type { VisualizationData } from '../../../lib/agent-api'
import { BarChartViz } from './BarChartViz'
import { HorizontalBarChartViz } from './HorizontalBarChartViz'
import { PieChartViz } from './PieChartViz'
import { DonutChartViz } from './DonutChartViz'
import { LineChartViz } from './LineChartViz'

export const CHART_COLORS = [
  '#01F9C6', // teal
  '#60A5FA', // blue
  '#FBBF24', // amber
  '#F87171', // red
  '#A78BFA', // purple
  '#FB923C', // orange
  '#34D399', // emerald
  '#F472B6', // pink
  '#38BDF8', // sky
  '#E879F9', // fuchsia
]

export const CHART_THEME = {
  background: '#1F2937',
  text: '#D1D5DB',
  grid: '#374151',
  tooltip: { bg: '#0A0A0B', border: '#2C2C2E' },
}

/**
 * Normalize chart data from the agent:
 * - Coerce y_key values to numbers (strip $, commas, %, etc.)
 * - Truncate x_key labels to maxLen characters
 * - Filter out rows where y_key can't be parsed as a number
 */
export function normalizeChartData(
  data: Record<string, unknown>[],
  xKey: string,
  yKey: string,
  maxLabelLen = 24,
): Record<string, unknown>[] {
  return data
    .map(row => {
      const rawY = row[yKey]
      let numY: number
      if (typeof rawY === 'number') {
        numY = rawY
      } else if (typeof rawY === 'string') {
        numY = parseFloat(rawY.replace(/[$,%]/g, '').replace(/,/g, ''))
      } else {
        numY = NaN
      }
      if (isNaN(numY)) return null

      let label = String(row[xKey] ?? '')
      if (label.length > maxLabelLen) {
        label = label.slice(0, maxLabelLen - 1) + '…'
      }

      return { ...row, [yKey]: numY, [xKey]: label }
    })
    .filter((row): row is Record<string, unknown> => row !== null)
}

export function ChartRenderer({ visualization }: { visualization: VisualizationData }) {
  switch (visualization.chart_type) {
    case 'bar':
      return <BarChartViz visualization={visualization} />
    case 'horizontal_bar':
      return <HorizontalBarChartViz visualization={visualization} />
    case 'pie':
      return <PieChartViz visualization={visualization} />
    case 'donut':
      return <DonutChartViz visualization={visualization} />
    case 'line':
      return <LineChartViz visualization={visualization} />
    default:
      return <p className="text-neutral-400 text-sm">Unsupported chart type</p>
  }
}
