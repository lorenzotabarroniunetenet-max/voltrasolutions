import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'
import Stemma from '../components/Stemma.jsx'

const TABS = ['Cronostoria', 'Promozioni', 'Rimborsi', 'Onorificenze']

export default function SchedaUtente() {
  const { id } = useParams()
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [tab, setTab] = useState('Cronostoria')

  useEffect(() => {
    api.adminGetUser(id)
      .then(setUser)
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Caricamento scheda...</div>
  if (err) return <div style={{ color: '#ff4757', padding: 40 }}>{err}</div>
  if (!user) return null

  const totalSpent = (user.orders || []).filter(o => o.status === 'APPROVED').reduce((s, o) => s + (o.amount || 0), 0)
  const promotions = (user.orders || []).filter(o => o.status === 'APPROVED')
  const fmt = (d) => new Date(d).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const statBox = (label, value, color) => (
    <div style={{ padding: 14, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10 }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{label}</div>
      <div className="display" style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
    </div>
  )

  const timelineItem = (date, title, detail, color = 'var(--lime)') => (
    <div style={{ position: 'relative', paddingBottom: 18 }}>
      <div style={{ position: 'absolute', left: -22, top: 6, width: 12, height: 12, borderRadius: '50%', background: 'var(--surface-2)', border: `2px solid ${color}` }} />
      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'JetBrains Mono, monospace' }}>{fmt(date)}</div>
      <div style={{ fontSize: 13, fontWeight: 600, margin: '2px 0' }}>{title}</div>
      {detail && <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{detail}</div>}
    </div>
  )

  return (
    <div>
      <button onClick={() => nav(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid var(--border-bright)', color: 'var(--muted)', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, marginBottom: 16 }}>
        ← Indietro
      </button>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', padding: 24, background: 'linear-gradient(135deg, rgba(180,255,57,0.04), rgba(0,0,0,0.4))', border: '1px solid rgba(180,255,57,0.2)', borderRadius: 14, marginBottom: 20 }}>
        <div style={{ width: 84, flexShrink: 0 }}>
          <Stemma matricola={user.matricola || 'VLT-0000'} rank={user.role === 'ADMIN' ? 'Colonnello' : (user.rank || 'Caporale')} size={84} />
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontSize: 11, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
            {user.role === 'ADMIN' ? 'Comando' : (user.rank || 'Caporale')} · {user.matricola || 'N/D'}
          </div>
          <div className="display" style={{ fontSize: 28, fontWeight: 700, margin: '4px 0' }}>{user.name}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--muted)' }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--muted)' }}>
            <span>Registrato: <strong style={{ color: 'var(--text)' }}>{fmt(user.createdAt)}</strong></span>
            {user.emailVerified && <span style={{ color: 'var(--lime)' }}>✓ Email verificata</span>}
            {user.email2faEnabled && <span style={{ color: 'var(--lime)' }}>✓ 2FA attivo</span>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        {statBox('Spesa totale', `${totalSpent.toLocaleString()} USDT`, 'var(--lime)')}
        {statBox('Promozioni', promotions.length)}
        {statBox('Rimborsi', (user.payoutRequests || []).length)}
        {statBox('Onorificenze', (user.decorations || []).length, 'var(--gold)')}
        {statBox('Operazioni', user.purchaseCount || 0)}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 10, marginBottom: 16, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '8px 14px', background: tab === t ? 'var(--lime)' : 'transparent',
            border: 'none', color: tab === t ? '#000' : 'var(--muted)',
            borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            textTransform: 'uppercase', letterSpacing: '0.04em', whiteSpace: 'nowrap',
          }}>{t}</button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card" style={{ padding: 20 }}>
        {tab === 'Cronostoria' && (
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 1, background: 'var(--border)' }} />
            {(user.serviceLog || []).length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Nessun evento registrato.</div>}
            {(user.serviceLog || []).map((e, i) => {
              const color = e.type === 'promotion' ? 'var(--lime)' : e.type === 'note' ? 'var(--muted)' : e.type === 'decoration' ? 'var(--gold)' : 'var(--lime)'
              return <div key={i}>{timelineItem(e.createdAt, e.title, e.description, color)}</div>
            })}
          </div>
        )}

        {tab === 'Promozioni' && (
          <div>
            {(user.orders || []).length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Nessun ordine.</div>}
            {(user.orders || []).map((o, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{o.programName}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{fmt(o.createdAt)} · {o.amount} {o.currency}</div>
                </div>
                <span style={{
                  padding: '3px 9px', borderRadius: 999, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700,
                  background: o.status === 'APPROVED' ? 'rgba(180,255,57,0.1)' : o.status === 'REJECTED' ? 'rgba(255,71,87,0.1)' : 'rgba(255,165,2,0.1)',
                  color: o.status === 'APPROVED' ? 'var(--lime)' : o.status === 'REJECTED' ? '#ff4757' : '#ffa502',
                  border: `1px solid ${o.status === 'APPROVED' ? 'rgba(180,255,57,0.3)' : o.status === 'REJECTED' ? 'rgba(255,71,87,0.3)' : 'rgba(255,165,2,0.3)'}`,
                }}>
                  {o.status === 'APPROVED' ? 'Approvato' : o.status === 'REJECTED' ? 'Rifiutato' : 'In attesa'}
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Rimborsi' && (
          <div>
            {(user.payoutRequests || []).length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Nessun rimborso richiesto.</div>}
            {(user.payoutRequests || []).map((p, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>${Number(p.amount).toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'monospace' }}>{fmt(p.requestedAt)}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{p.status}</span>
              </div>
            ))}
          </div>
        )}

        {tab === 'Onorificenze' && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {(user.decorations || []).length === 0 && <div style={{ color: 'var(--muted)', fontSize: 13 }}>Nessuna onorificenza conferita.</div>}
            {(user.decorations || []).map((d, i) => (
              <div key={i} style={{ padding: '10px 14px', background: 'rgba(232,200,74,0.06)', border: '1px solid rgba(232,200,74,0.3)', borderRadius: 10, fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--gold)' }}>{d.decoration?.name || 'Onorificenza'}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', fontFamily: 'monospace', marginTop: 2 }}>{fmt(d.awardedAt)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
