export default function StatCard({ label, value, sublabel, accent, icon }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-mono uppercase tracking-wider text-muted">{label}</span>
        {icon && <span className="text-muted">{icon}</span>}
      </div>
      <div className={`num text-2xl font-semibold ${accent || 'text-fg'}`}>{value}</div>
      {sublabel && <div className="text-xs text-muted mt-1">{sublabel}</div>}
    </div>
  )
}
