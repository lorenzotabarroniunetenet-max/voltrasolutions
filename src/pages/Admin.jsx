import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { isAdmin, loading } = useAuth()
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!isAdmin) return
    Promise.all([api.admin.users(), api.admin.stats()]).then(([u, s]) => { setUsers(u); setStats(s) }).catch(() => {})
  }, [isAdmin])

  if (loading) return <Layout><div className="p-8 text-muted">Loading…</div></Layout>
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold mb-1">Admin</h1>
        <p className="text-sm text-muted mb-6">Platform overview</p>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <Stat label="Users" value={stats.users} />
            <Stat label="Accounts" value={stats.accounts} />
            <Stat label="Active Rules" value={stats.activeRules} accent="text-brand" />
            <Stat label="Total Trades" value={stats.totalTrades} />
            <Stat label="Open" value={stats.openTrades} accent="text-warn" />
          </div>
        )}

        <h2 className="font-semibold mb-3">Users ({users.length})</h2>
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
                <th className="p-3">Email</th><th className="p-3">Name</th><th className="p-3">Role</th>
                <th className="p-3">Plan</th><th className="p-3 text-right">Accounts</th>
                <th className="p-3 text-right">Rules</th><th className="p-3">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-border/50 hover:bg-surface2/40">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-muted">{u.name}</td>
                  <td className="p-3"><span className={`badge ${u.role === 'ADMIN' ? 'bg-brand/10 text-brand' : 'bg-surface2 text-muted'}`}>{u.role}</span></td>
                  <td className="p-3 font-mono text-xs">{u.plan}</td>
                  <td className="p-3 font-mono text-right">{u._count.accounts}</td>
                  <td className="p-3 font-mono text-right">{u._count.rules}</td>
                  <td className="p-3 font-mono text-xs text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
