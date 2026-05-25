import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'

export default function MarginBanner() {
  const [margin, setMargin] = useState(null)
  const nav = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('voltra_token')
    fetch(`${BASE}/api/crypto/margin/me/active`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data?.id) setMargin(data) })
      .catch(() => {})
  }, [])

  if (!margin) return null

  return (
    <div style={{
      background: 'linear-gradient(135deg,rgba(255,71,87,.08),rgba(255,71,87,.04))',
      border: '1px solid rgba(255,71,87,.3)',
      borderRadius: 14,
      padding: '18px 20px',
      marginBottom: 20,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'linear-gradient(90deg,transparent,#ff4757,transparent)' }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#ff4757', marginBottom: 4 }}>
            ⚠️ Richiesta di Margine Aggiuntivo
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.6, marginBottom: 12 }}>
            Il Comando richiede il versamento di un margine aggiuntivo come previsto dal contratto operativo.
          </div>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 28, fontWeight: 900, color: '#ff4757', marginBottom: 12 }}>
            €{margin.amount?.toFixed(2)}
          </div>
          <button
            onClick={() => nav('/margine')}
            style={{ background: '#ff4757', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 9, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', letterSpacing: '.02em' }}
          >
            Procedi al pagamento →
          </button>
        </div>
      </div>
    </div>
  )
}
