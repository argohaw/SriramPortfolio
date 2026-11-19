/*
 * CircuitBoard — the "inside of the device": a procedurally generated PCB
 * (chips, pins, 45° traces, vias, SMD parts) with pulses of electricity
 * racing along the traces.
 *
 * Performance: the board is rendered ONCE to an offscreen canvas; each frame
 * just blits it and draws the moving pulses (capped at ~40 fps, DPR ≤ 1.5).
 * Pauses when `active` is false, when the tab is hidden, and is static for
 * reduced-motion users.
 */
import { useEffect, useRef } from 'react'

const CELL = 22 // routing grid size in CSS px
const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
const FPS = 40
const CHIP_LABELS = ['ST · NEURAL SoC', 'Q-CORE', 'MEM 32G', 'PWR-IC', 'RF-LINK', 'NX-7', 'GPU-X', 'SENSE-4', 'CRYPTO', 'I/O HUB']
const PULSE_COLORS = ['#00FF88', '#00F0FF', '#7DFFC4', '#00FF88']

const C = {
  substrate: '#06110C',
  texture: 'rgba(0,255,136,0.045)',
  trace: 'rgba(0,255,136,0.16)',
  traceAlt: 'rgba(0,240,255,0.12)',
  pad: 'rgba(0,255,136,0.38)',
  chipBody: '#0B1813',
  chipEdge: 'rgba(0,255,136,0.30)',
  pin: 'rgba(236,253,245,0.30)',
  label: 'rgba(148,163,184,0.60)',
  smd: 'rgba(236,253,245,0.22)',
}

