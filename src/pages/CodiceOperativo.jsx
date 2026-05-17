import { useState, useMemo } from 'react'
import { GLOSSARY } from '../lib/glossary.js'

const GUIDES = [
  {
    id: 'primo-pagamento',
    title: 'Procedura di accesso al grado',
    desc: 'Dalla selezione del grado all\'attivazione da parte del Comando.',
    icon: '🎖',
    steps: [
      {
        title: 'Apri Promozione di Grado',
        body: 'Dal menu laterale seleziona "Promozione di Grado". Visualizzerai i gradi disponibili con le rispettive missioni e quote di accesso.',
      },
      {
        title: 'Seleziona il grado',
        body: 'Premi "Richiedi Grado →" sul grado desiderato. Al momento sono attivi Caporale e Sergente. Capitano e Colonnello sono in preparazione.',
      },
      {
        title: 'Consulta le modalità operative',
        body: 'Nella schermata successiva il sistema mostra gli estremi necessari per il versamento, riservati ai membri approvati.',
      },
      {
        title: 'Effettua il versamento',
        body: 'Procedi secondo le indicazioni fornite. Verifica due volte l\'importo e gli estremi prima di confermare.',
      },
      {
        title: 'Conferma al Comando',
        body: 'Una volta completato, comunica la conferma del versamento al Comando tramite il canale Telegram dedicato. Il Comando verifica entro 24 ore.',
      },
      {
        title: 'Attivazione del grado',
        body: 'Al completamento della verifica, il grado viene attivato sul tuo profilo. Riceverai notifica e potrai accedere alla Cerimonia di Promozione.',
      },
    ],
  },
  {
    id: 'onorificenze',
    title: 'Come ottenere onorificenze',
    desc: 'Le 7 onorificenze, le soglie operative, e come avanzare nel sistema di merito.',
    icon: '🎖',
    steps: [
      {
        title: 'Comprendi il sistema',
        body: 'Ogni operazione conclusa incrementa il tuo contatore. Al raggiungimento di una soglia, il requisito diventa "soddisfatto".',
      },
      {
        title: 'Consulta i Requisiti',
        body: 'Dal menu apri "Requisiti". Vedrai le 7 onorificenze in ordine di progressione con barre di avanzamento aggiornate in tempo reale.',
      },
      {
        title: 'Le 7 soglie',
        body: 'Compiacimento (3), Elogio (6), Stella di Bronzo (15), Encomio Semplice (17), Stella di Argento (30), Encomio Solenne (40), Stella d\'Oro (60).',
      },
      {
        title: 'Soglia ≠ conferimento',
        body: 'Raggiungere il requisito non comporta assegnazione automatica. Il Comando valuta caso per caso il merito complessivo del membro prima del conferimento ufficiale.',
      },
      {
        title: 'Consulta il Fascicolo',
        body: 'Le onorificenze conferite appaiono nell\'Albo del tuo Fascicolo Personale, con data e motivo del conferimento.',
      },
    ],
  },
  {
    id: 'fascicolo',
    title: 'Leggere il Fascicolo Personale',
    desc: 'Come interpretare matricola, anzianità di servizio, motto del grado e Ruolino.',
    icon: '📋',
    steps: [
      {
        title: 'Apri Fascicolo',
        body: 'Dal menu seleziona "Fascicolo". Visualizzi la tua identità ufficiale nel club: nome, matricola, grado, motto latino, anzianità.',
      },
      {
        title: 'La matricola',
        body: 'Codice univoco assegnato dal Comando all\'arruolamento. Formato "VLT-XXXX". Resta invariata anche dopo promozioni.',
      },
      {
        title: 'Il motto del grado',
        body: 'Ogni grado ha un proprio motto latino e una traduzione. È il principio operativo del grado. Caporale: "Constantia ante omnia" — La costanza prima di ogni cosa.',
      },
      {
        title: 'Albo delle Onorificenze',
        body: 'Sezione che mostra le decorazioni ricevute con data e icona. Le decorazioni "rare" hanno bordo dorato.',
      },
      {
        title: 'Ruolino di Servizio',
        body: 'Timeline cronologica delle attività: arruolamento, promozioni, decorazioni, operazioni concluse, note del Comando.',
      },
    ],
  },
  {
    id: 'sicurezza',
    title: 'Sicurezza e privacy',
    desc: 'Come proteggere il tuo accesso, 2FA, recupero credenziale, riservatezza.',
    icon: '🔒',
    steps: [
      {
        title: 'Credenziale forte',
        body: 'Usa una password di almeno 12 caratteri con maiuscole, numeri e simboli. Non riutilizzare credenziali di altri servizi.',
      },
      {
        title: 'Verifica email',
        body: 'L\'accesso è bloccato fino alla verifica dell\'email. Se non ricevi il messaggio, controlla spam o richiedi reinvio dalla pagina di login.',
      },
      {
        title: 'Recupero credenziale',
        body: 'Dalla pagina di login, premi "Credenziale dimenticata?". Inserisci la tua email: riceverai un link valido 1 ora per impostarne una nuova.',
      },
      {
        title: 'Riservatezza del club',
        body: 'L\'appartenenza a Voltra è privata. Non condividere screenshot del Quartier Generale, della tua matricola o del Fascicolo all\'esterno del club.',
      },
      {
        title: 'Smobilitazione',
        body: 'Da Personale → Smobilitazione, oppure scrivendo al Comando tramite ticket supporto. La cancellazione è definitiva e rimuove ogni traccia.',
      },
    ],
  },
  {
    id: 'primo-giorno',
    title: 'Il tuo primo giorno',
    desc: 'Guida rapida per nuovi membri appena arruolati.',
    icon: '🚩',
    steps: [
      {
        title: 'Cerimonia di Arruolamento',
        body: 'Al primo accesso dopo l\'approvazione vedrai una cerimonia full-screen con il tuo grado, motto e codice di condotta. Da accettare per procedere.',
      },
      {
        title: 'Esplora il Quartier Generale',
        body: 'La Dashboard è il tuo centro operativo: identità, dotazione, ultimi briefing, prossime soglie. Tutto inizia da qui.',
      },
      {
        title: 'Leggi la Sala Briefing',
        body: 'Gli Ordini del Giorno (OdG) emessi dal Comando appaiono qui. Il primo OdG di benvenuto contiene istruzioni essenziali.',
      },
      {
        title: 'Studia il Codice di Condotta',
        body: 'I 5 principi del tuo grado sono nel Codice di Condotta. Si applicano sempre, dentro e fuori dal Quartier Generale.',
      },
      {
        title: 'Imposta il Telegram',
        body: 'Collega il tuo Telegram per ricevere notifiche del Comando in tempo reale. Da Personale → Notifiche.',
      },
    ],
  },
]

