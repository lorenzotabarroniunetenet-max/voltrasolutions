import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../lib/api'

const DEFAULT_RULE = {
  label: '', masterAccountId: '', slaveAccountId: '',
  reverse: false,
  lotMode: 'MULTIPLIER', lotValue: 1.0,
  tpMode: 'COPY', tpValue: 0,
  slMode: 'COPY', slValue: 0,
  symbolWhitelist: '', symbolBlacklist: '',
  maxDrawdown: 0, maxSlippage: 3,
  status: 'ACTIVE'
}

export default function Rules() {
  const [list, setList] = useState([])
  const [accounts, setAccounts] = useState([])
  const [editing, setEditing] = useState(null)
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)

  async function load() {
    const [r, a] = await Promise.all([api.rules.list(), api.accounts.list()])
    setList(r); setAccounts(a); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function toggle(rule) {
    const next = rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    await api.rules.update(rule.id, { status: next }); load()
  }
  async function remove(id) {
    if (!confirm('Delete this rule?')) return
    await api.rules.remove(id); load()
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Copy rules</h1>
            <p className="text-sm text-muted">Define how trades are copied from master to slave accounts</p>
          </div>
          <button onClick={() => { setCreating(true); setEditing(null) }} className="btn-primary">+ New rule</button>
        </div>

        {loading ? <div className="text-sm text-muted">Loading…</div> :
         list.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-muted mb-4">No copy rules yet.</div>
            <button onClick={() => setCreating(true)} className="btn-primary">Create your first rule</button>
          </div>
         ) : (
          <div className="space-y-3">
            {list.map(r => (
              <div key={r.id} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-fg">{r.label}</h3>
                      <span className={`badge ${r.status === 'ACTIVE' ? 'bg-brand/10 text-brand' : 'bg-warn/10 text-warn'}`}>{r.status}</span>
                      {r.reverse && <span className="badge bg-danger/10 text-danger">REVERSE</span>}
                    </div>
                    <div className="text-xs text-muted font-mono mt-1">{r.master?.label} ({r.master?.login}) → {r.slave?.label} ({r.slave?.login})</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggle(r)} className="btn-ghost text-xs">{r.status === 'ACTIVE' ? 'Pause' : 'Resume'}</button>
                    <button onClick={() => { setEditing(r); setCreating(false) }} className="btn-ghost text-xs">Edit</button>
                    <button onClick={() => remove(r.id)} className="text-xs text-danger hover:underline px-3">Delete</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <Info label="Lot" value={`${r.lotMode} × ${r.lotValue}`} />
                  <Info label="TP" value={r.tpMode === 'COPY' ? 'Copy' : r.tpMode === 'DISABLED' ? 'Off' : `Override ${r.tpValue}`} />
                  <Info label="SL" value={r.slMode === 'COPY' ? 'Copy' : r.slMode === 'DISABLED' ? 'Off' : `Override ${r.slValue}`} />
                  <Info label="Max DD / Slippage" value={`${r.maxDrawdown}% / ${r.maxSlippage}p`} />
                  {r.symbolWhitelist && <Info label="Whitelist" value={r.symbolWhitelist} />}
                  {r.symbolBlacklist && <Info label="Blacklist" value={r.symbolBlacklist} />}
                </div>
              </div>
            ))}
          </div>
         )}

        {(creating || editing) && <RuleModal rule={editing} accounts={accounts} onClose={() => { setCreating(false); setEditing(null); load() }} />}
      </div>
    </Layout>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted">{label}</div>
      <div className="text-fg font-mono mt-0.5">{value}</div>
    </div>
  )
}

