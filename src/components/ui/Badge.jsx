const variants = {
  silver: 'border-fg/30 text-fg hover:border-accent hover:text-fg hover:shadow-[0_0_14px_rgb(0_240_255/0.55)]',
  gold: 'border-primary/50 text-primary bg-primary/5 hover:border-primary-bright hover:text-primary-bright hover:shadow-[0_0_14px_rgb(0_255_136/0.5)]',
  neon: 'border-accent/50 text-accent-soft bg-accent/10 hover:border-accent hover:text-fg hover:shadow-[0_0_14px_rgb(0_240_255/0.6)]',
}

export default function Badge({ children, variant = 'silver', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide whitespace-nowrap transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

/** Renders up to `max` badges plus a "+N" indicator. */
export function BadgeList({ items, max, variant, className = '' }) {
  const shown = max ? items.slice(0, max) : items
  const extra = max ? items.length - shown.length : 0
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {shown.map((item) => (
        <Badge key={item} variant={variant}>
          {item}
        </Badge>
      ))}
      {extra > 0 && <Badge variant="neon">+{extra}</Badge>}
    </div>
  )
}
