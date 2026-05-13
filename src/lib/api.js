// Real backend API client. Set VITE_API_URL in .env or as build env var.
const API = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function getToken() { return localStorage.getItem('voltra_token') }
function setToken(t) { localStorage.setItem('voltra_token', t) }
function clearToken() { localStorage.removeItem('voltra_token') }

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: { email, password } })
      .then(r => { setToken(r.token); return r }),
  register: (payload) =>
    request('/api/auth/register', { method: 'POST', body: payload })
      .then(r => { setToken(r.token); return r }),
  logout: () => clearToken(),

  // Masters
  getStrategies: (filters = {}) => {
    const map = { sortBy: filters.sortBy, minRoi: filters.minRoi, maxDd: filters.maxDd, minRating: filters.minRating }
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(map).filter(([_, v]) => v != null && v !== 0))).toString()
    return request(`/api/masters${qs ? '?' + qs : ''}`).then(adaptMasters)
  },
  getStrategy: (id) => request(`/api/masters/${id}`).then(adaptMaster),

  // MT5 Accounts
  getAccounts: () => request('/api/mt5/accounts', { auth: true }).then(adaptAccounts),
  connectAccount: (payload) => request('/api/mt5/connect', { method: 'POST', auth: true, body: payload }),
  removeAccount: (id) => request(`/api/mt5/accounts/${id}`, { method: 'DELETE', auth: true }),

  // Copy relations
  getCopyRelations: () => request('/api/copy', { auth: true }),
  connectStrategy: ({ accountId, strategyId, lotRatio, maxDrawdown }) =>
    request('/api/copy/start', {
      method: 'POST', auth: true,
      body: { mt5AccountId: accountId, masterId: strategyId, lotRatio, maxDrawdown }
    }),
  disconnectStrategy: (relationId) =>
    request('/api/copy/stop', { method: 'POST', auth: true, body: { relationId } }),

  // Trades
  getTrades: (strategyId, limit = 50) =>
    request(`/api/trades?masterId=${strategyId}&limit=${limit}`),
  getMyTrades: () => request('/api/trades/mine', { auth: true }),

  // Portfolio composite (built client-side from accounts + relations + trades)
  getPortfolio: async () => {
    const [accounts, relations, myTrades] = await Promise.all([
      api.getAccounts(),
      api.getCopyRelations(),
      api.getMyTrades()
    ])
    const totalBalance = accounts.reduce((s, a) => s + a.balance, 0)
    const totalEquity = accounts.reduce((s, a) => s + a.equity, 0)
    const totalPnl = totalEquity - totalBalance
    const active = relations.filter(r => r.status === 'ACTIVE').length
    const allocation = relations
      .filter(r => r.status === 'ACTIVE')
      .map(r => ({ name: r.master?.name || 'Unknown', value: r.mt5Account?.equity || 0, accountId: r.mt5AccountId }))
    return {
      summary: {
        totalBalance: Math.round(totalBalance * 100) / 100,
        totalEquity: Math.round(totalEquity * 100) / 100,
        totalPnl: Math.round(totalPnl * 100) / 100,
        totalPnlPct: totalBalance ? Math.round((totalPnl / totalBalance) * 10000) / 100 : 0,
        activeStrategies: active,
        accountsCount: accounts.length
      },
      allocation,
      liveTrades: myTrades.map(t => ({
        ...t,
        strategy: t.masterName,
        closeTime: t.closedAt,
        openTime: t.openedAt
      })),
      accounts: accounts.map(a => ({
        ...a,
        pnl: (a.equity - a.balance),
        pnlPct: a.balance ? ((a.equity - a.balance) / a.balance) * 100 : 0
      }))
    }
  },

  // Admin
  adminGetMasters: () => request('/api/admin/masters', { auth: true }),
  adminCreateMaster: (data) => request('/api/admin/masters', { method: 'POST', auth: true, body: data }),
  adminUpdateMaster: (id, data) => request(`/api/admin/masters/${id}`, { method: 'PATCH', auth: true, body: data }),
  adminDeleteMaster: (id) => request(`/api/admin/masters/${id}`, { method: 'DELETE', auth: true }),
  adminGetUsers: () => request('/api/admin/users', { auth: true }),
  adminGetStats: () => request('/api/admin/stats', { auth: true })
}

// ---------- Adapters: backend shape → frontend expected shape ----------

function adaptMaster(m) {
  if (!m) return null
  const equityCurve = (m.equityPoints || []).map(p => ({
    date: new Date(p.date).toISOString().split('T')[0],
    equity: p.equity
  }))
  const trades = (m.trades || []).map(t => ({
    id: t.id,
    symbol: t.symbol,
    side: t.side,
    lots: t.lots,
    openPrice: t.openPrice,
    closePrice: t.closePrice || t.openPrice,
    pnl: t.pnl,
    openTime: t.openedAt,
    closeTime: t.closedAt || t.openedAt,
    status: t.status
  }))
  return {
    id: m.id,
    trader: m.name,
    country: m.country || '',
    style: m.style || '',
    experience: m.experience || 0,
    bio: m.bio || '',
    avatar: (m.name || '').split(' ').map(s => s[0]).join('').slice(0, 2),
    roi: m.roi12m,
    drawdown: m.drawdown,
    winRate: m.winRate,
    sharpe: m.sharpe,
    profitFactor: m.profitFactor,
    followers: m.followersCount,
    trades30d: trades.length,
    rating: m.rating,
    aum: m.aum,
    equityCurve: equityCurve.length ? equityCurve : [{ date: new Date().toISOString().split('T')[0], equity: 10000 }],
    trades
  }
}

function adaptMasters(list) { return (list || []).map(adaptMaster) }

function adaptAccounts(list) {
  return (list || []).map(a => ({
    id: a.id,
    label: a.label,
    type: 'MT5',
    leverage: a.leverage,
    balance: a.balance,
    equity: a.equity,
    pnl: a.equity - a.balance,
    pnlPct: a.balance ? ((a.equity - a.balance) / a.balance) * 100 : 0,
    margin: 0,
    freeMargin: a.equity,
    status: a.active ? 'ACTIVE' : 'PAUSED',
    server: a.server,
    connectedStrategy: null,
    openedAt: a.createdAt
  }))
}
