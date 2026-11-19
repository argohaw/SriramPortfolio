import { motion } from 'framer-motion'

export default function Section({ id, children, className = '' }) {
  return (
    <section id={id} className={`relative z-[3] flex min-h-screen items-center py-24 ${className}`}>
      <motion.div
        className="mx-auto w-full max-w-6xl px-5 sm:px-8"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </section>
  )
}
