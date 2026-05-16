import { createContext, useContext, useState } from 'react'

const SonarCtx = createContext(null)

export function SonarProvider({ children }) {
  const [active, setActive] = useState(null)

  const show = (text = 'TRASMISSIONE IN CORSO', sub = 'VERIFICA QUARTIER GENERALE') => {
    setActive({ text, sub })
  }
  const hide = () => setActive(null)

  return (
    <SonarCtx.Provider value={{ show, hide }}>
      {children}
      {active && (
        <div className="voltra-sonar-overlay show">
          <div className="voltra-sonar">
            <div className="voltra-sonar-ring" />
            <div className="voltra-sonar-ring" />
            <div className="voltra-sonar-ring" />
            <div className="voltra-sonar-ring" />
            <div className="voltra-sonar-core" />
          </div>
          <div className="voltra-sonar-text">{active.text}</div>
          <div className="voltra-sonar-sub">{active.sub}</div>
        </div>
      )}
    </SonarCtx.Provider>
  )
}

export const useSonar = () => useContext(SonarCtx)
