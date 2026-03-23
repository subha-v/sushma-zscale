import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { VisualizationData } from '../../../lib/agent-api'
import { CHART_COLORS, CHART_THEME, normalizeChartData } from './ChartRenderer'

function formatNumber(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
  return val.toLocaleString()
}

export function HorizontalBarChartViz({ visualization }: { visualization: VisualizationData }) {
  const { x_key, y_key, y_label } = visualization
  const data = normalizeChartData(visualization.data, x_key, y_key, 28)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 16, right: 32, left: 16, bottom: 16 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} horizontal={false} />
        <XAxis
          type="number"
          tick={{ fill: CHART_THEME.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={formatNumber}
          label={y_label ? { value: y_label, position: 'insideBottom', offset: -8, fill: CHART_THEME.text, fontSize: 12 } : undefined}
        />
        <YAxis
          type="category"
          dataKey={x_key}
          tick={{ fill: CHART_THEME.text, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={160}
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
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar dataKey={y_key} radius={[0, 4, 4, 0]} maxBarSize={28}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
