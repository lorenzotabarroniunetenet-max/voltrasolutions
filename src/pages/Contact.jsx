import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'

function TelegramIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

const FAQ = [
  {
    q: 'Come funziona la Promozione di Grado?',
    a: 'Ogni grado prevede una quota di accesso. Selezionato il grado, ricevi le istruzioni di pagamento riservate. Effettuato il versamento, segnali la conferma al Comando tramite il canale dedicato. L\'attivazione avviene entro 24 ore dalla verifica.'
  },
  {
    q: 'Come ricevo le istruzioni di pagamento?',
    a: 'Le modalità operative sono riservate ai membri approvati. Dopo aver selezionato il grado dal Quartier Generale, vengono mostrati gli estremi necessari. Per dubbi, contattare il Comando tramite la Linea Diretta.'
  },
  {
    q: 'Quanto tempo serve per l\'attivazione del grado?',
    a: 'Il Comando verifica e attiva il grado entro 24 ore dalla conferma del pagamento. In caso di ritardo, contattare il canale Telegram supporto per accelerare la pratica.'
  },
  {
    q: 'Le operazioni concluse fanno scattare automaticamente le onorificenze?',
    a: 'No. Il raggiungimento di una soglia rende il requisito "soddisfatto" ma il conferimento dell\'onorificenza resta a discrezione del Comando, valutato sul merito complessivo del membro.'
  },
  {
    q: 'Posso essere promosso di grado senza versamento?',
    a: 'Le promozioni di grado sono decise unilateralmente dal Comando in base a valutazioni interne. Il versamento riguarda esclusivamente l\'accesso iniziale a un grado disponibile, non gli avanzamenti successivi.'
  },
  {
    q: 'Cos\'è il Fascicolo Personale?',
    a: 'È il documento ufficiale che riepiloga la tua identità nel club: matricola, grado, anzianità di servizio, onorificenze ricevute e Ruolino delle attività. Lo trovi nel menu principale.'
  },
  {
    q: 'Come elimino il mio account?',
    a: 'Dalla sezione Personale → Smobilitazione, oppure scrivendo al Comando tramite ticket di supporto. La cancellazione è definitiva e rimuove profilo, onorificenze, fascicolo e log di servizio.'
  },
  {
    q: 'Quanto tempo serve per ricevere risposta a un ticket?',
    a: 'Il Comando risponde entro 24 ore dall\'invio del ticket. Per urgenze, contattare direttamente il canale Telegram supporto.'
  },
]

const CATEGORIES = [
  { value: 'pagamento', label: 'Pagamento', emoji: '💰' },
  { value: 'tecnico', label: 'Tecnico', emoji: '🔧' },
  { value: 'onorificenze', label: 'Onorificenze', emoji: '🎖' },
  { value: 'grado', label: 'Grado', emoji: '⭐' },
  { value: 'altro', label: 'Altro', emoji: '◈' },
]

