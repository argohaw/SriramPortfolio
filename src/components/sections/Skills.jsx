import { motion } from 'framer-motion'
import { FaCloud, FaCode, FaDatabase, FaLayerGroup, FaScrewdriverWrench, FaServer } from 'react-icons/fa6'
import { skills } from '../../data/skills'
import Section from '../layout/Section'
import SectionHeading from '../ui/SectionHeading'
import Card from '../ui/Card'
import { BadgeList } from '../ui/Badge'

const icons = {
  code: FaCode,
  layout: FaLayerGroup,
  server: FaServer,
  database: FaDatabase,
  cloud: FaCloud,
  tool: FaScrewdriverWrench,
}

export default function Skills() {
  return (
    <Section id="skills">
      <SectionHeading eyebrow="What I work with" title="Skills" subtitle="A toolkit grouped by category." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map(({ category, icon, items }, i) => {
          const Icon = icons[icon] ?? FaCode
          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card interactive className="h-full">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
                    <Icon />
                  </span>
                  <h3 className="font-display text-base font-bold tracking-wide text-fg">{category}</h3>
                </div>
                <BadgeList items={items} />
              </Card>
            </motion.div>
          )
        })}
      </div>
    </Section>
  )
}
