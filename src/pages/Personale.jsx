import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { api } from '../lib/api.js'
import { GRADE_LORE } from '../lib/lore.js'
import { isGunshotEnabled, setGunshotEnabled } from '../components/Gunshot.jsx'
import { isAiBotEnabled, setAiBotEnabled } from '../components/AiBotWidget.jsx'
import Stemma from '../components/Stemma.jsx'

export default function Personale() {
  const { user, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const nav = useNavigate()
  const [dossier, setDossier] = useState(null)
  const [showInAlbo, setShowInAlbo] = useState(true)
  const [gunshot, setGunshot] = useState(isGunshotEnabled())
  const [aiBot, setAiBot] = useState(isAiBotEnabled())
  const [tgLinked, setTgLinked] = useState(null)
  const [tgLoading, setTgLoading] = useState(false)
  const [tgUrl, setTgUrl] = useState(null)
  const [subscription, setSubscription] = useState(undefined) // undefined = loading

  useEffect(() => {
    api.dossier().then(d => {
      setDossier(d)
      setShowInAlbo(d.showInAlbo !== false)
    }).catch(() => {})
    api.telegramStatus().then(d => setTgLinked(d.linked)).catch(() => {})
    fetch(`${import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'}/api/subscriptions/me`, { headers: { Authorization: `Bearer ${localStorage.getItem('voltra_token')}` } })
      .then(r => r.json()).then(d => setSubscription(d.subscription)).catch(() => setSubscription(null))
  }, [])

  const handleTelegramLink = async () => {
    setTgLoading(true)
    try {
      const { url } = await api.telegramLinkToken()
      setTgUrl(url)
      window.open(url, '_blank')
    } catch (e) {} finally { setTgLoading(false) }
  }

  const handleTelegramUnlink = async () => {
    await api.telegramUnlink()
    setTgLinked(false)
    setTgUrl(null)
  }

  const handleLogout = () => { logout(); nav('/login') }

  const toggleAlbo = async (v) => {
    setShowInAlbo(v)
    try { await api.updateProfile({ showInAlbo: v }) } catch (e) { setShowInAlbo(!v) }
  }

  const rank = dossier?.rank || user?.rank || 'Caporale'
  const lore = GRADE_LORE[rank] || GRADE_LORE.Caporale
  const accentColor = lore?.color || 'var(--lime)'

  const SectionItem = ({ to, onClick, icon, label, value, danger, trailing }) => {
    const content = (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '16px 18px', background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        color: danger ? '#ff4757' : 'var(--text)',
        cursor: onClick || to ? 'pointer' : 'default',
        transition: 'background 0.15s',
      }}>
        <span style={{ fontSize: 18, color: danger ? '#ff4757' : 'var(--muted)', flexShrink: 0, width: 20, display: 'flex', justifyContent: 'center' }}>{icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{label}</span>
        {value && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{value}</span>}
        {trailing}
        {!danger && !trailing && (to || onClick) && <span style={{ color: 'var(--muted-2)', fontSize: 18 }}>›</span>}
      </div>
    )
    if (to) return <Link to={to} style={{ textDecoration: 'none', color: 'inherit' }}>{content}</Link>
    if (onClick) return <div onClick={onClick}>{content}</div>
    return content
  }

  const Section = ({ children, title }) => (
    <div style={{ marginBottom: 18 }}>
      {title && <div style={{ fontSize: 11, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, padding: '0 18px 8px', marginTop: 8 }}>{title}</div>}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden' }}>
        {children}
      </div>
    </div>
  )

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={() => onChange(!value)}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: value ? 'var(--lime)' : 'var(--surface-2)',
        border: '1px solid var(--border)',
        position: 'relative', cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <div style={{
        position: 'absolute', top: 1, left: value ? 19 : 1,
        width: 22, height: 22, borderRadius: '50%',
        background: value ? '#000' : '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  )

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Personale</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Fascicolo e impostazioni</div>

      {/* Card identità */}
      <div className="card" style={{ padding: 20, marginBottom: 20, background: `linear-gradient(135deg, ${accentColor}10 0%, var(--surface) 100%)`, border: `1px solid ${accentColor}33` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 64, flexShrink: 0 }}>
            <Stemma matricola={dossier?.matricola || 'VLT-0000'} rank={user?.role === 'ADMIN' ? 'Colonnello' : rank} size={64} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 2 }}>
              {lore?.rank} {user?.role === 'ADMIN' ? 'Comando' : rank}
            </div>
            <div className="display" style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.01em', marginBottom: 2 }}>{user?.name || '—'}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', wordBreak: 'break-all' }}>{user?.email}</div>
          </div>
        </div>
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <div>
            <div style={{ color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>Matricola</div>
            <div className="mono" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'var(--text)' }}>{dossier?.matricola || '—'}</div>
          </div>
          <div>
            <div style={{ color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>Anzianità</div>
            <div style={{ color: 'var(--text)' }}>{dossier?.daysOfService ?? 0} giorni</div>
          </div>
          <div>
            <div style={{ color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', fontSize: 9, fontWeight: 700, marginBottom: 2 }}>Stato</div>
            <div style={{ color: 'var(--lime)', fontWeight: 600 }}>In servizio</div>
          </div>
        </div>
      </div>

      {/* Card abbonamento */}
      {subscription !== undefined && (
        <div className="card" style={{ padding: 16, marginBottom: 20, background: subscription?.status === 'ACTIVE' && subscription.daysLeft > 7 ? 'rgba(180,255,57,.03)' : subscription?.status === 'ACTIVE' ? 'rgba(232,200,74,.04)' : 'rgba(255,71,87,.04)', border: `1px solid ${subscription?.status === 'ACTIVE' && subscription.daysLeft > 7 ? 'rgba(180,255,57,.18)' : subscription?.status === 'ACTIVE' ? 'rgba(232,200,74,.25)' : 'rgba(255,71,87,.25)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 700, color: 'var(--muted)' }}>💳 Abbonamento</div>
            {subscription ? (
              <div style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, background: subscription.status === 'ACTIVE' && subscription.daysLeft > 7 ? 'rgba(180,255,57,.1)' : subscription.status === 'ACTIVE' ? 'rgba(232,200,74,.1)' : 'rgba(255,71,87,.1)', color: subscription.status === 'ACTIVE' && subscription.daysLeft > 7 ? 'var(--lime)' : subscription.status === 'ACTIVE' ? '#E8C84A' : 'var(--red)' }}>
                {subscription.status === 'ACTIVE' ? (subscription.daysLeft <= 7 ? '⚠️ In scadenza' : '✅ Attivo') : subscription.status === 'SUSPENDED' ? '⏸ Sospeso' : '🔴 Scaduto'}
              </div>
            ) : (
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Nessun abbonamento</div>
            )}
          </div>
          {subscription ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>Scadenza</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>{new Date(subscription.endDate).toLocaleDateString('it-IT')}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>Giorni rimasti</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: subscription.daysLeft <= 7 ? '#E8C84A' : subscription.daysLeft <= 0 ? 'var(--red)' : 'var(--lime)' }}>{Math.max(0, subscription.daysLeft)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 2 }}>Importo</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>€{Number(subscription.amount).toFixed(2)}/mese</div>
              </div>
            </div>
          ) : (
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Contatta il Comando per attivare il tuo abbonamento.</div>
          )}
          {subscription?.daysLeft <= 7 && subscription?.daysLeft > 0 && (
            <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(232,200,74,.08)', borderRadius: 8, fontSize: 12, color: '#E8C84A' }}>
              ⚠️ Il tuo abbonamento scade tra {subscription.daysLeft} {subscription.daysLeft === 1 ? 'giorno' : 'giorni'}.
            </div>
          )}
          {/* Bottone paga abbonamento — visibile se scaduto o in scadenza */}
          {(!subscription || subscription.daysLeft <= 7) && (
            <button
              onClick={async () => {
                const token = localStorage.getItem('voltra_token')
                const BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'
                await fetch(`${BASE}/api/subscriptions/request-payment`, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
                })
                alert('Richiesta inviata al Comando. Verrai contattato per il pagamento.')
              }}
              style={{ marginTop: 10, width: '100%', background: 'rgba(180,255,57,.08)', border: '1px solid rgba(180,255,57,.25)', color: 'var(--lime)', padding: '10px', borderRadius: 8, fontFamily: 'Manrope, sans-serif', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
              💳 Paga abbonamento €99/mese
            </button>
          )}
        </div>
      )}

      <Section title="Servizio">
        <SectionItem to="/fascicolo" icon="📂" label="Fascicolo Personale" />
        <SectionItem to="/briefing" icon="📜" label="Sala Briefing" />
        <SectionItem to="/calendario" icon="📅" label="Calendario" />
        <SectionItem to="/albo" icon="⚜" label="Albo d'Onore" />
        <SectionItem to="/mappa" icon="🗺" label="Mappa Operazioni" />
        <SectionItem to="/documenti" icon="📄" label="Documenti privati" />
        <SectionItem to="/codice-condotta" icon="📖" label="Codice di Condotta" />
        <SectionItem to="/codice-operativo" icon="🔖" label="Codice Operativo" />
        <SectionItem to="/payout" icon="📦" label="Rimborso Missione" />
        <SectionItem to="/buy" icon="🎖" label="Promozione di Grado" />
        <SectionItem to="/contact" icon="📡" label="Linea Diretta HQ" />
      </Section>

      <Section title="Aspetto">
        <SectionItem
          icon={theme === 'dark' ? '🌙' : '☀️'}
          label="Tema chiaro"
          trailing={<Toggle value={theme === 'light'} onChange={v => setTheme(v ? 'light' : 'dark')} />}
        />
      </Section>

      <Section title="Privacy">
        <SectionItem
          icon="👁"
          label="Visibilità nel Roster pubblico"
          trailing={<Toggle value={showInAlbo} onChange={toggleAlbo} />}
        />
      </Section>

      <Section title="Sicurezza">
        <SectionItem to="/cambio-password" icon="🔐" label="Cambia credenziale" />
        <SectionItem to="/sicurezza-accesso" icon="🔒" label="Verifica via email (2FA)" />

        {/* Collega Telegram */}
        <div style={{ marginTop: 8 }}>
          {tgLinked === true ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'rgba(180,255,57,0.04)', border: '1px solid rgba(180,255,57,0.2)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 18 }}>✅</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Telegram collegato</span>
              </div>
              <button onClick={handleTelegramUnlink} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', padding: '4px 10px', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Scollega</button>
            </div>
          ) : (
            <div style={{ padding: '14px 16px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 18 }}>✈️</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Collega Telegram</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.5 }}>Ricevi notifiche del Comando e gestisci la tua missione da Telegram.</div>
              <button onClick={handleTelegramLink} disabled={tgLoading} className="btn-primary" style={{ width: '100%', padding: '10px', fontSize: 12 }}>
                {tgLoading ? 'Generazione link...' : '🔗 Collega account Telegram'}
              </button>
              {tgUrl && <div style={{ marginTop: 8, fontSize: 11, color: 'var(--muted)' }}>Link aperto. Hai 10 minuti per completare il collegamento.</div>}
            </div>
          )}
        </div>
        <SectionItem
          icon="◎"
          label="Effetto sparo al click"
          trailing={<Toggle value={gunshot} onChange={v => { setGunshot(v); setGunshotEnabled(v) }} />}
        />
        <SectionItem
          icon="◉"
          label="Assistente del Comando"
          trailing={<Toggle value={aiBot} onChange={v => { setAiBot(v); setAiBotEnabled(v) }} />}
        />
      </Section>

      <Section title="Voltra">
        <SectionItem to="/" icon="🛡" label="Informazioni Voltra" />
      </Section>

      {user?.role === 'ADMIN' && (
        <Section title="Comando">
          <SectionItem to="/admin" icon="⚙️" label="Stato Maggiore" />
        </Section>
      )}

      <Section>
        <SectionItem onClick={handleLogout} icon="→" label="Smobilitazione" danger />
      </Section>

      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted-2)', marginTop: 24, padding: '0 20px', lineHeight: 1.6, fontStyle: 'italic' }}>
        Silentio agimus.<br />
        © 2026 Voltra Solutions
      </div>
    </div>
  )
}
