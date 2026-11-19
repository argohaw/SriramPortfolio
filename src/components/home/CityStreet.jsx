/*
 * CityStreet — animated background: a futuristic neon city at night. An original
 * android walks down the street, meeting people and other robots — stopping to
 * wave and exchange a holographic greeting with some, nodding to others — while a
 * colossal mech strides slowly between the distant towers and flying vehicles
 * cross the sky. All characters are original designs, drawn procedurally.
 *
 * Props:
 *   power   0–1  city lights / visors (the landing page powers the city up during boot)
 *   active       pause rendering when false (e.g. fully covered)
 * Clicking / tapping makes the android wave at you.
 *
 * Performance: 2D canvas; skyline layers are pre-rendered once per resize and
 * scrolled with parallax; characters are a few dozen path ops each. DPR ≤ 1.25,
 * ≤ 50 fps, pauses when hidden or off-screen; a still frame for reduced motion.
 */
import { useEffect, useRef } from 'react'

const FPS = 50
// Size of the street characters relative to the viewport height (1 = the earlier, larger size).
// Walking speed, stride, lamp posts, kiosks and greeting distance all scale with it.
const CHAR_SCALE = 0.66
const MINT = '#00FF88'
const CYAN = '#00F0FF'
const VIOLET = '#A855F7'
const SIGN_WORDS = ['NX-7', 'ST·LABS', 'SYNC', 'HOLO', 'DATA', 'NEO', 'ARC', '2099', 'RAMEN', 'BYTE', 'VOLT', 'KIRA']
const GREETINGS = { robot: ['SYNC OK', 'HANDSHAKE', 'HELLO, UNIT'], human: ['HELLO', 'HI THERE', 'GOOD EVENING', 'HEY!'] }

/* ----------------------------- character types ----------------------------- */
// proportions are fractions of the figure's height; angles in radians
const TYPES = {
  hero: {
    kind: 'robot', h: 0.36, thigh: 0.25, shin: 0.25, foot: 0.075, torso: 0.28, neck: 0.035, head: 0.1,
    wThigh: 0.078, wShin: 0.064, wTorso: 0.18, wArmU: 0.058, wArmL: 0.05, armU: 0.19, armL: 0.19,
    body: '#1E3029', far: '#14211C', near: '#29403A', rim: MINT, rimA: 0.6, visor: MINT, core: CYAN,
    pad: 0.07, swing: 0.36, armSwing: 0.3, knee: 0.55, lean: 0.04, speed: 1,
  },
  service: {
    kind: 'robot', dome: true, h: 0.27, thigh: 0.23, shin: 0.23, foot: 0.07, torso: 0.3, neck: 0.03, head: 0.12,
    wThigh: 0.07, wShin: 0.06, wTorso: 0.16, wArmU: 0.05, wArmL: 0.045, armU: 0.19, armL: 0.18,
    body: '#24372F', far: '#18261F', near: '#2E463C', rim: CYAN, rimA: 0.5, visor: CYAN, core: MINT,
    pad: 0.045, swing: 0.3, armSwing: 0.22, knee: 0.45, lean: 0.02, speed: 0.85,
  },
  heavy: {
    kind: 'robot', h: 0.33, thigh: 0.24, shin: 0.24, foot: 0.09, torso: 0.28, neck: 0.02, head: 0.075,
    wThigh: 0.1, wShin: 0.085, wTorso: 0.25, wArmU: 0.075, wArmL: 0.07, armU: 0.2, armL: 0.2,
    body: '#1B2924', far: '#121D19', near: '#253731', rim: VIOLET, rimA: 0.45, visor: VIOLET, core: CYAN,
    pad: 0.09, swing: 0.24, armSwing: 0.14, knee: 0.4, lean: 0.06, speed: 0.7,
  },
  human: {
    kind: 'human', h: 0.26, thigh: 0.245, shin: 0.245, foot: 0.065, torso: 0.3, neck: 0.03, head: 0.115,
    wThigh: 0.062, wShin: 0.05, wTorso: 0.13, wArmU: 0.044, wArmL: 0.038, armU: 0.19, armL: 0.18,
    body: '#111A16', far: '#0B120F', near: '#16221D', rim: CYAN, rimA: 0.28, visor: null, core: null,
    pad: 0, swing: 0.44, armSwing: 0.42, knee: 0.7, lean: 0.03, speed: 1,
  },
  // colossal background mech
  titan: {
    kind: 'robot', background: true, h: 0.5, thigh: 0.23, shin: 0.25, foot: 0.08, torso: 0.27, neck: 0.015, head: 0.06,
    wThigh: 0.1, wShin: 0.09, wTorso: 0.27, wArmU: 0.085, wArmL: 0.08, armU: 0.2, armL: 0.23,
    body: '#15241E', far: '#101B17', near: '#1A2B24', rim: CYAN, rimA: 0.22, visor: MINT, core: CYAN,
    pad: 0.11, swing: 0.17, armSwing: 0.09, knee: 0.3, lean: 0.08, speed: 0.45,
  },
}

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
const pick = (arr, r = Math.random) => arr[Math.floor(r() * arr.length)]

