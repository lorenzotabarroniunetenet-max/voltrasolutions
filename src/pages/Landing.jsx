import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Landing() {
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    api.programs().then(setPrograms).catch(() => {})
  }, [])

  return (
    <div>
      {/* Header */}
      <header style={{
        padding: '20px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--voltra-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 28, color: 'var(--voltra-lime)' }}>⚡</div>
          <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.05em' }}>VOLTRA</div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" className="voltra-btn-secondary" style={{ textDecoration: 'none', display: 'inline-block' }}>Login</Link>
          <Link to="/register" className="voltra-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>Sign up</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{ padding: '80px 32px', textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
        <h1 style={{ fontSize: 56, fontWeight: 800, margin: '0 0 20px', lineHeight: 1.1 }}>
          Trade smarter.<br />
          <span style={{ color: 'var(--voltra-lime)' }}>Trade with Voltra.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--voltra-muted)', margin: '0 0 32px', lineHeight: 1.6 }}>
          Prop trading firm con regole trasparenti, payout veloci in crypto,
          e dashboard professionale per monitorare la tua performance in tempo reale.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="voltra-btn-primary" style={{ textDecoration: 'none', display: 'inline-block', fontSize: 16, padding: '14px 28px' }}>
            Inizia ora
          </Link>
        </div>
      </section>

      {/* Programs */}
      <section style={{ padding: '40px 32px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, textAlign: 'center', marginBottom: 40 }}>
          Scegli il tuo programma
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {programs.filter(p => p.phase === 'CHALLENGE').map(p => (
            <div key={p.id} className="voltra-card" style={{ padding: 28 }}>
              <div style={{ color: 'var(--voltra-muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {p.phase === 'CHALLENGE' ? 'Challenge' : 'Instant Funding'}
              </div>
              <h3 style={{ fontSize: 32, fontWeight: 800, margin: '8px 0', color: 'var(--voltra-lime)' }}>
                ${Number(p.accountSize).toLocaleString()}
              </h3>
              <div style={{ fontSize: 14, color: 'var(--voltra-muted)', marginBottom: 20 }}>
                {p.name}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, marginBottom: 24 }}>
                <Row label="Profit target" value={p.profitTargetPct ? `${p.profitTargetPct}%` : 'Nessuno'} />
                <Row label="Daily loss" value={`${p.maxDailyLossPct}%`} />
                <Row label="Max loss" value={`${p.maxOverallLossPct}%`} />
                <Row label="Profit split" value={`${p.profitSplitPct}%`} highlight />
                <Row label="Min trading days" value={p.minTradingDays || 'Nessuno'} />
              </div>

              <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16 }}>
                ${Number(p.priceUsd || 0)}
              </div>

              <Link to="/register" className="voltra-btn-primary" style={{ width: '100%', textDecoration: 'none', display: 'block', textAlign: 'center' }}>
                Acquista
              </Link>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: '40px 32px', textAlign: 'center', color: 'var(--voltra-muted)', fontSize: 13, borderTop: '1px solid var(--voltra-border)', marginTop: 80 }}>
        © 2026 Voltra Solutions. Trade at your own risk.
      </footer>
    </div>
  )
}

function Row({ label, value, highlight }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ color: 'var(--voltra-muted)' }}>{label}</span>
      <span style={{ fontWeight: 600, color: highlight ? 'var(--voltra-lime)' : 'var(--voltra-text)' }}>{value}</span>
    </div>
  )
}
