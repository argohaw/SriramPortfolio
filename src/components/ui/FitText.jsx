import { useLayoutEffect, useRef } from 'react'

/**
 * Single-line text that scales its font-size so it exactly fills the width of
 * its parent (capped at `max` px, floored at `min` px). Updates on resize and
 * once web fonts finish loading. Writes the style directly — no re-renders.
 */
export default function FitText({ children, max = 96, min = 14, className = '' }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return undefined

    const fit = () => {
      el.style.fontSize = `${max}px`
      const available = parent.clientWidth
      const natural = el.scrollWidth
      if (!available || !natural) return
      const size = Math.min(max, Math.max(min, (max * available) / natural))
      el.style.fontSize = `${Math.floor(size * 0.985 * 10) / 10}px`
    }

    fit()
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && fit())
    const ro = new ResizeObserver(fit)
    ro.observe(parent)
    return () => {
      cancelled = true
      ro.disconnect()
    }
  }, [max, min, children])

  return (
    <span ref={ref} className={`inline-block whitespace-nowrap ${className}`}>
      {children}
    </span>
  )
}
