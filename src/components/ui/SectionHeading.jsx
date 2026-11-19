export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-12 text-center">
      {eyebrow && (
        <p className="mb-3 font-display text-xs tracking-[0.4em] text-accent-soft uppercase">{eyebrow}</p>
      )}
      <h2 className="text-gradient font-display text-[clamp(1.6rem,7.5vw,3rem)] leading-tight font-bold tracking-wide">{title}</h2>
      <div className="mx-auto mt-4 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
        <span className="h-2 w-2 rotate-45 bg-accent shadow-[0_0_10px_var(--color-accent)]" />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
      </div>
      {subtitle && <p className="mx-auto mt-4 max-w-2xl text-muted">{subtitle}</p>}
    </div>
  )
}
