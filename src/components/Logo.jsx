export default function Logo({ size = 28, withText = true }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        <rect width="32" height="32" rx="7" fill="#13131A" stroke="#1F1F2A"/>
        <path d="M18 5 L9 17.5 H13.8 L13 27 L23 13 H17.2 L18 5 Z" fill="#B4FF39"/>
      </svg>
      {withText && (
        <span className="font-mono font-semibold tracking-[0.18em] text-fg" style={{ fontSize: size * 0.6 }}>
          VOLTRA
        </span>
      )}
    </div>
  )
}
