import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../lib/api'

export default function Accounts() {
  const [list, setList] = useState([])
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState({})

  async function refresh(id) {
    setRefreshing(r => ({ ...r, [id]: true }))
    try { const u = await api.accounts.get(id); setList(l => l.map(a => a.id === id ? u : a)) } catch {}
    setRefreshing(r => ({ ...r, [id]: false }))
  }

  async function load() { setList(await api.accounts.list()); setLoading(false) }
  useEffect(() => { load() }, [])

  async function remove(id) {
    if (!confirm('Disconnect this account? All related rules will be deleted.')) return
    await api.accounts.remove(id); load()
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Accounts</h1>
            <p className="text-sm text-muted">Your connected MT5 accounts (masters and slaves)</p>
          </div>
          <button onClick={() => setAdding(true)} className="btn-primary">+ Connect account</button>
        </div>

        {loading ? <div className="text-sm text-muted">Loading…</div> :
         list.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-muted mb-4">No accounts connected yet.</div>
            <button onClick={() => setAdding(true)} className="btn-primary">Connect your first account</button>
          </div>
         ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
                  <th className="p-3">Label</th><th className="p-3">Type</th><th className="p-3">Platform</th><th className="p-3">Broker</th>
                  <th className="p-3">Server</th><th className="p-3">Login</th><th className="p-3 text-right">Balance</th>
                  <th className="p-3 text-right">Equity</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.id} className="border-b border-border/50 hover:bg-surface2/40">
                    <td className="p-3 font-semibold">{a.label}</td>
                    <td className="p-3"><span className={`badge ${a.type === 'MASTER' ? 'bg-brand/10 text-brand' : 'bg-surface2 text-muted'}`}>{a.type}</span></td>
                    <td className="p-3 font-mono text-muted">{a.platform}</td>
                    <td className="p-3 text-muted">{a.broker}</td>
                    <td className="p-3 font-mono text-xs text-muted">{a.server}</td>
                    <td className="p-3 font-mono text-muted">{a.login}</td>
                    <td className="p-3 font-mono text-right">{a.currency} {a.balance.toFixed(2)}</td>
                    <td className="p-3 font-mono text-right">{a.equity.toFixed(2)}</td>
                    <td className="p-3"><span className={`badge ${a.status === 'ACTIVE' ? 'bg-brand/10 text-brand' : 'bg-warn/10 text-warn'}`}>{a.status}</span></td>
                    <td className="p-3 text-right"><button onClick={() => refresh(a.id)} disabled={refreshing[a.id]} className="text-xs text-brand hover:underline disabled:opacity-40 mr-3">{refreshing[a.id] ? "…" : "Refresh"}</button><button onClick={() => remove(a.id)} className="text-xs text-danger hover:underline">Remove</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
         )}

        {adding && <AddModal onClose={() => { setAdding(false); load() }} />}
      </div>
    </Layout>
  )
}

function AddModal({ onClose }) {
  const [data, setData] = useState({ label: '', type: 'MASTER', platform: 'MT5', broker: '', server: '', login: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  async function submit() {
    setBusy(true); setErr('')
    try { await api.accounts.create(data); onClose() }
    catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  const F = (k, l, type = 'text', ph = '') => (
    <label className="block">
      <div className="label">{l}</div>
      <input className="input" type={type} placeholder={ph} value={data[k]} onChange={e => setData(d => ({ ...d, [k]: e.target.value }))} />
    </label>
  )

  return (
    <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="card p-6 max-w-2xl w-full mt-12">
        <h2 className="text-lg font-bold mb-1">Connect MT5 account</h2>
        <p className="text-sm text-muted mb-5">Investor (read-only) password recommended for slaves.</p>
        <div className="grid grid-cols-2 gap-3">
          {F('label', 'Label', 'text', 'My main MT5')}
          <label>
            <div className="label">Type</div>
            <select className="input" value={data.type} onChange={e => setData(d => ({ ...d, type: e.target.value }))}>
              <option value="MASTER">MASTER (source)</option>
              <option value="SLAVE">SLAVE (destination)</option>
            </select>
          </label>
          <label>
            <div className="label">Platform</div>
            <select className="input" value={data.platform} onChange={e => setData(d => ({ ...d, platform: e.target.value }))}>
              <option value="MT5">MT5</option>
              <option value="MT4">MT4</option>
              <option value="cTrader">cTrader</option>
            </select>
          </label>
          {F('broker', 'Broker', 'text', 'IC Markets')}
          {F('server', 'Server', 'text', 'ICMarketsSC-Live01')}
          {F('login', 'Login', 'text', '123456')}
          <div className="col-span-2">{F('password', 'Password', 'password')}</div>
        </div>
        {err && <div className="text-sm text-danger mt-3">{err}</div>}
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1">{busy ? 'Connecting…' : 'Connect'}</button>
        </div>
      </div>
    </div>
  )
}