/* deterministic PRNG so the board looks the same on every visit */
function mulberry32(seed) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ------------------------------ board layout ------------------------------ */
function generateBoard(width, height) {
  const rand = mulberry32(2077)
  const cols = Math.ceil(width / CELL) + 2
  const rows = Math.ceil(height / CELL) + 2
  const grid = new Uint8Array(cols * rows)
  const occupied = (c, r) => c < 0 || r < 0 || c >= cols || r >= rows || grid[r * cols + c] === 1
  const mark = (c, r) => {
    if (c >= 0 && r >= 0 && c < cols && r < rows) grid[r * cols + c] = 1
  }

  /* chips */
  const chips = []
  const chipTarget = Math.max(3, Math.round((cols * rows) / 420))
  for (let attempt = 0; attempt < chipTarget * 30 && chips.length < chipTarget; attempt++) {
    const big = chips.length === 0
    const maxW = Math.max(4, Math.floor(cols * 0.3)) // keep chips proportional on small screens
    const cw = Math.min(maxW, big ? 9 + Math.floor(rand() * 3) : 4 + Math.floor(rand() * 5))
    const ch = Math.min(Math.max(3, Math.floor(rows * 0.2)), big ? 6 + Math.floor(rand() * 2) : 3 + Math.floor(rand() * 3))
    const c = 2 + Math.floor(rand() * Math.max(1, cols - cw - 4))
    const r = 2 + Math.floor(rand() * Math.max(1, rows - ch - 4))
    let free = true
    for (let y = r - 2; y <= r + ch + 1 && free; y++) for (let x = c - 2; x <= c + cw + 1; x++) if (occupied(x, y)) { free = false; break }
    if (!free) continue
    for (let y = r; y < r + ch; y++) for (let x = c; x < c + cw; x++) mark(x, y)
    const n = chips.length
    const label = CHIP_LABELS[n % CHIP_LABELS.length] + (n >= CHIP_LABELS.length ? ` ${Math.floor(n / CHIP_LABELS.length) + 1}` : '')
    chips.push({ c, r, cw, ch, label })
  }

  /* traces (grid random walks with 45° bends, no overlaps / diagonal crossings) */
  const traces = []
  const route = (c0, r0, dir, fromChip = false) => {
    if (occupied(c0, r0)) return
    const cells = [[c0, r0]]
    mark(c0, r0)
    let c = c0
    let r = r0
    let d = dir
    const maxLen = 5 + Math.floor(rand() * 24)
    const blocked = (dd) => {
      const [dx, dy] = DIRS[dd]
      if (occupied(c + dx, r + dy)) return true
      return dx !== 0 && dy !== 0 && occupied(c + dx, r) && occupied(c, r + dy) // would cross a diagonal
    }
    for (let step = 0; step < maxLen; step++) {
      if (rand() < 0.16) d = (d + (rand() < 0.5 ? 1 : 7)) % 8
      if (blocked(d)) {
        const alt = [1, 7, 2, 6].map((t) => (d + t) % 8).find((nd) => !blocked(nd))
        if (alt === undefined) break
        d = alt
      }
      c += DIRS[d][0]
      r += DIRS[d][1]
      mark(c, r)
      cells.push([c, r])
    }
    if (cells.length < 4) return
    // keep only corner points, convert to px
    const pts = [cells[0]]
    for (let i = 1; i < cells.length - 1; i++) {
      const [ax, ay] = cells[i - 1]
      const [bx, by] = cells[i]
      const [cx, cy] = cells[i + 1]
      if (bx - ax !== cx - bx || by - ay !== cy - by) pts.push(cells[i])
    }
    pts.push(cells[cells.length - 1])
    const px = pts.map(([x, y]) => [x * CELL - CELL / 2, y * CELL - CELL / 2])
    const cum = [0]
    for (let i = 1; i < px.length; i++) cum.push(cum[i - 1] + Math.hypot(px[i][0] - px[i - 1][0], px[i][1] - px[i - 1][1]))
    traces.push({ pts: px, cum, length: cum[cum.length - 1], alt: rand() < 0.25, fromChip })
  }

  // traces fanning out of chip pins
  for (const chip of chips) {
    for (let x = chip.c; x < chip.c + chip.cw; x++) {
      if (rand() < 0.75) route(x, chip.r - 1, 6, true)
      if (rand() < 0.75) route(x, chip.r + chip.ch, 2, true)
    }
    for (let y = chip.r; y < chip.r + chip.ch; y++) {
      if (rand() < 0.75) route(chip.c - 1, y, 4, true)
      if (rand() < 0.75) route(chip.c + chip.cw, y, 0, true)
    }
  }
  // free-roaming traces
  const extra = Math.round((cols * rows) / (cols < 30 ? 14 : 24)) // denser on narrow (phone) boards
  for (let i = 0; i < extra; i++) route(Math.floor(rand() * cols), Math.floor(rand() * rows), Math.floor(rand() * 8))

  // small SMD parts (resistors / caps) in leftover gaps
  const smds = []
  for (let i = 0; i < (cols * rows) / 25; i++) {
    const c = Math.floor(rand() * (cols - 2))
    const r = Math.floor(rand() * rows)
    const vertical = rand() < 0.4
    const c2 = vertical ? c : c + 1
    const r2 = vertical ? r + 1 : r
    if (occupied(c, r) || occupied(c2, r2)) continue
    mark(c, r)
    mark(c2, r2)
    smds.push({ c, r, vertical })
  }

  return { chips, traces, smds }
}

