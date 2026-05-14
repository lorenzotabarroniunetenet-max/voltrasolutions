import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Landing() {
  const [programs, setPrograms] = useState([])
  const [tab, setTab] = useState('CHALLENGE')
  const [openFaq, setOpenFaq] = useState(null)

  useEffect(() => {
    api.programs().then(setPrograms).catch(() => {})
  }, [])

  const filteredPrograms = programs.filter(p => p.phase === tab)

  return (
    <div>
      <Header />
      <Hero />
      <Marquee />
      <Stats />
      <Features />
      <Plans programs={filteredPrograms} tab={tab} setTab={setTab} />
      <HowItWorks />
      <PlatformSection />
      <Testimonials />
      <Faq openFaq={openFaq} setOpenFaq={setOpenFaq} />
      <CtaFinal />
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(5, 5, 5, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 32px',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 26, color: 'var(--lime)' }}>⚡</span>
          <span className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '0.02em' }}>VOLTRA</span>
        </Link>
        <nav style={{ display: 'flex', gap: 32, fontSize: 14, color: 'var(--muted)' }} className="hide-mobile">
          <a href="#features" style={{ transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--muted)'}>Features</a>
          <a href="#plans" onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--muted)'}>Programmi</a>
          <a href="#how" onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--muted)'}>Come funziona</a>
          <Link to="/contact" style={{ transition: 'color 0.15s' }} onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--muted)'}>Contatti</Link>
          <a href="#faq" onMouseEnter={e => e.target.style.color='var(--text)'} onMouseLeave={e => e.target.style.color='var(--muted)'}>FAQ</a>
        </nav>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to="/login" className="btn-secondary" style={{ padding: '10px 18px', fontSize: 14 }}>Log in</Link>
          <Link to="/register" className="btn-primary" style={{ padding: '10px 18px', fontSize: 14 }}>Inizia →</Link>
        </div>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', padding: '80px 32px 120px' }} className="hero-grid">
      <div className="hero-glow" style={{ top: -200, left: '50%', transform: 'translateX(-50%)' }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <div className="badge badge-lime" style={{ marginBottom: 32 }}>
          <span className="pulse-dot"></span> Nuova era del prop trading
        </div>

        <h1 className="hero-headline" style={{ marginBottom: 24 }}>
          Trade smarter.<br />
          Trade with <span className="accent">Voltra</span>.
        </h1>

        <p style={{ fontSize: 20, color: 'var(--muted)', maxWidth: 680, margin: '0 auto 40px', lineHeight: 1.5 }}>
          Fino a <strong style={{ color: 'var(--text)' }}>$200,000</strong> di capitale. Profit split fino al <strong style={{ color: 'var(--text)' }}>70%</strong>. 
          Payout in crypto, regole trasparenti, nessun limite di tempo.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
          <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
            Inizia ora →
          </Link>
          <a href="#plans" className="btn-secondary" style={{ fontSize: 16, padding: '16px 32px' }}>
            Vedi programmi
          </a>
        </div>

        {/* Live preview card */}
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          background: 'var(--surface)',
          border: '1px solid var(--border-bright)',
          borderRadius: 20,
          padding: 32,
          textAlign: 'left',
          position: 'relative',
          boxShadow: '0 30px 80px -20px rgba(180, 255, 57, 0.1)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="mono" style={{ fontSize: 13, color: 'var(--muted)' }}>EURUSD · LIVE</span>
              <span className="pulse-dot"></span>
            </div>
            <span className="mono" style={{ color: 'var(--lime)', fontWeight: 700, fontSize: 18 }}>+$4,820.55</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16 }}>
            <Mini label="Win rate" value="72%" />
            <Mini label="Drawdown" value="2.4%" />
            <Mini label="Trades" value="148" />
            <Mini label="P/F" value="1.85" />
          </div>

          {/* Mini chart visual */}
          <div style={{ marginTop: 20, height: 60, position: 'relative', overflow: 'hidden' }}>
            <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="none">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(180, 255, 57, 0.3)" />
                  <stop offset="100%" stopColor="rgba(180, 255, 57, 0)" />
                </linearGradient>
              </defs>
              <path d="M0,50 L40,42 L80,38 L120,40 L160,30 L200,32 L240,22 L280,20 L320,15 L360,12 L400,8 L400,60 L0,60 Z" fill="url(#g1)" />
              <path d="M0,50 L40,42 L80,38 L120,40 L160,30 L200,32 L240,22 L280,20 L320,15 L360,12 L400,8" stroke="var(--lime)" strokeWidth="2" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

