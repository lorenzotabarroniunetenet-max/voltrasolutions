import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await api.register(email, password, name)
      setDone(true)
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div className="voltra-card" style={{ width: '100%', maxWidth: 420, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📧</div>
          <h1 style={{ margin: '0 0 12px' }}>Controlla la tua email</h1>
          <p style={{ color: 'var(--voltra-muted)', fontSize: 14 }}>
            Abbiamo inviato un link di verifica a <strong>{email}</strong>. Clicca il link per attivare il tuo account.
          </p>
          <button onClick={() => nav('/login')} className="voltra-btn-primary" style={{ marginTop: 20 }}>
            Vai al login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="voltra-card" style={{ width: '100%', maxWidth: 420, padding: 32 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, color: 'var(--voltra-lime)' }}>⚡</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '0.05em', marginTop: 8 }}>VOLTRA</div>
        </div>

        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Crea il tuo account</h1>
        <p style={{ color: 'var(--voltra-muted)', margin: '0 0 24px', fontSize: 14 }}>Inizia a tradare con Voltra</p>

        <form onSubmit={submit}>
          <label className="voltra-label">Nome</label>
          <input className="voltra-input" value={name} onChange={e => setName(e.target.value)} required style={{ marginBottom: 16 }} />

          <label className="voltra-label">Email</label>
          <input className="voltra-input" type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16 }} />

          <label className="voltra-label">Password (min 8 caratteri)</label>
          <input className="voltra-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} style={{ marginBottom: 16 }} />

          {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 16 }}>{err}</div>}

          <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Creazione...' : 'Sign up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--voltra-muted)' }}>
          Hai già un account?{' '}
          <Link to="/login" style={{ color: 'var(--voltra-lime)', textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