function makeGlow(color, size = 128) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, color)
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, size, size)
  return c
}

/* --------------------------------- poses ---------------------------------- */
function walkPose(phase, f) {
  const s = Math.sin(phase)
  const c = Math.cos(phase)
  return {
    legs: [
      [f.swing * s, f.knee * Math.max(0, c)], // near: [thigh angle, knee bend]
      [-f.swing * s, f.knee * Math.max(0, -c)], // far
    ],
    arms: [
      [-f.armSwing * s, 0.25 + 0.25 * Math.max(0, -s)], // near: [shoulder, elbow]
      [f.armSwing * s, 0.25 + 0.25 * Math.max(0, s)],
    ],
    tilt: 0,
  }
}
function standPose() {
  return { legs: [[0.03, 0.05], [-0.03, 0.05]], arms: [[0.06, 0.18], [-0.04, 0.18]], tilt: 0 }
}
function wavePose(t) {
  const p = standPose()
  p.arms[0] = [2.6, 0.45 + 0.4 * Math.sin(t * 9)] // near arm raised, forearm waving
  p.tilt = -0.06
  return p
}

/* ------------------------------ figure drawing ----------------------------- */
function drawFigure(ctx, f, x, groundY, H, dir, pose, t, opts = {}) {
  const h = f.h * H * (f.background ? 1 : CHAR_SCALE) * (opts.scale || 1)
  const L1 = f.thigh * h
  const L2 = f.shin * h
  const footT = 0.012 * h
  // hip height so the lower foot touches the ground (gives a natural bob)
  const reach = Math.max(...pose.legs.map(([a, k]) => Math.cos(a) * L1 + Math.cos(a - k) * L2))
  const hip = [0, groundY - footT - reach]
  const lean = f.lean
  const sh = [hip[0] + Math.sin(lean) * f.torso * h, hip[1] - Math.cos(lean) * f.torso * h]

  const leg = ([a, k]) => {
    const knee = [hip[0] + Math.sin(a) * L1, hip[1] + Math.cos(a) * L1]
    const ankle = [knee[0] + Math.sin(a - k) * L2, knee[1] + Math.cos(a - k) * L2]
    return [hip, knee, ankle, [ankle[0] + f.foot * h, ankle[1] + footT * 0.5]]
  }
  const arm = ([s, e]) => {
    const elbow = [sh[0] + Math.sin(s) * f.armU * h, sh[1] + Math.cos(s) * f.armU * h]
    const hand = [elbow[0] + Math.sin(s + e) * f.armL * h, elbow[1] + Math.cos(s + e) * f.armL * h]
    return [sh, elbow, hand]
  }
  const [nearLeg, farLeg] = pose.legs.map(leg)
  const [nearArm, farArm] = pose.arms.map(arm)
  const headR = (f.head * h) / 2
  const hc = [sh[0] + Math.sin(lean) * (f.neck * h + headR), sh[1] - Math.cos(lean) * (f.neck * h + headR)]

  const line = (pts, w, color) => {
    ctx.strokeStyle = color
    ctx.lineWidth = w
    ctx.beginPath()
    pts.forEach(([px, py], i) => (i ? ctx.lineTo(px, py) : ctx.moveTo(px, py)))
    ctx.stroke()
  }
  const limbs = (pass) => {
    const rim = pass === 'rim'
    const pad = rim ? 1.8 : 0
    const col = (c) => (rim ? f.rim : c)
    // far side
    line(farLeg.slice(0, 3), f.wThigh * h + pad, col(f.far))
    line(farLeg.slice(2), f.wShin * h * 0.7 + pad, col(f.far))
    line(farArm, f.wArmU * h + pad, col(f.far))
    // backpack / coat (humans)
    if (f.backpack) {
      line([[hip[0] - f.wTorso * h * 0.55, hip[1] - f.torso * h * 0.35], [sh[0] - f.wTorso * h * 0.55, sh[1] + f.torso * h * 0.15]], f.wTorso * h * 0.75 + pad, col(f.far))
    }
    // torso + head
    line([hip, sh], f.wTorso * h + pad, col(f.body))
    if (f.coat) {
      ctx.fillStyle = col(f.body)
      ctx.beginPath()
      const cw = f.wTorso * h * 0.62 + pad / 2
      ctx.moveTo(sh[0] - cw, sh[1])
      ctx.lineTo(sh[0] + cw, sh[1])
      ctx.lineTo(nearLeg[1][0] + cw * 1.1, hip[1] + L1 * 0.85)
      ctx.lineTo(farLeg[1][0] - cw * 1.1, hip[1] + L1 * 0.85)
      ctx.closePath()
      ctx.fill()
    }
    ctx.save()
    ctx.translate(hc[0], hc[1])
    ctx.rotate(pose.tilt + (opts.nod || 0))
    ctx.fillStyle = col(f.body)
    ctx.beginPath()
    if (f.kind === 'human') ctx.arc(0, 0, headR * 0.92 + pad / 2, 0, Math.PI * 2)
    else if (f.dome) {
      ctx.arc(0, headR * 0.15, headR + pad / 2, Math.PI, 0)
      ctx.lineTo(headR + pad / 2, headR * 0.55 + pad / 2)
      ctx.lineTo(-headR - pad / 2, headR * 0.55 + pad / 2)
    } else if (ctx.roundRect) ctx.roundRect(-headR * 0.85 - pad / 2, -headR - pad / 2, headR * 1.7 + pad, headR * 2 + pad, headR * 0.35)
    else ctx.rect(-headR * 0.85 - pad / 2, -headR - pad / 2, headR * 1.7 + pad, headR * 2 + pad) // iOS 15 fallback
    ctx.fill()
    ctx.restore()
    // near side
    line(nearLeg.slice(0, 3), f.wThigh * h + pad, col(f.body))
    line(nearLeg.slice(2), f.wShin * h * 0.7 + pad, col(f.body))
    if (f.pad && !rim) {
      ctx.fillStyle = f.near
      ctx.beginPath()
      ctx.arc(sh[0], sh[1] + f.pad * h * 0.2, f.pad * h, 0, Math.PI * 2)
      ctx.fill()
    }
    line(nearArm, f.wArmU * h + pad, col(f.near))
  }

  ctx.save()
  ctx.translate(x, 0)
  ctx.scale(dir, 1)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.globalAlpha = (opts.alpha ?? 1) * f.rimA
  limbs('rim')
  ctx.globalAlpha = opts.alpha ?? 1
  limbs('body')

  const power = opts.power ?? 1
  // glowing details
  ctx.globalCompositeOperation = 'lighter'
  if (f.kind === 'robot') {
    const pulse = 0.65 + 0.35 * Math.sin(t * 3 + x * 0.01)
    // visor
    ctx.save()
    ctx.translate(hc[0], hc[1])
    ctx.rotate(pose.tilt + (opts.nod || 0))
    ctx.globalAlpha = power * (opts.flash ? 1 : 0.85)
    ctx.fillStyle = f.visor
    if (f.dome) {
      ctx.beginPath()
      ctx.arc(headR * 0.45, 0, headR * 0.22, 0, Math.PI * 2)
      ctx.fill()
    } else ctx.fillRect(-headR * 0.1, -headR * 0.28, headR * 0.95, headR * 0.34)
    ctx.globalAlpha = power * (opts.flash ? 0.9 : 0.45)
    const g = headR * (opts.flash ? 5 : 3)
    ctx.drawImage(opts.glows[f.visor], headR * 0.4 - g / 2, -g / 2, g, g)
    ctx.restore()
    // chest core
    const cx = hip[0] + (sh[0] - hip[0]) * 0.72 + f.wTorso * h * 0.28
    const cy = hip[1] + (sh[1] - hip[1]) * 0.72
    ctx.globalAlpha = power * pulse
    ctx.fillStyle = f.core
    ctx.beginPath()
    ctx.arc(cx, cy, f.wTorso * h * 0.14, 0, Math.PI * 2)
    ctx.fill()
    const cg = f.wTorso * h * 1.1
    ctx.globalAlpha = power * pulse * 0.6
    ctx.drawImage(opts.glows[f.core], cx - cg / 2, cy - cg / 2, cg, cg)
    // joint lights
    ctx.globalAlpha = power * 0.8
    ctx.fillStyle = f.rim
    for (const p of [nearLeg[1], nearArm[1]]) {
      ctx.beginPath()
      ctx.arc(p[0], p[1], Math.max(1.2, h * 0.007), 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (f.accent) {
    // glowing jacket stripe
    ctx.globalAlpha = 0.75 * power
    line(
      [
        [hip[0] + f.wTorso * h * 0.3, hip[1] - f.torso * h * 0.1],
        [sh[0] + f.wTorso * h * 0.3, sh[1] + f.torso * h * 0.15],
      ],
      Math.max(1.2, h * 0.008),
      f.accent,
    )
  }
  ctx.restore()
  return hc // head position (for greeting bubbles)
}

/* ------------------------------- skyline tiles ----------------------------- */
function renderSkyline({ width, height, H, u, layer, groundY, dpr }) {
  const rand = mulberry32(layer === 'far' ? 11 : 29)
  const make = () => {
    const c = document.createElement('canvas')
    c.width = Math.ceil(width * dpr)
    c.height = Math.ceil(height * dpr)
    const g = c.getContext('2d')
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    return [c, g]
  }
  const [base, b] = make()
  const [lights, l] = make()
  const far = layer === 'far'
  const bottom = far ? groundY - 0.06 * H : groundY - 0.012 * H
  let x = 0
  while (x < width) {
    const w = Math.min(width - x, (far ? 40 + rand() * 90 : 90 + rand() * 150) * u)
    const h = (far ? 0.22 + rand() * 0.4 : 0.14 + rand() * 0.3) * H
    const top = bottom - h
    b.fillStyle = far ? '#0E1915' : '#0A130F'
    b.fillRect(x, top, w - (far ? 3 : 6) * u, h + 2)
    // stepped roofline / antenna
    if (rand() < 0.5) b.fillRect(x + w * 0.25, top - h * 0.08, w * 0.4, h * 0.08)
    if (far && rand() < 0.35) {
      b.fillRect(x + w * 0.45, top - h * 0.22, 2 * u, h * 0.22)
      l.fillStyle = 'rgba(168,85,247,0.8)'
      l.beginPath()
      l.arc(x + w * 0.45 + u, top - h * 0.22, 2 * u, 0, Math.PI * 2)
      l.fill()
    }
    // windows
    const ww = (far ? 2 : 3.5) * u
    const wh = (far ? 3 : 5) * u
    const gx = (far ? 7 : 11) * u
    const gy = (far ? 9 : 13) * u
    for (let wy = top + gy; wy < bottom - gy; wy += gy) {
      for (let wx = x + gx * 0.6; wx < x + w - gx; wx += gx) {
        if (rand() > (far ? 0.2 : 0.14)) continue
        const r = rand()
        l.fillStyle = r < 0.5 ? `rgba(0,255,136,${0.25 + rand() * 0.35})` : r < 0.85 ? `rgba(0,240,255,${0.2 + rand() * 0.3})` : `rgba(236,253,245,${0.25 + rand() * 0.3})`
        l.fillRect(wx, wy, ww, wh)
      }
    }
    // neon signs on the nearer buildings
    if (!far && rand() < 0.45 && w > 90 * u) {
      const word = pick(SIGN_WORDS, rand)
      const color = rand() < 0.5 ? MINT : rand() < 0.85 ? CYAN : VIOLET
      const sw = Math.min(w * 0.7, (word.length * 9 + 18) * u)
      const sx = x + (w - sw) / 2
      const sy = top + h * (0.12 + rand() * 0.35)
      l.save()
      l.shadowColor = color
      l.shadowBlur = 14 * u
      l.strokeStyle = color
      l.lineWidth = 1.6 * u
      l.strokeRect(sx, sy, sw, 20 * u)
      l.fillStyle = color
      l.font = `${12 * u}px "Share Tech Mono", ui-monospace, monospace`
      l.textAlign = 'center'
      l.textBaseline = 'middle'
      l.fillText(word, sx + sw / 2, sy + 10.5 * u)
      l.restore()
    }
    x += w
  }
  return { base, lights, width }
}

/* -------------------------------- component -------------------------------- */
export default function CityStreet({ power = 1, active = true, className = '' }) {
  const canvasRef = useRef(null)
  const powerRef = useRef(power)
  const activeRef = useRef(active)
  const controlsRef = useRef(null)
  powerRef.current = power

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return undefined

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const glows = { [MINT]: makeGlow('rgba(0,255,136,0.9)'), [CYAN]: makeGlow('rgba(0,240,255,0.9)'), [VIOLET]: makeGlow('rgba(168,85,247,0.9)') }
    const lampGlow = makeGlow('rgba(0,255,136,0.55)')
    const pool = makeGlow('rgba(0,255,136,0.35)')

    let W = 0
    let H = 0
    let u = 1
    let dpr = 1
    let groundY = 0
    let sky = null
    let farT = null
    let midT = null
    let camX = 0
    let t = 0
    let raf = 0
    let last = 0
    let visible = true
    let enabled = activeRef.current

    const hero = { f: TYPES.hero, phase: 0, state: 'walk', timer: 0, nod: 0 }
    let npcs = []
    let bubbles = []
    let spawnIn = 1.5
    let crafts = []
    const titan = { wx: 0, phase: 0 }

    let builtFor = ''
    const build = (force = false) => {
      const nextW = canvas.clientWidth || window.innerWidth
      const nextH = canvas.clientHeight || window.innerHeight
      const nextDpr = Math.min(window.devicePixelRatio || 1, 1.25)
      const key = `${nextW}x${nextH}@${nextDpr}`
      if (!force && key === builtFor) return // e.g. the ResizeObserver's initial callback
      builtFor = key
      const prevW = W
      const prevH = H
      W = nextW
      H = nextH
      u = H / 900
      dpr = nextDpr
      canvas.width = Math.max(1, Math.round(W * dpr))
      canvas.height = Math.max(1, Math.round(H * dpr))
      groundY = H * 0.88

      // sky
      sky = document.createElement('canvas')
      sky.width = canvas.width
      sky.height = canvas.height
      const s = sky.getContext('2d')
      s.setTransform(dpr, 0, 0, dpr, 0, 0)
      const grad = s.createLinearGradient(0, 0, 0, H)
      grad.addColorStop(0, '#05080A')
      grad.addColorStop(0.55, '#0A120F')
      grad.addColorStop(0.85, '#0D1A14')
      grad.addColorStop(1, '#0A0F0D')
      s.fillStyle = grad
      s.fillRect(0, 0, W, H)
      const amb = (x, y, r, color) => {
        const g = s.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, color)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        s.fillStyle = g
        s.fillRect(0, 0, W, H)
      }
      amb(W * 0.8, H * 0.15, Math.max(W, H) * 0.45, 'rgba(168,85,247,0.08)')
      amb(W * 0.3, H * 0.75, Math.max(W, H) * 0.5, 'rgba(0,255,136,0.05)')
      const sr = mulberry32(5)
      for (let i = 0; i < 90; i++) {
        s.fillStyle = `rgba(236,253,245,${0.15 + sr() * 0.4})`
        s.fillRect(sr() * W, sr() * H * 0.45, sr() < 0.9 ? 1 : 2, 1)
      }

      const tileW = Math.ceil(Math.max(W * 1.6, 1400 * u))
      farT = renderSkyline({ width: tileW, height: H, H, u, layer: 'far', groundY, dpr })
      midT = renderSkyline({ width: tileW, height: H, H, u, layer: 'mid', groundY, dpr })

      if (!crafts.length) {
        crafts = Array.from({ length: 3 }, (_, i) => ({
          x: Math.random() * W,
          y: H * (0.1 + i * 0.1 + Math.random() * 0.05),
          v: (40 + Math.random() * 80) * u * (Math.random() < 0.5 ? -1 : 1),
          s: (0.7 + Math.random() * 0.6) * u,
        }))
        titan.wx = W * 0.2
      } else if (prevW && prevH) {
        // keep flying craft where they were, rescaled to the new size
        for (const c of crafts) {
          c.x *= W / prevW
          c.y *= H / prevH
          c.v *= H / prevH
          c.s *= H / prevH
        }
      }
      if (!npcs.length) seedNPCs()
      draw(0)
    }

    const makeNPC = (wx) => {
      const r = Math.random()
      const type = r < 0.55 ? 'human' : r < 0.85 ? 'service' : 'heavy'
      const base = TYPES[type]
      const f = { ...base }
      if (type === 'human') {
        f.h = base.h * (0.92 + Math.random() * 0.14)
        f.body = pick(['#111A16', '#141C19', '#0F1613', '#17201C'])
        f.near = f.body
        f.accent = pick([null, null, MINT, CYAN, VIOLET])
        f.coat = Math.random() < 0.35
        f.backpack = !f.coat && Math.random() < 0.3
      }
      const lane = Math.random() < 0.62 ? 0 : 1
      const towards = Math.random() < 0.72
      return {
        f,
        type,
        wx,
        lane,
        laneT: lane, // animated lane position (0 = hero's lane, 1 = far side of the pavement)
        dir: towards ? -1 : 1,
        baseDir: towards ? -1 : 1,
        speed: (towards ? 55 + Math.random() * 25 : 22 + Math.random() * 14) * u * f.speed * CHAR_SCALE,
        phase: Math.random() * Math.PI * 2,
        state: 'walk',
        timer: 0,
        met: false,
        nod: 0,
      }
    }
    const seedNPCs = () => {
      npcs = [makeNPC(camX + W * 0.8), makeNPC(camX + W * 1.3)]
    }

    const heroX = () => W * (W < 700 ? 0.5 : 0.4)
    const heroSpeed = () => 62 * u * CHAR_SCALE

    const update = (dt) => {
      t += dt
      // hero
      if (hero.state === 'walk') {
        camX += heroSpeed() * dt
        hero.phase += (heroSpeed() * dt) / (TYPES.hero.thigh * TYPES.hero.h * H * CHAR_SCALE * 1.6) * Math.PI
      } else {
        hero.timer -= dt
        if (hero.timer <= 0) hero.state = 'walk'
      }
      hero.nod = Math.max(0, hero.nod - dt * 2)

      // npcs
      spawnIn -= dt
      const maxN = W < 700 ? 4 : 6
      if (spawnIn <= 0 && npcs.length < maxN) {
        npcs.push(makeNPC(camX + W + 160 * u))
        spawnIn = 2.5 + Math.random() * 3.5
      }
      const hx = heroX()
      for (const n of npcs) {
        if (n.state === 'walk') {
          n.wx += n.dir * n.speed * dt
          n.phase += (n.speed * dt) / (n.f.thigh * n.f.h * H * CHAR_SCALE * 1.6) * Math.PI
        } else {
          n.timer -= dt
          if (n.timer <= 0) {
            n.state = 'walk'
            n.dir = n.baseDir
            n.lane = 1 // step aside so they don't walk through each other
          }
        }
        n.nod = Math.max(0, n.nod - dt * 2)
        n.laneT += (n.lane - n.laneT) * Math.min(1, dt * 3)
        const meet = H * 0.11 * CHAR_SCALE
        if (n.lane === 0 && n.state === 'walk') {
          const blocked = npcs.some((o) => o !== n && o.lane === 0 && o.state === 'greet' && Math.abs(o.wx - n.wx) < meet * 0.9)
          if (blocked) n.lane = 1
        }
        // meeting the hero (same lane, just ahead of it)
        const dx = n.wx - camX - hx
        if (n.lane === 0 && !n.met && dx > 0 && dx < meet) {
          n.met = true
          if (hero.state === 'walk' && Math.random() < 0.7) {
            const dur = 2.2
            hero.state = 'greet'
            hero.timer = dur
            n.state = 'greet'
            n.timer = dur
            n.dir = -1 // face the hero
            const text = pick(GREETINGS[n.f.kind === 'robot' ? 'robot' : 'human'])
            bubbles.push({ wx: camX + hx + dx / 2, text, life: dur })
          } else {
            n.nod = 1
            hero.nod = 1
            n.lane = 1 // pass by on the far side
          }
        }
      }
      npcs = npcs.filter((n) => n.wx - camX > -220 * u && n.wx - camX < W + 400 * u)
      bubbles = bubbles.filter((b) => (b.life -= dt) > 0)

      for (const c of crafts) {
        c.x += c.v * dt
        if (c.x > W + 120 * u) c.x = -120 * u
        if (c.x < -120 * u) c.x = W + 120 * u
      }
      titan.wx += 9 * u * dt
      titan.phase += dt * 0.9
    }

    const drawTile = (tile, offset, power) => {
      const tw = tile.width
      const x0 = -((((offset % tw) + tw) % tw) * dpr)
      for (const k of [0, 1]) {
        const dx = x0 + k * tw * dpr
        ctx.drawImage(tile.base, dx, 0)
      }
      ctx.globalAlpha = 0.2 + 0.8 * power
      for (const k of [0, 1]) ctx.drawImage(tile.lights, x0 + k * tw * dpr, 0)
      ctx.globalAlpha = 1
    }

    const draw = () => {
      const power = powerRef.current
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.drawImage(sky, 0, 0)

      // flying vehicles (behind the towers' tops)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      for (const c of crafts) {
        const d = Math.sign(c.v)
        ctx.globalCompositeOperation = 'lighter'
        ctx.strokeStyle = 'rgba(0,240,255,0.35)'
        ctx.lineWidth = 1.5 * c.s
        ctx.beginPath()
        ctx.moveTo(c.x - d * 70 * c.s, c.y + 2 * c.s)
        ctx.lineTo(c.x - d * 10 * c.s, c.y + 2 * c.s)
        ctx.stroke()
        ctx.globalCompositeOperation = 'source-over'
        ctx.fillStyle = '#16231D'
        ctx.beginPath()
        ctx.ellipse(c.x, c.y, 16 * c.s, 4.5 * c.s, 0, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = Math.sin(t * 6 + c.x) > 0 ? 0.9 : 0.25
        ctx.fillStyle = VIOLET
        ctx.fillRect(c.x - 1.5 * c.s, c.y - 5.5 * c.s, 3 * c.s, 2 * c.s)
        ctx.globalAlpha = 0.5
        ctx.drawImage(glows[CYAN], c.x - 14 * c.s, c.y - 2 * c.s, 28 * c.s, 12 * c.s)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      drawTile(farT, camX * 0.15, power)

      // colossal mech striding between the distant towers
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const span = W + 900 * u
      const tx = ((((titan.wx - camX * 0.22) % span) + span) % span) - 450 * u
      const tg = groundY - 0.05 * H
      const tPose = walkPose(titan.phase, TYPES.titan)
      const head = drawFigure(ctx, TYPES.titan, tx, tg, H, 1, tPose, t, { glows, power: 0.4 + 0.6 * power, alpha: 0.95 })
      // searchlight
      ctx.globalCompositeOperation = 'lighter'
      const sweep = 0.35 + Math.sin(t * 0.4) * 0.25
      const bx = tx + head[0]
      const by = head[1]
      const beam = ctx.createLinearGradient(bx, by, bx + Math.cos(sweep) * H * 0.6, by + Math.sin(sweep) * H * 0.6)
      beam.addColorStop(0, `rgba(0,255,136,${0.16 * power})`)
      beam.addColorStop(1, 'rgba(0,255,136,0)')
      ctx.fillStyle = beam
      ctx.beginPath()
      ctx.moveTo(bx, by)
      ctx.lineTo(bx + Math.cos(sweep - 0.12) * H * 0.7, by + Math.sin(sweep - 0.12) * H * 0.7)
      ctx.lineTo(bx + Math.cos(sweep + 0.12) * H * 0.7, by + Math.sin(sweep + 0.12) * H * 0.7)
      ctx.closePath()
      ctx.fill()
      ctx.globalCompositeOperation = 'source-over'

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      drawTile(midT, camX * 0.45, power)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // horizon haze
      const haze = ctx.createLinearGradient(0, groundY - 0.25 * H, 0, groundY)
      haze.addColorStop(0, 'rgba(0,255,136,0)')
      haze.addColorStop(1, `rgba(0,255,136,${0.05 * power})`)
      ctx.fillStyle = haze
      ctx.fillRect(0, groundY - 0.25 * H, W, 0.25 * H)

      // street: pavement + road with moving lane dashes
      ctx.fillStyle = '#0B1511'
      ctx.fillRect(0, groundY - 0.012 * H, W, 0.06 * H)
      ctx.fillStyle = '#070C0A'
      ctx.fillRect(0, groundY + 0.048 * H, W, H)
      ctx.fillStyle = `rgba(0,255,136,${0.15 + 0.35 * power})`
      ctx.fillRect(0, groundY - 0.012 * H, W, Math.max(1, u))
      ctx.fillStyle = `rgba(0,240,255,${0.12 + 0.2 * power})`
      const dash = 60 * u
      for (let x = -((camX * 1.3) % (dash * 2)); x < W; x += dash * 2) ctx.fillRect(x, groundY + 0.085 * H, dash, Math.max(1, 1.5 * u))

      // street lamps + holo kiosks (back edge of the pavement)
      const spacing = 380 * u
      for (let k = Math.floor(camX / spacing) - 1; k * spacing - camX < W + spacing; k++) {
        const x = k * spacing - camX + spacing * 0.5
        const base = groundY - 0.01 * H
        const top = base - 0.42 * H * CHAR_SCALE
        ctx.strokeStyle = '#16231D'
        ctx.lineWidth = 4 * u
        ctx.beginPath()
        ctx.moveTo(x, base)
        ctx.lineTo(x, top)
        ctx.lineTo(x + 26 * u, top - 6 * u)
        ctx.stroke()
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 0.25 + 0.75 * power
        ctx.fillStyle = MINT
        ctx.fillRect(x + 14 * u, top - 4 * u, 22 * u, 3 * u)
        const lg = 110 * u
        ctx.drawImage(lampGlow, x + 25 * u - lg / 2, top - lg / 2, lg, lg)
        ctx.globalAlpha = 0.6 * power
        ctx.drawImage(pool, x + 25 * u - 140 * u, base - 18 * u, 280 * u, 40 * u)
        ctx.globalAlpha = 1
        ctx.globalCompositeOperation = 'source-over'
        if (((k % 3) + 3) % 3 === 1) {
          // holographic info kiosk
          const kx = x + spacing * 0.5
          const kh = 0.16 * H * CHAR_SCALE
          ctx.fillStyle = `rgba(0,240,255,${0.06 + 0.08 * power})`
          ctx.fillRect(kx - 18 * u, base - kh, 36 * u, kh)
          ctx.strokeStyle = `rgba(0,240,255,${0.25 + 0.35 * power})`
          ctx.lineWidth = 1
          ctx.strokeRect(kx - 18 * u, base - kh, 36 * u, kh)
          ctx.fillStyle = `rgba(0,240,255,${(0.3 + 0.4 * power) * (0.8 + 0.2 * Math.sin(t * 7 + k))})`
          for (let i = 1; i < 6; i++) ctx.fillRect(kx - 12 * u, base - kh + i * kh * 0.15, 24 * u * (0.5 + 0.5 * ((i * 37 + k) % 5) / 4), 2 * u)
        }
      }

      // characters: back lane first, then the hero's lane by x
      const hx = heroX()
      const drawNPC = (n) => {
        const sx = n.wx - camX
        const pose = n.state === 'greet' ? wavePose(t + 0.4) : walkPose(n.phase, n.f)
        const lt = n.laneT
        drawFigure(ctx, n.f, sx, groundY - 0.022 * H * CHAR_SCALE * lt, H, n.dir, pose, t, {
          glows,
          power,
          scale: 1 - 0.14 * lt,
          alpha: 1 - 0.3 * lt,
          nod: n.nod ? Math.sin((1 - n.nod) * Math.PI) * 0.25 : 0,
          flash: n.state === 'greet' && n.f.kind === 'robot',
        })
      }
      npcs.filter((n) => n.laneT >= 0.5).forEach(drawNPC)
      const front = npcs.filter((n) => n.laneT < 0.5)
      const heroDrawn = { x: hx }
      ;[...front, heroDrawn].sort((a, b) => (a === heroDrawn ? hx : a.wx - camX) - (b === heroDrawn ? hx : b.wx - camX)).forEach((item) => {
        if (item !== heroDrawn) return drawNPC(item)
        const pose = hero.state === 'walk' ? walkPose(hero.phase, TYPES.hero) : wavePose(t)
        drawFigure(ctx, TYPES.hero, hx, groundY, H, 1, pose, t, {
          glows,
          power: 0.25 + 0.75 * power,
          nod: hero.nod ? Math.sin((1 - hero.nod) * Math.PI) * 0.2 : 0,
          flash: hero.state !== 'walk',
        })
      })

      // holographic greeting bubbles
      ctx.font = `${Math.max(10, 13 * u)}px "Share Tech Mono", ui-monospace, monospace`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const b of bubbles) {
        const bx = b.wx - camX
        const by = groundY - TYPES.hero.h * H * CHAR_SCALE * 1.12 - (2.2 - b.life) * 10 * u
        const a = Math.min(1, b.life / 0.4, (2.2 - b.life) / 0.25)
        const tw = ctx.measureText(b.text).width + 22 * u
        ctx.globalAlpha = a
        ctx.fillStyle = 'rgba(10,15,13,0.7)'
        ctx.fillRect(bx - tw / 2, by - 12 * u, tw, 24 * u)
        ctx.strokeStyle = CYAN
        ctx.lineWidth = 1
        ctx.strokeRect(bx - tw / 2, by - 12 * u, tw, 24 * u)
        ctx.fillStyle = CYAN
        ctx.fillText(b.text, bx, by + 0.5)
        ctx.globalAlpha = 1
      }
    }

    const loop = (now) => {
      raf = requestAnimationFrame(loop)
      const elapsed = now - last
      if (elapsed < 1000 / FPS - 1) return
      last = now - (elapsed % (1000 / FPS))
      const dt = Math.min(elapsed / 1000, 0.05)
      update(dt)
      draw()
    }
    const start = () => {
      if (raf || reducedMotion || !enabled || !visible || document.hidden) return
      last = performance.now()
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    // click / tap → the android waves at you
    const onDown = () => {
      if (!raf || hero.state !== 'walk') return
      hero.state = 'greet'
      hero.timer = 1.6
      bubbles.push({ wx: camX + heroX(), text: 'HELLO, VISITOR', life: 1.6 })
    }
    window.addEventListener('click', onDown, { passive: true }) // 'click' doesn't fire for scroll swipes

    build()
    document.fonts?.ready.then(() => canvas.isConnected && build(true)) // re-render signs in the web font

    let resizeTimer = 0
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(build, 150)
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) start()
      else stop()
    })
    io.observe(canvas)
    const onVisibility = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVisibility)
    controlsRef.current = {
      setEnabled(value) {
        enabled = value
        if (enabled) start()
        else stop()
      },
    }
    start()

    return () => {
      controlsRef.current = null
      stop()
      clearTimeout(resizeTimer)
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('click', onDown)
    }
  }, [])

  useEffect(() => {
    activeRef.current = active
    controlsRef.current?.setEnabled(active)
  }, [active])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />
}
