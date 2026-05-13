import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../lib/api'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [rules, setRules] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.accounts.list(), api.rules.list(), api.trades.stats().catch(() => null)])
      .then(([a, r, s]) => { setAccounts(a); setRules(r); setStats(s); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const masters = accounts.filter(a => a.type === 'MASTER').length
  const slaves = accounts.filter(a => a.type === 'SLAVE').length
  const activeRules = rules.filter(r => r.status === 'ACTIVE').length

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-sm text-muted mb-6">Overview of your trade copier setup</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Stat label="Master accounts" value={masters} accent="text-fg" />
          <Stat label="Slave accounts" value={slaves} accent="text-fg" />
          <Stat label="Active rules" value={activeRules} accent="text-brand" />
          <Stat label="Total trades" value={stats?.total || 0} accent="text-fg" sub={stats?.open ? `${stats.open} open` : null} />
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          <Section title="Accounts" link="/accounts" linkText="Manage">
            {loading ? <Skel /> :
              accounts.length === 0 ? <Empty msg="No accounts. Connect your MT5 to start." cta="/accounts" ctaText="Connect account" /> :
              <ul className="space-y-2">
                {accounts.slice(0, 6).map(a => (
                  <li key={a.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-semibold text-fg">{a.label}</div>
                      <div className="text-xs text-muted font-mono">{a.broker} · {a.login}</div>
                    </div>
                    <span className={`badge ${a.type === 'MASTER' ? 'bg-brand/10 text-brand' : 'bg-surface2 text-muted'}`}>{a.type}</span>
                  </li>
                ))}
              </ul>
            }
          </Section>

          <Section title="Copy rules" link="/rules" linkText="Manage">
            {loading ? <Skel /> :
              rules.length === 0 ? <Empty msg="No rules yet. Create one to start copying." cta="/rules" ctaText="Create rule" /> :
              <ul className="space-y-2">
                {rules.slice(0, 6).map(r => (
                  <li key={r.id} className="flex items-center justify-between p-3 bg-bg rounded-lg border border-border">
                    <div>
                      <div className="text-sm font-semibold text-fg">{r.label}</div>
                      <div className="text-xs text-muted font-mono">{r.master?.label} → {r.slave?.label}{r.reverse ? ' (REVERSE)' : ''}</div>
                    </div>
                    <span className={`badge ${r.status === 'ACTIVE' ? 'bg-brand/10 text-brand' : 'bg-warn/10 text-warn'}`}>{r.status}</span>
                  </li>
                ))}
              </ul>
            }
          </Section>
        </div>
      </div>
    </Layout>
  )
}

function Stat({ label, value, accent = 'text-fg', sub }) {
  return (
    <div className="card p-4">
      <div className="label">{label}</div>
      <div className={`text-2xl font-mono font-bold mt-1 ${accent}`}>{value}</div>
      {sub && <div className="text-xs text-muted mt-1">{sub}</div>}
    </div>
  )
}
function Section({ title, link, linkText, children }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-fg">{title}</h2>
        <Link to={link} className="text-xs text-brand hover:underline">{linkText} →</Link>
      </div>
      {children}
    </div>
  )
}
function Skel() { return <div className="text-sm text-muted">Loading…</div> }
function Empty({ msg, cta, ctaText }) {
  return (
    <div className="text-center py-6">
      <div className="text-sm text-muted mb-3">{msg}</div>
      <Link to={cta} className="btn-primary inline-block text-sm">{ctaText}</Link>
    </div>
  )
}
