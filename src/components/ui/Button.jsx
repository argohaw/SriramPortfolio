const styles = {
  primary:
    'neon-bg text-canvas hover:shadow-[0_0_28px_rgb(0_240_255/0.6)] hover:brightness-110',
  outline:
    'border border-accent/70 text-accent-soft hover:bg-accent/10 hover:text-fg hover:shadow-[0_0_28px_rgb(0_240_255/0.5)]',
}

export default function Button({ as: Tag = 'button', variant = 'primary', className = '', children, ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display text-sm font-bold tracking-wider uppercase transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  )
}
