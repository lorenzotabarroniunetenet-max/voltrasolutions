import { useEffect } from 'react'

const STORAGE_KEY = 'voltra_gunshot_enabled'

export function isGunshotEnabled() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === null ? true : v === '1'  // Default ON
  } catch { return true }
}

export function setGunshotEnabled(enabled) {
  try { localStorage.setItem(STORAGE_KEY, enabled ? '1' : '0') } catch {}
  window.dispatchEvent(new CustomEvent('voltra-gunshot-toggle', { detail: enabled }))
}

export default function Gunshot() {
  useEffect(() => {
    // Check global server-side disable
    let serverDisabled = false
    try {
      serverDisabled = window.__voltraGunshotDisabled === true
    } catch {}

    const onClick = (e) => {
      if (serverDisabled) return
      if (!isGunshotEnabled()) return

      const x = e.clientX
      const y = e.clientY

      // Flash centrale (lampo)
      const flash = document.createElement('div')
      flash.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
        background: radial-gradient(circle, #B4FF39 0%, rgba(180,255,57,0.6) 40%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 99997;
        mix-blend-mode: screen;
      `
      document.body.appendChild(flash)
      flash.animate([
        { transform: 'scale(0.3)', opacity: 1 },
        { transform: 'scale(3)', opacity: 0 }
      ], { duration: 250, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => flash.remove()

      // Onda concentrica (anello)
      const ring = document.createElement('div')
      ring.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 10px;
        height: 10px;
        margin-left: -5px;
        margin-top: -5px;
        border: 2px solid #B4FF39;
        border-radius: 50%;
        pointer-events: none;
        z-index: 99997;
      `
      document.body.appendChild(ring)
      ring.animate([
        { transform: 'scale(0.5)', opacity: 1, borderWidth: '2px' },
        { transform: 'scale(6)', opacity: 0, borderWidth: '0.5px' }
      ], { duration: 400, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => ring.remove()

      // Particle spread
      const colors = ['#B4FF39', '#ffffff', '#B4FF39']
      const particleCount = 8
      for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div')
        const angle = (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5
        const distance = 30 + Math.random() * 30
        const dx = Math.cos(angle) * distance
        const dy = Math.sin(angle) * distance
        const size = 3 + Math.random() * 3
        p.style.cssText = `
          position: fixed;
          left: ${x}px;
          top: ${y}px;
          width: ${size}px;
          height: ${size}px;
          margin-left: ${-size/2}px;
          margin-top: ${-size/2}px;
          background: ${colors[Math.floor(Math.random() * colors.length)]};
          border-radius: 50%;
          pointer-events: none;
          z-index: 99997;
          box-shadow: 0 0 6px #B4FF39;
        `
        document.body.appendChild(p)
        p.animate([
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          { transform: `translate(${dx}px, ${dy}px) scale(0)`, opacity: 0 }
        ], { duration: 350 + Math.random() * 150, easing: 'cubic-bezier(.2,.7,.3,1)' }).onfinish = () => p.remove()
      }
    }

    // Su mobile: touchstart per essere immediato (click sarebbe ritardato)
    const onTouch = (e) => {
      if (serverDisabled) return
      if (!isGunshotEnabled()) return
      const t = e.touches[0] || e.changedTouches[0]
      if (!t) return
      onClick({ clientX: t.clientX, clientY: t.clientY })
    }

    document.addEventListener('click', onClick, true)
    document.addEventListener('touchstart', onTouch, { passive: true })

    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('touchstart', onTouch)
    }
  }, [])

  return null
}