export default function CodiceOperativo() {
  const [tab, setTab] = useState('glossary')
  const [q, setQ] = useState('')
  const [openGuide, setOpenGuide] = useState(null)

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
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 20 }}>Glossario e guide operative ufficiali.</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--border)' }}>
        <button
          onClick={() => setTab('glossary')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            color: tab === 'glossary' ? 'var(--lime)' : 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: tab === 'glossary' ? '2px solid var(--lime)' : '2px solid transparent',
            marginBottom: -1,
            fontFamily: 'inherit',
          }}
        >Glossario ({GLOSSARY.length})</button>
        <button
          onClick={() => setTab('guides')}
          style={{
            background: 'transparent',
            border: 'none',
            padding: '12px 16px',
            color: tab === 'guides' ? 'var(--lime)' : 'var(--muted)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            borderBottom: tab === 'guides' ? '2px solid var(--lime)' : '2px solid transparent',
            marginBottom: -1,
            fontFamily: 'inherit',
          }}
        >Guide Operative ({GUIDES.length})</button>
      </div>

      {tab === 'glossary' && (
        <>
          <input
            className="voltra-input"
            placeholder="Cerca termine..."
            value={q}
            onChange={e => setQ(e.target.value)}
            style={{ marginBottom: 20 }}
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
        </>
      )}

      {tab === 'guides' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {GUIDES.map(g => (
            <div key={g.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setOpenGuide(openGuide === g.id ? null : g.id)}
                style={{
                  width: '100%',
                  padding: 18,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 24 }}>{g.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 2 }}>{g.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{g.desc} · {g.steps.length} passi</div>
                </div>
                <span style={{ color: 'var(--lime)', fontSize: 18, transition: 'transform 0.2s', transform: openGuide === g.id ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
              </button>
              {openGuide === g.id && (
                <div style={{ padding: '0 18px 20px', borderTop: '1px solid var(--border)' }}>
                  <ol style={{ paddingLeft: 0, margin: '20px 0 0', listStyle: 'none', counterReset: 'step-counter' }}>
                    {g.steps.map((step, i) => (
                      <li key={i} style={{
                        position: 'relative',
                        paddingLeft: 44,
                        paddingBottom: 20,
                        marginBottom: 0,
                        borderLeft: i < g.steps.length - 1 ? '1px solid var(--border)' : 'none',
                        marginLeft: 14,
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: -15,
                          top: 0,
                          width: 30,
                          height: 30,
                          borderRadius: '50%',
                          background: 'var(--surface-2)',
                          border: '1px solid var(--lime)',
                          color: 'var(--lime)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                        }}>{i + 1}</span>
                        <div style={{ fontWeight: 600, marginBottom: 4, fontSize: 14, color: 'var(--text)' }}>{step.title}</div>
                        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{step.body}</div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-2)', marginTop: 24, fontStyle: 'italic' }}>
        Silentio agimus.
      </div>
    </div>
  )
}
