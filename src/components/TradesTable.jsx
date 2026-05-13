import PnL from './PnL'

export default function TradesTable({ trades, showStrategy = false, limit }) {
  const rows = limit ? trades.slice(0, limit) : trades
  const fmtTime = (iso) => {
    const d = new Date(iso)
    return d.toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-[10px] font-mono uppercase tracking-wider text-muted border-b border-border">
            <th className="text-left py-2.5 px-3">Time</th>
            <th className="text-left py-2.5 px-3">Symbol</th>
            {showStrategy && <th className="text-left py-2.5 px-3">Strategy</th>}
            <th className="text-left py-2.5 px-3">Side</th>
            <th className="text-right py-2.5 px-3">Lots</th>
            <th className="text-right py-2.5 px-3">Open</th>
            <th className="text-right py-2.5 px-3">Close</th>
            <th className="text-right py-2.5 px-3">P&L</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((t) => (
            <tr key={t.id + (t.accountId || '')} className="border-b border-border/50 hover:bg-surface2/40 transition">
              <td className="py-2.5 px-3 num text-xs text-muted">{fmtTime(t.closeTime)}</td>
              <td className="py-2.5 px-3 num font-semibold text-fg">{t.symbol}</td>
              {showStrategy && <td className="py-2.5 px-3 text-muted text-xs">{t.strategy}</td>}
              <td className="py-2.5 px-3">
                <span className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded ${
                  t.side === 'BUY' ? 'bg-brand/10 text-brand' : 'bg-danger/10 text-danger'
                }`}>{t.side}</span>
              </td>
              <td className="py-2.5 px-3 num text-right text-fg">{t.lots.toFixed(2)}</td>
              <td className="py-2.5 px-3 num text-right text-muted">{t.openPrice}</td>
              <td className="py-2.5 px-3 num text-right text-muted">{t.closePrice}</td>
              <td className="py-2.5 px-3 text-right"><PnL value={t.pnl} size="sm" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
