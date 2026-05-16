import { useEffect, useState, Component } from 'react'
import { api } from '../lib/api.js'

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { err: null } }
  static getDerivedStateFromError(err) { return { err } }
  componentDidCatch(err, info) { console.error('AdminPanel crash:', err, info) }
  render() {
    if (this.state.err) {
      return (
        <div className="card" style={{ padding: 32, border: '1px solid #ff4757' }}>
          <h2 style={{ color: '#ff4757', margin: '0 0 12px' }}>Errore</h2>
          <pre style={{ color: 'var(--muted)', fontSize: 12, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {String(this.state.err?.message || this.state.err)}
          </pre>
          <button onClick={() => this.setState({ err: null })} className="btn-primary" style={{ marginTop: 16 }}>Riprova</button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function AdminPanel() {
  const [tab, setTab] = useState('overview')
  const [userDetailId, setUserDetailId] = useState(null)

  const tabs = [
    { id: 'overview', label: 'Quadro Generale' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'users', label: 'Utenti' }, { id: 'briefings', label: 'Briefings' },
    { id: 'documents', label: 'Documenti' },
    { id: 'coupons', label: 'Coupon' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'snapshots', label: 'Snapshots' }, { id: 'payouts', label: 'Payouts' },
    { id: 'programs', label: 'Programmi' }, { id: 'settings', label: 'Settings' },
    { id: 'audit', label: 'Audit' },
  ]

  return (
    <ErrorBoundary>
      {userDetailId ? (
        <UserDetail userId={userDetailId} back={() => setUserDetailId(null)} />
      ) : (
        <>
          <h1 className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Stato Maggiore</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Comando operativo</div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid var(--border)', overflowX: 'auto' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                background: 'transparent', border: 'none',
                color: tab === t.id ? 'var(--lime)' : 'var(--muted)',
                padding: '12px 20px', cursor: 'pointer', fontSize: 14, fontWeight: tab === t.id ? 600 : 400,
                borderBottom: tab === t.id ? '2px solid var(--lime)' : '2px solid transparent',
                marginBottom: -1, whiteSpace: 'nowrap',
              }}>{t.label}</button>
            ))}
          </div>
          <ErrorBoundary>
            {tab === 'overview' && <OverviewTab />}
            {tab === 'analytics' && <AnalyticsTab />}
            {tab === 'users' && <UsersTab onSelectUser={setUserDetailId} />}
            {tab === 'briefings' && <BriefingsTab />}
            {tab === 'documents' && <DocumentsTab />}
            {tab === 'coupons' && <CouponsTab />}
            {tab === 'accounts' && <AccountsTab />}
            {tab === 'snapshots' && <SnapshotsTab />}
            {tab === 'payouts' && <PayoutsTab />}
            {tab === 'programs' && <ProgramsTab />}
            {tab === 'settings' && <SettingsTab />}
            {tab === 'audit' && <AuditTab />}
          </ErrorBoundary>
        </>
      )}
    </ErrorBoundary>
  )
}

