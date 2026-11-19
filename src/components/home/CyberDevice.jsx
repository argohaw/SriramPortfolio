import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

/*
 * Original cyberpunk-style handheld: rugged, chamfered gunmetal chassis with
 * hazard markings, exposed screws, vents, status LEDs and a glitching HUD screen.
 * `variant` = 'tablet' (landscape deck) | 'phone' (portrait handset).
 *
 * Performance: only transform/opacity animate; the only filter (outer glow)
 * is on a static element that never repaints.
 */

const CHASSIS_CUT_PX = {
  tablet: { tl: 46, tr: 14, br: 46, bl: 14 },
  phone: { tl: 30, tr: 10, br: 30, bl: 10 },
}
/** Screen corner cuts in px — exported so the zoom transition can clip to the exact screen shape. */
export const SCREEN_CUT_PX = {
  tablet: { tl: 28, tr: 8, br: 28, bl: 8 },
  phone: { tl: 18, tr: 6, br: 18, bl: 6 },
}
const toCutVars = ({ tl, tr, br, bl }) => ({ '--cut-tl': `${tl}px`, '--cut-tr': `${tr}px`, '--cut-br': `${br}px`, '--cut-bl': `${bl}px` })
const CHASSIS_CUTS = { tablet: toCutVars(CHASSIS_CUT_PX.tablet), phone: toCutVars(CHASSIS_CUT_PX.phone) }
const SCREEN_CUTS = { tablet: toCutVars(SCREEN_CUT_PX.tablet), phone: toCutVars(SCREEN_CUT_PX.phone) }
// Screen heights leave room for the header gap, bezels and padding around the device so the
// whole device fits the viewport. Content taller than this simply grows the screen (min-h).
const SCREEN_MIN_H = {
  tablet: 'min-h-[max(24rem,calc(100svh-20rem))] short:min-h-[max(22rem,calc(100svh-13rem))]',
  phone: 'min-h-[max(26rem,calc(100svh-15rem))] shorter:min-h-[max(22rem,calc(100svh-12rem))]',
}
// `fit` mode: the screen exactly fits the viewport and its content scrolls inside it
// Floors are low on purpose: the pinned scene adds ~16rem (tablet) / ~14rem (phone) around the screen
// (header gap, bezels, padding, footer line), so a tall floor would push the screen off short viewports.
const SCREEN_FIT_H = {
  tablet: 'h-[max(14rem,calc(100svh-20rem))] short:h-[max(14rem,calc(100svh-15rem))]',
  phone: 'h-[max(10rem,calc(100svh-14rem))]',
}

/*
 * Translucent screen: everything drawn *behind* the screen (chassis edge, gunmetal
 * body, outer glow, screen edge) is clipped to a frame with a screen-shaped hole,
 * so the scene behind the device shows through the glass. These numbers must match
 * the layout below: body padding (p-4 / p-2.5) and bezel heights (h-8/h-9, h-7/h-8).
 */
const EDGE = 2 // chassis edge ring width (p-[2px])
const BODY_PAD = { tablet: 16, phone: 10 }
const BEZEL_H = { tablet: { top: 32, bottom: 36 }, phone: { top: 28, bottom: 32 } }
const GLOW_INSET = 8 // the outer glow box extends 8px (-inset-2) beyond the chassis

const fromL = (n) => `${n}px`
const fromR = (n) => `calc(100% - ${n}px)`
const NO_CUTS = { tl: 0, tr: 0, br: 0, bl: 0 }
/** Corner points of a cut-corner rectangle, inset from each side of its box. */
function chamferPoints({ tl, tr, br, bl }, i = { l: 0, t: 0, r: 0, b: 0 }) {
  return [
    `${fromL(i.l + tl)} ${fromL(i.t)}`,
    `${fromR(i.r + tr)} ${fromL(i.t)}`,
    `${fromR(i.r)} ${fromL(i.t + tr)}`,
    `${fromR(i.r)} ${fromR(i.b + br)}`,
    `${fromR(i.r + br)} ${fromR(i.b)}`,
    `${fromL(i.l + bl)} ${fromR(i.b)}`,
    `${fromL(i.l)} ${fromR(i.b + bl)}`,
    `${fromL(i.l)} ${fromL(i.t + tl)}`,
  ]
}
// offsetting a 45° cut inwards by w shrinks it by w·(√2 − 1)
const shrinkCuts = (cuts, w) => Object.fromEntries(Object.entries(cuts).map(([k, v]) => [k, Math.max(0, v - w * 0.414)]))
const polygonWithHole = (outer, hole) => `polygon(evenodd, ${[...outer, outer[0], ...hole, hole[0]].join(', ')})`
const ring = (cuts, w) => polygonWithHole(chamferPoints(cuts), chamferPoints(shrinkCuts(cuts, w), { l: w, t: w, r: w, b: w }))
const screenHole = (variant, extra) => {
  const pad = BODY_PAD[variant] + extra + 1 // +1: hole edge sits under the 1px screen ring
  return polygonWithHole(
    chamferPoints(NO_CUTS),
    chamferPoints(shrinkCuts(SCREEN_CUT_PX[variant], 1), {
      l: pad,
      r: pad,
      t: pad + BEZEL_H[variant].top,
      b: pad + BEZEL_H[variant].bottom,
    }),
  )
}
const FRAME_CLIPS = Object.fromEntries(
  ['tablet', 'phone'].map((v) => [
    v,
    {
      chassisRing: ring(CHASSIS_CUT_PX[v], EDGE),
      body: screenHole(v, 0),
      glow: screenHole(v, GLOW_INSET + EDGE),
      screenRing: ring(SCREEN_CUT_PX[v], 1),
    },
  ]),
)
// pseudo-random but stable barcode bar widths
const BARCODE = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2]

