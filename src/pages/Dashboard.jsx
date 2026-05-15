import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import KpiCard from '../components/KpiCard.jsx'
import RuleBadge from '../components/RuleBadge.jsx'
import GrowthChart from '../components/GrowthChart.jsx'
import DailyCalendar from '../components/DailyCalendar.jsx'

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
    api.accountStats(selectedId).then(setStats).catch(e => console.error(e)).finally(() => setLoading(false))
  }, [selectedId])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Caricamento...</div>

  if (accounts.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🎖</div>
        <h2 className="display" style={{ margin: '0 0 12px', fontSize: 24 }}>Nessuna missione in corso</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Scegli il tuo grado per dare inizio al servizio.</p>
        <a href="/buy" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Promozione di Grado</a>
      </div>
    )
  }

  if (!stats) return null

  const { account, program, rules, stats: s, snapshots, payoutInfo } = stats
  const startBalance = Number(account.startBalance)
  const equityChange = ((s.currentEquity - startBalance) / startBalance) * 100

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Quartier Generale</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Stato di Servizio</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="voltra-input" style={{ width: 'auto', minWidth: 220 }}>
            {accounts.map(a => <option key={a.id} value={a.id}>{a.brokerLogin} — {a.program.name}</option>)}
          </select>
          <span className={`badge ${account.status === 'ACTIVE' ? 'badge-success' : account.status === 'FAILED' ? 'badge-fail' : 'badge-info'}`}>
            {account.status === 'ACTIVE' && <span className="pulse-dot"></span>} {account.status}
          </span>
        </div>
      </div>

      {/* Program info bar */}
      <div className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 13 }}>
          <div><span style={{ color: 'var(--muted)' }}>Grado: </span><strong>{program.name}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Dotazione iniziale: </span><strong>${startBalance.toLocaleString()}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Quota partecipazione: </span><strong>{Number(program.profitSplitPct)}%</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Broker: </span><strong>{account.broker}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Login: </span><strong>{account.brokerLogin}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Rimborso ogni: </span><strong>{program.payoutFrequencyDays || 7} giorni</strong></div>
        </div>
      </div>

      {/* Payout eligibility banner */}
      {payoutInfo && !payoutInfo.eligible && (
        <div className="card" style={{ marginBottom: 24, padding: 16, background: 'rgba(255, 165, 2, 0.06)', border: '1px solid rgba(255, 165, 2, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⏳</span>
            <div style={{ flex: 1 }}>
              <strong>Prossimo Rimborso Missione disponibile fra {payoutInfo.daysLeft} giorni</strong>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                Ultima richiesta: {new Date(payoutInfo.lastRequestDate).toLocaleDateString('it-IT')} · Rimborso ogni {payoutInfo.freqDays} giorni
              </div>
            </div>
          </div>
        </div>
      )}
      {payoutInfo && payoutInfo.eligible && accounts.find(a => a.id === selectedId)?.status === 'ACTIVE' && (
        <div className="card" style={{ marginBottom: 24, padding: 16, background: 'rgba(180, 255, 57, 0.04)', border: '1px solid rgba(180, 255, 57, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🎖</span>
              <div>
                <strong>Idoneo al Rimborso Missione</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Procedi alla sezione Rimborso Missione</div>
              </div>
            </div>
            <a href="/payout" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}>Richiedi Rimborso →</a>
          </div>
        </div>
      )}

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <KpiCard
          icon="💰" label="Saldo attuale"
          value={`$${s.currentBalance.toLocaleString()}`}
          subtitle={`Equity: $${s.currentEquity.toLocaleString()}`}
          badge={<span className={`badge ${equityChange >= 0 ? 'badge-success' : 'badge-fail'}`}>{equityChange >= 0 ? '+' : ''}{equityChange.toFixed(2)}%</span>}
        />
        <KpiCard
          icon="📈" label="P&L Oggi"
          value={`${s.dailyPL >= 0 ? '+' : ''}$${s.dailyPL.toLocaleString()}`}
          subtitle={`Drawdown: ${s.drawdownPct.toFixed(2)}%`}
        />
        {program.profitTargetPct && rules.profitTarget && (
          <KpiCard
            icon="🎯" label="Profit Target"
            value={`$${rules.profitTarget.target.toLocaleString()}`}
            subtitle={`Mancano: $${(rules.profitTarget.target - rules.profitTarget.current).toLocaleString()}`}
            progress={(rules.profitTarget.current / rules.profitTarget.target) * 100}
            progressColor="var(--lime)"
            badge={<RuleBadge status={rules.profitTarget.status} />}
          />
        )}
        <KpiCard
          icon="⚠️" label="Daily Loss Limit"
          value={`$${rules.maxDailyLoss.limit.toLocaleString()}`}
          subtitle="Equity vs limite"
          badge={<RuleBadge status={rules.maxDailyLoss.status} />}
        />
        <KpiCard
          icon="🛑" label="Max Loss Limit"
          value={`$${rules.maxOverallLoss.limit.toLocaleString()}`}
          subtitle="Equity vs limite"
          badge={<RuleBadge status={rules.maxOverallLoss.status} />}
        />
        <KpiCard
          icon="📅" label="Giorni di trading"
          value={`${s.tradingDays}${program.minTradingDays ? ` / ${program.minTradingDays}` : ''}`}
          subtitle={program.minTradingDays ? `Minimo richiesto: ${program.minTradingDays}` : 'Nessun minimo'}
          badge={rules.minTradingDays && <RuleBadge status={rules.minTradingDays.status} />}
        />
      </div>

      {/* Chart */}
      <div style={{ marginBottom: 24 }}>
        <GrowthChart snapshots={snapshots} account={account} program={program} />
      </div>

      {/* Daily P&L Calendar */}
      <div style={{ marginBottom: 24 }}>
        <DailyCalendar snapshots={snapshots} account={account} />
      </div>

      {/* Stats + Rules + Trading conditions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        <div className="card">
          <h3 className="display" style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Statistiche</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
            <Stat label="Miglior trade" value={s.bestTrade != null ? `$${s.bestTrade.toLocaleString()}` : '—'} color="var(--lime)" />
            <Stat label="Peggior trade" value={s.worstTrade != null ? `$${s.worstTrade.toLocaleString()}` : '—'} color="var(--red)" />
            <Stat label="Vittoria media" value={s.avgWin != null ? `$${s.avgWin}` : '—'} />
            <Stat label="Perdita media" value={s.avgLoss != null ? `$${s.avgLoss}` : '—'} />
            <Stat label="N. trades" value={s.totalTrades} />
            <Stat label="Volume" value={s.totalVolume.toFixed(2)} />
            <Stat label="Tasso vincita" value={s.winRatePct != null ? `${s.winRatePct}%` : '—'} />
            <Stat label="Fattore profitto" value={s.profitFactor != null ? s.profitFactor.toFixed(2) : '—'} />
          </div>
        </div>

        <div className="card">
          <h3 className="display" style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Codice di Condotta</h3>
          <table style={{ width: '100%', fontSize: 14 }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'left', fontSize: 12, textTransform: 'uppercase' }}>
                <th style={{ padding: '8px 0', fontWeight: 500 }}>Obiettivo</th>
                <th style={{ padding: '8px 0', fontWeight: 500 }}>Stato</th>
                <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Attuale</th>
                <th style={{ padding: '8px 0', fontWeight: 500, textAlign: 'right' }}>Necessario</th>
              </tr>
            </thead>
            <tbody>
              {rules.profitTarget && (
                <tr style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 0' }}>Profit Target</td>
                  <td><RuleBadge status={rules.profitTarget.status} /></td>
                  <td style={{ textAlign: 'right' }}>${rules.profitTarget.current.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>${rules.profitTarget.target.toLocaleString()}</td>
                </tr>
              )}
              {rules.minTradingDays && (
                <tr style={{ borderTop: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px 0' }}>Giorni di trading</td>
                  <td><RuleBadge status={rules.minTradingDays.status} /></td>
                  <td style={{ textAlign: 'right' }}>{rules.minTradingDays.current}</td>
                  <td style={{ textAlign: 'right' }}>{rules.minTradingDays.required}</td>
                </tr>
              )}
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 0' }}>Daily Loss</td>
                <td><RuleBadge status={rules.maxDailyLoss.status} /></td>
                <td style={{ textAlign: 'right' }}>${rules.maxDailyLoss.current.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>${rules.maxDailyLoss.limit.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 0' }}>Max Loss</td>
                <td><RuleBadge status={rules.maxOverallLoss.status} /></td>
                <td style={{ textAlign: 'right' }}>${rules.maxOverallLoss.current.toLocaleString()}</td>
                <td style={{ textAlign: 'right' }}>${rules.maxOverallLoss.limit.toLocaleString()}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 0' }}>Scalping</td>
                <td><RuleBadge status={rules.scalping === 'ALLOWED' ? 'OK' : 'FAILED'} /></td>
                <td style={{ textAlign: 'right' }}>—</td>
                <td style={{ textAlign: 'right' }}>{rules.scalping === 'ALLOWED' ? 'Permesso' : 'Vietato'}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 0' }}>News trading</td>
                <td><RuleBadge status={rules.news === 'ALLOWED' ? 'OK' : 'FAILED'} /></td>
                <td style={{ textAlign: 'right' }}>—</td>
                <td style={{ textAlign: 'right' }}>{rules.news === 'ALLOWED' ? 'Permesso' : 'Vietato'}</td>
              </tr>
              <tr style={{ borderTop: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 0' }}>Hold weekend</td>
                <td><RuleBadge status={rules.weekendHold === 'ALLOWED' ? 'OK' : 'FAILED'} /></td>
                <td style={{ textAlign: 'right' }}>—</td>
                <td style={{ textAlign: 'right' }}>{rules.weekendHold === 'ALLOWED' ? 'Permesso' : 'Vietato'}</td>
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
      <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 600, color: color || 'var(--text)' }}>{value}</div>
    </div>
  )
}
