import { useState, useMemo } from 'react'

export default function DailyCalendar({ snapshots, account }) {
  const startBalance = Number(account?.startBalance || 0)

  // Build map date -> snapshot
  const byDate = useMemo(() => {
    const m = {}
    ;(snapshots || []).forEach(s => {
      const d = new Date(s.date)
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      m[key] = s
    })
    return m
  }, [snapshots])

  const [cursor, setCursor] = useState(() => {
    if (snapshots && snapshots.length > 0) {
      const latest = new Date(snapshots[0].date)
      return new Date(latest.getFullYear(), latest.getMonth(), 1)
    }
    return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  })

  const year = cursor.getFullYear()
  const month = cursor.getMonth()
  const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre']

  // Build calendar grid - weeks
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  // Monday-based weekday (0 = Monday)
  const startDow = (firstDay.getDay() + 6) % 7
  const daysInMonth = lastDay.getDate()

  const cells = []
  for (let i = 0; i < startDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  // Aggregate by ISO week within the displayed month
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  // Monthly totals
  const monthSnaps = Object.entries(byDate).filter(([k]) => {
    const [y, m] = k.split('-')
    return Number(y) === year && Number(m) === month + 1
  })
  const monthPL = monthSnaps.reduce((sum, [, s]) => sum + Number(s.dailyPL || 0), 0)
  const monthTrades = monthSnaps.reduce((sum, [, s]) => sum + Number(s.trades || 0), 0)
  const winDays = monthSnaps.filter(([, s]) => Number(s.dailyPL || 0) > 0).length
  const lossDays = monthSnaps.filter(([, s]) => Number(s.dailyPL || 0) < 0).length

  const goPrev = () => setCursor(new Date(year, month - 1, 1))
  const goNext = () => setCursor(new Date(year, month + 1, 1))

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h3 className="display" style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Riepilogo giornaliero</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={goPrev} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>‹</button>
          <div style={{ minWidth: 140, textAlign: 'center', fontSize: 14, fontWeight: 600 }}>{monthNames[month]} {year}</div>
          <button onClick={goNext} className="btn-secondary" style={{ padding: '6px 12px', fontSize: 13 }}>›</button>
        </div>
      </div>

      {/* Monthly summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }}>
        <Stat label="P&L mese" value={`${monthPL >= 0 ? '+' : ''}$${monthPL.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} color={monthPL >= 0 ? 'var(--lime)' : 'var(--red)'} />
        <Stat label="Trades" value={monthTrades} />
        <Stat label="Giorni positivi" value={winDays} color="var(--lime)" />
        <Stat label="Giorni negativi" value={lossDays} color="var(--red)" />
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 6 }}>
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {weeks.flat().map((day, idx) => {
          if (day === null) return <div key={idx} style={{ aspectRatio: '1', background: 'transparent' }} />
          const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const snap = byDate[key]
          const pl = snap ? Number(snap.dailyPL || 0) : null
          const trades = snap ? Number(snap.trades || 0) : 0
          const isToday = (() => {
            const t = new Date()
            return t.getFullYear() === year && t.getMonth() === month && t.getDate() === day
          })()

          let bg = 'var(--surface-2)'
          let border = '1px solid var(--border)'
          let textColor = 'var(--muted)'
          if (pl != null) {
            if (pl > 0) {
              const intensity = Math.min(1, Math.abs(pl) / (startBalance * 0.02 || 100))
              bg = `rgba(180, 255, 57, ${0.1 + intensity * 0.5})`
              border = '1px solid rgba(180, 255, 57, 0.4)'
              textColor = 'var(--text)'
            } else if (pl < 0) {
              const intensity = Math.min(1, Math.abs(pl) / (startBalance * 0.02 || 100))
              bg = `rgba(255, 71, 87, ${0.1 + intensity * 0.5})`
              border = '1px solid rgba(255, 71, 87, 0.4)'
              textColor = 'var(--text)'
            } else {
              bg = 'var(--surface-3)'
              textColor = 'var(--text)'
            }
          }
          if (isToday) border = '2px solid var(--lime)'

          return (
            <div key={idx} title={snap ? `${pl >= 0 ? '+' : ''}$${pl.toLocaleString(undefined, { maximumFractionDigits: 2 })} · ${trades} trades` : 'Nessun dato'}
              style={{
                aspectRatio: '1', minHeight: 56, background: bg, border, borderRadius: 8,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                padding: '6px 8px', cursor: snap ? 'pointer' : 'default',
              }}>
              <div style={{ fontSize: 11, color: textColor, fontWeight: 600 }}>{day}</div>
              {snap && (
                <div style={{ fontSize: 10, color: textColor, fontWeight: 700, textAlign: 'right', lineHeight: 1.1 }}>
                  {pl >= 0 ? '+' : '−'}${Math.abs(pl).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.7, marginTop: 1 }}>{trades}t</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(180, 255, 57, 0.4)' }} />
          Profitto
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'rgba(255, 71, 87, 0.4)' }} />
          Perdita
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: 3, background: 'var(--surface-2)', border: '1px solid var(--border)' }} />
          Nessun trade
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, color }) {
  return (
    <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: color || 'var(--text)' }}>{value}</div>
    </div>
  )
}
