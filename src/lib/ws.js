import { api } from './api'

// Polls accounts every 5s. Replace with real WebSocket when backend supports it.
export function subscribeLivePnL(callback) {
  let cancelled = false
  async function tick() {
    if (cancelled) return
    try { const accs = await api.getAccounts(); callback(accs) } catch {}
    if (!cancelled) setTimeout(tick, 5000)
  }
  tick()
  return () => { cancelled = true }
}
