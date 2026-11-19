import { profile } from '../../data/profile'
import SocialLinks from '../ui/SocialLinks'

/** `compact`: single copyright line (used inside the Contact device scene, which already shows the social links). */
export default function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="relative border-t border-primary/10 py-3 text-center text-xs text-muted">
        © {new Date().getFullYear()} <span className="text-primary">{profile.name}</span>. All rights reserved.
      </footer>
    )
  }
  return (
    <footer className="relative z-[3] border-t border-primary/15 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted sm:flex-row sm:px-8">
        <p>
          © {new Date().getFullYear()} <span className="text-primary">{profile.name}</span>. All rights reserved.
        </p>
        <SocialLinks />
      </div>
    </footer>
  )
}
