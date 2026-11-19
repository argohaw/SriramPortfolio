import { FaArrowUpRightFromSquare, FaGithub } from 'react-icons/fa6'
import { projects } from '../../data/projects'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import { BadgeList } from '../ui/Badge'

function ProjectCard({ project, index, hidden }) {
  return (
    <article
      className="glass glass-solid group relative mr-6 flex w-72 shrink-0 flex-col rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:glow-accent sm:w-80"
      aria-hidden={hidden || undefined}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="mb-4 flex items-center justify-between">
        <span className="font-display text-xs tracking-[0.3em] text-accent-soft">
          #{String(index + 1).padStart(2, '0')}
        </span>
        <a
          href={project.link}
          target="_blank"
          rel="noreferrer"
          tabIndex={hidden ? -1 : undefined}
          aria-label={`Open ${project.name}`}
          className="text-muted transition hover:text-primary"
        >
          {project.link?.includes('github') ? <FaGithub /> : <FaArrowUpRightFromSquare size={14} />}
        </a>
      </div>
      <h3 className="font-display text-lg font-bold text-fg transition group-hover:text-primary">{project.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
      <BadgeList items={project.stack} max={5} className="mt-5" />
    </article>
  )
}

function MarqueeRow({ items, offset, reverse, duration }) {
  return (
    <div className="marquee-mask overflow-hidden py-3">
      <div
        className={`marquee-track flex w-max hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'}`}
        style={{ '--marquee-duration': `${duration}s` }}
      >
        {[false, true].map((hidden) => (
          <div key={String(hidden)} className={`flex ${hidden ? 'motion-reduce:hidden' : ''}`} inert={hidden || undefined}>
            {items.map((project, i) => (
              <ProjectCard key={project.name} project={project} index={offset + i} hidden={hidden} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Projects() {
  const half = Math.ceil(projects.length / 2)
  const rowA = projects.slice(0, half)
  const rowB = projects.slice(half)

  return (
    <Section id="projects">
      <SectionHeading
        eyebrow="Things I've built"
        title="Projects"
        subtitle={`${projects.length} projects in motion — hover to pause and explore.`}
      />
      <div className="glass relative overflow-hidden rounded-3xl py-6">
        <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="relative space-y-2">
          <MarqueeRow items={rowA} offset={0} duration={55} />
          <MarqueeRow items={rowB} offset={half} duration={50} reverse />
        </div>
      </div>
    </Section>
  )
}
