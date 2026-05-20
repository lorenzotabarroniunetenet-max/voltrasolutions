import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function ApprovaOrdine() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const token = params.get('token')
  const nav = useNavigate()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [approving, setApproving] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!token) { setErr('Link non valido: token mancante'); setLoading(false); return }
    api.approveInfo(id, token)
      .then(d => setOrder(d.order))
      .catch(e => setErr(e.message || 'Link non valido o scaduto'))
      .finally(() => setLoading(false))
  }, [id, token])

  const approve = async () => {
    setApproving(true); setErr('')
    try {
      await api.approveByToken(id, token)
      setDone(true)
    } catch (e) { setErr(e.message) } finally { setApproving(false) }
  }

  const wrap = { minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, fontFamily: 'Manrope, sans-serif' }
  const card = { background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, maxWidth: 440, width: '100%' }

  if (loading) return <div style={wrap}><div style={{ color: 'var(--muted)' }}>Caricamento...</div></div>

  if (err && !order) return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>⚠️</div>
        <h2 className="display" style={{ textAlign: 'center', fontSize: 22, marginBottom: 8 }}>Link non valido</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 13 }}>{err}</p>
      </div>
    </div>
  )

  if (done) return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ fontSize: 48, textAlign: 'center', marginBottom: 12 }}>✓</div>
        <h2 className="display" style={{ textAlign: 'center', fontSize: 24, marginBottom: 8, color: 'var(--lime)' }}>Promozione approvata</h2>
        <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 13, lineHeight: 1.6 }}>
          {order.user?.name} è stato promosso a <strong style={{ color: 'var(--text)' }}>{order.programName}</strong>.<br />
          Grado attivato e cronostoria aggiornata.
        </p>
        <button onClick={() => nav('/admin')} className="btn-primary" style={{ width: '100%', marginTop: 20 }}>Vai allo Stato Maggiore</button>
      </div>
    </div>
  )

  const detail = (label, value, mono) => (
    <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
      <div style={{ color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={mono ? { fontFamily: 'JetBrains Mono, monospace', fontSize: 12, wordBreak: 'break-all' } : {}}>{value}</div>
    </div>
  )

  return (
    <div style={wrap}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ordine</div>
            <div className="display" style={{ fontSize: 20, fontWeight: 700 }}>{order.id.slice(-8).toUpperCase()}</div>
          </div>
          <span style={{ padding: '4px 10px', background: 'rgba(255,165,2,0.1)', border: '1px solid rgba(255,165,2,0.3)', color: '#ffa502', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, borderRadius: 999 }}>In attesa</span>
        </div>

        {detail('Membro', `${order.user?.name} · ${order.user?.email}`)}
        {detail('Matricola', order.user?.matricola || 'N/D', true)}
        {detail('Grado attuale', order.user?.rank || 'Caporale')}
        {detail('Richiesta', <span style={{ color: 'var(--lime)', fontWeight: 700 }}>{order.programName}</span>)}
        {detail('Importo', `${order.amount} ${order.currency}${order.network ? ` (${order.network})` : ''}`)}
        {order.txHash && detail('TxHash', order.txHash, true)}
        {order.couponCode && detail('Coupon', order.couponCode, true)}
        {order.receiptUrl && detail('Ricevuta', <a href={order.receiptUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--lime)', textDecoration: 'underline' }}>Apri allegato ↗</a>)}

        {err && <div style={{ color: '#ff4757', fontSize: 13, marginTop: 12 }}>{err}</div>}

        <button onClick={approve} disabled={approving} className="btn-primary" style={{ width: '100%', marginTop: 20 }}>
          {approving ? 'Approvazione...' : '✓ Approva e attiva grado'}
        </button>
      </div>
    </div>
  )
}
