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
  ]
  const adminLinks = [
    { to: '/admin', label: 'Admin', icon: '⚙️' },
  ]
  const links = user?.role === 'ADMIN' ? [...traderLinks, ...adminLinks] : traderLinks

  const handleLogout = () => {
    logout()
    nav('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240,
        background: '#0f0f0f',
        borderRight: '1px solid var(--voltra-border)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, padding: '0 12px' }}>
          <div style={{ fontSize: 28, color: 'var(--voltra-lime)' }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.05em' }}>VOLTRA</div>
        </div>

        <nav style={{ flex: 1 }}>
          {links.map(l => {
            const active = loc.pathname === l.to
            return (
              <Link key={l.to} to={l.to} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                borderRadius: 8,
                color: active ? 'var(--voltra-lime)' : 'var(--voltra-text)',
                background: active ? 'rgba(180, 255, 57, 0.08)' : 'transparent',
                textDecoration: 'none',
                marginBottom: 4,
                fontSize: 14,
                fontWeight: active ? 600 : 400,
                transition: 'all 0.15s',
              }}>
                <span>{l.icon}</span>
                <span>{l.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ paddingTop: 16, borderTop: '1px solid var(--voltra-border)' }}>
          <div style={{ padding: '0 12px 12px', fontSize: 13 }}>
            <div style={{ color: 'var(--voltra-text)', fontWeight: 500 }}>{user?.name}</div>
            <div style={{ color: 'var(--voltra-muted)', fontSize: 11 }}>{user?.email}</div>
          </div>
          <button onClick={handleLogout} className="voltra-btn-secondary" style={{ width: '100%', fontSize: 13 }}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
