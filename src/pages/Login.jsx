import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailOtp, setEmailOtp] = useState('')
  const [needsOtp, setNeedsOtp] = useState(false)
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const { setUserFromLogin } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    setLoading(true)
    try {
      const res = await api.login(email, password, needsOtp ? emailOtp : undefined)
      api.auth.setToken(res.token)
      if (setUserFromLogin) setUserFromLogin(res.user)
      nav(res.user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (e) {
      if (e.message && e.message.includes('EMAIL_OTP_REQUIRED')) {
        setNeedsOtp(true)
        setMsg('Codice inviato alla tua email. Inseriscilo per completare l\'accesso.')
        setErr('')
      } else {
        setErr(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="voltra-card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, color: 'var(--voltra-lime)' }}>⚡</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.05em', marginTop: 8 }}>VOLTRA</div>
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>
          {needsOtp ? 'Verifica in due passaggi' : 'Accesso al Quartier Generale'}
        </h1>
        <p style={{ color: 'var(--voltra-muted)', margin: '0 0 24px', fontSize: 14 }}>
          {needsOtp ? `Codice inviato a ${email}` : 'Inserisca le credenziali di servizio'}
        </p>

        <form onSubmit={submit}>
          {!needsOtp ? (
            <>
              <label className="voltra-label">Email</label>
              <input className="voltra-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16 }} autoFocus />
              <label className="voltra-label">Password</label>
              <input className="voltra-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 16 }} />
            </>
          ) : (
            <>
              <label className="voltra-label">Codice di verifica</label>
              <input
                className="voltra-input"
                value={emailOtp}
                onChange={e => setEmailOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                style={{ marginBottom: 8, textAlign: 'center', fontSize: 22, letterSpacing: '0.4em', fontFamily: 'JetBrains Mono, monospace' }}
                placeholder="000000"
                autoFocus
                inputMode="numeric"
                maxLength="6"
              />
              <div style={{ fontSize: 11, color: 'var(--voltra-muted)', textAlign: 'center', marginBottom: 16 }}>
                Codice di 6 cifre · valido 10 minuti
              </div>
            </>
          )}

          {msg && <div style={{ color: 'var(--voltra-lime)', fontSize: 13, marginBottom: 12, padding: 10, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 8 }}>{msg}</div>}
          {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 16 }}>{err}</div>}

          <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Verifica...' : (needsOtp ? 'Verifica e accedi' : 'Accedi')}
          </button>

          {needsOtp && (
            <button type="button" onClick={() => { setNeedsOtp(false); setEmailOtp(''); setErr(''); setMsg('') }} className="voltra-btn-secondary" style={{ width: '100%', marginTop: 12 }}>
              ← Indietro
            </button>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>
          <Link to="/forgot-password" style={{ color: 'var(--voltra-muted)', textDecoration: 'none' }}>Credenziale dimenticata?</Link>
        </div>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--voltra-muted)' }}>
          Non sei ancora un membro?{' '}
          <Link to="/register" style={{ color: 'var(--voltra-lime)', textDecoration: 'none', fontWeight: 600 }}>Richiedi accesso</Link>
        </div>
      </div>
    </div>
  )
}
