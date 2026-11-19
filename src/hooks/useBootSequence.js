import { useCallback, useEffect, useRef, useState } from 'react'

const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

function shouldSkip() {
  if (typeof window === 'undefined') return false
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const deepLink = window.location.hash && window.location.hash !== '#home'
  return reduced || Boolean(deepLink)
}

/**
 * Drives the tablet boot animation: progress goes 0 → 1 over `duration` ms
 * after an initial `delay` (screen power-on), then flips `done`.
 * Skipped automatically for reduced-motion users or deep links (e.g. /#projects).
 */
export function useBootSequence({ duration = 4800, delay = 1000, settle = 700 } = {}) {
  const [skip] = useState(shouldSkip)
  const [progress, setProgress] = useState(skip ? 1 : 0)
  const [done, setDone] = useState(skip)
  const raf = useRef(0)
  const timers = useRef([])

  const clearAll = () => {
    cancelAnimationFrame(raf.current)
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    if (skip) return undefined
    let start
    const tick = (t) => {
      start ??= t
      const linear = Math.min((t - start) / duration, 1)
      // 1% steps: React skips identical values, so the boot screen re-renders
      // ~100 times in total instead of on every display frame
      setProgress(Math.round(easeInOut(linear) * 100) / 100)
      if (linear < 1) raf.current = requestAnimationFrame(tick)
      else timers.current.push(setTimeout(() => setDone(true), settle))
    }
    timers.current.push(setTimeout(() => (raf.current = requestAnimationFrame(tick)), delay))
    return clearAll
  }, [skip, duration, delay, settle])

  const finish = useCallback(() => {
    clearAll()
    setProgress(1)
    setDone(true)
  }, [])

  return { progress, done, finish }
}
