import { useEffect, useState, useMemo } from 'react'
import { api } from '../lib/api.js'
import { Link } from 'react-router-dom'

const MONTH_NAMES = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre']
const DAY_NAMES = ['L','M','M','G','V','S','D']

export default function Calendario() {
  const [briefings, setBriefings] = useState([])
  const [dossier, setDossier] = useState(null)
  const [view, setView] = useState(new Date())

  useEffect(() => {
    api.briefings().then(setBriefings).catch(() => {})
    api.dossier().then(setDossier).catch(() => {})
  }, [])

  const events = useMemo(() => {
    const list = []
    for (const b of briefings) {
      list.push({
        date: new Date(b.publishedAt),
        type: 'briefing',
        title: b.title,
        url: '/briefing',
        icon: '📜',
        color: 'var(--lime)',
      })
    }
    if (dossier?.enlistedAt) {
      const enlist = new Date(dossier.enlistedAt)
      const today = new Date()
      const thisYearAnniv = new Date(today.getFullYear(), enlist.getMonth(), enlist.getDate())
      list.push({
        date: thisYearAnniv,
        type: 'anniversary',
        title: 'Anniversario di servizio',
        url: '/fascicolo',
        icon: '🎂',
        color: '#E8C84A',
      })
    }
    if (dossier?.serviceLog) {
      for (const s of dossier.serviceLog) {
        list.push({
          date: new Date(s.occurredAt),
          type: s.type,
          title: s.title,
          url: '/fascicolo',
          icon: s.iconKey || '◈',
          color: 'var(--muted)',
        })
      }
    }
    return list
  }, [briefings, dossier])

  const currentMonth = view.getMonth()
  const currentYear = view.getFullYear()
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  const startOffset = (firstDay.getDay() + 6) % 7 // Lun=0
  const daysInMonth = lastDay.getDate()

  const eventsByDay = {}
  for (const e of events) {
    if (e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear) {
      const d = e.date.getDate()
      eventsByDay[d] = eventsByDay[d] || []
      eventsByDay[d].push(e)
    }
  }

  const today = new Date()
  const isToday = (d) => today.getDate() === d && today.getMonth() === currentMonth && today.getFullYear() === currentYear

  const goPrev = () => setView(new Date(currentYear, currentMonth - 1, 1))
  const goNext = () => setView(new Date(currentYear, currentMonth + 1, 1))
  const goToday = () => setView(new Date())

  return (
    <div style={{ maxWidth: 880, margin: '0 auto' }}>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Calendario</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Briefing · Ricorrenze · Eventi</div>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <button onClick={goPrev} className="btn-secondary" style={{ fontSize: 13, padding: '6px 12px' }}>←</button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 className="display" style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{MONTH_NAMES[currentMonth]} {currentYear}</h2>
            <button onClick={goToday} className="btn-secondary" style={{ fontSize: 11, padding: '4px 10px' }}>Oggi</button>
          </div>
          <button onClick={goNext} className="btn-secondary" style={{ fontSize: 13, padding: '6px 12px' }}>→</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAY_NAMES.map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted-2)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '6px 0' }}>{d}</div>
          ))}
          {Array.from({ length: startOffset }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1
            const dayEvents = eventsByDay[day] || []
            const has = dayEvents.length > 0
            return (
              <div key={day} style={{
                padding: 8,
                minHeight: 60,
                background: isToday(day) ? 'rgba(180,255,57,0.06)' : 'var(--surface-2)',
                border: isToday(day) ? '1px solid rgba(180,255,57,0.4)' : '1px solid var(--border)',
                borderRadius: 6,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}>
                <div style={{ fontSize: 11, fontWeight: isToday(day) ? 700 : 500, color: isToday(day) ? 'var(--lime)' : 'var(--text)' }}>
                  {day}
                </div>
                {dayEvents.slice(0, 3).map((e, idx) => (
                  <Link key={idx} to={e.url} style={{ textDecoration: 'none' }}>
                    <div title={e.title} style={{
                      fontSize: 9,
                      padding: 2,
                      background: 'rgba(255,255,255,0.04)',
                      borderRadius: 3,
                      color: e.color,
                      fontWeight: 600,
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                    }}>
                      {e.icon} {e.title}
                    </div>
                  </Link>
                ))}
                {dayEvents.length > 3 && <div style={{ fontSize: 9, color: 'var(--muted)' }}>+{dayEvents.length - 3}</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Prossimi eventi */}
      <div className="card" style={{ padding: 24, marginTop: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Prossimi eventi</h3>
        {events
          .filter(e => e.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate()))
          .sort((a, b) => a.date - b.date)
          .slice(0, 5)
          .map((e, i) => (
            <Link key={i} to={e.url} style={{ display: 'block', padding: '10px 12px', borderBottom: '1px solid var(--border)', textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 18 }}>{e.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{e.date.toLocaleDateString('it-IT', { dateStyle: 'long' })}</div>
              </div>
            </Link>
          ))}
        {events.filter(e => e.date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())).length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: 20 }}>Nessun evento programmato.</p>
        )}
      </div>
    </div>
  )
}
