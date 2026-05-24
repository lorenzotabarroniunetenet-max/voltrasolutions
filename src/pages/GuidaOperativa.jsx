import { useState } from 'react'
import { resetTour } from '../components/TourOverlay.jsx'
import { useNavigate } from 'react-router-dom'

const SECTIONS = [
  {
    n: '01', title: 'Come funziona Voltra',
    content: [
      { type: 'text', text: 'Voltra è un club privato a sistema di gradi. Ogni membro sceglie il suo grado, affronta la sua missione e sale di rango. L\'accesso richiede approvazione manuale dal Comando.' },
      { type: 'tip', text: 'Non sei un cliente. Sei un membro. La differenza è sostanziale.' },
    ]
  },
  {
    n: '02', title: 'Come avviare una missione',
    content: [
      { type: 'steps', items: [
        'Vai su **Promozione di Grado** nel menu laterale',
        'Scegli il **grado** che vuoi raggiungere',
        'Effettua il **versamento** all\'indirizzo indicato (USDT, BTC o ETH)',
        'Carica la **ricevuta** con TxHash e URL della transazione',
        'Il Comando **approva entro 24 ore** — riceverai notifica su Telegram e via email',
      ]},
      { type: 'tip', text: 'TxHash sbagliato o mancante = approvazione bloccata. Controlla due volte prima di inviare.' },
    ]
  },
  {
    n: '03', title: 'Come monitorare la missione',
    content: [
      { type: 'text', text: 'Il Quartier Generale mostra lo stato della tua missione in tempo reale.' },
      { type: 'badges', items: [
        { label: '⚔️ In corso', color: 'var(--lime)' },
        { label: '🏅 Compiuta', color: '#E8C84A' },
        { label: '🪖 Conclusa', color: 'var(--red)' },
        { label: '💰 Liquidata', color: '#E8C84A' },
      ]},
      { type: 'tip', text: 'Non serve aprire il sito ogni giorno. Il Comando ti avvisa su Telegram e via email a ogni cambio di stato.' },
    ]
  },
  {
    n: '04', title: 'Come richiedere il rimborso',
    content: [
      { type: 'text', text: 'Il rimborso viene sbloccato dal Comando al completamento della missione. Fino a quel momento il bottone non è disponibile.' },
      { type: 'steps', items: [
        'Ricevi notifica: **"Rimborso sbloccato"**',
        'Vai su **Rimborso Missione** nel menu',
        'Inserisci il **wallet address** corretto (USDT TRC20 o BEP20)',
        'Invia la richiesta — il Comando processa entro 24-48 ore',
      ]},
      { type: 'tip', text: 'Wallet sbagliato = fondi persi. Copia e incolla, non scrivere a mano.' },
    ]
  },
  {
    n: '05', title: 'Il bot Telegram',
    content: [
      { type: 'text', text: '@voltra_comandoBot è il canale diretto con il Comando. Ricevi notifiche istantanee, puoi scrivere al supporto e ottieni gli Ordini del Giorno in tempo reale.' },
      { type: 'steps', items: [
        'Vai su **Personale** → sezione **Collega Telegram**',
        'Tocca il link generato — si apre automaticamente Telegram',
        'Il bot conferma il collegamento con un messaggio di benvenuto',
      ]},
      { type: 'tip', text: 'Senza Telegram collegato non ricevi notifiche push. Collegalo subito.' },
    ]
  },
  {
    n: '06', title: 'Regole operative',
    content: [
      { type: 'rules', items: [
        { icon: '🔇', title: 'Discrezione', text: 'Le comunicazioni interne non escono dal club.' },
        { icon: '📡', title: 'Un canale solo', text: 'Domande operative solo via Linea Diretta HQ. Non via email personale, non via social.' },
        { icon: '⏳', title: 'Niente solleciti', text: 'Il Comando opera in ordine. Le approvazioni hanno i loro tempi.' },
        { icon: '📋', title: 'Codice di Condotta', text: 'È vincolante. Letto e accettato al primo accesso.' },
      ]},
      { type: 'tip', text: 'Silentio agimus.' },
    ]
  },
]

