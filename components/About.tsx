import { motion } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { siteConfig } from '../config/site.config'

const skills = [
  'Brand Strategy',
  'Logo Design',
  'Content Creation',
  'Social Media Marketing',
  'Graphic Design',
  'Campaign Strategy',
]

const values = [
  { title: 'Strategy first', description: 'Every pixel and post ladders up to a clear goal.' },
  { title: 'Craft obsessed', description: 'Premium design details that make brands feel expensive.' },
  { title: 'Results driven', description: 'We measure what matters and optimize relentlessly.' },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">About {siteConfig.shortName}</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-ink md:text-5xl">
            Creative thinking, meaningful results
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/60">
            We're passionate about building brands that resonate. Combining marketing, content
            creation, and graphic design, we help businesses stand out in a crowded market and
            connect with the people who matter most.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/60">
            Our approach blends strategic thinking with creative execution — whether we're shaping a
            brand identity, running a campaign, or producing content that stops the scroll.
          </p>

          <div className="mt-8 space-y-4">
            {values.map((value) => (
              <div key={value.title} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-brand/15 text-brand">
                  <FiCheck size={14} />
                </span>
                <div>
                  <div className="font-semibold text-ink">{value.title}</div>
                  <div className="text-ink/60">{value.description}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-black/5 bg-white p-8 shadow-card"
        >
          <h3 className="font-heading text-2xl font-bold text-ink">Skills &amp; expertise</h3>
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true }}
                className="rounded-2xl border-l-4 border-brand bg-cream px-4 py-3.5 font-semibold text-ink"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
