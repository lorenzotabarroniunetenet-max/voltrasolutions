import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { GRADE_LORE } from '../lib/lore.js'

export default function AlboOnore() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.alboOnore().then(d => { setData(d); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 20 }}>Caricamento Albo...</div>
  if (!data) return <div style={{ color: 'var(--red)', padding: 20 }}>Errore caricamento</div>

  const { totalActive, byRank, roster } = data
  const grades = ['Colonnello', 'Capitano', 'Sergente', 'Caporale']

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Albo d'Onore</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Organico Voltra · Roster anonimizzato</div>

      {/* Stato organico */}
      <div className="card" style={{ padding: 24, marginBottom: 20, background: 'linear-gradient(135deg, rgba(180,255,57,0.04) 0%, var(--surface) 100%)', border: '1px solid rgba(180,255,57,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
          <span className="display" style={{ fontSize: 48, fontWeight: 700, color: 'var(--lime)', lineHeight: 1 }}>{totalActive}</span>
          <span style={{ fontSize: 14, color: 'var(--muted)' }}>membri in servizio</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Organico totale attivo</div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {grades.map(g => {
            const lore = GRADE_LORE[g]
            const count = byRank[g] || 0
            return (
              <div key={g} style={{ padding: 14, background: 'var(--surface-2)', border: `1px solid ${lore?.color || 'var(--border)'}30`, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 18 }}>{lore?.rank}</span>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{g}</span>
                </div>
                <div className="display" style={{ fontSize: 24, fontWeight: 700, color: lore?.color || 'var(--text)', lineHeight: 1 }}>{count}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>{count === 1 ? 'in servizio' : 'in servizio'}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Roster anonimizzato */}
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
          <h3 className="display" style={{ fontSize: 18, fontWeight: 600 }}>Roster pubblico</h3>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{roster.length} visibili</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 16 }}>
          Identità protette. Sono mostrate solo matricole, grado e anzianità dei membri che hanno scelto la visibilità nel Personale.
        </p>

        {roster.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'var(--muted-2)', fontStyle: 'italic', fontSize: 13 }}>
            Nessun membro ha attivato la visibilità nel roster pubblico.
          </div>
        ) : (
          <div style={{ overflow: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
            <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
              <thead style={{ background: 'var(--surface-2)' }}>
                <tr>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Matricola</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Grado</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Anzianità</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Onorif.</th>
                </tr>
              </thead>
              <tbody>
                {roster.map((m, i) => {
                  const lore = GRADE_LORE[m.rank]
                  return (
                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>{m.matricola}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{ marginRight: 6 }}>{lore?.rank}</span>
                        <span style={{ color: lore?.color || 'var(--text)', fontWeight: 600 }}>{m.rank}</span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--muted)', fontSize: 12 }}>{m.daysOfService} gg</td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', color: 'var(--lime)', fontWeight: 600 }}>{m.decorationsCount}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-2)', marginTop: 20, fontStyle: 'italic' }}>
        Silentio agimus.
      </div>
    </div>
  )
}
