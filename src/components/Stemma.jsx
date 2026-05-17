/**
 * Stemma araldico generato deterministicamente dalla matricola.
 * Differenzia per grado:
 *   - Caporale: bordo lime
 *   - Sergente: bordo oro
 *   - Capitano: bordo argento
 *   - Colonnello: bordo granata
 */

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function seededRng(seed) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

const RANK_COLOR = {
  Caporale: '#B4FF39',
  Sergente: '#E8C84A',
  Capitano: '#C0C0C0',
  Colonnello: '#B71C1C',
}

const RANK_CHEVRON_COUNT = {
  Caporale: 1,
  Sergente: 2,
  Capitano: 3,
  Colonnello: 4,
}

export default function Stemma({ matricola = 'VLT-0000', rank = 'Caporale', size = 80 }) {
  const rand = seededRng(hashStr(matricola))
  const hue = Math.floor(rand() * 360)
  const primary = `hsl(${hue}, 50%, 22%)`
  const secondary = `hsl(${(hue + 30) % 360}, 60%, 38%)`
  const accent = RANK_COLOR[rank] || RANK_COLOR.Caporale
  const chevronCount = RANK_CHEVRON_COUNT[rank] || 1

  // Symbol type (0=spada, 1=stella, 2=spade incrociate, 3=⚡)
  const symbolType = Math.floor(rand() * 4)
  // Medals: 0-3 sui fianchi
  const medalCount = Math.floor(rand() * 3)
  const medalColors = ['#E8C84A', '#c0c0c0', '#cd7f32']

  return (
    <svg
      viewBox="0 0 100 110"
      width={size}
      height={size * 1.1}
      style={{ display: 'block' }}
    >
      {/* Scudo */}
      <path
        d="M 50 10 L 90 18 L 90 55 Q 90 90 50 105 Q 10 90 10 55 L 10 18 Z"
        fill={primary}
        stroke={accent}
        strokeWidth="2"
      />
      {/* Banda diagonale */}
      <path
        d="M 10 30 L 90 60 L 90 70 L 10 40 Z"
        fill={secondary}
        opacity="0.7"
      />

      {/* Simbolo centrale */}
      {symbolType === 0 && (
        <g>
          <line x1="50" y1="25" x2="50" y2="80" stroke="#fff" strokeWidth="3" />
          <line x1="38" y1="35" x2="62" y2="35" stroke="#fff" strokeWidth="3" />
        </g>
      )}
      {symbolType === 1 && (
        <polygon
          points={(() => {
            const pts = []
            for (let i = 0; i < 10; i++) {
              const a = (Math.PI * 2 * i) / 10 - Math.PI / 2
              const r = i % 2 === 0 ? 18 : 8
              pts.push(`${50 + Math.cos(a) * r},${55 + Math.sin(a) * r}`)
            }
            return pts.join(' ')
          })()}
          fill={accent}
        />
      )}
      {symbolType === 2 && (
        <g stroke="#fff" strokeWidth="3">
          <line x1="32" y1="35" x2="68" y2="75" />
          <line x1="68" y1="35" x2="32" y2="75" />
        </g>
      )}
      {symbolType === 3 && (
        <path
          d="M 55 28 L 38 60 L 50 60 L 45 82 L 62 50 L 50 50 Z"
          fill={accent}
          stroke="#000"
          strokeWidth="1"
        />
      )}

      {/* Chevron del grado (in alto) */}
      {Array.from({ length: chevronCount }).map((_, i) => (
        <path
          key={i}
          d={`M 35 ${15 + i * 4} L 50 ${19 + i * 4} L 65 ${15 + i * 4}`}
          stroke={accent}
          strokeWidth="2.5"
          fill="none"
        />
      ))}

      {/* Corona per gradi alti (Sergente+) */}
      {chevronCount >= 2 && (
        <path
          d="M 38 8 L 42 4 L 46 8 L 50 2 L 54 8 L 58 4 L 62 8 L 62 10 L 38 10 Z"
          fill={accent}
          stroke="#000"
          strokeWidth="0.5"
        />
      )}

      {/* Medaglie laterali */}
      {Array.from({ length: medalCount }).map((_, i) => {
        const side = i % 2 === 0 ? 8 : 88
        const y = 55 + Math.floor(i / 2) * 14
        return (
          <circle
            key={i}
            cx={side}
            cy={y}
            r="3.5"
            fill={medalColors[i % 3]}
            stroke="#000"
            strokeWidth="0.5"
          />
        )
      })}
    </svg>
  )
}
