import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

export default function Contact() {
  const [info, setInfo] = useState({ supportEmail: '', telegramUrl: '', telegramHandle: '' })
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { api.contactInfo().then(setInfo).catch(() => {}) }, [])

  const submit = async (e) => {
    e.preventDefault()
    setErr(''); setMsg(''); setLoading(true)
    try {
      const r = await api.sendContact(form)
      setMsg(r.message)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <header style={{ padding: '20px 32px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 26, color: 'var(--lime)' }}>⚡</span>
            <span className="display" style={{ fontSize: 22, fontWeight: 700 }}>VOLTRA</span>
          </Link>
          <Link to="/" className="btn-secondary" style={{ padding: '10px 18px', fontSize: 14 }}>← Home</Link>
        </div>
      </header>

      <section className="section" style={{ paddingTop: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">— Contatti</div>
          <h1 className="section-title">Parliamo. <span className="accent">Siamo qui.</span></h1>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Hai domande, problemi tecnici, o vuoi diventare partner? Rispondiamo entro 24 ore.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {info.telegramUrl && (
              <a href={info.telegramUrl} target="_blank" rel="noopener noreferrer" className="card card-glow" style={{ display: 'block', padding: 24, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <span style={{ fontSize: 32 }}>💬</span>
                  <span className="badge badge-lime">Più veloce</span>
                </div>
                <h3 className="display" style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Telegram</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12 }}>Chat diretta con il team. Risposta in pochi minuti.</p>
                <div style={{ color: 'var(--lime)', fontSize: 13, fontWeight: 600 }}>{info.telegramHandle || 'Apri chat'} →</div>
              </a>
            )}
            {info.supportEmail && (
              <a href={`mailto:${info.supportEmail}`} className="card card-glow" style={{ display: 'block', padding: 24, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ marginBottom: 16, fontSize: 32 }}>📧</div>
                <h3 className="display" style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Email diretta</h3>
                <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 12 }}>Per richieste dettagliate o documenti.</p>
                <div style={{ color: 'var(--lime)', fontSize: 13, fontWeight: 600 }}>{info.supportEmail} →</div>
              </a>
            )}
          </div>

          <div className="card" style={{ padding: 32 }}>
            <h3 className="display" style={{ fontSize: 20, fontWeight: 600, marginBottom: 6 }}>Form contatto</h3>
            <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 24 }}>Compila e ti rispondiamo via email.</p>

            <form onSubmit={submit}>
              <label className="label">Nome</label>
              <input className="voltra-input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ marginBottom: 14 }} />
              <label className="label">Email</label>
              <input className="voltra-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required style={{ marginBottom: 14 }} />
              <label className="label">Oggetto</label>
              <input className="voltra-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Es. Domanda sul programma 25K" style={{ marginBottom: 14 }} />
              <label className="label">Messaggio</label>
              <textarea className="voltra-input" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} style={{ marginBottom: 16, resize: 'vertical', fontFamily: 'inherit' }} />
              {err && <div style={{ color: 'var(--red)', fontSize: 13, marginBottom: 12 }}>{err}</div>}
              {msg && <div style={{ color: 'var(--lime)', fontSize: 13, marginBottom: 12 }}>{msg}</div>}
              <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? 'Invio...' : 'Invia messaggio'}</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