export default function Contact() {
  const { user } = useAuth()
  const [info, setInfo] = useState({ supportEmail: '', telegramUrl: '', telegramHandle: '' })
  const [openFAQ, setOpenFAQ] = useState(null)
  const [ticket, setTicket] = useState({ category: 'tecnico', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => { api.contactInfo().then(setInfo).catch(() => {}) }, [])

  const submitTicket = async (e) => {
    e.preventDefault()
    setErr(''); setMsg(''); setSubmitting(true)
    try {
      const r = await api.supportTicket(ticket)
      setMsg(r.message)
      setTicket({ category: 'tecnico', subject: '', message: '' })
    } catch (e) { setErr(e.message) } finally { setSubmitting(false) }
  }

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Linea Diretta HQ</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 28 }}>Canale di comunicazione diretta con il Comando.</div>

      {/* Telegram quick access */}
      {info.telegramUrl && (
        <a href={info.telegramUrl} target="_blank" rel="noopener noreferrer" className="card card-glow" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 20, textDecoration: 'none', color: 'inherit', marginBottom: 24, border: '1px solid rgba(180,255,57,0.25)' }}>
          <TelegramIcon size={36} color="#229ED9" />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <strong style={{ fontSize: 16 }}>Canale Telegram supporto</strong>
              <span className="badge badge-lime">Più veloce</span>
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>{info.telegramHandle || 'Apri chat'} — risposta in pochi minuti</div>
          </div>
          <span style={{ color: 'var(--lime)' }}>→</span>
        </a>
      )}

      {/* FAQ */}
      <div style={{ marginBottom: 32 }}>
        <h2 className="display" style={{ fontSize: 18, marginBottom: 12, color: 'var(--text)' }}>Domande Ricorrenti</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ.map((item, i) => (
            <div key={i} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  textAlign: 'left',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 12,
                  fontFamily: 'inherit',
                }}
              >
                <span>{item.q}</span>
                <span style={{ color: 'var(--lime)', fontSize: 18, transition: 'transform 0.2s', transform: openFAQ === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {openFAQ === i && (
                <div style={{ padding: '0 18px 16px', fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Support ticket form (solo loggati) */}
      {user ? (
        <div className="card" style={{ padding: 24 }}>
          <h2 className="display" style={{ fontSize: 18, marginBottom: 4, color: 'var(--text)' }}>Apri Ticket Supporto</h2>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
            Per richieste strutturate. Il ticket viene tracciato e ricevi risposta entro 24 ore.
          </div>

          {msg ? (
            <div style={{ padding: 16, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10, color: 'var(--lime)', fontSize: 14 }}>
              {msg}
              <div style={{ marginTop: 10 }}>
                <button onClick={() => setMsg('')} className="btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }}>Apri un altro ticket</button>
              </div>
            </div>
          ) : (
            <form onSubmit={submitTicket}>
              <label className="label">Categoria</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8, marginBottom: 16 }}>
                {CATEGORIES.map(c => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => setTicket({ ...ticket, category: c.value })}
                    style={{
                      padding: 12,
                      background: ticket.category === c.value ? 'rgba(180,255,57,0.08)' : 'var(--surface-2)',
                      border: ticket.category === c.value ? '1px solid rgba(180,255,57,0.4)' : '1px solid var(--border)',
                      borderRadius: 10,
                      color: ticket.category === c.value ? 'var(--lime)' : 'var(--text)',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      fontFamily: 'inherit',
                    }}
                  >
                    <div style={{ fontSize: 18, marginBottom: 4 }}>{c.emoji}</div>
                    {c.label}
                  </button>
                ))}
              </div>

              <label className="label">Oggetto</label>
              <input className="voltra-input" value={ticket.subject} onChange={e => setTicket({ ...ticket, subject: e.target.value })} required minLength={3} maxLength={120} placeholder="Sintesi del problema" style={{ marginBottom: 16 }} />

              <label className="label">Messaggio</label>
              <textarea className="voltra-input" value={ticket.message} onChange={e => setTicket({ ...ticket, message: e.target.value })} required minLength={10} maxLength={2000} placeholder="Descrivi nel dettaglio. Indica TxHash, screenshot, contesto." rows={6} style={{ marginBottom: 16, resize: 'vertical', fontFamily: 'inherit' }} />

              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
                Inviato come: <strong>{user.name}</strong> ({user.email})
              </div>

              {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}

              <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%' }}>
                {submitting ? 'Trasmissione...' : 'Trasmetti ticket al Comando'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <div className="card" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>
          Per aprire un ticket strutturato, effettua l'accesso al Quartier Generale.
        </div>
      )}

      {info.supportEmail && (
        <div style={{ marginTop: 24, padding: 16, fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          Email diretta: <a href={`mailto:${info.supportEmail}`} style={{ color: 'var(--lime)', textDecoration: 'none' }}>{info.supportEmail}</a>
        </div>
      )}
    </div>
  )
}
