import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()

  const isActive = (p) => loc.pathname.startsWith(p)
  const link = (to, label) => (
    <Link to={to} className={`text-sm font-semibold px-3 py-2 rounded-lg transition ${isActive(to) ? 'text-brand bg-brand/10' : 'text-muted hover:text-fg'}`}>{label}</Link>
  )

  function handleLogout() { logout(); nav('/login') }

  return (
    <nav className="border-b border-border bg-bg sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link to="/"><Logo /></Link>
        {user ? (
          <div className="flex items-center gap-1">
            {link('/dashboard', 'Dashboard')}
            {link('/accounts', 'Accounts')}
            {link('/rules', 'Rules')}
            {link('/trades', 'Trades')}
            {isAdmin && link('/admin', 'Admin')}
            <button onClick={handleLogout} className="ml-2 text-sm font-semibold text-muted hover:text-fg px-3 py-2">Logout</button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm font-semibold text-muted hover:text-fg px-3 py-2">Login</Link>
            <Link to="/register" className="btn-primary text-sm">Sign up</Link>
          </div>
        )}
      </div>
    </nav>
  )
}