function useClock() {
  const format = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const [time, setTime] = useState(format)
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 15000)
    return () => clearInterval(id)
  }, [])
  return time
}

/* ------------------------------- small parts ------------------------------- */
function Screw({ className = '' }) {
  return (
    <span
      className={`absolute z-10 grid h-3 w-3 place-items-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#ECFDF5,#3A4A44_70%)] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.6),0_1px_2px_rgb(0_0_0/0.8)] ${className}`}
      aria-hidden="true"
    >
      <span className="h-[1.5px] w-2 rotate-45 bg-black/70" />
    </span>
  )
}

function SignalBars() {
  return (
    <span className="flex items-end gap-[2px]">
      {[4, 6, 8, 10].map((h) => (
        <span key={h} className="w-[3px] bg-primary/90" style={{ height: h }} />
      ))}
    </span>
  )
}

function Battery({ online }) {
  return (
    <span className="relative flex h-3 w-7 items-center gap-[2px] border border-fg/60 p-[2px] after:absolute after:top-1/2 after:-right-[4px] after:h-1.5 after:w-[3px] after:-translate-y-1/2 after:bg-fg/60">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`h-full flex-1 ${online ? 'bg-primary' : i < 2 ? 'animate-blink bg-accent' : 'bg-fg/15'}`}
        />
      ))}
    </span>
  )
}

