import { useState, useRef, useEffect } from 'react'

export default function Tooltip({ text, children }) {
  const [show, setShow] = useState(false)
  const [pos, setPos] = useState({ top: 0, left: 0 })
  const ref = useRef(null)

  useEffect(() => {
    if (show && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      setPos({
        top: rect.top - 10,
        left: rect.left + rect.width / 2,
      })
    }
  }, [show])

  return (
    <>
      <span
        ref={ref}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        onClick={() => setShow(s => !s)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 16,
          height: 16,
          borderRadius: '50%',
          border: '1px solid var(--border-bright)',
          color: 'var(--muted)',
          fontSize: 10,
          fontWeight: 700,
          marginLeft: 6,
          cursor: 'help',
          verticalAlign: 'middle',
          flexShrink: 0,
        }}
      >?</span>
      {show && (
        <span style={{
          position: 'fixed',
          top: pos.top,
          left: pos.left,
          transform: 'translate(-50%, -100%)',
          background: '#000',
          border: '1px solid var(--lime)',
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: 12,
          color: 'var(--text)',
          maxWidth: 260,
          lineHeight: 1.5,
          zIndex: 99999,
          pointerEvents: 'none',
          fontWeight: 400,
          fontStyle: 'normal',
          textTransform: 'none',
          letterSpacing: 'normal',
          textAlign: 'left',
          boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
        }}>{text}{children}</span>
      )}
    </>
  )
}
