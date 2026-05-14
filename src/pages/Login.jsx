import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const user = await login(email, password)
      nav(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    } catch (e) {
      setErr(e.message)
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

        <h1 style={{ margin: '0 0 8px', fontSize: 22, fontWeight: 600 }}>Welcome back</h1>
        <p style={{ color: 'var(--voltra-muted)', margin: '0 0 24px', fontSize: 14 }}>Accedi al tuo account Voltra</p>

        <form onSubmit={submit}>
          <label className="voltra-label">Email</label>
          <input className="voltra-input" value={email} onChange={e => setEmail(e.target.value)} required style={{ marginBottom: 16 }} />

          <label className="voltra-label">Password</label>
          <input className="voltra-input" type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ marginBottom: 16 }} />

          {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 16 }}>{err}</div>}

          <button type="submit" className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Accesso...' : 'Sign in'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--voltra-muted)' }}>
          Non hai un account?{' '}
          <Link to="/register" style={{ color: 'var(--voltra-lime)', textDecoration: 'none', fontWeight: 600 }}>Sign up</Link>
        </div>
      </div>
    </div>
  )
}
