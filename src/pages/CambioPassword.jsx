import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function CambioPassword() {
  const nav = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg('')
    if (next.length < 8) return setErr('La nuova credenziale deve essere di almeno 8 caratteri.')
    if (next !== confirm) return setErr('Le credenziali non coincidono.')
    if (next === current) return setErr('La nuova credenziale deve essere diversa dalla precedente.')
    setLoading(true)
    try {
      await api.changePassword(current, next)
      setMsg('Credenziale aggiornata.')
      setTimeout(() => nav('/personale'), 1500)
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <button onClick={() => nav('/personale')} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13, padding: '8px 14px' }}>← Personale</button>

      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Cambio Credenziale</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Aggiornamento della credenziale di accesso</div>

      <div className="card" style={{ padding: 28 }}>
        {msg ? (
          <div style={{ padding: 16, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10, color: 'var(--lime)', fontSize: 14 }}>{msg}</div>
        ) : (
          <form onSubmit={submit}>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Credenziale attuale</label>
              <input className="voltra-input" type="password" value={current} onChange={e => setCurrent(e.target.value)} required autoFocus />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Nuova credenziale</label>
              <input className="voltra-input" type="password" value={next} onChange={e => setNext(e.target.value)} required />
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>Minimo 8 caratteri.</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label className="label">Conferma nuova credenziale</label>
              <input className="voltra-input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
            </div>

            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}

            <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Aggiornamento...' : 'Aggiorna credenziale'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
