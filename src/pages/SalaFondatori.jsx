import { useNavigate } from 'react-router-dom'

export default function SalaFondatori() {
  const nav = useNavigate()

  return (
    <div className="voltra-konami-page show">
      <button className="voltra-konami-close" onClick={() => nav('/dashboard')}>×</button>
      <div className="voltra-konami-content">
        <div className="voltra-konami-seal">✦</div>
        <div className="voltra-konami-title">SALA DEI FONDATORI</div>
        <div className="voltra-konami-sub">ACCESSO RISERVATO</div>

        <p className="voltra-konami-text">
          "Chi è arrivato fin qui ha cercato. Voltra non si annuncia, non si vende, non si propone. Esiste perché chi sa, riconosce. Chi non riconosce, passa oltre.
        </p>
        <p className="voltra-konami-text">
          Questo è il punto in cui il club si racconta soltanto a chi lo merita. Non c'è gerarchia in questa sala. Solo silenzio condiviso."
        </p>

        <div className="voltra-konami-divider" />

        <div className="voltra-konami-signature">— IL COMANDO —</div>
      </div>
    </div>
  )
}
