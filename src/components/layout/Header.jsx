import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBars, FaXmark } from 'react-icons/fa6'
import { navLinks } from '../../data/navigation'
import { profile } from '../../data/profile'
import ElectricLogo from '../home/ElectricLogo'
import ResumeMenu from '../ui/ResumeMenu'
import { useActiveSection } from '../../hooks/useActiveSection'

const sectionIds = navLinks.map((l) => l.id)

export default function Header() {
  const active = useActiveSection(sectionIds)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (id) =>
    `relative px-3 py-2 font-display text-[0.7rem] tracking-[0.18em] uppercase transition-colors duration-300 ${
      active === id ? 'text-primary' : 'text-fg hover:text-accent'
    }`

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-primary/20 bg-canvas/90 shadow-[0_8px_30px_rgb(0_0_0/0.5)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8" aria-label="Primary">
        <a href="#home" className="group flex items-center gap-2.5" aria-label={`${profile.name} — back to top`}>
          {/* same animated electric "S" emblem as inside the device, compact */}
          <span className="block h-11 w-11 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true">
            <ElectricLogo compact />
          </span>
          <span className="text-gradient font-display text-base font-bold tracking-widest uppercase max-[340px]:hidden sm:text-lg">
            {profile.headerName}
          </span>
        </a>

        <ul className="hidden items-center xl:flex">
          {navLinks.map(({ id, label }) => (
            <li key={id}>
              <a href={`#${id}`} className={linkClass(id)} aria-current={active === id ? 'true' : undefined}>
                {label}
                {active === id && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                  />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <ResumeMenu align="right" placement="bottom" compactOnMobile />
          <button
            type="button"
            className="rounded-lg border border-primary/40 p-2 text-primary xl:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <FaXmark size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            id="mobile-menu"
            className="glass mx-4 mb-4 flex max-h-[calc(100svh-5.5rem)] flex-col overflow-y-auto overscroll-contain rounded-2xl p-3 xl:hidden"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            {navLinks.map(({ id, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-4 py-3 ${linkClass(id)} ${active === id ? 'bg-primary/10' : ''}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  )
}
