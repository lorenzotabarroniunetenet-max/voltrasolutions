import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import Logo from '../components/Logo'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const nav = useNavigate()
  const { login } = useAuth()
  const [data, setData] = useState({ name: '', email: '', password: '' })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setBusy(true); setErr('')
    try {
      const r = await api.register(data)
      login(r.user)
      nav('/dashboard')
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  const F = (k, l, type = 'text') => (
    <div><div className="label">{l}</div><input className="input" type={type} value={data[k]} onChange={e => setData(d => ({ ...d, [k]: e.target.value }))} required /></div>
  )

  return (
    <Layout>
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card p-8">
          <div className="flex justify-center mb-6"><Logo size={40} /></div>
          <h1 className="text-2xl font-bold text-center mb-1">Create account</h1>
          <p className="text-sm text-muted text-center mb-6">Start copying trades in minutes</p>
          <form onSubmit={submit} className="space-y-4">
            {F('name', 'Name')}
            {F('email', 'Email', 'email')}
            {F('password', 'Password (min 8 chars)', 'password')}
            {err && <div className="text-sm text-danger">{err}</div>}
            <button type="submit" disabled={busy} className="btn-primary w-full">{busy ? 'Creating…' : 'Create account'}</button>
          </form>
          <p className="text-sm text-muted text-center mt-6">Already have an account? <Link to="/login" className="text-brand">Sign in</Link></p>
        </div>
      </div>
    </Layout>
  )
}
