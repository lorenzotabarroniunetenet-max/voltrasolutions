import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

const CATEGORIES = {
  contract: { label: 'Contratto', icon: '📜', color: 'var(--lime)' },
  certificate: { label: 'Attestato', icon: '⚜', color: '#E8C84A' },
  receipt: { label: 'Ricevuta', icon: '📄', color: 'var(--muted)' },
  other: { label: 'Altro', icon: '◈', color: 'var(--muted)' },
}

export default function Documenti() {
  const [docs, setDocs] = useState([])
  const [loading, setLoading] = useState(true)
  const [signing, setSigning] = useState(null)

  const reload = () => api.documents().then(d => { setDocs(d); setLoading(false) }).catch(() => setLoading(false))
  useEffect(() => { reload() }, [])

  const sign = async (id) => {
    if (!confirm('Confermi la firma di questo documento? Questa azione resta registrata nel Fascicolo.')) return
    setSigning(id)
    try { await api.signDocument(id); reload() } catch (e) { alert(e.message) } finally { setSigning(null) }
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: 20 }}>Caricamento documenti...</div>

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Documenti</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Archivio privato · Contratti e attestati</div>

      {docs.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 32, marginBottom: 12, opacity: 0.4 }}>📂</div>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Nessun documento archiviato.<br />I documenti privati saranno disponibili al loro deposito da parte del Comando.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {docs.map(d => {
            const cat = CATEGORIES[d.category] || CATEGORIES.other
            return (
              <div key={d.id} className="card" style={{ padding: 18, borderColor: d.signed ? 'rgba(180,255,57,0.2)' : 'var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ fontSize: 28, flexShrink: 0 }}>{cat.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: cat.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>{cat.label}</span>
                      {d.signed && <span style={{ fontSize: 10, color: 'var(--lime)', background: 'rgba(180,255,57,0.1)', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>FIRMATO</span>}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{d.title}</div>
                    {d.description && <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>{d.description}</p>}
                    <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 8 }}>
                      Depositato il {new Date(d.uploadedAt).toLocaleDateString('it-IT', { dateStyle: 'long' })}
                      {d.signed && d.signedAt && ` · Firmato il ${new Date(d.signedAt).toLocaleDateString('it-IT', { dateStyle: 'long' })}`}
                    </div>
                  </div>
                </div>

                {(d.fileUrl || !d.signed) && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    {d.fileUrl && (
                      <a href={d.fileUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ flex: 1, textAlign: 'center', fontSize: 12, padding: '8px 12px', textDecoration: 'none' }}>
                        Visualizza →
                      </a>
                    )}
                    {!d.signed && (
                      <button onClick={() => sign(d.id)} disabled={signing === d.id} className="btn-primary" style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}>
                        {signing === d.id ? 'Registrazione...' : 'Conferma firma'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
