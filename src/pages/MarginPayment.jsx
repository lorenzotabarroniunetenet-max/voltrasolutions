import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CryptoConverter } from '../hooks/useCryptoPrices.jsx'
import { api } from '../lib/api.js'

const BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'

export default function MarginPayment() {
  const nav = useNavigate()
  const [margin, setMargin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [wallets, setWallets] = useState([])
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [txHash, setTxHash] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('voltra_token')
    Promise.all([
      fetch(`${BASE}/api/crypto/margin/me/active`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch(`${BASE}/api/purchase/payment-info`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()).catch(() => ({ wallets: [] }))
    ]).then(([m, info]) => {
      setMargin(m?.id ? m : null)
      const ws = Array.isArray(info?.wallets) ? info.wallets : []
      setWallets(ws)
      if (ws.length > 0) setSelectedNetwork(ws[0].network)
    }).finally(() => setLoading(false))
  }, [])

  const submit = async () => {
    if (!txHash.trim()) return
    setSubmitting(true)
    const token = localStorage.getItem('voltra_token')
    const net = wallets.find(w => w.network === selectedNetwork)
    await fetch(`${BASE}/api/crypto/margin/me/pay`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ txHash, network: selectedNetwork, cryptoAmount: '', cryptoCoin: net?.label || '' })
    })
    setDone(true)
    setSubmitting(false)
  }

  if (loading) return <div style={{ padding: 40, color: 'var(--muted)', textAlign: 'center' }}>Caricamento...</div>

  if (!margin) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Nessuna richiesta attiva</div>
      <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Non ci sono richieste di margine in sospeso.</div>
      <button onClick={() => nav('/dashboard')} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
        Torna al Quartier Generale
      </button>
    </div>
  )

  if (done) return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: 32, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Pagamento confermato</div>
      <div style={{ color: 'var(--muted)', marginBottom: 24 }}>Il Comando ha ricevuto la notifica. Verifica entro 24h.</div>
      <button onClick={() => nav('/dashboard')} style={{ background: 'var(--lime)', color: '#000', border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
        Torna al Quartier Generale
      </button>
    </div>
  )

  return (
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h1 className="display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>Margine Aggiuntivo</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 24, fontSize: 13 }}>
        Il Comando ha richiesto un versamento aggiuntivo come previsto dal contratto operativo.
      </p>

      <CryptoConverter
        eurAmount={margin.amount}
        selectedNetwork={selectedNetwork}
        onSelectNetwork={setSelectedNetwork}
        wallets={wallets.map(w => ({ ...w, id: w.network }))}
      />

      {selectedNetwork && (
        <div style={{ marginTop: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6, fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              TX Hash del pagamento
            </label>
            <input
              value={txHash}
              onChange={e => setTxHash(e.target.value)}
              placeholder="0x... oppure hash transazione"
              style={{ width: '100%', background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, padding: '11px 14px', color: '#fff', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, outline: 'none' }}
            />
          </div>
          <button
            onClick={submit}
            disabled={!txHash.trim() || submitting}
            style={{ width: '100%', background: txHash.trim() ? 'var(--lime)' : 'rgba(255,255,255,.05)', color: txHash.trim() ? '#000' : 'rgba(255,255,255,.2)', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: txHash.trim() ? 'pointer' : 'default', marginTop: 4, fontFamily: 'Manrope, sans-serif', transition: 'all .2s' }}
          >
            {submitting ? 'Invio...' : 'Ho effettuato il pagamento →'}
          </button>
        </div>
      )}
    </div>
  )
}
