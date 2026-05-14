import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function AdminPanel() {
  const [tab, setTab] = useState('accounts')

  return (
    <div>
      <h1 style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700 }}>Admin Panel</h1>
      <div style={{ color: 'var(--voltra-muted)', fontSize: 14, marginBottom: 24 }}>Gestione trader, account, snapshot e payout</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--voltra-border)' }}>
        {[
          { id: 'accounts', label: 'Accounts' },
          { id: 'snapshots', label: 'Snapshots' },
          { id: 'payouts', label: 'Payouts' },
          { id: 'users', label: 'Utenti' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'transparent',
            border: 'none',
            color: tab === t.id ? 'var(--voltra-lime)' : 'var(--voltra-muted)',
            padding: '12px 20px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: tab === t.id ? 600 : 400,
            borderBottom: tab === t.id ? '2px solid var(--voltra-lime)' : '2px solid transparent',
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      {tab === 'accounts' && <AccountsTab />}
      {tab === 'snapshots' && <SnapshotsTab />}
      {tab === 'payouts' && <PayoutsTab />}
      {tab === 'users' && <UsersTab />}
    </div>
  )
}

function AccountsTab() {
  const [accounts, setAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [programs, setPrograms] = useState([])
  const [show, setShow] = useState(false)
  const [form, setForm] = useState({ userId: '', programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' })

  const reload = () => {
    api.adminAccounts().then(setAccounts)
    api.adminUsers().then(setUsers)
    api.adminPrograms().then(setPrograms)
  }

  useEffect(reload, [])

  const create = async () => {
    await api.adminCreateAccount({ ...form, startBalance: Number(form.startBalance) })
    setShow(false)
    setForm({ userId: '', programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' })
    reload()
  }

  const setStatus = async (id, status) => {
    await api.adminUpdateAccount(id, { status })
    reload()
  }

  return (
    <div>
      <button onClick={() => setShow(true)} className="voltra-btn-primary" style={{ marginBottom: 16 }}>+ Nuovo Account</button>

      <div className="voltra-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: '#0f0f0f' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Trader</Th><Th>Programma</Th><Th>Login</Th><Th>Saldo iniziale</Th><Th>Stato</Th><Th>Azioni</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <Td>{a.user.name}<br /><span style={{ color: 'var(--voltra-muted)', fontSize: 11 }}>{a.user.email}</span></Td>
                <Td>{a.program.name}</Td>
                <Td>{a.brokerLogin}</Td>
                <Td>${Number(a.startBalance).toLocaleString()}</Td>
                <Td>
                  <span className={`badge ${
                    a.status === 'ACTIVE' ? 'badge-success' :
                    a.status === 'PASSED' ? 'badge-info' :
                    a.status === 'FAILED' ? 'badge-fail' : 'badge-pending'
                  }`}>{a.status}</span>
                </Td>
                <Td>
                  <select value={a.status} onChange={e => setStatus(a.id, e.target.value)} className="voltra-input" style={{ padding: '4px 8px', fontSize: 12 }}>
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="PASSED">PASSED</option>
                    <option value="FAILED">FAILED</option>
                    <option value="PAID_OUT">PAID_OUT</option>
                  </select>
                </Td>
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr><td colSpan="6" style={{ padding: 32, textAlign: 'center', color: 'var(--voltra-muted)' }}>Nessun account ancora.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {show && (
        <Modal onClose={() => setShow(false)}>
          <h3>Nuovo Account</h3>
          <label className="voltra-label">Trader</label>
          <select className="voltra-input" value={form.userId} onChange={e => setForm({ ...form, userId: e.target.value })} style={{ marginBottom: 12 }}>
            <option value="">Seleziona...</option>
            {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.email})</option>)}
          </select>

          <label className="voltra-label">Programma</label>
          <select className="voltra-input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })} style={{ marginBottom: 12 }}>
            <option value="">Seleziona...</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <label className="voltra-label">Login broker</label>
          <input className="voltra-input" value={form.brokerLogin} onChange={e => setForm({ ...form, brokerLogin: e.target.value })} style={{ marginBottom: 12 }} />

          <label className="voltra-label">Broker</label>
          <input className="voltra-input" value={form.broker} onChange={e => setForm({ ...form, broker: e.target.value })} style={{ marginBottom: 12 }} />

          <label className="voltra-label">Saldo iniziale</label>
          <input className="voltra-input" type="number" value={form.startBalance} onChange={e => setForm({ ...form, startBalance: e.target.value })} style={{ marginBottom: 16 }} />

          <button onClick={create} className="voltra-btn-primary" style={{ width: '100%' }}>Crea Account</button>
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

  useEffect(() => {
    api.adminAccounts().then(accs => {
      const active = accs.filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      const init = {}
      active.forEach(a => {
        init[a.id] = { balance: '', equity: '', trades: '', volume: '', bestTrade: '', worstTrade: '', avgWin: '', avgLoss: '', winRatePct: '', profitFactor: '' }
      })
      setData(init)
    })
  }, [])

  const update = (accId, field, value) => {
    setData(d => ({ ...d, [accId]: { ...d[accId], [field]: value } }))
  }

  const saveAll = async () => {
    setSaving(true); setMsg('')
    try {
      const payload = accounts
        .filter(a => data[a.id]?.balance && data[a.id]?.equity)
        .map(a => ({
          accountId: a.id,
          date,
          balance: Number(data[a.id].balance),
          equity: Number(data[a.id].equity),
          trades: data[a.id].trades ? Number(data[a.id].trades) : undefined,
          volume: data[a.id].volume ? Number(data[a.id].volume) : undefined,
          bestTrade: data[a.id].bestTrade ? Number(data[a.id].bestTrade) : undefined,
          worstTrade: data[a.id].worstTrade ? Number(data[a.id].worstTrade) : undefined,
          avgWin: data[a.id].avgWin ? Number(data[a.id].avgWin) : undefined,
          avgLoss: data[a.id].avgLoss ? Number(data[a.id].avgLoss) : undefined,
          winRatePct: data[a.id].winRatePct ? Number(data[a.id].winRatePct) : undefined,
          profitFactor: data[a.id].profitFactor ? Number(data[a.id].profitFactor) : undefined,
        }))
      if (payload.length === 0) { setMsg('Niente da salvare'); return }
      await api.adminCreateSnapshots(payload)
      setMsg(`Salvati ${payload.length} snapshot`)
    } catch (e) {
      setMsg('Errore: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label className="voltra-label">Data</label>
          <input type="date" className="voltra-input" value={date} onChange={e => setDate(e.target.value)} style={{ width: 160 }} />
        </div>
        <button onClick={saveAll} className="voltra-btn-primary" disabled={saving}>
          {saving ? 'Salvataggio...' : 'Salva tutto'}
        </button>
        {msg && <span style={{ color: 'var(--voltra-lime)', fontSize: 13 }}>{msg}</span>}
      </div>

      <div className="voltra-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 12 }}>
          <thead style={{ background: '#0f0f0f' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Trader</Th><Th>Saldo*</Th><Th>Equity*</Th><Th>Trades</Th><Th>Volume</Th><Th>Best</Th><Th>Worst</Th><Th>WinRate%</Th><Th>PF</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <Td style={{ minWidth: 160 }}>{a.user.name}<br /><span style={{ color: 'var(--voltra-muted)', fontSize: 10 }}>{a.brokerLogin}</span></Td>
                {['balance', 'equity', 'trades', 'volume', 'bestTrade', 'worstTrade', 'winRatePct', 'profitFactor'].map(f => (
                  <Td key={f}>
                    <input
                      className="voltra-input"
                      type="number"
                      step="0.01"
                      value={data[a.id]?.[f] || ''}
                      onChange={e => update(a.id, f, e.target.value)}
                      style={{ width: 90, padding: '6px 8px', fontSize: 12 }}
                    />
                  </Td>
                ))}
              </tr>
            ))}
            {accounts.length === 0 && (
              <tr><td colSpan="9" style={{ padding: 32, textAlign: 'center', color: 'var(--voltra-muted)' }}>Nessun account attivo.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PayoutsTab() {
  const [payouts, setPayouts] = useState([])
  const [filter, setFilter] = useState('')

  const reload = () => api.adminPayouts(filter).then(setPayouts)
  useEffect(reload, [filter])

  const action = async (id, status) => {
    let txHash = '', rejectionReason = ''
    if (status === 'PAID') txHash = prompt('TX hash:')
    if (status === 'REJECTED') rejectionReason = prompt('Motivo:')
    if (status === 'PAID' && !txHash) return
    if (status === 'REJECTED' && !rejectionReason) return
    await api.adminUpdatePayout(id, { status, txHash, rejectionReason })
    reload()
  }

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <label className="voltra-label">Filtra per stato</label>
        <select className="voltra-input" value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 200 }}>
          <option value="">Tutti</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="PAID">Paid</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      <div className="voltra-card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: '#0f0f0f' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Data</Th><Th>Trader</Th><Th>Account</Th><Th>Importo</Th><Th>Network</Th><Th>Indirizzo</Th><Th>Stato</Th><Th>Azioni</Th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--voltra-border)' }}>
                <Td>{new Date(p.requestedAt).toLocaleDateString('it-IT')}</Td>
                <Td>{p.user.name}<br /><span style={{ color: 'var(--voltra-muted)', fontSize: 11 }}>{p.user.email}</span></Td>
                <Td>{p.account.brokerLogin}</Td>
                <Td><strong>${Number(p.amountUsd).toLocaleString()}</strong></Td>
                <Td>{p.cryptoNetwork}</Td>
                <Td style={{ maxWidth: 240, wordBreak: 'break-all', fontSize: 11, fontFamily: 'monospace' }}>{p.cryptoAddress}</Td>
                <Td><span className={`badge ${
                  p.status === 'PAID' ? 'badge-success' :
                  p.status === 'REJECTED' ? 'badge-fail' :
                  p.status === 'APPROVED' ? 'badge-info' : 'badge-pending'
                }`}>{p.status}</span></Td>
                <Td>
                  {p.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => action(p.id, 'APPROVED')} className="voltra-btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Approva</button>
                      <button onClick={() => action(p.id, 'REJECTED')} className="voltra-btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: '#ff4757', color: '#ff4757' }}>Rifiuta</button>
                    </div>
                  )}
                  {p.status === 'APPROVED' && (
                    <button onClick={() => action(p.id, 'PAID')} className="voltra-btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>Marca pagato</button>
                  )}
                </Td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr><td colSpan="8" style={{ padding: 32, textAlign: 'center', color: 'var(--voltra-muted)' }}>Nessuna richiesta.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function UsersTab() {
  const [users, setUsers] = useState([])
  useEffect(() => { api.adminUsers().then(setUsers) }, [])

  return (
    <div className="voltra-card" style={{ padding: 0, overflow: 'auto' }}>
      <table style={{ width: '100%', fontSize: 13 }}>
        <thead style={{ background: '#0f0f0f' }}>
          <tr style={{ textAlign: 'left' }}>
            <Th>Nome</Th><Th>Email</Th><Th>Email verif.</Th><Th>Account attivi</Th><Th>Registrato</Th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} style={{ borderTop: '1px solid var(--voltra-border)' }}>
              <Td>{u.name}</Td>
              <Td>{u.email}</Td>
              <Td>{u.emailVerified ? '✅' : '❌'}</Td>
              <Td>{u.propAccounts.filter(a => a.status === 'ACTIVE').length} / {u.propAccounts.length}</Td>
              <Td>{new Date(u.createdAt).toLocaleDateString('it-IT')}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }) {
  return <th style={{ padding: '12px 16px', fontWeight: 500, color: 'var(--voltra-muted)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{children}</th>
}

function Td({ children, style }) {
  return <td style={{ padding: '12px 16px', ...style }}>{children}</td>
}

function Modal({ onClose, children }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
    }} onClick={onClose}>
      <div className="voltra-card" style={{ maxWidth: 480, width: '90%', padding: 28 }} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
