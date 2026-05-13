import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import AccountCard from '../components/AccountCard'
import StatCard from '../components/StatCard'
import { api } from '../lib/api'
import { subscribeLivePnL } from '../lib/ws'
import { STRATEGIES } from '../lib/mockData'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getAccounts().then((a) => { setAccounts(a); setLoading(false) })
    const unsub = subscribeLivePnL(setAccounts)
    return unsub
  }, [])

  async function handleDisconnect(accountId) {
    await api.disconnectStrategy(accountId)
    const updated = await api.getAccounts()
    setAccounts(updated)
  }

  const totalEquity = accounts.reduce((s, a) => s + a.equity, 0)
  const totalPnl = accounts.reduce((s, a) => s + a.pnl, 0)
  const active = accounts.filter(a => a.status === 'ACTIVE').length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-fg">Dashboard</h1>
              <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-brand bg-brand/10 border border-brand/20 px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-brand live-dot" /> Live
              </span>
            </div>
            <p className="text-sm text-muted">Manage funded accounts and connected strategies.</p>
          </div>
          <Link
            to="/strategies"
            className="text-sm font-semibold bg-brand text-bg px-4 py-2.5 rounded-lg hover:bg-brand-dim transition shadow-glow"
          >
            Browse Strategies
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Equity" value={`$${totalEquity.toLocaleString('en-US', { maximumFractionDigits: 2 })}`} sublabel="Across all accounts" />
          <StatCard
            label="Total P&L"
            value={`${totalPnl >= 0 ? '+' : ''}$${totalPnl.toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
            accent={totalPnl >= 0 ? 'text-brand' : 'text-danger'}
            sublabel="All-time"
          />
          <StatCard label="Active Strategies" value={active} sublabel={`${accounts.length} total accounts`} />
          <StatCard label="Tier" value="PRO" sublabel="20X leverage · Scaling enabled" accent="text-brand" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-fg">Funded Accounts</h2>
          <div className="text-xs font-mono text-muted">{accounts.length} ACCOUNTS</div>
        </div>

        {loading ? (
          <div className="text-muted text-sm">Loading accounts…</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {accounts.map((a) => {
              const strategy = STRATEGIES.find(s => s.id === a.connectedStrategy)
              return (
                <AccountCard
                  key={a.id}
                  account={a}
                  strategy={strategy}
                  onDisconnect={handleDisconnect}
                />
              )
            })}
          </div>
        )}
      </div>
    </Layout>
  )
}
