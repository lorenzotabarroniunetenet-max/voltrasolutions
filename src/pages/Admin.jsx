import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import Layout from '../components/Layout'
import StatCard from '../components/StatCard'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Admin() {
  const { isAdmin, loading } = useAuth()
  const [tab, setTab] = useState('masters')

  if (loading) return <Layout><div className="p-8 text-muted">Loading…</div></Layout>
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-fg">Admin Panel</h1>
          <p className="text-sm text-muted">Manage masters, users, platform stats.</p>
        </div>

        <Stats />

        <div className="flex gap-2 border-b border-border mb-6 mt-8">
          <TabBtn active={tab === 'masters'} onClick={() => setTab('masters')}>Masters</TabBtn>
          <TabBtn active={tab === 'users'} onClick={() => setTab('users')}>Users</TabBtn>
        </div>

        {tab === 'masters' && <MastersTab />}
        {tab === 'users' && <UsersTab />}
      </div>
    </Layout>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold transition relative ${
        active ? 'text-brand' : 'text-muted hover:text-fg'
      }`}
    >
      {children}
      {active && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand" />}
    </button>
  )
}

function Stats() {
  const [stats, setStats] = useState(null)
  useEffect(() => { api.adminGetStats().then(setStats).catch(() => {}) }, [])
  if (!stats) return null
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard label="Total Users" value={stats.users} />
      <StatCard label="Active Masters" value={stats.activeMasters} />
      <StatCard label="Active Copies" value={stats.activeCopies} />
      <StatCard
        label="Platform P&L"
        value={`$${(stats.totalPnl * 0.30).toLocaleString('en-US', { maximumFractionDigits: 2 })}`}
        accent="text-brand"
        sublabel="30% split of all trades"
      />
    </div>
  )
}

function MastersTab() {
  const [list, setList] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)

  async function load() { setList(await api.adminGetMasters()) }
  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    if (!confirm('Delete this master?')) return
    await api.adminDeleteMaster(id); load()
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-fg">Masters ({list.length})</h2>
        <button onClick={() => setCreating(true)} className="text-sm font-semibold bg-brand text-bg px-4 py-2 rounded-lg hover:bg-brand-dim">
          + New Master
        </button>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
              <th className="text-left py-3 px-4">Name</th>
              <th className="text-left py-3 px-4">MT5 Login</th>
              <th className="text-left py-3 px-4">Style</th>
              <th className="text-right py-3 px-4">ROI</th>
              <th className="text-right py-3 px-4">DD</th>
              <th className="text-right py-3 px-4">Fee Split</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(m => (
              <tr key={m.id} className="border-b border-border/50 hover:bg-surface2/40">
                <td className="py-3 px-4 font-semibold text-fg">{m.name}</td>
                <td className="py-3 px-4 num text-muted">{m.mt5Login}</td>
                <td className="py-3 px-4 text-muted text-xs">{m.style}</td>
                <td className="py-3 px-4 num text-right text-brand">+{m.roi12m}%</td>
                <td className="py-3 px-4 num text-right text-danger">-{m.drawdown}%</td>
                <td className="py-3 px-4 num text-right text-fg">{(m.feeSplit * 100).toFixed(0)}%</td>
                <td className="py-3 px-4">
                  <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    m.status === 'ACTIVE' ? 'bg-brand/10 text-brand' :
                    m.status === 'PAUSED' ? 'bg-warn/10 text-warn' : 'bg-danger/10 text-danger'
                  }`}>{m.status}</span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button onClick={() => setEditing(m)} className="text-xs text-brand hover:underline mr-3">Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="text-xs text-danger hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {creating && <MasterModal onClose={() => { setCreating(false); load() }} />}
      {editing && <MasterModal master={editing} onClose={() => { setEditing(null); load() }} />}
    </div>
  )
}

