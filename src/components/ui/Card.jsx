export default function Card({ as: Tag = 'div', children, className = '', interactive = false, ...props }) {
  return (
    <Tag
      className={`glass relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
        interactive ? 'hover:-translate-y-1 hover:border-accent/60 hover:glow-accent' : ''
      } ${className}`}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent"
      />
      {children}
    </Tag>
  )
}
