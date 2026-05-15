import { useEffect, useState } from 'react'
import { api } from '../lib/api.js'

function TelegramIcon({ size = 20, color = 'currentColor' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}

const GRADE_LORE = {
  Caporale: {
    rank: '🎖',
    mission: "L'Ultimo Avamposto",
    legend: "La trincea è la sua casa. Il rumore della radio è il suo orologio. Il Caporale è il primo a salire e l'ultimo a scendere — perché finché lui tiene la linea, il reparto resiste. Nessuna gloria, solo la costanza che vince le guerre lunghe.",
    color: 'lime',
  },
  Sergente: {
    rank: '⭐',
    mission: 'Il Messaggero',
    legend: "Tra il fuoco e il Comando, c'è una sola figura: il Sergente. Porta gli ordini sotto il bombardamento, riporta le perdite senza emozione, tiene gli uomini saldi quando il fronte cede. Non comanda: trasmette. E senza la sua voce, la guerra è perduta.",
    color: 'gold',
  },
  Capitano: {
    rank: '🦅',
    mission: 'Le Acque Profonde',
    legend: "Si muove dove nessuno vede. Operazioni che non vengono mai dichiarate, missioni di cui nessuno scriverà la cronaca. Il Capitano agisce sul confine: dove finisce la mappa e inizia il giudizio.",
    color: 'wip',
  },
  Colonnello: {
    rank: '🎗',
    mission: "L'Ultima Linea",
    legend: "Non porta più il fucile. Non legge più i bollettini. Il Colonnello guarda la mappa intera e decide chi rischia, chi resta, chi avanza. Le sue scelte si misurano nei decenni. Quando un Colonnello tace, l'intero schieramento ascolta.",
    color: 'wip',
  },
}

const VALID_GRADES = Object.keys(GRADE_LORE)

export default function BuyProgram() {
  const [programs, setPrograms] = useState([])
  const [wallets, setWallets] = useState([])
  const [telegramUrl, setTelegramUrl] = useState('')
  const [selected, setSelected] = useState(null)
  const [selectedNetwork, setSelectedNetwork] = useState(null)
  const [step, setStep] = useState('select')
  const [copied, setCopied] = useState(null)

  useEffect(() => {
    api.programs().then(d => {
      const filtered = d.filter(p => VALID_GRADES.includes(p.name))
      filtered.sort((a, b) => VALID_GRADES.indexOf(a.name) - VALID_GRADES.indexOf(b.name))
      setPrograms(filtered)
    }).catch(() => {})
    api.paymentInfo().then(d => {
      const list = d.wallets || []
      setWallets(list)
      if (list.length > 0) setSelectedNetwork(list[0].network)
      if (d.telegramUrl) setTelegramUrl(d.telegramUrl)
    }).catch(() => {})
  }, [])

  const copy = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  if (step === 'pay' && selected) {
    const lore = GRADE_LORE[selected.name]
    const wallet = wallets.find(w => w.network === selectedNetwork)
    const qrUrl = wallet ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(wallet.address)}&bgcolor=0c0c0c&color=ffffff&margin=10` : null

    return (
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <button onClick={() => setStep('select')} className="btn-secondary" style={{ marginBottom: 20, fontSize: 13, padding: '8px 14px' }}>← Torna ai gradi</button>

        <div className="card" style={{ padding: 32 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, paddingBottom: 24, borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: 44 }}>{lore.rank}</div>
            <div style={{ flex: 1 }}>
              <h2 className="display" style={{ margin: '0 0 4px', fontSize: 26 }}>{selected.name}</h2>
              <div style={{ color: 'var(--muted)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{lore.mission}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Quota</div>
              <div className="display" style={{ fontSize: 28, fontWeight: 700, color: 'var(--lime)' }}>${Number(selected.priceUsd)}</div>
            </div>
          </div>

          {wallets.length === 0 ? (
            <div className="card" style={{ padding: 24, background: 'rgba(255,165,2,0.06)', border: '1px solid rgba(255,165,2,0.3)', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>⚠️</div>
              <strong>Nessun indirizzo di pagamento configurato</strong>
              <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 8 }}>
                Il Comando deve impostare gli indirizzi wallet. Contatta il supporto tramite Linea Diretta HQ.
              </p>
            </div>
          ) : (
            <>
              {/* Network selector */}
              <div style={{ marginBottom: 24 }}>
                <div className="label" style={{ marginBottom: 10 }}>Seleziona network</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
                  {wallets.map(w => (
                    <button
                      key={w.network}
                      onClick={() => setSelectedNetwork(w.network)}
                      style={{
                        padding: '12px',
                        background: selectedNetwork === w.network ? 'rgba(180,255,57,0.08)' : 'var(--surface-2)',
                        border: selectedNetwork === w.network ? '1px solid rgba(180,255,57,0.4)' : '1px solid var(--border)',
                        borderRadius: 10,
                        color: selectedNetwork === w.network ? 'var(--lime)' : 'var(--text)',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'center',
                      }}
                    >
                      {w.label}
                    </button>
                  ))}
                </div>
              </div>

              {wallet && (
                <>
                  {/* Amount */}
                  <div style={{ marginBottom: 20, padding: 16, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span className="label" style={{ margin: 0 }}>Importo da inviare</span>
                      <button onClick={() => copy(String(Number(selected.priceUsd)), 'amount')} style={{ background: 'transparent', border: 'none', color: 'var(--lime)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                        {copied === 'amount' ? 'Copiato ✓' : 'Copia'}
                      </button>
                    </div>
                    <div className="display" style={{ fontSize: 24, fontWeight: 700, color: 'var(--text)' }}>${Number(selected.priceUsd)} USD</div>
                  </div>

                  {/* QR + Address */}
                  <div style={{ marginBottom: 24, padding: 20, background: 'var(--surface-2)', borderRadius: 10, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
                      {qrUrl && (
                        <div style={{ background: '#0c0c0c', padding: 8, borderRadius: 8, flexShrink: 0 }}>
                          <img src={qrUrl} alt="QR" style={{ display: 'block', width: 180, height: 180 }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 200 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                          <span className="label" style={{ margin: 0 }}>Indirizzo wallet</span>
                          <button onClick={() => copy(wallet.address, 'address')} style={{ background: 'transparent', border: 'none', color: 'var(--lime)', fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>
                            {copied === 'address' ? 'Copiato ✓' : 'Copia'}
                          </button>
                        </div>
                        <div style={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', color: 'var(--text)', background: '#000', padding: 10, borderRadius: 6, border: '1px solid var(--border)', lineHeight: 1.5 }}>
                          {wallet.address}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
                          ⚠️ Verifica il network. Invii a indirizzi sbagliati sono irrecuperabili.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Telegram instructions */}
                  <div style={{ padding: 20, background: 'rgba(180,255,57,0.04)', border: '1px solid rgba(180,255,57,0.25)', borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
                      <TelegramIcon size={22} color="var(--lime)" />
                      <div>
                        <strong style={{ color: 'var(--text)', display: 'block', marginBottom: 6 }}>Dopo il pagamento</strong>
                        <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                          Invia la ricevuta della transazione sul canale Telegram dedicato. Il Comando attiverà il tuo grado.
                        </p>
                      </div>
                    </div>
                    {telegramUrl ? (
                      <a href={telegramUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <TelegramIcon size={16} color="#000" />
                        Apri Telegram →
                      </a>
                    ) : (
                      <div style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center', padding: 8 }}>
                        Canale Telegram non configurato. Contatta il Comando.
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="display" style={{ margin: '0 0 4px', fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>Promozione di Grado</h1>
      <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>Seleziona il grado che ti appartiene</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {programs.map(p => {
          const lore = GRADE_LORE[p.name] || {}
          const isWip = !p.priceUsd
          const borderColor = lore.color === 'lime' ? 'rgba(180,255,57,0.2)' : lore.color === 'gold' ? 'rgba(232,200,74,0.2)' : 'var(--border)'

          return (
            <div key={p.id} className="card" style={{
              padding: 28, position: 'relative', overflow: 'hidden',
              border: `1px solid ${borderColor}`, opacity: isWip ? 0.55 : 1,
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{ position: 'absolute', top: -20, right: -10, fontSize: 110, opacity: 0.04, pointerEvents: 'none', lineHeight: 1 }}>{lore.rank}</div>

              {isWip && (
                <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 9, fontWeight: 700, letterSpacing: '0.1em', color: 'var(--muted)', background: 'var(--surface-2)', border: '1px solid var(--border)', padding: '3px 9px', borderRadius: 20, textTransform: 'uppercase' }}>Coming Soon</div>
              )}

              <div style={{ fontSize: 36, marginBottom: 12 }}>{lore.rank}</div>
              <h3 className="display" style={{ margin: '0 0 6px', fontSize: 28, fontWeight: 700, letterSpacing: '0.02em', color: 'var(--text)' }}>{p.name}</h3>
              <div style={{ fontSize: 11, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 16 }}>{lore.mission}</div>

              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65, marginBottom: 24, fontStyle: 'italic', flex: 1 }}>"{lore.legend}"</p>

              <div style={{ padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Quota accesso</div>
                  <div className="display" style={{ fontSize: 20, fontWeight: 700, color: isWip ? 'var(--muted-2)' : 'var(--lime)' }}>
                    {isWip ? 'WIP' : `$${Number(p.priceUsd)}`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 10, color: 'var(--muted-2)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Dotazione</div>
                  <div className="display" style={{ fontSize: 16, fontWeight: 600 }}>${Number(p.accountSize / 1000)}K</div>
                </div>
              </div>

              {isWip ? (
                <button disabled className="btn-secondary" style={{ width: '100%', justifyContent: 'center', cursor: 'not-allowed', opacity: 0.5 }}>In preparazione</button>
              ) : (
                <button onClick={() => { setSelected(p); setStep('pay'); }} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Richiedi Grado →</button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
