import { useEffect, useRef } from 'react'

/**
 * Animates the <feOffset> noise layers of an SVG "electric" filter from JS at a
 * capped frame rate. Every offset change forces the browser to regenerate the
 * feTurbulence noise, which is expensive — SMIL <animate> does that on every
 * display frame (60–120 Hz); ~20 Hz still reads as crackling electricity.
 *
 * Each <feOffset> needs data-axis="x|y" and data-start="1|0"
 * (value travels from size*start → size*(start-1) over `duration` seconds).
 * Pauses while `targetRef` is off-screen; static for reduced-motion users.
 */
export function useElectricNoise(svgRef, targetRef, { duration = 6, fps = 20, size } = {}) {
  const sizeRef = useRef(size)
  sizeRef.current = size

  useEffect(() => {
    const svg = svgRef.current
    const target = targetRef.current
    if (!svg || !target) return undefined
    const offsets = [...svg.querySelectorAll('feOffset[data-axis]')]
    if (!offsets.length) return undefined

    const start = performance.now()
    const frameMs = 1000 / fps
    let raf = 0
    let last = 0

    const apply = (now) => {
      const t = (((now - start) / 1000) % duration) / duration
      const width = sizeRef.current?.width ?? target.clientWidth
      const height = sizeRef.current?.height ?? target.clientHeight
      for (const el of offsets) {
        const isX = el.dataset.axis === 'x'
        el.setAttribute(isX ? 'dx' : 'dy', ((isX ? width : height) * (Number(el.dataset.start) - t)).toFixed(1))
      }
    }
    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const elapsed = now - last
      if (elapsed < frameMs - 1) return
      last = now - (elapsed % frameMs)
      apply(now)
    }

    apply(start)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf)
      raf = entry.isIntersecting ? requestAnimationFrame(loop) : 0
    })
    io.observe(target)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [svgRef, targetRef, duration, fps])
}
