import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const LOG_ICONS = {
  enlistment: '🚩',
  promotion: '🎖',
  decoration: '⚜',
  note: '◈',
  flag: '🚩',
  rank: '🎖',
}

export default function Fascicolo() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.dossier().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 20 }}>Caricamento Fascicolo...</div>
  if (!data) return <div style={{ color: 'var(--red)', padding: 20 }}>Errore caricamento</div>

  const { name, email, matricola, rank, lore, enlistedAt, daysOfService, decorations, serviceLog } = data
  const accentColor = lore?.color || '#B4FF39'

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Fascicolo Personale</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Documento di servizio</div>
        </div>
        <button onClick={() => window.print()} className="btn-secondary" style={{ fontSize: 12, padding: '8px 14px' }}>
          🖨 Esporta / Stampa PDF
        </button>
      </div>

      {/* Card identità */}
      <div className="card" style={{
        padding: 24, marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(180,255,57,0.04) 0%, var(--surface) 100%)',
        border: `1px solid ${accentColor}33`,
      }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{
            width: 76, height: 76, borderRadius: '50%',
            background: `${accentColor}15`,
            border: `1px solid ${accentColor}50`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 700, color: accentColor,
            flexShrink: 0,
          }}>
            {(name || '?').charAt(0).toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 11, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>
              {lore?.rank} {rank}
            </div>
            <div className="display" style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>{email}</div>
          </div>
        </div>

        <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Matricola</div>
            <div className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#fff' }}>{matricola}</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Anzianità</div>
            <div style={{ fontSize: 13, color: '#fff' }}>{daysOfService} giorni</div>
          </div>
          <div>
            <div style={{ fontSize: 9, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Arruolato il</div>
            <div style={{ fontSize: 13, color: '#fff' }}>{new Date(enlistedAt).toLocaleDateString('it-IT')}</div>
          </div>
        </div>

        {lore?.motto && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--border)', fontStyle: 'italic', fontSize: 14, color: accentColor, textAlign: 'center' }}>
            <TypewriterMotto motto={lore.motto} translation={lore.mottoTranslation} />
          </div>
        )}
      </div>

      {/* Decorazioni */}
      <div className="card" style={{ padding: 24, marginBottom: 20 }}>
        <h3 className="display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Albo delle Onorificenze</h3>
        {decorations.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>
            Albo ancora vuoto. Si conferisce per merito, mai per richiesta.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
            {decorations.map(d => {
              const isSigillo = d.slug === 'sigillo-fondatore'
              return (
                <div key={d.id} className="voltra-scan-card" style={{
                  background: isSigillo ? 'linear-gradient(135deg, rgba(232,200,74,0.15), rgba(0,0,0,0.4))' : 'var(--surface-2)',
                  border: isSigillo ? '1px solid rgba(232,200,74,0.5)' : '1px solid var(--border)',
                  borderRadius: 10,
                  padding: 14,
                  textAlign: 'center',
                  position: 'relative',
                  boxShadow: isSigillo ? '0 0 24px rgba(232,200,74,0.15)' : 'none',
                  overflow: 'hidden',
                }}>
                  {isSigillo && <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, color: '#E8C84A', fontWeight: 700, letterSpacing: '0.1em' }}>RARO</div>}
                  <div style={{ fontSize: 28, marginBottom: 8, filter: isSigillo ? 'drop-shadow(0 0 8px rgba(232,200,74,0.5))' : 'none' }}>{d.iconKey}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: isSigillo ? '#E8C84A' : '#fff', marginBottom: 4, lineHeight: 1.3 }}>{d.name}</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)' }}>{new Date(d.awardedAt).toLocaleDateString('it-IT')}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Ruolino di Servizio */}
      <div className="card" style={{ padding: 24 }}>
        <h3 className="display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Ruolino di Servizio</h3>
        {serviceLog.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, fontStyle: 'italic' }}>
            Ruolino in apertura. Le voci verranno registrate dal primo evento.
          </p>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Linea verticale */}
            <div style={{ position: 'absolute', left: 8, top: 8, bottom: 8, width: 1, background: 'var(--border)' }} />

            {serviceLog.map((entry, i) => (
              <div key={entry.id} style={{ position: 'relative', paddingBottom: 18 }}>
                <div style={{
                  position: 'absolute',
                  left: -22,
                  top: 2,
                  width: 16, height: 16,
                  borderRadius: '50%',
                  background: 'var(--surface)',
                  border: `2px solid ${i === 0 ? accentColor : 'var(--border-bright)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10,
                }}>
                  {LOG_ICONS[entry.type] || '•'}
                </div>
                <div style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                  {new Date(entry.occurredAt).toLocaleDateString('it-IT', { dateStyle: 'medium' })}
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{entry.title}</div>
                {entry.body && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{entry.body}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function TypewriterMotto({ motto, translation }) {
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [showTrans, setShowTrans] = useState(false)

  useEffect(() => {
    setText(''); setDone(false); setShowTrans(false)
    let i = 0
    const tick = () => {
      if (i < motto.length) {
        setText(motto.slice(0, i + 1))
        i++
        setTimeout(tick, 80)
      } else {
        setDone(true)
        setTimeout(() => setShowTrans(true), 400)
      }
    }
    tick()
  }, [motto])

  return (
    <>
      <span className={done ? 'voltra-typewriter done' : 'voltra-typewriter'}>« {text} »</span>
      <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, opacity: showTrans ? 1 : 0, transition: 'opacity 0.6s' }}>{translation}</div>
    </>
  )
}
