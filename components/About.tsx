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

const capabilities = [
  'Logo design',
  'Brand identity',
  'Signage',
  'Print systems',
  'Social creatives',
  'Campaign design',
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 relative overflow-hidden section-ink-gold grain py-24 md:py-32">
      <div className="site-shell relative z-10">
        <div className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] md:items-start">
          <div>
            <p className="eyebrow !text-brand">About {siteConfig.shortName}</p>
            <AnimatedText
              as="h2"
              text="A branding studio for businesses that want to look expensive."
              shimmer
              className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
            />
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              {siteConfig.name} designs logos, brand graphics, and marketing visuals for companies
              that want to look professional and memorable. From first sketch to finished signage,
              we blend strategy with craft.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-white/70">
              <span className="brand-shimmer font-display font-bold">{siteConfig.tagline}</span>{' '}
              isn’t just a line — it’s how we work.
            </p>

            <div className="mt-10 flex flex-wrap gap-2.5">
              {capabilities.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-brand"
                >
                  {item}
                </span>
              ))}
            </div>
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
                    ? 'border-brand/50 bg-brand text-ink shadow-[0_20px_40px_-24px_rgba(253,198,33,0.55)]'
                    : 'border-white/10 bg-white/5 text-white backdrop-blur-sm'
                }`}
              >
                <p
                  className={`text-xs font-extrabold uppercase tracking-[0.2em] ${
                    index === 1 ? 'text-ink/50' : 'text-brand/70'
                  }`}
                >
                  0{index + 1}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold md:text-2xl">{item.title}</h3>
                <p className={`mt-2 ${index === 1 ? 'text-ink/70' : 'text-white/65'}`}>{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
