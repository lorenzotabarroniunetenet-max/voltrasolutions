export default function RuleBadge({ status }) {
  const config = {
    OK: { class: 'badge-success', label: 'OK', icon: '●' },
    SUCCEEDED: { class: 'badge-success', label: 'Succeeded', icon: '●' },
    FAILED: { class: 'badge-fail', label: 'Failed', icon: '●' },
    WARNING: { class: 'badge-warn', label: 'Warning', icon: '●' },
    PENDING: { class: 'badge-pending', label: 'In corso', icon: '●' },
  }
  const c = config[status] || config.PENDING
  return <span className={`badge ${c.class}`}>{c.icon} {c.label}</span>
}
