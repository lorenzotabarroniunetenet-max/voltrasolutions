import { useEffect, useState, useRef } from 'react'
import { api } from '../lib/api.js'

export default function AchievementToast() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState(null)
  const lastSeenRef = useRef(localStorage.getItem('voltra_last_achievement') || '')
  const particlesRef = useRef(null)

  useEffect(() => {
    const check = async () => {
      try {
        const notifs = await api.notifications()
        if (!Array.isArray(notifs)) return
        // Cerca prima notifica di tipo decoration/promotion/ceremony non ancora vista
        const trigger = notifs.find(n =>
          ['decoration','promotion','ceremony'].includes(n.type) &&
          !n.readAt &&
          n.id !== lastSeenRef.current
        )
        if (trigger) {
          const isSigillo = (trigger.body || '').toLowerCase().includes('sigillo del fondatore')
          setData({
            id: trigger.id,
            type: trigger.type,
            title: trigger.title,
            body: trigger.body,
            isRare: isSigillo,
          })
          setShow(true)
          lastSeenRef.current = trigger.id
          localStorage.setItem('voltra_last_achievement', trigger.id)
        }
      } catch (e) {}
    }
    check()
    const interval = setInterval(check, 60000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (show && particlesRef.current) spawnParticles(particlesRef.current, data?.isRare)
  }, [show, data])

  const handleClose = async () => {
    setShow(false)
    if (data?.id) {
      try { await api.notificationRead(data.id) } catch (e) {}
    }
  }

  if (!show || !data) return null

  const accent = data.isRare ? '#FFD24A' : '#FFD24A'
  const iconMap = {
    decoration: data.isRare ? '✦' : '⚜',
    promotion: '🎖',
    ceremony: '⭐',
  }

  return (
    <div className="voltra-achievement-overlay show" onClick={handleClose}>
      <div className="voltra-achievement-particles" ref={particlesRef} />
      <div className="voltra-achievement-box" onClick={e => e.stopPropagation()}>
        <div className="voltra-achievement-label">
          — {data.type === 'promotion' ? 'PROMOZIONE DI GRADO' : 'ONORIFICENZA CONFERITA'} —
        </div>
        <div className="voltra-achievement-icon" style={{ color: accent }}>
          {iconMap[data.type] || '⚜'}
        </div>
        <div className="voltra-achievement-title" style={{ color: accent }}>
          {data.title}
        </div>
        <div className="voltra-achievement-desc">
          {data.body || 'Il Comando registra il valore dimostrato.'}
        </div>
        <button className="voltra-achievement-close" onClick={handleClose}>
          Prendo Atto
        </button>
      </div>
    </div>
  )
}

function spawnParticles(container, rare) {
  container.innerHTML = ''
  const count = rare ? 60 : 30
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div')
    p.className = 'voltra-particle'
    container.appendChild(p)
    const angle = (Math.PI * 2 * i) / count
    const dist = 150 + Math.random() * 250
    const dx = Math.cos(angle) * dist
    const dy = Math.sin(angle) * dist
    p.animate([
      { transform: 'translate(-50%, -50%) scale(0)', opacity: 0 },
      { transform: `translate(calc(-50% + ${dx*0.5}px), calc(-50% + ${dy*0.5}px)) scale(1)`, opacity: 1, offset: 0.3 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`, opacity: 0 },
    ], { duration: 1500 + Math.random() * 800, easing: 'cubic-bezier(0.2, 0.6, 0.4, 1)' })
  }
}
