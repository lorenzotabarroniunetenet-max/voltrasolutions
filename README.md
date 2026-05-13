# VOLTRA

Copy-trading platform for MT5 funded accounts. React + Vite + Tailwind + Recharts.

## Brand

- **Name**: VOLTRA
- **Palette**: `#B4FF39` (lime electric brand), `#0A0A0B` (bg), `#13131A` (surface), `#FF3D71` (danger)
- **Fonts**: Inter (UI), JetBrains Mono (numbers/tickers)

## Setup

```bash
cd voltra
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Stack

- React 18 + React Router 6
- Vite 5
- Tailwind 3
- Recharts 2

## Mock API surface

All endpoints in `src/lib/api.js` (in-memory, no real backend).

| Endpoint | Method | Function |
|---|---|---|
| `/api/auth/login` | POST | `api.login(email, password)` |
| `/api/auth/register` | POST | `api.register({name, email, password})` |
| `/api/accounts` | GET | `api.getAccounts()` |
| `/api/strategies` | GET | `api.getStrategies(filters)` |
| `/api/strategies/:id` | GET | `api.getStrategy(id)` |
| `/api/connect-strategy` | POST | `api.connectStrategy({accountId, strategyId, lotRatio, maxDrawdown})` |
| `/api/trades` | GET | `api.getTrades(strategyId, limit)` |
| `/api/portfolio` | GET | `api.getPortfolio()` |

WebSocket simulation: `src/lib/ws.js` → `subscribeLivePnL(callback)` emits P&L deltas every 2s.

## Demo data

- 15 strategies (traders, equity curves 365 days, 50 trades each)
- 3 funded accounts (2 active, 1 paused)
- Test user auto-logged in: `lorenzo@voltra.io` / `demo1234`

## Routes

| Path | Component |
|---|---|
| `/` | Home (landing) |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Funded accounts dashboard |
| `/strategies` | Marketplace |
| `/strategies/:id` | Strategy detail + connect modal |
| `/portfolio` | Portfolio overview |

## Wiring a real backend

Replace `src/lib/api.js` with `fetch` calls to your endpoints. Same function signatures. Replace `src/lib/ws.js` with native `WebSocket('wss://...')`.

## Profit split

Master 70% / Platform 30%. Configurable per-strategy if needed (not exposed in MVP UI).
