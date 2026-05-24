import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

const OATH_KEY = 'voltra.oath.done'

const LINES = [
  { text: 'Io,', type: 'normal' },
  { text: null, type: 'name' }, // replaced with user name
  { text: '', type: 'space' },
  { text: 'entro nel Comando Voltra', type: 'normal' },
  { text: 'consapevole di ciò che questo significa.', type: 'normal' },
  { text: '', type: 'space' },
  { text: 'Giuro di rispettare il Codice di Condotta.', type: 'gold' },
  { text: '', type: 'space' },
  { text: 'Giuro di operare con disciplina,', type: 'normal' },
  { text: 'con metodo, senza eccezioni.', type: 'normal' },
  { text: '', type: 'space' },
  { text: 'Giuro di mantenere il silenzio', type: 'normal' },
  { text: 'su ciò che avviene nel Comando.', type: 'normal' },
  { text: '', type: 'space' },
  { text: 'Non sono un cliente.', type: 'lime' },
  { text: 'Sono un membro.', type: 'lime' },
  { text: '', type: 'space' },
]

export default function OathOverlay({ user }) {
  const [phase, setPhase] = useState('dark') // dark → oath → sign → cert
  const [darkMsg, setDarkMsg] = useState('Preparati')
  const [visibleLines, setVisibleLines] = useState([])
  const [footerVisible, setFooterVisible] = useState(false)
  const [signValue, setSignValue] = useState('')
  const [certVisible, setCertVisible] = useState(false)
  const inputRef = useRef(null)
  const nav = useNavigate()

  // Check if already done
  useEffect(() => {
    if (localStorage.getItem(OATH_KEY)) {
      setPhase('done')
    } else {
      startDark()
    }
  }, [])

  const startDark = () => {
    const msgs = ['Preparati', 'Silenzio', 'Il Comando ti osserva', '⚡']
    let i = 0
    setPhase('dark')
    const iv = setInterval(() => {
      i++
      if (i < msgs.length) {
        setDarkMsg(msgs[i])
      } else {
        clearInterval(iv)
        setTimeout(() => setPhase('oath'), 600)
      }
    }, 700)
  }

  useEffect(() => {
    if (phase !== 'oath') return
    setVisibleLines([])
    setFooterVisible(false)
    const lines = LINES.map((l, i) => ({ ...l, id: i }))
    lines.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, i])
      }, i * 140)
    })
    setTimeout(() => setFooterVisible(true), lines.length * 140 + 600)
  }, [phase])

  useEffect(() => {
    if (phase === 'sign') {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [phase])

  const lineColor = (type) => {
    if (type === 'lime') return '#B4FF39'
    if (type === 'gold') return '#E8C84A'
    if (type === 'name') return '#fff'
    return 'rgba(255,255,255,.65)'
  }

  const lineFontWeight = (type) => {
    if (type === 'name' || type === 'lime') return 700
    if (type === 'gold') return 600
    return 400
  }

  const done = () => {
    localStorage.setItem(OATH_KEY, '1')
    setPhase('done')
  }

  const userName = user?.name || 'Membro'
  const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  if (phase === 'done') return null

  const overlay = {
    position: 'fixed', inset: 0, zIndex: 3000,
    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  }

  const scan = {
    position: 'absolute', inset: 0, pointerEvents: 'none',
    background: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)',
  }

  // ── DARK ──
  if (phase === 'dark') return (
    <div style={{ ...overlay, background: '#000' }}>
      <div style={scan} />
      <div style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'rgba(255,255,255,.3)',
        textTransform: 'uppercase', letterSpacing: '.18em', animation: 'voltra-flicker 1.5s ease-in-out infinite',
      }}>{darkMsg}</div>
      <style>{`@keyframes voltra-flicker{0%,100%{opacity:.2}50%{opacity:1}}`}</style>
    </div>
  )

  // ── OATH ──
  if (phase === 'oath') return (
    <div style={{ ...overlay, background: '#000' }}>
      <div style={scan} />
      <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(180,255,57,.4),transparent)' }} />
      <div style={{ textAlign: 'center', marginBottom: 28, position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#B4FF39', textTransform: 'uppercase', letterSpacing: '.18em', fontWeight: 700, marginBottom: 10 }}>
          {user?.rank || 'Membro'} · {user?.matricola || ''}
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 'clamp(26px,5vw,38px)', fontWeight: 900, letterSpacing: '-.02em' }}>
          Il Giuramento
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 520, width: '100%', maxHeight: '50vh', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 32, background: 'linear-gradient(to bottom,#000,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 48, background: 'linear-gradient(to top,#000,transparent)', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ padding: '16px 0 40px', textAlign: 'center' }}>
          {LINES.map((line, i) => {
            const visible = visibleLines.includes(i)
            const text = line.type === 'name' ? userName : line.text
            if (line.type === 'space') return (
              <div key={i} style={{ height: 14 }} />
            )
            return (
              <div key={i} style={{
                display: 'block',
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(16px,2.5vw,20px)',
                lineHeight: 1.9,
                color: lineColor(line.type),
                fontWeight: lineFontWeight(line.type),
                fontStyle: line.type === 'normal' ? 'italic' : 'normal',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity .5s, transform .5s',
              }}>{text}</div>
            )
          })}
        </div>
      </div>

      {footerVisible && (
        <div style={{ marginTop: 28, position: 'relative', zIndex: 1, opacity: footerVisible ? 1 : 0, transition: 'opacity .6s' }}>
          <button
            onClick={() => setPhase('sign')}
            style={{ background: '#B4FF39', color: '#000', border: 'none', padding: '13px 32px', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', borderRadius: 8 }}
          >
            Firmo il Giuramento
          </button>
        </div>
      )}
    </div>
  )

  // ── SIGN ──
  if (phase === 'sign') return (
    <div style={{ ...overlay, background: '#000' }}>
      <div style={scan} />
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 440, width: '100%' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(20px,4vw,28px)', fontStyle: 'italic', color: 'rgba(255,255,255,.5)', marginBottom: 40, lineHeight: 1.6 }}>
          Scrivi il tuo nome per confermare il giuramento.
        </div>
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.15em', marginBottom: 12, display: 'block', textAlign: 'center' }}>La tua firma</div>
          <input
            ref={inputRef}
            value={signValue}
            onChange={e => setSignValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && signValue.trim().length > 1 && setPhase('cert')}
            placeholder={userName}
            style={{
              background: 'transparent', border: 'none', borderBottom: `1px solid ${signValue.length > 1 ? 'rgba(180,255,57,.5)' : 'rgba(255,255,255,.15)'}`,
              color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(22px,4vw,32px)',
              fontStyle: 'italic', textAlign: 'center', width: '100%', padding: '8px 0', outline: 'none',
              transition: 'border-color .3s',
            }}
          />
        </div>
        <button
          onClick={() => signValue.trim().length > 1 && setPhase('cert')}
          style={{
            background: signValue.trim().length > 1 ? '#B4FF39' : 'rgba(255,255,255,.05)',
            color: signValue.trim().length > 1 ? '#000' : 'rgba(255,255,255,.2)',
            border: 'none', padding: '13px 32px', fontFamily: 'Manrope, sans-serif',
            fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em',
            cursor: signValue.trim().length > 1 ? 'pointer' : 'default',
            borderRadius: 8, transition: 'all .2s',
          }}
        >
          Giuro ⚡
        </button>
      </div>
    </div>
  )

  // ── CERT ──
  if (phase === 'cert') return (
    <div style={{ ...overlay, background: '#000' }}>
      <div style={scan} />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 50%,rgba(180,255,57,.06),transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 440, width: '100%' }}>
        <div style={{
          background: '#050505', border: '1px solid rgba(180,255,57,.25)', borderRadius: 20, padding: 'clamp(24px,4vw,40px)',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(180,255,57,.8),transparent)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%,rgba(180,255,57,.05),transparent 60%)', pointerEvents: 'none' }} />

          <div style={{ fontSize: 48, marginBottom: 16, display: 'block', filter: 'drop-shadow(0 0 20px rgba(180,255,57,.4))' }}>🎖</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#B4FF39', textTransform: 'uppercase', letterSpacing: '.18em', fontWeight: 700, marginBottom: 12 }}>Certificato di Arruolamento</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(24px,4vw,34px)', fontWeight: 600, color: '#fff', marginBottom: 4 }}>
            {signValue || userName}
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 20 }}>
            {user?.rank || 'Membro'} · {user?.matricola || ''}
            {user?.memberNumber ? ` · #${String(user.memberNumber).padStart(3, '0')}` : ''}
          </div>
          <div style={{ width: 48, height: 1, background: 'linear-gradient(90deg,transparent,rgba(180,255,57,.5),transparent)', margin: '0 auto 20px' }} />
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, color: 'rgba(255,255,255,.35)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 20 }}>
            Ha prestato giuramento davanti al Comando Voltra e ne è membro a tutti gli effetti. Il suo impegno è registrato e vincolante.
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.1em', marginBottom: 18 }}>
            {today.toUpperCase()}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.07)', paddingTop: 14 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontStyle: 'italic', color: 'rgba(255,255,255,.5)' }}>
              {signValue || userName}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase', letterSpacing: '.1em', marginTop: 4 }}>
              Firma del membro
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <button
            onClick={done}
            style={{ background: '#B4FF39', color: '#000', border: 'none', padding: '13px 32px', fontFamily: 'Manrope, sans-serif', fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em', cursor: 'pointer', borderRadius: 8 }}
          >
            Entra nel Comando →
          </button>
        </div>
      </div>
    </div>
  )

  return null
}

export function resetOath() {
  localStorage.removeItem(OATH_KEY)
}
