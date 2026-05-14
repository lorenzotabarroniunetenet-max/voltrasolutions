export default function KpiCard({ icon, label, value, subtitle, progress, progressColor, badge }) {
  return (
    <div className="voltra-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
          <span style={{ fontSize: 13, color: 'var(--voltra-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        </div>
        {badge}
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--voltra-text)' }}>
        {value}
      </div>
      {subtitle && <div style={{ fontSize: 13, color: 'var(--voltra-muted)', marginTop: 4 }}>{subtitle}</div>}
      {progress != null && (
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{
            width: `${Math.min(100, Math.max(0, progress))}%`,
            background: progressColor || 'var(--voltra-lime)',
          }} />
        </div>
      )}
    </div>
  )
}
