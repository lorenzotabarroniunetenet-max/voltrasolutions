import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Logo from '../components/Logo'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const r = await api.login(email, password)
      login(r.user)
      nav('/dashboard')
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card p-8">
          <div className="flex justify-center mb-6"><Logo size={40} /></div>
          <h1 className="text-2xl font-bold text-center mb-1">Welcome back</h1>
          <p className="text-sm text-muted text-center mb-6">Sign in to your Voltra account</p>
          <form onSubmit={submit} className="space-y-4">
            <div><div className="label">Email</div><input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></div>
            <div><div className="label">Password</div><input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
            {err && <div className="text-sm text-danger">{err}</div>}
            <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <p className="text-sm text-muted text-center mt-6">No account? <Link to="/register" className="text-brand">Sign up</Link></p>
        </div>
      </div>
    </Layout>
  )
}
