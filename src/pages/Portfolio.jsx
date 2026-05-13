import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import AllocationChart from '../components/AllocationChart'
import TradesTable from '../components/TradesTable'
import PnL from '../components/PnL'
import { api } from '../lib/api'
import { subscribeLivePnL } from '../lib/ws'

export default function Portfolio() {
  const [data, setData] = useState(null)
  const [showDep, setShowDep] = useState(false)
  const [showWd, setShowWd] = useState(false)

  useEffect(() => {
    api.getPortfolio().then(setData)
    const unsub = subscribeLivePnL(() => api.getPortfolio().then(setData))
    return unsub
  }, [])

  if (!data) return <Layout><div className="p-8 text-muted">Loading…</div></Layout>

  const { summary, allocation, liveTrades, accounts } = data

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-fg">Portfolio</h1>
            <p className="text-sm text-muted">Cross-account overview and live activity.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDep(true)}
              className="text-sm font-semibold border border-brand/30 text-brand px-4 py-2.5 rounded-lg hover:bg-brand/10 transition"
            >
              Deposit
            </button>
            <button
              onClick={() => setShowWd(true)}
              className="text-sm font-semibold border border-border text-fg px-4 py-2.5 rounded-lg hover:border-brand/40 transition"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Balance" value={`$${summary.totalBalance.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
          <StatCard label="Total Equity" value={`$${summary.totalEquity.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} />
          <div className="card p-5">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-2">Total P&L</div>
            <PnL value={summary.totalPnl} pct={summary.totalPnlPct} size="xl" />
          </div>
          <StatCard label="Active Strategies" value={summary.activeStrategies} sublabel={`${summary.accountsCount} accounts`} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="card p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-fg mb-4">Allocation by Strategy</h2>
            <AllocationChart data={allocation} />
          </div>
          <div className="card p-6">
            <h2 className="text-lg font-semibold text-fg mb-4">Accounts</h2>
            <div className="space-y-3">
              {accounts.map((a) => (
                <div key={a.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="text-sm font-semibold text-fg">{a.label}</div>
                    <div className="text-[10px] font-mono text-muted">{a.id}</div>
                  </div>
                  <div className="text-right">
                    <div className="num text-sm text-fg">${a.equity.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
                    <PnL value={a.pnl} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-fg">Live Trades</h2>
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-brand live-dot" /> Streaming
              </span>
            </div>
            <div className="text-xs font-mono text-muted">{liveTrades.length} TRADES</div>
          </div>
          <TradesTable trades={liveTrades} showStrategy />
        </div>

        {showDep && <CashModal title="Deposit" onClose={() => setShowDep(false)} />}
        {showWd && <CashModal title="Withdraw" onClose={() => setShowWd(false)} />}
      </div>
    </Layout>
  )
}

function CashModal({ title, onClose }) {
  const [amount, setAmount] = useState(1000)
  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="card p-6 max-w-md w-full">
        <h3 className="text-lg font-semibold text-fg mb-1">{title}</h3>
        <p className="text-sm text-muted mb-5">Demo mode — no real funds are moved.</p>
        <label className="block mb-5">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">Amount (USD)</div>
          <input type="number" value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-fg num outline-none focus:border-brand" />
        </label>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-fg transition">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition">
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
