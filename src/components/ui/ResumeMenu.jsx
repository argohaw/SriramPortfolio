import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaChevronDown, FaChevronLeft, FaChevronRight, FaCircleCheck, FaCircleExclamation, FaDownload, FaFilePdf } from 'react-icons/fa6'
import { resumes } from '../../data/resumes'

/**
 * "Download résumé" button with a country dropdown.
 *  - Mouse: opens on hover; India reveals Full-stack / Backend on hover.
 *  - Touch / keyboard: tap or Enter toggles; Escape or clicking outside closes.
 *  - Before downloading it checks the PDF really exists (otherwise a missing
 *    file would download the site's HTML), and shows a status message.
 *
 * align:     'right' (menu hugs the button's right edge, India flyout opens left)
 *            'left'  (menu hugs the left edge, flyout opens right)
 * placement: 'bottom' | 'top' (menu opens below or above the button)
 */
/** `inline`: always expand India's options inline (accordion) — for narrow containers like the phone screen. */
export default function ResumeMenu({ align = 'right', placement = 'bottom', label = 'Resume', compactOnMobile = false, inline = false, className = '' }) {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState(null) // country id whose sub-options are shown
  const [status, setStatus] = useState(null) // { type: 'busy' | 'ok' | 'error', text }
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const closeTimer = useRef(0)
  const statusTimer = useRef(0)
  const lastPointer = useRef('mouse')
  const menuId = useId()

  const close = () => {
    clearTimeout(closeTimer.current)
    setOpen(false)
    setExpanded(null)
  }
  const openNow = () => {
    clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const closeSoon = () => {
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(close, 200)
  }

  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (e) => !rootRef.current?.contains(e.target) && close()
    const onKey = (e) => {
      if (e.key === 'Escape') {
        close()
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => () => {
    clearTimeout(closeTimer.current)
    clearTimeout(statusTimer.current)
  }, [])

  const showStatus = (next, ms = 3500) => {
    clearTimeout(statusTimer.current)
    setStatus(next)
    if (next.type !== 'busy') statusTimer.current = setTimeout(() => setStatus(null), ms)
  }

  const download = async (e, item, title) => {
    e.preventDefault()
    showStatus({ type: 'busy', text: `Preparing ${title} résumé…` })
    try {
      const res = await fetch(item.file, { method: 'HEAD', cache: 'no-store' })
      const type = res.headers.get('content-type') || ''
      if (!res.ok || !type.includes('pdf')) throw new Error('missing')
      const a = document.createElement('a')
      a.href = item.file
      a.download = item.downloadAs
      document.body.appendChild(a)
      a.click()
      a.remove()
      close()
      showStatus({ type: 'ok', text: `${title} résumé downloaded` })
    } catch {
      close()
      showStatus({ type: 'error', text: `The ${title} résumé isn't available yet.` })
    }
  }

  const isMouse = (e) => e.pointerType === 'mouse'
  const menuPos = `${align === 'right' ? 'right-0' : 'left-0'} ${placement === 'bottom' ? 'top-full pt-2' : 'bottom-full pb-2'}`
  // side flyout from the sm breakpoint up (unless forced inline); accordion below it
  const flyoutPos = inline ? '' : `sm:absolute sm:top-0 ${align === 'right' ? 'sm:right-full sm:pr-1.5' : 'sm:left-full sm:pl-1.5'}`
  const subListClass = inline ? 'mx-3 mb-1' : 'max-sm:mx-3 max-sm:mb-1 sm:w-48'
  const FlyoutChevron = align === 'right' ? FaChevronLeft : FaChevronRight
  const itemClass =
    'flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm text-fg transition-colors hover:bg-accent/10 hover:text-accent focus-visible:bg-accent/10 focus-visible:text-accent outline-none'

  const CodeChip = ({ code }) => (
    <span className="cyber-clip grid h-6 w-8 shrink-0 place-items-center border border-primary/40 bg-primary/10 font-mono text-[0.65rem] tracking-wider text-primary [--cut-tl:4px] [--cut-br:4px]">
      {code}
    </span>
  )

  return (
    <div
      ref={rootRef}
      className={`relative ${className}`}
      onPointerEnter={(e) => isMouse(e) && openNow()}
      onPointerLeave={(e) => isMouse(e) && closeSoon()}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={compactOnMobile ? `Download ${label}` : undefined}
        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
        onClick={(e) => {
          // mouse users already opened it by hovering — a click shouldn't close it again
          if (e.detail !== 0 && lastPointer.current === 'mouse') openNow()
          else setOpen((o) => !o)
        }}
        className="cyber-clip group inline-flex items-center gap-2 border border-primary/60 bg-primary/10 px-3.5 py-2 font-display text-[0.7rem] font-bold tracking-[0.18em] text-primary uppercase transition [--cut-tl:8px] [--cut-br:8px] hover:bg-primary/20 hover:shadow-[0_0_20px_rgb(0_240_255/0.45)] sm:px-4"
      >
        <FaDownload size={12} />
        <span className={compactOnMobile ? 'hidden sm:inline' : ''}>{label}</span>
        <FaChevronDown size={10} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className={`absolute z-40 ${menuPos}`}
            initial={{ opacity: 0, y: placement === 'bottom' ? -6 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: placement === 'bottom' ? -6 : 6 }}
            transition={{ duration: 0.16 }}
          >
            {/* The cut-corner glass is a separate background layer: clip-path also clips
                children, so putting it on the list would hide the India flyout beside it. */}
            <div className="relative w-56 max-w-[calc(100vw-2rem)]">
              <span
                className="glass cyber-clip pointer-events-none absolute inset-0 [--cut-tl:12px] [--cut-br:12px]"
                aria-hidden="true"
              />
              <ul
                id={menuId}
                role="menu"
                aria-label="Choose résumé by country"
                className="relative py-1.5"
              >
                <li role="presentation" className="px-3 pt-1 pb-2 font-mono text-[0.6rem] tracking-[0.3em] text-muted uppercase">
                  Select region
                </li>
                {resumes.map((r) =>
                  r.options ? (
                    <li
                      key={r.id}
                      role="presentation"
                      className="relative"
                      onPointerEnter={(e) => isMouse(e) && setExpanded(r.id)}
                    >
                      <button
                        type="button"
                        role="menuitem"
                        aria-haspopup="menu"
                        aria-expanded={expanded === r.id}
                        className={`${itemClass} ${expanded === r.id ? 'bg-accent/10 text-accent' : ''}`}
                        onPointerDown={(e) => (lastPointer.current = e.pointerType)}
                        onClick={(e) => {
                          if (e.detail !== 0 && lastPointer.current === 'mouse') setExpanded(r.id)
                          else setExpanded((x) => (x === r.id ? null : r.id))
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                            e.preventDefault()
                            setExpanded(r.id)
                          }
                        }}
                      >
                        <CodeChip code={r.code} />
                        <span className="flex-1">{r.country}</span>
                        {/* flyout arrow on larger screens, accordion arrow on phones */}
                        {!inline && <FlyoutChevron size={10} className="hidden opacity-70 sm:block" />}
                        <FaChevronDown size={10} className={`opacity-70 transition-transform ${inline ? '' : 'sm:hidden'} ${expanded === r.id ? 'rotate-180' : ''}`} />
                      </button>

                      {expanded === r.id && (
                        <motion.div
                          className={flyoutPos}
                          initial={{ opacity: 0, x: align === 'right' ? 6 : -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.14 }}
                        >
                          <ul role="menu" aria-label={`${r.country} résumés`} className={`glass cyber-clip py-1.5 [--cut-tl:10px] [--cut-br:10px] ${subListClass}`}>
                            {r.options.map((o) => (
                              <li key={o.id} role="presentation">
                                <a
                                  role="menuitem"
                                  href={o.file}
                                  download={o.downloadAs}
                                  className={itemClass}
                                  onClick={(e) => download(e, o, `${r.country} ${o.label}`)}
                                >
                                  <FaFilePdf className="shrink-0 text-accent" />
                                  <span className="flex-1">{o.label}</span>
                                  <FaDownload size={10} className="opacity-60" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </li>
                  ) : (
                    <li key={r.id} role="presentation" onPointerEnter={(e) => isMouse(e) && setExpanded(null)}>
                      <a role="menuitem" href={r.file} download={r.downloadAs} className={itemClass} onClick={(e) => download(e, r, r.country)}>
                        <CodeChip code={r.code} />
                        <span className="flex-1">{r.country}</span>
                        <FaDownload size={10} className="opacity-60" />
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* download status */}
      <div aria-live="polite" className={`pointer-events-none absolute z-40 ${align === 'right' ? 'right-0' : 'left-0'} ${placement === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2'}`}>
        <AnimatePresence>
          {status && !open && (
            <motion.p
              key={status.text}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`glass cyber-clip flex w-max max-w-64 items-center gap-2 px-3 py-2 text-xs [--cut-tl:8px] [--cut-br:8px] ${
                status.type === 'error' ? 'text-red-300' : status.type === 'ok' ? 'text-primary' : 'text-muted'
              }`}
            >
              {status.type === 'error' ? <FaCircleExclamation /> : status.type === 'ok' ? <FaCircleCheck /> : <FaDownload className="animate-pulse" />}
              {status.text}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
