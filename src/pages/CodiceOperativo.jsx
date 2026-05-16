import { useState, useMemo } from 'react'
import { GLOSSARY } from '../lib/glossary.js'

export default function CodiceOperativo() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    if (!q.trim()) return GLOSSARY
    const needle = q.toLowerCase()
    return GLOSSARY.filter(item =>
      item.term.toLowerCase().includes(needle) ||
      (item.def && item.def.toLowerCase().includes(needle))
    )
  }, [q])

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Codice Operativo</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Glossario ufficiale Voltra · {GLOSSARY.length} voci</div>

      <input
        className="voltra-input"
        placeholder="Cerca termine..."
        value={q}
        onChange={e => setQ(e.target.value)}
        style={{ marginBottom: 24 }}
      />

      <div className="card" style={{ padding: 0 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            Nessuna voce trovata per "{q}".
          </div>
        ) : (
          filtered.map((item, i) => (
            <div key={item.term} style={{
              padding: '16px 18px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap' }}>
                <span className="display" style={{ fontSize: 15, fontWeight: 700, color: 'var(--lime)', letterSpacing: '0.02em', textTransform: 'uppercase' }}>{item.term}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, margin: '6px 0 0' }}>
                {item.def || (item.vedi && <span>Vedi: <em style={{ color: 'var(--lime)' }}>{item.vedi}</em></span>)}
              </p>
            </div>
          ))
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-2)', marginTop: 24, fontStyle: 'italic' }}>
        Silentio agimus.
      </div>
    </div>
  )
}
