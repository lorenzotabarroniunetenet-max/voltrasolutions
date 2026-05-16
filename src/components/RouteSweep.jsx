import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function RouteSweep() {
  const location = useLocation()
  const [sweepKey, setSweepKey] = useState(0)

  useEffect(() => {
    setSweepKey(k => k + 1)
  }, [location.pathname])

  return (
    <div
      key={sweepKey}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden',
      }}
    >
      <div className="voltra-sweep-line" />
      <div className="voltra-sweep-glow" />
    </div>
  )
}
