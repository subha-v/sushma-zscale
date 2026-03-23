import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import type { VisualizationData } from '../../../lib/agent-api'
import { CHART_COLORS, CHART_THEME, normalizeChartData } from './ChartRenderer'

function formatNumber(val: number): string {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`
  return val.toLocaleString()
}

export function BarChartViz({ visualization }: { visualization: VisualizationData }) {
  const { x_key, y_key, x_label, y_label } = visualization
  const data = normalizeChartData(visualization.data, x_key, y_key, 20)
  const needsRotation = data.length > 5

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart
        data={data}
        margin={{ top: 16, right: 24, left: 24, bottom: needsRotation ? 80 : 40 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={CHART_THEME.grid} vertical={false} />
        <XAxis
          dataKey={x_key}
          tick={{ fill: CHART_THEME.text, fontSize: 11 }}
          axisLine={{ stroke: CHART_THEME.grid }}
          tickLine={false}
          interval={0}
          angle={needsRotation ? -35 : 0}
          textAnchor={needsRotation ? 'end' : 'middle'}
          height={needsRotation ? 80 : 40}
          label={x_label ? { value: x_label, position: 'insideBottom', offset: needsRotation ? -70 : -25, fill: CHART_THEME.text, fontSize: 12 } : undefined}
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
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Bar dataKey={y_key} radius={[4, 4, 0, 0]} maxBarSize={60}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
