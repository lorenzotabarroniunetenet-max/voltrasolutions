import { Link, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const loc = useLocation()
  const isLanding = loc.pathname === '/'

  return (
    <nav className={`sticky top-0 z-40 backdrop-blur ${isLanding ? 'bg-bg/70' : 'bg-bg/90'} border-b border-border`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/"><Logo /></Link>

        {isLanding ? (
          <div className="hidden md:flex items-center gap-8 text-sm text-muted">
            <a href="#features" className="hover:text-fg transition">Features</a>
            <a href="#how" className="hover:text-fg transition">How it works</a>
            <a href="#team" className="hover:text-fg transition">Team</a>
            <a href="#pricing" className="hover:text-fg transition">Pricing</a>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6 text-sm">
            <NavLink to="/dashboard" label="Dashboard" active={loc.pathname.startsWith('/dashboard')} />
            <NavLink to="/strategies" label="Strategies" active={loc.pathname.startsWith('/strategies')} />
            <NavLink to="/portfolio" label="Portfolio" active={loc.pathname.startsWith('/portfolio')} />
          </div>
        )}

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="w-8 h-8 rounded-full bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-semibold text-xs">
                  {user.name?.split(' ').map(s => s[0]).join('')}
                </div>
                <span className="text-fg">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand/10 text-brand font-mono uppercase tracking-wider">{user.tier}</span>
              </div>
              <button onClick={logout} className="text-sm text-muted hover:text-fg transition">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-muted hover:text-fg">Login</Link>
              <Link to="/register" className="text-sm font-semibold bg-brand text-bg px-4 py-2 rounded-lg hover:bg-brand-dim transition">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, label, active }) {
  return (
    <Link to={to} className={`relative py-1 transition ${active ? 'text-fg' : 'text-muted hover:text-fg'}`}>
      {label}
      {active && <span className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-brand rounded-full" />}
    </Link>
  )
}
