import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const traderLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/payout', label: 'Payout', icon: '💸' },
    { to: '/buy', label: 'Acquista', icon: '🛒' },
    { to: '/contact', label: 'Supporto', icon: '💬' },
  ]
  const adminLinks = [{ to: '/admin', label: 'Admin', icon: '⚙️' }]
  const links = user?.role === 'ADMIN' ? [...traderLinks, ...adminLinks] : traderLinks
  const handleLogout = () => { logout(); nav('/login') }

  return (
    <div className="app-shell">
      <aside className="sidebar">
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
            <div style={{ color: 'var(--muted)', fontSize: 11 }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="btn-secondary" style={{ width: '100%', fontSize: 13, padding: '10px' }}>Logout</button>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  )
}
