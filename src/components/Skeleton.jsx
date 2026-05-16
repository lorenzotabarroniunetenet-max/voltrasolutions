export function SkeletonLine({ width = '100%', height = 12, style }) {
  return <div className="voltra-skeleton" style={{ width, height, borderRadius: 6, ...style }} />
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
      <div className="voltra-skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <SkeletonLine />
        <SkeletonLine width="60%" height={10} style={{ marginTop: 8 }} />
      </div>
    </div>
  )
}

export default function SkeletonList({ count = 3 }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  )
}
