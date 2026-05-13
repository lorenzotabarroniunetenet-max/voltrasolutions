import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function EquityChart({ data, height = 320 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#B4FF39" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#B4FF39" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1F1F2A" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#8B8B96', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            tickFormatter={(d) => d.slice(5)}
            interval={Math.floor(data.length / 8)}
            stroke="#1F1F2A"
          />
          <YAxis
            tick={{ fill: '#8B8B96', fontSize: 11, fontFamily: 'JetBrains Mono' }}
            stroke="#1F1F2A"
            tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`}
            domain={['dataMin - 200', 'dataMax + 200']}
          />
          <Tooltip
            contentStyle={{
              background: '#13131A',
              border: '1px solid #1F1F2A',
              borderRadius: 8,
              fontFamily: 'JetBrains Mono',
              fontSize: 12
            }}
            labelStyle={{ color: '#8B8B96' }}
            itemStyle={{ color: '#B4FF39' }}
            formatter={(v) => [`$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Equity']}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#B4FF39"
            strokeWidth={2}
            fill="url(#eq)"
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
