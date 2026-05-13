import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#B4FF39', '#39C7FF', '#FFB23D', '#FF3D71', '#A855F7', '#22D3EE', '#84CC16']

export default function AllocationChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted text-sm">
        No active allocations
      </div>
    )
  }
  return (
    <div className="flex items-center gap-6">
      <div style={{ width: 180, height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              isAnimationActive={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="#0A0A0B" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#13131A', border: '1px solid #1F1F2A', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => `$${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex-1 space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-fg">{d.name}</span>
            </div>
            <span className="num text-muted">
              ${d.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
