import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'
import { GRADE_LORE } from '../lib/lore.js'

// Frasi del giorno — Opus può espandere a 365
const DAILY_QUOTES = [
  'Il Comando rinnova la consegna del silenzio. Restare in posizione.',
  'Chi tace, ascolta. Chi ascolta, comprende.',
  'L\'avamposto non si lascia. L\'avamposto si custodisce.',
  'Ogni giorno di servizio è un atto deliberato.',
  'Constantia ante omnia.',
  'Il valore non si grida. Si dimostra.',
  'La disciplina è la forma più alta della libertà.',
  'Si combatte per ciò che si protegge, non per ciò che si cerca.',
  'Il grado non è premio. È responsabilità.',
  'Riportare al Comando senza filtri. È la regola prima.',
  'Chi conosce il proprio limite, lo supera.',
  'Silentio agimus.',
]

export default function DailySplash() {
  const [show, setShow] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10)
    const last = localStorage.getItem('voltra_last_splash')
    if (last === today) return

    Promise.all([
      api.dossier().catch(() => null),
      api.alboOnore().catch(() => null),
    ]).then(([dossier, albo]) => {
      if (!dossier) return
      const quoteIdx = new Date().getDate() % DAILY_QUOTES.length
      setData({
        rank: dossier.rank || 'Caporale',
        name: (dossier.name || '').split(' ')[0]?.toUpperCase() || 'MEMBRO',
        days: dossier.daysOfService || 0,
        active: albo?.totalActive || 0,
        quote: DAILY_QUOTES[quoteIdx],
      })
      setShow(true)
      localStorage.setItem('voltra_last_splash', today)
    })
  }, [])

  if (!show || !data) return null
  const lore = GRADE_LORE[data.rank] || GRADE_LORE.Caporale

  return (
    <div className="voltra-daily-splash" onClick={() => setShow(false)}>
      <div className="voltra-splash-icon">{lore.rank}</div>
      <div className="voltra-splash-greeting">
        BUONGIORNO <span style={{ color: '#fff' }}>{data.name}</span>
      </div>
      <div className="voltra-splash-motto">« {lore.motto} »</div>
      <div className="voltra-splash-stats">
        <div>
          <div className="voltra-splash-stat-value">{data.days}</div>
          <div className="voltra-splash-stat-label">Giorno di servizio</div>
        </div>
        <div>
          <div className="voltra-splash-stat-value">{data.active}</div>
          <div className="voltra-splash-stat-label">In servizio</div>
        </div>
      </div>
      <div className="voltra-splash-quote">"{data.quote}"</div>
      <div className="voltra-splash-tap">▸ TOCCA PER PROCEDERE</div>
    </div>
  )
}
