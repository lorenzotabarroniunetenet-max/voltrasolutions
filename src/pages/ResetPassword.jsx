import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token')
  const nav = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) setErr('Token mancante. Richiedere nuovo recupero.')
  }, [token])

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    if (password.length < 8) { setErr('La credenziale deve essere di almeno 8 caratteri.'); return }
    if (password !== confirm) { setErr('Le due credenziali non coincidono.'); return }
    setLoading(true)
    try {
      await api.resetPassword(token, password)
      setMsg('Credenziale aggiornata. Reindirizzamento all\'accesso...')
      setTimeout(() => nav('/login'), 2000)
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--bg)' }}>
      <div className="voltra-card" style={{ maxWidth: 420, width: '100%', padding: 32 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, textDecoration: 'none', color: 'inherit' }}>
          <span style={{ fontSize: 24, color: 'var(--voltra-lime)' }}>⚡</span>
          <span className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.04em' }}>VOLTRA</span>
        </Link>

        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Nuova credenziale</h1>
        <p style={{ color: 'var(--voltra-muted)', margin: '0 0 24px', fontSize: 14, lineHeight: 1.6 }}>
          Definire la nuova credenziale di accesso. Minimo 8 caratteri.
        </p>

        {msg ? (
          <div style={{ padding: 16, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10, marginBottom: 16 }}>
            <div style={{ color: 'var(--voltra-lime)', fontSize: 14, lineHeight: 1.6 }}>{msg}</div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="voltra-label">Nuova credenziale</label>
            <input className="voltra-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 16 }} autoFocus />

            <label className="voltra-label">Conferma credenziale</label>
            <input className="voltra-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required style={{ marginBottom: 16 }} />

            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 16 }}>{err}</div>}

            <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading || !token}>
              {loading ? 'Aggiornamento...' : 'Conferma credenziale'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--voltra-muted)' }}>
          <Link to="/login" style={{ color: 'var(--voltra-lime)', textDecoration: 'none', fontWeight: 600 }}>← Torna all'accesso</Link>
        </div>
      </div>
    </div>
  )
}
