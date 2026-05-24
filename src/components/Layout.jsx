// v3.17 — 2026-05-22
import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { api } from '../lib/api.js'
import BootScreen from './BootScreen.jsx'
import DailySplash from './DailySplash.jsx'
import LiveTicker from './LiveTicker.jsx'
import AchievementToast from './AchievementToast.jsx'
import Crosshair from './Crosshair.jsx'
import Gunshot from './Gunshot.jsx'
import EasterConsole from './EasterConsole.jsx'
import AiBotWidget from './AiBotWidget.jsx'

// Icone SVG sobrie, militari
const Icons = {
  hq: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  briefing: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  dossier: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><circle cx="12" cy="14" r="2"/><path d="M9 18h6"/></svg>,
  requirements: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15 8.5 22 9.5 17 14.5 18.5 21.5 12 18 5.5 21.5 7 14.5 2 9.5 9 8.5z"/></svg>,
  albo: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L9.5 8L3 9l5 4.5L6.5 20L12 17l5.5 3L16 13.5L21 9l-6.5-1z"/></svg>,
  docs: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>,
  codice: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  glossary: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="9" y1="7" x2="17" y2="7"/><line x1="9" y1="11" x2="17" y2="11"/></svg>,
  calendar: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  map: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>,
  promo: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  payout: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="3"/><path d="M6 12h.01M18 12h.01"/></svg>,
  line: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>,
  more: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  admin: (s = 22) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [openAccordions, setOpenAccordions] = useState({})
  const toggleAccordion = (key) => setOpenAccordions(p => ({ ...p, [key]: !p[key] }))
  const [showBoot, setShowBoot] = useState(() => {
    try { return !sessionStorage.getItem('voltra_boot_done') } catch { return false }
  })
  const [easterOpen, setEasterOpen] = useState(false)
  const [boltClicks, setBoltClicks] = useState([])

  const onBoltClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const now = Date.now()
    const filtered = boltClicks.filter(t => now - t < 800)
    filtered.push(now)
    setBoltClicks(filtered)
    if (filtered.length >= 3) {
      setBoltClicks([])
      setEasterOpen(true)
    }
  }

  // Konami code listener → /sala-fondatori
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
    let idx = 0
    const onKey = (e) => {
      if (e.key === seq[idx]) {
        idx++
        if (idx === seq.length) { nav('/sala-fondatori'); idx = 0 }
      } else { idx = 0 }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [nav])

  const finishBoot = () => {
    try { sessionStorage.setItem('voltra_boot_done', '1') } catch {}
    setShowBoot(false)
  }

  const reloadNotifications = () => {
    if (!user) return
    api.notifications().then(setNotifications).catch(() => {})
    api.notificationsUnreadCount().then(d => setUnreadCount(d.count || 0)).catch(() => {})
  }

  useEffect(() => {
    reloadNotifications()
    const t = setInterval(reloadNotifications, 60000)
    return () => clearInterval(t)
  }, [user?.id])

  const openBell = () => {
    setBellOpen(!bellOpen)
    if (!bellOpen && unreadCount > 0) {
      api.notificationsReadAll().then(() => {
        setUnreadCount(0)
        setNotifications(prev => prev.map(n => ({ ...n, readAt: n.readAt || new Date().toISOString() })))
      }).catch(() => {})
    }
  }

  const traderLinks = [
    { section: 'Operativo' },
    { to: '/dashboard',       label: 'Quartier Generale',    icon: 'hq' },
    { to: '/briefing',        label: 'Sala Briefing',         icon: 'briefing' },
    { to: '/calendario',      label: 'Calendario',            icon: 'calendar' },
    { section: 'Missioni' },
    { to: '/buy',             label: 'Promozione di Grado',   icon: 'promo' },
    { to: '/payout',          label: 'Rimborso Missione',     icon: 'payout' },
    { section: 'Riferimento' },
    { to: '/requisiti',       label: 'Requisiti',             icon: 'requirements' },
    { to: '/mappa',           label: 'Mappa Operazioni',      icon: 'map' },
    { to: '/albo',            label: 'Albo d\'Onore',         icon: 'albo' },
    { to: '/documenti',       label: 'Documenti',             icon: 'docs' },
    { to: '/codice-condotta', label: 'Codice di Condotta',    icon: 'codice' },
    { to: '/codice-operativo',label: 'Codice Operativo',      icon: 'glossary' },
    { section: 'Account' },
    { to: '/personale',       label: 'Personale',             icon: 'more' },
    { to: '/contact',         label: 'Linea Diretta HQ',      icon: 'line' },
    { to: '/guida',           label: 'Guida Operativa',       icon: 'briefing' },
  ]
  const adminLinks = [{ to: '/admin', label: 'Stato Maggiore', icon: 'admin' }]
  const links = user?.role === 'ADMIN' ? [...traderLinks, ...adminLinks] : traderLinks

  // Bottom nav mobile: 4 voci
  const bottomNav = [
    { to: '/dashboard', label: 'Quartier', icon: 'hq' },
    { to: '/app',       label: 'App',      icon: null },
    { to: '/buy',       label: 'Missione', icon: 'promo' },
    { to: '/personale', label: 'Altro',    icon: 'more' },
  ]

  const handleLogout = () => { logout(); nav('/login') }

  useEffect(() => { setDrawerOpen(false); setSheetOpen(false) }, [loc.pathname])
  useEffect(() => {
    document.body.style.overflow = (drawerOpen || sheetOpen) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, sheetOpen])

  // Accordion section groups per membro
  const accGroups = {
    Missioni: [
      { to: '/buy',   label: 'Promozione di Grado', icon: 'promo' },
      { to: '/payout',label: 'Rimborso Missione',   icon: 'payout' },
    ],
    Riferimento: [
      { to: '/fascicolo',      label: 'Fascicolo',          icon: 'dossier' },
      { to: '/requisiti',      label: 'Requisiti',           icon: 'requirements' },
      { to: '/mappa',          label: 'Mappa Operazioni',    icon: 'map' },
      { to: '/albo',           label: 'Albo d\'Onore',       icon: 'albo' },
      { to: '/documenti',      label: 'Documenti',           icon: 'docs' },
      { to: '/codice-condotta',label: 'Codice di Condotta',  icon: 'codice' },
      { to: '/codice-operativo',label: 'Codice Operativo',   icon: 'glossary' },
    ],
    Account: [
      { to: '/personale', label: 'Personale',        icon: 'more' },
      { to: '/contact',   label: 'Linea Diretta HQ', icon: 'line' },
      { to: '/guida',     label: 'Guida Operativa',  icon: 'briefing' },
    ],
  }

  const AccItem = ({ l, indent = false, onClick }) => (
    <Link
      to={l.to}
      onClick={onClick}
      className={`sidebar-link ${loc.pathname === l.to ? 'active' : ''}`}
      style={indent ? { paddingLeft: 28, fontSize: 12 } : {}}
    >
      {Icons[l.icon](16)}<span>{l.label}</span>
    </Link>
  )

  const AccGroup = ({ name, links, indent = false, onClick }) => {
    const isOpen = openAccordions[name]
    const hasActive = links.some(l => loc.pathname === l.to)
    const ChevronIcon = () => (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
        style={{ transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', opacity: .4, flexShrink: 0 }}>
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    )
    return (
      <>
        <div
          onClick={() => toggleAccordion(name)}
          className={`sidebar-link ${hasActive ? 'active' : ''}`}
          style={{ cursor: 'pointer', justifyContent: 'space-between', opacity: isOpen ? 1 : undefined }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {name === 'Missioni' && Icons.promo(16)}
            {name === 'Riferimento' && Icons.docs(16)}
            {name === 'Account' && Icons.more(16)}
            {name}
          </span>
          <ChevronIcon />
        </div>
        <div style={{ overflow: 'hidden', maxHeight: isOpen ? links.length * 42 + 'px' : 0, transition: 'max-height .22s cubic-bezier(.4,0,.2,1)' }}>
          {links.map(l => <AccItem key={l.to} l={l} indent onClick={onClick} />)}
        </div>
      </>
    )
  }

  return (
    <>
      {showBoot && <BootScreen onComplete={finishBoot} />}
      {!showBoot && <DailySplash />}
      <AchievementToast />
      <LiveTicker />
      <Crosshair />
      <Gunshot />
      <EasterConsole open={easterOpen} onClose={() => setEasterOpen(false)} />
      <AiBotWidget />
      <div className="app-shell" style={{ paddingBottom: 32 }}>
      {/* SIDEBAR DESKTOP */}
      <aside className="sidebar sidebar-desktop">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '0 12px', textDecoration: 'none', color: 'inherit' }}>
          <span onClick={onBoltClick} title="Comunicazione cifrata" className={unreadCount > 0 ? 'voltra-bolt-pulse' : ''} style={{ fontSize: 26, color: 'var(--lime)', cursor: 'pointer', userSelect: 'none' }}>⚡</span>
          <div>
            <span className="display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.02em' }}>VOLTRA</span>
            {user?.role === 'ADMIN' && <div style={{ fontSize: 9, color: 'rgba(180,255,57,.5)', fontFamily: 'JetBrains Mono, monospace', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 1 }}>Comando</div>}
          </div>
        </Link>

        {user?.role === 'ADMIN' ? (
          /* ── SIDEBAR ADMIN ── */
          <nav style={{ flex: 1, overflowY: 'auto' }}>
            {[
              { section: 'Operazioni' },
              { to: '/admin', label: 'Quadro Generale', icon: 'hq', tab: 'overview' },
              { to: '/admin', label: 'Promozioni', icon: 'promo', tab: 'orders' },
              { to: '/admin', label: 'Rimborsi', icon: 'payout', tab: 'payouts' },
              { to: '/admin', label: 'Missioni', icon: 'codice', tab: 'accounts' },
              { to: '/admin', label: 'Supporto', icon: 'line', tab: 'tickets' },
              { section: 'Membri' },
              { to: '/admin', label: 'Membri', icon: 'more', tab: 'users' },
              { to: '/admin', label: 'Abbonamenti', icon: 'payout', tab: 'subscriptions' },
              { section: 'Contenuti' },
              { to: '/admin', label: 'Ordini del Giorno', icon: 'briefing', tab: 'briefings' },
              { to: '/admin', label: 'Documenti', icon: 'docs', tab: 'documents' },
              { to: '/admin', label: 'Coupon', icon: 'promo', tab: 'coupons' },
              { to: '/admin', label: 'Programmi', icon: 'requirements', tab: 'programs' },
              { section: 'Analytics' },
              { to: '/admin', label: 'Analytics', icon: 'hq', tab: 'analytics' },
              { to: '/admin', label: 'Snapshots', icon: 'dossier', tab: 'snapshots' },
              { section: 'Sistema' },
              { to: '/admin', label: 'Impostazioni', icon: 'admin', tab: 'settings' },
              { to: '/admin', label: 'Audit Log', icon: 'dossier', tab: 'audit' },
            ].map((item, i) => {
              if (item.section) return (
                <div key={i} style={{ padding: '10px 14px 4px', fontSize: 8, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.14em', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace' }}>{item.section}</div>
              )
              return (
                <Link key={item.tab} to={`/admin?tab=${item.tab}`}
                  onClick={() => window.__voltraSetAdminTab?.(item.tab)}
                  className={`sidebar-link ${loc.pathname === '/admin' && new URLSearchParams(loc.search).get('tab') === item.tab ? 'active' : loc.pathname === '/admin' && !loc.search && item.tab === 'overview' ? 'active' : ''}`}>
                  {Icons[item.icon]?.(18)}<span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        ) : (
          /* ── SIDEBAR MEMBRO ── */
          <>
            <Link to="/app" style={{ display:'flex', alignItems:'center', gap:7, padding:'7px 12px', marginBottom:8, background:'rgba(180,255,57,.04)', border:'1px solid rgba(180,255,57,.15)', borderRadius:8, textDecoration:'none', color:'var(--lime)', fontSize:11, fontWeight:700 }}>
              <svg width="12" height="12" viewBox="0 0 100 100"><polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39"/></svg>
              App mobile
            </Link>
            <nav style={{ flex: 1 }}>
              {/* Diretti */}
              <Link to="/dashboard" id="tour-hq" className={`sidebar-link ${loc.pathname === '/dashboard' ? 'active' : ''}`}>{Icons.hq(18)}<span>Quartier Generale</span></Link>
              <Link to="/briefing" id="tour-briefing" className={`sidebar-link ${loc.pathname === '/briefing' ? 'active' : ''}`}>{Icons.briefing(18)}<span>Sala Briefing</span></Link>
              <Link to="/calendario" className={`sidebar-link ${loc.pathname === '/calendario' ? 'active' : ''}`}>{Icons.calendar(18)}<span>Calendario</span></Link>
              {/* Accordion */}
              {Object.entries(accGroups).map(([name, links]) => (
                <AccGroup key={name} name={name} links={links} />
              ))}
            </nav>
          </>
        )}

        <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
          <div style={{ padding: '0 12px 12px', fontSize: 13 }}>
            <div style={{ color: 'var(--text)', fontWeight: 500 }}>{user?.name}</div>
            <div style={{ color: 'var(--muted)', fontSize: 11, wordBreak: 'break-all' }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', fontSize: 13, padding: '10px' }}>Smobilitazione</button>
        </div>
      </aside>

      {/* MOBILE TOPBAR */}
      <div className="mobile-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <span onClick={onBoltClick} className={unreadCount > 0 ? 'voltra-bolt-pulse' : ''} style={{ fontSize: 22, color: 'var(--lime)', flexShrink: 0, cursor: 'pointer', userSelect: 'none' }}>⚡</span>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="display" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', lineHeight: 1 }}>VOLTRA</div>
            {user?.name && (
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.role === 'ADMIN' ? 'Comando' : (user?.rank || 'Caporale')} · {user?.name}
              </div>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={openBell} style={{ background: 'transparent', border: '1px solid var(--border-bright)', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', cursor: 'pointer', position: 'relative' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            {unreadCount > 0 && <span style={{ position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: '50%', background: 'var(--lime)' }} />}
          </button>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" style={{ background: 'transparent', border: '1px solid var(--border-bright)', borderRadius: 8, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', textDecoration: 'none' }}>
              {Icons.admin(18)}
            </Link>
          )}
        </div>
      </div>

      {/* BELL DROPDOWN */}
      {bellOpen && (
        <>
          <div onClick={() => setBellOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 199 }} />
          <div className="bell-dropdown" style={{
            position: 'fixed',
            top: 64, right: 12,
            width: 340, maxWidth: 'calc(100vw - 24px)',
            maxHeight: '70vh',
            overflow: 'auto',
            background: 'var(--surface)',
            border: '1px solid var(--border-bright)',
            borderRadius: 14,
            zIndex: 200,
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', fontSize: 13, fontWeight: 600 }}>
              Comunicazioni di Servizio
            </div>
            {notifications.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>
                Nessuna notifica.
              </div>
            ) : notifications.map(n => (
              <Link key={n.id} to={n.url || '#'} onClick={() => setBellOpen(false)} style={{
                display: 'block',
                padding: '12px 18px',
                borderBottom: '1px solid var(--border)',
                textDecoration: 'none',
                color: 'inherit',
                background: !n.readAt ? 'rgba(180,255,57,0.03)' : 'transparent',
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 3 }}>{n.title}</div>
                {n.body && <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{n.body}</div>}
                <div style={{ fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>
                  {new Date(n.createdAt).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' })}
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* MAIN */}
      <main className="main">
        {(() => {
          // Pagine "root" che non mostrano back: bottom nav + dashboard
          const rootPages = ['/dashboard', '/briefing', '/buy', '/fascicolo', '/personale', '/']
          const alwaysBack = ['/contact', '/guida', '/payout', '/albo', '/mappa', '/documenti', '/requisiti', '/calendario']
          const showBack = alwaysBack.includes(loc.pathname) || (!rootPages.includes(loc.pathname) && loc.pathname !== '')
          if (!showBack) return null
          return (
            <button
              onClick={() => window.history.length > 1 ? nav(-1) : nav('/dashboard')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'transparent',
                border: '1px solid var(--border-bright)',
                color: 'var(--muted)',
                padding: '6px 12px',
                borderRadius: 8,
                cursor: 'pointer',
                fontSize: 12,
                fontFamily: 'inherit',
                marginBottom: 16,
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--lime)'; e.currentTarget.style.color = 'var(--lime)' }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-bright)'; e.currentTarget.style.color = 'var(--muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              <span>Indietro</span>
            </button>
          )
        })()}
        {children}
      </main>

      {/* BOTTOM NAV MOBILE */}
      <nav className="bottom-nav">
        <Link to="/dashboard" className={`bottom-nav-item ${loc.pathname === '/dashboard' ? 'active' : ''}`}>
          {Icons.hq(20)}<span>Home</span>
        </Link>
        <Link to="/briefing" className={`bottom-nav-item ${loc.pathname === '/briefing' ? 'active' : ''}`}>
          {Icons.briefing(20)}<span>Briefing</span>
        </Link>
        <Link to="/buy" className={`bottom-nav-item ${loc.pathname === '/buy' ? 'active' : ''}`}>
          {Icons.promo(20)}<span>Missione</span>
        </Link>
        <button onClick={() => setSheetOpen(true)} className={`bottom-nav-item ${sheetOpen ? 'active' : ''}`} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}>
          {Icons.more(20)}<span>Altro</span>
        </button>
      </nav>

      {/* BOTTOM SHEET MOBILE */}
      {sheetOpen && (
        <>
          <div onClick={() => setSheetOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.6)', zIndex: 499, backdropFilter: 'blur(4px)' }} />
          <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '18px 18px 0 0', zIndex: 500, padding: '10px 0 40px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ width: 36, height: 3, background: 'rgba(255,255,255,.12)', borderRadius: 2, margin: '0 auto 16px' }} />
            <div style={{ padding: '0 10px' }}>
              {/* Azioni rapide in cima */}
              {[
                { to: '/buy',      label: 'Promozione di Grado', icon: 'promo',   desc: 'Scala al prossimo livello' },
                { to: '/payout',   label: 'Rimborso Missione',   icon: 'payout',  desc: 'Richiedi liquidazione' },
              ].map(l => (
                <Link key={l.to} to={l.to} onClick={() => setSheetOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px', borderRadius: 10, textDecoration: 'none', color: 'var(--lime)', marginBottom: 2 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(180,255,57,.08)', border: '1px solid rgba(180,255,57,.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {Icons[l.icon](16)}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{l.label}</div>
                    <div style={{ fontSize: 10, color: 'rgba(180,255,57,.4)', marginTop: 1 }}>{l.desc}</div>
                  </div>
                </Link>
              ))}
              <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
              {/* Accordion Riferimento */}
              {Object.entries(accGroups).filter(([n]) => n !== 'Missioni').map(([name, links]) => (
                <AccGroup key={name} name={name} links={links} onClick={() => setSheetOpen(false)} />
              ))}
            </div>
          </div>
        </>
      )}

      <AppDownloadBtn />
      </div>
    </>
  )
}

function AppDownloadBtn() {
  const [show, setShow] = useState(true)
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    // Nascondi se già installata (standalone)
    if (window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone) {
      setShow(false); return
    }
    // Nascondi se già dismessa questa sessione
    if (sessionStorage.getItem('app_btn_dismissed')) { setShow(false); return }

    const onPrompt = (e) => { e.preventDefault(); setDeferredPrompt(e) }
    window.addEventListener('beforeinstallprompt', onPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onPrompt)
  }, [])

  const handleClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') { setShow(false); return }
    }
    // iOS o nessun prompt — vai alla pagina app
    window.location.href = '/app'
  }

  const dismiss = (e) => {
    e.stopPropagation()
    sessionStorage.setItem('app_btn_dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed',
      bottom: 'calc(64px + env(safe-area-inset-bottom, 0px) + 10px)',
      right: 14,
      zIndex: 300,
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      background: '#050505',
      border: '1px solid rgba(180,255,57,0.3)',
      borderRadius: 999,
      padding: '7px 10px 7px 12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.7), 0 0 0 1px rgba(180,255,57,0.08)',
      cursor: 'pointer',
      animation: 'fadeSlideUp .35s ease',
    }} onClick={handleClick}>
      <svg width="14" height="14" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
        <polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39"/>
      </svg>
      <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--lime)', whiteSpace: 'nowrap', letterSpacing: '.02em' }}>Installa app</span>
      <button onClick={dismiss} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,.3)', cursor: 'pointer', fontSize: 13, padding: '0 2px', lineHeight: 1 }}>✕</button>
      <style>{`@keyframes fadeSlideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  )
}
