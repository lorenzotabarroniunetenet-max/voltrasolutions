import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

export default function AdminPanel() {
  const [tab, setTab] = useState('users')
  const [userDetailId, setUserDetailId] = useState(null)

  const tabs = [
    { id: 'users', label: 'Utenti' },
    { id: 'accounts', label: 'Accounts' },
    { id: 'snapshots', label: 'Snapshots' },
    { id: 'payouts', label: 'Payouts' },
    { id: 'programs', label: 'Programmi' },
    { id: 'settings', label: 'Settings' },
  ]

  if (userDetailId) {
    return <UserDetail userId={userDetailId} back={() => setUserDetailId(null)} />
  }

  return (
    <div>
      <h1 className="display" style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', margin: '0 0 4px' }}>Admin Panel</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Controllo completo: utenti, account, snapshot, payout</div>

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

      {tab === 'users' && <UsersTab onSelectUser={setUserDetailId} />}
      {tab === 'accounts' && <AccountsTab />}
      {tab === 'snapshots' && <SnapshotsTab />}
      {tab === 'payouts' && <PayoutsTab />}
      {tab === 'programs' && <ProgramsTab />}
      {tab === 'settings' && <SettingsTab />}
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// USER DETAIL VIEW - ALL IN ONE
// ═════════════════════════════════════════════════════════
function UserDetail({ userId, back }) {
  const [user, setUser] = useState(null)
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(false)
  const [userForm, setUserForm] = useState({})
  const [snapAccountId, setSnapAccountId] = useState(null)
  const [snapDate, setSnapDate] = useState(new Date().toISOString().split('T')[0])
  const [snapData, setSnapData] = useState({})
  const [addAccount, setAddAccount] = useState(false)
  const [editAccountId, setEditAccountId] = useState(null)

  const reload = () => {
    api.adminUserDetail(userId).then(u => {
      setUser(u)
      setUserForm({ name: u.name, email: u.email, notes: u.notes || '', emailVerified: u.emailVerified, kycVerifiedAt: u.kycVerifiedAt })
      setLoading(false)
    })
    api.adminPrograms().then(setPrograms)
  }
  useEffect(() => { reload() }, [userId])

  const saveUser = async () => {
    try {
      await api.adminUpdateUser(userId, userForm)
      setEditUser(false)
      reload()
    } catch (e) { alert(e.message) }
  }

  const saveSnapshot = async () => {
    try {
      const fields = snapData
      if (!fields.balance || !fields.equity) { alert('Saldo ed Equity sono obbligatori'); return }
      const payload = {
        accountId: snapAccountId,
        date: snapDate,
        balance: Number(fields.balance),
        equity: Number(fields.equity),
      }
      for (const f of ['trades', 'volume', 'bestTrade', 'worstTrade', 'avgWin', 'avgLoss', 'winRatePct', 'profitFactor']) {
        if (fields[f] !== '' && fields[f] != null) payload[f] = Number(fields[f])
      }
      if (fields.notes) payload.notes = fields.notes
      await api.adminCreateSnapshots([payload])
      setSnapAccountId(null); setSnapData({})
      reload()
    } catch (e) { alert(e.message) }
  }

  const deleteSnapshot = async (id) => {
    if (!confirm('Eliminare questo snapshot?')) return
    await api.adminDeleteSnapshot(id)
    reload()
  }

  const deleteAccount = async (id) => {
    if (!confirm('Eliminare definitivamente questo account?')) return
    await api.adminDeleteAccount(id)
    reload()
  }

  if (loading) return <div style={{ color: 'var(--muted)' }}>Caricamento...</div>
  if (!user) return <div>Utente non trovato.</div>

  return (
    <div>
      <button onClick={back} className="btn-secondary" style={{ marginBottom: 20 }}>← Torna alla lista</button>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="display" style={{ fontSize: 28, fontWeight: 700, margin: '0 0 4px', letterSpacing: '-0.02em' }}>{user.name}</h1>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>{user.email} · Registrato {new Date(user.createdAt).toLocaleDateString('it-IT')}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <span className={`badge ${user.emailVerified ? 'badge-success' : 'badge-warn'}`}>
            {user.emailVerified ? 'Verificato' : 'Non verificato'}
          </span>
          {user.kycVerifiedAt && <span className="badge badge-info">KYC OK</span>}
        </div>
      </div>

      {/* User info + edit */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Profilo utente</h3>
          <button onClick={() => setEditUser(!editUser)} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>
            {editUser ? 'Annulla' : 'Modifica'}
          </button>
        </div>

        {editUser ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            <div>
              <label className="label">Nome</label>
              <input className="voltra-input" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Email</label>
              <input className="voltra-input" value={userForm.email} onChange={e => setUserForm({ ...userForm, email: e.target.value })} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="label">Note interne</label>
              <textarea className="voltra-input" value={userForm.notes} onChange={e => setUserForm({ ...userForm, notes: e.target.value })} rows={2} />
            </div>
            <div style={{ display: 'flex', gap: 12, gridColumn: '1/-1' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={userForm.emailVerified} onChange={e => setUserForm({ ...userForm, emailVerified: e.target.checked })} />
                Email verificata
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <input type="checkbox" checked={!!userForm.kycVerifiedAt} onChange={e => setUserForm({ ...userForm, kycVerifiedAt: e.target.checked ? new Date() : null })} />
                KYC verificato
              </label>
            </div>
            <button onClick={saveUser} className="btn-primary" style={{ gridColumn: '1/-1' }}>Salva</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, fontSize: 14 }}>
            <Info label="Account totali" value={user.propAccounts.length} />
            <Info label="Account attivi" value={user.propAccounts.filter(a => a.status === 'ACTIVE').length} />
            <Info label="Payout richiesti" value={user.payoutRequests.length} />
            <Info label="Payout pagati" value={user.payoutRequests.filter(p => p.status === 'PAID').length} />
            {user.notes && <div style={{ gridColumn: '1/-1' }}><Info label="Note" value={user.notes} /></div>}
          </div>
        )}
      </div>

      {/* Accounts list */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Account prop ({user.propAccounts.length})</h3>
          <button onClick={() => setAddAccount(true)} className="btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>+ Nuovo</button>
        </div>

        {user.propAccounts.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nessun account.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {user.propAccounts.map(a => (
              <AccountRow
                key={a.id}
                account={a}
                programs={programs}
                editable={editAccountId === a.id}
                onEdit={() => setEditAccountId(editAccountId === a.id ? null : a.id)}
                onSaved={reload}
                onDelete={() => deleteAccount(a.id)}
                onAddSnapshot={() => setSnapAccountId(a.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Payouts history */}
      <div className="card" style={{ marginBottom: 20, padding: 24 }}>
        <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Storico payout ({user.payoutRequests.length})</h3>
        {user.payoutRequests.length === 0 ? (
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>Nessun payout.</div>
        ) : (
          <table style={{ width: '100%', fontSize: 13 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
              <Th>Data</Th><Th>Account</Th><Th>Importo</Th><Th>Network</Th><Th>Stato</Th><Th>TX</Th>
            </tr></thead>
            <tbody>
              {user.payoutRequests.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <Td>{new Date(p.requestedAt).toLocaleDateString('it-IT')}</Td>
                  <Td>{p.account.program.name}</Td>
                  <Td><strong>${Number(p.amountUsd).toLocaleString()}</strong></Td>
                  <Td>{p.cryptoNetwork}</Td>
                  <Td><span className={`badge ${p.status === 'PAID' ? 'badge-success' : p.status === 'REJECTED' ? 'badge-fail' : p.status === 'APPROVED' ? 'badge-info' : 'badge-pending'}`}>{p.status}</span></Td>
                  <Td style={{ maxWidth: 200, wordBreak: 'break-all', fontSize: 10 }}>{p.txHash || '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Snapshot modal */}
      {snapAccountId && (
        <Modal onClose={() => { setSnapAccountId(null); setSnapData({}) }}>
          <h3 style={{ margin: '0 0 16px' }}>Inserisci snapshot</h3>
          <Field label="Data" type="date" value={snapDate} onChange={v => setSnapDate(v)} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Saldo *" type="number" value={snapData.balance || ''} onChange={v => setSnapData({ ...snapData, balance: v })} />
            <Field label="Equity *" type="number" value={snapData.equity || ''} onChange={v => setSnapData({ ...snapData, equity: v })} />
            <Field label="Trades" type="number" value={snapData.trades || ''} onChange={v => setSnapData({ ...snapData, trades: v })} />
            <Field label="Volume" type="number" value={snapData.volume || ''} onChange={v => setSnapData({ ...snapData, volume: v })} />
            <Field label="Best trade" type="number" value={snapData.bestTrade || ''} onChange={v => setSnapData({ ...snapData, bestTrade: v })} />
            <Field label="Worst trade" type="number" value={snapData.worstTrade || ''} onChange={v => setSnapData({ ...snapData, worstTrade: v })} />
            <Field label="Avg win" type="number" value={snapData.avgWin || ''} onChange={v => setSnapData({ ...snapData, avgWin: v })} />
            <Field label="Avg loss" type="number" value={snapData.avgLoss || ''} onChange={v => setSnapData({ ...snapData, avgLoss: v })} />
            <Field label="Win rate %" type="number" value={snapData.winRatePct || ''} onChange={v => setSnapData({ ...snapData, winRatePct: v })} />
            <Field label="Profit factor" type="number" value={snapData.profitFactor || ''} onChange={v => setSnapData({ ...snapData, profitFactor: v })} />
          </div>
          <button onClick={saveSnapshot} className="btn-primary" style={{ width: '100%', marginTop: 12 }}>Salva snapshot</button>
        </Modal>
      )}

      {/* Add account modal */}
      {addAccount && (
        <AddAccountModal
          userId={userId}
          programs={programs}
          onClose={() => setAddAccount(false)}
          onCreated={() => { setAddAccount(false); reload() }}
        />
      )}
    </div>
  )
}

function AccountRow({ account, programs, editable, onEdit, onSaved, onDelete, onAddSnapshot }) {
  const [form, setForm] = useState({
    status: account.status,
    startBalance: account.startBalance,
    programId: account.programId,
    brokerLogin: account.brokerLogin,
    broker: account.broker,
    notes: account.notes || '',
  })
  const [showSnaps, setShowSnaps] = useState(false)

  const save = async () => {
    try {
      await api.adminUpdateAccount(account.id, {
        status: form.status,
        startBalance: Number(form.startBalance),
        programId: form.programId,
        brokerLogin: form.brokerLogin,
        broker: form.broker,
        notes: form.notes,
      })
      onEdit()
      onSaved()
    } catch (e) { alert(e.message) }
  }

  const equity = account.snapshots[0] ? Number(account.snapshots[0].equity) : Number(account.startBalance)
  const profit = equity - Number(account.startBalance)
  const profitPct = (profit / Number(account.startBalance)) * 100

  return (
    <div style={{ background: 'var(--surface-2)', borderRadius: 10, padding: 16, border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span className={`badge ${account.status === 'ACTIVE' ? 'badge-success' : account.status === 'PASSED' ? 'badge-info' : account.status === 'FAILED' ? 'badge-fail' : 'badge-pending'}`}>{account.status}</span>
            <strong>{account.program.name}</strong>
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Login: {account.brokerLogin} · Broker: {account.broker} · Iniziale: ${Number(account.startBalance).toLocaleString()}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="mono" style={{ fontSize: 18, fontWeight: 700, color: profit >= 0 ? 'var(--lime)' : 'var(--red)' }}>
            ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div style={{ fontSize: 11, color: profit >= 0 ? 'var(--lime)' : 'var(--red)' }}>
            {profit >= 0 ? '+' : ''}{profitPct.toFixed(2)}% ({account.snapshots[0] ? new Date(account.snapshots[0].date).toLocaleDateString('it-IT') : 'no data'})
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
        <button onClick={onAddSnapshot} className="btn-primary" style={{ padding: '6px 12px', fontSize: 12 }}>+ Snapshot</button>
        <button onClick={() => setShowSnaps(!showSnaps)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
          {showSnaps ? 'Nascondi' : `Snapshots (${account._count.snapshots})`}
        </button>
        <button onClick={onEdit} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }}>
          {editable ? 'Annulla' : 'Modifica'}
        </button>
        <button onClick={onDelete} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 12, borderColor: 'var(--red)', color: 'var(--red)' }}>Elimina</button>
      </div>

      {editable && (
        <div style={{ marginTop: 16, padding: 16, background: 'var(--surface)', borderRadius: 8 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
            <div>
              <label className="label">Programma</label>
              <select className="voltra-input" value={form.programId} onChange={e => setForm({ ...form, programId: e.target.value })}>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
          <button onClick={save} className="btn-primary" style={{ marginTop: 12 }}>Salva modifiche</button>
        </div>
      )}

      {showSnaps && account.snapshots.length > 0 && (
        <div style={{ marginTop: 12, maxHeight: 240, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 11 }}>
            <thead><tr style={{ textAlign: 'left', color: 'var(--muted)' }}>
              <Th>Data</Th><Th>Saldo</Th><Th>Equity</Th><Th>P&L</Th><Th>DD%</Th><Th>Trades</Th><Th></Th>
            </tr></thead>
            <tbody>
              {account.snapshots.map(s => (
                <tr key={s.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <Td>{new Date(s.date).toLocaleDateString('it-IT')}</Td>
                  <Td>${Number(s.balance).toLocaleString()}</Td>
                  <Td>${Number(s.equity).toLocaleString()}</Td>
                  <Td style={{ color: Number(s.dailyPL) >= 0 ? 'var(--lime)' : 'var(--red)' }}>${Number(s.dailyPL).toFixed(2)}</Td>
                  <Td>{Number(s.drawdownPct).toFixed(2)}%</Td>
                  <Td>{s.trades || 0}</Td>
                  <Td><button onClick={() => api.adminDeleteSnapshot(s.id).then(onSaved)} className="btn-secondary" style={{ padding: '2px 6px', fontSize: 10, borderColor: 'var(--red)', color: 'var(--red)' }}>×</button></Td>
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
      await api.adminCreateAccount({
        userId, programId: form.programId, brokerLogin: form.brokerLogin,
        broker: form.broker, startBalance: Number(form.startBalance),
      })
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
          {programs.filter(p => p.active).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <Field label="Login broker" value={form.brokerLogin} onChange={v => setForm({ ...form, brokerLogin: v })} />
      <Field label="Broker" value={form.broker} onChange={v => setForm({ ...form, broker: v })} />
      <Field label="Saldo iniziale" type="number" value={form.startBalance} onChange={v => setForm({ ...form, startBalance: v })} />
      <button onClick={create} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>Crea</button>
    </Modal>
  )
}

// ═════════════════════════════════════════════════════════
// USERS TAB
// ═════════════════════════════════════════════════════════
function UsersTab({ onSelectUser }) {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  useEffect(() => { api.adminUsers().then(setUsers) }, [])

  const filtered = users.filter(u => !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <input className="voltra-input" placeholder="Cerca per nome o email..." value={search} onChange={e => setSearch(e.target.value)} style={{ marginBottom: 16, maxWidth: 400 }} />

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Nome</Th><Th>Email</Th><Th>Verif.</Th><Th>Accounts</Th><Th>Payouts</Th><Th>Registrato</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderTop: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => onSelectUser(u.id)}>
                <Td><strong>{u.name}</strong></Td>
                <Td>{u.email}</Td>
                <Td>{u.emailVerified ? '✅' : '❌'}</Td>
                <Td>
                  {u.propAccounts.filter(a => a.status === 'ACTIVE').length}/{u.propAccounts.length}
                  {u.propAccounts.length > 0 && (
                    <span style={{ fontSize: 10, color: 'var(--muted)', display: 'block' }}>
                      {u.propAccounts.slice(0, 2).map(a => a.program.name).join(', ')}{u.propAccounts.length > 2 ? '...' : ''}
                    </span>
                  )}
                </Td>
                <Td>{u._count.payoutRequests}</Td>
                <Td>{new Date(u.createdAt).toLocaleDateString('it-IT')}</Td>
                <Td><button className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Apri →</button></Td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan="7" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>Nessun utente.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// ACCOUNTS TAB
// ═════════════════════════════════════════════════════════
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
    try {
      await api.adminCreateAccount({ ...form, startBalance: Number(form.startBalance) })
      setShow(false); setForm({ userId: '', programId: '', brokerLogin: '', broker: 'cTrader', startBalance: '' }); reload()
    } catch (e) { alert(e.message) }
  }

  const setStatus = async (id, status) => {
    await api.adminUpdateAccount(id, { status })
    reload()
  }

  return (
    <div>
      <button onClick={() => setShow(true)} className="btn-primary" style={{ marginBottom: 16 }}>+ Nuovo Account</button>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Trader</Th><Th>Programma</Th><Th>Login</Th><Th>Saldo iniziale</Th><Th>Stato</Th><Th>Azioni</Th>
            </tr>
          </thead>
          <tbody>
            {accounts.map(a => (
              <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td>{a.user.name}<br /><span style={{ color: 'var(--muted)', fontSize: 11 }}>{a.user.email}</span></Td>
                <Td>{a.program.name}</Td>
                <Td>{a.brokerLogin}</Td>
                <Td>${Number(a.startBalance).toLocaleString()}</Td>
                <Td><span className={`badge ${a.status === 'ACTIVE' ? 'badge-success' : a.status === 'PASSED' ? 'badge-info' : a.status === 'FAILED' ? 'badge-fail' : 'badge-pending'}`}>{a.status}</span></Td>
                <Td>
                  <select value={a.status} onChange={e => setStatus(a.id, e.target.value)} className="voltra-input" style={{ padding: '4px 8px', fontSize: 12, width: 'auto' }}>
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
          <button onClick={create} className="btn-primary" style={{ width: '100%' }}>Crea Account</button>
        </Modal>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// SNAPSHOTS TAB (bulk)
// ═════════════════════════════════════════════════════════
function SnapshotsTab() {
  const [accounts, setAccounts] = useState([])
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [data, setData] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const reload = () => {
    api.adminAccounts().then(accs => {
      const active = accs.filter(a => a.status === 'ACTIVE')
      setAccounts(active)
      const init = {}
      active.forEach(a => { init[a.id] = { balance: '', equity: '', trades: '', volume: '', bestTrade: '', worstTrade: '', winRatePct: '', profitFactor: '' } })
      setData(init)
    })
  }
  useEffect(reload, [])

  const update = (id, field, v) => setData(d => ({ ...d, [id]: { ...d[id], [field]: v } }))

  const saveAll = async () => {
    setSaving(true); setMsg('')
    try {
      const payload = accounts
        .filter(a => data[a.id]?.balance && data[a.id]?.equity)
        .map(a => {
          const f = data[a.id]
          const out = { accountId: a.id, date, balance: Number(f.balance), equity: Number(f.equity) }
          for (const k of ['trades', 'volume', 'bestTrade', 'worstTrade', 'winRatePct', 'profitFactor']) {
            if (f[k] !== '' && f[k] != null) out[k] = Number(f[k])
          }
          return out
        })
      if (payload.length === 0) { setMsg('Niente da salvare (compila almeno saldo + equity)'); setSaving(false); return }
      const r = await api.adminCreateSnapshots(payload)
      setMsg(`Salvati ${r.length} snapshot`)
      reload()
    } catch (e) { setMsg('Errore: ' + e.message) }
    finally { setSaving(false); setTimeout(() => setMsg(''), 4000) }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', marginBottom: 16, flexWrap: 'wrap' }}>
        <div>
          <label className="label">Data</label>
          <input type="date" className="voltra-input" value={date} onChange={e => setDate(e.target.value)} style={{ width: 160 }} />
        </div>
        <button onClick={saveAll} className="btn-primary" disabled={saving}>{saving ? 'Salvataggio...' : 'Salva tutti'}</button>
        {msg && <span style={{ color: msg.startsWith('Errore') || msg.startsWith('Niente') ? 'var(--red)' : 'var(--lime)', fontSize: 13 }}>{msg}</span>}
      </div>

      {accounts.length === 0 ? (
        <div className="card" style={{ padding: 32, textAlign: 'center', color: 'var(--muted)' }}>
          Nessun account attivo. Crea prima gli account dei trader dalla tab "Utenti".
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'auto' }}>
          <table style={{ width: '100%', fontSize: 12 }}>
            <thead style={{ background: 'var(--surface-2)' }}>
              <tr style={{ textAlign: 'left' }}>
                <Th>Trader / Account</Th><Th>Saldo*</Th><Th>Equity*</Th><Th>Trades</Th><Th>Volume</Th><Th>Best</Th><Th>Worst</Th><Th>WR%</Th><Th>PF</Th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} style={{ borderTop: '1px solid var(--border)' }}>
                  <Td style={{ minWidth: 160 }}>
                    <strong>{a.user.name}</strong><br />
                    <span style={{ color: 'var(--muted)', fontSize: 10 }}>{a.brokerLogin} · {a.program.name}</span>
                  </Td>
                  {['balance', 'equity', 'trades', 'volume', 'bestTrade', 'worstTrade', 'winRatePct', 'profitFactor'].map(f => (
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

// ═════════════════════════════════════════════════════════
// PAYOUTS TAB
// ═════════════════════════════════════════════════════════
function PayoutsTab() {
  const [payouts, setPayouts] = useState([])
  const [filter, setFilter] = useState('')

  const reload = () => api.adminPayouts(filter).then(setPayouts)
  useEffect(reload, [filter])

  const action = async (id, status) => {
    let txHash = '', rejectionReason = ''
    if (status === 'PAID') txHash = prompt('TX hash:') || ''
    if (status === 'REJECTED') rejectionReason = prompt('Motivo:') || ''
    if (status === 'PAID' && !txHash) return
    if (status === 'REJECTED' && !rejectionReason) return
    await api.adminUpdatePayout(id, { status, txHash, rejectionReason })
    reload()
  }

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
            <tr style={{ textAlign: 'left' }}>
              <Th>Data</Th><Th>Trader</Th><Th>Account</Th><Th>Importo</Th><Th>Network</Th><Th>Indirizzo</Th><Th>Stato</Th><Th>Azioni</Th>
            </tr>
          </thead>
          <tbody>
            {payouts.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td>{new Date(p.requestedAt).toLocaleDateString('it-IT')}</Td>
                <Td>{p.user.name}<br /><span style={{ color: 'var(--muted)', fontSize: 11 }}>{p.user.email}</span></Td>
                <Td>{p.account.brokerLogin}</Td>
                <Td><strong>${Number(p.amountUsd).toLocaleString()}</strong></Td>
                <Td>{p.cryptoNetwork}</Td>
                <Td style={{ maxWidth: 240, wordBreak: 'break-all', fontSize: 11, fontFamily: 'monospace' }}>{p.cryptoAddress}</Td>
                <Td><span className={`badge ${p.status === 'PAID' ? 'badge-success' : p.status === 'REJECTED' ? 'badge-fail' : p.status === 'APPROVED' ? 'badge-info' : 'badge-pending'}`}>{p.status}</span></Td>
                <Td>
                  {p.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 4 }}>
                      <button onClick={() => action(p.id, 'APPROVED')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>Approva</button>
                      <button onClick={() => action(p.id, 'REJECTED')} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, borderColor: 'var(--red)', color: 'var(--red)' }}>Rifiuta</button>
                    </div>
                  )}
                  {p.status === 'APPROVED' && (
                    <button onClick={() => action(p.id, 'PAID')} className="btn-primary" style={{ padding: '4px 10px', fontSize: 11 }}>Marca pagato</button>
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

// ═════════════════════════════════════════════════════════
// PROGRAMS TAB
// ═════════════════════════════════════════════════════════
function ProgramsTab() {
  const [programs, setPrograms] = useState([])
  const [show, setShow] = useState(false)
  const [edit, setEdit] = useState(null)

  function emptyProgram() {
    return {
      name: '', accountSize: '', phase: 'CHALLENGE',
      profitTargetPct: '', maxDailyLossPct: '', maxOverallLossPct: '',
      minTradingDays: '', profitSplitPct: '70',
      payoutFrequencyDays: '7',
      scalpingAllowed: true, newsAllowed: true, weekendHoldAllowed: true,
      priceUsd: '', activationFeeUsd: '',
    }
  }
  const [form, setForm] = useState(emptyProgram())

  const reload = () => api.adminPrograms().then(setPrograms)
  useEffect(reload, [])

  const submit = async () => {
    try {
      const data = {
        name: form.name,
        accountSize: Number(form.accountSize),
        phase: form.phase,
        profitTargetPct: form.profitTargetPct ? Number(form.profitTargetPct) : null,
        maxDailyLossPct: Number(form.maxDailyLossPct),
        maxOverallLossPct: Number(form.maxOverallLossPct),
        minTradingDays: form.minTradingDays ? Number(form.minTradingDays) : null,
        profitSplitPct: Number(form.profitSplitPct),
        payoutFrequencyDays: Number(form.payoutFrequencyDays || 7),
        scalpingAllowed: form.scalpingAllowed,
        newsAllowed: form.newsAllowed,
        weekendHoldAllowed: form.weekendHoldAllowed,
        priceUsd: form.priceUsd ? Number(form.priceUsd) : null,
        activationFeeUsd: form.activationFeeUsd ? Number(form.activationFeeUsd) : null,
      }
      if (edit) await api.adminUpdateProgram(edit, data)
      else await api.adminCreateProgram(data)
      setShow(false); setEdit(null); setForm(emptyProgram()); reload()
    } catch (e) { alert(e.message) }
  }

  const openEdit = (p) => {
    setEdit(p.id)
    setForm({
      name: p.name, accountSize: p.accountSize, phase: p.phase,
      profitTargetPct: p.profitTargetPct ?? '',
      maxDailyLossPct: p.maxDailyLossPct, maxOverallLossPct: p.maxOverallLossPct,
      minTradingDays: p.minTradingDays ?? '', profitSplitPct: p.profitSplitPct,
      payoutFrequencyDays: p.payoutFrequencyDays || 7,
      scalpingAllowed: p.scalpingAllowed, newsAllowed: p.newsAllowed, weekendHoldAllowed: p.weekendHoldAllowed,
      priceUsd: p.priceUsd ?? '', activationFeeUsd: p.activationFeeUsd ?? '',
    })
    setShow(true)
  }

  const toggleActive = async (p) => { await api.adminUpdateProgram(p.id, { active: !p.active }); reload() }

  return (
    <div>
      <button onClick={() => { setEdit(null); setForm(emptyProgram()); setShow(true) }} className="btn-primary" style={{ marginBottom: 16 }}>+ Nuovo Programma</button>

      <div className="card" style={{ padding: 0, overflow: 'auto' }}>
        <table style={{ width: '100%', fontSize: 13 }}>
          <thead style={{ background: 'var(--surface-2)' }}>
            <tr style={{ textAlign: 'left' }}>
              <Th>Nome</Th><Th>Phase</Th><Th>Size</Th><Th>Target</Th><Th>DLL</Th><Th>MLL</Th><Th>Split</Th><Th>Payout</Th><Th>Regole</Th><Th>Prezzo</Th><Th>Stato</Th>
            </tr>
          </thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid var(--border)' }}>
                <Td>{p.name}</Td>
                <Td><span className="badge badge-info">{p.phase}</span></Td>
                <Td>${Number(p.accountSize).toLocaleString()}</Td>
                <Td>{p.profitTargetPct ? `${p.profitTargetPct}%` : '—'}</Td>
                <Td>{p.maxDailyLossPct}%</Td>
                <Td>{p.maxOverallLossPct}%</Td>
                <Td>{p.profitSplitPct}%</Td>
                <Td>{p.payoutFrequencyDays || 7}gg</Td>
                <Td style={{ fontSize: 10 }}>
                  {p.scalpingAllowed && <span className="badge badge-success" style={{ marginRight: 4 }}>SC</span>}
                  {p.newsAllowed && <span className="badge badge-success" style={{ marginRight: 4 }}>NE</span>}
                  {p.weekendHoldAllowed && <span className="badge badge-success">WK</span>}
                </Td>
                <Td>${Number(p.priceUsd || 0)}</Td>
                <Td>
                  <button onClick={() => openEdit(p)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11, marginRight: 4 }}>Edit</button>
                  <button onClick={() => toggleActive(p)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: 11 }}>
                    {p.active ? 'Off' : 'On'}
                  </button>
                </Td>
              </tr>
            ))}
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
          <Field label="Min Trading Days (opzionale)" type="number" value={form.minTradingDays} onChange={v => setForm({ ...form, minTradingDays: v })} />
          <Field label="Profit Split %" type="number" value={form.profitSplitPct} onChange={v => setForm({ ...form, profitSplitPct: v })} />
          <Field label="Payout ogni (giorni)" type="number" value={form.payoutFrequencyDays} onChange={v => setForm({ ...form, payoutFrequencyDays: v })} />

          <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, marginBottom: 12 }}>
            <div className="label">Regole permesse</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={form.scalpingAllowed} onChange={e => setForm({ ...form, scalpingAllowed: e.target.checked })} />
              Scalping permesso
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={form.newsAllowed} onChange={e => setForm({ ...form, newsAllowed: e.target.checked })} />
              News trading permesso
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, padding: '6px 0' }}>
              <input type="checkbox" checked={form.weekendHoldAllowed} onChange={e => setForm({ ...form, weekendHoldAllowed: e.target.checked })} />
              Hold posizioni nel weekend
            </label>
          </div>

          <Field label="Prezzo ($)" type="number" value={form.priceUsd} onChange={v => setForm({ ...form, priceUsd: v })} />
          <Field label="Activation Fee $ (opzionale)" type="number" value={form.activationFeeUsd} onChange={v => setForm({ ...form, activationFeeUsd: v })} />
          <button onClick={submit} className="btn-primary" style={{ width: '100%', marginTop: 8 }}>{edit ? 'Salva' : 'Crea'}</button>
        </Modal>
      )}
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// SETTINGS TAB
// ═════════════════════════════════════════════════════════
function SettingsTab() {
  const [settings, setSettings] = useState([])
  const [edit, setEdit] = useState({})
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const reload = () => api.adminSettings().then(s => {
    setSettings(s)
    setEdit(s.reduce((a, x) => ({ ...a, [x.key]: x.value }), {}))
  })
  useEffect(() => { reload() }, [])

  const groups = [
    { title: 'Email', items: [
      { key: 'SUPPORT_EMAIL', label: 'Email supporto (riceve i form contatti)', help: 'Es. support@voltrasolutions.com' },
      { key: 'EMAIL_FROM', label: 'Email mittente (FROM)', help: 'Es. Voltra <noreply@voltrasolutions.com>' },
    ]},
    { title: 'Telegram', items: [
      { key: 'TELEGRAM_SUPPORT_URL', label: 'Link Telegram pubblico', help: 'Es. https://t.me/voltrasolutions' },
      { key: 'TELEGRAM_SUPPORT_HANDLE', label: 'Handle Telegram', help: 'Es. @voltrasolutions' },
      { key: 'TELEGRAM_ADMIN_CHAT_ID', label: 'Chat ID admin (riceve notifiche)', help: 'Numero ottenuto da @userinfobot' },
    ]},
    { title: 'Pagamenti', items: [
      { key: 'PAYMENT_ADDRESS', label: 'Indirizzo wallet pagamenti', help: 'Indirizzo USDC/USDT mostrato ai trader' },
      { key: 'PAYMENT_NETWORK', label: 'Network pagamento', help: 'Es. USDT TRC20, USDC ERC20' },
    ]},
  ]

  const save = async () => {
    setSaving(true); setMsg('')
    try {
      const items = settings.map(s => ({ key: s.key, value: edit[s.key] || '', isPublic: s.isPublic }))
      await api.adminBulkSettings(items)
      setMsg('Salvato')
      reload()
    } catch (e) { setMsg('Errore: ' + e.message) }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000) }
  }

  return (
    <div style={{ maxWidth: 720 }}>
      {groups.map(g => (
        <div key={g.title} className="card" style={{ marginBottom: 16, padding: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600, color: 'var(--lime)' }}>{g.title}</h3>
          {g.items.map(item => {
            const s = settings.find(x => x.key === item.key)
            return (
              <div key={item.key} style={{ marginBottom: 16 }}>
                <label className="label">{item.label}</label>
                <input className="voltra-input" value={edit[item.key] || ''} onChange={e => setEdit({ ...edit, [item.key]: e.target.value })} placeholder={item.help} />
                <div style={{ fontSize: 11, color: 'var(--muted-2)', marginTop: 4 }}>
                  {item.help} {s?.isPublic && <span style={{ color: 'var(--lime)' }}>• pubblico</span>}
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 20 }}>
        <button onClick={save} className="btn-primary" disabled={saving}>{saving ? 'Salvataggio...' : 'Salva tutto'}</button>
        {msg && <span style={{ color: msg.startsWith('Errore') ? 'var(--red)' : 'var(--lime)', fontSize: 13 }}>{msg}</span>}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════
// HELPERS
// ═════════════════════════════════════════════════════════
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
      <input className="voltra-input" type={type} value={value} onChange={e => onChange(e.target.value)} />
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
