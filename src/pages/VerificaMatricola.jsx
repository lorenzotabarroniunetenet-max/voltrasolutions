import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'

const BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'

export default function VerificaMatricola() {
  const { matricola } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}/api/certificato/verifica/${matricola}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => setData({ found: false }))
      .finally(() => setLoading(false))
  }, [matricola])

  const s = {
    page: { background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Manrope, sans-serif', color: '#fff' },
    logo: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 },
    bolt: { fontSize: 20, color: '#B4FF39', filter: 'drop-shadow(0 0 8px rgba(180,255,57,.5))' },
    name: { fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 800, color: '#B4FF39', letterSpacing: '.04em' },
    card: { background: '#050505', border: '1px solid rgba(255,255,255,.08)', borderRadius: 20, padding: '32px 28px', maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden' },
    cardSuccess: { background: '#050505', border: '1px solid rgba(180,255,57,.2)', borderRadius: 20, padding: '32px 28px', maxWidth: 480, width: '100%', position: 'relative', overflow: 'hidden' },
    mono: { fontFamily: 'JetBrains Mono, monospace' },
    lime: { color: '#B4FF39' },
    muted: { color: 'rgba(255,255,255,.35)', fontSize: 12 },
  }

  return (
    <div style={s.page}>
      {/* scan lines */}
      <div style={{ position: 'fixed', inset: 0, background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 480 }}>
        <div style={s.logo}>
          <span style={s.bolt}>⚡</span>
          <span style={s.name}>VOLTRA</span>
        </div>

        <div style={{ ...s.mono, fontSize: 9, color: 'rgba(255,255,255,.2)', letterSpacing: '.2em', textTransform: 'uppercase', marginBottom: 20 }}>
          Verifica Membro
        </div>

        {loading ? (
          <div style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ ...s.mono, fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: '.14em', textTransform: 'uppercase' }}>
              Verifica in corso<span style={{ animation: 'dots 1.5s ease-in-out infinite' }}>...</span>
            </div>
          </div>
        ) : data?.found ? (
          <div style={s.cardSuccess}>
            {/* top glow */}
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(180,255,57,.7),transparent)' }} />

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(180,255,57,.1)', border: '2px solid rgba(180,255,57,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>✅</div>
              <div>
                <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 18, fontWeight: 800, color: '#B4FF39', marginBottom: 2 }}>Membro verificato</div>
                <div style={s.muted}>La matricola esiste nel Comando Voltra</div>
              </div>
            </div>

            {/* Grid dati */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
              {[
                { label: 'Matricola', value: data.matricola, lime: true },
                { label: 'Membro N°', value: data.memberNumber ? `#${String(data.memberNumber).padStart(3, '0')}` : 'N/A', lime: true },
                { label: 'Grado', value: data.rank },
                { label: 'Arruolato il', value: data.enrolledAt ? new Date(data.enrolledAt).toLocaleDateString('it-IT') : 'N/A' },
              ].map(cell => (
                <div key={cell.label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)', borderRadius: 9, padding: '10px 12px' }}>
                  <div style={{ ...s.mono, fontSize: 8, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 4 }}>{cell.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: cell.lime ? '#B4FF39' : '#fff' }}>{cell.value}</div>
                </div>
              ))}
            </div>

            {/* Blockchain */}
            {data.membershipTxHash && (
              <div style={{ background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 9, padding: '12px 14px', marginBottom: 16 }}>
                <div style={{ ...s.mono, fontSize: 8, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 10 }}>Blockchain</div>
                {[
                  { k: 'Rete', v: 'Polygon PoS Mainnet', color: '#8247e5' },
                  { k: 'Token ID', v: `#${data.membershipTokenId}`, color: '#B4FF39' },
                  { k: 'Contratto', v: `${(process.env.MEMBERSHIP_ADDRESS || data.contractUrl || '').slice(0, 10)}...` },
                ].map(row => (
                  <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                    <span style={{ ...s.mono, fontSize: 9, color: 'rgba(255,255,255,.25)' }}>{row.k}</span>
                    <span style={{ ...s.mono, fontSize: 9, fontWeight: 700, color: row.color || 'rgba(255,255,255,.6)' }}>{row.v}</span>
                  </div>
                ))}
                <a href={data.polygonscanUrl} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, padding: '8px 0 0', borderTop: '1px solid rgba(255,255,255,.05)', textDecoration: 'none' }}>
                  <span style={{ ...s.mono, fontSize: 9, color: 'rgba(255,255,255,.25)' }}>Verifica su Polygonscan</span>
                  <span style={{ ...s.mono, fontSize: 9, color: '#B4FF39', fontWeight: 700 }}>Apri ↗</span>
                </a>
                {data.contractUrl && (
                  <a href={data.contractUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, textDecoration: 'none' }}>
                    <span style={{ ...s.mono, fontSize: 9, color: 'rgba(255,255,255,.25)' }}>Contratto pubblico</span>
                    <span style={{ ...s.mono, fontSize: 9, color: '#B4FF39', fontWeight: 700 }}>Leggi sorgente ↗</span>
                  </a>
                )}
              </div>
            )}

            <div style={{ ...s.muted, textAlign: 'center', fontSize: 11 }}>
              Certificazione permanente · Non alterabile
            </div>
          </div>
        ) : (
          <div style={{ ...s.card, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 14 }}>❌</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 17, fontWeight: 700, color: '#ff4757', marginBottom: 8 }}>Matricola non trovata</div>
            <div style={{ ...s.muted }}>Nessun membro con questa matricola nel Comando Voltra.</div>
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <Link to="/" style={{ ...s.mono, fontSize: 10, color: 'rgba(255,255,255,.2)', textDecoration: 'none', letterSpacing: '.1em', textTransform: 'uppercase' }}>
            ← voltrasolutions.com
          </Link>
        </div>
      </div>
    </div>
  )
}
