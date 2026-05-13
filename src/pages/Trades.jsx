import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../lib/api'

export default function Trades() {
  const [list, setList] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.trades.list({ limit: 200 }), api.trades.stats()])
      .then(([t, s]) => { setList(t); setStats(s); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Trades</h1>
        <p className="text-sm text-muted mb-6">History of copied trades</p>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Stat label="Total" value={stats.total} />
            <Stat label="Open" value={stats.open} accent="text-warn" />
            <Stat label="Closed" value={stats.closed} />
            <Stat label="Total P&L" value={`$${(stats.totalPnl || 0).toFixed(2)}`} accent={stats.totalPnl >= 0 ? 'text-brand' : 'text-danger'} />
          </div>
        )}

        {loading ? <div className="text-sm text-muted">Loading…</div> :
         list.length === 0 ? (
          <div className="card p-12 text-center text-muted">No trades yet. Trades will appear here once your rules execute.</div>
         ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
                  <th className="p-3">Rule</th><th className="p-3">Symbol</th><th className="p-3">Side</th>
                  <th className="p-3 text-right">Lots</th><th className="p-3 text-right">Open</th><th className="p-3 text-right">Close</th>
                  <th className="p-3 text-right">P&L</th><th className="p-3">Status</th><th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {list.map(t => (
                  <tr key={t.id} className="border-b border-border/50 hover:bg-surface2/40">
                    <td className="p-3 text-xs">{t.rule?.label}</td>
                    <td className="p-3 font-mono font-semibold">{t.symbol}</td>
                    <td className="p-3"><span className={`badge ${t.side === 'BUY' ? 'bg-brand/10 text-brand' : 'bg-danger/10 text-danger'}`}>{t.side}</span></td>
                    <td className="p-3 font-mono text-right">{t.lots}</td>
                    <td className="p-3 font-mono text-right">{t.openPrice}</td>
                    <td className="p-3 font-mono text-right">{t.closePrice || '—'}</td>
                    <td className={`p-3 font-mono text-right ${t.pnl >= 0 ? 'text-brand' : 'text-danger'}`}>{t.pnl >= 0 ? '+' : ''}${(t.pnl || 0).toFixed(2)}</td>
                    <td className="p-3"><span className={`badge ${t.status === 'OPEN' ? 'bg-warn/10 text-warn' : t.status === 'CLOSED' ? 'bg-brand/10 text-brand' : 'bg-danger/10 text-danger'}`}>{t.status}</span></td>
                    <td className="p-3 font-mono text-xs text-muted">{new Date(t.openedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         )}
      </div>
    </Layout>
  )
}

function Stat({ label, value, accent = 'text-fg' }) {
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className={`text-2xl font-mono font-bold mt-1 ${accent}`}>{value}</div>
    </div>
  )
}
