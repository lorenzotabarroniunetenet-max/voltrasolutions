import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// Leggende dei gradi - hardcoded perché sono parte del brand
const GRADE_LORE = {
  Caporale: {
    rank: '🎖',
    mission: 'L\'Ultimo Avamposto',
    legend: 'La trincea è la sua casa. Il rumore della radio è il suo orologio. Il Caporale è il primo a salire e l\'ultimo a scendere — perché finché lui tiene la linea, il reparto resiste. Nessuna gloria, solo la costanza che vince le guerre lunghe.',
    color: 'lime',
  },
  Sergente: {
    rank: '⭐',
    mission: 'Il Messaggero',
    legend: 'Tra il fuoco e il Comando, c\'è una sola figura: il Sergente. Porta gli ordini sotto il bombardamento, riporta le perdite senza emozione, tiene gli uomini saldi quando il fronte cede. Non comanda: trasmette. E senza la sua voce, la guerra è perduta.',
    color: 'gold',
  },
  Capitano: {
    rank: '🦅',
    mission: 'Le Acque Profonde',
    legend: 'Si muove dove nessuno vede. Operazioni che non vengono mai dichiarate, missioni di cui nessuno scriverà la cronaca. Il Capitano agisce sul confine: dove finisce la mappa e inizia il giudizio.',
    color: 'wip',
  },
  Colonnello: {
    rank: '🎗',
    mission: 'L\'Ultima Linea',
    legend: 'Non porta più il fucile. Non legge più i bollettini. Il Colonnello guarda la mappa intera e decide chi rischia, chi resta, chi avanza. Le sue scelte si misurano nei decenni. Quando un Colonnello tace, l\'intero schieramento ascolta.',
    color: 'wip',
  },
}

const VALID_GRADES = Object.keys(GRADE_LORE)

export default function BuyProgram() {
  const [programs, setPrograms] = useState([])
  const [paymentInfo, setPaymentInfo] = useState(null)
  const [selected, setSelected] = useState(null)
  const [step, setStep] = useState('select')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    api.programs().then(d => {
      // Mostra solo i gradi militari validi, in ordine corretto
      const filtered = d.filter(p => VALID_GRADES.includes(p.name))
      filtered.sort((a, b) => VALID_GRADES.indexOf(a.name) - VALID_GRADES.indexOf(b.name))
      setPrograms(filtered)
    }).catch(() => {})
    api.paymentInfo().then(setPaymentInfo).catch(() => {})
  }, [])

  const requestPurchase = async () => {
    setErr(''); setMsg('')
    try {
      await api.requestPurchase({ programId: selected.id })
      setMsg('Richiesta inviata al Comando. Riceverai conferma a breve.')
      setStep('done')
    } catch (e) { setErr(e.message) }
  }

  if (step === 'done') {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 60, maxWidth: 520, margin: '40px auto' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎖</div>
        <h2 className="display" style={{ margin: '0 0 12px', fontSize: 22 }}>Richiesta trasmessa</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>{msg}</p>
        <button onClick={() => { setStep('select'); setSelected(null); }} className="btn-primary">Richiedi un altro grado</button>
      </div>
    )
  }

  if (step === 'pay' && selected) {
    const lore = GRADE_LORE[selected.name]
    return (
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <button onClick={() => setStep('select')} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13, padding: '8px 14px' }}>← Torna ai gradi</button>
        <div className="card" style={{ padding: 32 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>{lore?.rank}</div>
          <h2 className="display" style={{ margin: '0 0 4px', fontSize: 24 }}>{selected.name}</h2>
          <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{lore?.mission}</div>

          <div style={{ padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Quota accesso</span>
              <span className="display" style={{ fontSize: 28, fontWeight: 700, color: 'var(--lime)' }}>${Number(selected.priceUsd)}</span>
            </div>
          </div>

          {paymentInfo?.paymentAddress && (
            <div style={{ marginBottom: 20 }}>
              <div className="label">Indirizzo di pagamento ({paymentInfo.paymentNetwork || 'USDT TRC20'})</div>
              <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, fontSize: 12, wordBreak: 'break-all', fontFamily: 'monospace', border: '1px solid var(--border)' }}>
                {paymentInfo.paymentAddress}
              </div>
            </div>
          )}

          <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginBottom: 20 }}>
            Dopo il pagamento, conferma la richiesta. Il Comando verificherà la transazione e attiverà il grado.
          </p>

          {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}

          <button onClick={requestPurchase} className="btn-primary" style={{ width: '100%' }}>Conferma richiesta</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Promozione di Grado</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Seleziona il grado che ti appartiene</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {programs.map(p => {
          const lore = GRADE_LORE[p.name] || {}
          const isWip = !p.priceUsd
          const borderColor = lore.color === 'lime' ? 'rgba(180,255,57,0.2)' : lore.color === 'gold' ? 'rgba(232,200,74,0.2)' : 'var(--border)'

          return (
            <div key={p.id} className="card" style={{
              padding: 28,
              position: 'relative',
              overflow: 'hidden',
              border: `1px solid ${borderColor}`,
              opacity: isWip ? 0.55 : 1,
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Background rank */}
              <div style={{ position: 'absolute', top: -20, right: -10, fontSize: 110, opacity: 0.04, pointerEvents: 'none', lineHeight: 1 }}>{lore.rank}</div>

              {isWip && (
                <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase' }}>Coming Soon</div>
              )}

              <div style={{ fontSize: 36, marginBottom: 12 }}>{lore.rank}</div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <h3 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text)' }}>{p.name}</h3>
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>
                {lore.mission}
              </div>

              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 24, fontStyle: 'italic', flex: 1 }}>
                "{lore.legend}"
              </p>

              <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Quota accesso</div>
                  <div className="display" style={{ fontSize: 20, fontWeight: 700, color: isWip ? 'var(--muted-2)' : 'var(--lime)' }}>
                    {isWip ? 'WIP' : `$${Number(p.priceUsd)}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Dotazione</div>
                  <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>${Number(p.accountSize / 1000)}K</div>
                </div>
              </div>

              {isWip ? (
                <button disabled className="btn-secondary" style={{ width: '100%', justifyContent: 'center', cursor: 'not-allowed', opacity: 0.5 }}>In preparazione</button>
              ) : (
                <button onClick={() => { setSelected(p); setStep('pay'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Richiedi Grado →</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
