import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const { user, token } = await api.register({ name, email, password })
      login(user, token)
      nav('/dashboard')
    } catch (e) { setErr(e.message) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 grid-bg">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8"><Logo size={36} /></div>
        <div className="card p-8">
          <h1 className="text-2xl font-bold text-fg mb-1">Create your account</h1>
          <p className="text-sm text-muted mb-6">Get your funded MT5 account in minutes.</p>
          <form onSubmit={submit} className="space-y-4">
            <Field label="Full name" value={name} onChange={setName} />
            <Field label="Email" type="email" value={email} onChange={setEmail} />
            <Field label="Password" type="password" value={password} onChange={setPassword} />
            {err && <div className="text-sm text-danger">{err}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition disabled:opacity-60"
            >
              {loading ? 'Creating…' : 'Sign up'}
            </button>
          </form>
          <div className="mt-6 text-center text-sm text-muted">
            Already have an account? <Link to="/login" className="text-brand hover:underline">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-fg outline-none focus:border-brand transition"
      />
    </label>
  )
}
