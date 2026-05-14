import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const NETWORKS = [
  { value: 'USDT_TRC20', label: 'USDT (TRC20 - Tron)' },
  { value: 'USDT_ERC20', label: 'USDT (ERC20 - Ethereum)' },
  { value: 'USDC_ERC20', label: 'USDC (ERC20 - Ethereum)' },
  { value: 'USDC_SOLANA', label: 'USDC (Solana)' },
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
]

export default function Payout() {
  const [accounts, setAccounts] = useState([])
  const [payouts, setPayouts] = useState([])
  const [form, setForm] = useState({ accountId: '', amountUsd: '', cryptoNetwork: 'USDT_TRC20', cryptoAddress: '' })
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.myAccounts().then(setAccounts).catch(() => {})
    api.myPayouts().then(setPayouts).catch(() => {})
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    setShowConfirm(true)
  }

  const confirm = async () => {
    setErr(''); setMsg(''); setLoading(true)
    try {
      await api.requestPayout({
        ...form,
        amountUsd: Number(form.amountUsd),
      })
      setMsg('Richiesta inviata. Ti contatteremo via email entro 24h.')
      setForm({ accountId: '', amountUsd: '', cryptoNetwork: 'USDT_TRC20', cryptoAddress: '' })
      setShowConfirm(false)
      api.myPayouts().then(setPayouts).catch(() => {})
    } catch (e) {
      setErr(e.message)
      setShowConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  const networkLabel = NETWORKS.find(n => n.value === form.cryptoNetwork)?.label || form.cryptoNetwork

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700 }}>Richiesta Payout</h1>
      <div style={{ color: 'var(--voltra-muted)', fontSize: 14, marginBottom: 24 }}>Ricevi i tuoi profitti in crypto</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24 }}>
        <div className="voltra-card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Nuova richiesta</h3>

          <form onSubmit={submit}>
            <label className="voltra-label">Account</label>
            <select className="voltra-input" value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} required style={{ marginBottom: 16 }}>
              <option value="">Seleziona account...</option>
              {accounts.filter(a => a.status === 'ACTIVE').map(a => (
                <option key={a.id} value={a.id}>{a.brokerLogin} — {a.program.name}</option>
              ))}
            </select>

            <label className="voltra-label">Importo (USD)</label>
            <input className="voltra-input" type="number" min="50" step="0.01" value={form.amountUsd} onChange={e => setForm({ ...form, amountUsd: e.target.value })} required style={{ marginBottom: 16 }} />

            <label className="voltra-label">Network</label>
            <select className="voltra-input" value={form.cryptoNetwork} onChange={e => setForm({ ...form, cryptoNetwork: e.target.value })} style={{ marginBottom: 16 }}>
              {NETWORKS.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
            </select>

            <label className="voltra-label">Indirizzo wallet</label>
            <input className="voltra-input" value={form.cryptoAddress} onChange={e => setForm({ ...form, cryptoAddress: e.target.value })} required placeholder="Es. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" style={{ marginBottom: 16 }} />

            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            {msg && <div style={{ color: 'var(--voltra-lime)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

            <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
              Richiedi Payout
            </button>
          </form>
        </div>

        {/* History */}
        <div className="voltra-card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16 }}>Storico richieste</h3>
          {payouts.length === 0 ? (
            <div style={{ color: 'var(--voltra-muted)', fontSize: 14 }}>Nessuna richiesta ancora.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {payouts.map(p => (
                <div key={p.id} style={{ padding: 12, background: '#0f0f0f', borderRadius: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <strong>${Number(p.amountUsd).toLocaleString()}</strong>
                    <span className={`badge ${
                      p.status === 'PAID' ? 'badge-success' :
                      p.status === 'REJECTED' ? 'badge-fail' :
                      p.status === 'APPROVED' ? 'badge-info' : 'badge-pending'
                    }`}>{p.status}</span>
                  </div>
                  <div style={{ color: 'var(--voltra-muted)' }}>
                    {p.cryptoNetwork} • {new Date(p.requestedAt).toLocaleDateString('it-IT')}
                  </div>
                  {p.txHash && <div style={{ color: 'var(--voltra-lime)', fontSize: 11, marginTop: 4, wordBreak: 'break-all' }}>TX: {p.txHash}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => !loading && setShowConfirm(false)}>
          <div className="voltra-card" style={{ maxWidth: 480, width: '90%', padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>⚠️ Conferma richiesta</h3>
            <p style={{ color: 'var(--voltra-muted)', fontSize: 14, marginBottom: 16 }}>
              Verifica che <strong>indirizzo</strong> e <strong>network</strong> siano corretti. Invii a indirizzi sbagliati sono irrecuperabili.
            </p>

            <div style={{ background: '#0f0f0f', padding: 16, borderRadius: 8, marginBottom: 20, fontSize: 13 }}>
              <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--voltra-muted)' }}>Importo:</span> <strong>${Number(form.amountUsd).toLocaleString()}</strong></div>
              <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--voltra-muted)' }}>Network:</span> <strong>{networkLabel}</strong></div>
              <div style={{ wordBreak: 'break-all' }}><span style={{ color: 'var(--voltra-muted)' }}>Indirizzo:</span><br /><strong>{form.cryptoAddress}</strong></div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowConfirm(false)} className="voltra-btn-secondary" style={{ flex: 1 }} disabled={loading}>Annulla</button>
              <button onClick={confirm} className="voltra-btn-primary" style={{ flex: 1 }} disabled={loading}>
                {loading ? 'Invio...' : 'Conferma'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
