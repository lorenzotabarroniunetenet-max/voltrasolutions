import { useEffect, useState } from 'react'

const STORAGE_KEY = 'voltra_streak'

function loadStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return {
      current: data.current || 0,
      record: data.record || 0,
      lastDate: data.lastDate || null,
    }
  } catch { return { current: 0, record: 0, lastDate: null } }
}

function saveStreak(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)) } catch {}
}

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function yesterdayKey() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export function checkAndUpdateStreak() {
  const s = loadStreak()
  const today = todayKey()
  if (s.lastDate === today) return s
  if (s.lastDate === yesterdayKey()) {
    s.current += 1
  } else {
    s.current = 1
  }
  if (s.current > s.record) s.record = s.current
  s.lastDate = today
  saveStreak(s)
  return s
}

export default function DailyStreak() {
  const [streak, setStreak] = useState({ current: 0, record: 0, lastDate: null })

  useEffect(() => {
    setStreak(checkAndUpdateStreak())
  }, [])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 20,
      background: 'linear-gradient(135deg, rgba(180,255,57,0.04), rgba(0,0,0,0.4))',
      border: '1px solid rgba(180,255,57,0.2)',
      borderRadius: 12,
    }}>
      <div style={{ fontSize: 36, lineHeight: 1 }}>🔥</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700, marginBottom: 4 }}>Streak operativa</div>
        <div className="display" style={{ fontSize: 32, color: 'var(--lime)', lineHeight: 1, fontWeight: 700 }}>{streak.current}</div>
        <div style={{ color: 'var(--muted)', fontSize: 12, marginTop: 4 }}>giorni consecutivi</div>
      </div>
      {streak.record > 0 && (
        <div style={{ textAlign: 'right', color: 'var(--muted)', fontSize: 11 }}>
          <div>Record personale</div>
          <div style={{ color: 'var(--lime)', fontWeight: 700, fontSize: 16, marginTop: 2 }}>{streak.record} giorni</div>
        </div>
      )}
    </div>
  )
}
