import { useId, useRef } from 'react'
import ElectricBorder from '../reactbits/ElectricBorder'
import { useElectricNoise } from '../../hooks/useElectricNoise'

// Angular, chamfered "S" — drawn as a single stroked path
const S_PATH = 'M136 62 H80 L64 78 V92 L76 100 H124 L136 108 V122 L120 138 H64'
const HEX = '100,22 167.5,61 167.5,139 100,178 32.5,139 32.5,61'
const HEX_POINTS = HEX.split(' ').map((p) => p.split(','))
const SPARK_SIZE = { width: 200, height: 200 } // viewBox units
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/**
 * Futuristic "S" emblem wrapped in an ElectricBorder.
 * `progress` (0–1) drives the power-up during boot; 1 = fully charged.
 * Only cheap properties (opacity, stroke-dashoffset) change with progress —
 * the electric filters themselves stay constant.
 */
/** `compact` tones the electric crackle down for small sizes (e.g. the header). */
export default function ElectricLogo({ progress = 1, compact = false, className = '' }) {
  const uid = useId().replace(/:/g, '')
  const id = (n) => `${uid}-${n}`
  const svgRef = useRef(null)

  const draw = clamp01(progress / 0.65) // S + hex draw in
  const charge = clamp01((progress - 0.35) / 0.5) // electricity ramps up

  useElectricNoise(svgRef, svgRef, { duration: 2.5, fps: 20, size: SPARK_SIZE })

  return (
    <div className={`relative aspect-square w-full ${className}`}>
      {/* ambient glow — radial gradient, no blur filter */}
      <div
        className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgb(0_240_255/0.35),rgb(0_240_255/0.08)_45%,transparent_70%)]"
        style={{ opacity: 0.2 + charge * 0.8 }}
        aria-hidden="true"
      />

      {/* outer HUD rings (transform-only animation → compositor) */}
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slower absolute inset-0 h-full w-full will-change-transform"
        aria-hidden="true"
        style={{ opacity: 0.25 + draw * 0.75 }}
      >
        <circle cx="100" cy="100" r="98" fill="none" stroke="#ECFDF5" strokeOpacity="0.3" strokeWidth="0.5" strokeDasharray="1.5 4" />
        <circle cx="100" cy="2" r="2" fill="#7DFFC4" />
        <circle cx="198" cy="100" r="1.4" fill="#00F0FF" />
      </svg>
      <svg
        viewBox="0 0 200 200"
        className="animate-spin-slow absolute inset-[4%] h-[92%] w-[92%] will-change-transform"
        aria-hidden="true"
        style={{ opacity: draw }}
      >
        <circle cx="100" cy="100" r="96" fill="none" stroke="#00FF88" strokeOpacity="0.7" strokeWidth="0.8" strokeDasharray="50 30 8 30" strokeLinecap="round" />
      </svg>

      {/* electric ring — fixed speed/chaos, boot only fades it in */}
      <div className="absolute inset-[13%] rounded-full bg-[radial-gradient(circle,rgb(19_28_24/0.85),rgb(10_15_13/0.95)_70%)]" />
      {charge > 0 && (
        <ElectricBorder color="#00F0FF" speed={1} chaos={compact ? 0.12 : 0.5} thickness={compact ? 1.5 : 2} className="absolute inset-[13%] rounded-full" style={{ opacity: charge }}>
          <div className="h-full w-full rounded-full" />
        </ElectricBorder>
      )}

      {/* the S emblem */}
      <svg ref={svgRef} viewBox="0 0 200 200" className="absolute inset-[13%] h-[74%] w-[74%] overflow-visible" role="img" aria-label="Sriramasivam Thirumalaivasan logo">
        <defs>
          <linearGradient id={id('gold')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#D1FFE9" />
            <stop offset="0.22" stopColor="#00FF88" />
            <stop offset="0.42" stopColor="#D1FFE9" />
            <stop offset="0.62" stopColor="#00C46A" />
            <stop offset="0.82" stopColor="#7DFFC4" />
            <stop offset="1" stopColor="#00A85A" />
          </linearGradient>
          <linearGradient id={id('silver')} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ECFDF5" />
            <stop offset="1" stopColor="#94A3B8" />
          </linearGradient>
          {/* Region = the whole 200×200 logo box, matching SPARK_SIZE (how far the noise travels).
              Each axis has a pair of offsets (one entering as the other leaves) so there is
              always noise under the S — a single offset slides out of the region and goes blank. */}
          <filter
            id={id('spark')}
            filterUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="200"
            height="200"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="3" seed="3" result="ny" />
            <feOffset in="ny" result="oy1" data-axis="y" data-start="1" />
            <feOffset in="ny" result="oy2" data-axis="y" data-start="0" />
            <feTurbulence type="turbulence" baseFrequency="0.035" numOctaves="3" seed="7" result="nx" />
            <feOffset in="nx" result="ox1" data-axis="x" data-start="1" />
            <feOffset in="nx" result="ox2" data-axis="x" data-start="0" />
            <feComposite in="oy1" in2="oy2" result="ny2" />
            <feComposite in="ox1" in2="ox2" result="nx2" />
            <feBlend in="ny2" in2="nx2" mode="color-dodge" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="9" xChannelSelector="R" yChannelSelector="B" />
          </filter>
        </defs>

        {/* hexagon frame + vertex nodes */}
        <polygon
          points={HEX}
          fill="none"
          stroke={`url(#${id('silver')})`}
          strokeWidth="1.2"
          strokeOpacity="0.7"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
        <g opacity={draw}>
          {HEX_POINTS.map(([x, y]) => (
            <g key={`${x}-${y}`}>
              <circle cx={x} cy={y} r="5" fill="#00F0FF" opacity="0.25" />
              <circle cx={x} cy={y} r="2.2" fill="#7DF9FF" />
            </g>
          ))}
        </g>

        {/* soft halo behind the S (wide translucent stroke instead of a blur filter) */}
        <path d={S_PATH} fill="none" stroke="#7DFFC4" strokeOpacity={0.18 * draw} strokeWidth="30" strokeLinejoin="round" />

        {/* mint body (draws in) + dark groove */}
        <path
          d={S_PATH}
          fill="none"
          stroke={`url(#${id('gold')})`}
          strokeWidth="17"
          strokeLinejoin="miter"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />
        <path
          d={S_PATH}
          fill="none"
          stroke="#0A0F0D"
          strokeWidth="5"
          strokeLinejoin="miter"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - draw}
        />

        {/* energy pulse travelling through the groove + electric crackle */}
        {charge > 0 && <g opacity={charge}>
          <path d={S_PATH} fill="none" stroke="#00F0FF" strokeOpacity="0.45" strokeWidth="6" strokeLinecap="round" pathLength="1" strokeDasharray="0.12 0.88" className="animate-energy" />
          <path d={S_PATH} fill="none" stroke="#E6FFF4" strokeWidth="2" strokeLinecap="round" pathLength="1" strokeDasharray="0.12 0.88" className="animate-energy" />
          <path d={S_PATH} fill="none" stroke="#00F0FF" strokeWidth="1.6" strokeLinejoin="miter" filter={`url(#${id('spark')})`} opacity="0.75" />
        </g>}

        {/* terminal caps */}
        <g opacity={draw}>
          <rect x="137" y="54" width="9" height="16" fill="#00F0FF" opacity="0.25" />
          <rect x="139" y="56" width="5" height="12" fill="#7DF9FF" />
          <rect x="54" y="130" width="9" height="16" fill="#00F0FF" opacity="0.25" />
          <rect x="56" y="132" width="5" height="12" fill="#7DF9FF" />
        </g>
      </svg>
    </div>
  )
}
