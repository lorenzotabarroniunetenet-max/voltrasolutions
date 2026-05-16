import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { GRADE_LORE } from '../lib/lore.js'

const RANKS = ['Caporale', 'Sergente', 'Capitano', 'Colonnello']

export default function CodiceCondotta() {
  const [dossier, setDossier] = useState(null)
  const [activeRank, setActiveRank] = useState('Caporale')

  useEffect(() => {
    api.dossier().then(d => {
      setDossier(d)
      setActiveRank(d.rank || 'Caporale')
    }).catch(() => {})
  }, [])

  const lore = GRADE_LORE[activeRank] || GRADE_LORE.Caporale
  const accentColor = lore?.color || 'var(--lime)'
  const isOwnRank = dossier?.rank === activeRank

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Codice di Condotta</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Consegne formali per grado</div>

      {/* Tabs gradi */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
        {RANKS.map(r => {
          const rLore = GRADE_LORE[r]
          const active = activeRank === r
          return (
            <button key={r} onClick={() => setActiveRank(r)} style={{
              background: 'transparent',
              border: 'none',
              color: active ? rLore?.color : 'var(--muted)',
              padding: '12px 18px',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              borderBottom: active ? `2px solid ${rLore?.color}` : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}>
              <span>{rLore?.rank}</span>
              {r}
              {dossier?.rank === r && <span style={{ fontSize: 9, background: rLore?.color, color: '#000', padding: '2px 6px', borderRadius: 10, fontWeight: 700, marginLeft: 4 }}>TUO</span>}
            </button>
          )
        })}
      </div>

      {/* Header grado */}
      <div className="card" style={{
        padding: 24,
        marginBottom: 16,
        background: `linear-gradient(135deg, ${accentColor}10 0%, var(--surface) 100%)`,
        border: `1px solid ${accentColor}33`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>{lore.rank}</div>
        <div className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '0.02em', color: '#fff', lineHeight: 1 }}>
          {activeRank}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 6 }}>
          {lore.mission}
        </div>

        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--border)', fontStyle: 'italic', color: accentColor, fontSize: 16 }}>
          « {lore.motto} »
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, fontStyle: 'normal' }}>{lore.mottoTranslation}</div>
        </div>
      </div>

      {/* Codice */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 18, textAlign: 'center' }}>
          Codice di Condotta — {activeRank}
        </div>

        {lore.codice.map((punto, i) => (
          <div key={i} style={{
            padding: '14px 18px',
            borderLeft: `2px solid ${accentColor}`,
            marginBottom: 10,
            background: 'rgba(255,255,255,0.02)',
            borderRadius: '0 6px 6px 0',
          }}>
            <span style={{ color: accentColor, fontWeight: 700, marginRight: 10, fontFamily: 'JetBrains Mono, monospace' }}>{i + 1}.</span>
            <span style={{ fontSize: 14, color: '#fff', lineHeight: 1.7 }}>{punto}</span>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted-2)', textAlign: 'center', marginTop: 20, lineHeight: 1.6, fontStyle: 'italic' }}>
        Il Codice si presta una volta — alla Cerimonia di Imposizione.<br />
        Resta valido per l'intera permanenza in servizio.
      </p>
    </div>
  )
}