function RuleModal({ rule, accounts, onClose }) {
  const [data, setData] = useState(rule ? { ...rule, symbolWhitelist: rule.symbolWhitelist || '', symbolBlacklist: rule.symbolBlacklist || '' } : DEFAULT_RULE)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const isEdit = !!rule
  const masters = accounts.filter(a => a.type === 'MASTER')
  const slaves = accounts.filter(a => a.type === 'SLAVE')

  function set(k, v) { setData(d => ({ ...d, [k]: v })) }

  async function submit() {
    setBusy(true); setErr('')
    try {
      const payload = {
        ...data,
        lotValue: parseFloat(data.lotValue) || 1,
        tpValue: parseFloat(data.tpValue) || 0,
        slValue: parseFloat(data.slValue) || 0,
        maxDrawdown: parseFloat(data.maxDrawdown) || 0,
        maxSlippage: parseFloat(data.maxSlippage) || 3
      }
      if (isEdit) {
        delete payload.master; delete payload.slave; delete payload.user; delete payload.id; delete payload.createdAt; delete payload.userId
        await api.rules.update(rule.id, payload)
      } else {
        await api.rules.create(payload)
      }
      onClose()
    } catch (e) { setErr(e.message) }
    finally { setBusy(false) }
  }

  if (masters.length === 0 || slaves.length === 0) {
    return (
      <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="card p-6 max-w-md w-full text-center">
          <h2 className="text-lg font-bold mb-2">Connect accounts first</h2>
          <p className="text-sm text-muted mb-4">You need at least one MASTER and one SLAVE account before creating a rule.</p>
          <button onClick={onClose} className="btn-primary">OK</button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-bg/85 backdrop-blur-sm flex items-start justify-center z-50 p-4 overflow-y-auto">
      <div className="card p-6 max-w-3xl w-full mt-8 mb-8">
        <h2 className="text-lg font-bold mb-1">{isEdit ? 'Edit' : 'New'} copy rule</h2>
        <p className="text-sm text-muted mb-5">Configure how trades are replicated</p>

        <div className="space-y-5">
          <Section title="Basic">
            <div className="grid grid-cols-2 gap-3">
              <label className="col-span-2">
                <div className="label">Label</div>
                <input className="input" value={data.label} onChange={e => set('label', e.target.value)} placeholder="My main copy rule" />
              </label>
              <label>
                <div className="label">Master account</div>
                <select className="input" value={data.masterAccountId} onChange={e => set('masterAccountId', e.target.value)} disabled={isEdit}>
                  <option value="">Select…</option>
                  {masters.map(a => <option key={a.id} value={a.id}>{a.label} ({a.login})</option>)}
                </select>
              </label>
              <label>
                <div className="label">Slave account</div>
                <select className="input" value={data.slaveAccountId} onChange={e => set('slaveAccountId', e.target.value)} disabled={isEdit}>
                  <option value="">Select…</option>
                  {slaves.map(a => <option key={a.id} value={a.id}>{a.label} ({a.login})</option>)}
                </select>
              </label>
              <label className="col-span-2 flex items-center gap-3 mt-2">
                <input type="checkbox" checked={data.reverse} onChange={e => set('reverse', e.target.checked)} className="w-4 h-4 accent-brand" />
                <span className="text-sm text-fg">Reverse trading <span className="text-muted">(buy → sell, sell → buy)</span></span>
              </label>
            </div>
          </Section>

          <Section title="Lot sizing">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="label">Mode</div>
                <select className="input" value={data.lotMode} onChange={e => set('lotMode', e.target.value)}>
                  <option value="MULTIPLIER">Multiplier (× master)</option>
                  <option value="FIXED">Fixed lots</option>
                  <option value="PROPORTIONAL">Proportional (equity-based)</option>
                </select>
              </label>
              <label>
                <div className="label">Value</div>
                <input className="input" type="number" step="0.01" value={data.lotValue} onChange={e => set('lotValue', e.target.value)} />
              </label>
            </div>
          </Section>

          <Section title="Take Profit override">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="label">Mode</div>
                <select className="input" value={data.tpMode} onChange={e => set('tpMode', e.target.value)}>
                  <option value="COPY">Copy from master</option>
                  <option value="OVERRIDE">Override (fixed)</option>
                  <option value="DISABLED">Disabled (no TP)</option>
                </select>
              </label>
              <label>
                <div className="label">Value (price)</div>
                <input className="input" type="number" step="0.01" value={data.tpValue} onChange={e => set('tpValue', e.target.value)} disabled={data.tpMode !== 'OVERRIDE'} />
              </label>
            </div>
          </Section>

          <Section title="Stop Loss override">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="label">Mode</div>
                <select className="input" value={data.slMode} onChange={e => set('slMode', e.target.value)}>
                  <option value="COPY">Copy from master</option>
                  <option value="OVERRIDE">Override (fixed)</option>
                  <option value="DISABLED">Disabled (no SL)</option>
                </select>
              </label>
              <label>
                <div className="label">Value (price)</div>
                <input className="input" type="number" step="0.01" value={data.slValue} onChange={e => set('slValue', e.target.value)} disabled={data.slMode !== 'OVERRIDE'} />
              </label>
            </div>
          </Section>

          <Section title="Symbol filters">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="label">Whitelist (comma-separated)</div>
                <input className="input" value={data.symbolWhitelist} onChange={e => set('symbolWhitelist', e.target.value)} placeholder="EURUSD,GBPUSD" />
              </label>
              <label>
                <div className="label">Blacklist</div>
                <input className="input" value={data.symbolBlacklist} onChange={e => set('symbolBlacklist', e.target.value)} placeholder="XAUUSD,US30" />
              </label>
            </div>
          </Section>

          <Section title="Risk protection">
            <div className="grid grid-cols-2 gap-3">
              <label>
                <div className="label">Max drawdown % (auto-pause)</div>
                <input className="input" type="number" step="0.1" value={data.maxDrawdown} onChange={e => set('maxDrawdown', e.target.value)} />
              </label>
              <label>
                <div className="label">Max slippage (pips)</div>
                <input className="input" type="number" step="0.1" value={data.maxSlippage} onChange={e => set('maxSlippage', e.target.value)} />
              </label>
            </div>
          </Section>
        </div>

        {err && <div className="text-sm text-danger mt-4">{err}</div>}
        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={submit} disabled={busy} className="btn-primary flex-1">{busy ? 'Saving…' : (isEdit ? 'Save' : 'Create rule')}</button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-xs font-mono uppercase tracking-wider text-brand mb-2">{title}</div>
      {children}
    </div>
  )
}
