import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

// Messaggi rotanti — Opus può espandere
const TICKER_BASE = [
  'VOLTRA OPS · LIVE',
  'STATUS NOMINAL',
  'QG · CONNESSIONE STABILE',
  'SILENTIO AGIMUS',
  'CONSTANTIA ANTE OMNIA',
  'CANALE OPERATIVO ATTIVO',
  'SETTORE EUR-1 ATTIVO',
  'SETTORE EUR-2 ATTIVO',
  'SETTORE MED-1 ATTIVO',
  'TRASMISSIONE CRIPTATA',
]

export default function LiveTicker() {
  const [stats, setStats] = useState({ active: 0, avgDays: 0 })
  const [time, setTime] = useState('')

  useEffect(() => {
    api.alboOnore().then(d => {
      if (d) setStats({ active: d.totalActive || 0, avgDays: d.avgAnzianita || 0 })
    }).catch(() => {})

    const updateTime = () => {
      const now = new Date()
      setTime(`${String(now.getUTCHours()).padStart(2,'0')}:${String(now.getUTCMinutes()).padStart(2,'0')} UTC`)
    }
    updateTime()
    const interval = setInterval(updateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  const messages = [
    ...TICKER_BASE,
    `${stats.active} IN SERVIZIO`,
    `ANZIANITÀ MEDIA ${stats.avgDays} GG`,
    time,
  ]

  return (
    <div className="voltra-ticker">
      <div className="voltra-ticker-track">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="voltra-ticker-item">
            <span className="voltra-ticker-dot" />
            {msg}
          </span>
        ))}
      </div>
    </div>
  )
}
