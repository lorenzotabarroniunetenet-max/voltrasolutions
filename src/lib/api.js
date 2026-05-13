import { STRATEGIES, ACCOUNTS, CURRENT_USER, PORTFOLIO_SUMMARY } from './mockData'

// Simulate latency
const delay = (ms = 200) => new Promise(r => setTimeout(r, ms))

export const api = {
  // POST /api/auth/login
  async login(email, password) {
    await delay(300)
    if (!email || !password) throw new Error('Email and password required')
    return { token: 'mock-jwt-token', user: CURRENT_USER }
  },

  // POST /api/auth/register
  async register(payload) {
    await delay(400)
    return { token: 'mock-jwt-token', user: { ...CURRENT_USER, email: payload.email, name: payload.name } }
  },

  // GET /api/accounts
  async getAccounts() {
    await delay()
    return ACCOUNTS
  },

  // GET /api/strategies
  async getStrategies(filters = {}) {
    await delay()
    let list = [...STRATEGIES]
    if (filters.minRoi != null) list = list.filter(s => s.roi >= filters.minRoi)
    if (filters.maxDd != null) list = list.filter(s => s.drawdown <= filters.maxDd)
    if (filters.minRating != null) list = list.filter(s => s.rating >= filters.minRating)
    if (filters.sortBy) {
      const key = filters.sortBy
      list.sort((a, b) => (b[key] ?? 0) - (a[key] ?? 0))
    }
    return list
  },

  // GET /api/strategies/:id
  async getStrategy(id) {
    await delay()
    const s = STRATEGIES.find(x => x.id === id)
    if (!s) throw new Error('Strategy not found')
    return s
  },

  // POST /api/connect-strategy
  async connectStrategy({ accountId, strategyId, lotRatio, maxDrawdown }) {
    await delay(500)
    const acc = ACCOUNTS.find(a => a.id === accountId)
    if (!acc) throw new Error('Account not found')
    acc.connectedStrategy = strategyId
    acc.status = 'ACTIVE'
    return { ok: true, accountId, strategyId, lotRatio, maxDrawdown }
  },

  async disconnectStrategy(accountId) {
    await delay(300)
    const acc = ACCOUNTS.find(a => a.id === accountId)
    if (acc) { acc.connectedStrategy = null; acc.status = 'PAUSED' }
    return { ok: true }
  },

  // GET /api/trades?strategyId=...
  async getTrades(strategyId, limit = 50) {
    await delay()
    const s = STRATEGIES.find(x => x.id === strategyId)
    return s ? s.trades.slice(0, limit) : []
  },

  // GET /api/portfolio
  async getPortfolio() {
    await delay()
    const summary = PORTFOLIO_SUMMARY()
    const allocation = ACCOUNTS
      .filter(a => a.connectedStrategy)
      .map(a => {
        const s = STRATEGIES.find(x => x.id === a.connectedStrategy)
        return { name: s?.trader || 'Unassigned', value: a.equity, accountId: a.id }
      })
    const liveTrades = ACCOUNTS
      .filter(a => a.connectedStrategy)
      .flatMap(a => {
        const s = STRATEGIES.find(x => x.id === a.connectedStrategy)
        return s ? s.trades.slice(0, 8).map(t => ({ ...t, accountId: a.id, strategy: s.trader })) : []
      })
      .sort((a, b) => new Date(b.closeTime) - new Date(a.closeTime))
      .slice(0, 30)
    return { summary, allocation, liveTrades, accounts: ACCOUNTS }
  }
}
