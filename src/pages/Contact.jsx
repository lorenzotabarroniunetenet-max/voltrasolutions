import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api.js'

function TelegramIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

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
          <div className="section-label">— Linea Diretta HQ</div>
          <h1 className="section-title">Comunicazione <span className="accent">con il Comando.</span></h1>
          <p className="section-subtitle" style={{ margin: '16px auto 0' }}>
            Hai domande, problemi tecnici, o vuoi diventare partner? Rispondiamo entro 24 ore.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {info.telegramUrl && (
              <a href={info.telegramUrl} target="_blank" rel="noopener noreferrer" className="card card-glow" style={{ display: 'block', padding: 24, textDecoration: 'none', color: 'inherit' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <TelegramIcon size={32} color="var(--lime)" />
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
