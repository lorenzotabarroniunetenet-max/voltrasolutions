import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [openFaq, setOpenFaq] = useState(null)
  const [modal, setModal] = useState(null)
  const [showCookie, setShowCookie] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('voltra_cookies')) setShowCookie(true)
  }, [])

  const acceptCookies = () => { localStorage.setItem('voltra_cookies', 'accepted'); setShowCookie(false) }
  const declineCookies = () => { localStorage.setItem('voltra_cookies', 'declined'); setShowCookie(false) }

  return (
    <>
      <style>{landingCss}</style>
      <Header />
      <Hero />
      <Marquee />
      <Stats />
      <Gradi />
      <HowItWorks />
      <WhyVoltra />
      <Faq openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CtaFinal />
      <Footer onModal={setModal} />
      {showCookie && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} onInfo={() => setModal('cookies')} />}
      {modal && <Modal type={modal} onClose={() => setModal(null)} />}
    </>
  )
}

function Header() {
  return (
    <header className="vl-header">
      <Link to="/" className="vl-logo">
        <span className="vl-logo-bolt">⚡</span>
        <span className="vl-logo-name">VOLTRA</span>
      </Link>
      <nav className="vl-nav">
        <a href="#gradi">I Gradi</a>
        <a href="#come">Come funziona</a>
        <a href="#perche">Chi siamo</a>
        <Link to="/contact">Contatti</Link>
        <a href="#faq">FAQ</a>
      </nav>
      <div className="vl-hbtns">
        <Link to="/login" className="vl-btn vl-btn-secondary">Accedi</Link>
        <Link to="/register" className="vl-btn vl-btn-primary">Unisciti →</Link>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="vl-hero">
      <div className="vl-hero-glow" />
      <div className="vl-hero-grid-bg" />
      <div className="vl-hero-inner">
        <div>
          <div className="vl-badge-pill vl-f1"><span className="vl-pulse" /> Club privato · Su invito</div>
          <h1 className="vl-hero-h1 vl-f2">Scala i<br />ranghi.<br /><span className="vl-accent">Entra.</span></h1>
          <p className="vl-hero-sub vl-f3">Voltra è una community riservata. Ogni membro sceglie il suo grado, affronta la sua missione e sale di rango. L'accesso non è per tutti.</p>
          <div className="vl-hero-ctas vl-f4">
            <Link to="/register" className="vl-btn vl-btn-primary vl-btn-lg">Richiedi accesso →</Link>
            <a href="#gradi" className="vl-btn vl-btn-secondary vl-btn-lg">Scopri i gradi</a>
          </div>
          <div className="vl-hero-trust vl-f5">
            <div className="vl-trust-i"><span className="vl-ck">✓</span> Community privata</div>
            <div className="vl-trust-i"><span className="vl-ck">✓</span> Accesso su approvazione</div>
            <div className="vl-trust-i"><span className="vl-ck">✓</span> Missioni esclusive</div>
          </div>
        </div>
        <div className="vl-fr">
          <div className="vl-hero-card">
            <div className="vl-hero-card-lbl"><span className="vl-pulse" /> Ranghi della squadra</div>
            <div className="vl-mini-grid">
              <div className="vl-mini-g live"><span className="vl-live-tag">LIVE</span><div className="vl-mg-icon">🎖</div><div className="vl-mg-name">Caporale</div><div className="vl-mg-sub">Prima linea</div></div>
              <div className="vl-mini-g live"><span className="vl-live-tag">LIVE</span><div className="vl-mg-icon">⭐</div><div className="vl-mg-name">Sergente</div><div className="vl-mg-sub">Comando</div></div>
              <div className="vl-mini-g wip"><div className="vl-mg-icon">🦅</div><div className="vl-mg-name">Capitano</div><div className="vl-mg-sub wip-sub">Presto</div></div>
              <div className="vl-mini-g wip"><div className="vl-mg-icon">🎗</div><div className="vl-mg-name">Colonnello</div><div className="vl-mg-sub wip-sub">Presto</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Marquee() {
  const items = ['Community Privata', 'Accesso su Invito', 'Missioni Esclusive', 'Ranghi Militari', 'Supporto Dedicato', 'Club Riservato', 'Scala i Ranghi']
  return (
    <div className="vl-marquee">
      <div className="vl-mtrack">
        {[...items, ...items, ...items].map((it, i) => <span key={i} className="vl-mi">{it}</span>)}
      </div>
    </div>
  )
}

function Stats() {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
      <div className="vl-stats-row" style={{ marginTop: 72 }}>
        <div className="vl-stat-c"><div className="vl-stat-n">4</div><div className="vl-stat-l">Gradi militari</div></div>
        <div className="vl-stat-c"><div className="vl-stat-n">🔒</div><div className="vl-stat-l">Accesso su invito</div></div>
        <div className="vl-stat-c"><div className="vl-stat-n">24H</div><div className="vl-stat-l">Risposta media</div></div>
        <div className="vl-stat-c"><div className="vl-stat-n">⚡</div><div className="vl-stat-l">Community attiva</div></div>
      </div>
    </div>
  )
}

const GRADES = [
  { rank: '🎖', name: 'Caporale', mission: 'Prima linea', story: '"Il Caporale è il soldato che ha scelto di stare in prima linea. Impara le regole di ingaggio, costruisce la sua disciplina e dimostra il suo valore ogni giorno sul campo."', perks: ['Accesso alla piattaforma', 'Area riservata personale', 'Missioni del grado', 'Supporto diretto'], color: 'lime', wip: false },
  { rank: '⭐', name: 'Sergente', mission: 'Comando avanzato', story: '"Il Sergente guida dal fronte. Ha dimostrato disciplina e visione. Coordina operazioni più complesse e ha accesso a missioni riservate ai ranghi superiori."', perks: ['Tutto di Caporale', 'Missioni di rango superiore', 'Accesso prioritario', 'Canale diretto con HQ'], color: 'gold', wip: false },
  { rank: '🦅', name: 'Capitano', mission: 'Operazioni speciali', story: '"Il Capitano comanda operazioni speciali. Accede a missioni classificate, a risorse riservate e gestisce un team diretto. Solo per chi ha già dimostrato il proprio valore."', perks: ['Tutto di Sergente', 'Missioni classificate', 'Risorse esclusive', 'In arrivo'], color: 'wip', wip: true },
  { rank: '🎗', name: 'Colonnello', mission: 'Comando supremo', story: '"Il Colonnello è il vertice della catena di comando. Rango riservato a chi ha percorso l\'intera strada. Non si richiede — si guadagna."', perks: ['Solo su invito diretto', 'Accesso totale', 'Comando della squadra', 'In arrivo'], color: 'wip', wip: true },
]

function Gradi() {
  return (
    <section id="gradi" className="vl-section">
      <div style={{ textAlign: 'center' }}>
        <div className="vl-sec-lbl">— I Gradi della Squadra</div>
        <h2 className="vl-sec-title">Trova il tuo <span className="vl-accent">rango.</span></h2>
        <p className="vl-sec-sub" style={{ margin: '12px auto 0' }}>Ogni grado è una storia, una responsabilità, una missione. Sali di rango e guadagna il rispetto della squadra.</p>
      </div>
      <div className="vl-grades-grid">
        {GRADES.map(g => <GradeCard key={g.name} g={g} />)}
      </div>
    </section>
  )
}

function GradeCard({ g }) {
  const cardCls = g.wip ? 'vl-gc vl-wip' : `vl-gc vl-${g.color} vl-avail`
  const btnCls = g.wip ? 'vl-gc-btn vl-btn-dis' : `vl-gc-btn vl-btn-${g.color}`
  const checkColor = g.wip ? 'var(--vl-muted2)' : g.color === 'gold' ? 'var(--vl-gold)' : 'var(--vl-lime)'

  return (
    <div className={cardCls}>
      {g.wip && <div className="vl-wip-tag">Coming Soon</div>}
      <div className="vl-gc-bg">{g.rank}</div>
      <div className="vl-gc-icon">{g.rank}</div>
      <div className="vl-gc-nr"><span className="vl-gc-name">{g.name}</span><span className="vl-gc-mission">{g.mission}</span></div>
      <p className="vl-gc-story">{g.story}</p>
      <hr className="vl-gc-div" />
      <div className="vl-gc-perks">
        {g.perks.map((p, i) => (
          <div key={i} className="vl-gc-perk">
            <span className="vl-ck" style={{ color: checkColor }}>✓</span> {p}
          </div>
        ))}
      </div>
      {g.wip
        ? <button className={btnCls} disabled>In preparazione</button>
        : <Link to="/register" className={btnCls} style={{ textDecoration: 'none' }}>Richiedi accesso →</Link>}
    </div>
  )
}

function HowItWorks() {
  const steps = [
    { ico: '📝', n: '01', t: 'Registrati', d: 'Crea il tuo profilo con nome, email e password. Libero per tutti.' },
    { ico: '✉️', n: '02', t: 'Verifica il profilo', d: "Conferma la tua email per attivare l'account nella squadra." },
    { ico: '⏳', n: '03', t: "Attendi l'approvazione", d: 'Ogni nuovo membro viene valutato dal team. Ti contatteremo a breve.' },
    { ico: '🎖', n: '04', t: 'Scegli il rango', d: 'Una volta approvato, scegli il grado che ti appartiene e inizia la missione.' },
  ]
  return (
    <div className="vl-how-wrap">
      <div id="come" className="vl-section">
        <div style={{ textAlign: 'center' }}>
          <div className="vl-sec-lbl">— Come funziona</div>
          <h2 className="vl-sec-title">Da civile a <span className="vl-accent">soldato.</span></h2>
        </div>
        <div className="vl-steps-g">
          {steps.map(s => (
            <div key={s.n} className="vl-step">
              <div className="vl-step-ico">{s.ico}</div>
              <div className="vl-step-n">{s.n}</div>
              <div className="vl-step-t">{s.t}</div>
              <div className="vl-step-d">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WhyVoltra() {
  const pillars = [
    { ico: '🔒', t: 'Club riservato', d: 'Voltra non è aperta al pubblico. Ogni membro viene valutato individualmente prima dell\'accesso.' },
    { ico: '🎖', t: 'Sistema a ranghi', d: 'Ogni grado ha le sue missioni, i suoi privilegi e il suo livello di accesso. Scala la gerarchia.' },
    { ico: '🤝', t: 'Community reale', d: 'I membri Voltra si supportano. Hai un riferimento diretto nel team. Persone reali, non bot.' },
    { ico: '⚡', t: 'Missioni continue', d: 'Il club è in costante evoluzione. Nuovi ranghi, nuove missioni, nuove opportunità per i membri.' },
  ]
  return (
    <section id="perche" className="vl-section">
      <div style={{ textAlign: 'center' }}>
        <div className="vl-sec-lbl">— Chi siamo</div>
        <h2 className="vl-sec-title">Non siamo per <span className="vl-accent">tutti.</span></h2>
      </div>
      <div className="vl-why-grid">
        {pillars.map(p => (
          <div key={p.t} className="vl-wc">
            <div className="vl-wc-icon">{p.ico}</div>
            <div className="vl-wc-t">{p.t}</div>
            <div className="vl-wc-d">{p.d}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq({ openFaq, setOpenFaq }) {
  const items = [
    { q: 'Chi può entrare in Voltra?', a: "Chiunque può registrarsi, ma l'accesso al club è su approvazione. Il team valuta ogni profilo individualmente prima di concedere l'ingresso." },
    { q: 'Quanto tempo ci vuole per essere approvato?', a: 'Di solito entro 24 ore dalla verifica email. Ti contatteremo direttamente per completare l\'accesso.' },
    { q: 'Posso scegliere qualsiasi grado?', a: 'Caporale e Sergente sono disponibili ora per i nuovi membri. Capitano e Colonnello saranno lanciati a breve.' },
    { q: 'Come si sale di grado?', a: "I gradi superiori vengono assegnati dal team Voltra in base all'attività e al percorso del membro all'interno del club." },
    { q: 'Come contatto il team?', a: 'Una volta approvato, hai accesso diretto al team Voltra tramite l\'area riservata. Per ora puoi usare la pagina Contatti.' },
  ]
  return (
    <div className="vl-faq-wrap">
      <div id="faq" className="vl-section">
        <div style={{ textAlign: 'center' }}>
          <div className="vl-sec-lbl">— FAQ</div>
          <h2 className="vl-sec-title">Hai ancora <span className="vl-accent">domande?</span></h2>
        </div>
        <div className="vl-faq-list">
          {items.map((it, i) => (
            <div key={i} className="vl-faq-item">
              <div className="vl-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {it.q}
                <span className={`vl-faq-plus${openFaq === i ? ' open' : ''}`}>+</span>
              </div>
              {openFaq === i && <div className="vl-faq-a">{it.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CtaFinal() {
  return (
    <div className="vl-cta-section">
      <div className="vl-cta-box">
        <div className="vl-cta-icon">🎖</div>
        <div className="vl-cta-h">Pronto a scalare<br />i <span className="vl-accent">ranghi?</span></div>
        <p className="vl-cta-p">Registrati, verifica il profilo e aspetta il nostro ok. La missione inizia da qui.</p>
        <Link to="/register" className="vl-btn vl-btn-primary vl-btn-lg">Unisciti al club →</Link>
      </div>
    </div>
  )
}

function Footer({ onModal }) {
  return (
    <footer className="vl-footer">
      <div className="vl-fg">
        <div>
          <Link to="/" className="vl-logo">
            <span className="vl-logo-bolt">⚡</span>
            <span className="vl-logo-name">VOLTRA</span>
          </Link>
          <p className="vl-fb-desc">Club privato. Missioni esclusive. Community riservata.</p>
        </div>
        <div className="vl-fc">
          <div className="vl-fc-h">Club</div>
          <a href="#gradi">I Gradi</a>
          <a href="#come">Come funziona</a>
          <a href="#perche">Chi siamo</a>
        </div>
        <div className="vl-fc">
          <div className="vl-fc-h">Accesso</div>
          <Link to="/login">Accedi</Link>
          <Link to="/register">Registrati</Link>
          <Link to="/contact">Contatti</Link>
        </div>
        <div className="vl-fc">
          <div className="vl-fc-h">Legal</div>
          <a href="#" onClick={e => { e.preventDefault(); onModal('terms') }}>Terms</a>
          <a href="#" onClick={e => { e.preventDefault(); onModal('privacy') }}>Privacy</a>
          <a href="#" onClick={e => { e.preventDefault(); onModal('cookies') }}>Cookie</a>
        </div>
      </div>
      <div className="vl-fb">
        <span>© 2026 Voltra Solutions. Tutti i diritti riservati.</span>
        <span>Accesso riservato ai membri approvati.</span>
      </div>
    </footer>
  )
}

function CookieBanner({ onAccept, onDecline, onInfo }) {
  return (
    <div className="vl-cookie-banner">
      <div className="vl-cookie-text">
        Voltra utilizza cookie tecnici per il funzionamento del sito. <a href="#" onClick={e => { e.preventDefault(); onInfo() }}>Maggiori info</a>
      </div>
      <div className="vl-cookie-actions">
        <button className="vl-cookie-btn vl-cookie-decline" onClick={onDecline}>Rifiuta</button>
        <button className="vl-cookie-btn vl-cookie-accept" onClick={onAccept}>Accetta</button>
      </div>
    </div>
  )
}

function Modal({ type, onClose }) {
  const content = {
    terms: { title: 'Termini di servizio', body: <>
      <p>Voltra è una community privata accessibile solo ai membri approvati.</p>
      <p>L'utilizzo del sito implica l'accettazione delle condizioni d'uso. La versione completa dei termini sarà pubblicata a breve.</p>
    </> },
    privacy: { title: 'Privacy', body: <>
      <p>Voltra rispetta la privacy dei propri membri.</p>
      <p>I dati raccolti durante la registrazione vengono utilizzati esclusivamente per la gestione del club e non sono condivisi con terze parti. La privacy policy completa sarà pubblicata a breve.</p>
    </> },
    cookies: { title: 'Cookie Policy', body: <>
      <p>Voltra utilizza esclusivamente cookie tecnici necessari al funzionamento del sito.</p>
      <p>Non utilizziamo cookie di tracciamento o profilazione. Nessun dato viene condiviso con servizi terzi a scopo pubblicitario.</p>
    </> },
  }[type]
  if (!content) return null

  return (
    <div className="vl-modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="vl-modal">
        <h3>{content.title}</h3>
        <div>{content.body}</div>
        <button className="vl-modal-close" onClick={onClose}>Chiudi</button>
      </div>
    </div>
  )
}

const landingCss = `
:root {
  --vl-lime: #B4FF39;
  --vl-bg: #000000;
  --vl-surface: #0a0a0a;
  --vl-surface2: #141414;
  --vl-border: rgba(255,255,255,0.08);
  --vl-border-bright: rgba(255,255,255,0.16);
  --vl-text: #ffffff;
  --vl-muted: #b0b0b0;
  --vl-muted2: #707070;
  --vl-gold: #E8C84A;
}
body { background: var(--vl-bg); }
.vl-accent { color: var(--vl-lime); }
.vl-ck { color: var(--vl-lime); }

.vl-btn { display:inline-flex; align-items:center; gap:6px; border-radius:8px; font-weight:700; cursor:pointer; border:none; transition:all .15s; text-decoration:none; }
.vl-btn-primary { background:var(--vl-lime); color:#000; padding:11px 22px; font-size:14px; }
.vl-btn-primary:hover { background:#cbff5e; transform:translateY(-1px); box-shadow:0 6px 20px rgba(180,255,57,.25); }
.vl-btn-secondary { background:rgba(20,20,20,0.85); color:#ffffff; border:1px solid rgba(255,255,255,0.3); padding:11px 22px; font-size:14px; backdrop-filter:blur(8px); }
.vl-btn-secondary:hover { border-color:rgba(255,255,255,0.5); background:rgba(30,30,30,0.95); }
.vl-btn-lg { padding:14px 28px; font-size:15px; border-radius:10px; }

.vl-header { position:sticky; top:0; z-index:100; background:rgba(0,0,0,.85); backdrop-filter:blur(16px); border-bottom:1px solid var(--vl-border); padding:0 40px; height:64px; display:flex; align-items:center; justify-content:space-between; }
.vl-logo { display:flex; align-items:center; gap:9px; text-decoration:none; }
.vl-logo-bolt { font-size:22px; color:var(--vl-lime); }
.vl-logo-name { font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:.08em; color:var(--vl-text); }
.vl-nav { display:flex; gap:28px; }
.vl-nav a { font-size:13px; font-weight:500; color:var(--vl-muted); transition:color .15s; text-decoration:none; }
.vl-nav a:hover { color:var(--vl-text); }
.vl-hbtns { display:flex; gap:8px; }

.vl-hero { position:relative; padding:90px 40px 100px; overflow:hidden; }
.vl-hero-glow { position:absolute; top:-180px; left:50%; transform:translateX(-50%); width:900px; height:700px; background:radial-gradient(ellipse at center,rgba(180,255,57,.07) 0%,transparent 65%); pointer-events:none; }
.vl-hero-grid-bg { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.006) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.006) 1px,transparent 1px); background-size:56px 56px; pointer-events:none; mask-image:radial-gradient(ellipse 75% 75% at 50% 40%,black 30%,transparent 100%); }
.vl-hero-inner { max-width:1200px; margin:0 auto; position:relative; z-index:1; display:grid; grid-template-columns:1fr 1fr; gap:72px; align-items:center; }

.vl-badge-pill { display:inline-flex; align-items:center; gap:8px; background:rgba(180,255,57,.08); border:1px solid rgba(180,255,57,.2); border-radius:100px; padding:5px 14px 5px 10px; font-size:12px; color:var(--vl-lime); font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin-bottom:24px; }
.vl-pulse { width:6px; height:6px; border-radius:50%; background:var(--vl-lime); flex-shrink:0; animation:vl-pulse 1.8s ease-in-out infinite; }
@keyframes vl-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(180,255,57,.5)} 50%{box-shadow:0 0 0 6px rgba(180,255,57,0)} }

.vl-hero-h1 { font-family:'Bebas Neue',sans-serif; font-size:clamp(54px,7vw,82px); line-height:.93; letter-spacing:.01em; color:#ffffff; margin-bottom:22px; text-shadow:0 2px 32px rgba(0,0,0,0.9); }
.vl-hero-h1 .vl-accent { color:var(--vl-lime); text-shadow:0 0 30px rgba(180,255,57,0.4); }
.vl-hero-sub { font-size:17px; color:#cccccc; line-height:1.65; max-width:440px; margin-bottom:36px; }
.vl-hero-ctas { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:40px; }
.vl-hero-trust { display:flex; gap:20px; padding-top:20px; border-top:1px solid var(--vl-border); flex-wrap:wrap; }
.vl-trust-i { display:flex; align-items:center; gap:6px; font-size:12px; color:var(--vl-muted); font-weight:500; }

.vl-hero-card { background:var(--vl-surface); border:1px solid var(--vl-border-bright); border-radius:18px; padding:28px; position:relative; overflow:hidden; }
.vl-hero-card::before { content:''; position:absolute; top:0; left:10%; right:10%; height:1px; background:linear-gradient(90deg,transparent,var(--vl-lime),transparent); opacity:.6; }
.vl-hero-card-lbl { display:flex; align-items:center; gap:8px; font-size:11px; text-transform:uppercase; letter-spacing:.1em; color:var(--vl-muted); font-weight:600; margin-bottom:16px; }
.vl-mini-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.vl-mini-g { background:var(--vl-surface2); border:1px solid var(--vl-border); border-radius:12px; padding:14px; transition:all .2s; position:relative; }
.vl-mini-g.live { border-color:rgba(180,255,57,.3); background:rgba(180,255,57,.03); }
.vl-mini-g.live:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(180,255,57,.08); }
.vl-mini-g.wip { opacity:.4; }
.vl-live-tag { position:absolute; top:8px; right:8px; font-size:9px; font-weight:700; letter-spacing:.1em; color:var(--vl-lime); text-transform:uppercase; }
.vl-mg-icon { font-size:20px; margin-bottom:8px; }
.vl-mg-name { font-weight:700; font-size:14px; color:var(--vl-text); margin-bottom:2px; }
.vl-mg-sub { font-size:11px; color:var(--vl-muted); margin-top:4px; }
.vl-mg-sub.wip-sub { color:var(--vl-muted2); }

.vl-marquee { overflow:hidden; background:var(--vl-surface); border-top:1px solid var(--vl-border); border-bottom:1px solid var(--vl-border); padding:14px 0; }
.vl-mtrack { display:flex; animation:vl-mq 24s linear infinite; width:max-content; }
@keyframes vl-mq { from{transform:translateX(0)} to{transform:translateX(-33.333%)} }
.vl-mi { padding:0 28px; font-size:12px; font-weight:600; color:var(--vl-muted); text-transform:uppercase; letter-spacing:.08em; white-space:nowrap; }
.vl-mi::after { content:'·'; color:var(--vl-lime); margin-left:28px; }

.vl-section { padding:88px 40px; max-width:1200px; margin:0 auto; }
.vl-sec-lbl { font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--vl-lime); text-transform:uppercase; letter-spacing:.15em; font-weight:600; margin-bottom:10px; }
.vl-sec-title { font-family:'Bebas Neue',sans-serif; font-size:clamp(36px,4.5vw,54px); letter-spacing:.02em; line-height:1; color:#ffffff; margin-bottom:12px; text-shadow:0 2px 24px rgba(0,0,0,0.95); }
.vl-sec-title .vl-accent { color:var(--vl-lime); text-shadow:0 0 24px rgba(180,255,57,0.3); }
.vl-sec-sub { font-size:15px; color:var(--vl-muted); max-width:520px; line-height:1.7; }

.vl-stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:var(--vl-border); border:1px solid var(--vl-border); border-radius:14px; overflow:hidden; margin-top:56px; }
.vl-stat-c { background:var(--vl-surface); padding:32px 20px; text-align:center; transition:background .2s; }
.vl-stat-c:hover { background:var(--vl-surface2); }
.vl-stat-n { font-family:'Bebas Neue',sans-serif; font-size:44px; color:var(--vl-lime); letter-spacing:.02em; line-height:1; margin-bottom:8px; }
.vl-stat-l { font-size:12px; color:var(--vl-muted); text-transform:uppercase; letter-spacing:.07em; font-weight:600; }

.vl-grades-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:18px; margin-top:48px; }
.vl-gc { background:var(--vl-surface); border:1px solid var(--vl-border); border-radius:16px; padding:28px; position:relative; overflow:hidden; transition:transform .2s,box-shadow .2s,border-color .2s; }
.vl-gc.vl-avail:hover { transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,.5); border-color:var(--vl-border-bright); }
.vl-gc.vl-lime { border-color:rgba(180,255,57,.2); }
.vl-gc.vl-lime:hover { box-shadow:0 16px 48px rgba(180,255,57,.08); border-color:rgba(180,255,57,.35); }
.vl-gc.vl-gold { border-color:rgba(232,200,74,.2); }
.vl-gc.vl-gold:hover { box-shadow:0 16px 48px rgba(232,200,74,.07); border-color:rgba(232,200,74,.35); }
.vl-gc.vl-wip { opacity:.5; }
.vl-gc-bg { position:absolute; top:-16px; right:-8px; font-size:90px; opacity:.05; pointer-events:none; user-select:none; line-height:1; }
.vl-wip-tag { position:absolute; top:14px; right:14px; font-size:9px; font-weight:700; letter-spacing:.1em; color:var(--vl-muted2); background:var(--vl-surface2); border:1px solid var(--vl-border); padding:3px 9px; border-radius:20px; text-transform:uppercase; }
.vl-gc-icon { font-size:34px; margin-bottom:12px; }
.vl-gc-nr { display:flex; align-items:baseline; gap:10px; margin-bottom:8px; }
.vl-gc-name { font-family:'Bebas Neue',sans-serif; font-size:28px; letter-spacing:.04em; color:var(--vl-text); }
.vl-gc-mission { font-size:11px; color:var(--vl-muted2); text-transform:uppercase; letter-spacing:.07em; font-weight:600; }
.vl-gc-story { font-size:13px; color:var(--vl-muted); line-height:1.65; margin-bottom:18px; font-style:italic; }
.vl-gc-div { border:none; border-top:1px solid var(--vl-border); margin:16px 0; }
.vl-gc-perks { margin-bottom:22px; }
.vl-gc-perk { display:flex; align-items:center; gap:9px; font-size:13px; color:var(--vl-text); padding:5px 0; }
.vl-gc-btn { display:block; width:100%; text-align:center; padding:12px; border-radius:9px; font-size:13px; font-weight:700; cursor:pointer; border:none; transition:all .15s; text-decoration:none; }
.vl-btn-lime { background:var(--vl-lime); color:#000; }
.vl-btn-lime:hover { background:#cbff5e; transform:translateY(-1px); }
.vl-btn-gold { background:linear-gradient(135deg,#E8C84A,#D4A017); color:#000; }
.vl-btn-gold:hover { opacity:.9; transform:translateY(-1px); }
.vl-btn-dis { background:var(--vl-surface2); color:var(--vl-muted2); cursor:not-allowed; border:1px solid var(--vl-border); }

.vl-how-wrap { background:var(--vl-surface); border-top:1px solid var(--vl-border); border-bottom:1px solid var(--vl-border); }
.vl-steps-g { display:grid; grid-template-columns:repeat(4,1fr); gap:40px; margin-top:48px; }
.vl-step { text-align:center; position:relative; }
.vl-step:not(:last-child)::after { content:''; position:absolute; top:28px; right:-20px; width:40px; height:1px; background:linear-gradient(90deg,var(--vl-border-bright),transparent); }
.vl-step-ico { width:56px; height:56px; border-radius:14px; background:var(--vl-surface2); border:1px solid var(--vl-border); display:flex; align-items:center; justify-content:center; font-size:22px; margin:0 auto 14px; transition:border-color .2s; }
.vl-step:hover .vl-step-ico { border-color:rgba(180,255,57,.4); }
.vl-step-n { font-family:'JetBrains Mono',monospace; font-size:10px; color:var(--vl-lime); font-weight:600; letter-spacing:.12em; margin-bottom:8px; }
.vl-step-t { font-size:15px; font-weight:700; color:#ffffff; margin-bottom:8px; }
.vl-step-d { font-size:13px; color:#b8b8b8; line-height:1.6; }

.vl-why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:16px; margin-top:48px; }
.vl-wc { background:var(--vl-surface); border:1px solid var(--vl-border); border-radius:14px; padding:24px; transition:border-color .2s; }
.vl-wc:hover { border-color:var(--vl-border-bright); }
.vl-wc-icon { font-size:26px; margin-bottom:12px; }
.vl-wc-t { font-size:15px; font-weight:700; color:#ffffff; margin-bottom:8px; }
.vl-wc-d { font-size:13px; color:#b8b8b8; line-height:1.6; }

.vl-faq-wrap { background:var(--vl-surface); border-top:1px solid var(--vl-border); border-bottom:1px solid var(--vl-border); }
.vl-faq-list { max-width:700px; margin:40px auto 0; }
.vl-faq-item { border-bottom:1px solid var(--vl-border); }
.vl-faq-q { display:flex; justify-content:space-between; align-items:center; padding:18px 0; cursor:pointer; font-size:14px; font-weight:500; color:var(--vl-text); transition:color .15s; user-select:none; }
.vl-faq-q:hover { color:var(--vl-lime); }
.vl-faq-plus { color:var(--vl-lime); font-size:20px; transition:transform .2s; flex-shrink:0; margin-left:16px; line-height:1; }
.vl-faq-plus.open { transform:rotate(45deg); }
.vl-faq-a { padding:0 0 18px; font-size:13px; color:var(--vl-muted); line-height:1.7; }

.vl-cta-section { padding:88px 40px 110px; }
.vl-cta-box { max-width:960px; margin:0 auto; background:var(--vl-surface); border:1px solid rgba(180,255,57,.18); border-radius:20px; padding:72px 40px; text-align:center; position:relative; overflow:hidden; }
.vl-cta-box::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 50% 0%,rgba(180,255,57,.06) 0%,transparent 60%); pointer-events:none; }
.vl-cta-icon { font-size:44px; margin-bottom:18px; }
.vl-cta-h { font-family:'Bebas Neue',sans-serif; font-size:clamp(38px,5vw,52px); letter-spacing:.02em; color:#ffffff; margin-bottom:14px; text-shadow:0 2px 24px rgba(0,0,0,0.95); }
.vl-cta-h .vl-accent { color:var(--vl-lime); text-shadow:0 0 24px rgba(180,255,57,0.3); }
.vl-cta-p { font-size:15px; color:var(--vl-muted); max-width:460px; margin:0 auto 32px; line-height:1.65; }

.vl-footer { background:var(--vl-surface); border-top:1px solid var(--vl-border); padding:56px 40px 28px; }
.vl-fg { max-width:1200px; margin:0 auto; display:grid; grid-template-columns:2fr 1fr 1fr 1fr; gap:40px; margin-bottom:40px; }
.vl-fb-desc { font-size:13px; color:var(--vl-muted); line-height:1.6; margin-top:12px; max-width:240px; }
.vl-fc-h { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:var(--vl-muted2); font-weight:700; margin-bottom:14px; }
.vl-fc a { display:block; color:var(--vl-muted); font-size:13px; padding:5px 0; transition:color .15s; text-decoration:none; }
.vl-fc a:hover { color:var(--vl-text); }
.vl-fb { max-width:1200px; margin:0 auto; padding-top:24px; border-top:1px solid var(--vl-border); font-size:11px; color:var(--vl-muted2); display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }

.vl-cookie-banner { position:fixed; bottom:20px; left:20px; right:20px; max-width:600px; margin:0 auto; background:var(--vl-surface); border:1px solid var(--vl-border-bright); border-radius:14px; padding:18px 22px; display:flex; align-items:center; gap:16px; z-index:200; box-shadow:0 20px 60px rgba(0,0,0,0.5); flex-wrap:wrap; }
.vl-cookie-text { flex:1; min-width:200px; font-size:13px; color:var(--vl-muted); line-height:1.5; }
.vl-cookie-text a { color:var(--vl-lime); }
.vl-cookie-actions { display:flex; gap:8px; }
.vl-cookie-btn { padding:9px 18px; border-radius:8px; font-size:13px; font-weight:700; cursor:pointer; border:none; }
.vl-cookie-accept { background:var(--vl-lime); color:#000; }
.vl-cookie-accept:hover { background:#cbff5e; }
.vl-cookie-decline { background:transparent; color:var(--vl-muted); border:1px solid var(--vl-border-bright); }
.vl-cookie-decline:hover { color:var(--vl-text); border-color:rgba(255,255,255,0.3); }

.vl-modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.85); display:flex; align-items:center; justify-content:center; z-index:300; padding:20px; }
.vl-modal { background:var(--vl-surface); border:1px solid var(--vl-border-bright); border-radius:18px; padding:36px; max-width:560px; width:100%; max-height:80vh; overflow-y:auto; }
.vl-modal h3 { font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:.02em; color:var(--vl-text); margin-bottom:16px; }
.vl-modal p { color:var(--vl-muted); font-size:14px; line-height:1.7; margin-bottom:14px; }
.vl-modal-close { background:var(--vl-lime); color:#000; padding:10px 22px; border-radius:8px; font-size:14px; font-weight:700; cursor:pointer; border:none; margin-top:8px; }

@keyframes vl-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
.vl-f1{animation:vl-fadeUp .5s ease .05s both}.vl-f2{animation:vl-fadeUp .5s ease .15s both}.vl-f3{animation:vl-fadeUp .5s ease .25s both}.vl-f4{animation:vl-fadeUp .5s ease .35s both}.vl-f5{animation:vl-fadeUp .5s ease .45s both}.vl-fr{animation:vl-fadeUp .6s ease .3s both}

@media(max-width:860px) {
  .vl-hero-inner{grid-template-columns:1fr;gap:40px}
  .vl-steps-g{grid-template-columns:1fr 1fr}
  .vl-stats-row{grid-template-columns:1fr 1fr}
  .vl-fg{grid-template-columns:1fr 1fr}
  .vl-nav{display:none}
  .vl-header,.vl-section,.vl-cta-section,.vl-footer{padding-left:20px;padding-right:20px}
  .vl-hero{padding:60px 20px 80px}
}
`
