import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function StrategyCard({ strategy }) {
  const s = strategy
  const sparkline = s.equityCurve.slice(-60).map(p => ({ v: p.equity }))
  const trendUp = sparkline[sparkline.length - 1].v >= sparkline[0].v
  const color = trendUp ? '#B4FF39' : '#FF3D71'

  return (
    <Link
      to={`/strategies/${s.id}`}
      className="card p-5 hover:border-brand/40 hover:shadow-glow transition block group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-mono font-semibold text-sm">
            {s.avatar}
          </div>
          <div>
            <div className="text-sm font-semibold text-fg">{s.trader}</div>
            <div className="text-xs text-muted">{s.country} · {s.style}</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted">
          <span className="text-brand">★</span>
          <span className="num">{s.rating.toFixed(2)}</span>
        </div>
      </div>

      <div className="h-14 -mx-1 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkline}>
            <Line
              type="monotone"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <Stat label="ROI 12M" value={`+${s.roi}%`} accent="text-brand" />
        <Stat label="Max DD" value={`-${s.drawdown}%`} accent="text-danger" />
        <Stat label="Win" value={`${s.winRate}%`} />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <span className="num text-fg">{s.followers.toLocaleString()}</span>
          <span>followers</span>
        </div>
        <div className="text-xs font-semibold text-brand group-hover:translate-x-1 transition">
          View →
        </div>
      </div>
    </Link>
  )
}

function Stat({ label, value, accent }) {
  return (
    <div>
      <div className="text-[9px] font-mono uppercase tracking-wider text-muted mb-0.5">{label}</div>
      <div className={`num text-sm font-semibold ${accent || 'text-fg'}`}>{value}</div>
    </div>
  )
}
