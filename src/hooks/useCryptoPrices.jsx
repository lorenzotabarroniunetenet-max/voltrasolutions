import { useState, useEffect, useCallback } from 'react'

const BASE = import.meta.env.VITE_API_URL || 'https://voltra-backend-m4q8.onrender.com'

// Reti disponibili con simbolo e decimali
export const CRYPTO_NETWORKS = [
  { id: 'USDT_TRC20', label: 'USDT',  sublabel: 'TRC-20 · Tron',         coin: 'USDT', decimals: 2, icon: '💵' },
  { id: 'USDT_ERC20', label: 'USDT',  sublabel: 'ERC-20 · Ethereum',      coin: 'USDT', decimals: 2, icon: '💵' },
  { id: 'USDC_ERC20', label: 'USDC',  sublabel: 'ERC-20 · Ethereum',      coin: 'USDC', decimals: 2, icon: '🔵' },
  { id: 'ETH',        label: 'ETH',   sublabel: 'Ethereum Mainnet',        coin: 'ETH',  decimals: 6, icon: '🔷' },
  { id: 'BTC',        label: 'BTC',   sublabel: 'Bitcoin',                 coin: 'BTC',  decimals: 8, icon: '🟠' },
]

export function useCryptoPrices(eurAmount) {
  const [prices, setPrices] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch(`${BASE}/api/crypto/prices`)
      const data = await res.json()
      setPrices(data)
      setLastUpdate(new Date())
    } catch (e) {
      console.error('[crypto] price fetch failed:', e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch_()
    const iv = setInterval(fetch_, 30000)
    return () => clearInterval(iv)
  }, [])

  const getAmount = (network) => {
    if (!prices || !eurAmount) return null
    const rate = prices[network.coin]
    if (!rate) return null
    return (eurAmount / rate).toFixed(network.decimals)
  }

  return { prices, loading, lastUpdate, getAmount, refresh: fetch_ }
}

// Componente convertitore — da usare in qualsiasi pagina di pagamento
export function CryptoConverter({ eurAmount, selectedNetwork, onSelectNetwork, wallets }) {
  const { prices, loading, lastUpdate, getAmount } = useCryptoPrices(eurAmount)
  const [copied, setCopied] = useState('')

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const wallet = wallets?.find(w => w.network === selectedNetwork)
  const currentNet = CRYPTO_NETWORKS.find(n => n.id === selectedNetwork)
  const cryptoAmount = currentNet ? getAmount(currentNet) : null

  return (
    <div>
      {/* Importo EUR */}
      <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(180,255,57,.04)', border: '1px solid rgba(180,255,57,.12)', borderRadius: 12, marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.16em', marginBottom: 6 }}>Importo da versare</div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif', fontSize: 38, fontWeight: 900, color: '#fff', letterSpacing: '-.02em' }}>€{eurAmount?.toFixed(2)}</div>
      </div>

      {/* Network selector */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 10 }}>
          Seleziona rete · {loading ? 'Caricamento prezzi...' : lastUpdate ? `Aggiornato ${lastUpdate.toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'})}` : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {CRYPTO_NETWORKS.map(net => {
            const amount = getAmount(net)
            const isSelected = selectedNetwork === net.id
            const hasWallet = wallets?.find(w => w.network === net.id)
            if (!hasWallet) return null
            return (
              <div key={net.id}
                onClick={() => onSelectNetwork(net.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 10, border: isSelected ? '1px solid rgba(180,255,57,.3)' : '1px solid rgba(255,255,255,.07)', background: isSelected ? 'rgba(180,255,57,.05)' : 'rgba(255,255,255,.02)', cursor: 'pointer', transition: 'all .15s', position: 'relative' }}>
                <span style={{ fontSize: 20 }}>{net.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{net.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>{net.sublabel}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 700, color: '#B4FF39' }}>
                    {loading ? '...' : amount ? `${amount} ${net.coin}` : '—'}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,.25)', marginTop: 1 }}>≈ €{eurAmount}</div>
                </div>
                {isSelected && <div style={{ position: 'absolute', top: 8, right: 8, width: 16, height: 16, borderRadius: '50%', background: '#B4FF39', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#000', fontWeight: 800 }}>✓</div>}
              </div>
            )
          })}
        </div>
      </div>

      {/* Dettaglio pagamento */}
      {selectedNetwork && wallet && cryptoAmount && (
        <div>
          <div style={{ background: '#050505', border: '1px solid rgba(180,255,57,.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 12, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(180,255,57,.6),transparent)' }} />
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.14em', marginBottom: 6 }}>Invia esattamente</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 22, fontWeight: 700, color: '#B4FF39', marginBottom: 2 }}>{cryptoAmount} {currentNet?.coin}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,.3)' }}>= €{eurAmount?.toFixed(2)}</div>
            {prices && <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.2)', marginTop: 4 }}>1 {currentNet?.coin} = €{prices[currentNet?.coin]?.toLocaleString('it-IT')}</div>}
          </div>

          <div style={{ background: '#050505', border: '1px solid rgba(255,255,255,.08)', borderRadius: 10, padding: '12px 14px', marginBottom: 12 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: 'rgba(255,255,255,.25)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 6 }}>Indirizzo Wallet Voltra</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'rgba(255,255,255,.7)', wordBreak: 'break-all', marginBottom: 10, lineHeight: 1.5 }}>{wallet.address}</div>
            <button onClick={() => copyText(wallet.address, 'addr')}
              style={{ width: '100%', background: copied === 'addr' ? 'rgba(180,255,57,.08)' : 'rgba(255,255,255,.04)', border: copied === 'addr' ? '1px solid rgba(180,255,57,.2)' : '1px solid rgba(255,255,255,.08)', color: copied === 'addr' ? '#B4FF39' : 'rgba(255,255,255,.5)', padding: '8px', borderRadius: 7, fontFamily: 'Manrope, sans-serif', fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all .2s' }}>
              {copied === 'addr' ? '✓ Copiato!' : 'Copia indirizzo'}
            </button>
          </div>

          <div style={{ background: 'rgba(232,200,74,.04)', border: '1px solid rgba(232,200,74,.15)', borderRadius: 8, padding: '10px 12px', fontSize: 11, color: 'rgba(232,200,74,.7)', lineHeight: 1.6 }}>
            ⚠️ Invia <strong>esattamente</strong> l'importo indicato sulla rete corretta. Il tasso si aggiorna ogni 30 secondi.
          </div>
        </div>
      )}
    </div>
  )
}
