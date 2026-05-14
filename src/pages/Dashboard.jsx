import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import KpiCard from '../components/KpiCard.jsx'
import RuleBadge from '../components/RuleBadge.jsx'
import GrowthChart from '../components/GrowthChart.jsx'

export default function Dashboard() {
  const [accounts, setAccounts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.myAccounts().then(accs => {
      setAccounts(accs)
      if (accs.length > 0) setSelectedId(accs[0].id)
      else setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    api.accountStats(selectedId)
      .then(setStats)
      .catch(e => console.error(e))
      .finally(() => setLoading(false))
  }, [selectedId])

  if (loading) return <div style={{ color: 'var(--voltra-muted)', padding: 40 }}>Caricamento...</div>

  if (accounts.length === 0) {
    return (
      <div className="voltra-card" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚡</div>
        <h2 style={{ margin: '0 0 12px' }}>Nessun account attivo</h2>
        <p style={{ color: 'var(--voltra-muted)', marginBottom: 24 }}>
          Acquista il tuo primo programma per iniziare a tradare con Voltra.
        </p>
        <a href="/buy" className="voltra-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
          Acquista programma
        </a>
      </div>
    )
  }

  if (!stats) return null

  const { account, program, rules, stats: s, snapshots } = stats
  const startBalance = Number(account.startBalance)
  const equityChange = ((s.currentEquity - startBalance) / startBalance) * 100

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>Dashboard</h1>
          <div style={{ color: 'var(--voltra-muted)', fontSize: 14, marginTop: 4 }}>
            Stato del tuo account prop in tempo reale
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedId}
            onChange={e => setSelectedId(e.target.value)}
            className="voltra-input"
            style={{ width: 'auto', minWidth: 220 }}
          >
            {accounts.map(a => (
              <option key={a.id} value={a.id}>
                {a.brokerLogin} — {a.program.name}
              </option>
            ))}
          </select>
          <span className="badge badge-success">
            <span className="pulse-dot"></span> {account.status}
          </span>
        </div>
      </div>

      {/* Program info bar */}
      <div className="voltra-card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 13 }}>
          <div>
            <span style={{ color: 'var(--voltra-muted)' }}>Programma: </span>
            <strong>{program.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--voltra-muted)' }}>Saldo iniziale: </span>
            <strong>${startBalance.toLocaleString()}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--voltra-muted)' }}>Profit split: </span>
            <strong>{Number(program.profitSplitPct)}%</strong>
          </div>
          <div>
            <span style={{ color: 'var(--voltra-muted)' }}>Broker: </span>
            <strong>{account.broker}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--voltra-muted)' }}>Login: </span>
            <strong>{account.brokerLogin}</strong>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard
          icon="💰"
          label="Saldo attuale"
          value={`$${s.currentBalance.toLocaleString()}`}
          subtitle={`Equity: $${s.currentEquity.toLocaleString()}`}
          badge={
            <span className={`badge ${equityChange >= 0 ? 'badge-success' : 'badge-fail'}`}>
              {equityChange >= 0 ? '+' : ''}{equityChange.toFixed(2)}%
            </span>
          }
        />

        <KpiCard
          icon="📈"
          label="P&L Oggi"
          value={`${s.dailyPL >= 0 ? '+' : ''}$${s.dailyPL.toLocaleString()}`}
          subtitle={`Drawdown: ${s.drawdownPct.toFixed(2)}%`}
        />

        {program.profitTargetPct && rules.profitTarget && (
          <KpiCard
            icon="🎯"
            label="Profit Target"
            value={`$${rules.profitTarget.target.toLocaleString()}`}
            subtitle={`Mancano: $${(rules.profitTarget.target - rules.profitTarget.current).toLocaleString()}`}
            progress={(rules.profitTarget.current / rules.profitTarget.target) * 100}
            progressColor="var(--voltra-lime)"
            badge={<RuleBadge status={rules.profitTarget.status} />}
          />
        )}

        <KpiCard
          icon="⚠️"
          label="Limite perdita giornaliera"
          value={`$${rules.maxDailyLoss.limit.toLocaleString()}`}
          subtitle={`Equity vs limite`}
          progress={Math.max(0, ((rules.maxDailyLoss.current - rules.maxDailyLoss.limit) / (startBalance - rules.maxDailyLoss.limit)) * 100)}
          progressColor="#ffa502"
          badge={<RuleBadge status={rules.maxDailyLoss.status} />}
        />

        <KpiCard
          icon="🛑"
          label="Limite massimo perdita"
          value={`$${rules.maxOverallLoss.limit.toLocaleString()}`}
          subtitle={`Equity vs limite`}
          progress={Math.max(0, ((rules.maxOverallLoss.current - rules.maxOverallLoss.limit) / (startBalance - rules.maxOverallLoss.limit)) * 100)}
          progressColor="#ff4757"
          badge={<RuleBadge status={rules.maxOverallLoss.status} />}
        />

        <KpiCard
          icon="📅"
          label="Giorni di trading"
          value={`${s.tradingDays}${program.minTradingDays ? ` / ${program.minTradingDays}` : ''}`}
          subtitle={program.minTradingDays ? `Minimo richiesto: ${program.minTradingDays}` : 'Nessun minimo'}
          badge={rules.minTradingDays && <RuleBadge status={rules.minTradingDays.status} />}
        />
      </div>

      {/* Growth Chart */}
      <div style={{ marginBottom: 24 }}>
        <GrowthChart snapshots={snapshots} account={account} program={program} />
      </div>

      {/* Stats + Rules */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24 }}>
        {/* Statistics */}
        <div className="voltra-card">
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Statistiche</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
            <Stat label="Miglior trade" value={s.bestTrade != null ? `$${s.bestTrade.toLocaleString()}` : '—'} color="var(--voltra-lime)" />
            <Stat label="Peggior trade" value={s.worstTrade != null ? `$${s.worstTrade.toLocaleString()}` : '—'} color="#ff4757" />
            <Stat label="Vittoria media" value={s.avgWin != null ? `$${s.avgWin}` : '—'} />
            <Stat label="Perdita media" value={s.avgLoss != null ? `$${s.avgLoss}` : '—'} />
            <Stat label="N. trades" value={s.totalTrades} />
            <Stat label="Volume" value={s.totalVolume.toFixed(2)} />
            <Stat label="Tasso vincita" value={s.winRatePct != null ? `${s.winRatePct}%` : '—'} />
            <Stat label="Fattore profitto" value={s.profitFactor != null ? s.profitFactor.toFixed(2) : '—'} />
          </div>
        </div>

        {/* Program rules */}
        <div className="voltra-card">
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Regole del programma</h3>
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr style={{ color: 'var(--voltra-muted)', textAlign: 'left', fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 0', fontWeight: 500 }}>Obiettivo</th>
                <th style={{ padding: '8px 0', fontWeight: 500 }}>Stato</th>
                <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Attuale</th>
                <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Necessario</th>
              </tr>
            </thead>
            <tbody>
              {rules.profitTarget && (
                <tr style={{ borderTop: '1px solid var(--voltra-border)' }}>
                  <td style={{ padding: '12px 0' }}>Profit Target</td>
                  <td><RuleBadge status={rules.profitTarget.status} /></td>
                  <td style={{ textAlign: 'right' }}>${rules.profitTarget.current.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>${rules.profitTarget.target.toLocaleString()}</td>
                </tr>
              )}
              {rules.minTradingDays && (
                <tr style={{ borderTop: '1px solid var(--voltra-border)' }}>
                  <td style={{ padding: '12px 0' }}>Giorni di trading</td>
                  <td><RuleBadge status={rules.minTradingDays.status} /></td>
                  <td style={{ textAlign: 'right' }}>{rules.minTradingDays.current}</td>
                  <td style={{ textAlign: 'right' }}>{rules.minTradingDays.required}</td>
                </tr>
              )}
              <tr style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <td style={{ padding: '12px 0' }}>Daily Loss</td>
                <td><RuleBadge status={rules.maxDailyLoss.status} /></td>
                <td style={{ textAlign: 'right' }}>${rules.maxDailyLoss.current.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>${rules.maxDailyLoss.limit.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <td style={{ padding: '12px 0' }}>Max Loss</td>
                <td><RuleBadge status={rules.maxOverallLoss.status} /></td>
                <td style={{ textAlign: 'right' }}>${rules.maxOverallLoss.current.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>${rules.maxOverallLoss.limit.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <td style={{ padding: '12px 0' }}>Scalping</td>
                <td><RuleBadge status={program.scalpingAllowed ? 'OK' : 'FAILED'} /></td>
                <td style={{ textAlign: 'right' }}>—</td>
                <td style={{ textAlign: 'right' }}>{program.scalpingAllowed ? 'Permesso' : 'Vietato'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ color: 'var(--voltra-muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: color || 'var(--voltra-text)' }}>{value}</div>
    </div>
  )
}
