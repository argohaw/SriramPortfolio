import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { FaArrowRight, FaCalendar, FaLocationDot } from 'react-icons/fa6'
import { experience } from '../../data/experience'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import Modal from '../ui/Modal'
import CompanyLogo from '../ui/CompanyLogo'
import { BadgeList } from '../ui/Badge'

function ExperienceCard({ item, index, onSelect }) {
  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Card
        role="button"
        tabIndex={0}
        interactive
        onClick={() => onSelect(item)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSelect(item)
          }
        }}
        aria-haspopup="dialog"
        aria-label={`${item.role} at ${item.company}, ${item.duration}. View details`}
        className="group flex h-full w-full cursor-pointer flex-col text-left"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <CompanyLogo logo={item.logo} company={item.company} />
          <span className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-[0.7rem] text-primary">
            <FaCalendar size={10} /> {item.duration}
          </span>
        </div>
        <h3 className="font-display text-lg font-bold text-fg">{item.role}</h3>
        <p className="mt-1 font-medium text-primary">{item.company}</p>

        <ul className="mt-4 flex-1 space-y-2 text-sm text-fg">
          {item.highlights.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>

        <BadgeList items={item.stack} max={5} className="mt-5" />

        <span className="mt-5 inline-flex items-center gap-2 font-display text-[0.7rem] tracking-[0.2em] text-accent-soft uppercase transition group-hover:gap-3">
          View details <FaArrowRight />
        </span>
      </Card>
    </motion.div>
  )
}

export default function Experience() {
  const [selected, setSelected] = useState(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <Section id="experience">
      <SectionHeading eyebrow="Where I've worked" title="Experience" subtitle="Click on a card to explore the role in detail." />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {experience.map((item, i) => (
          <ExperienceCard key={item.id} item={item} index={i} onSelect={setSelected} />
        ))}
      </div>

      <Modal open={!!selected} onClose={close} labelledBy="experience-modal-title">
        {selected && (
          <>
            <p className="font-display text-xs tracking-[0.3em] text-accent-soft uppercase">Experience</p>
            <h3 id="experience-modal-title" className="text-gradient mt-2 pr-10 font-display text-2xl font-bold sm:text-3xl">
              {selected.role}
            </h3>
            <div className="mt-3 flex items-center gap-3">
              <CompanyLogo logo={selected.logo} company={selected.company} size="lg" />
              <p className="text-lg font-medium text-primary">{selected.company}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1.5"><FaCalendar className="text-accent-soft" /> {selected.duration}</span>
              <span className="flex items-center gap-1.5"><FaLocationDot className="text-accent-soft" /> {selected.location}</span>
            </div>

            <p className="mt-6 leading-relaxed text-fg">{selected.description}</p>

            <h4 className="mt-6 mb-3 font-display text-xs tracking-[0.3em] text-muted uppercase">Key Contributions</h4>
            <ul className="space-y-2.5 text-fg">
              {[...selected.highlights, ...selected.details].map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" aria-hidden="true" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <h4 className="mt-6 mb-3 font-display text-xs tracking-[0.3em] text-muted uppercase">Tech Stack</h4>
            <BadgeList items={selected.stack} variant="gold" />
          </>
        )}
      </Modal>
    </Section>
  )
}
