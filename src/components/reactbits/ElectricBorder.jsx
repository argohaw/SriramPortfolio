/*
 * ElectricBorder — recreation of the React Bits "Electric Border" animation
 * (https://reactbits.dev/animations/electric-border). Written without access
 * to the original source. An SVG turbulence + displacement filter makes a CSS
 * border crackle like electricity.
 *
 * Performance notes (vs. the original approach):
 *  - noise offsets are driven from JS at ~20 fps instead of SMIL at display rate
 *  - 4 noise octaves instead of 10 (higher octaves are sub-pixel at this scale)
 *  - filter region is 140% of the element instead of 500%
 *  - `speed` / `chaos` should be static props; animate `style.opacity` instead
 */
import { Fragment, useId, useRef } from 'react'
import { useElectricNoise } from '../../hooks/useElectricNoise'

const NOISE = [
  { seed: 1, axis: 'y', start: 1 },
  { seed: 1, axis: 'y', start: 0 },
  { seed: 2, axis: 'x', start: 1 },
  { seed: 2, axis: 'x', start: 0 },
]

export default function ElectricBorder({
  children,
  color = '#00F0FF',
  speed = 1,
  chaos = 1,
  thickness = 2,
  className = '',
  style,
}) {
  const filterId = `electric-displace-${useId().replace(/:/g, '')}`
  const svgRef = useRef(null)
  const rootRef = useRef(null)

  useElectricNoise(svgRef, rootRef, { duration: 6 / (speed || 1) })

  return (
    <div
      ref={rootRef}
      className={`electric-border ${className}`}
      style={{ '--electric-border-color': color, '--eb-border-width': `${thickness}px`, ...style }}
    >
      <svg ref={svgRef} className="eb-svg" aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId} colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
            {NOISE.map(({ seed, axis, start }, i) => (
              <Fragment key={i}>
                <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="4" seed={seed} result={`noise${i}`} />
                <feOffset in={`noise${i}`} dx="0" dy="0" result={`offset${i}`} data-axis={axis} data-start={start} />
              </Fragment>
            ))}
            <feComposite in="offset0" in2="offset1" result="part1" />
            <feComposite in="offset2" in2="offset3" result="part2" />
            <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="combinedNoise"
              scale={30 * (chaos || 1)}
              xChannelSelector="R"
              yChannelSelector="B"
            />
          </filter>
        </defs>
      </svg>

      <div className="eb-layers" aria-hidden="true">
        <div className="eb-stroke" style={{ filter: `url(#${filterId})` }} />
        <div className="eb-glow-1" />
        <div className="eb-glow-2" />
        <div className="eb-background-glow" />
      </div>
      <div className="eb-content">{children}</div>
    </div>
  )
}
