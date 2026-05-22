import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function AppMobile() {
  const { user } = useAuth()
  const nav = useNavigate()
  const [accounts, setAccounts] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.myAccounts().then(async accs => {
      setAccounts(accs)
      if (accs.length > 0) {
        try {
          const s = await api.accountStats(accs[0].id)
          setStats(s)
        } catch (e) {}
      }
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const account = stats?.account
  const program = stats?.program
  const payoutInfo = stats?.payoutInfo
  const startBalance = account ? Number(account.startBalance) : 0

  const statusConfig = {
    ACTIVE:   { color: 'var(--lime)', icon: '⚔️', label: 'In corso', pulse: true },
    PASSED:   { color: '#E8C84A',     icon: '🏅', label: 'Compiuta', pulse: false },
    FAILED:   { color: '#ff4757',     icon: '🪖', label: 'Conclusa', pulse: false },
    PAID_OUT: { color: '#E8C84A',     icon: '💰', label: 'Liquidata', pulse: false },
  }
  const sc = statusConfig[account?.status] || statusConfig.ACTIVE

  const canPayout = payoutInfo?.eligible && account?.status === 'ACTIVE'

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: 'var(--muted)', fontSize: 13 }}>Caricamento...</div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      paddingTop: 'env(safe-area-inset-top, 0px)',
      paddingBottom: 'env(safe-area-inset-bottom, 24px)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── HEADER ── */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <svg width="22" height="22" viewBox="0 0 100 100">
            <polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39"/>
          </svg>
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontWeight: 800, fontSize: 17, letterSpacing: '-0.01em', color: 'var(--lime)' }}>VOLTRA</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{user?.matricola || ''}</span>
          <Link to="/personale" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--surface-2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)', textDecoration: 'none', fontSize: 14 }}>👤</Link>
        </div>
      </div>

      <div style={{ flex: 1, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {accounts.length === 0 ? (
          /* ── NESSUNA MISSIONE ── */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '40px 0' }}>
            <div style={{ fontSize: 52 }}>🎖</div>
            <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 22, fontWeight: 700, textAlign: 'center' }}>Nessuna missione</div>
            <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', lineHeight: 1.6 }}>Scegli il tuo grado per iniziare il servizio.</div>
            <Link to="/buy" style={{
              display: 'block', width: '100%', padding: '16px',
              background: 'var(--lime)', color: '#000', textDecoration: 'none',
              fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 14,
              textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center',
              borderRadius: 2,
            }}>⚡ Nuova Promozione</Link>
          </div>
        ) : (
          <>
            {/* ── MISSIONE CARD ── */}
            <div style={{
              background: `linear-gradient(135deg, rgba(${sc.color === 'var(--lime)' ? '180,255,57' : sc.color === '#E8C84A' ? '232,200,74' : '255,71,87'},0.06), rgba(0,0,0,0.4))`,
              border: `1px solid rgba(${sc.color === 'var(--lime)' ? '180,255,57' : sc.color === '#E8C84A' ? '232,200,74' : '255,71,87'},0.25)`,
              borderRadius: 14, padding: '18px 16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, color: sc.color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>
                      ⚔️ Missione {sc.label}
                    </span>
                    {sc.pulse && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9, color: sc.color }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--lime)', animation: 'pulse 1.5s ease-in-out infinite', display: 'inline-block' }}/>
                        LIVE
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em', lineHeight: 1.1 }}>
                    {account.status === 'ACTIVE' ? 'Al fronte' : account.status === 'PASSED' ? 'Obiettivo raggiunto' : account.status === 'PAID_OUT' ? 'Bottino riscosso' : 'Caduto in servizio'}
                  </div>
                </div>
                <span style={{ fontSize: 32 }}>{sc.icon}</span>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Grado</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{program?.name || '—'}</div>
                </div>
                <div style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px' }}>
                  <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>Dotazione</div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>${startBalance.toLocaleString()}</div>
                </div>
              </div>

              <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, fontSize: 10, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>
                VOLTRA LIQUIDITY GRAB POOL · <span style={{ color: 'var(--lime)' }}>Esecuzione automatizzata</span>
              </div>
            </div>

            {/* ── CTA RIMBORSO (solo se sbloccato) ── */}
            {canPayout && (
              <Link to="/payout" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.3)',
                borderRadius: 12, padding: '14px 16px', textDecoration: 'none', color: 'inherit',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>💰</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>Rimborso sbloccato</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Il Comando ha autorizzato il rimborso</div>
                  </div>
                </div>
                <span style={{ color: 'var(--lime)', fontSize: 18 }}>→</span>
              </Link>
            )}

            {/* ── AZIONI RAPIDE ── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Link to="/buy" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '18px 12px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, textDecoration: 'none', color: 'inherit',
                transition: 'border-color 0.15s',
              }}>
                <span style={{ fontSize: 24 }}>🎖</span>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Nuova Promozione</div>
              </Link>

              <a href="https://t.me/voltra_comandoBot" target="_blank" rel="noreferrer" style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '18px 12px',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, textDecoration: 'none', color: 'inherit',
              }}>
                <span style={{ fontSize: 24 }}>✈️</span>
                <div style={{ fontWeight: 700, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>Apri Telegram</div>
              </a>
            </div>

            {/* ── LINK SECONDARI ── */}
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {[
                { to: '/giochi', icon: '🎮', label: 'Zona Tattica — Mini Giochi' },
                { to: '/fascicolo', icon: '📋', label: 'Fascicolo personale' },
                { to: '/linea-diretta', icon: '📨', label: 'Supporto — Linea Diretta' },
                { to: '/briefing', icon: '📜', label: 'Ordini del Giorno' },
                { to: '/onorificenze', icon: '🏅', label: 'Onorificenze' },
              ].map((item, i, arr) => (
                <Link key={item.to} to={item.to} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
                  borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                  textDecoration: 'none', color: 'var(--text)', transition: 'background 0.15s',
                }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{item.label}</span>
                  <span style={{ color: 'var(--muted-2)', fontSize: 14 }}>›</span>
                </Link>
              ))}
            </div>

            {/* ── LINK SITO COMPLETO ── */}
            <Link to="/dashboard" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '12px', background: 'transparent',
              border: '1px solid var(--border-bright)',
              borderRadius: 10, textDecoration: 'none', color: 'var(--muted)', fontSize: 12,
            }}>
              🖥 Apri il sito completo
            </Link>
          </>
        )}
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  )
}
