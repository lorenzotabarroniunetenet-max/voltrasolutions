import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/Layout'
import EquityChart from '../components/EquityChart'
import TradesTable from '../components/TradesTable'
import StatCard from '../components/StatCard'
import { api } from '../lib/api'

export default function StrategyDetail() {
  const { id } = useParams()
  const [strategy, setStrategy] = useState(null)
  const [accounts, setAccounts] = useState([])
  const [showConnect, setShowConnect] = useState(false)

  useEffect(() => {
    api.getStrategy(id).then(setStrategy)
    api.getAccounts().then(setAccounts)
  }, [id])

  if (!strategy) return <Layout><div className="p-8 text-muted">Loading…</div></Layout>

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Link to="/strategies" className="text-sm text-muted hover:text-fg mb-4 inline-block">← Back to strategies</Link>

        {/* Header */}
        <div className="card p-6 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-mono font-bold text-xl">
                {strategy.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-fg">{strategy.trader}</h1>
                <div className="text-sm text-muted mt-1">{strategy.country} · {strategy.style}</div>
                <div className="flex items-center gap-3 mt-3 text-xs">
                  <span className="text-muted">★ <span className="num text-fg">{strategy.rating.toFixed(2)}</span></span>
                  <span className="text-muted"><span className="num text-fg">{strategy.followers.toLocaleString()}</span> followers</span>
                  <span className="text-muted">AUM <span className="num text-fg">${(strategy.aum/1000).toFixed(0)}k</span></span>
                  <span className="text-muted"><span className="num text-fg">{strategy.experience}</span> yrs exp</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowConnect(true)}
              className="px-5 py-2.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition shadow-glow"
            >
              Follow strategy
            </button>
          </div>
          <p className="text-sm text-muted mt-4 max-w-3xl">{strategy.bio}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          <StatCard label="ROI 12M" value={`+${strategy.roi}%`} accent="text-brand" />
          <StatCard label="Max DD" value={`-${strategy.drawdown}%`} accent="text-danger" />
          <StatCard label="Win Rate" value={`${strategy.winRate}%`} />
          <StatCard label="Sharpe" value={strategy.sharpe.toFixed(2)} />
          <StatCard label="Profit Factor" value={strategy.profitFactor.toFixed(2)} />
          <StatCard label="Trades 30D" value={strategy.trades30d} />
        </div>

        {/* Equity */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-fg">Equity Curve</h2>
              <div className="text-xs text-muted">Last 12 months · base $10,000</div>
            </div>
            <div className="flex gap-2 text-xs font-mono">
              <button className="px-2.5 py-1 rounded bg-surface2 text-muted">1M</button>
              <button className="px-2.5 py-1 rounded bg-surface2 text-muted">3M</button>
              <button className="px-2.5 py-1 rounded bg-surface2 text-muted">6M</button>
              <button className="px-2.5 py-1 rounded bg-brand/10 text-brand border border-brand/20">12M</button>
            </div>
          </div>
          <EquityChart data={strategy.equityCurve} height={340} />
        </div>

        {/* Trades */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-fg">Last 50 Trades</h2>
            <div className="text-xs font-mono text-muted">{strategy.trades.length} TRADES</div>
          </div>
          <TradesTable trades={strategy.trades} />
        </div>

        {showConnect && (
          <ConnectModal
            strategy={strategy}
            accounts={accounts.filter(a => !a.connectedStrategy || a.connectedStrategy === strategy.id)}
            onClose={() => setShowConnect(false)}
          />
        )}
      </div>
    </Layout>
  )
}

function ConnectModal({ strategy, accounts, onClose }) {
  const [accountId, setAccountId] = useState(accounts[0]?.id || '')
  const [lotRatio, setLotRatio] = useState(1.0)
  const [maxDd, setMaxDd] = useState(10)
  const [busy, setBusy] = useState(false)

  async function submit() {
    if (!accountId) return
    setBusy(true)
    await api.connectStrategy({ accountId, strategyId: strategy.id, lotRatio, maxDrawdown: maxDd })
    setBusy(false)
    onClose()
    window.location.href = '/dashboard'
  }

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="card p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-fg mb-1">Connect to {strategy.trader}</h3>
        <p className="text-sm text-muted mb-5">Configure risk parameters for auto-copy.</p>

        <div className="space-y-4">
          <label className="block">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">Funded account</div>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-fg outline-none focus:border-brand"
            >
              {accounts.length === 0 && <option value="">No available accounts</option>}
              {accounts.map(a => (
                <option key={a.id} value={a.id}>{a.label} — {a.id}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">Lot ratio: {lotRatio.toFixed(2)}x</div>
            <input type="range" min="0.1" max="3" step="0.05" value={lotRatio}
              onChange={(e) => setLotRatio(parseFloat(e.target.value))}
              className="w-full accent-brand" />
          </label>

          <label className="block">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">Max drawdown stop: {maxDd}%</div>
            <input type="range" min="3" max="25" step="1" value={maxDd}
              onChange={(e) => setMaxDd(parseInt(e.target.value))}
              className="w-full accent-brand" />
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-fg transition">Cancel</button>
          <button
            onClick={submit}
            disabled={!accountId || busy}
            className="flex-1 py-2.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition disabled:opacity-50"
          >
            {busy ? 'Connecting…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  )
}
