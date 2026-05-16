import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { BRIEFING_TYPES, formatODG } from '../lib/lore.js'

export default function SalaBriefing() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.briefings().then(d => { setList(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 20 }}>Caricamento Sala Briefing...</div>

  if (selected) {
    const typeInfo = BRIEFING_TYPES[selected.type] || BRIEFING_TYPES.ordine_del_giorno
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <button onClick={() => setSelected(null)} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13, padding: '8px 14px' }}>← Sala Briefing</button>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: 24 }}>{typeInfo.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
                {typeInfo.label} · {formatODG(selected.number)}
              </div>
              <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 2 }}>
                {new Date(selected.publishedAt).toLocaleDateString('it-IT', { dateStyle: 'long' })}
              </div>
            </div>
            {selected.pinned && <span style={{ fontSize: 14, color: 'var(--lime)' }}>📌</span>}
          </div>

          <h1 className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 20, color: '#fff' }}>
            {selected.title}
          </h1>

          <div style={{ fontSize: 15, lineHeight: 1.8, color: '#dadada', whiteSpace: 'pre-wrap' }}>
            {selected.body}
          </div>

          <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'right', fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>
            — Il Comando
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Sala Briefing</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Ordini del Giorno · Comunicazioni del Comando</div>

      {list.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📜</div>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Nessun Ordine del Giorno pendente.<br />Restare in posizione.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {list.map(b => {
            const typeInfo = BRIEFING_TYPES[b.type] || BRIEFING_TYPES.ordine_del_giorno
            return (
              <div
                key={b.id}
                onClick={() => setSelected(b)}
                className="card"
                style={{
                  padding: 20,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  border: b.pinned ? '1px solid rgba(180,255,57,0.3)' : '1px solid var(--border)',
                  background: b.pinned ? 'rgba(180,255,57,0.03)' : 'var(--surface)',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = b.pinned ? 'rgba(180,255,57,0.3)' : 'var(--border)'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontSize: 18 }}>{typeInfo.icon}</span>
                  <div style={{ fontSize: 10, color: b.pinned ? 'var(--lime)' : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                    {typeInfo.label} · {formatODG(b.number)}
                  </div>
                  {b.pinned && <span style={{ fontSize: 11, color: 'var(--lime)' }}>📌</span>}
                  <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--muted-2)' }}>
                    {new Date(b.publishedAt).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <h3 className="display" style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: '#fff' }}>
                  {b.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {b.body}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
