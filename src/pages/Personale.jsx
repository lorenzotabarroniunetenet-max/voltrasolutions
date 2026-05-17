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

  useEffect(() => {
    api.dossier().then(d => {
      setDossier(d)
      setShowInAlbo(d.showInAlbo !== false)
    }).catch(() => {})
  }, [])

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