function MasterModal({ master, onClose }) {
  const [data, setData] = useState(master || {
    name: '', country: '', style: '', bio: '',
    mt5Login: '', mt5Server: '', feeSplit: 0.30,
    status: 'ACTIVE', experience: 5,
    roi12m: 0, drawdown: 0, winRate: 0, sharpe: 0, profitFactor: 0, rating: 0
  })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const isEdit = !!master

  async function submit() {
    setBusy(true); setErr('')
    try {
      const payload = {
        ...data,
        feeSplit: parseFloat(data.feeSplit),
        experience: parseInt(data.experience) || 0,
        roi12m: parseFloat(data.roi12m),
        drawdown: parseFloat(data.drawdown),
        winRate: parseFloat(data.winRate),
        sharpe: parseFloat(data.sharpe),
        profitFactor: parseFloat(data.profitFactor),
        rating: parseFloat(data.rating)
      }
      if (isEdit) await api.adminUpdateMaster(master.id, payload)
      else await api.adminCreateMaster(payload)
      onClose()
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  const Field = ({ k, label, type = 'text' }) => (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">{label}</div>
      <input
        type={type}
        value={data[k] ?? ''}
        onChange={(e) => setData(d => ({ ...d, [k]: e.target.value }))}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-fg outline-none focus:border-brand"
      />
    </label>
  )

  return (
    <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm flex items-center justify-center z-50 px-4 overflow-y-auto py-8">
      <div className="card p-6 max-w-2xl w-full my-auto">
        <h3 className="text-lg font-semibold text-fg mb-1">{isEdit ? 'Edit' : 'New'} Master</h3>
        <p className="text-sm text-muted mb-5">MT5 trader profile published in marketplace.</p>
        <div className="grid grid-cols-2 gap-3">
          <Field k="name" label="Name" />
          <Field k="country" label="Country" />
          <Field k="style" label="Style" />
          <Field k="experience" label="Experience (years)" type="number" />
          <Field k="mt5Login" label="MT5 Login" />
          <Field k="mt5Server" label="MT5 Server" />
          <Field k="feeSplit" label="Platform Fee Split (0-1)" type="number" />
          <label className="block">
            <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Status</div>
            <select
              value={data.status}
              onChange={(e) => setData(d => ({ ...d, status: e.target.value }))}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-fg outline-none focus:border-brand"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </label>
          <Field k="roi12m" label="ROI 12M %" type="number" />
          <Field k="drawdown" label="Max Drawdown %" type="number" />
          <Field k="winRate" label="Win Rate %" type="number" />
          <Field k="sharpe" label="Sharpe Ratio" type="number" />
          <Field k="profitFactor" label="Profit Factor" type="number" />
          <Field k="rating" label="Rating (0-5)" type="number" />
        </div>
        <label className="block mt-3">
          <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1">Bio</div>
          <textarea
            rows="3"
            value={data.bio || ''}
            onChange={(e) => setData(d => ({ ...d, bio: e.target.value }))}
            className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-fg outline-none focus:border-brand"
          />
        </label>
        {err && <div className="text-sm text-danger mt-3">{err}</div>}
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-fg">Cancel</button>
          <button onClick={submit} disabled={busy}
            className="flex-1 py-2.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim disabled:opacity-50">
            {busy ? 'Saving…' : (isEdit ? 'Save' : 'Create')}
          </button>
        </div>
      </div>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  useEffect(() => { api.adminGetUsers().then(setUsers).catch(() => {}) }, [])
  return (
    <div className="card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
            <th className="text-left py-3 px-4">Email</th>
            <th className="text-left py-3 px-4">Name</th>
            <th className="text-left py-3 px-4">Role</th>
            <th className="text-right py-3 px-4">Accounts</th>
            <th className="text-right py-3 px-4">Copies</th>
            <th className="text-left py-3 px-4">Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b border-border/50 hover:bg-surface2/40">
              <td className="py-3 px-4 text-fg">{u.email}</td>
              <td className="py-3 px-4 text-muted">{u.name}</td>
              <td className="py-3 px-4">
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  u.role === 'ADMIN' ? 'bg-brand/10 text-brand' : 'bg-surface2 text-muted'
                }`}>{u.role}</span>
              </td>
              <td className="py-3 px-4 num text-right text-fg">{u._count.mt5Accounts}</td>
              <td className="py-3 px-4 num text-right text-fg">{u._count.copyRelations}</td>
              <td className="py-3 px-4 num text-muted text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
