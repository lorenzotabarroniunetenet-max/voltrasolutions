export default function PnL({ value, pct, size = 'md', showSign = true }) {
  const positive = value >= 0
  const color = positive ? 'text-brand' : 'text-danger'
  const sign = showSign ? (positive ? '+' : '') : ''
  const fmt = (n) => Math.abs(n) >= 1000
    ? n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : n.toFixed(2)
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl', xl: 'text-4xl' }
  return (
    <span className={`num font-semibold ${color} ${sizes[size]}`}>
      {sign}{fmt(value)}
      {pct != null && <span className="text-xs ml-1.5 opacity-70">({sign}{pct.toFixed(2)}%)</span>}
    </span>
  )
}
