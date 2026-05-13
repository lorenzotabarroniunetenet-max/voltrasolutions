import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../lib/api'

export default function ConnectAccount() {
  const nav = useNavigate()
  const [data, setData] = useState({ label: '', broker: '', server: '', login: '', password: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const F = ({ k, label, type = 'text', placeholder }) => (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">{label}</div>
      <input type={type} placeholder={placeholder} value={data[k]}
        onChange={(e) => setData(d => ({ ...d, [k]: e.target.value }))}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-fg outline-none focus:border-brand" />
    </label>
  )

  async function submit() {
    setBusy(true); setErr('')
    try {
      await api.connectAccount(data)
      nav('/dashboard')
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-fg mb-1">Connect MT5 Account</h1>
        <p className="text-sm text-muted mb-6">Link your existing MT5 account. Investor (read-only) credentials recommended.</p>
        <div className="card p-6 space-y-4">
          <F k="label" label="Label" placeholder="My main account" />
          <F k="broker" label="Broker" placeholder="IC Markets, Pepperstone, etc" />
          <F k="server" label="MT5 Server" placeholder="ICMarketsSC-Live01" />
          <F k="login" label="MT5 Login" placeholder="123456" />
          <F k="password" label="Password (encrypted at rest)" type="password" />
          {err && <div className="text-sm text-danger">{err}</div>}
          <div className="flex gap-2 pt-2">
            <button onClick={() => nav('/dashboard')} className="flex-1 py-2.5 rounded-lg border border-border text-muted hover:text-fg">Cancel</button>
            <button onClick={submit} disabled={busy} className="flex-1 py-2.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim disabled:opacity-50 shadow-glow">
              {busy ? 'Connecting…' : 'Connect'}
            </button>
          </div>
        </div>
        <p className="text-xs text-muted mt-4">
          Voltra never executes withdrawals. Credentials are stored AES-256 encrypted and only used to read trades and replicate signals from masters you choose.
        </p>
      </div>
    </Layout>
  )
}
