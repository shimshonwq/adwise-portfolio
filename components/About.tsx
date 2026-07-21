import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

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
    <section id="about" className="scroll-mt-24 bg-paper py-24 text-ink md:py-32">
      <div className="site-shell grid gap-14 md:grid-cols-[1.1fr_0.9fr] md:items-start">
        <div>
          <p className="eyebrow">About {siteConfig.shortName}</p>
          <AnimatedText
            as="h2"
            text="Logos & graphics that work for business."
            className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl"
          />
          <p className="mt-6 text-lg leading-relaxed text-ink/65">
            {siteConfig.name} designs logos, brand graphics, and marketing visuals for companies that
            want to look professional and memorable. From first sketch to finished signage, we blend
            strategy with craft.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/65">
            <span className="brand-shimmer font-display font-bold">{siteConfig.tagline}</span> isn’t
            just a line — it’s how we work.
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
                  ? 'border-brand/40 bg-brand text-ink'
                  : 'border-line bg-white text-ink'
              }`}
            >
              <h3 className="font-display text-xl font-bold">{item.title}</h3>
              <p className={`mt-2 ${index === 1 ? 'text-ink/70' : 'text-ink/60'}`}>{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
