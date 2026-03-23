import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import type { VisualizationData } from '../../../lib/agent-api'
import { CHART_THEME, normalizeChartData } from './ChartRenderer'

function formatNumber(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
  return val.toLocaleString()
}

export function LineChartViz({ visualization }: { visualization: VisualizationData }) {
  const { x_key, y_key, x_label, y_label } = visualization
  const data = normalizeChartData(visualization.data, x_key, y_key, 20)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 24, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} />
        <XAxis
          dataKey={x_key}
          tick={{ fill: CHART_THEME.text, fontSize: 11 }}
          axisLine={{ stroke: CHART_THEME.grid }}
          tickLine={false}
          label={x_label ? { value: x_label, position: 'insideBottom', offset: -25, fill: CHART_THEME.text, fontSize: 12 } : undefined}
        />
        <YAxis
          tick={{ fill: CHART_THEME.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatNumber}
          width={60}
          label={y_label ? { value: y_label, angle: -90, position: 'insideLeft', offset: 8, fill: CHART_THEME.text, fontSize: 12 } : undefined}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltip.bg,
            border: `1px solid ${CHART_THEME.tooltip.border}`,
            borderRadius: '8px',
            color: '#fff',
            fontSize: 12,
            padding: '8px 12px',
          }}
          formatter={(value) => [Number(value).toLocaleString(), y_label || y_key]}
        />
        <Line
          type="monotone"
          dataKey={y_key}
          stroke="#01F9C6"
          strokeWidth={2.5}
          dot={{ fill: '#01F9C6', r: 5, strokeWidth: 0 }}
          activeDot={{ r: 7, fill: '#01F9C6', strokeWidth: 0 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
