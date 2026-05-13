import { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import StrategyCard from '../components/StrategyCard'
import { api } from '../lib/api'

export default function Strategies() {
  const [strategies, setStrategies] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ sortBy: 'roi', minRoi: 0, maxDd: 25, minRating: 0 })

  useEffect(() => {
    setLoading(true)
    api.getStrategies(filters).then((s) => { setStrategies(s); setLoading(false) })
  }, [filters])

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fg mb-1">Strategies Marketplace</h1>
          <p className="text-sm text-muted">{strategies.length} verified MT5 strategies available to copy.</p>
        </div>

        <div className="card p-4 mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Sort by"
              value={filters.sortBy}
              onChange={(v) => setFilters(f => ({ ...f, sortBy: v }))}
              options={[
                { v: 'roi', l: 'ROI (12M)' },
                { v: 'sharpe', l: 'Sharpe ratio' },
                { v: 'winRate', l: 'Win rate' },
                { v: 'followers', l: 'Followers' },
                { v: 'rating', l: 'Rating' }
              ]}
            />
            <Range
              label={`Min ROI: ${filters.minRoi}%`}
              min={0} max={200} step={5}
              value={filters.minRoi}
              onChange={(v) => setFilters(f => ({ ...f, minRoi: v }))}
            />
            <Range
              label={`Max Drawdown: ${filters.maxDd}%`}
              min={3} max={25} step={1}
              value={filters.maxDd}
              onChange={(v) => setFilters(f => ({ ...f, maxDd: v }))}
            />
            <Range
              label={`Min Rating: ${filters.minRating}`}
              min={0} max={5} step={0.1}
              value={filters.minRating}
              onChange={(v) => setFilters(f => ({ ...f, minRating: v }))}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-muted text-sm">Loading strategies…</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {strategies.map((s) => <StrategyCard key={s.id} strategy={s} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">{label}</div>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm text-fg outline-none focus:border-brand"
      >
        {options.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </label>
  )
}

function Range({ label, min, max, step, value, onChange }) {
  return (
    <label className="block">
      <div className="text-xs font-mono uppercase tracking-wider text-muted mb-1.5">{label}</div>
      <input
        type="range"
        min={min} max={max} step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-brand"
      />
    </label>
  )
}
