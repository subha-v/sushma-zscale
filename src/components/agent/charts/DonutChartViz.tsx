import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { VisualizationData } from '../../../lib/agent-api'
import { CHART_COLORS, CHART_THEME, normalizeChartData } from './ChartRenderer'

export function DonutChartViz({ visualization }: { visualization: VisualizationData }) {
  const { x_key, y_key } = visualization
  const data = normalizeChartData(visualization.data, x_key, y_key, 20)

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          dataKey={y_key}
          nameKey={x_key}
          cx="50%"
          cy="45%"
          innerRadius="38%"
          outerRadius="65%"
          label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
          labelLine={{ stroke: CHART_THEME.text }}
          fontSize={12}
          stroke={CHART_THEME.background}
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: CHART_THEME.tooltip.bg,
            border: `1px solid ${CHART_THEME.tooltip.border}`,
            borderRadius: '8px',
            color: '#fff',
            fontSize: 12,
            padding: '8px 12px',
          }}
          formatter={(value) => [Number(value).toLocaleString(), '']}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, color: CHART_THEME.text, paddingTop: 8 }}
          iconType="circle"
          iconSize={10}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
