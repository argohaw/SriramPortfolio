import { motion } from 'framer-motion'
import { FaBook, FaMicrophone, FaScrewdriverWrench, FaTrophy } from 'react-icons/fa6'
import { achievements } from '../../data/achievements'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'

const icons = { book: FaBook, mic: FaMicrophone, trophy: FaTrophy, tool: FaScrewdriverWrench }

export default function Achievements() {
  return (
    <Section id="achievements">
      <SectionHeading eyebrow="Milestones" title="Achievements" />
      <div className="grid gap-6 md:grid-cols-2">
        {achievements.map(({ category, icon, items }, i) => {
          const Icon = icons[icon] ?? FaTrophy
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Card interactive className="group h-full">
                <div
                  className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition group-hover:bg-accent/25"
                  aria-hidden="true"
                />
                <div className="mb-5 flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-xl border border-accent/50 bg-accent/10 text-xl text-accent-soft shadow-[0_0_16px_rgb(0_240_255/0.3)]">
                    <Icon />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-primary">{category}</h3>
                    <p className="text-xs text-muted">{items.length} highlights</p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm text-fg">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
