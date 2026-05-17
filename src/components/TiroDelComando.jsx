import { useState, useEffect, useRef } from 'react'

const STORAGE_KEY = 'voltra_tiro'
const COUNT_KEY = 'voltra_tiri_count'
const ENEMIES_KEY = 'voltra_enemies_count'

const FRASI = [
  { t: "La pazienza è una forma di violenza controllata.", a: "Manuale del Comando" },
  { t: "Chi vede prima, spara dopo. Chi vede dopo, non spara più.", a: "Manuale del Comando" },
  { t: "Silentio agimus.", a: "Motto generale" },
  { t: "Constantia ante omnia.", a: "Caporale" },
  { t: "Clarius, deinde firmius.", a: "Sergente" },
  { t: "Videre, deinde agere.", a: "Capitano" },
  { t: "Exemplo, non verbis.", a: "Colonnello" },
  { t: "Si vince non quando si conquista, ma quando si resiste.", a: "Manuale del Comando" },
  { t: "Il primo errore è ammettere il primo errore.", a: "Manuale del Comando" },
  { t: "Le mappe inutili sono quelle dei territori che già conosci.", a: "Manuale del Comando" },
  { t: "Un ordine ripetuto è un ordine non dato.", a: "Manuale del Comando" },
  { t: "La trincea si scava prima che arrivi il fuoco.", a: "Manuale del Comando" },
  { t: "Chi non sa attendere, non sa neppure colpire.", a: "Manuale del Comando" },
  { t: "Il fronte non si difende, si tiene.", a: "Manuale del Comando" },
  { t: "Il silenzio del Comando vale più del comando stesso.", a: "Manuale del Comando" },
  { t: "Si misura il soldato dalla sua disciplina, non dalla sua audacia.", a: "Manuale del Comando" },
  { t: "Nessuna vittoria è definitiva. Nessuna sconfitta è completa.", a: "Manuale del Comando" },
  { t: "Si onora il caduto continuando il suo compito.", a: "Manuale del Comando" },
  { t: "La fretta è l'errore del comandante mediocre.", a: "Manuale del Comando" },
  { t: "Quando il dubbio prevale, si torna agli ordini.", a: "Manuale del Comando" },
]

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

const STATES = { IDLE: 'idle', CHARGING: 'charging', VICTORY: 'victory', DONE: 'done' }

