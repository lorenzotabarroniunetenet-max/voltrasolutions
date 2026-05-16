import { useEffect, useState, useRef } from 'react'

export default function Crosshair() {
  const [visible, setVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    if (isCoarse) return // No crosshair su mobile/touch

    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px'
        ref.current.style.top = e.clientY + 'px'
      }
      setVisible(true)
    }
    const onLeave = () => setVisible(false)

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        width: 32,
        height: 32,
        pointerEvents: 'none',
        zIndex: 99999,
        transform: 'translate(-50%, -50%)',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.15s',
        mixBlendMode: 'difference',
      }}
    >
      <svg viewBox="0 0 32 32" fill="none" stroke="#B4FF39" strokeWidth="1.5" width="32" height="32">
        <circle cx="16" cy="16" r="12" opacity="0.8" />
        <circle cx="16" cy="16" r="2" fill="#B4FF39" />
        <line x1="16" y1="2" x2="16" y2="8" />
        <line x1="16" y1="24" x2="16" y2="30" />
        <line x1="2" y1="16" x2="8" y2="16" />
        <line x1="24" y1="16" x2="30" y2="16" />
      </svg>
    </div>
  )
}