/* ------------------------------- rendering -------------------------------- */
function renderStatic(ctx, width, height, board) {
  ctx.fillStyle = C.substrate
  ctx.fillRect(0, 0, width, height)

  // ambient glows (violet used sparingly, mint softly)
  const g1 = ctx.createRadialGradient(width * 0.85, height * 0.12, 0, width * 0.85, height * 0.12, Math.max(width, height) * 0.45)
  g1.addColorStop(0, 'rgba(168,85,247,0.10)')
  g1.addColorStop(1, 'rgba(168,85,247,0)')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, width, height)
  const g2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 0, width * 0.2, height * 0.8, Math.max(width, height) * 0.5)
  g2.addColorStop(0, 'rgba(0,255,136,0.06)')
  g2.addColorStop(1, 'rgba(0,255,136,0)')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, width, height)

  // solder-mask dot texture
  ctx.fillStyle = C.texture
  for (let y = CELL / 2; y < height; y += CELL) for (let x = CELL / 2; x < width; x += CELL) ctx.fillRect(x, y, 1, 1)

  // traces
  ctx.lineWidth = 2
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  for (const t of board.traces) {
    ctx.strokeStyle = t.alt ? C.traceAlt : C.trace
    ctx.beginPath()
    t.pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    ctx.stroke()
  }
  // vias / pads at trace ends
  ctx.lineWidth = 1.5
  const via = (x, y) => {
    ctx.fillStyle = C.substrate
    ctx.strokeStyle = C.pad
    ctx.beginPath()
    ctx.arc(x, y, 3.4, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
  }
  for (const t of board.traces) {
    via(...t.pts[t.pts.length - 1])
    if (!t.fromChip) via(...t.pts[0])
  }

  // SMD parts
  for (const s of board.smds) {
    const x = s.c * CELL - CELL / 2
    const y = s.r * CELL - CELL / 2
    const w = s.vertical ? 8 : CELL + 8
    const h = s.vertical ? CELL + 8 : 8
    ctx.fillStyle = '#0E1C16'
    ctx.fillRect(x - 4, y - 4, w, h)
    ctx.fillStyle = C.smd
    if (s.vertical) {
      ctx.fillRect(x - 4, y - 4, 8, 4)
      ctx.fillRect(x - 4, y + CELL, 8, 4)
    } else {
      ctx.fillRect(x - 4, y - 4, 4, 8)
      ctx.fillRect(x + CELL, y - 4, 4, 8)
    }
  }

  // chips
  for (const chip of board.chips) {
    const x = chip.c * CELL - CELL
    const y = chip.r * CELL - CELL
    const w = chip.cw * CELL
    const h = chip.ch * CELL
    // pins
    ctx.fillStyle = C.pin
    for (let i = 0; i < chip.cw; i++) {
      ctx.fillRect(x + i * CELL + CELL / 2 - 2.5, y - 10, 5, 11) // pins reach the trace start (half a cell out)
      ctx.fillRect(x + i * CELL + CELL / 2 - 2.5, y + h - 1, 5, 11)
    }
    for (let i = 0; i < chip.ch; i++) {
      ctx.fillRect(x - 10, y + i * CELL + CELL / 2 - 2.5, 11, 5)
      ctx.fillRect(x + w - 1, y + i * CELL + CELL / 2 - 2.5, 11, 5)
    }
    // body
    ctx.fillStyle = C.chipBody
    ctx.fillRect(x, y, w, h)
    ctx.strokeStyle = C.chipEdge
    ctx.lineWidth = 1
    ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1)
    ctx.strokeStyle = 'rgba(236,253,245,0.06)'
    ctx.strokeRect(x + 5.5, y + 5.5, w - 11, h - 11)
    // pin-1 marker + label
    ctx.fillStyle = C.pad
    ctx.beginPath()
    ctx.arc(x + 10, y + 10, 2.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = C.label
    ctx.font = `${chip.cw >= 8 ? 13 : 10}px "Share Tech Mono", ui-monospace, monospace`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(chip.label, x + w / 2, y + h / 2)
  }
}

function makeGlowSprite(color, size) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, '#FFFFFF')
  grad.addColorStop(0.18, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

function pointAt(trace, d) {
  const { pts, cum } = trace
  if (d <= 0) return pts[0]
  if (d >= trace.length) return pts[pts.length - 1]
  let i = 1
  while (cum[i] < d) i++
  const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1])
  return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t]
}

