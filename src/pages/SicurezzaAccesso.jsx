import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function SicurezzaAccesso() {
  const nav = useNavigate()
  const [status, setStatus] = useState(null)
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const reload = () => api.email2faStatus().then(d => setStatus(d)).catch(() => {})
  useEffect(() => { reload() }, [])

  const enable = async () => {
    setLoading(true); setErr('')
    try {
      await api.email2faEnable()
      setMsg('Verifica via email attivata. Al prossimo accesso riceverai un codice.')
      reload()
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  const disable = async () => {
    if (!password) { setErr('Inserisci la tua credenziale per confermare.'); return }
    setLoading(true); setErr('')
    try {
      await api.email2faDisable(password)
      setMsg('Verifica via email disattivata.')
      setPassword('')
      reload()
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  if (status === null) return <div style={{ color: 'var(--muted)', padding: 20 }}>Caricamento...</div>

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <button onClick={() => nav('/personale')} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13, padding: '8px 14px' }}>← Personale</button>

      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Sicurezza dell'accesso</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Verifica in due passaggi via email</div>

      <div className="card" style={{ padding: 28 }}>
        {/* Spiegazione */}
        <div style={{ marginBottom: 20, fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
          Quando attiva, ad ogni accesso ti verrà inviato un codice numerico via email. Dovrai inserirlo dopo email e credenziale. Il codice è valido 10 minuti.
        </div>

        {status.enabled ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 16, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 24 }}>🔒</span>
              <div>
                <strong style={{ color: 'var(--lime)' }}>Verifica attiva</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Al login riceverai un codice via email.</div>
              </div>
            </div>

            <label className="label">Credenziale di conferma</label>
            <input className="voltra-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Per disattivare la verifica" style={{ marginBottom: 14 }} />
            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            {msg && <div style={{ color: 'var(--lime)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}
            <button onClick={disable} disabled={loading || !password} className="btn-secondary" style={{ width: '100%', color: '#ff4757', borderColor: '#ff4757' }}>
              {loading ? 'Disattivazione...' : 'Disabilita verifica'}
            </button>
          </>
        ) : (
          <>
            <div style={{ padding: 16, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 20, fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text)' }}>Consigliato.</strong> Riduce drasticamente il rischio di accessi non autorizzati: anche se qualcuno conoscesse la tua credenziale, non potrebbe accedere senza accesso anche alla tua casella email.
            </div>
            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            {msg && <div style={{ color: 'var(--lime)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}
            <button onClick={enable} disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? 'Attivazione...' : 'Attiva verifica via email'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
