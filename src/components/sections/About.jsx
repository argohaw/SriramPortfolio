import { FaLocationDot } from 'react-icons/fa6'
import { profile } from '../../data/profile'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { BadgeList } from '../ui/Badge'

const stats = [
  { value: '5+', label: 'Years Experience' },
  { value: '13', label: 'Projects Built' },
  { value: '10+', label: 'Awards & Talks' },
]

export default function About() {
  return (
    <Section id="about">
      <SectionHeading eyebrow="Who I am" title="About Me" />
      <Card className="grid items-center gap-10 p-6 sm:p-10 md:grid-cols-[2fr_3fr]">
        <div className="relative mx-auto w-full max-w-xs">
          <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-primary via-transparent to-accent opacity-70 blur-lg" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-3xl border border-primary/50 bg-surface">
            <img
              src={profile.photo}
              alt={`Portrait of ${profile.name}`}
              className="aspect-[5/6] w-full object-cover object-top"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
          </div>
          {/* HUD corners */}
          <span className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-accent" aria-hidden="true" />
          <span className="absolute -right-2 -bottom-2 h-6 w-6 border-r-2 border-b-2 border-accent" aria-hidden="true" />
        </div>

        <div>
          <h3 className="font-display text-2xl font-bold text-primary">
            Engineer. Builder. <span className="text-accent-soft">Explorer.</span>
          </h3>
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <FaLocationDot className="text-accent-soft" /> {profile.location}
          </p>
          {profile.about.map((para) => (
            <p key={para.slice(0, 20)} className="mt-4 leading-relaxed text-fg">
              {para}
            </p>
          ))}

          <h4 className="mt-8 mb-3 font-display text-xs tracking-[0.3em] text-muted uppercase">Core Tech Stack</h4>
          <BadgeList items={profile.coreStack} max={5} variant="gold" />

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-fg/10 pt-6">
            {stats.map(({ value, label }) => (
              <div key={label} className="flex flex-col-reverse">
                {/* visual order: value then label; DOM order (dt before dd) keeps the term/description pairing */}
                <dt className="mt-1 text-xs text-muted">{label}</dt>
                <dd className="text-gradient font-display text-2xl font-bold sm:text-3xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Card>
    </Section>
  )
}