function OverviewTab() {
  const [data, setData] = useState(null)

  useEffect(() => {
    Promise.all([
      api.alboOnore().catch(() => null),
      api.adminUsers().catch(() => []),
      api.adminPayouts().catch(() => []),
      api.adminBriefings().catch(() => []),
    ]).then(([albo, users, payouts, briefings]) => {
      const pending = users.filter(u => !u.approved && u.role !== 'ADMIN').length
      const pendingPayouts = payouts.filter(p => p.status === 'PENDING').length
      setData({ albo, users, payouts, briefings, pending, pendingPayouts })
    })
  }, [])

  if (!data) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>

  const Stat = ({ label, value, color, sub }) => (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: 6 }}>{label}</div>
      <div className="display" style={{ fontSize: 36, fontWeight: 700, color: color || 'var(--lime)', lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{sub}</div>}
    </div>
  )

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Stato dell'organico</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <Stat label="Membri attivi" value={data.albo?.totalActive ?? 0} sub="In servizio" />
        <Stat label="In attesa approvazione" value={data.pending} color={data.pending > 0 ? '#FF8C00' : 'var(--muted)'} sub={data.pending > 0 ? 'Richiede azione' : 'Nessuna'} />
        <Stat label="Payout pendenti" value={data.pendingPayouts} color={data.pendingPayouts > 0 ? '#FF8C00' : 'var(--muted)'} />
        <Stat label="OdG pubblicati" value={data.briefings.length} sub="Comunicazioni totali" />
      </div>

      {data.albo && (
        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Distribuzione per grado</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {['Caporale','Sergente','Capitano','Colonnello'].map(g => (
              <div key={g} style={{ padding: 14, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{g}</div>
                <div className="display" style={{ fontSize: 26, fontWeight: 700, color: 'var(--lime)', lineHeight: 1 }}>{data.albo.byRank?.[g] ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Azioni rapide</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: 'var(--muted)', lineHeight: 1.8 }}>
          <li>· Pubblica un nuovo Ordine del Giorno dalla tab <strong style={{ color: 'var(--text)' }}>Briefings</strong></li>
          <li>· Approva nuovi membri dalla tab <strong style={{ color: 'var(--text)' }}>Utenti</strong></li>
          <li>· Promuovi e conferisci onorificenze cliccando su un utente</li>
          <li>· Deposita contratti dalla tab <strong style={{ color: 'var(--text)' }}>Documenti</strong></li>
        </ul>
      </div>
    </div>
  )
}

function AnalyticsTab() {
  const [data, setData] = useState(null)
  useEffect(() => { api.adminAnalytics().then(setData).catch(() => {}) }, [])

  const exportAlbo = async () => {
    try {
      const list = await api.adminExportAlbo()
      const csv = [
        Object.keys(list[0] || {}).join(','),
        ...list.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')),
      ].join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `voltra-albo-${new Date().toISOString().slice(0,10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) { alert(e.message) }
  }

  if (!data) return <div style={{ color: 'var(--muted)' }}>Caricamento analytics...</div>

  const maxGrowth = Math.max(...data.growth.map(g => g.count), 1)
  const maxBriefing = Math.max(...data.briefingsPerMonth.map(b => b.count), 1)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Analytics organico</h2>
        <button onClick={exportAlbo} className="btn-secondary" style={{ fontSize: 12, padding: '8px 14px' }}>📥 Esporta Albo (CSV)</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 16 }}>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Organico totale</div>
          <div className="display" style={{ fontSize: 32, color: 'var(--lime)', lineHeight: 1 }}>{data.organico.totale}</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Anzianità media</div>
          <div className="display" style={{ fontSize: 32, lineHeight: 1 }}>{data.organico.avgAnzianita}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>giorni di servizio</div>
        </div>
        <div className="card" style={{ padding: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Onorificenze (12 mesi)</div>
          <div className="display" style={{ fontSize: 32, color: '#E8C84A', lineHeight: 1 }}>{data.decorations.total}</div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Crescita organico (ultimi 12 mesi)</h3>
        {data.growth.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Nessun nuovo arruolamento.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 10 }}>
            {data.growth.map(g => (
              <div key={g.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontSize: 10, color: 'var(--lime)', fontWeight: 600 }}>{g.count}</div>
                <div style={{ width: '80%', height: `${(g.count / maxGrowth) * 90}px`, background: 'var(--lime)', borderRadius: '4px 4px 0 0' }} />
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>{g.month.split('-')[1]}/{g.month.split('-')[0].slice(-2)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Briefing per mese</h3>
        {data.briefingsPerMonth.length === 0 ? (
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>Nessun briefing pubblicato.</div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
            {data.briefingsPerMonth.map(b => (
              <div key={b.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '80%', height: `${(b.count / maxBriefing) * 60}px`, background: 'var(--muted-2)', borderRadius: '3px 3px 0 0' }} />
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>{b.month.split('-')[1]}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {data.topCoupons.length > 0 && (
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Coupon più usati</h3>
          {data.topCoupons.map(c => (
            <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', padding: 8, borderBottom: '1px solid var(--border)' }}>
              <span className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13 }}>{c.code}</span>
              <span style={{ fontSize: 12 }}>{c.used}{c.max ? ` / ${c.max}` : ' usi'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function CouponsTab() {
  const [list, setList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', description: '', discountType: 'percent', discountValue: 10, maxUses: '', validUntil: '' })
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const reload = () => api.adminCoupons().then(setList).catch(() => {})

  useEffect(() => {
    reload()
    api.adminPrograms().then(setPrograms).catch(() => {})
  }, [])

  const generateCode = () => {
    const code = 'VLT-' + Math.random().toString(36).slice(2, 8).toUpperCase()
    setForm({ ...form, code })
  }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      const payload = {
        code: form.code,
        description: form.description || undefined,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        maxUses: form.maxUses ? Number(form.maxUses) : undefined,
        validUntil: form.validUntil || undefined,
      }
      await api.adminCreateCoupon(payload)
      setForm({ code: '', description: '', discountType: 'percent', discountValue: 10, maxUses: '', validUntil: '' })
      setShowForm(false)
      reload()
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  const toggle = async (c) => {
    try { await api.adminUpdateCoupon(c.id, { active: !c.active }); reload() } catch (e) { alert(e.message) }
  }
  const remove = async (id) => {
    if (!confirm('Eliminare il coupon? Le redemptions registrate andranno perse.')) return
    try { await api.adminDeleteCoupon(id); reload() } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{list.length} coupon · {list.filter(c => c.active).length} attivi</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
          {showForm ? 'Annulla' : '+ Nuovo coupon'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <form onSubmit={submit}>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Codice</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="voltra-input" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} required placeholder="ES. WELCOME10" style={{ fontFamily: 'JetBrains Mono, monospace', flex: 1 }} />
                <button type="button" onClick={generateCode} className="btn-secondary" style={{ padding: '0 14px', fontSize: 12, whiteSpace: 'nowrap' }}>Genera</button>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="label">Descrizione (interno)</label>
              <input className="voltra-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Es. Sconto benvenuto Caporale" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div>
                <label className="label">Tipo sconto</label>
                <select className="voltra-input" value={form.discountType} onChange={e => setForm({ ...form, discountType: e.target.value })}>
                  <option value="percent">Percentuale (%)</option>
                  <option value="fixed">Fisso ($)</option>
                </select>
              </div>
              <div>
                <label className="label">Valore</label>
                <input className="voltra-input" type="number" min="1" step="0.01" value={form.discountValue} onChange={e => setForm({ ...form, discountValue: e.target.value })} required />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label">Max usi (vuoto = illimitato)</label>
                <input className="voltra-input" type="number" min="1" value={form.maxUses} onChange={e => setForm({ ...form, maxUses: e.target.value })} placeholder="Illimitato" />
              </div>
              <div>
                <label className="label">Scadenza (opzionale)</label>
                <input className="voltra-input" type="date" value={form.validUntil} onChange={e => setForm({ ...form, validUntil: e.target.value })} />
              </div>
            </div>
            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>{loading ? 'Creazione...' : 'Crea coupon'}</button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>Codice</Th><Th>Sconto</Th><Th>Usi</Th><Th>Scadenza</Th><Th>Stato</Th><Th></Th></tr>
          </thead>
          <tbody>
            {list.map(c => (
              <tr key={c.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td><strong className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--lime)' }}>{c.code}</strong>{c.description && <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.description}</div>}</Td>
                <Td>{c.discountType === 'percent' ? `${c.discountValue}%` : `$${c.discountValue}`}</Td>
                <Td>{c.usedCount}{c.maxUses ? ` / ${c.maxUses}` : ' / ∞'}</Td>
                <Td>{c.validUntil ? new Date(c.validUntil).toLocaleDateString('it-IT') : '—'}</Td>
                <Td><span className={`badge ${c.active ? 'badge-success' : 'badge-warn'}`}>{c.active ? 'Attivo' : 'Disattivato'}</span></Td>
                <Td>
                  <button onClick={() => toggle(c)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 10, marginRight: 4 }}>{c.active ? 'Disattiva' : 'Attiva'}</button>
                  <button onClick={() => remove(c.id)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: 10, borderColor: 'var(--red)', color: 'var(--red)' }}>×</button>
                </Td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun coupon creato.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AuditTab() {
  const [logs, setLogs] = useState([])
  useEffect(() => { api.adminAuditLog().then(setLogs).catch(() => {}) }, [])

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Registro azioni</h2>
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>Quando</Th><Th>Attore</Th><Th>Azione</Th><Th>Dettagli</Th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td><span className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>{new Date(l.createdAt).toLocaleString('it-IT')}</span></Td>
                <Td>{l.actor ? `${l.actor.name} (${l.actor.email})` : '—'}</Td>
                <Td><code style={{ background: 'var(--surface-2)', padding: '2px 6px', borderRadius: 4, fontSize: 11 }}>{l.action}</code></Td>
                <Td><pre style={{ fontSize: 10, margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxWidth: 400 }}>{l.metadata ? JSON.stringify(l.metadata, null, 0) : '—'}</pre></Td>
              </tr>
            ))}
            {logs.length === 0 && <tr><td colSpan="4" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessuna azione registrata.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BriefingsTab() {
  const [list, setList] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: 'ordine_del_giorno', title: '', body: '', pinned: false })
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const reload = () => api.adminBriefings().then(setList).catch(() => {})
  useEffect(() => { reload() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true); setErr('')
    try {
      await api.adminCreateBriefing(form)
      setForm({ type: 'ordine_del_giorno', title: '', body: '', pinned: false })
      setShowForm(false)
      reload()
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  const remove = async (id) => {
    if (!confirm('Eliminare questo briefing?')) return
    try { await api.adminDeleteBriefing(id); reload() } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, gap: 12, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: 'var(--muted)' }}>{list.length} briefing pubblicati</div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
          {showForm ? 'Annulla' : '+ Nuovo Ordine del Giorno'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 20 }}>
          <form onSubmit={submit}>
            <Field label="Titolo" value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <div style={{ marginBottom: 16 }}>
              <label className="label">Tipo</label>
              <select className="voltra-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="ordine_del_giorno">Ordine del Giorno</option>
                <option value="comunicazione">Comunicazione</option>
                <option value="encomio">Encomio</option>
                <option value="ricorrenza">Ricorrenza</option>
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Corpo</label>
              <textarea className="voltra-input" value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required style={{ minHeight: 160, resize: 'vertical' }} />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 16, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} />
              Fissa in cima (pinned)
            </label>
            {err && <div style={{ color: '#ff4757', fontSize: 13, marginBottom: 12 }}>{err}</div>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Pubblicazione...' : 'Pubblica briefing'}
            </button>
          </form>
        </div>
      )}

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>N.</Th><Th>Tipo</Th><Th>Titolo</Th><Th>Data</Th><Th>Pinned</Th><Th></Th></tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td><strong>#{String(b.number || 1).padStart(3, '0')}</strong></Td>
                <Td>{b.type.replace('_', ' ')}</Td>
                <Td>{b.title}</Td>
                <Td>{new Date(b.publishedAt).toLocaleDateString('it-IT')}</Td>
                <Td>{b.pinned ? '📌' : '—'}</Td>
                <Td><button onClick={() => remove(b.id)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--red)', color: 'var(--red)' }}>Elimina</button></Td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun briefing pubblicato.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UserDetail({ userId, back }) {
  const [user, setUser] = useState(null)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editUser, setEditUser] = useState(false)
  const [userForm, setUserForm] = useState({})
  const [snapAccountId, setSnapAccountId] = useState(null)
  const [snapDate, setSnapDate] = useState(new Date().toISOString().split('T')[0])
  const [snapData, setSnapData] = useState({})
  const [addAccount, setAddAccount] = useState(false)
  const [editAccountId, setEditAccountId] = useState(null)

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const u = await api.adminUserDetail(userId)
      const p = await api.adminPrograms().catch(() => [])
      setUser(u)
      setPrograms(Array.isArray(p) ? p : [])
      setUserForm({ name: u?.name || '', email: u?.email || '', notes: u?.notes || '', emailVerified: !!u?.emailVerified, kycVerifiedAt: u?.kycVerifiedAt || null })
    } catch (e) { setError(e.message || 'Errore') }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [userId])

  const saveUser = async () => {
    try { await api.adminUpdateUser(userId, userForm); setEditUser(false); reload() }
    catch (e) { alert(e.message) }
  }

  const deleteUser = async () => {
    if (!confirm(`Eliminare definitivamente l'account di ${user?.name || 'questo utente'}?\n\nVerranno cancellati: profilo, dotazioni, rimborsi, log, decorazioni, notifiche, documenti.\n\nOperazione irreversibile.`)) return
    try {
      await api.adminDeleteUser(userId)
      back()
    } catch (e) { alert(e.message) }
  }

  const saveSnapshot = async () => {
    try {
      if (!snapData.balance || !snapData.equity) { alert('Saldo ed Equity obbligatori'); return }
      const payload = { accountId: snapAccountId, date: snapDate, balance: Number(snapData.balance), equity: Number(snapData.equity) }
      for (const f of ['trades','volume','bestTrade','worstTrade','avgWin','avgLoss','winRatePct','profitFactor']) {
        if (snapData[f] !== '' && snapData[f] != null) payload[f] = Number(snapData[f])
      }
      if (snapData.notes) payload.notes = snapData.notes
      await api.adminCreateSnapshots([payload])
      setSnapAccountId(null); setSnapData({}); reload()
    } catch (e) { alert(e.message) }
  }

  const deleteAccount = async (id) => {
    if (!confirm('Eliminare account?')) return
    try { await api.adminDeleteAccount(id); reload() } catch (e) { alert(e.message) }
  }

  if (loading) return <div style={{ color: 'var(--muted)', padding: 40 }}>Caricamento...</div>
  if (error) return (
    <div className="card" style={{ padding: 24 }}>
      <button onClick={back} className="btn-secondary" style={{ marginBottom: 16 }}>← Indietro</button>
      <div style={{ color: '#ff4757' }}>Errore: {error}</div>
    </div>
  )
  if (!user) return <div><button onClick={back} className="btn-secondary">← Indietro</button><div>Utente non trovato.</div></div>

  const propAccounts = Array.isArray(user.propAccounts) ? user.propAccounts : []
  const payoutRequests = Array.isArray(user.payoutRequests) ? user.payoutRequests : []

  return (
    <div>
      <button onClick={back} className="btn-secondary" style={{ marginBottom: 20 }}>← Torna alla lista</button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px' }}>{user.name || '—'}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>{user.email || '—'} · Registrato {user.createdAt ? new Date(user.createdAt).toLocaleDateString('it-IT') : '—'}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className={`badge ${user.emailVerified ? 'badge-success' : 'badge-warn'}`}>{user.emailVerified ? 'Verificato' : 'Non verificato'}</span>
          {user.kycVerifiedAt && <span className="badge badge-info">KYC OK</span>}
          <button onClick={deleteUser} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12, borderColor: '#ff4757', color: '#ff4757' }}>Elimina account</button>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>📊 Operazioni concluse</h3>
        </div>
        <PurchaseCounter userId={userId} current={user.purchaseCount || 0} onChange={reload} />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>🎖 Gestione grado e onorificenze</h3>
        </div>
        <ManageRankAndDecorations userId={userId} currentRank={user.rank || 'Caporale'} onChange={reload} />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>🔒 Sicurezza accesso</h3>
        </div>
        <SecurityToggle userId={userId} email2faEnabled={!!user.email2faEnabled} onChange={reload} />
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Profilo</h3>
          <button onClick={() => setEditUser(!editUser)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>{editUser ? 'Annulla' : 'Modifica'}</button>
        </div>
        {editUser ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <Field label="Nome" value={userForm.name} onChange={v => setUserForm({ ...userForm, name: v })} />
            <Field label="Email" value={userForm.email} onChange={v => setUserForm({ ...userForm, email: v })} />
            <div style={{ gridColumn: '1/-1' }}>
              <label className="label">Note</label>
              <textarea className="voltra-input" value={userForm.notes || ''} onChange={e => setUserForm({ ...userForm, notes: e.target.value })} rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 16, gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={!!userForm.emailVerified} onChange={e => setUserForm({ ...userForm, emailVerified: e.target.checked })} />
                Email verificata
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={!!userForm.kycVerifiedAt} onChange={e => setUserForm({ ...userForm, kycVerifiedAt: e.target.checked ? new Date().toISOString() : null })} />
                KYC verificato
              </label>
            </div>
            <button onClick={saveUser} className="btn-primary" style={{ gridColumn: '1/-1' }}>Salva</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, fontSize: 14 }}>
            <Info label="Account totali" value={propAccounts.length} />
            <Info label="Attivi" value={propAccounts.filter(a => a.status === 'ACTIVE').length} />
            <Info label="Payout" value={payoutRequests.length} />
            <Info label="Pagati" value={payoutRequests.filter(p => p.status === 'PAID').length} />
            {user.notes && <div style={{ gridColumn: '1/-1' }}><Info label="Note" value={user.notes} /></div>}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Account prop ({propAccounts.length})</h3>
          <button onClick={() => setAddAccount(true)} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>+ Nuovo</button>
        </div>
        {propAccounts.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nessun account.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {propAccounts.map(a => (
              <AccountRow key={a.id} account={a} programs={programs}
                editable={editAccountId === a.id}
                onEdit={() => setEditAccountId(editAccountId === a.id ? null : a.id)}
                onSaved={reload}
                onDelete={() => deleteAccount(a.id)}
                onAddSnapshot={() => setSnapAccountId(a.id)} />
            ))}
          </div>
        )}
      </div>

      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Storico payout ({payoutRequests.length})</h3>
        {payoutRequests.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nessun payout.</div>
        ) : (
          <div style={{ overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead><tr style={{ textAlign: 'left', color: 'var(--muted)' }}><Th>Data</Th><Th>Programma</Th><Th>Importo</Th><Th>Network</Th><Th>Stato</Th></tr></thead>
              <tbody>
                {payoutRequests.map(p => (
                  <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <Td>{p.requestedAt ? new Date(p.requestedAt).toLocaleDateString('it-IT') : '—'}</Td>
                    <Td>{p.account?.program?.name || '—'}</Td>
                    <Td><strong>${Number(p.amountUsd || 0).toLocaleString()}</strong></Td>
                    <Td>{p.cryptoNetwork || '—'}</Td>
                    <Td><span className={`badge ${badgeClass(p.status)}`}>{p.status || '—'}</span></Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {snapAccountId && (
        <Modal onClose={() => { setSnapAccountId(null); setSnapData({}) }}>
          <h3 style={{ margin: '0 0 16px' }}>Inserisci snapshot</h3>
          <Field label="Data" type="date" value={snapDate} onChange={setSnapDate} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Saldo *" type="number" value={snapData.balance || ''} onChange={v => setSnapData({ ...snapData, balance: v })} />
            <Field label="Equity *" type="number" value={snapData.equity || ''} onChange={v => setSnapData({ ...snapData, equity: v })} />
            <Field label="Trades" type="number" value={snapData.trades || ''} onChange={v => setSnapData({ ...snapData, trades: v })} />
            <Field label="Volume" type="number" value={snapData.volume || ''} onChange={v => setSnapData({ ...snapData, volume: v })} />
            <Field label="Best" type="number" value={snapData.bestTrade || ''} onChange={v => setSnapData({ ...snapData, bestTrade: v })} />
            <Field label="Worst" type="number" value={snapData.worstTrade || ''} onChange={v => setSnapData({ ...snapData, worstTrade: v })} />
            <Field label="Avg win" type="number" value={snapData.avgWin || ''} onChange={v => setSnapData({ ...snapData, avgWin: v })} />
            <Field label="Avg loss" type="number" value={snapData.avgLoss || ''} onChange={v => setSnapData({ ...snapData, avgLoss: v })} />
            <Field label="WR %" type="number" value={snapData.winRatePct || ''} onChange={v => setSnapData({ ...snapData, winRatePct: v })} />
            <Field label="PF" type="number" value={snapData.profitFactor || ''} onChange={v => setSnapData({ ...snapData, profitFactor: v })} />
          </div>
          <button onClick={saveSnapshot} className="btn-primary" style={{ width: '100%', marginTop: 12 }}>Salva</button>
        </Modal>
      )}

      {addAccount && (
        <AddAccountModal userId={userId} programs={programs}
          onClose={() => setAddAccount(false)}
          onCreated={() => { setAddAccount(false); reload() }} />
      )}
    </div>
  )
}

function AccountRow({ account, programs, editable, onEdit, onSaved, onDelete, onAddSnapshot }) {
  const snapshots = Array.isArray(account?.snapshots) ? account.snapshots : []
  const snapCount = account?._count?.snapshots ?? snapshots.length

  const [form, setForm] = useState({
    status: account?.status || 'ACTIVE',
    startBalance: account?.startBalance || 0,
    programId: account?.programId || '',
    brokerLogin: account?.brokerLogin || '',
    broker: account?.broker || 'cTrader',
    notes: account?.notes || '',
  })
  const [showSnaps, setShowSnaps] = useState(false)

  if (!account) return null

  const save = async () => {
    try {
      await api.adminUpdateAccount(account.id, {
        status: form.status, startBalance: Number(form.startBalance),
        programId: form.programId, brokerLogin: form.brokerLogin,
        broker: form.broker, notes: form.notes,
      })
      onEdit(); onSaved()
    } catch (e) { alert(e.message) }
  }

  const startBalance = Number(account.startBalance || 0)
  const latestSnap = snapshots[0]
  const equity = latestSnap ? Number(latestSnap.equity) : startBalance
  const profit = equity - startBalance
  const profitPct = startBalance ? (profit / startBalance) * 100 : 0

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span className={`badge ${badgeClass(account.status)}`}>{account.status || 'ACTIVE'}</span>
            <strong>{account.program?.name || '—'}</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Login: {account.brokerLogin || '—'} · {account.broker || '—'} · Init: ${startBalance.toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: profit >= 0 ? 'var(--lime)' : 'var(--red)' }}>
            ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: profit >= 0 ? 'var(--lime)' : 'var(--red)' }}>{profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}%</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button onClick={onAddSnapshot} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>+ Snapshot</button>
        <button onClick={() => setShowSnaps(!showSnaps)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
          {showSnaps ? 'Nascondi' : `Snapshots (${snapCount})`}
        </button>
        <button onClick={onEdit} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>{editable ? 'Annulla' : 'Modifica'}</button>
        <button onClick={onDelete} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, borderColor: 'var(--red)', color: 'var(--red)' }}>Elimina</button>
      </div>

      {editable && (
        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <div>
              <label className="label">Programma</label>
              <select className="voltra-input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })}>
                <option value="">—</option>
                {(programs || []).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stato</label>
              <select className="voltra-input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="ACTIVE">ACTIVE</option><option value="PASSED">PASSED</option>
                <option value="FAILED">FAILED</option><option value="PAID_OUT">PAID_OUT</option>
              </select>
            </div>
            <Field label="Saldo iniziale" type="number" value={form.startBalance} onChange={v => setForm({ ...form, startBalance: v })} />
            <Field label="Login broker" value={form.brokerLogin} onChange={v => setForm({ ...form, brokerLogin: v })} />
            <Field label="Broker" value={form.broker} onChange={v => setForm({ ...form, broker: v })} />
          </div>
          <button onClick={save} className="btn-primary" style={{ marginTop: 12 }}>Salva</button>
        </div>
      )}

      {showSnaps && snapshots.length > 0 && (
        <div style={{ marginTop: 12, maxHeight: 240, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--muted)' }}><Th>Data</Th><Th>Saldo</Th><Th>Equity</Th><Th>P&L</Th><Th>DD%</Th><Th>Trades</Th><Th></Th></tr></thead>
            <tbody>
              {snapshots.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <Td>{s.date ? new Date(s.date).toLocaleDateString('it-IT') : '—'}</Td>
                  <Td>${Number(s.balance || 0).toLocaleString()}</Td>
                  <Td>${Number(s.equity || 0).toLocaleString()}</Td>
                  <Td style={{ color: Number(s.dailyPL || 0) >= 0 ? 'var(--lime)' : 'var(--red)' }}>${Number(s.dailyPL || 0).toFixed(2)}</Td>
                  <Td>{Number(s.drawdownPct || 0).toFixed(2)}%</Td>
                  <Td>{s.trades || 0}</Td>
                  <Td><button onClick={() => api.adminDeleteSnapshot(s.id).then(onSaved).catch(e => alert(e.message))} className="btn-secondary" style={{ padding: '2px 6px', fontSize: 10, borderColor: 'var(--red)', color: 'var(--red)' }}>×</button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function AddAccountModal({ userId, programs, onClose, onCreated }) {
  const [form, setForm] = useState({ programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' })
  const create = async () => {
    try {
      await api.adminCreateAccount({ userId, ...form, startBalance: Number(form.startBalance) })
      onCreated()
    } catch (e) { alert(e.message) }
  }
  return (
    <Modal onClose={onClose}>
      <h3 style={{ margin: '0 0 16px' }}>Nuovo account</h3>
      <div style={{ marginBottom: 12 }}>
        <label className="label">Programma</label>
        <select className="voltra-input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })}>
          <option value="">Seleziona...</option>
          {(programs || []).filter(p => p.active).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <Field label="Login broker" value={form.brokerLogin} onChange={v => setForm({ ...form, brokerLogin: v })} />
      <Field label="Broker" value={form.broker} onChange={v => setForm({ ...form, broker: v })} />
      <Field label="Saldo iniziale" type="number" value={form.startBalance} onChange={v => setForm({ ...form, startBalance: v })} />
      <button onClick={create} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Crea</button>
    </Modal>
  )
}

function UsersTab({ onSelectUser }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = () => {
    setLoading(true)
    api.adminUsers()
      .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false) })
      .catch(e => { setError(e.message); setLoading(false) })
  }
  useEffect(() => { reload() }, [])

  const approve = async (e, id) => {
    e.stopPropagation()
    try {
      await api.adminApproveUser(id)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: true, approvedAt: new Date().toISOString() } : u))
    } catch (err) { alert(err.message) }
  }
  const revoke = async (e, id) => {
    e.stopPropagation()
    try {
      await api.adminRevokeUser(id)
      setUsers(prev => prev.map(u => u.id === id ? { ...u, approved: false, approvedAt: null } : u))
    } catch (err) { alert(err.message) }
  }
  const remove = async (e, id, name) => {
    e.stopPropagation()
    if (!confirm(`Eliminare definitivamente l'account di ${name || 'questo utente'}?\n\nVerranno cancellati: profilo, dotazioni, rimborsi, log, decorazioni, notifiche, documenti.\n\nOperazione irreversibile.`)) return
    try {
      await api.adminDeleteUser(id)
      setUsers(prev => prev.filter(u => u.id !== id))
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  const pending = users.filter(u => u.emailVerified && !u.approved)
  const filtered = users.filter(u => {
    const matchSearch = !search || (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || (filter === 'pending' && u.emailVerified && !u.approved) || (filter === 'approved' && u.approved)
    return matchSearch && matchFilter
  })

  return (
    <div>
      {pending.length > 0 && (
        <div className="card" style={{ marginBottom: 16, padding: 16, background: 'rgba(255,165,2,0.06)', border: '1px solid rgba(255,165,2,0.3)' }}>
          <strong style={{ color: '#ffaa00' }}>⏳ {pending.length} richiesta{pending.length > 1 ? 'e' : ''} in attesa di approvazione</strong>
        </div>
      )}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input className="voltra-input" placeholder="Cerca..." value={search} onChange={e => setSearch(e.target.value)} style={{ maxWidth: 300 }} />
        <select className="voltra-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 'auto' }}>
          <option value="all">Tutti ({users.length})</option>
          <option value="pending">In attesa ({pending.length})</option>
          <option value="approved">Approvati ({users.filter(u => u.approved).length})</option>
        </select>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>Nome</Th><Th>Email</Th><Th>Stato</Th><Th>Accounts</Th><Th>Registrato</Th><Th></Th></tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const accs = Array.isArray(u.propAccounts) ? u.propAccounts : []
              return (
                <tr key={u.id} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => onSelectUser(u.id)}>
                  <Td><strong>{u.name || '—'}</strong></Td>
                  <Td>{u.email || '—'}</Td>
                  <Td>
                    {!u.emailVerified && <span className="badge badge-warn">Email non verificata</span>}
                    {u.emailVerified && !u.approved && <span className="badge badge-pending">In attesa</span>}
                    {u.approved && <span className="badge badge-success">Approvato</span>}
                  </Td>
                  <Td>{accs.filter(a => a.status === 'ACTIVE').length}/{accs.length}</Td>
                  <Td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('it-IT') : '—'}</Td>
                  <Td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {u.emailVerified && !u.approved && (
                        <button onClick={e => approve(e, u.id)} className="btn-primary" style={{ padding: '4px 12px', fontSize: 11 }}>Approva</button>
                      )}
                      {u.approved && (
                        <button onClick={e => revoke(e, u.id)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--red)', color: 'var(--red)' }}>Revoca</button>
                      )}
                      <button onClick={e => { e.stopPropagation(); onSelectUser(u.id) }} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Apri →</button>
                      <button onClick={e => remove(e, u.id, u.name)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: '#ff4757', color: '#ff4757' }} title="Elimina account definitivamente">Elimina</button>
                    </div>
                  </Td>
                </tr>
              )
            })}
            {filtered.length === 0 && <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun utente.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AccountsTab() {
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [programs, setPrograms] = useState([])
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ userId: '', programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' })

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const a = await api.adminAccounts().catch(() => [])
      const u = await api.adminUsers().catch(() => [])
      const p = await api.adminPrograms().catch(() => [])
      setAccounts(Array.isArray(a) ? a : [])
      setUsers(Array.isArray(u) ? u : [])
      setPrograms(Array.isArray(p) ? p : [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const create = async () => {
    try {
      await api.adminCreateAccount({ ...form, startBalance: Number(form.startBalance) })
      setShow(false); setForm({ userId: '', programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' }); reload()
    } catch (e) { alert(e.message) }
  }

  const setStatus = async (id, status) => {
    try { await api.adminUpdateAccount(id, { status }); reload() } catch (e) { alert(e.message) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  return (
    <div>
      <button onClick={() => setShow(true)} className="btn-primary" style={{ marginBottom: 16 }}>+ Nuovo Account</button>
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>Trader</Th><Th>Programma</Th><Th>Login</Th><Th>Saldo</Th><Th>Stato</Th><Th></Th></tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td>{a.user?.name || '—'}<br /><span style={{ color: 'var(--muted)', fontSize: 11 }}>{a.user?.email || ''}</span></Td>
                <Td>{a.program?.name || '—'}</Td>
                <Td>{a.brokerLogin || '—'}</Td>
                <Td>${Number(a.startBalance || 0).toLocaleString()}</Td>
                <Td><span className={`badge ${badgeClass(a.status)}`}>{a.status || '—'}</span></Td>
                <Td>
                  <select value={a.status || 'ACTIVE'} onChange={e => setStatus(a.id, e.target.value)} className="voltra-input" style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}>
                    <option value="ACTIVE">ACTIVE</option><option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option><option value="PAID_OUT">PAID_OUT</option>
                  </select>
                </Td>
              </tr>
            ))}
            {accounts.length === 0 && <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun account.</td></tr>}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal onClose={() => setShow(false)}>
          <h3 style={{ margin: '0 0 16px' }}>Nuovo Account</h3>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Trader</label>
            <select className="voltra-input" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })}>
              <option value="">Seleziona...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label className="label">Programma</label>
            <select className="voltra-input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })}>
              <option value="">Seleziona...</option>
              {programs.filter(p => p.active).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <Field label="Login broker" value={form.brokerLogin} onChange={v => setForm({ ...form, brokerLogin: v })} />
          <Field label="Broker" value={form.broker} onChange={v => setForm({ ...form, broker: v })} />
          <Field label="Saldo iniziale" type="number" value={form.startBalance} onChange={v => setForm({ ...form, startBalance: v })} />
          <button onClick={create} className="btn-primary" style={{ width: '100%' }}>Crea</button>
        </Modal>
      )}
    </div>
  )
}

function SnapshotsTab() {
  const [accounts, setAccounts] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const accs = await api.adminAccounts()
      const active = (Array.isArray(accs) ? accs : []).filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      const init = {}
      active.forEach(a => { init[a.id] = { balance: '', equity: '', trades: '', volume: '', bestTrade: '', worstTrade: '', winRatePct: '', profitFactor: '' } })
      setData(init)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const update = (id, field, v) => setData(d => ({ ...d, [id]: { ...(d[id] || {}), [field]: v } }))

  const saveAll = async () => {
    setSaving(true); setMsg('')
    try {
      const payload = accounts
        .filter(a => data[a.id]?.balance && data[a.id]?.equity)
        .map(a => {
          const f = data[a.id]
          const out = { accountId: a.id, date, balance: Number(f.balance), equity: Number(f.equity) }
          for (const k of ['trades','volume','bestTrade','worstTrade','winRatePct','profitFactor']) {
            if (f[k] !== '' && f[k] != null) out[k] = Number(f[k])
          }
          return out
        })
      if (payload.length === 0) { setMsg('Compila almeno saldo+equity'); setSaving(false); return }
      const r = await api.adminCreateSnapshots(payload)
      setMsg(`Salvati ${Array.isArray(r) ? r.length : 0} snapshot`)
      reload()
    } catch (e) { setMsg('Errore: ' + e.message) }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label className="label">Data</label>
          <input type="date" className="voltra-input" value={date} onChange={e => setDate(e.target.value)} style={{ width: 160 }} />
        </div>
        <button onClick={saveAll} className="btn-primary" disabled={saving}>{saving ? '...' : 'Salva tutti'}</button>
        {msg && <span style={{ color: msg.startsWith('Errore') || msg.startsWith('Compila') ? 'var(--red)' : 'var(--lime)', fontSize: 13 }}>{msg}</span>}
      </div>
      {accounts.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun account attivo.</div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 12 }}>
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr style={{ textAlign: 'left' }}><Th>Trader</Th><Th>Saldo*</Th><Th>Equity*</Th><Th>Trades</Th><Th>Volume</Th><Th>Best</Th><Th>Worst</Th><Th>WR%</Th><Th>PF</Th></tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <Td style={{ minWidth: 160 }}>
                    <strong>{a.user?.name || '—'}</strong><br />
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>{a.brokerLogin || '—'} · {a.program?.name || '—'}</span>
                  </Td>
                  {['balance','equity','trades','volume','bestTrade','worstTrade','winRatePct','profitFactor'].map(f => (
                    <Td key={f}>
                      <input className="voltra-input" type="number" step="0.01" value={data[a.id]?.[f] || ''} onChange={e => update(a.id, f, e.target.value)} style={{ width: 90, padding: '6px 8px', fontSize: 12 }} />
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function PayoutsTab() {
  const [payouts, setPayouts] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const d = await api.adminPayouts(filter)
      setPayouts(Array.isArray(d) ? d : [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [filter])

  const action = async (id, status) => {
    let txHash = '', rejectionReason = ''
    if (status === 'PAID') { txHash = prompt('TX hash:') || ''; if (!txHash) return }
    if (status === 'REJECTED') { rejectionReason = prompt('Motivo:') || ''; if (!rejectionReason) return }
    try { await api.adminUpdatePayout(id, { status, txHash, rejectionReason }); reload() }
    catch (e) { alert(e.message) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Filtro</label>
        <select className="voltra-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 200 }}>
          <option value="">Tutti</option>
          <option value="PENDING">Pending</option><option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option><option value="REJECTED">Rejected</option>
        </select>
      </div>
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}><Th>Data</Th><Th>Trader</Th><Th>Account</Th><Th>Importo</Th><Th>Network</Th><Th>Indirizzo</Th><Th>Stato</Th><Th></Th></tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td>{p.requestedAt ? new Date(p.requestedAt).toLocaleDateString('it-IT') : '—'}</Td>
                <Td>{p.user?.name || '—'}<br /><span style={{ color: 'var(--muted)', fontSize: 11 }}>{p.user?.email || ''}</span></Td>
                <Td>{p.account?.brokerLogin || '—'}</Td>
                <Td><strong>${Number(p.amountUsd || 0).toLocaleString()}</strong></Td>
                <Td>{p.cryptoNetwork || '—'}</Td>
                <Td style={{ maxWidth: 240, wordBreak: 'break-all', fontSize: 11 }}>{p.cryptoAddress || '—'}</Td>
                <Td><span className={`badge ${badgeClass(p.status)}`}>{p.status || '—'}</span></Td>
                <Td>
                  {p.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => action(p.id, 'APPROVED')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>OK</button>
                      <button onClick={() => action(p.id, 'REJECTED')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--red)', color: 'var(--red)' }}>X</button>
                    </div>
                  )}
                  {p.status === 'APPROVED' && (
                    <button onClick={() => action(p.id, 'PAID')} className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>Pagato</button>
                  )}
                </Td>
              </tr>
            ))}
            {payouts.length === 0 && <tr><td colSpan="8" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessuna richiesta.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ProgramsTab() {
  const [programs, setPrograms] = useState([])
  const [show, setShow] = useState(false)
  const [edit, setEdit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const emptyForm = () => ({
    name: '', accountSize: '', phase: 'CHALLENGE',
    profitTargetPct: '', maxDailyLossPct: '', maxOverallLossPct: '',
    minTradingDays: '', profitSplitPct: '70', payoutFrequencyDays: '7',
    scalpingAllowed: true, newsAllowed: true, weekendHoldAllowed: true,
    priceUsd: '', activationFeeUsd: '',
  })
  const [form, setForm] = useState(emptyForm())

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const d = await api.adminPrograms()
      setPrograms(Array.isArray(d) ? d : [])
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const submit = async () => {
    try {
      const data = {
        name: form.name, accountSize: Number(form.accountSize), phase: form.phase,
        profitTargetPct: form.profitTargetPct ? Number(form.profitTargetPct) : null,
        maxDailyLossPct: Number(form.maxDailyLossPct),
        maxOverallLossPct: Number(form.maxOverallLossPct),
        minTradingDays: form.minTradingDays ? Number(form.minTradingDays) : null,
        profitSplitPct: Number(form.profitSplitPct),
        payoutFrequencyDays: Number(form.payoutFrequencyDays || 7),
        scalpingAllowed: !!form.scalpingAllowed,
        newsAllowed: !!form.newsAllowed,
        weekendHoldAllowed: !!form.weekendHoldAllowed,
        priceUsd: form.priceUsd ? Number(form.priceUsd) : null,
        activationFeeUsd: form.activationFeeUsd ? Number(form.activationFeeUsd) : null,
      }
      if (edit) await api.adminUpdateProgram(edit, data)
      else await api.adminCreateProgram(data)
      setShow(false); setEdit(null); setForm(emptyForm()); reload()
    } catch (e) { alert(e.message) }
  }

  const openEdit = (p) => {
    setEdit(p.id)
    setForm({
      name: p.name || '', accountSize: p.accountSize || '', phase: p.phase || 'CHALLENGE',
      profitTargetPct: p.profitTargetPct ?? '',
      maxDailyLossPct: p.maxDailyLossPct || '',
      maxOverallLossPct: p.maxOverallLossPct || '',
      minTradingDays: p.minTradingDays ?? '',
      profitSplitPct: p.profitSplitPct || '70',
      payoutFrequencyDays: p.payoutFrequencyDays || 7,
      scalpingAllowed: p.scalpingAllowed !== false,
      newsAllowed: p.newsAllowed !== false,
      weekendHoldAllowed: p.weekendHoldAllowed !== false,
      priceUsd: p.priceUsd ?? '',
      activationFeeUsd: p.activationFeeUsd ?? '',
    })
    setShow(true)
  }

  const toggleActive = async (p) => {
    try { await api.adminUpdateProgram(p.id, { active: !p.active }); reload() }
    catch (e) { alert(e.message) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  return (
    <div>
      <button onClick={() => { setEdit(null); setForm(emptyForm()); setShow(true) }} className="btn-primary" style={{ marginBottom: 16 }}>+ Nuovo Programma</button>
      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Nome</Th><Th>Phase</Th><Th>Size</Th><Th>Target</Th><Th>DLL</Th><Th>MLL</Th><Th>Split</Th><Th>Payout</Th><Th>Regole</Th><Th>Prezzo</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)', opacity: p.active ? 1 : 0.5 }}>
                <Td>{p.name || '—'}</Td>
                <Td><span className="badge badge-info">{p.phase || '—'}</span></Td>
                <Td>${Number(p.accountSize || 0).toLocaleString()}</Td>
                <Td>{p.profitTargetPct ? `${p.profitTargetPct}%` : '—'}</Td>
                <Td>{p.maxDailyLossPct || 0}%</Td>
                <Td>{p.maxOverallLossPct || 0}%</Td>
                <Td>{p.profitSplitPct || 0}%</Td>
                <Td>{p.payoutFrequencyDays || 7}gg</Td>
                <Td style={{ fontSize: 10 }}>
                  {p.scalpingAllowed && <span className="badge badge-success" style={{ marginRight: 2 }}>SC</span>}
                  {p.newsAllowed && <span className="badge badge-success" style={{ marginRight: 2 }}>NE</span>}
                  {p.weekendHoldAllowed && <span className="badge badge-success">WK</span>}
                </Td>
                <Td>${Number(p.priceUsd || 0)}</Td>
                <Td>
                  <button onClick={() => openEdit(p)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, marginRight: 4 }}>Edit</button>
                  <button onClick={() => toggleActive(p)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>{p.active ? 'Off' : 'On'}</button>
                </Td>
              </tr>
            ))}
            {programs.length === 0 && <tr><td colSpan="11" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun programma.</td></tr>}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal onClose={() => setShow(false)}>
          <h3 style={{ margin: '0 0 16px' }}>{edit ? 'Modifica' : 'Nuovo'} Programma</h3>
          <Field label="Nome" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Field label="Account Size ($)" type="number" value={form.accountSize} onChange={v => setForm({ ...form, accountSize: v })} />
          <div style={{ marginBottom: 12 }}>
            <label className="label">Phase</label>
            <select className="voltra-input" value={form.phase} onChange={e => setForm({ ...form, phase: e.target.value })}>
              <option value="CHALLENGE">CHALLENGE</option><option value="VERIFICATION">VERIFICATION</option>
              <option value="FUNDED">FUNDED</option><option value="INSTANT">INSTANT</option>
            </select>
          </div>
          <Field label="Profit Target % (opzionale)" type="number" value={form.profitTargetPct} onChange={v => setForm({ ...form, profitTargetPct: v })} />
          <Field label="Max Daily Loss %" type="number" value={form.maxDailyLossPct} onChange={v => setForm({ ...form, maxDailyLossPct: v })} />
          <Field label="Max Overall Loss %" type="number" value={form.maxOverallLossPct} onChange={v => setForm({ ...form, maxOverallLossPct: v })} />
          <Field label="Min Trading Days" type="number" value={form.minTradingDays} onChange={v => setForm({ ...form, minTradingDays: v })} />
          <Field label="Profit Split %" type="number" value={form.profitSplitPct} onChange={v => setForm({ ...form, profitSplitPct: v })} />
          <Field label="Payout ogni (giorni)" type="number" value={form.payoutFrequencyDays} onChange={v => setForm({ ...form, payoutFrequencyDays: v })} />
          <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div className="label">Regole</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={!!form.scalpingAllowed} onChange={e => setForm({ ...form, scalpingAllowed: e.target.checked })} />Scalping
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={!!form.newsAllowed} onChange={e => setForm({ ...form, newsAllowed: e.target.checked })} />News trading
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={!!form.weekendHoldAllowed} onChange={e => setForm({ ...form, weekendHoldAllowed: e.target.checked })} />Weekend hold
            </label>
          </div>
          <Field label="Prezzo ($)" type="number" value={form.priceUsd} onChange={v => setForm({ ...form, priceUsd: v })} />
          <Field label="Activation Fee" type="number" value={form.activationFeeUsd} onChange={v => setForm({ ...form, activationFeeUsd: v })} />
          <button onClick={submit} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>{edit ? 'Salva' : 'Crea'}</button>
        </Modal>
      )}
    </div>
  )
}

function DocumentsTab() {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState('')
  const [docs, setDocs] = useState([])
  const [form, setForm] = useState({ category: 'contract', title: '', description: '', fileUrl: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.adminUsers().then(setUsers).catch(() => {})
  }, [])

  useEffect(() => {
    if (selectedUser) api.adminUserDocuments(selectedUser).then(setDocs).catch(() => {})
    else setDocs([])
  }, [selectedUser])

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.adminUploadDocument(selectedUser, form)
      setForm({ category: 'contract', title: '', description: '', fileUrl: '' })
      setShowForm(false)
      api.adminUserDocuments(selectedUser).then(setDocs).catch(() => {})
    } catch (e) { alert(e.message) } finally { setLoading(false) }
  }

  const remove = async (id) => {
    if (!confirm('Eliminare questo documento?')) return
    try {
      await api.adminDeleteDocument(id)
      api.adminUserDocuments(selectedUser).then(setDocs).catch(() => {})
    } catch (e) { alert(e.message) }
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label className="label">Membro</label>
        <select className="voltra-input" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} style={{ maxWidth: 400 }}>
          <option value="">— Seleziona membro —</option>
          {users.filter(u => u.approved).map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
        </select>
      </div>

      {selectedUser && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{docs.length} documenti</div>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
              {showForm ? 'Annulla' : '+ Deposita documento'}
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <form onSubmit={submit}>
                <div style={{ marginBottom: 12 }}>
                  <label className="label">Categoria</label>
                  <select className="voltra-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option value="contract">Contratto</option>
                    <option value="certificate">Attestato</option>
                    <option value="receipt">Ricevuta</option>
                    <option value="other">Altro</option>
                  </select>
                </div>
                <Field label="Titolo" value={form.title} onChange={v => setForm({ ...form, title: v })} />
                <div style={{ marginBottom: 12 }}>
                  <label className="label">Descrizione (opzionale)</label>
                  <textarea className="voltra-input" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} />
                </div>
                <Field label="URL file (opzionale, es. link Drive/Dropbox)" value={form.fileUrl} onChange={v => setForm({ ...form, fileUrl: v })} />
                <button type="submit" className="btn-primary" disabled={loading || !form.title}>
                  {loading ? 'In corso...' : 'Deposita'}
                </button>
              </form>
            </div>
          )}

          <div className="card" style={{ padding: 0, overflow: 'auto' }}>
            <table style={{ width: '100%', fontSize: 13 }}>
              <thead style={{ background: 'var(--surface-2)' }}>
                <tr style={{ textAlign: 'left' }}><Th>Categoria</Th><Th>Titolo</Th><Th>Data</Th><Th>Firmato</Th><Th></Th></tr>
              </thead>
              <tbody>
                {docs.map(d => (
                  <tr key={d.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <Td>{d.category}</Td>
                    <Td>{d.title}</Td>
                    <Td>{new Date(d.uploadedAt).toLocaleDateString('it-IT')}</Td>
                    <Td>{d.signed ? `✓ ${new Date(d.signedAt).toLocaleDateString('it-IT')}` : '—'}</Td>
                    <Td><button onClick={() => remove(d.id)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--red)', color: 'var(--red)' }}>Elimina</button></Td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan="5" style={{ padding: 24, textAlign: 'center', color: 'var(--muted)' }}>Nessun documento.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function SecurityToggle({ userId, email2faEnabled, onChange }) {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  const toggle = async () => {
    const want = !email2faEnabled
    if (!confirm(want ? 'Attivare la verifica via email per questo utente? Riceverà notifica e dovrà usare il codice ad ogni accesso.' : 'Disattivare la verifica via email?')) return
    setBusy(true)
    try {
      await api.adminToggleUserEmail2fa(userId, want)
      setMsg(want ? 'Verifica via email attivata. Utente notificato.' : 'Verifica via email disattivata.')
      onChange()
      setTimeout(() => setMsg(''), 4000)
    } catch (e) { alert(e.message) } finally { setBusy(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Verifica via email (2FA)</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {email2faEnabled ? 'Attiva — l\'utente riceve un codice via email ad ogni accesso' : 'Non attiva'}
          </div>
        </div>
        <button onClick={toggle} disabled={busy} className={email2faEnabled ? 'btn-secondary' : 'btn-primary'} style={{ fontSize: 12, padding: '8px 14px' }}>
          {busy ? '...' : email2faEnabled ? 'Disattiva' : 'Attiva per questo utente'}
        </button>
      </div>
      {msg && <div style={{ marginTop: 8, padding: 10, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 8, color: 'var(--lime)', fontSize: 12 }}>{msg}</div>}
    </div>
  )
}

function ManageRankAndDecorations({ userId, currentRank, onChange }) {
  const [decorations, setDecorations] = useState([])
  const [showPromote, setShowPromote] = useState(false)
  const [showAward, setShowAward] = useState(false)
  const [promoteData, setPromoteData] = useState({ rank: '', reason: '' })
  const [awardData, setAwardData] = useState({ decorationId: '', reason: '' })
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => { api.adminDecorations().then(setDecorations).catch(() => {}) }, [])

  const promote = async () => {
    if (!promoteData.rank) { alert('Seleziona il grado'); return }
    setBusy(true)
    try {
      await api.adminPromoteUser(userId, promoteData)
      setMsg(`Promozione a ${promoteData.rank} disposta. Notifica inviata al membro.`)
      setPromoteData({ rank: '', reason: '' })
      setShowPromote(false)
      onChange()
      setTimeout(() => setMsg(''), 4000)
    } catch (e) { alert(e.message) } finally { setBusy(false) }
  }

  const award = async () => {
    if (!awardData.decorationId) { alert('Seleziona l\'onorificenza'); return }
    setBusy(true)
    try {
      await api.adminAwardDecoration({ userId, ...awardData })
      setMsg('Onorificenza conferita. Notifica inviata al membro.')
      setAwardData({ decorationId: '', reason: '' })
      setShowAward(false)
      onChange()
      setTimeout(() => setMsg(''), 4000)
    } catch (e) { alert(e.message) } finally { setBusy(false) }
  }

  const RANKS = ['Caporale', 'Sergente', 'Capitano', 'Colonnello']

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
        <div style={{ fontSize: 13 }}>
          <span style={{ color: 'var(--muted)' }}>Grado attuale: </span>
          <strong style={{ color: 'var(--lime)' }}>{currentRank}</strong>
        </div>
      </div>

      {msg && (
        <div style={{ padding: 12, background: 'rgba(180,255,57,0.06)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 8, color: 'var(--lime)', fontSize: 13, marginBottom: 12 }}>
          {msg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <button onClick={() => { setShowPromote(!showPromote); setShowAward(false) }} className="btn-primary" style={{ fontSize: 12, padding: '8px 14px' }}>
          {showPromote ? 'Annulla promozione' : '🎖 Promuovi'}
        </button>
        <button onClick={() => { setShowAward(!showAward); setShowPromote(false) }} className="btn-secondary" style={{ fontSize: 12, padding: '8px 14px' }}>
          {showAward ? 'Annulla conferimento' : '⚜ Conferisci onorificenza'}
        </button>
      </div>

      {showPromote && (
        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <label className="label">Nuovo grado</label>
          <select className="voltra-input" value={promoteData.rank} onChange={e => setPromoteData({ ...promoteData, rank: e.target.value })}>
            <option value="">— Seleziona —</option>
            {RANKS.filter(r => r !== currentRank).map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <label className="label" style={{ marginTop: 12 }}>Motivazione (opzionale)</label>
          <textarea className="voltra-input" value={promoteData.reason} onChange={e => setPromoteData({ ...promoteData, reason: e.target.value })} rows={2} style={{ marginBottom: 12 }} />
          <button onClick={promote} disabled={busy} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
            {busy ? 'In corso...' : 'Disponi promozione'}
          </button>
        </div>
      )}

      {showAward && (
        <div style={{ padding: 16, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
          <label className="label">Onorificenza</label>
          <select className="voltra-input" value={awardData.decorationId} onChange={e => setAwardData({ ...awardData, decorationId: e.target.value })}>
            <option value="">— Seleziona —</option>
            {decorations.map(d => <option key={d.id} value={d.id}>{d.iconKey} {d.name}</option>)}
          </select>
          <label className="label" style={{ marginTop: 12 }}>Motivazione (opzionale)</label>
          <textarea className="voltra-input" value={awardData.reason} onChange={e => setAwardData({ ...awardData, reason: e.target.value })} rows={2} style={{ marginBottom: 12 }} />
          <button onClick={award} disabled={busy} className="btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
            {busy ? 'In corso...' : 'Conferisci'}
          </button>
        </div>
      )}
    </div>
  )
}

function SettingsTab() {
  const [settings, setSettings] = useState([])
  const [edit, setEdit] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const reload = async () => {
    setLoading(true); setError('')
    try {
      const s = await api.adminSettings()
      const arr = Array.isArray(s) ? s : []
      setSettings(arr)
      setEdit(arr.reduce((a, x) => ({ ...a, [x.key]: x.value || '' }), {}))
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const groups = [
    { title: 'Email', items: [
      { key: 'SUPPORT_EMAIL', label: 'Email supporto', help: 'Riceve i form contatti' },
      { key: 'EMAIL_FROM', label: 'Email mittente', help: 'Es. Voltra <noreply@voltrasolutions.com>' },
    ]},
    { title: 'Telegram', items: [
      { key: 'TELEGRAM_SUPPORT_URL', label: 'Link Telegram pubblico' },
      { key: 'TELEGRAM_SUPPORT_HANDLE', label: 'Handle Telegram' },
      { key: 'TELEGRAM_ADMIN_CHAT_ID', label: 'Chat ID admin' },
    ]},
    { title: 'Pagamenti', items: [
      { key: 'PAYMENT_ADDRESS', label: 'Indirizzo wallet' },
      { key: 'PAYMENT_NETWORK', label: 'Network' },
    ]},
    { title: 'Effetti', items: [
      { key: 'GUNSHOT_DISABLED', label: 'Disabilita effetto sparo globalmente', help: 'Mettere "true" per disattivare per TUTTI gli utenti. "false" lascia decidere a ciascuno dalle proprie impostazioni.', type: 'toggle' },
    ]},
  ]

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const items = settings.map(s => ({ key: s.key, value: edit[s.key] ?? '', isPublic: !!s.isPublic }))
      await api.adminBulkSettings(items)
      setMsg('Salvato')
      reload()
    } catch (e) { setMsg('Errore: ' + e.message) }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000) }
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (error) return <div className="card" style={{ padding: 24, color: '#ff4757' }}>Errore: {error}</div>

  return (
    <div style={{ maxWidth: 720 }}>
      {groups.map(g => (
        <div key={g.title} className="card" style={{ marginBottom: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--lime)' }}>{g.title}</h3>
          {g.items.map(item => (
            <div key={item.key} style={{ marginBottom: 16 }}>
              <label className="label">{item.label}</label>
              {item.type === 'toggle' ? (
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button
                    type="button"
                    onClick={() => setEdit({ ...edit, [item.key]: 'false' })}
                    className={(edit[item.key] || 'false') === 'false' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '8px 16px', fontSize: 13 }}
                  >Attivo per tutti</button>
                  <button
                    type="button"
                    onClick={() => setEdit({ ...edit, [item.key]: 'true' })}
                    className={(edit[item.key] || 'false') === 'true' ? 'btn-primary' : 'btn-secondary'}
                    style={{ padding: '8px 16px', fontSize: 13 }}
                  >Disabilitato per tutti</button>
                </div>
              ) : (
                <input className="voltra-input" value={edit[item.key] || ''} onChange={e => setEdit({ ...edit, [item.key]: e.target.value })} placeholder={item.help || ''} />
              )}
              {item.help && <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 4 }}>{item.help}</div>}
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={save} className="btn-primary" disabled={saving}>{saving ? '...' : 'Salva'}</button>
        {msg && <span style={{ color: msg.startsWith('Errore') ? 'var(--red)' : 'var(--lime)', fontSize: 13 }}>{msg}</span>}
      </div>
    </div>
  )
}

function badgeClass(status) {
  switch (status) {
    case 'ACTIVE': case 'PAID': case 'OK': case 'SUCCEEDED': return 'badge-success'
    case 'FAILED': case 'REJECTED': return 'badge-fail'
    case 'PASSED': case 'APPROVED': return 'badge-info'
    default: return 'badge-pending'
  }
}
function Th({ children }) {
  return <th style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>
}
function Td({ children, style }) {
  return <td style={{ padding: '12px 16px', ...style }}>{children}</td>
}
function Modal({ onClose, children }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 }} onClick={onClose}>
      <div className="card" style={{ maxWidth: 500, width: '100%', padding: 28, maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
function Field({ label, value, onChange, type = 'text' }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="label">{label}</label>
      <input className="voltra-input" type={type} value={value ?? ''} onChange={e => onChange?.(e.target.value)} />
    </div>
  )
}
function Info({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600 }}>{value}</div>
    </div>
  )
}

function PurchaseCounter({ userId, current, onChange }) {
  const [count, setCount] = useState(current)
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(current)
  const [saving, setSaving] = useState(false)

  useEffect(() => { setCount(current); setVal(current) }, [current])

  const THRESHOLDS = [
    { name: 'Compiacimento', t: 3 },
    { name: 'Elogio', t: 6 },
    { name: 'Stella di Bronzo', t: 15 },
    { name: 'Encomio Semplice', t: 17 },
    { name: 'Stella di Argento', t: 30 },
    { name: 'Encomio Solenne', t: 40 },
    { name: 'Stella d\'Oro', t: 60 },
  ]
  const next = THRESHOLDS.find(x => x.t > count)

  const save = async () => {
    setSaving(true)
    try {
      const n = Number(val)
      if (isNaN(n) || n < 0) throw new Error('Valore non valido')
      await api.adminSetPurchases(userId, n)
      setCount(n)
      setEditing(false)
      onChange?.()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  const adjust = async (delta) => {
    setSaving(true)
    try {
      const n = Math.max(0, count + delta)
      await api.adminSetPurchases(userId, n)
      setCount(n)
      setVal(n)
      onChange?.()
    } catch (e) { alert(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="display" style={{ fontSize: 36, fontWeight: 700, color: 'var(--lime)', lineHeight: 1 }}>{count}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Operazioni concluse</div>
        </div>
        {next && (
          <div style={{ flex: 1, minWidth: 200, padding: '8px 14px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Prossima soglia</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{next.name} — {next.t - count} a soglia</div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => adjust(-1)} disabled={saving || count === 0} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>−1</button>
        <button onClick={() => adjust(+1)} disabled={saving} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>+1</button>
        {editing ? (
          <>
            <input className="voltra-input" type="number" value={val} onChange={e => setVal(e.target.value)} style={{ width: 100, padding: '6px 10px', fontSize: 13 }} />
            <button onClick={save} disabled={saving} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>{saving ? '...' : 'Salva'}</button>
            <button onClick={() => { setEditing(false); setVal(count) }} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>Annulla</button>
          </>
        ) : (
          <button onClick={() => setEditing(true)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>Imposta manualmente</button>
        )}
      </div>
    </div>
  )
}
