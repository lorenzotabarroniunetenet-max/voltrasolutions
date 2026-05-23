import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const TOUR_KEY = 'voltra.tour.done'

const STEPS = [
  {
    id: 'tour-mission',
    pos: 'below',
    title: 'La tua Missione',
    desc: 'Stato della tua missione in tempo reale — grado, dotazione e pool assegnato. Il primo posto dove guardare ogni volta che entri.',
  },
  {
    id: 'tour-kpi',
    pos: 'below',
    title: 'Statistiche operative',
    desc: 'Equity, profitto, drawdown e giorni di trading. Monitora i tuoi indicatori chiave in un colpo d\'occhio.',
  },
  {
    id: 'tour-streak',
    pos: 'below',
    title: 'Streak & Tiro del Comando',
    desc: 'La streak conta i giorni consecutivi di attività. Il Tiro del Comando è l\'estrazione giornaliera — falla ogni giorno per non perderla.',
  },
  {
    id: 'tour-buy',
    pos: 'below',
    title: 'Nuova Missione',
    desc: 'Per scalare di grado o avviare una nuova missione. Scegli il grado, versa in crypto e carica la ricevuta. Approvazione entro 24 ore.',
  },
  {
    id: 'tour-briefing',
    pos: 'below',
    title: 'Sala Briefing',
    desc: 'Ordini del Giorno e comunicazioni ufficiali del Comando. Leggile — contengono informazioni operative per la tua missione.',
  },
  {
    id: 'tour-linea',
    pos: 'below',
    title: 'Linea Diretta HQ',
    desc: 'Hai un problema? Scrivici dal sito. Il Comando risponde entro 24 ore — le risposte arrivano anche via bot Telegram.',
  },
]

export default function TourOverlay() {
  const [step, setStep] = useState(-1)
  const [rect, setRect] = useState(null)
  const [visible, setVisible] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    if (localStorage.getItem(TOUR_KEY)) return
    // Delay per dare tempo al DOM di renderizzare
    const t = setTimeout(() => setVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const el = document.getElementById(STEPS[step].id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    const t = setTimeout(() => {
      setRect(el.getBoundingClientRect())
    }, 400)
    return () => clearTimeout(t)
  }, [step])

  const startTour = () => setStep(0)
  const skipTour = () => { localStorage.setItem(TOUR_KEY, '1'); setVisible(false) }
  const nextStep = () => {
    if (step >= STEPS.length - 1) {
      localStorage.setItem(TOUR_KEY, '1')
      setStep(-1)
      setVisible(false)
    } else {
      setStep(s => s + 1)
    }
  }

  if (!visible) return null

  const pad = 8
  const s = step >= 0 && step < STEPS.length ? STEPS[step] : null
  const spaceBelow = rect ? window.innerHeight - rect.bottom : 999
  const above = s?.pos === 'above' || spaceBelow < 240

  return (
    <>
      {/* START SCREEN */}
      {step === -1 && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,.92)', zIndex: 2000,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 16, padding: 32,
        }}>
          <div style={{ fontSize: 52 }}>🎖</div>
          <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 26, fontWeight: 800, textAlign: 'center', letterSpacing: '-.02em' }}>
            Benvenuto nel Comando
          </div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,.4)', textAlign: 'center', maxWidth: 320, lineHeight: 1.7 }}>
            Ti mostro dove si trova tutto in 30 secondi. Puoi saltare in qualsiasi momento.
          </div>
          <button onClick={startTour} style={{
            width: '100%', maxWidth: 320, padding: '15px', background: 'var(--lime)',
            color: '#000', border: 'none', fontFamily: 'Bricolage Grotesque, sans-serif',
            fontWeight: 900, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.04em',
            cursor: 'pointer', borderRadius: 12,
          }}>⚡ Inizia il tour</button>
          <button onClick={skipTour} style={{
            background: 'transparent', border: 'none', color: 'rgba(255,255,255,.2)',
            fontSize: 13, cursor: 'pointer', fontFamily: 'Manrope, sans-serif',
          }}>Salta — lo faccio dopo</button>
        </div>
      )}

      {/* TOUR IN PROGRESS */}
      {step >= 0 && s && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, pointerEvents: 'all' }}>
          {/* Mask */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.78)' }} onClick={nextStep} />

          {/* Highlight ring */}
          {rect && (
            <div style={{
              position: 'absolute',
              top: rect.top - pad, left: rect.left - pad,
              width: rect.width + pad * 2, height: rect.height + pad * 2,
              borderRadius: 14, border: '2px solid var(--lime)',
              boxShadow: '0 0 0 4px rgba(180,255,57,.15), 0 0 32px rgba(180,255,57,.2)',
              pointerEvents: 'none',
              transition: 'all .35s cubic-bezier(.4,0,.2,1)',
            }} />
          )}

          {/* Tooltip */}
          {rect && (
            <div style={{
              position: 'absolute',
              left: Math.max(14, rect.left - 8),
              right: 14,
              top: above ? Math.max(70, rect.top - 220) : rect.bottom + 14,
              background: '#050505',
              border: '1px solid rgba(180,255,57,.3)',
              borderRadius: 16, padding: 20,
              boxShadow: '0 24px 60px rgba(0,0,0,.95)',
              zIndex: 1,
            }}>
              {/* Arrow */}
              <div style={{
                position: 'absolute',
                [above ? 'top' : 'bottom']: '100%',
                left: '50%', transform: 'translateX(-50%)',
                width: 0, height: 0,
                borderLeft: '9px solid transparent',
                borderRight: '9px solid transparent',
                [above ? 'borderBottom' : 'borderTop']: '9px solid rgba(180,255,57,.3)',
              }} />

              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.14em', fontWeight: 700, marginBottom: 8 }}>
                Passo {step + 1} di {STEPS.length}
              </div>
              <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 800, marginBottom: 6 }}>
                {s.title}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.65, marginBottom: 16 }}>
                {s.desc}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={nextStep} style={{
                  flex: 1, background: 'var(--lime)', color: '#000', border: 'none',
                  padding: '12px', borderRadius: 10, fontFamily: 'Manrope, sans-serif',
                  fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.04em', cursor: 'pointer',
                }}>
                  {step === STEPS.length - 1 ? '✓ Fine' : 'Avanti →'}
                </button>
                <button onClick={skipTour} style={{
                  background: 'transparent', border: 'none', color: 'rgba(255,255,255,.25)',
                  fontSize: 12, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', padding: '8px',
                }}>Salta</button>
                <div style={{ display: 'flex', gap: 5, marginLeft: 'auto' }}>
                  {STEPS.map((_, i) => (
                    <div key={i} style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: i <= step ? 'var(--lime)' : 'rgba(255,255,255,.15)',
                      boxShadow: i <= step ? '0 0 6px rgba(180,255,57,.5)' : 'none',
                      transition: 'all .2s',
                    }} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}

// Utility per resettare il tour (da Personale)
export function resetTour() {
  localStorage.removeItem(TOUR_KEY)
}
