import { useEffect, useState } from 'react'

const KEY_DISMISSED = 'voltra.install.dismissed'
const KEY_INSTALLED = 'voltra.install.done'

function isIOS() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const isIDevice = /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  return isIDevice && !/CriOS|FxiOS|EdgiOS/.test(ua)
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (isStandalone()) return
    if (localStorage.getItem(KEY_DISMISSED)) return
    if (localStorage.getItem(KEY_INSTALLED)) return

    const onBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    const onInstalled = () => {
      localStorage.setItem(KEY_INSTALLED, '1')
      setShow(false); setDeferredPrompt(null)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)

    let iosTimer
    if (isIOS()) {
      iosTimer = setTimeout(() => { setIosHint(true); setShow(true) }, 8000)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      if (iosTimer) clearTimeout(iosTimer)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(KEY_DISMISSED, String(Date.now()))
    setShow(false)
  }

  const install = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') localStorage.setItem(KEY_INSTALLED, '1')
    else localStorage.setItem(KEY_DISMISSED, String(Date.now()))
    setDeferredPrompt(null); setShow(false)
  }

  if (!show) return null

  return (
    <div style={{
      position: 'fixed', left: 16, right: 16, bottom: 16, zIndex: 9999,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '12px 14px',
      paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
      background: '#050505', border: '1px solid #B4FF39',
      color: '#fff', fontFamily: 'Manrope, system-ui, sans-serif',
      fontSize: 14, lineHeight: 1.3,
      boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 0 1px rgba(180,255,57,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <svg width="20" height="20" viewBox="0 0 100 100" style={{ flexShrink: 0 }}>
          <polygon points="58,0 20,55 46,55 34,100 80,40 52,40 68,0" fill="#B4FF39" />
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {iosHint ? (
            <>
              <strong style={{ fontFamily: 'Bricolage Grotesque, Manrope, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.04em', color: '#fff' }}>
                Installa Voltra
              </strong>
              <span style={{ color: '#888', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', marginTop: 2 }}>
                Safari → <span style={{ border: '1px solid #2a2a2a', padding: '0 4px', color: '#B4FF39' }}>Condividi</span> → <span style={{ border: '1px solid #2a2a2a', padding: '0 4px', color: '#B4FF39' }}>Aggiungi a Home</span>
              </span>
            </>
          ) : (
            <>
              <strong style={{ fontFamily: 'Bricolage Grotesque, Manrope, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: 12, letterSpacing: '0.04em', color: '#fff' }}>
                Installa l'app Voltra
              </strong>
              <span style={{ color: '#666', fontSize: 11, marginTop: 2 }}>
                Accesso rapido dalla schermata Home
              </span>
            </>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        {!iosHint && (
          <button onClick={install} style={{
            background: '#B4FF39', color: '#000', border: 'none',
            padding: '8px 14px', fontFamily: 'Manrope, sans-serif',
            fontWeight: 700, textTransform: 'uppercase', fontSize: 11,
            letterSpacing: '0.06em', cursor: 'pointer',
          }}>
            Installa
          </button>
        )}
        <button onClick={dismiss} aria-label="Chiudi" style={{
          background: 'transparent', color: '#888', border: '1px solid #1f1f1f',
          padding: '7px 10px', cursor: 'pointer', fontSize: 13,
        }}>✕</button>
      </div>
    </div>
  )
}
