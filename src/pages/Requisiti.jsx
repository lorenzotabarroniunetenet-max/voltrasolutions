import { useEffect, useState, useRef } from 'react'
import { api } from '../lib/api.js'
import { fireConfetti } from '../components/Confetti.jsx'

export default function Requisiti() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')
  const prevAchievedRef = useRef(null)

  useEffect(() => {
    api.requisiti().then(d => {
      if (prevAchievedRef.current !== null) {
        const newlyAchieved = d.requisiti.filter(r => r.achieved && !prevAchievedRef.current.has(r.slug))
        if (newlyAchieved.length > 0) fireConfetti()
      }
      prevAchievedRef.current = new Set(d.requisiti.filter(r => r.achieved).map(r => r.slug))
      setData(d)
    }).catch(e => setErr(e.message))
  }, [])

  if (err) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {err}</div>
  if (!data) return (
    <div>
      <div className="voltra-skeleton" style={{ height: 32, width: 280, marginBottom: 8, borderRadius: 6 }} />
      <div className="voltra-skeleton" style={{ height: 14, width: 400, marginBottom: 24, borderRadius: 6 }} />
      <div className="voltra-skeleton" style={{ height: 100, marginBottom: 24, borderRadius: 12 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...Array(7)].map((_, i) => <div key={i} className="voltra-skeleton" style={{ height: 80, borderRadius: 12 }} />)}
      </div>
    </div>
  )

  const { purchaseCount, requisiti } = data

  return (
    <div>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Requisiti da Soddisfare</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>
        Progressione operativa verso le onorificenze. L'assegnazione resta a discrezione del Comando.
      </div>

      <div className="card" style={{ padding: 24, marginBottom: 24, background: 'rgba(180,255,57,0.04)', border: '1px solid rgba(180,255,57,0.2)' }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 6 }}>Operazioni Concluse</div>
        <div className="display" style={{ fontSize: 44, fontWeight: 700, color: 'var(--lime)', lineHeight: 1 }}>{purchaseCount}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {requisiti.map(r => (
          <div key={r.slug} className="card voltra-scan-card" style={{
            padding: 20,
            opacity: r.achieved ? 1 : 0.85,
            border: r.awarded ? '1px solid rgba(180,255,57,0.4)' : r.achieved ? '1px solid rgba(180,255,57,0.2)' : '1px solid var(--border)',
            background: r.awarded ? 'rgba(180,255,57,0.06)' : 'var(--surface)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 28 }}>{r.iconKey}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
                  <h3 className="display" style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{r.name}</h3>
                  <div style={{ fontSize: 13, color: r.achieved ? 'var(--lime)' : 'var(--muted)', fontWeight: 600 }}>{r.progress} / {r.threshold}</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {r.awarded ? '✓ Conferita' : r.achieved ? 'Requisito soddisfatto — in attesa di conferimento' : `${r.threshold - r.progress} operazioni mancanti`}
                </div>
              </div>
            </div>

            <div style={{ height: 8, background: 'var(--surface-2)', borderRadius: 999, overflow: 'hidden', border: '1px solid var(--border)' }}>
              <div style={{
                height: '100%',
                width: `${r.percentage}%`,
                background: r.awarded ? 'var(--lime)' : r.achieved ? 'var(--lime)' : 'rgba(180,255,57,0.5)',
                borderRadius: 999,
                transition: 'width 0.8s cubic-bezier(.2,.7,.3,1)',
              }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, padding: 16, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)', fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
        Il raggiungimento del requisito non implica conferimento automatico. Ogni onorificenza è valutata e assegnata dal Comando in base al merito complessivo.
      </div>
    </div>
  )
}
