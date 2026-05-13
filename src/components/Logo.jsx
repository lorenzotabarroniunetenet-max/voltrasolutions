export default function Logo({ size = 32, withText = true }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <path d="M16 2 L10 18 L14 18 L11 30 L22 12 L18 12 L21 2 Z" fill="#B4FF39"/>
      </svg>
      {withText && <span className="font-mono font-bold tracking-[0.18em] text-fg">VOLTRA</span>}
    </div>
  )
}
