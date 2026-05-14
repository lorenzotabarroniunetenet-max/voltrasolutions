import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend, CartesianGrid } from 'recharts'

export default function GrowthChart({ snapshots, account, program }) {
  if (!snapshots || snapshots.length === 0) {
    return (
      <div className="voltra-card" style={{ minHeight: 320, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--voltra-muted)' }}>
        Nessun dato disponibile. Inizia a tradare per vedere la crescita.
      </div>
    )
  }

  const startBalance = Number(account.startBalance)
  const mllFloor = startBalance * (1 - Number(program.maxOverallLossPct) / 100)
  const target = program.profitTargetPct
    ? startBalance * (1 + Number(program.profitTargetPct) / 100)
    : null

  const data = snapshots.map(s => {
    const balance = Number(s.balance)
    const equity = Number(s.equity)
    const dllFloor = balance * (1 - Number(program.maxDailyLossPct) / 100)
    return {
      date: new Date(s.date).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }),
      Saldo: balance,
      Equity: equity,
      DLL: Math.round(dllFloor),
    }
  })

  return (
    <div className="voltra-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Crescita dell'account</h3>
        <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
          {target && <span style={{ color: 'var(--voltra-lime)' }}>● Target: ${target.toLocaleString()}</span>}
          <span style={{ color: '#36a2eb' }}>● Saldo</span>
          <span style={{ color: '#a78bfa' }}>● Equity</span>
          <span style={{ color: '#ff4757' }}>● MLL: ${mllFloor.toLocaleString()}</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
          <XAxis dataKey="date" stroke="#888" style={{ fontSize: 11 }} />
          <YAxis stroke="#888" style={{ fontSize: 11 }} domain={['auto', 'auto']} />
          <Tooltip
            contentStyle={{ background: '#141414', border: '1px solid #2a2a2a', borderRadius: 8 }}
            labelStyle={{ color: '#888' }}
          />
          <ReferenceLine y={mllFloor} stroke="#ff4757" strokeDasharray="4 4" label={{ value: 'MLL', fill: '#ff4757', fontSize: 11 }} />
          {target && <ReferenceLine y={target} stroke="#B4FF39" strokeDasharray="4 4" label={{ value: 'Target', fill: '#B4FF39', fontSize: 11 }} />}
          <Line type="monotone" dataKey="Saldo" stroke="#36a2eb" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="Equity" stroke="#a78bfa" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="DLL" stroke="#ffa502" strokeWidth={1.5} dot={false} strokeDasharray="2 2" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
