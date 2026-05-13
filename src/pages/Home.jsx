import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Logo from '../components/Logo'

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-brand/5 blur-[120px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-32 lg:pb-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand/30 bg-brand/5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand live-dot" />
              <span className="text-xs font-mono text-brand uppercase tracking-wider">Funded · Copy · Scale</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-fg leading-[1.05]">
              Trade with capital.<br />
              <span className="text-brand">Copy with precision.</span>
            </h1>

            <p className="mt-6 text-lg text-muted max-w-2xl">
              Voltra connects you to a curated marketplace of verified MT5 strategies and funds you with up to <span className="num text-fg">20X leverage</span>. Mirror professional traders, keep <span className="num text-fg">70%</span> of the profit split, scale to <span className="num text-fg">$1M</span>.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/register" className="px-6 py-3 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition shadow-glow">
                Get funded
              </Link>
              <Link to="/strategies" className="px-6 py-3 rounded-lg border border-border bg-surface text-fg font-semibold hover:border-brand/40 transition">
                Browse strategies
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-8 text-sm">
              <Metric label="Funded traders" value="4,820+" />
              <Metric label="Verified strategies" value="312" />
              <Metric label="Total capital deployed" value="$84.2M" />
              <Metric label="Avg. monthly ROI" value="+11.4%" />
            </div>
          </div>

          {/* Hero chart preview */}
          <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[480px]">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand mb-2">Platform</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg">Built for funded copy trading.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Feature
              title="20X Funded"
              desc="Receive a fully funded MT5 account leveraged 20X. No personal deposit at risk."
              num="20X"
            />
            <Feature
              title="Freedom Account"
              desc="No time limits. No daily targets. Trade — or have a master trade for you — at your pace."
              num="∞"
            />
            <Feature
              title="Scaling to $1M"
              desc="Hit profit milestones and your funded balance scales automatically up to one million."
              num="$1M"
            />
            <Feature
              title="Integrated copy system"
              desc="One-click connect any verified strategy. Auto-replication with per-account risk caps."
              num="1-click"
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand mb-2">Workflow</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg">From signup to mirrored trade in minutes.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Step num="01" title="Get funded" desc="Sign up, claim your funded MT5 account, choose between $50K, $100K, $200K tiers." />
            <Step num="02" title="Pick a master" desc="Browse 300+ verified strategies. Filter by ROI, drawdown, sharpe, win rate." />
            <Step num="03" title="Auto-copy" desc="Connect strategy to your account. Trades mirror in real-time with your risk settings." />
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section id="team" className="border-t border-border bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="mb-12">
            <div className="text-xs font-mono uppercase tracking-widest text-brand mb-2">Team</div>
            <h2 className="text-3xl lg:text-4xl font-bold text-fg">Engineers, traders, risk operators.</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TEAM.map((m) => <TeamCard key={m.name} {...m} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="pricing" className="border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-24 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-fg">Start trading other people's capital today.</h2>
          <p className="mt-4 text-muted max-w-2xl mx-auto">
            No personal funds at risk. Verified masters. Transparent splits. Built on MT5 infrastructure with sub-15ms execution.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link to="/register" className="px-8 py-3.5 rounded-lg bg-brand text-bg font-semibold hover:bg-brand-dim transition shadow-glow">
              Create account
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-lg border border-border bg-surface text-fg font-semibold hover:border-brand/40 transition">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 flex flex-wrap justify-between gap-6">
          <div>
            <Logo />
            <div className="text-xs text-muted mt-3 max-w-sm">
              Voltra is a copy-trading and funded-account platform. Trading involves risk. Past performance does not guarantee future returns.
            </div>
          </div>
          <div className="flex gap-12 text-xs">
            <FooterCol title="Product" items={['Funded accounts', 'Strategies', 'Pricing', 'API']} />
            <FooterCol title="Company" items={['About', 'Careers', 'Press', 'Contact']} />
            <FooterCol title="Legal" items={['Terms', 'Privacy', 'Risk disclosure']} />
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-xs text-muted font-mono">
          © 2026 VOLTRA · MT5 bridge v2.4.1
        </div>
      </footer>
    </div>
  )
}

