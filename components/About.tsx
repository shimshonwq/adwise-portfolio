import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const principles = [
  {
    title: 'Strategy first',
    body: 'Every decision ties back to a goal — not decoration for its own sake.',
    tone: 'ink' as const,
  },
  {
    title: 'Craft obsessed',
    body: 'Clean details that make a brand feel considered and consistent.',
    tone: 'gold' as const,
  },
  {
    title: 'Built to last',
    body: 'Work that reads on a sign, a screen, a truck, and a business card.',
    tone: 'paper' as const,
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 section-ink-gold py-20 md:py-32">
      <div className="site-shell grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-14">
        <div>
          <p className="eyebrow !text-brand">About {siteConfig.shortName}</p>
          <AnimatedText
            as="h2"
            text="Local roots. Global reach."
            shimmer
            className="mt-3 font-display text-[clamp(2rem,7vw,3.25rem)] font-bold tracking-tight"
          />
          <p className="mt-6 text-base leading-relaxed text-white/85 md:text-lg">
            We help ambitious businesses look professional and stay consistent — from the first logo
            sketch to finished signage and campaign rollout.
          </p>
          <p className="mt-4 font-serif text-xl italic text-brand md:text-2xl">Made to be noticed.</p>
        </div>

        <div className="space-y-4">
          {principles.map((item, index) => {
            const gold = item.tone === 'gold'
            const paper = item.tone === 'paper'
            return (
              <motion.div
                key={item.title}
                initial={{ y: 14 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className={`soft-panel border p-6 md:p-7 ${
                  gold
                    ? 'border-brand/50 bg-brand text-ink'
                    : paper
                      ? 'border-white/15 bg-paper text-ink'
                      : 'border-white/10 bg-white/5 text-white'
                }`}
              >
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className={`mt-2 ${gold || paper ? 'text-ink/70' : 'text-white/70'}`}>{item.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
