import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6'
import { profile } from '../../data/profile'

const links = [
  { href: profile.socials.github, label: 'GitHub', Icon: FaGithub },
  { href: profile.socials.linkedin, label: 'LinkedIn', Icon: FaLinkedin },
  { href: profile.socials.instagram, label: 'Instagram', Icon: FaInstagram },
  { href: `mailto:${profile.email}`, label: 'Email', Icon: FaEnvelope },
]

export default function SocialLinks({ size = 18, className = '' }) {
  return (
    <ul className={`flex items-center gap-3 ${className}`}>
      {links.map(({ href, label, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target={href.startsWith('mailto') ? undefined : '_blank'}
            rel="noreferrer"
            aria-label={label}
            className="grid h-11 w-11 place-items-center rounded-full border border-fg/20 text-fg transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-fg hover:shadow-[0_0_16px_rgb(0_240_255/0.6)]"
          >
            <Icon size={size} />
          </a>
        </li>
      ))}
    </ul>
  )
}
