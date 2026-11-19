import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion'
import { SCREEN_CUT_PX } from '../components/home/CyberDevice'
import { board, ownsBoard, registerStage, unregisterStage } from '../lib/deviceStage'

/*
 * Scroll-driven device transition.
 *
 * A stage = a pinned (sticky) scene followed by extra scroll distance. Over that
 * distance the device zooms toward its own screen until the screen covers the
 * viewport, and the circuit board (a shared fixed layer) is revealed — clipped to
 * the screen's exact shape while zooming.
 *
 *   mode 'in'  (landing):  device → inside (board fills the viewport)
 *   mode 'out' (contact):  inside → device (board shrinks back into the screen,
 *                          the screen content fades in)
 *
 * Everything is driven by motion values — no React re-render per scroll frame.
 */

const ZOOM_END = 0.7 // in 'in' mode: share of the distance spent zooming (rest = settle)
const clamp01 = (v) => Math.min(1, Math.max(0, v))
const smoothstep = (t) => t * t * (3 - 2 * t)

/** Position of `el` relative to `ancestor`, ignoring CSS transforms. */
function offsetWithin(el, ancestor) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== ancestor) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return node === ancestor ? { x, y } : null
}

export function useDeviceZoom(variant, { id, mode = 'in', snap = false }) {
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const zoomRef = useRef(null)
  const screenRef = useRef(null)
  const metrics = useRef(null)

  const [stickyTop, setStickyTop] = useState(0)
  const [backgroundActive, setBackgroundActive] = useState(mode === 'in') // is the scene around the device visible?

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const scale = useMotionValue(1)
  const contentOpacity = useMotionValue(mode === 'in' ? 1 : 0)
  const { scrollY } = useScroll()

  const apply = useCallback(
    (scroll) => {
      const m = metrics.current
      if (!m) return
      const p = clamp01((scroll - m.start) / Math.max(1, m.end - m.start))
      // depth: 0 = looking at the device, 1 = fully inside it
      const d = mode === 'in' ? p : ZOOM_END * (1 - p)
      const t = m.reduced ? 0 : smoothstep(clamp01(d / ZOOM_END))
      const s = m.scale ** t // exponential = perceptually even zoom speed
      const k = m.scale > 1 ? (s - 1) / (m.scale - 1) : 0

      x.set(m.tx * k)
      y.set(m.ty * k)
      scale.set(s)
      contentOpacity.set(1 - clamp01((d - 0.02) / 0.3))
      setBackgroundActive(t < 1)

      if (!ownsBoard(id, scroll)) return
      board.opacity.set(clamp01((d - 0.08) / 0.3))
      board.active.set(d > 0.06)
      if (m.reduced || t >= 1) {
        board.clip.set('none')
        return
      }
      // the screen's on-screen polygon at this zoom level (same cut corners, scaled)
      const cx = m.cx + m.tx * k
      const cy = m.cy + m.ty * k
      const hw = (m.sw / 2) * s
      const hh = (m.sh / 2) * s
      const l = cx - hw
      const r = cx + hw
      const top = cy - hh
      const b = cy + hh
      const tl = m.cuts.tl * s
      const tr = m.cuts.tr * s
      const br = m.cuts.br * s
      const bl = m.cuts.bl * s
      board.clip.set(
        `polygon(${l + tl}px ${top}px, ${r - tr}px ${top}px, ${r}px ${top + tr}px, ${r}px ${b - br}px, ` +
          `${r - br}px ${b}px, ${l + bl}px ${b}px, ${l}px ${b - bl}px, ${l}px ${top + tl}px)`,
      )
    },
    [id, mode, x, y, scale, contentOpacity],
  )

  const measure = useCallback(() => {
    const section = sectionRef.current
    const sticky = stickyRef.current
    const zoom = zoomRef.current
    const screen = screenRef.current
    if (!section || !sticky || !zoom || !screen) return

    // Mobile keyboards shrink the viewport height while typing — ignore those resizes,
    // otherwise the device would zoom while someone fills in the contact form.
    const focused = document.activeElement
    const typing = focused && /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName) && sticky.contains(focused)
    const touch = window.matchMedia('(pointer: coarse)').matches
    if (typing && touch && metrics.current && window.innerWidth === metrics.current.vw) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const stickyH = sticky.offsetHeight
    // if the pinned scene is taller than the viewport, let it scroll to its bottom before pinning
    const top = Math.min(0, vh - stickyH)
    setStickyTop(top)

    const z = offsetWithin(zoom, sticky)
    const sc = offsetWithin(screen, zoom)
    if (!z || !sc) return
    const sw = screen.offsetWidth
    const sh = screen.offsetHeight
    const originX = sc.x + sw / 2
    const originY = sc.y + sh / 2
    zoom.style.transformOrigin = `${originX}px ${originY}px`

    const cx = z.x + originX // screen centre in the viewport while pinned
    const cy = top + z.y + originY
    const sectionTop = section.getBoundingClientRect().top + window.scrollY
    const start = sectionTop + Math.max(0, stickyH - vh)
    const end = sectionTop + section.offsetHeight - vh

    metrics.current = {
      reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      vw,
      scale: Math.max(vw / sw, vh / sh) * 1.04,
      tx: vw / 2 - cx,
      ty: vh / 2 - cy,
      cx,
      cy,
      sw,
      sh,
      cuts: SCREEN_CUT_PX[variant],
      start,
      end,
    }
    registerStage(id, { start, end })
    apply(window.scrollY)
  }, [id, variant, apply])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (stickyRef.current) ro.observe(stickyRef.current)
    if (screenRef.current) ro.observe(screenRef.current)
    // other sections changing height shift this stage's scroll range
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    let cancelled = false
    document.fonts?.ready.then(() => !cancelled && measure())
    return () => {
      cancelled = true
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  useEffect(() => () => unregisterStage(id), [id])

  /*
   * Snap: never come to rest half-way through the transition. When scrolling
   * (including momentum) ends inside the zoom range, finish the transition in the
   * direction the user was moving — so even a single arrow-key press or wheel
   * notch carries on through, instead of being pulled back.
   */
  useEffect(() => {
    if (!snap) return undefined
    let lastY = window.scrollY
    let dir = 1
    let target = null // where our own smooth scroll is heading (null = not snapping)
    let touching = false
    let lastScrollAt = 0
    let timer = 0
    const hasScrollEnd = 'onscrollend' in window

    const settle = () => {
      if (touching) return
      const m = metrics.current
      if (!m) return
      const y = window.scrollY
      if (target !== null) {
        const arrived = Math.abs(y - target) < 2
        target = null
        if (arrived) return // our own snap finished
        // otherwise our snap was interrupted — re-evaluate from here
      }
      if (y <= m.start + 1 || y >= m.end - 1) return
      target = dir > 0 ? m.end : m.start
      window.scrollTo({ top: target, behavior: m.reduced ? 'auto' : 'smooth' })
    }
    const scheduleSettle = (ms) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        // if the page is still moving (momentum), scrollend / the next debounce will handle it
        if (performance.now() - lastScrollAt >= ms - 20) settle()
      }, ms)
    }
    const onScroll = () => {
      const y = window.scrollY
      lastScrollAt = performance.now()
      if (target === null && Math.abs(y - lastY) > 0.5) dir = y > lastY ? 1 : -1
      lastY = y
      if (!hasScrollEnd) scheduleSettle(220)
    }
    const onTouchStart = () => {
      touching = true
      target = null // the finger takes over from any snap in progress
    }
    const onTouchEnd = () => {
      touching = false
      // scrollend may already have fired while the finger was down — make sure we settle
      scheduleSettle(220)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    if (hasScrollEnd) window.addEventListener('scrollend', settle)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', onScroll)
      if (hasScrollEnd) window.removeEventListener('scrollend', settle)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
    }
  }, [snap])

  useMotionValueEvent(scrollY, 'change', apply)

  return {
    refs: { sectionRef, stickyRef, zoomRef, screenRef },
    stickyTop,
    backgroundActive,
    motion: { x, y, scale, contentOpacity },
  }
}
