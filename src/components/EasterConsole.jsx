import { useEffect, useState } from 'react'

const CODES = [
  'ALFA-7-NOVEMBER', 'BRAVO-3-DELTA', 'ECHO-9-FOXTROT',
  'TANGO-1-VICTOR', 'KILO-5-LIMA', 'OSCAR-2-MIKE',
  'CHARLIE-4-WHISKEY', 'ZULU-8-INDIA', 'PAPA-6-ROMEO',
]

const STORAGE_KEY = 'voltra_easter_found'

export function markEasterFound() {
  try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
}

export function hasFoundEaster() {
  try { return localStorage.getItem(STORAGE_KEY) === '1' } catch { return false }
}

export default function EasterConsole({ open, onClose }) {
  const [code] = useState(() => CODES[Math.floor(Math.random() * CODES.length)])

  useEffect(() => {
    if (!open) return
    markEasterFound()
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.92)',
      backdropFilter: 'blur(12px)',
      zIndex: 99998,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: '#000',
        border: '1px solid var(--lime)',
        borderRadius: 8,
        padding: 28,
        maxWidth: 500,
        width: '100%',
        fontFamily: 'monospace',
        boxShadow: '0 0 64px rgba(180,255,57,0.2)',
      }}>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>&gt; connessione cifrata in corso<span className="voltra-typewriter-cursor"></span></div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>&gt; handshake stabilito</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 6 }}>&gt; autenticazione: OK</div>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 16, marginTop: 12 }}>&gt;&gt; COMUNICAZIONE PROTETTA</div>

        <div style={{ color: 'var(--lime)', fontSize: 12, marginBottom: 8 }}>Codice del giorno:</div>
        <div style={{
          background: 'rgba(180,255,57,0.08)',
          border: '1px solid rgba(180,255,57,0.3)',
          padding: '14px 18px',
          borderRadius: 6,
          color: 'var(--lime)',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textAlign: 'center',
          fontSize: 18,
          marginBottom: 12,
        }}>{code}</div>

        <div style={{ color: 'var(--muted)', fontSize: 11, marginBottom: 16 }}>&gt; distintivo "Decifratore" sbloccato</div>

        <button onClick={onClose} style={{
          background: 'transparent',
          border: '1px solid var(--lime)',
          color: 'var(--lime)',
          padding: '8px 16px',
          borderRadius: 6,
          cursor: 'pointer',
          fontFamily: 'inherit',
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}>CHIUDI [ESC]</button>
      </div>
    </div>
  )
}
