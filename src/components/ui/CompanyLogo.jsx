import { useState } from 'react'
import { FaBriefcase } from 'react-icons/fa6'

/**
 * Company logo tile. `logo.fit`:
 *  - 'cover'   → logo artwork fills the rounded tile (e.g. square brand marks)
 *  - 'contain' → transparent logo centred on a light tile so dark details stay visible
 * Falls back to a briefcase icon when there is no logo (or it fails to load).
 */
export default function CompanyLogo({ logo, company, size = 'md' }) {
  const [failed, setFailed] = useState(false)
  const dims = size === 'lg' ? 'h-14 w-14 rounded-2xl' : 'h-11 w-11 rounded-xl'

  if (!logo?.src || failed) {
    return (
      <span className={`grid shrink-0 place-items-center border border-accent/50 bg-accent/10 text-accent-soft ${dims}`} aria-hidden="true">
        <FaBriefcase />
      </span>
    )
  }

  const contain = logo.fit === 'contain'
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden ring-1 ring-primary/30 shadow-[0_0_14px_rgb(0_255_136/0.18)] ${dims} ${
        contain ? 'bg-fg p-1.5' : 'bg-surface-2'
      }`}
    >
      <img
        src={logo.src}
        alt={`${company} logo`}
        className={`h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  )
}
