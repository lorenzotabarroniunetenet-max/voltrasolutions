import { Link } from 'react-router-dom'
import PnL from './PnL'

export default function AccountCard({ account, strategy, onConnect, onDisconnect }) {
  const isActive = account.status === 'ACTIVE'
  return (
    <div className="card p-5 hover:border-brand/30 transition group">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted">{account.id}</span>
            <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
              isActive ? 'bg-brand/10 text-brand' : 'bg-surface2 text-muted'
            }`}>
              {account.status}
            </span>
          </div>
          <div className="text-lg font-semibold text-fg">{account.label}</div>
          <div className="text-xs text-muted mt-0.5">
            Leverage {account.leverage}X · {account.server}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-muted uppercase tracking-wider">Equity</div>
          <div className="num text-xl font-semibold text-fg">
            ${account.equity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 py-3 border-y border-border">
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Balance</div>
          <div className="num text-sm text-fg">${account.balance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</div>
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">P&L</div>
          <PnL value={account.pnl} pct={account.pnlPct} size="sm" />
        </div>
        <div>
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1">Free Margin</div>
          <div className="num text-sm text-fg">${Math.round(account.freeMargin).toLocaleString('en-US')}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="min-w-0">
          <div className="text-[10px] font-mono uppercase tracking-wider text-muted mb-0.5">Connected strategy</div>
          {strategy ? (
            <Link to={`/strategies/${strategy.id}`} className="text-sm text-brand hover:underline truncate block">
              {strategy.trader}
            </Link>
          ) : (
            <div className="text-sm text-muted">None</div>
          )}
        </div>
        {strategy ? (
          <button
            onClick={() => onDisconnect?.(account.id)}
            className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted hover:text-danger hover:border-danger/40 transition"
          >
            Disconnect
          </button>
        ) : (
          <Link
            to="/strategies"
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand text-bg hover:bg-brand-dim transition"
          >
            Connect Strategy
          </Link>
        )}
      </div>
    </div>
  )
}
