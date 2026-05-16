import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { GRADE_LORE } from '../lib/lore.js'

export default function Ceremony({ ceremony, onComplete }) {
  const [phase, setPhase] = useState(0) // 0: blank, 1: rank, 2: motto, 3: codice, 4: button
  const [loading, setLoading] = useState(false)

  const rank = ceremony?.payload?.rank || 'Caporale'
  const matricola = ceremony?.payload?.matricola
  const lore = GRADE_LORE[rank] || GRADE_LORE.Caporale
  const isPromotion = ceremony?.type === 'promotion'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 800)
    const t2 = setTimeout(() => setPhase(2), 2200)
    const t3 = setTimeout(() => setPhase(3), 3600)
    const t4 = setTimeout(() => setPhase(4), 5000)
    return () => { [t1,t2,t3,t4].forEach(clearTimeout) }
  }, [])

  const accept = async () => {
    setLoading(true)
    try {
      await api.ceremonyAcknowledge(ceremony.id)
      onComplete()
    } catch (e) { setLoading(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: '#000',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      overflow: 'auto',
    }}>
      {/* Linea lime in alto */}
      <div style={{
        position: 'absolute', top: '40%', left: 0, right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, var(--lime), transparent)',
        opacity: phase >= 1 ? 0.6 : 0,
        transition: 'opacity 0.8s ease',
      }} />

      {/* Header tipo: Promozione/Arruolamento */}
      <div style={{
        position: 'absolute', top: '8%',
        textAlign: 'center',
        opacity: phase >= 1 ? 1 : 0,
        transition: 'opacity 0.8s ease',
      }}>
        <div style={{ fontSize: 11, color: 'var(--lime)', letterSpacing: '0.3em', fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, textTransform: 'uppercase' }}>
          — {isPromotion ? 'Imposizione del Grado' : 'Cerimonia di Arruolamento'} —
        </div>
        {matricola && (
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.2em', fontFamily: 'JetBrains Mono, monospace', marginTop: 8 }}>
            MATRICOLA {matricola}
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', maxWidth: 600, padding: '0 20px' }}>
        {/* Sigillo grado */}
        <div style={{
          fontSize: 80,
          marginBottom: 16,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.5)',
          transition: 'all 1s cubic-bezier(0.22, 1, 0.36, 1)',
          filter: phase >= 1 ? `drop-shadow(0 0 30px ${lore.color}60)` : 'none',
        }}>
          {lore.rank}
        </div>

        {/* Nome grado */}
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          fontSize: 'clamp(56px, 10vw, 96px)',
          letterSpacing: '0.04em',
          color: '#fff',
          lineHeight: 1,
          margin: 0,
          marginBottom: 8,
          opacity: phase >= 1 ? 1 : 0,
          transform: phase >= 1 ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.8s ease 0.2s',
          textShadow: phase >= 1 ? `0 0 60px ${lore.color}40` : 'none',
        }}>
          {rank}
        </h1>

        <div style={{
          fontSize: 12,
          color: 'var(--muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: 32,
          opacity: phase >= 1 ? 1 : 0,
          transition: 'opacity 1s ease 0.5s',
        }}>
          {lore.mission}
        </div>

        {/* Motto */}
        <div style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.8s ease',
          marginBottom: 40,
          padding: '20px 0',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}>
          <div style={{
            fontFamily: 'DM Sans, sans-serif',
            fontStyle: 'italic',
            fontSize: 22,
            color: lore.color,
            marginBottom: 6,
            fontWeight: 500,
          }}>
            « {lore.motto} »
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {lore.mottoTranslation}
          </div>
        </div>

        {/* Codice di Condotta */}
        <div style={{
          opacity: phase >= 3 ? 1 : 0,
          transform: phase >= 3 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.8s ease',
          marginBottom: 40,
          textAlign: 'left',
        }}>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 16, textAlign: 'center' }}>
            Codice di Condotta
          </div>
          {lore.codice.map((punto, i) => (
            <div key={i} style={{
              padding: '10px 16px',
              borderLeft: `2px solid ${lore.color}`,
              marginBottom: 8,
              fontSize: 13,
              lineHeight: 1.6,
              color: '#dadada',
              background: 'rgba(255,255,255,0.02)',
            }}>
              <span style={{ color: lore.color, fontWeight: 700, marginRight: 8 }}>{i+1}.</span>
              {punto}
            </div>
          ))}
        </div>

        {/* Bottone */}
        <button
          onClick={accept}
          disabled={phase < 4 || loading}
          style={{
            background: phase >= 4 ? 'var(--lime)' : 'transparent',
            color: '#000',
            border: phase >= 4 ? 'none' : '1px solid var(--border)',
            padding: '16px 40px',
            borderRadius: 10,
            fontFamily: 'DM Sans, sans-serif',
            fontWeight: 700,
            fontSize: 14,
            letterSpacing: '0.02em',
            cursor: phase >= 4 ? 'pointer' : 'default',
            opacity: phase >= 4 ? 1 : 0.3,
            transition: 'all 0.6s ease',
            textTransform: 'uppercase',
          }}
        >
          {loading ? 'Registrazione...' : 'Accetto e prendo atto'}
        </button>
      </div>
    </div>
  )
}
