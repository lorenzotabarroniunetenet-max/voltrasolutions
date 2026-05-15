import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function BuyProgram() {
  const [programs, setPrograms] = useState([])
  const [paymentInfo, setPaymentInfo] = useState({ address: '', network: 'USDT TRC20' })
  const [selected, setSelected] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [step, setStep] = useState('select')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.programs().then(setPrograms).catch(() => {})
    api.paymentInfo().then(setPaymentInfo).catch(() => {})
  }, [])

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      await api.requestPurchase({ programId: selected.id, receiptUrl })
      setStep('done')
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  const copyAddress = () => navigator.clipboard.writeText(paymentInfo.address)

  if (step === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 60, maxWidth: 500, margin: '0 auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
        <h2 className="display" style={{ margin: '0 0 12px', fontSize: 24 }}>Richiesta inviata!</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Riceverai conferma via email entro 24h. Account attivato dopo verifica pagamento.</p>
        <button onClick={() => { setStep('select'); setSelected(null); }} className="btn-primary">Acquista un altro programma</button>
      </div>
    )
  }

  if (step === 'pay' && selected) {
    return (
      <div>
        <button onClick={() => setStep('select')} className="btn-secondary" style={{ marginBottom: 20 }}>← Indietro</button>
        <div className="card" style={{ maxWidth: 600, padding: 32 }}>
          <h2 className="display" style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 600 }}>Paga: {selected.name}</h2>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
            Invia <strong style={{ color: 'var(--lime)' }}>${Number(selected.priceUsd)}</strong> in {paymentInfo.network} all'indirizzo qui sotto.
          </div>

          <div style={{ background: 'var(--surface-2)', padding: 20, borderRadius: 12, marginBottom: 20 }}>
            <div className="label">Network</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{paymentInfo.network}</div>
            <div className="label">Indirizzo</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <code className="mono" style={{ flex: 1, fontSize: 13, wordBreak: 'break-all', color: 'var(--lime)' }}>{paymentInfo.address || '...'}</code>
              <button onClick={copyAddress} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>Copia</button>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 165, 2, 0.08)', border: '1px solid rgba(255, 165, 2, 0.3)', padding: 16, borderRadius: 8, fontSize: 13, marginBottom: 20 }}>
            ⚠️ Invia <strong>esattamente ${Number(selected.priceUsd)}</strong> tramite <strong>{paymentInfo.network}</strong>. Reti diverse = fondi persi.
          </div>

          <label className="label">Hash transazione o link ricevuta</label>
          <input className="voltra-input" value={receiptUrl} onChange={e => setReceiptUrl(e.target.value)} placeholder="Es. tronscan.org/#/transaction/..." style={{ marginBottom: 16 }} />

          {err && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{err}</div>}

          <button onClick={submit} className="btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Invio...' : 'Conferma pagamento'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Promozione di Grado</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Scegli il tuo programma</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {programs.map(p => (
          <div key={p.id} className="plan-card">
            <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>{p.phase}</div>
            <div className="display" style={{ fontSize: 48, fontWeight: 700, color: 'var(--lime)', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.04em' }}>
              ${Number(p.accountSize / 1000)}K
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{p.name}</div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, marginBottom: 20, flex: 1 }}>
              {p.profitTargetPct && <li style={{ padding: '6px 0' }}>{p.profitTargetPct}% profit target</li>}
              <li style={{ padding: '6px 0' }}>{p.maxDailyLossPct}% daily loss</li>
              <li style={{ padding: '6px 0' }}>{p.maxOverallLossPct}% max loss</li>
              <li style={{ padding: '6px 0', color: 'var(--lime)', fontWeight: 600 }}>{p.profitSplitPct}% profit split</li>
              <li style={{ padding: '6px 0' }}>Payout ogni {p.payoutFrequencyDays || 7} giorni</li>
            </ul>

            <div className="display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 12 }}>${Number(p.priceUsd || 0)}</div>
            <button onClick={() => { setSelected(p); setStep('pay'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Acquista</button>
          </div>
        ))}
      </div>
    </div>
  )
}
