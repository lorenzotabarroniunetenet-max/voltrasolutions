import { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg(''); setLoading(true)
    try {
      const r = await api.forgotPassword(email)
      setMsg(r.message || 'Se la Linea risulta in archivio, riceverai le istruzioni a breve.')
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

        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Reimposta credenziale</h1>
        <p style={{ color: 'var(--voltra-muted)', margin: '0 0 24px', fontSize: 14, lineHeight: 1.6 }}>
          Inserire la Linea con cui si è registrato. Verranno trasmesse le istruzioni per il recupero.
        </p>

        {msg ? (
          <div style={{ padding: 16, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10, marginBottom: 16 }}>
            <div style={{ color: 'var(--voltra-lime)', fontSize: 14, lineHeight: 1.6 }}>{msg}</div>
          </div>
        ) : (
          <form onSubmit={submit}>
            <label className="voltra-label">Linea (email)</label>
            <input className="voltra-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16 }} autoFocus />

            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 16 }}>{err}</div>}

            <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Invio in corso...' : 'Richiedi reimpostazione'}
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
