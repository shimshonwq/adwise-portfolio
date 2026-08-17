import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'

const steps = [
  {
    num: '01',
    title: 'Research',
    body: 'We learn the business, audience, and goal — so creative isn’t a guess.',
    tone: 'white' as const,
  },
  {
    num: '02',
    title: 'Create',
    body: 'Strategy becomes logos, visuals, and campaigns that look sharp and stay on-brand.',
    tone: 'gold' as const,
  },
  {
    num: '03',
    title: 'Launch',
    body: 'We ship, measure, and refine — so the work keeps earning attention after go-live.',
    tone: 'ink' as const,
  },
]

export default function Process() {
  return (
    <section id="process" className="scroll-mt-24 section-aurora py-20 md:py-28">
      <div className="site-shell">
        <p className="eyebrow">This is how we do it</p>
        <AnimatedText
          as="h2"
          text="A structured approach to creative."
          className="mt-3 max-w-2xl font-display text-[clamp(2rem,7vw,3.25rem)] font-bold tracking-tight text-ink"
        />
        <p className="mt-5 max-w-lg font-serif text-lg italic text-brass md:text-xl">
          Research. Planning. Execution. Creative that works like a business.
        </p>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const ink = step.tone === 'ink'
            const gold = step.tone === 'gold'
            return (
              <motion.article
                key={step.num}
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`soft-panel border p-7 md:p-9 ${
                  gold
                    ? 'border-brand/40 bg-brand text-ink'
                    : ink
                      ? 'border-brand/30 bg-ink text-white'
                      : 'border-line bg-white text-ink'
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-lg font-display text-sm font-bold ${
                    ink ? 'bg-brand text-ink' : gold ? 'bg-ink text-brand' : 'bg-ink text-brand'
                  }`}
                >
                  {step.num}
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold md:text-3xl">{step.title}</h3>
                <p className={`mt-4 leading-relaxed ${ink ? 'text-white/75' : 'text-ink/70'}`}>
                  {step.body}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