export default function TiroDelComando() {
  const [state, setState] = useState(STATES.IDLE)
  const [charge, setCharge] = useState(0)
  const [result, setResult] = useState(null)
  const [showVictoryText, setShowVictoryText] = useState(false)
  const decayRef = useRef(null)

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      if (data.date === todayKey() && data.frase) {
        setResult(data.frase)
        setState(STATES.DONE)
      }
    } catch {}
  }, [])

  // Decay automatico: -1% al sec se non spari
  useEffect(() => {
    if (state !== STATES.CHARGING) return
    decayRef.current = setInterval(() => {
      setCharge(c => Math.max(0, c - 1.5))
    }, 100)
    return () => clearInterval(decayRef.current)
  }, [state])

  // Spazio per sparare su desktop
  useEffect(() => {
    if (state !== STATES.CHARGING) return
    const onKey = (e) => {
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault()
        shoot()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state])

  const startCharge = () => {
    if (state === STATES.DONE) return
    setState(STATES.CHARGING)
    setCharge(0)
  }

  const shoot = () => {
    setCharge(prev => {
      const next = Math.min(100, prev + 7)
      if (next >= 100) {
        // Victory
        clearInterval(decayRef.current)
        setState(STATES.VICTORY)
        setShowVictoryText(true)

        // Save: extract frase + increment counters
        const frase = FRASI[Math.floor(Math.random() * FRASI.length)]
        setResult(frase)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: todayKey(), frase }))
          const c = parseInt(localStorage.getItem(COUNT_KEY) || '0', 10) + 1
          localStorage.setItem(COUNT_KEY, String(c))
          const e = parseInt(localStorage.getItem(ENEMIES_KEY) || '0', 10) + 1
          localStorage.setItem(ENEMIES_KEY, String(e))
        } catch {}

        setTimeout(() => setState(STATES.DONE), 2000)
      }
      return next
    })
  }

  const onTargetClick = () => {
    if (state === STATES.IDLE) startCharge()
    else if (state === STATES.CHARGING) shoot()
  }

  return (
    <div className="card" style={{
      padding: 24,
      background: 'linear-gradient(135deg, rgba(180,255,57,0.04), rgba(0,0,0,0.4))',
      border: '1px solid rgba(180,255,57,0.2)',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ fontSize: 10, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 4 }}>Tiro del Comando</div>
      <div className="display" style={{ fontSize: 20, marginBottom: 4 }}>Estrazione giornaliera</div>
      <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 14 }}>
        {state === STATES.IDLE && 'Premi il bersaglio per iniziare'}
        {state === STATES.CHARGING && 'Premi SPAZIO o tocca rapidamente!'}
        {state === STATES.VICTORY && '🎯 Bersaglio colpito'}
        {state === STATES.DONE && 'Tiro effettuato. Prossimo: domani'}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        {/* Bersaglio */}
        <div
          onClick={onTargetClick}
          style={{
            width: 120, height: 120,
            position: 'relative',
            cursor: state === STATES.DONE ? 'default' : 'crosshair',
            opacity: state === STATES.DONE ? 0.4 : 1,
            transition: 'filter 0.2s, transform 0.1s',
            filter: state === STATES.DONE ? 'none' : 'drop-shadow(0 0 16px rgba(180,255,57,0.3))',
            transform: state === STATES.VICTORY ? 'scale(1.1)' : 'scale(1)',
            userSelect: 'none',
          }}
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="#B4FF39" strokeWidth="1.5" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="33" />
            <circle cx="50" cy="50" r="21" />
            <circle cx="50" cy="50" r="9" />
            <circle cx="50" cy="50" r="2" fill={state === STATES.VICTORY ? '#fff' : '#B4FF39'} />
          </svg>
          {state === STATES.VICTORY && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 40, animation: 'fadeIn 0.3s ease',
            }}>💥</div>
          )}
        </div>

        {/* Barra di carica verticale */}
        {(state === STATES.CHARGING || state === STATES.VICTORY) && (
          <div style={{
            width: 16, height: 120,
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            position: 'relative',
            overflow: 'hidden',
            animation: 'fadeIn 0.2s ease',
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              height: `${charge}%`,
              background: charge >= 100
                ? 'linear-gradient(to top, #B4FF39, #80E020)'
                : charge >= 70
                  ? 'linear-gradient(to top, #ffa502, #B4FF39)'
                  : 'linear-gradient(to top, #ff4757, #ffa502)',
              transition: 'height 0.08s linear, background 0.2s',
              boxShadow: charge >= 100 ? '0 0 16px var(--lime)' : 'none',
            }} />
            {/* Tacche orizzontali */}
            {[25, 50, 75].map(y => (
              <div key={y} style={{
                position: 'absolute',
                left: 0, right: 0,
                bottom: `${y}%`,
                height: 1,
                background: 'rgba(255,255,255,0.15)',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Victory text */}
      {showVictoryText && (
        <div style={{
          marginTop: 14,
          color: 'var(--lime)',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '0.04em',
          animation: 'fadeIn 0.5s ease',
        }}>
          Bravo soldato. Nemico abbattuto.
        </div>
      )}

      {result && state === STATES.DONE && (
        <div style={{
          marginTop: 14,
          padding: '14px 18px',
          background: '#000',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontStyle: 'italic',
          fontSize: 14,
          lineHeight: 1.6,
          animation: 'fadeIn 0.4s ease',
          textAlign: 'left',
        }}>
          « {result.t} »
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 8, fontStyle: 'normal', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            — {result.a}
          </div>
        </div>
      )}
    </div>
  )
}