function StatusBar({ online, variant }) {
  const time = useClock()
  const tablet = variant === 'tablet'
  return (
    <div className="relative z-10 flex items-center justify-between gap-3 border-b border-primary/25 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 px-4 py-2 font-mono text-[0.68rem] tracking-[0.18em] text-muted uppercase sm:px-6">
      <span className="animate-glitch-shift flex items-center gap-2">
        <span
          className={`h-2 w-2 [clip-path:polygon(50%_0,100%_100%,0_100%)] ${online ? 'bg-primary' : 'animate-blink bg-accent'}`}
        />
        <span className={online ? 'text-primary' : 'text-accent-soft'}>SYS::{online ? 'ONLINE' : 'BOOT'}</span>
        {tablet && <span className="hidden text-muted/70 lg:inline">{'// NX-7 NEURAL DECK'}</span>}
      </span>
      <span className="text-fg">{time}</span>
      <span className="flex items-center gap-3" aria-hidden="true">
        {tablet && <span className="hidden md:inline">NET://LINK</span>}
        <SignalBars />
        <Battery online={online} />
      </span>
    </div>
  )
}

function Leds() {
  return (
    <span className="flex items-center gap-1.5" aria-hidden="true">
      <span className="animate-blink h-1.5 w-1.5 bg-accent shadow-[0_0_6px_var(--color-accent)]" />
      <span className="h-1.5 w-1.5 bg-primary shadow-[0_0_6px_var(--color-primary)]" />
      <span className="h-1.5 w-1.5 bg-fg/50" />
    </span>
  )
}

function CameraCluster({ compact }) {
  return (
    <span className="flex items-center gap-2" aria-hidden="true">
      <span className="relative grid h-3.5 w-3.5 place-items-center rounded-full bg-[#040806] ring-1 ring-fg/40">
        <span className="h-1.5 w-1.5 rounded-full bg-[radial-gradient(circle,#7DF9FF,#003D2A)] shadow-[0_0_6px_var(--color-accent)]" />
      </span>
      <span className={`h-1.5 rounded-full bg-[#040806] ring-1 ring-fg/25 ${compact ? 'w-14' : 'w-10'}`} />
    </span>
  )
}

function TopBezel({ variant }) {
  if (variant === 'phone') {
    return (
      <div className="relative flex h-7 items-center justify-between px-8 pb-1.5">
        <Leds />
        <CameraCluster compact />
        <span className="font-mono text-[0.55rem] tracking-[0.25em] text-muted/70">NX-7</span>
      </div>
    )
  }
  return (
    <div className="relative flex h-8 items-center justify-between pr-12 pb-2 pl-16">
      <span className="flex items-center gap-3">
        <span className="hazard-stripes cyber-clip h-3 w-14 [--cut-tl:5px] [--cut-br:5px]" aria-hidden="true" />
        <span className="font-mono text-[0.6rem] tracking-[0.3em] text-muted/80">NX-7 // NEURAL DECK</span>
      </span>
      <CameraCluster />
      <span className="flex items-center gap-3">
        <span className="hidden font-mono text-[0.6rem] tracking-[0.3em] text-primary/80 sm:inline">MK.II</span>
        <Leds />
      </span>
    </div>
  )
}

function BottomBezel({ variant }) {
  if (variant === 'phone') {
    return (
      <div className="relative flex h-8 items-center justify-between px-8 pt-2">
        <span className="h-2 w-10 bg-[repeating-linear-gradient(90deg,#040806_0_2px,transparent_2px_4px)]" aria-hidden="true" />
        <span className="h-1 w-20 rounded-full bg-muted/40" aria-hidden="true" />
        <span className="hazard-stripes cyber-clip h-2 w-8 [--cut-br:4px]" aria-hidden="true" />
      </div>
    )
  }
  return (
    <div className="relative flex h-9 items-center justify-between pt-2 pr-16 pl-12">
      <span className="h-3 w-24 bg-[repeating-linear-gradient(90deg,#040806_0_2px,transparent_2px_5px)]" aria-hidden="true" />
      <span className="hidden items-center gap-2 font-mono text-[0.58rem] tracking-[0.3em] text-muted/70 sm:flex">
        <span className="text-primary">⚠</span> HIGH VOLTAGE · SN ST-0412-SV
      </span>
      <span className="flex h-3 items-stretch gap-[1.5px]" aria-hidden="true">
        {BARCODE.map((w, i) => (
          <span key={i} className="bg-fg/60" style={{ width: w }} />
        ))}
      </span>
    </div>
  )
}

/* Hardware that sticks out of the chassis edge */
function SideHardware({ variant }) {
  const metal = 'bg-gradient-to-b from-fg to-muted/60'
  if (variant === 'phone') {
    return (
      <>
        <span className={`absolute top-[16%] -right-[5px] h-14 w-[5px] ${metal}`} aria-hidden="true" />
        <span className={`absolute top-[26%] -right-[5px] h-8 w-[5px] ${metal}`} aria-hidden="true" />
        <span className="absolute top-[20%] -left-[5px] h-10 w-[5px] bg-gradient-to-b from-primary to-primary/40" aria-hidden="true" />
      </>
    )
  }
  return (
    <>
      {/* ribbed grip */}
      <span
        className="cyber-clip absolute top-1/2 -left-3 hidden h-[45%] w-3 -translate-y-1/2 border-l-2 border-primary/70 bg-[repeating-linear-gradient(0deg,#21302A_0_3px,#08100C_3px_6px)] [--cut-tl:6px] [--cut-bl:6px] sm:block"
        aria-hidden="true"
      />
      <span className={`absolute top-[14%] -right-[6px] h-16 w-[6px] ${metal}`} aria-hidden="true" />
      <span className={`absolute top-[26%] -right-[6px] h-10 w-[6px] ${metal}`} aria-hidden="true" />
      <span className="absolute bottom-[18%] -right-[6px] h-8 w-[6px] bg-accent/70 shadow-[0_0_10px_var(--color-accent)]" aria-hidden="true" />
    </>
  )
}

/* --------------------------------- device ---------------------------------- */
export default function CyberDevice({ variant = 'tablet', online, screenRef, contentOpacity, fit = false, interactive = true, children }) {
  const phone = variant === 'phone'
  const chassisCuts = CHASSIS_CUTS[variant]
  const screenCuts = SCREEN_CUTS[variant]
  const frames = FRAME_CLIPS[variant]

  return (
    <motion.div
      key={variant}
      className={`relative mx-auto w-full ${phone ? 'max-w-[23.5rem] md:max-w-[26rem] lg:max-w-[28rem]' : ''}`}
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      style={{ transformPerspective: 1400 }}
    >
      {/* static outer glow (never repaints, so the blur is rendered once) */}
      <div className="pointer-events-none absolute -inset-2 opacity-60 blur-2xl will-change-transform" aria-hidden="true">
        <div className="cyber-clip h-full w-full" style={chassisCuts}>
          <div className="h-full w-full bg-gradient-to-br from-primary/45 via-ambient/25 to-accent/50" style={{ clipPath: frames.glow }} />
        </div>
      </div>

      <SideHardware variant={variant} />

      {/* chassis edge (a 2px ring) → gunmetal body (a frame around the glass) */}
      <div className="relative p-[2px]">
        <span
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary via-muted/40 to-accent"
          style={{ clipPath: frames.chassisRing }}
          aria-hidden="true"
        />
        <div className={`cyber-clip relative ${phone ? 'p-2.5' : 'p-4'}`} style={chassisCuts}>
          <span
            className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,rgb(255_255_255/0.025)_0_2px,transparent_2px_7px),linear-gradient(160deg,#17241E,#08100C_45%,#13201A)]"
            style={{ clipPath: frames.body }}
            aria-hidden="true"
          />
          {/* neon edge accents along the cut corners */}
          <span className="absolute top-0 left-[46px] h-[2px] w-24 bg-primary/80" aria-hidden="true" />
          <span className="absolute right-[46px] bottom-0 h-[2px] w-24 bg-accent/80" aria-hidden="true" />

          <Screw className={phone ? 'top-2 right-3' : 'top-3 right-5'} />
          <Screw className={phone ? 'top-6 left-2' : 'top-9 left-3'} />
          <Screw className={phone ? 'right-2 bottom-6' : 'right-3 bottom-9'} />
          <Screw className={phone ? 'bottom-2 left-3' : 'bottom-3 left-5'} />

          <TopBezel variant={variant} />

          {/* screen: neon edge → display */}
          <div ref={screenRef} className="relative p-px">
            <span
              className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent/80 via-accent/20 to-primary/70"
              style={{ clipPath: frames.screenRing }}
              aria-hidden="true"
            />
            {/* translucent glass: the scene behind the device shows through */}
            <div className="cyber-clip relative overflow-hidden bg-canvas/55" style={screenCuts}>
              <motion.div
                className={`relative flex flex-col ${fit ? SCREEN_FIT_H[variant] : SCREEN_MIN_H[variant]}`}
                initial={{ scaleX: 0, scaleY: 0.004 }}
                animate={{ scaleX: [0, 1, 1], scaleY: [0.004, 0.004, 1] }}
                transition={{ duration: 0.9, delay: 0.5, times: [0, 0.45, 1], ease: 'easeOut' }}
              >
                <motion.div
                  className="pointer-events-none absolute inset-0 z-20 bg-white"
                  initial={{ opacity: 0.9 }}
                  animate={{ opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  aria-hidden="true"
                />
                <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
                <StatusBar online={online} variant={variant} />
                <motion.div
                  className={`relative flex flex-1 items-stretch ${fit ? 'min-h-0 [scrollbar-width:thin]' : ''} ${
                    fit ? (interactive ? 'overflow-y-auto' : 'overflow-hidden') : ''
                  } ${interactive ? '' : 'pointer-events-none'}`}
                  style={contentOpacity ? { opacity: contentOpacity } : undefined}
                  inert={!interactive || undefined}
                >
                  {children}
                </motion.div>

                {/* HUD brackets */}
                <span className="pointer-events-none absolute top-12 left-4 h-5 w-5 border-t border-l border-primary/50" aria-hidden="true" />
                <span className="pointer-events-none absolute top-12 right-4 h-5 w-5 border-t border-r border-primary/50" aria-hidden="true" />
                <span className="pointer-events-none absolute bottom-4 left-4 h-5 w-5 border-b border-l border-primary/50" aria-hidden="true" />
                <span className="pointer-events-none absolute right-4 bottom-4 h-5 w-5 border-r border-b border-primary/50" aria-hidden="true" />

                {/* periodic glitch band (transform/opacity only) */}
                <div
                  className="animate-glitch-band pointer-events-none absolute inset-x-0 top-0 z-10 h-[10%] bg-[linear-gradient(transparent,rgb(0_240_255/0.22)_40%,rgb(0_255_136/0.12)_60%,transparent)]"
                  aria-hidden="true"
                />
              </motion.div>

              {/* scanlines + glass glare */}
              <div
                className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgb(255_255_255/0.025)_0_1px,transparent_1px_3px)]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.05),transparent_28%,transparent_70%,rgb(0_240_255/0.05))]"
                aria-hidden="true"
              />
            </div>
          </div>

          <BottomBezel variant={variant} />
        </div>
      </div>
    </motion.div>
  )
}
