import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'

const principles = [
  {
    title: 'Strategy first',
    body: 'Every mark and campaign ladders up to a clear goal — not decoration for decoration’s sake.',
  },
  {
    title: 'Craft obsessed',
    body: 'Premium details that make brands feel expensive, consistent, and unforgettable.',
  },
  {
    title: 'Built to last',
    body: 'Identities that work on a sign, a phone screen, a truck, and a business card.',
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 bg-paper-deep py-24 md:py-32">
      <div className="site-shell grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow">About {siteConfig.shortName}</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Logos & graphics
            <br />
            that work for business.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink/65">
            {siteConfig.name} designs logos, brand graphics, and marketing visuals for companies that
            want to look professional and memorable. From first sketch to finished signage, we blend
            strategy with craft.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/65">
            {siteConfig.tagline} isn’t just a line — it’s how we work.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="border-t border-line"
        >
          {principles.map((item) => (
            <div key={item.title} className="border-b border-line py-7">
              <h3 className="font-display text-xl font-bold text-ink">{item.title}</h3>
              <p className="mt-2 text-ink/60">{item.body}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