function renderContent(items) {
  return items.map((item, i) => {
    if (item.type === 'text') return (
      <p key={i} style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.75, marginBottom: 12 }}>{item.text}</p>
    )
    if (item.type === 'tip') return (
      <div key={i} style={{ display: 'flex', gap: 10, padding: '12px 14px', background: 'rgba(180,255,57,.04)', border: '1px solid rgba(180,255,57,.12)', borderRadius: 10, marginTop: 8 }}>
        <span style={{ fontSize: 14, flexShrink: 0 }}>⚡</span>
        <span style={{ fontSize: 12, color: 'rgba(180,255,57,.8)', lineHeight: 1.55, fontFamily: 'JetBrains Mono, monospace' }}>{item.text}</span>
      </div>
    )
    if (item.type === 'steps') return (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        {item.items.map((s, j) => (
          <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(180,255,57,.08)', border: '1px solid rgba(180,255,57,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: 'var(--lime)', flexShrink: 0, marginTop: 1 }}>{j + 1}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.6 }}
              dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#fff">$1</strong>') }} />
          </div>
        ))}
      </div>
    )
    if (item.type === 'badges') return (
      <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
        {item.items.map((b, j) => (
          <span key={j} style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: b.color, background: 'rgba(255,255,255,.04)', border: `1px solid rgba(255,255,255,.08)`, padding: '3px 10px', borderRadius: 5 }}>{b.label}</span>
        ))}
      </div>
    )
    if (item.type === 'rules') return (
      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 8 }}>
        {item.items.map((r, j) => (
          <div key={j} style={{ display: 'flex', gap: 12, padding: '10px 12px', background: 'rgba(255,255,255,.02)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 10 }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{r.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.5 }}>{r.text}</div>
            </div>
          </div>
        ))}
      </div>
    )
    return null
  })
}

export default function GuidaOperativa() {
  const [openIdx, setOpenIdx] = useState(null)
  const nav = useNavigate()

  const handleResetTour = () => {
    resetTour()
    nav('/dashboard')
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 0 48px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '.14em', fontWeight: 700, marginBottom: 10 }}>
          ⚡ Documento classificato · Solo membri
        </div>
        <h1 className="display" style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>Guida Operativa</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, margin: 0 }}>
          Tutto quello che devi sapere per operare nel Comando Voltra. Leggi una volta, non dimenticare.
        </p>
      </div>

      {/* Sections */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', marginBottom: 20 }}>
        {SECTIONS.map((s, i) => (
          <div key={i} style={{ borderBottom: i < SECTIONS.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ padding: '16px 20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, transition: 'background .15s' }}
            >
              <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(180,255,57,.08)', border: '1px solid rgba(180,255,57,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, color: 'var(--lime)', flexShrink: 0 }}>
                {s.n}
              </div>
              <div style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{s.title}</div>
              <div style={{ color: openIdx === i ? 'var(--lime)' : 'var(--muted)', fontSize: 16, transition: 'transform .2s', transform: openIdx === i ? 'rotate(90deg)' : 'none' }}>›</div>
            </div>
            {openIdx === i && (
              <div style={{ padding: '0 20px 20px 62px' }}>
                {renderContent(s.content)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reset tour button */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Rivedi il Giuramento</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Riparte la cerimonia di giuramento</div>
        </div>
        <button onClick={async () => {
          await fetch(`${import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'}/api/membri/oath`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${localStorage.getItem('voltra_token')}` }
          }).catch(() => {})
          nav('/dashboard')
        }} style={{ background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--lime)', padding: '9px 16px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'Manrope, sans-serif', whiteSpace: 'nowrap' }}>
          ▶ Rivedi
        </button>
      </div>
    </div>
  )
}
