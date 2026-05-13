import { NavLink } from 'react-router-dom'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: IconGrid },
  { to: '/strategies', label: 'Strategies', icon: IconChart },
  { to: '/portfolio', label: 'Portfolio', icon: IconWallet },
  { to: '/dashboard', label: 'Accounts', icon: IconAccount },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-surface/40 min-h-[calc(100vh-64px)]">
      <div className="p-4">
        <div className="text-[10px] font-mono tracking-widest text-muted uppercase mb-3 px-3">Workspace</div>
        <nav className="space-y-1">
          {items.map((item, i) => (
            <NavLink
              key={i}
              to={item.to}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-brand/10 text-brand border border-brand/20'
                    : 'text-muted hover:text-fg hover:bg-surface2 border border-transparent'
                }`
              }
            >
              <item.icon />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-4">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-brand live-dot" />
            <span className="text-xs font-mono text-muted">LIVE FEED</span>
          </div>
          <div className="text-xs text-muted mb-3">MT5 bridge connected — copying enabled.</div>
          <div className="flex justify-between text-xs">
            <span className="text-muted">Latency</span>
            <span className="num text-fg">12ms</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted">Server</span>
            <span className="num text-fg">EU-W1</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function IconGrid() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
}
function IconChart() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3v18h18"/><path d="M7 14l4-4 4 4 6-7"/></svg>
}
function IconWallet() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M16 12h.01"/><path d="M2 10h20"/></svg>
}
function IconAccount() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
}