function Metric({ label, value }) {
  return (
    <div>
      <div className="num text-2xl font-semibold text-fg">{value}</div>
      <div className="text-xs text-muted mt-0.5">{label}</div>
    </div>
  )
}

function Feature({ title, desc, num }) {
  return (
    <div className="card p-6 hover:border-brand/30 transition group">
      <div className="num text-3xl font-bold text-brand mb-4 group-hover:scale-110 transition origin-left">{num}</div>
      <div className="text-base font-semibold text-fg mb-2">{title}</div>
      <div className="text-sm text-muted leading-relaxed">{desc}</div>
    </div>
  )
}

function Step({ num, title, desc }) {
  return (
    <div className="card p-6 relative">
      <div className="absolute top-6 right-6 num text-5xl font-bold text-brand/10">{num}</div>
      <div className="text-xs font-mono uppercase tracking-widest text-brand mb-3">Step {num}</div>
      <div className="text-lg font-semibold text-fg mb-2">{title}</div>
      <div className="text-sm text-muted">{desc}</div>
    </div>
  )
}

const TEAM = [
  { name: 'Adrian Cole', role: 'CEO · ex-Citadel', initials: 'AC' },
  { name: 'Maya Patel', role: 'CTO · ex-Jane Street', initials: 'MP' },
  { name: 'Ivan Brik', role: 'Head of Risk', initials: 'IB' },
  { name: 'Lara Ng', role: 'Head of Trading', initials: 'LN' }
]

function TeamCard({ name, role, initials }) {
  return (
    <div className="card p-5 text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/30 flex items-center justify-center text-brand font-mono font-bold text-xl mb-3">
        {initials}
      </div>
      <div className="text-sm font-semibold text-fg">{name}</div>
      <div className="text-xs text-muted mt-0.5">{role}</div>
    </div>
  )
}

function FooterCol({ title, items }) {
  return (
    <div>
      <div className="text-fg font-semibold mb-3">{title}</div>
      <ul className="space-y-1.5 text-muted">
        {items.map(i => <li key={i} className="hover:text-fg cursor-pointer transition">{i}</li>)}
      </ul>
    </div>
  )
}

function HeroPreview() {
  return (
    <div className="card p-5 shadow-glow rotate-[-2deg]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/30 flex items-center justify-center text-brand font-mono text-xs font-bold">MH</div>
          <div>
            <div className="text-xs font-semibold text-fg">Marcus Hale</div>
            <div className="text-[10px] text-muted font-mono">EUR/USD Scalper</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono uppercase text-muted">ROI 12M</div>
          <div className="num text-brand font-bold">+143.7%</div>
        </div>
      </div>
      <svg viewBox="0 0 300 80" className="w-full">
        <defs>
          <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#B4FF39" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#B4FF39" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M0,60 Q30,55 50,50 T100,40 T150,35 T200,25 T250,15 T300,8 L300,80 L0,80 Z" fill="url(#hg)"/>
        <path d="M0,60 Q30,55 50,50 T100,40 T150,35 T200,25 T250,15 T300,8" stroke="#B4FF39" strokeWidth="2" fill="none"/>
      </svg>
      <div className="grid grid-cols-3 gap-3 mt-3 text-xs">
        <div><div className="text-muted text-[9px] uppercase font-mono">Drawdown</div><div className="num text-danger">-6.2%</div></div>
        <div><div className="text-muted text-[9px] uppercase font-mono">Win Rate</div><div className="num text-fg">72.4%</div></div>
        <div><div className="text-muted text-[9px] uppercase font-mono">Sharpe</div><div className="num text-fg">2.81</div></div>
      </div>
    </div>
  )
}
