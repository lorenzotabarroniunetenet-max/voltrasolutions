import { Link } from 'react-router-dom'
import Layout from '../components/Layout'

export default function Home() {
  return (
    <Layout>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-mono uppercase tracking-wider mb-6">Cloud Trade Copier</div>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">Copy trades between<br/><span className="text-brand">your MT5 accounts</span> instantly.</h1>
        <p className="text-lg text-muted max-w-2xl mx-auto mb-10">Connect master and slave accounts from any broker. Replicate trades in milliseconds with full control: reverse, lot multiplier, TP/SL override, symbol filters, drawdown limits.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/register" className="btn-primary">Start free</Link>
          <Link to="/login" className="btn-ghost">Login</Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid sm:grid-cols-3 gap-4">
        {[
          { t: 'Multi-platform', d: 'MT4, MT5, cTrader. Any broker, any market.' },
          { t: 'Ultra-low latency', d: '1–3ms cloud routing between accounts.' },
          { t: 'Full control', d: 'Reverse trading, lot scaling, TP/SL override, symbol filters.' },
          { t: 'Risk protection', d: 'Max drawdown auto-pause, slippage limits.' },
          { t: 'No software', d: 'Cloud-based. No VPS, no MT5 plugins to install.' },
          { t: 'Unlimited pairs', d: 'Connect as many master→slave pairs as needed.' }
        ].map((f, i) => (
          <div key={i} className="card p-5">
            <div className="text-fg font-semibold mb-1">{f.t}</div>
            <div className="text-sm text-muted">{f.d}</div>
          </div>
        ))}
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
        <h2 className="text-2xl font-bold mb-3">How it works</h2>
        <div className="grid sm:grid-cols-4 gap-4 mt-8 text-left">
          {[
            { n: '1', t: 'Sign up', d: 'Free, no card required' },
            { n: '2', t: 'Connect accounts', d: 'Add master + slave MT5' },
            { n: '3', t: 'Create rule', d: 'Set params + risk' },
            { n: '4', t: 'Copy live', d: 'Auto-replication starts' }
          ].map(s => (
            <div key={s.n} className="card p-4">
              <div className="text-brand font-mono text-2xl mb-2">{s.n}</div>
              <div className="font-semibold text-fg">{s.t}</div>
              <div className="text-sm text-muted">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 text-center text-sm text-muted">
          © 2026 Voltra. Trade with capital. Copy with precision.
        </div>
      </footer>
    </Layout>
  )
}
