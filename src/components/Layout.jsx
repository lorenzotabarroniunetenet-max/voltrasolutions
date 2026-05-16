import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const traderLinks = [
    { to: '/dashboard', label: 'Quartier Generale', icon: '📊' },
    { to: '/payout', label: 'Rimborso Missione', icon: '💸' },
    { to: '/buy', label: 'Promozione di Grado', icon: '🎖' },
    { to: '/contact', label: 'Linea Diretta HQ', icon: '💬' },
  ]
  const adminLinks = [{ to: '/admin', label: 'Stato Maggiore', icon: '⚙️' }]
  const links = user?.role === 'ADMIN' ? [...traderLinks, ...adminLinks] : traderLinks
  const handleLogout = () => { logout(); nav('/login') }

  // Chiudi drawer quando cambia route
  useEffect(() => { setMenuOpen(false) }, [loc.pathname])

  // Blocca scroll body quando drawer aperto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const SidebarContent = () => (
    <>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 12px', textDecoration: 'none', color: 'inherit' }}>
        <span style={{ fontSize: 26, color: 'var(--lime)' }}>⚡</span>
        <span className="display" style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.02em' }}>VOLTRA</span>
      </Link>
      <nav style={{ flex: 1 }}>
        {links.map(l => (
          <Link key={l.to} to={l.to} className={`sidebar-link ${loc.pathname === l.to ? 'active' : ''}`}>
            <span>{l.icon}</span><span>{l.label}</span>
          </Link>
        ))}
      </nav>
      <div style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
        <div style={{ padding: '0 12px 12px', fontSize: 13 }}>
          <div style={{ color: 'var(--text)', fontWeight: 500 }}>{user?.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: 11, wordBreak: 'break-all' }}>{user?.email}</div>
        </div>
        <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', fontSize: 13, padding: '10px' }}>Smobilitazione</button>
      </div>
    </>
  )

  return (
    <div className="app-shell">
      {/* Sidebar desktop */}
      <aside className="sidebar sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="mobile-topbar">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: 'inherit' }}>
          <span style={{ fontSize: 22, color: 'var(--lime)' }}>⚡</span>
          <span className="display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>VOLTRA</span>
        </Link>
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Apri menu"
          style={{ background: 'transparent', border: '1px solid var(--border-bright)', borderRadius: 8, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer overlay */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', zIndex: 199, animation: 'fadeIn 0.2s ease' }}
          />
          <aside className="sidebar sidebar-drawer">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Chiudi menu"
              style={{ position: 'absolute', top: 16, right: 16, background: 'transparent', border: '1px solid var(--border-bright)', borderRadius: 8, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      <main className="main">{children}</main>
    </div>
  )
}
