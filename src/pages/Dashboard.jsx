import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import KpiCard from '../components/KpiCard.jsx'
import RuleBadge from '../components/RuleBadge.jsx'
import GrowthChart from '../components/GrowthChart.jsx'
import DailyCalendar from '../components/DailyCalendar.jsx'
import DailyStreak from '../components/DailyStreak.jsx'
import TiroDelComando from '../components/TiroDelComando.jsx'
import TourOverlay from '../components/TourOverlay.jsx'
import OathOverlay from '../components/OathOverlay.jsx'
import MarginBanner from '../components/MarginBanner.jsx'

export default function Dashboard() {
  const nav = useNavigate()
  const { user } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [latestBriefing, setLatestBriefing] = useState(null)
  const [securityStatus, setSecurityStatus] = useState(null)
  const [nudgeHidden, setNudgeHidden] = useState(false)

  // Mobile o PWA standalone → redirect a /app con design premium
  useEffect(() => {
    const force = sessionStorage.getItem('voltra.force.desktop')
    if (force) { sessionStorage.removeItem('voltra.force.desktop'); return }
    const isMobile = window.innerWidth < 768
    const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true
    if (isMobile || isStandalone) nav('/app', { replace: true })
  }, [])

  useEffect(() => {
    api.myAccounts().then(accs => {
      setAccounts(accs)
      if (accs.length > 0) setSelectedId(accs[0].id)
      else setLoading(false)
    }).catch(() => setLoading(false))
    api.briefingLatest().then(setLatestBriefing).catch(() => {})
    api.email2faStatus().then(setSecurityStatus).catch(() => {})
  }, [])

  const dismissNudge = async () => {
    setNudgeHidden(true)
    try { await api.email2faDismissNudge() } catch (e) {}
  }

  const showSecurityNudge = securityStatus && !securityStatus.enabled && !securityStatus.nudgeOff && !nudgeHidden

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    api.accountStats(selectedId).then(setStats).catch(e => console.error(e)).finally(() => setLoading(false))
  }, [selectedId])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Caricamento...</div>

  // Gamification widgets - sempre visibili
  const gamifGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
      <DailyStreak />
      <TiroDelComando />
    </div>
  )

  if (accounts.length === 0) {
    return (
      <div>
        <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Quartier Generale</h1>
        <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Stato di Servizio</div>
        {gamifGrid}
        <div className="card" style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎖</div>
          <h2 className="display" style={{ margin: '0 0 12px', fontSize: 24 }}>Nessuna missione in corso</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Scegli il tuo grado per dare inizio al servizio.</p>
          <a href="/buy" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Promozione di Grado</a>
        </div>
      </div>
    )
  }

  if (!stats) return null

  const { account, program, rules, stats: s, snapshots, payoutInfo } = stats
  const startBalance = Number(account.startBalance)
  const equityChange = ((s.currentEquity - startBalance) / startBalance) * 100

  return (
    <div>
      <OathOverlay user={user} />
      <TourOverlay />
      <MarginBanner />
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="display" style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Quartier Generale</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>Stato di Servizio</div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="voltra-input" style={{ width: 'auto', minWidth: 220 }}>
            {accounts.map(a => <option key={a.id} value={a.id}>VOLTRA LIQUIDITY GRAB POOL — {a.program.name}</option>)}
          </select>
          <span className={`badge ${account.status === 'ACTIVE' ? 'badge-success' : account.status === 'FAILED' ? 'badge-fail' : 'badge-info'}`}>
            {account.status === 'ACTIVE' && <span className="pulse-dot"></span>} {account.status}
          </span>
        </div>
      </div>

      {/* Security 2FA nudge */}
      {showSecurityNudge && (
        <div style={{
          padding: 14,
          background: 'rgba(255, 165, 2, 0.06)',
          border: '1px solid rgba(255, 165, 2, 0.3)',
          borderRadius: 12,
          marginBottom: 14,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🔒</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2 }}>Aumenta la sicurezza del tuo accesso</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>Attiva la verifica via email. Protegge il tuo account anche se ti rubano la credenziale.</div>
          </div>
          <Link to="/sicurezza-accesso" className="btn-primary" style={{ fontSize: 12, padding: '7px 14px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Attiva</Link>
          <button onClick={dismissNudge} style={{ background: 'transparent', border: 'none', color: 'var(--muted-2)', cursor: 'pointer', fontSize: 18, padding: 4, lineHeight: 1 }} title="Non mostrare più">×</button>
        </div>
      )}

      {/* Latest Briefing banner */}
      {latestBriefing && (
        <Link to="/briefing" style={{ display: 'block', textDecoration: 'none', color: 'inherit', marginBottom: 20 }}>
          <div className="card" style={{
            padding: 16,
            background: latestBriefing.pinned ? 'rgba(180,255,57,0.04)' : 'var(--surface)',
            border: latestBriefing.pinned ? '1px solid rgba(180,255,57,0.25)' : '1px solid var(--border)',
            transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>📜</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 10, color: latestBriefing.pinned ? 'var(--lime)' : 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 2 }}>
                  Ordine del Giorno N. {String(latestBriefing.number || 1).padStart(3, '0')}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#fff' }}>{latestBriefing.title}</div>
              </div>
              <span style={{ color: 'var(--lime)', fontSize: 14 }}>→</span>
            </div>
          </div>
        </Link>
      )}

      {/* Missione in corso */}
      <div id="tour-mission">
        <MissioneInCorso account={account} program={program} />
      </div>

      {/* Dotazione semplificata */}
      <div id="tour-kpi" className="card" style={{ marginBottom: 24, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, fontSize: 13 }}>
          <div><span style={{ color: 'var(--muted)' }}>Grado: </span><strong>{program.name}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Dotazione: </span><strong>${startBalance.toLocaleString()}</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Pool: </span><strong>VOLTRA LIQUIDITY GRAB POOL</strong></div>
          <div><span style={{ color: 'var(--muted)' }}>Esecuzione: </span><strong style={{ color: 'var(--lime)' }}>Automatizzata</strong></div>
        </div>
      </div>

      {/* Streak + Tiro del Comando */}
      <div id="tour-streak" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <DailyStreak />
        <TiroDelComando />
      </div>

      {/* Rimborso: visibile solo quando sbloccato dall'admin */}
      {payoutInfo && payoutInfo.eligible && accounts.find(a => a.id === selectedId)?.status === 'ACTIVE' && (
        <div className="card" style={{ marginBottom: 24, padding: 16, background: 'rgba(180, 255, 57, 0.04)', border: '1px solid rgba(180, 255, 57, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>🎖</span>
              <div>
                <strong>Rimborso Missione sbloccato</strong>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>Il Comando ha autorizzato il rimborso</div>
              </div>
            </div>
            <a href="/payout" className="btn-primary" style={{ textDecoration: 'none', padding: '8px 16px', fontSize: 13 }}>Richiedi Rimborso →</a>
          </div>
        </div>
      )}
    </div>
  )
}

function MissioneInCorso({ account, program }) {
  const status = account?.status || 'ACTIVE'

  const CONFIG = {
    ACTIVE: {
      bg: 'linear-gradient(135deg, rgba(180,255,57,0.06), rgba(0,0,0,0.4))',
      border: 'rgba(180,255,57,0.3)',
      color: 'var(--lime)',
      icon: '⚔️',
      label: 'Missione in corso',
      title: 'Sei schierato al fronte',
      desc: 'La tua operazione è attiva. Mantieni la posizione e rispetta gli ordini del Comando.',
      live: true,
    },
    PASSED: {
      bg: 'linear-gradient(135deg, rgba(232,200,74,0.06), rgba(0,0,0,0.4))',
      border: 'rgba(232,200,74,0.4)',
      color: 'var(--gold)',
      icon: '🎖',
      label: 'Missione compiuta',
      title: 'Obiettivo raggiunto',
      desc: 'Hai completato la missione con onore. Attendi gli ordini per la prossima operazione.',
      cta: true,
    },
    PAID_OUT: {
      bg: 'linear-gradient(135deg, rgba(232,200,74,0.06), rgba(0,0,0,0.4))',
      border: 'rgba(232,200,74,0.4)',
      color: 'var(--gold)',
      icon: '🏅',
      label: 'Missione liquidata',
      title: 'Bottino riscosso',
      desc: 'Il rimborso è stato erogato. Una nuova promozione ti attende per tornare in campo.',
      cta: true,
    },
    FAILED: {
      bg: 'linear-gradient(135deg, rgba(255,71,87,0.06), rgba(0,0,0,0.4))',
      border: 'rgba(255,71,87,0.3)',
      color: '#ff4757',
      icon: '🪖',
      label: 'Missione conclusa',
      title: 'Caduto in servizio',
      desc: 'L\'operazione è terminata. Il Comando ti offre la possibilità di rientrare in campo con una nuova promozione.',
      cta: true,
    },
  }

  const c = CONFIG[status] || CONFIG.ACTIVE

  return (
    <div style={{
      marginBottom: 20,
      padding: 24,
      borderRadius: 14,
      background: c.bg,
      border: `1px solid ${c.border}`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 40, lineHeight: 1 }}>{c.icon}</div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 11, color: c.color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
              {c.label}
            </span>
            {c.live && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, color: c.color, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.color, animation: 'pulse 1.5s ease-in-out infinite' }} />
                Live
              </span>
            )}
          </div>
          <div className="display" style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 4 }}>{c.title}</div>
          <div style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6 }}>{c.desc}</div>
          {c.live && program && (
            <div style={{ marginTop: 10, fontSize: 12, color: 'var(--muted)' }}>
              Operazione: <strong style={{ color: 'var(--text)' }}>{program.name}</strong>
            </div>
          )}
        </div>
        {c.cta && (
          <a href="/buy" className="btn-primary" style={{ textDecoration: 'none', whiteSpace: 'nowrap' }}>
            Nuova Promozione →
          </a>
        )}
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
