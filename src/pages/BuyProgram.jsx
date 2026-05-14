import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// TO CONFIGURE: tuo indirizzo USDC per ricevere pagamenti
const PAYMENT_ADDRESS = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'  // placeholder, sostituisci con il tuo
const PAYMENT_NETWORK = 'USDT TRC20'

export default function BuyProgram() {
  const [programs, setPrograms] = useState([])
  const [selected, setSelected] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [step, setStep] = useState('select')
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.programs().then(setPrograms).catch(() => {})
  }, [])

  const submit = async () => {
    setErr(''); setMsg(''); setLoading(true)
    try {
      await api.requestPurchase({ programId: selected.id, receiptUrl })
      setMsg('Richiesta inviata. Riceverai conferma entro 24h.')
      setStep('done')
    } catch (e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => navigator.clipboard.writeText(PAYMENT_ADDRESS)

  if (step === 'done') {
    return (
      <div className="voltra-card" style={{ textAlign: 'center', padding: 60, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 style={{ margin: '0 0 12px' }}>Richiesta inviata!</h2>
        <p style={{ color: 'var(--voltra-muted)', marginBottom: 24 }}>
          Riceverai una conferma via email entro 24h. Il tuo account verrà attivato manualmente dopo la verifica del pagamento.
        </p>
        <button onClick={() => { setStep('select'); setSelected(null); }} className="voltra-btn-primary">
          Acquista un altro programma
        </button>
      </div>
    )
  }

  if (step === 'pay' && selected) {
    return (
      <div>
        <button onClick={() => setStep('select')} className="voltra-btn-secondary" style={{ marginBottom: 20 }}>← Indietro</button>

        <div className="voltra-card" style={{ maxWidth: 600, padding: 32 }}>
          <h2 style={{ margin: '0 0 4px' }}>Paga: {selected.name}</h2>
          <div style={{ color: 'var(--voltra-muted)', fontSize: 14, marginBottom: 24 }}>
            Invia <strong style={{ color: 'var(--voltra-lime)' }}>${Number(selected.priceUsd)}</strong> in {PAYMENT_NETWORK} all'indirizzo qui sotto.
          </div>

          <div style={{ background: '#0f0f0f', padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--voltra-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Network
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{PAYMENT_NETWORK}</div>

            <div style={{ fontSize: 12, color: 'var(--voltra-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
              Indirizzo
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <code style={{ flex: 1, fontSize: 13, wordBreak: 'break-all', color: 'var(--voltra-lime)' }}>{PAYMENT_ADDRESS}</code>
              <button onClick={copyAddress} className="voltra-btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Copia</button>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 165, 2, 0.08)', border: '1px solid rgba(255, 165, 2, 0.3)', padding: 16, borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            ⚠️ Invia <strong>esattamente ${Number(selected.priceUsd)}</strong> tramite <strong>{PAYMENT_NETWORK}</strong>. Reti diverse = fondi persi.
          </div>

          <label className="voltra-label">Hash transazione o link ricevuta (opzionale)</label>
          <input className="voltra-input" value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} placeholder="Es. https://tronscan.org/#/transaction/..." style={{ marginBottom: 16 }} />

          {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}

          <button onClick={submit} className="voltra-btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Invio...' : 'Conferma pagamento'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700 }}>Acquista Programma</h1>
      <div style={{ color: 'var(--voltra-muted)', fontSize: 14, marginBottom: 24 }}>Scegli il tuo programma e inizia a tradare</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {programs.map(p => (
          <div key={p.id} className="voltra-card" style={{ padding: 24, display: 'flex', flexDirection: 'column' }}>
            <div style={{ color: 'var(--voltra-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {p.phase}
            </div>
            <h3 style={{ fontSize: 28, fontWeight: 800, margin: '8px 0', color: 'var(--voltra-lime)' }}>
              ${Number(p.accountSize).toLocaleString()}
            </h3>
            <div style={{ fontSize: 13, color: 'var(--voltra-muted)', marginBottom: 16 }}>{p.name}</div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, marginBottom: 20 }}>
              <Row label="Profit target" value={p.profitTargetPct ? `${p.profitTargetPct}%` : '—'} />
              <Row label="Daily loss" value={`${p.maxDailyLossPct}%`} />
              <Row label="Max loss" value={`${p.maxOverallLossPct}%`} />
              <Row label="Profit split" value={`${p.profitSplitPct}%`} highlight />
            </div>

            <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>${Number(p.priceUsd || 0)}</div>

            <button onClick={() => { setSelected(p); setStep('pay'); }} className="voltra-btn-primary">
              Acquista
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--voltra-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? 'var(--voltra-lime)' : 'var(--voltra-text)' }}>{value}</span>
    </div>
  )
}
