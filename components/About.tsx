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

const capabilities = ['Signage', 'Print systems', 'Social ads', 'Brand guides']

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 relative overflow-hidden section-ink-gold grain py-24 md:py-32">
      <div className="site-shell relative z-10">
        <div className="grid gap-14 md:grid-cols-[1.15fr_0.85fr] md:items-start">
          <div>
            <p className="eyebrow !text-brand">About {siteConfig.shortName}</p>
            <AnimatedText
              as="h2"
              text="A small studio with big standards."
              shimmer
              className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
            />
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              We help businesses look professional and stay consistent — from the first logo sketch
              to finished signage and campaign rollout.
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

          <div className="tilt-3d-wrap space-y-4">
            {principles.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ y: 14, rotateY: -4 }}
                whileInView={{ y: 0, rotateY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className={`tilt-3d soft-panel panel-3d border p-6 md:p-7 ${
                  index === 1
                    ? 'border-brand/50 bg-brand text-ink'
                    : 'panel-3d-dark border-white/10 bg-white/5 text-white backdrop-blur-sm'
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