/* -------------------------------- component -------------------------------- */
export default function CircuitBoard({ active = true, className = '' }) {
  const canvasRef = useRef(null)
  const activeRef = useRef(active)
  const controlsRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = Object.fromEntries(PULSE_COLORS.map((c) => [c, makeGlowSprite(c, 64)]))
    const staticCanvas = document.createElement('canvas')
    const sctx = staticCanvas.getContext('2d')

    let width = 0
    let height = 0
    let dpr = 1
    let board = null
    let pulses = []
    let flashes = []
    let raf = 0
    let last = 0
    let enabled = activeRef.current

    let boardW = 0
    let boardH = 0
    const build = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      for (const c of [canvas, staticCanvas]) {
        c.width = Math.round(width * dpr)
        c.height = Math.round(height * dpr)
      }
      // Only regenerate the layout when the width changes (or it got taller than the board).
      // Mobile address bars change just the height while scrolling — keep the same board then.
      if (!board || width !== boardW || height > boardH) {
        boardW = width
        boardH = Math.round(height * 1.2) // headroom for the address bar collapsing
        board = generateBoard(boardW, boardH)
        pulses = []
        flashes = []
      }
      sctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      renderStatic(sctx, width, height, board)
      drawFrame(0)
    }

    const spawn = () => {
      const t = board.traces[Math.floor(Math.random() * board.traces.length)]
      if (!t || t.length < CELL * 3) return
      const reverse = Math.random() < 0.5
      pulses.push({
        trace: t,
        d: 0,
        reverse,
        speed: 140 + Math.random() * 220,
        tail: 40 + Math.random() * 50,
        color: PULSE_COLORS[Math.floor(Math.random() * PULSE_COLORS.length)],
      })
    }

    const drawFrame = (dt) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.drawImage(staticCanvas, 0, 0)
      if (!board || dt === 0) return

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.globalCompositeOperation = 'lighter'
      const target = Math.min(46, Math.round(board.traces.length * 0.3))
      if (pulses.length < target && Math.random() < 0.6) spawn()

      ctx.lineWidth = 2.2
      ctx.lineCap = 'round'
      const alive = []
      for (const p of pulses) {
        p.d += p.speed * dt
        const L = p.trace.length
        const at = (dist) => pointAt(p.trace, p.reverse ? L - dist : dist)
        // tail: short segments fading out behind the head
        ctx.strokeStyle = p.color
        const steps = 9
        let prev = at(Math.min(p.d, L))
        for (let i = 1; i <= steps; i++) {
          const dist = p.d - (p.tail * i) / steps
          if (dist < 0) break
          const pt = at(Math.min(dist, L))
          ctx.globalAlpha = 0.85 * (1 - i / steps)
          ctx.beginPath()
          ctx.moveTo(prev[0], prev[1])
          ctx.lineTo(pt[0], pt[1])
          ctx.stroke()
          prev = pt
        }
        if (p.d <= L) {
          const [hx, hy] = at(p.d)
          ctx.globalAlpha = 1
          ctx.drawImage(sprites[p.color], hx - 12, hy - 12, 24, 24)
        } else if (!p.flashed) {
          p.flashed = true
          const [ex, ey] = at(L)
          flashes.push({ x: ex, y: ey, life: 1, color: p.color })
        }
        if (p.d - p.tail <= L) alive.push(p)
      }
      pulses = alive

      flashes = flashes.filter((f) => {
        f.life -= dt * 2.2
        if (f.life <= 0) return false
        ctx.globalAlpha = f.life
        const s = 22 + (1 - f.life) * 26
        ctx.drawImage(sprites[f.color], f.x - s / 2, f.y - s / 2, s, s)
        return true
      })
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const elapsed = now - last
      if (elapsed < 1000 / FPS - 1) return
      last = now - (elapsed % (1000 / FPS)) // carry the remainder so 60 Hz screens get ~40 fps, not 30
      drawFrame(Math.min(elapsed / 1000, 0.1))
    }
    const start = () => {
      if (raf || reducedMotion || !enabled || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    build()
    document.fonts?.ready.then(() => board && (renderStatic(sctx, width, height, board), drawFrame(0)))
    start()

    let resizeTimer = 0
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 150)
    }
    const onVisibility = () => (document.hidden ? stop() : start())
    window.addEventListener('resize', onResize)
    document.addEventListener('visibilitychange', onVisibility)
    controlsRef.current = {
      setEnabled(value) {
        enabled = value
        if (enabled) start()
        else stop()
      },
    }

    return () => {
      controlsRef.current = null
      stop()
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    controlsRef.current?.setEnabled(active)
  }, [active])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />
}
