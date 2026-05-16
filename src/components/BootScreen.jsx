import { useEffect, useState } from 'react'

const BOOT_LINES = [
  ['CONNESSIONE QUARTIER GENERALE', 'OK'],
  ['AUTENTICAZIONE CREDENZIALI', 'OK'],
  ['CARICAMENTO FASCICOLO PERSONALE', 'OK'],
  ['VERIFICA CHIAVI OPERATIVE', 'OK'],
  ['SINCRONIZZAZIONE SALA BRIEFING', 'OK'],
  ['LETTURA RUOLINO DI SERVIZIO', 'OK'],
  ['CARICAMENTO MAPPA OPERATIVA', 'OK'],
  ['CONNESSIONE STABILITA', 'READY'],
]

export default function BootScreen({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [fadingOut, setFadingOut] = useState(false)

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => setVisibleLines(v => [...v, line]), i * 350)
    })
    setTimeout(() => setFadingOut(true), 3300)
    setTimeout(() => { onComplete && onComplete() }, 3900)
  }, [onComplete])

  return (
    <div className="voltra-boot-screen" style={{ opacity: fadingOut ? 0 : 1 }}>
      <div className="voltra-boot-logo">⚡</div>
      <div className="voltra-boot-brand">VOLTRA</div>
      <div className="voltra-boot-tagline">SISTEMI · QUARTIER GENERALE</div>
      <div className="voltra-boot-log">
        {visibleLines.map((line, i) => (
          <div key={i} className="voltra-boot-log-line">
            <span style={{ color: 'var(--lime)' }}>▸</span>
            <span style={{ color: 'var(--muted)', flex: 1 }}>{line[0]}...</span>
            <span style={{ color: 'var(--lime)', fontWeight: 600 }}>{line[1]}</span>
          </div>
        ))}
      </div>
      <div className="voltra-boot-progress"><div className="voltra-boot-progress-fill" /></div>
      <div className="voltra-boot-footer">SILENTIO AGIMUS</div>
    </div>
  )
}
