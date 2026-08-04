import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const principles = [
  {
    title: 'Strategy first',
    body: 'Every decision ties back to a goal — not decoration for its own sake.',
  },
  {
    title: 'Craft obsessed',
    body: 'Clean details that make a brand feel considered and consistent.',
  },
  {
    title: 'Built to last',
    body: 'Work that reads on a sign, a screen, a truck, and a business card.',
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 section-ink-gold py-24 md:py-32">
      <div className="site-shell grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div>
          <p className="eyebrow !text-brand">About {siteConfig.shortName}</p>
          <AnimatedText
            as="h2"
            text="Local roots. Global reach."
            shimmer
            className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
          />
          <p className="mt-6 text-lg leading-relaxed text-white/70">
            We help ambitious businesses look professional and stay consistent — from the first logo
            sketch to finished signage and campaign rollout.
          </p>
        </div>

        <div className="space-y-4">
          {principles.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ y: 14 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              whileHover={{ x: 6, transition: { duration: 0.2 } }}
              className={`soft-panel border p-6 md:p-7 ${
                index === 1
                  ? 'border-brand/50 bg-brand text-ink'
                  : 'border-white/10 bg-white/5 text-white'
              }`}
            >
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <p className={`mt-2 ${index === 1 ? 'text-ink/70' : 'text-white/65'}`}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
