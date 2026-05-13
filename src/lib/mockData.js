// Deterministic seeded RNG so refresh shows same data
let seed = 42
const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280 }
const between = (a, b) => a + rand() * (b - a)
const intBetween = (a, b) => Math.floor(between(a, b + 1))
const pick = (arr) => arr[Math.floor(rand() * arr.length)]

const TRADERS = [
  { name: 'Marcus Hale', country: 'UK', style: 'Scalping EUR/USD', exp: 8 },
  { name: 'Yuki Tanaka', country: 'JP', style: 'Asian session breakout', exp: 12 },
  { name: 'Sofia Romano', country: 'IT', style: 'Trend following majors', exp: 6 },
  { name: 'Dimitri Volkov', country: 'RU', style: 'High-frequency arbitrage', exp: 10 },
  { name: 'Aisha Khan', country: 'AE', style: 'Gold & oil swing', exp: 7 },
  { name: 'Lucas Müller', country: 'DE', style: 'DAX index momentum', exp: 9 },
  { name: 'Elena Vasquez', country: 'ES', style: 'News-based fundamental', exp: 5 },
  { name: 'Hiroshi Sato', country: 'JP', style: 'Mean reversion JPY pairs', exp: 14 },
  { name: 'Connor Walsh', country: 'IE', style: 'London open breakout', exp: 6 },
  { name: 'Priya Sharma', country: 'IN', style: 'Crypto-FX correlation', exp: 4 },
  { name: 'Olivia Bennett', country: 'US', style: 'Algo grid systems', exp: 11 },
  { name: 'Rafael Costa', country: 'BR', style: 'Commodity swing trading', exp: 8 },
  { name: 'Anna Lindqvist', country: 'SE', style: 'Carry trade portfolio', exp: 13 },
  { name: 'Mateo García', country: 'AR', style: 'Volatility breakout', exp: 7 },
  { name: 'Chen Wei', country: 'SG', style: 'Asian-Euro session arb', exp: 9 }
]

const SYMBOLS = ['EURUSD','GBPUSD','USDJPY','XAUUSD','USDCHF','AUDUSD','NZDUSD','USOIL','BTCUSD','GER40','SPX500','NAS100']

// Generate equity curve - 365 daily points
function genEquity(roi, vol) {
  const points = []
  let val = 10000
  const dailyReturn = Math.pow(1 + roi / 100, 1/365) - 1
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const noise = (rand() - 0.5) * vol * 0.02
    val = val * (1 + dailyReturn + noise)
    points.push({ date: d.toISOString().split('T')[0], equity: Math.round(val * 100) / 100 })
  }
  return points
}

function genTrades(count, symbolBias) {
  const trades = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const symbol = symbolBias ? (rand() < 0.6 ? symbolBias : pick(SYMBOLS)) : pick(SYMBOLS)
    const side = rand() < 0.52 ? 'BUY' : 'SELL'
    const lots = Math.round(between(0.05, 2.5) * 100) / 100
    const openPrice = Math.round(between(0.5, 2000) * 100) / 100
    const pnl = Math.round(between(-180, 420) * 100) / 100
    const openTime = now - intBetween(60000, 60 * 60 * 1000 * 24 * 30)
    const closeTime = openTime + intBetween(60000, 6 * 60 * 60 * 1000)
    trades.push({
      id: `T${100000 + i}`,
      symbol, side, lots, openPrice,
      closePrice: Math.round((openPrice * (1 + (rand()-0.5)*0.01)) * 100) / 100,
      pnl,
      openTime: new Date(openTime).toISOString(),
      closeTime: new Date(closeTime).toISOString(),
      status: 'CLOSED'
    })
  }
  return trades.sort((a, b) => new Date(b.closeTime) - new Date(a.closeTime))
}

export const STRATEGIES = TRADERS.map((t, i) => {
  const roi = Math.round(between(28, 215) * 10) / 10
  const dd = Math.round(between(4.2, 18.7) * 10) / 10
  const winRate = Math.round(between(52, 78) * 10) / 10
  const sharpe = Math.round(between(1.2, 3.4) * 100) / 100
  const pf = Math.round(between(1.4, 2.8) * 100) / 100
  return {
    id: `STR-${1000 + i}`,
    trader: t.name,
    country: t.country,
    style: t.style,
    experience: t.exp,
    bio: `${t.exp}-year track record in ${t.style.toLowerCase()}. Verified MT5 performance. Risk-controlled allocation across major pairs and indices.`,
    avatar: t.name.split(' ').map(s => s[0]).join(''),
    roi,
    drawdown: dd,
    winRate,
    sharpe,
    profitFactor: pf,
    followers: intBetween(120, 8400),
    trades30d: intBetween(45, 320),
    rating: Math.round(between(3.8, 4.95) * 10) / 10,
    aum: intBetween(150000, 4800000),
    equityCurve: genEquity(roi, dd),
    trades: genTrades(50, pick(SYMBOLS))
  }
})

export const ACCOUNTS = [
  {
    id: 'ACC-FUND-2401',
    label: 'Funded Pro $100K',
    type: 'FUNDED',
    leverage: 20,
    balance: 102_450.32,
    equity: 103_120.88,
    pnl: 2_450.32,
    pnlPct: 2.45,
    margin: 4_120.0,
    freeMargin: 99_000.88,
    status: 'ACTIVE',
    server: 'Voltra-Live-01',
    connectedStrategy: 'STR-1003',
    openedAt: '2025-09-12'
  },
  {
    id: 'ACC-FUND-2402',
    label: 'Funded Pro $50K',
    type: 'FUNDED',
    leverage: 20,
    balance: 51_280.18,
    equity: 51_100.44,
    pnl: 1_280.18,
    pnlPct: 2.56,
    margin: 2_010.0,
    freeMargin: 49_090.44,
    status: 'ACTIVE',
    server: 'Voltra-Live-02',
    connectedStrategy: 'STR-1007',
    openedAt: '2025-11-04'
  },
  {
    id: 'ACC-FUND-2403',
    label: 'Funded Pro $200K',
    type: 'FUNDED',
    leverage: 20,
    balance: 198_730.0,
    equity: 198_730.0,
    pnl: -1_270.0,
    pnlPct: -0.63,
    margin: 0,
    freeMargin: 198_730.0,
    status: 'PAUSED',
    server: 'Voltra-Live-03',
    connectedStrategy: null,
    openedAt: '2026-01-20'
  }
]

export const CURRENT_USER = {
  id: 'U-00042',
  name: 'Lorenzo M.',
  email: 'lorenzo@voltra.io',
  type: 'FOLLOWER',
  memberSince: '2025-08-01',
  totalDeposit: 0,
  tier: 'Pro'
}

export const PORTFOLIO_SUMMARY = () => {
  const totalBalance = ACCOUNTS.reduce((s, a) => s + a.balance, 0)
  const totalEquity = ACCOUNTS.reduce((s, a) => s + a.equity, 0)
  const totalPnl = ACCOUNTS.reduce((s, a) => s + a.pnl, 0)
  const active = ACCOUNTS.filter(a => a.status === 'ACTIVE').length
  return {
    totalBalance: Math.round(totalBalance * 100) / 100,
    totalEquity: Math.round(totalEquity * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
    totalPnlPct: Math.round((totalPnl / (totalBalance - totalPnl)) * 10000) / 100,
    activeStrategies: active,
    accountsCount: ACCOUNTS.length
  }
}