function Mini({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div className="mono" style={{ fontSize: 20, fontWeight: 700 }}>{value}</div>
    </div>
  )
}

function Marquee() {
  const items = ['Payout in 24h', 'Fino a 70% split', 'Nessun time limit', 'Regole trasparenti', 'cTrader supportato', 'Pagamenti crypto', 'Funding worldwide']
  return (
    <div className="marquee">
      <div className="marquee-track">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  )
}

function Stats() {
  return (
    <section className="section section-tight">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
        <div className="stat-block">
          <div className="stat-value">$200K</div>
          <div className="stat-label">Capital massimo</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">70%</div>
          <div className="stat-label">Profit split</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">24h</div>
          <div className="stat-label">Payout SLA</div>
        </div>
        <div className="stat-block">
          <div className="stat-value">∞</div>
          <div className="stat-label">Time limit</div>
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    { icon: '⚡', title: 'Payout istantanei', desc: 'Richieste processate in meno di 24h. Pagamenti in crypto USDT, USDC, BTC.', meta: '24h SLA' },
    { icon: '∞', title: 'Nessun time limit', desc: 'Passa la challenge al tuo ritmo. Una settimana o tre mesi, il tuo account ti aspetta.', meta: 'No expiry' },
    { icon: '📈', title: 'Split fino al 70%', desc: 'Profit share che scala con la tua performance. Più tradi bene, più tieni.', meta: '70/30' },
    { icon: '✦', title: 'Regole trasparenti', desc: 'Una pagina di regole. Nessuna condizione nascosta, nessuna sorpresa.', meta: 'No tricks' },
  ]
  return (
    <section id="features" className="section">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">— Why Voltra</div>
        <h2 className="section-title">Costruito per chi vuole <span className="accent">edge reale</span>,<br />non burocrazia.</h2>
        <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
          Una prop firm ricostruita su ciò che conta: velocità, trasparenza, capitale scalabile.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
        {features.map((f, i) => (
          <div key={i} className="card card-glow">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{f.icon}</span>
              <span className="badge badge-lime" style={{ fontSize: 10 }}>{f.meta}</span>
            </div>
            <h3 className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function Plans({ programs, tab, setTab }) {
  return (
    <section id="plans" className="section">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">— Programmi</div>
        <h2 className="section-title">Scegli il <span className="accent">programma</span> che ti rappresenta.</h2>
        <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
          Due percorsi, stesso obiettivo: un account funded di cui puoi davvero scalare il capitale.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'INSTANT', label: 'Instant Funding' },
            { id: 'CHALLENGE', label: 'Challenge' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              background: tab === t.id ? 'var(--lime)' : 'transparent',
              color: tab === t.id ? '#000' : 'var(--muted)',
              border: 'none',
              padding: '10px 24px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Plan cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {programs.length === 0 ? (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--muted)', padding: 60 }}>Nessun programma disponibile.</div>
        ) : programs.map((p, i) => {
          const featured = i === 1
          return (
            <div key={p.id} className={`plan-card ${featured ? 'plan-card-featured' : ''}`}>
              {featured && (
                <div className="badge badge-lime" style={{ position: 'absolute', top: 16, right: 16 }}>Popular</div>
              )}
              <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 8 }}>
                {p.phase === 'CHALLENGE' ? 'Challenge' : p.phase === 'INSTANT' ? 'Instant Funding' : p.phase}
              </div>
              <div className="display" style={{ fontSize: 56, fontWeight: 700, color: 'var(--lime)', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.04em' }}>
                ${Number(p.accountSize / 1000)}K
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>Account funded</div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 14, marginBottom: 28, flex: 1 }}>
                <PlanItem yes>{p.profitTargetPct ? `${p.profitTargetPct}% profit target` : 'Nessun profit target'}</PlanItem>
                <PlanItem yes>{p.maxDailyLossPct}% max daily drawdown</PlanItem>
                <PlanItem yes>{p.maxOverallLossPct}% max overall drawdown</PlanItem>
                <PlanItem yes>{p.profitSplitPct}% profit split</PlanItem>
                <PlanItem yes>{p.minTradingDays ? `Min ${p.minTradingDays} giorni di trading` : 'Nessun minimo giorni'}</PlanItem>
                <PlanItem yes>cTrader / MetaTrader</PlanItem>
              </ul>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 20 }}>
                <div className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' }}>
                  ${Number(p.priceUsd || 0)}
                </div>
                {p.activationFeeUsd && (
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    + ${Number(p.activationFeeUsd)} activation fee (al funded)
                  </div>
                )}
              </div>

              <Link to="/register" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Acquista →
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function PlanItem({ children, yes }) {
  return (
    <li style={{ padding: '8px 0', display: 'flex', alignItems: 'flex-start', gap: 10, borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: yes ? 'var(--lime)' : 'var(--muted)', fontSize: 14, marginTop: 2 }}>{yes ? '✓' : '×'}</span>
      <span style={{ color: 'var(--text)' }}>{children}</span>
    </li>
  )
}

function HowItWorks() {
  const steps = [
    { n: '01', title: 'Scegli il programma', desc: 'Seleziona size e regole che ti rappresentano. Una sola tariffa, zero abbonamenti.' },
    { n: '02', title: 'Passa la valutazione', desc: 'Raggiungi il target del 10% senza violare i drawdown. Prenditi il tempo che vuoi.' },
    { n: '03', title: 'Vieni funded & pagato', desc: 'Trade l\'account live, richiedi il payout in qualunque momento. Il capitale scala.' },
  ]
  return (
    <section id="how" className="section">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">— Path</div>
        <h2 className="section-title">Tre step. <span className="accent">Un account funded.</span></h2>
        <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
          Dalla registrazione al primo payout in giorni, non mesi.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
        {steps.map((s, i) => (
          <div key={i} className="card" style={{ padding: 32, position: 'relative' }}>
            <div className="display" style={{ fontSize: 64, fontWeight: 700, color: 'rgba(180, 255, 57, 0.15)', lineHeight: 1, position: 'absolute', top: 24, right: 24 }}>
              {s.n}
            </div>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(180, 255, 57, 0.1)', border: '1px solid rgba(180, 255, 57, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, color: 'var(--lime)', fontWeight: 700 }}>
              {i + 1}
            </div>
            <h3 className="display" style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>{s.title}</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PlatformSection() {
  return (
    <section className="section">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
        <div>
          <div className="section-label">— Platform</div>
          <h2 className="section-title">Una piattaforma. <span className="accent">Zero compromessi.</span></h2>
          <p style={{ color: 'var(--muted)', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            Abbiamo scelto lo stack di esecuzione migliore così tu non devi farlo. Moderno, veloce, web e mobile.
          </p>

          <div style={{ display: 'grid', gap: 16 }}>
            {[
              { title: 'Esecuzione sub-30ms', desc: 'Raw-spread, nessun requote, nessun last-look.' },
              { title: 'Web, desktop & mobile', desc: 'Un account, ogni dispositivo. iOS e Android nativi.' },
              { title: 'Charting professionale', desc: 'Multi-timeframe, 100+ indicatori, drawing tools.' },
              { title: 'EA & copy trading', desc: 'Automatizza il tuo edge con full strategy support.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 16 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: 'var(--lime)', marginTop: 7, flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.title}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 24, background: 'var(--surface-2)' }}>
          <div className="mono" style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>voltra · live ticker</div>
          {[
            { sym: 'EURUSD', price: '1.0842', chg: '+0.34%', up: true },
            { sym: 'XAUUSD', price: '2,318.7', chg: '+1.12%', up: true },
            { sym: 'GBPJPY', price: '196.34', chg: '-0.18%', up: false },
            { sym: 'NAS100', price: '18,640', chg: '+0.62%', up: true },
            { sym: 'BTCUSD', price: '71,420', chg: '+2.41%', up: true },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}>
              <span className="mono" style={{ fontWeight: 600 }}>{t.sym}</span>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <span className="mono" style={{ color: 'var(--muted)' }}>{t.price}</span>
                <span className="mono" style={{ color: t.up ? 'var(--lime)' : 'var(--red)', fontWeight: 600, fontSize: 13, minWidth: 60, textAlign: 'right' }}>{t.chg}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const items = [
    { name: 'Marco R.', size: '$100K funded', text: 'Funded in 14 giorni, primo payout in 24h. Voltra ha mantenuto quello che altre firm promettevano e basta.' },
    { name: 'Aisha K.', size: '$200K funded', text: 'Le regole stanno in una pagina. Nessun trick sul drawdown, nessuna negazione a sorpresa. Era tutto quello che chiedevo.' },
    { name: 'Daniele P.', size: '$50K funded', text: 'Richiesto payout di domenica, fondi sul wallet lunedì mattina. Nessuno fa così.' },
    { name: 'Tomás L.', size: '$100K funded', text: 'Passato da tre prop firm diverse. Spread tight, support reale, payout veri.' },
  ]
  return (
    <section className="section">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">— Testimonianze</div>
        <h2 className="section-title">Storie <span className="accent">di trader funded</span>.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {items.map((t, i) => (
          <div key={i} className="card" style={{ padding: 28 }}>
            <div style={{ color: 'var(--lime)', fontSize: 18, marginBottom: 16 }}>★★★★★</div>
            <p style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
            <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{t.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.size}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Faq({ openFaq, setOpenFaq }) {
  const items = [
    { q: 'Quanto sono veloci i payout?', a: 'I payout vengono processati in meno di 24 ore dalla richiesta. Pagamenti in USDT, USDC, BTC ed ETH.' },
    { q: 'C\'è un limite di tempo sulla challenge?', a: 'No. Puoi prenderti tutto il tempo necessario per raggiungere il profit target. Il tuo account non scade.' },
    { q: 'Qual è il profit split massimo?', a: 'Fino al 70% sui programmi standard, scalabile automaticamente al raggiungimento dei milestone di performance.' },
    { q: 'Quali piattaforme sono supportate?', a: 'cTrader e MetaTrader 5. Puoi scegliere la tua preferita al checkout.' },
    { q: 'Sono permessi gli EA e il copy trading?', a: 'EA permessi sui funded account. Copy trading permesso solo tra account dello stesso trader.' },
    { q: 'Ricevo un rimborso se passo?', a: 'Sì. La tariffa di valutazione viene rimborsata con il primo payout, su ogni programma.' },
  ]
  return (
    <section id="faq" className="section">
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div className="section-label">— FAQ</div>
        <h2 className="section-title">Hai ancora <span className="accent">domande?</span></h2>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        {items.map((item, i) => (
          <div key={i} className="faq-item">
            <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <span>{item.q}</span>
              <span style={{ color: 'var(--lime)', fontSize: 24, transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0)', transition: 'transform 0.2s', lineHeight: 1 }}>+</span>
            </div>
            {openFaq === i && <div className="faq-answer">{item.a}</div>}
          </div>
        ))}
      </div>
    </section>
  )
}

function CtaFinal() {
  return (
    <section className="section" style={{ textAlign: 'center', paddingTop: 60, paddingBottom: 120 }}>
      <div className="card" style={{ padding: '80px 32px', background: 'linear-gradient(135deg, rgba(180,255,57,0.06) 0%, var(--surface) 100%)', border: '1px solid rgba(180,255,57,0.2)', maxWidth: 900, margin: '0 auto' }}>
        <h2 className="section-title" style={{ marginBottom: 16 }}>
          Pronto a diventare <span className="accent">funded?</span>
        </h2>
        <p className="section-subtitle" style={{ margin: '0 auto 32px' }}>
          Inizia la tua challenge ora. Capitale fino a $200,000 ti aspetta.
        </p>
        <Link to="/register" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
          Inizia ora →
        </Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 32px 32px', background: 'var(--surface)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 40 }}>
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24, color: 'var(--lime)' }}>⚡</span>
              <span className="display" style={{ fontSize: 20, fontWeight: 700 }}>VOLTRA</span>
            </Link>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              Capitale per trader seri. Costruito diverso.
            </p>
          </div>
          <div>
            <div className="label">Prodotto</div>
            <a href="#plans" style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Programmi</a>
            <a href="#features" style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Features</a>
            <a href="#how" style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Come funziona</a>
          </div>
          <div>
            <div className="label">Account</div>
            <Link to="/login" style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Login</Link>
            <Link to="/register" style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Sign up</Link>
          </div>
          <div>
            <div className="label">Legal</div>
            <a style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Terms</a>
            <a style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Privacy</a>
            <a style={{ display: 'block', color: 'var(--muted)', fontSize: 14, padding: '6px 0' }}>Risk disclosure</a>
          </div>
        </div>

        <div style={{ paddingTop: 32, borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--muted-2)', lineHeight: 1.6 }}>
          <p style={{ marginBottom: 12 }}>
            © 2026 Voltra Solutions. Tutti i diritti riservati. I CFD e i prodotti a leva comportano rischi significativi. Trade responsibly.
          </p>
          <p>
            Le informazioni su questo sito sono fornite a scopo educativo e non costituiscono raccomandazioni di investimento. Il trading sui mercati finanziari comporta un alto livello di rischio: non investire più di quanto puoi permetterti di perdere.
          </p>
        </div>
      </div>
    </footer>
  )
}
