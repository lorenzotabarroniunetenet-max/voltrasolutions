import { ACCOUNTS } from './mockData'

// Simulated WebSocket: emits P&L deltas every 2s
export function subscribeLivePnL(callback) {
  const interval = setInterval(() => {
    ACCOUNTS.forEach(a => {
      if (a.status !== 'ACTIVE') return
      const delta = (Math.random() - 0.48) * 25
      a.equity = Math.round((a.equity + delta) * 100) / 100
      a.pnl = Math.round((a.equity - (a.balance - a.pnl)) * 100) / 100
      a.pnlPct = Math.round((a.pnl / (a.balance - a.pnl)) * 10000) / 100
    })
    callback([...ACCOUNTS])
  }, 2000)
  return () => clearInterval(interval)
}
