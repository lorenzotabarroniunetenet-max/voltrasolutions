import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// Posizioni fisse di "operazioni" — pure estetica
const OPERATIONS = [
  { x: 22, y: 32, label: 'EUR-1', region: 'Europa Occidentale' },
  { x: 27, y: 28, label: 'EUR-2', region: 'Europa Centrale' },
  { x: 32, y: 36, label: 'MED-1', region: 'Mediterraneo' },
  { x: 18, y: 42, label: 'IB-1', region: 'Penisola Iberica' },
  { x: 48, y: 30, label: 'EAS-1', region: 'Eurasia' },
  { x: 65, y: 38, label: 'ASI-1', region: 'Asia Centrale' },
  { x: 78, y: 35, label: 'ASI-2', region: 'Asia Orientale' },
  { x: 82, y: 50, label: 'PAC-1', region: 'Pacifico' },
  { x: 15, y: 50, label: 'AFR-1', region: 'Nord Africa' },
  { x: 20, y: 65, label: 'AFR-2', region: 'Africa Sub-Sahariana' },
  { x: 88, y: 70, label: 'OCE-1', region: 'Oceania' },
  { x: 25, y: 75, label: 'AMS-1', region: 'Sud America' },
  { x: 22, y: 25, label: 'AMS-2', region: 'Nord America' },
]

export default function MappaOperazioni() {
  const [albo, setAlbo] = useState(null)
  const [activeOp, setActiveOp] = useState(null)

  useEffect(() => {
    api.alboOnore().then(setAlbo).catch(() => {})
  }, [])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Mappa Operazioni</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Distribuzione operativa dell'organico</div>

      <div className="card" style={{ padding: 0, overflow: 'hidden', background: '#0a0a0a' }}>
        {/* Header informativo */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Settori operativi attivi</div>
            <div className="display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--lime)' }}>{OPERATIONS.length}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>Organico totale</div>
            <div className="display" style={{ fontSize: 24, fontWeight: 700 }}>{albo?.totalActive ?? '—'}</div>
          </div>
        </div>

        {/* Mappa */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '2/1', background: 'radial-gradient(ellipse at center, #0a1f0a 0%, #000 70%)' }}>
          {/* Grid */}
          <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, opacity: 0.15 }}>
            {Array.from({ length: 20 }, (_, i) => (
              <line key={`v${i}`} x1={i * 5} y1="0" x2={i * 5} y2="50" stroke="#B4FF39" strokeWidth="0.05" />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 5} x2="100" y2={i * 5} stroke="#B4FF39" strokeWidth="0.05" />
            ))}
          </svg>

          {/* Continenti stilizzati */}
          <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
            <path d="M 10,15 Q 20,8 30,12 L 40,15 Q 35,25 25,30 L 15,28 Z" fill="rgba(180,255,57,0.05)" stroke="rgba(180,255,57,0.2)" strokeWidth="0.15" />
            <path d="M 12,40 L 25,35 Q 32,42 28,48 L 18,46 Z" fill="rgba(180,255,57,0.05)" stroke="rgba(180,255,57,0.2)" strokeWidth="0.15" />
            <path d="M 45,18 Q 65,12 80,20 L 85,32 Q 75,38 60,35 L 50,30 Z" fill="rgba(180,255,57,0.05)" stroke="rgba(180,255,57,0.2)" strokeWidth="0.15" />
            <path d="M 80,42 Q 90,38 92,46 L 88,48 Z" fill="rgba(180,255,57,0.05)" stroke="rgba(180,255,57,0.2)" strokeWidth="0.15" />
            <path d="M 18,42 Q 28,40 30,48 L 22,48 Z" fill="rgba(180,255,57,0.05)" stroke="rgba(180,255,57,0.2)" strokeWidth="0.15" />
          </svg>

          {/* Punti operativi */}
          {OPERATIONS.map((op, i) => (
            <div
              key={i}
              onMouseEnter={() => setActiveOp(op)}
              onMouseLeave={() => setActiveOp(null)}
              style={{
                position: 'absolute',
                left: `${op.x}%`,
                top: `${op.y}%`,
                width: 12,
                height: 12,
                marginLeft: -6,
                marginTop: -6,
                cursor: 'pointer',
              }}
            >
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'var(--lime)',
                borderRadius: '50%',
                boxShadow: '0 0 12px rgba(180,255,57,0.8), 0 0 4px rgba(180,255,57,1)',
                animation: `pulse-${i} 2s ease-in-out infinite`,
              }} />
              <div style={{
                position: 'absolute',
                inset: -8,
                border: '1px solid rgba(180,255,57,0.3)',
                borderRadius: '50%',
                animation: `expand-${i} 3s ease-in-out infinite`,
              }} />
            </div>
          ))}

          {/* Coordinate display */}
          <div style={{ position: 'absolute', bottom: 8, right: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(180,255,57,0.4)' }}>
            42°N / 12°E · CLASSIFIED
          </div>
          <div style={{ position: 'absolute', top: 8, left: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(180,255,57,0.4)' }}>
            VOLTRA OPS · LIVE
          </div>
        </div>

        {/* Info active op */}
        {activeOp && (
          <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)', background: 'rgba(180,255,57,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--lime)', fontWeight: 700, fontSize: 13 }}>{activeOp.label}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>· {activeOp.region}</div>
            </div>
          </div>
        )}

        <div style={{ padding: 16, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted-2)', textAlign: 'center', fontStyle: 'italic' }}>
          Le posizioni operative sono indicate per settore. Identità dei membri protetta.
        </div>
      </div>

      <style>{`
        ${OPERATIONS.map((_, i) => `
          @keyframes pulse-${i} { 0%, 100% { opacity: 1; transform: scale(1) } 50% { opacity: 0.6; transform: scale(${1 + (i % 3) * 0.1}) } }
          @keyframes expand-${i} { 0% { opacity: 0.8; transform: scale(1) } 100% { opacity: 0; transform: scale(2.5) } }
        `).join('')}
      `}</style>
    </div>
  )
}
