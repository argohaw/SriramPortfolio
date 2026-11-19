import { motion } from 'framer-motion'
import { FaAward, FaCalendar, FaGraduationCap } from 'react-icons/fa6'
import { education } from '../../data/education'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { BadgeList } from '../ui/Badge'

export default function Education() {
  return (
    <Section id="education">
      <SectionHeading eyebrow="Academic journey" title="Education" />
      <div className="relative mx-auto max-w-4xl">
        <span
          className="absolute top-2 bottom-2 left-3 w-px bg-gradient-to-b from-primary via-accent to-transparent sm:left-5"
          aria-hidden="true"
        />
        <ol className="relative space-y-10 pl-8 sm:pl-12">
          {education.map((edu, i) => (
            <motion.li
              key={edu.degree + edu.university}
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
            >
              <span
                className="absolute top-7 -left-[1.6rem] grid h-5 w-5 place-items-center rounded-full border-2 border-accent bg-canvas shadow-[0_0_12px_var(--color-accent)] sm:-left-[2.1rem]"
                aria-hidden="true"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              <Card interactive>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-xl text-primary">
                      <FaGraduationCap />
                    </span>
                    <div>
                      <p className="font-display text-[0.65rem] tracking-[0.3em] text-accent-soft uppercase">{edu.level}</p>
                      <h3 className="mt-1 font-display text-xl font-bold text-fg">{edu.major}</h3>
                      <p className="mt-1 text-primary">
                        {edu.degree} · <span className="text-fg">{edu.university}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
                    <span className="flex items-center gap-1.5 rounded-full border border-primary/30 px-3 py-1 text-primary">
                      <FaCalendar size={11} /> {edu.duration}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-accent-soft">
                      <FaAward size={12} /> {edu.marks}
                    </span>
                  </div>
                </div>
                <h4 className="mt-6 mb-3 font-display text-xs tracking-[0.3em] text-muted uppercase">Key Subjects</h4>
                <BadgeList items={edu.subjects} />
              </Card>
            </motion.li>
          ))}
        </ol>
      </div>
    </Section>
  )
}
