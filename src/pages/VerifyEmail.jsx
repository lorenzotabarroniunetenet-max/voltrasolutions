import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [err, setErr] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) { setStatus('error'); setErr('Token mancante'); return }
    api.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(e => { setStatus('error'); setErr(e.message) })
  }, [params])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div className="voltra-card" style={{ width: '100%', maxWidth: 420, padding: 32, textAlign: 'center' }}>
        {status === 'verifying' && (
          <>
            <div style={{ fontSize: 48 }}>⏳</div>
            <h1>Verifica in corso...</h1>
          </>
        )}
        {status === 'success' && (
          <>
            <div style={{ fontSize: 48 }}>✅</div>
            <h1>Email verificata!</h1>
            <p style={{ color: 'var(--voltra-muted)' }}>Ora puoi accedere al tuo account.</p>
            <Link to="/login" className="voltra-btn-primary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: 16 }}>
              Vai al login
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div style={{ fontSize: 48 }}>❌</div>
            <h1>Errore</h1>
            <p style={{ color: '#ff4757' }}>{err}</p>
            <Link to="/login" className="voltra-btn-secondary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: 16 }}>
              Torna al login
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
