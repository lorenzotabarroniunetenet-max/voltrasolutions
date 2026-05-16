import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { useSonar } from '../context/SonarContext.jsx'

const NETWORKS = [
  { value: 'USDT_TRC20', label: 'USDT (TRC20 - Tron)' },
  { value: 'USDT_ERC20', label: 'USDT (ERC20 - Ethereum)' },
  { value: 'USDC_ERC20', label: 'USDC (ERC20 - Ethereum)' },
  { value: 'USDC_SOLANA', label: 'USDC (Solana)' },
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
]

const statusBadge = s => {
  const map = { PAID: ['badge-success', 'Completato'], REJECTED: ['badge-fail', 'Rifiutato'], APPROVED: ['badge-info', 'Approvato'], PENDING: ['badge-pending', 'In elaborazione'] }
  return map[s] || ['badge-pending', s]
}

export default function Payout() {
  const sonar = useSonar()
  const [accounts, setAccounts] = useState([])
  const [payouts, setPayouts] = useState([])
  const [form, setForm] = useState({ accountId: '', cryptoNetwork: 'USDT_TRC20', cryptoAddress: '' })
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.myAccounts().then(setAccounts).catch(() => {})
    api.myPayouts().then(setPayouts).catch(() => {})
  }, [])

  const submit = (e) => { e.preventDefault(); setShowConfirm(true) }

  const confirm = async () => {
    setErr(''); setMsg(''); setLoading(true)
    sonar?.show('INVIO RICHIESTA', 'RIMBORSO MISSIONE')
    try {
      await api.requestPayout({ ...form, amountUsd: 0 })
      setMsg('Rimborso missione richiesto. Ti contatteremo a breve.')
      setForm({ accountId: '', cryptoNetwork: 'USDT_TRC20', cryptoAddress: '' })
      setShowConfirm(false)
      api.myPayouts().then(setPayouts).catch(() => {})
    } catch (e) {
      setErr(e.message)
      setShowConfirm(false)
    } finally { sonar?.hide(); setLoading(false) }
  }

  const networkLabel = NETWORKS.find(n => n.value === form.cryptoNetwork)?.label || form.cryptoNetwork

  return (
    <div>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Rimborso Missione</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Richiedi il rimborso del tuo pacchetto</div>

      <div className="card" style={{ padding: 24, marginBottom: 20, background: 'rgba(180,255,57,0.03)', border: '1px solid rgba(180,255,57,0.15)' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <div style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>
            Il rimborso viene processato manualmente dal team Voltra secondo i termini del tuo contratto. Compila il modulo e ti contatteremo entro 24-48 ore.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Nuova richiesta rimborso</h3>

          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Pacchetto</label>
              <select className="voltra-input" value={form.accountId} onChange={e => setForm({ ...form, accountId: e.target.value })} required>
                <option value="">Seleziona pacchetto...</option>
                {accounts.filter(a => a.status === 'ACTIVE').map(a => (
                  <option key={a.id} value={a.id}>{a.program?.name} — {a.brokerLogin}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="label">Network crypto</label>
              <select className="voltra-input" value={form.cryptoNetwork} onChange={e => setForm({ ...form, cryptoNetwork: e.target.value })}>
                {NETWORKS.map(n => <option key={n.value} value={n.value}>{n.label}</option>)}
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Indirizzo wallet</label>
              <input className="voltra-input" value={form.cryptoAddress} onChange={e => setForm({ ...form, cryptoAddress: e.target.value })} required placeholder="Es. TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t" />
            </div>

            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            {msg && <div style={{ color: 'var(--lime)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              Richiedi rimborso missione
            </button>
          </form>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <h3 style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600 }}>Storico richieste</h3>
          {payouts.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nessuna richiesta ancora.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {payouts.map(p => {
                const [cls, label] = statusBadge(p.status)
                return (
                  <div key={p.id} style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 13 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <strong>Rimborso Missione</strong>
                      <span className={`badge ${cls}`}>{label}</span>
                    </div>
                    <div style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {p.cryptoNetwork} · {new Date(p.requestedAt).toLocaleDateString('it-IT')}
                    </div>
                    {p.txHash && <div style={{ color: 'var(--lime)', fontSize: 11, marginTop: 6, wordBreak: 'break-all' }}>TX: {p.txHash}</div>}
                    {p.rejectionReason && <div style={{ color: '#ff4757', fontSize: 11, marginTop: 6 }}>Motivo: {p.rejectionReason}</div>}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }}
          onClick={() => !loading && setShowConfirm(false)}>
          <div className="card" style={{ maxWidth: 480, width: '100%', padding: 28 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>Conferma rimborso missione</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 16, lineHeight: 1.6 }}>
              Verifica che <strong>indirizzo</strong> e <strong>network</strong> siano corretti prima di confermare. Gli invii a indirizzi errati sono irrecuperabili.
            </p>
            <div style={{ background: 'var(--surface-2)', padding: 16, borderRadius: 8, marginBottom: 20, fontSize: 13, border: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 8 }}><span style={{ color: 'var(--muted)' }}>Network:</span> <strong>{networkLabel}</strong></div>
              <div style={{ wordBreak: 'break-all' }}><span style={{ color: 'var(--muted)' }}>Indirizzo:</span><br /><strong style={{ fontSize: 12 }}>{form.cryptoAddress}</strong></div>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowConfirm(false)} className="btn-secondary" style={{ flex: 1 }} disabled={loading}>Annulla</button>
              <button onClick={confirm} className="btn-primary" style={{ flex: 1 }} disabled={loading}>{loading ? 'Invio...' : 'Conferma'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
