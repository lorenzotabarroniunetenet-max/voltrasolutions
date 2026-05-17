import { useEffect, useState } from 'react'
import { hasFoundEaster } from './EasterConsole.jsx'

const STORAGE_KEY = 'voltra_distintivi'

const ALL_DISTINTIVI = [
  { id: 'vigilante', icon: '🔥', name: 'Vigilante', desc: '7 giorni consecutivi', check: (ctx) => ctx.streak >= 7 },
  { id: 'lettore', icon: '📖', name: 'Lettore Attento', desc: 'Tutti gli OdG letti', check: (ctx) => ctx.briefingsRead >= 3, secret: false },
  { id: 'decifratore', icon: '🔓', name: 'Decifratore', desc: 'Easter egg trovato', check: () => hasFoundEaster(), secret: true },
  { id: 'apripista', icon: '🚩', name: 'Apripista', desc: 'Primo del mese', check: (ctx) => ctx.isFirstOfMonth, secret: false },
  { id: 'tiratore', icon: '🎯', name: 'Tiratore', desc: 'Tiro del Comando × 7', check: (ctx) => ctx.tiriEseguiti >= 7 },
]

const HIDDEN_COUNT = 4 // distintivi futuri "???"

function loadUnlocked() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveUnlocked(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)) } catch {}
}

export function checkDistintivi(ctx = {}) {
  let unlocked = loadUnlocked()
  ALL_DISTINTIVI.forEach(d => {
    if (!unlocked.includes(d.id) && d.check(ctx)) {
      unlocked.push(d.id)
    }
  })
  saveUnlocked(unlocked)
  return unlocked
}

export default function Distintivi() {
  const [unlocked, setUnlocked] = useState([])

  useEffect(() => {
    // Carica contesto minimo da localStorage
    let streak = 0
    try {
      const s = JSON.parse(localStorage.getItem('voltra_streak') || '{}')
      streak = s.current || 0
    } catch {}
    let tiriEseguiti = 0
    try {
      tiriEseguiti = parseInt(localStorage.getItem('voltra_tiri_count') || '0', 10)
    } catch {}
    const ctx = {
      streak,
      tiriEseguiti,
      briefingsRead: 0, // placeholder, in produzione viene dal backend
      isFirstOfMonth: false,
    }
    setUnlocked(checkDistintivi(ctx))
  }, [])

  return (
    <div className="card" style={{ padding: 24, marginTop: 20 }}>
      <h3 className="display" style={{ fontSize: 16, fontWeight: 600, marginBottom: 14 }}>Distintivi Operativi</h3>
      <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>
        Riconoscimenti minori sbloccati nei flussi operativi. Non sostituiscono le Onorificenze ufficiali.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10 }}>
        {ALL_DISTINTIVI.map(d => {
          const isUnlocked = unlocked.includes(d.id)
          return (
            <div key={d.id} title={d.desc} style={{
              background: isUnlocked ? (d.secret ? 'linear-gradient(135deg, rgba(232,200,74,0.06), rgba(0,0,0,0.4))' : 'var(--surface-2)') : 'var(--surface-2)',
              border: isUnlocked ? (d.secret ? '1px solid rgba(232,200,74,0.4)' : '1px solid rgba(180,255,57,0.3)') : '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 10px',
              textAlign: 'center',
              opacity: isUnlocked ? 1 : 0.3,
              filter: isUnlocked ? 'none' : 'grayscale(1)',
              transition: 'all 0.3s',
            }}>
              <div style={{ fontSize: 26, marginBottom: 6, filter: isUnlocked ? 'none' : 'blur(2px)' }}>{d.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>{d.desc}</div>
            </div>
          )
        })}
        {Array.from({ length: HIDDEN_COUNT }).map((_, i) => (
          <div key={`hidden-${i}`} style={{
            background: 'var(--surface-2)',
            border: '1px dashed var(--border)',
            borderRadius: 10,
            padding: '14px 10px',
            textAlign: 'center',
            opacity: 0.3,
          }}>
            <div style={{ fontSize: 26, marginBottom: 6, filter: 'blur(3px)' }}>⚡</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>???</div>
            <div style={{ fontSize: 9, color: 'var(--muted)' }}>Bloccato</div>
          </div>
        ))}
      </div>
    </div>
  )
}
