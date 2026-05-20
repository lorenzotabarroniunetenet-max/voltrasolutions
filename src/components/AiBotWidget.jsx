import { useState, useEffect, useRef } from 'react'

const API_BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'
const STORAGE_KEY = 'voltra_ai_history'
const TOGGLE_KEY = 'voltra_ai_enabled'

export function isAiBotEnabled() {
  try { return (localStorage.getItem(TOGGLE_KEY) ?? '1') === '1' } catch { return true }
}
export function setAiBotEnabled(v) {
  try { localStorage.setItem(TOGGLE_KEY, v ? '1' : '0') } catch {}
  window.dispatchEvent(new CustomEvent('voltra-ai-toggle', { detail: v }))
}

const QUICK_REPLIES = [
  'Come funziona la Promozione di Grado?',
  'A cosa servono le onorificenze?',
  'Cosa contiene il Fascicolo?',
  'Quando arriva il mio rimborso?',
]

const INITIAL_MESSAGE = 'Benvenuto al Quartier Generale. Sono la Cifratrice del Comando. In che modo posso assisterla?'

export default function AiBotWidget() {
  const [enabled, setEnabled] = useState(true)
  const [serverEnabled, setServerEnabled] = useState(false)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showQuick, setShowQuick] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Init
  useEffect(() => {
    setEnabled(isAiBotEnabled())
    const onToggle = (e) => setEnabled(e.detail)
    window.addEventListener('voltra-ai-toggle', onToggle)

    // Check server availability
    fetch(`${API_BASE}/api/ai/status`).then(r => r.json()).then(d => setServerEnabled(d.enabled)).catch(() => setServerEnabled(false))

    // Load history
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      if (saved.length > 0) {
        setMessages(saved)
        setShowQuick(false)
      }
    } catch {}

    return () => window.removeEventListener('voltra-ai-toggle', onToggle)
  }, [])

  // Save history
  useEffect(() => {
    if (messages.length === 0) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20))) } catch {}
  }, [messages])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus on open
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200)
  }, [open])

  // ESC to close
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && open) setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = async (question) => {
    if (loading) return
    setShowQuick(false)
    const userMsg = { role: 'user', content: question }
    const conversationMsgs = [...messages, userMsg]
    setMessages(conversationMsgs)
    setInput('')
    setLoading(true)

    // Add placeholder bot message for streaming
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const token = localStorage.getItem('voltra_token')
      const res = await fetch(`${API_BASE}/api/ai/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ messages: conversationMsgs.map(m => ({ role: m.role, content: m.content })) }),
      })

      if (!res.ok) {
        let errMsg = 'Errore di comunicazione con il Comando.'
        try { const j = await res.json(); errMsg = j.error || errMsg } catch {}
        setMessages(prev => {
          const copy = [...prev]
          copy[copy.length - 1] = { role: 'assistant', content: errMsg }
          return copy
        })
        setLoading(false)
        return
      }

      // SSE stream parsing
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let acc = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n\n')
        buffer = lines.pop() || ''
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.text) {
              acc += data.text
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { role: 'assistant', content: acc }
                return copy
              })
            }
            if (data.error) {
              acc = data.error
              setMessages(prev => {
                const copy = [...prev]
                copy[copy.length - 1] = { role: 'assistant', content: acc }
                return copy
              })
            }
          } catch {}
        }
      }
    } catch (e) {
      setMessages(prev => {
        const copy = [...prev]
        copy[copy.length - 1] = { role: 'assistant', content: 'Errore di comunicazione. Riprovi tra qualche istante.' }
        return copy
      })
    }
    setLoading(false)
  }

  const onSend = () => {
    const v = input.trim()
    if (!v) return
    ask(v)
  }

  const onClear = () => {
    if (!confirm('Cancellare la conversazione?')) return
    setMessages([])
    setShowQuick(true)
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
  }

  if (!enabled || !serverEnabled) return null

  return (
    <>
      {/* Bottone trigger */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Apri assistente"
        className="voltra-ai-trigger"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'var(--lime)',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(180,255,57,0.4)',
          display: open ? 'none' : 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9990,
          transition: 'transform 0.2s',
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.05)' }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4H8" />
          <rect x="4" y="8" width="16" height="12" rx="2" />
          <circle cx="9" cy="13" r="1" fill="#000" />
          <circle cx="15" cy="13" r="1" fill="#000" />
          <path d="M9 17h6" />
        </svg>
      </button>

      {/* Widget */}
      {open && (
        <div className="voltra-ai-panel" style={{
          width: 360,
          maxWidth: 'calc(100vw - 24px)',
          height: 540,
          maxHeight: 'calc(100vh - 100px)',
          background: '#0c0c0c',
          border: '1px solid rgba(180,255,57,0.25)',
          borderRadius: 14,
          boxShadow: '0 16px 64px rgba(0,0,0,0.6)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9989,
          animation: 'aiSlideIn 0.25s cubic-bezier(.2,.7,.3,1)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 14px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'linear-gradient(135deg, #0c0c0c 0%, rgba(180,255,57,0.04) 100%)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--surface-2)',
              border: '1px solid rgba(180,255,57,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B4FF39" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8V4H8" /><rect x="4" y="8" width="16" height="12" rx="2" />
                <circle cx="9" cy="13" r="1" fill="#B4FF39" /><circle cx="15" cy="13" r="1" fill="#B4FF39" />
                <path d="M9 17h6" />
              </svg>
            </div>
            <div style={{ flex: 1, lineHeight: 1.2 }}>
              <div className="display" style={{ fontSize: 14, fontWeight: 700, letterSpacing: '-0.01em' }}>Cifratrice del Comando</div>
              <div style={{ fontSize: 9, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--lime)' }} />
                In ascolto
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={onClear} title="Cancella" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z"/></svg>
              </button>
            )}
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--muted)', width: 26, height: 26, borderRadius: 6, cursor: 'pointer', fontSize: 14 }}>✕</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ alignSelf: 'flex-start', maxWidth: '85%', padding: '10px 12px', borderRadius: 10, fontSize: 13, lineHeight: 1.5, background: 'var(--surface-2)', border: '1px solid var(--border)', borderBottomLeftRadius: 4 }}>
              <div style={{ fontSize: 9, color: 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3 }}>Cifratrice</div>
              {INITIAL_MESSAGE}
            </div>

            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                padding: '10px 12px',
                borderRadius: 10,
                fontSize: 13,
                lineHeight: 1.5,
                background: m.role === 'user' ? 'rgba(180,255,57,0.08)' : 'var(--surface-2)',
                border: m.role === 'user' ? '1px solid rgba(180,255,57,0.25)' : '1px solid var(--border)',
                borderBottomRightRadius: m.role === 'user' ? 4 : 10,
                borderBottomLeftRadius: m.role === 'user' ? 10 : 4,
                whiteSpace: 'pre-wrap',
              }}>
                <div style={{ fontSize: 9, color: m.role === 'user' ? 'var(--muted)' : 'var(--lime)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 3, textAlign: m.role === 'user' ? 'right' : 'left' }}>
                  {m.role === 'user' ? 'Lei' : 'Cifratrice'}
                </div>
                {m.content || (loading && i === messages.length - 1 ? <TypingDots /> : '')}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {showQuick && messages.length === 0 && (
            <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {QUICK_REPLIES.map(q => (
                <button key={q} onClick={() => ask(q)} style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--muted)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontSize: 11,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(180,255,57,0.4)'; e.currentTarget.style.color = 'var(--lime)' }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--muted)' }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: 12, borderTop: '1px solid var(--border)', background: '#0a0a0a' }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10, padding: '4px 4px 4px 12px' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') onSend() }}
                placeholder={loading ? 'Attendere...' : 'Scriva al Comando...'}
                disabled={loading}
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text)', fontFamily: 'inherit', fontSize: 13, padding: '6px 0' }}
              />
              <button onClick={onSend} disabled={loading || !input.trim()} style={{
                background: input.trim() && !loading ? 'var(--lime)' : 'var(--surface-2)',
                color: input.trim() && !loading ? '#000' : 'var(--muted)',
                border: 'none',
                borderRadius: 8,
                width: 30, height: 30,
                cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                transition: 'transform 0.15s',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12l14-7-7 14-2-5-5-2z" />
                </svg>
              </button>
            </div>
            <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--muted-2)', marginTop: 6, fontStyle: 'italic' }}>
              Risposte AI. Per casi complessi: Linea Diretta HQ.
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function TypingDots() {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'aiTyping 1.2s ease-in-out infinite' }} />
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'aiTyping 1.2s ease-in-out infinite 0.15s' }} />
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: 'aiTyping 1.2s ease-in-out infinite 0.3s' }} />
    </span>
  )
}
