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
    <section id="process" className="scroll-mt-24 section-aurora py-24 md:py-28">
      <div className="site-shell">
        <p className="eyebrow">This is how we do it</p>
        <AnimatedText
          as="h2"
          text="A structured approach to creative."
          shimmer
          className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight md:text-5xl"
        />
        <p className="mt-5 max-w-lg font-serif text-xl italic text-ink/70">
          Research. Planning. Execution. Creative that works like a business.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
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
                className={`soft-panel border-2 p-8 shadow-[6px_6px_0_0_#111] md:p-9 ${
                  gold
                    ? 'border-ink bg-brand text-ink'
                    : ink
                      ? 'border-ink bg-ink text-white'
                      : 'border-ink bg-white text-ink'
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center font-display text-sm font-bold ${
                    ink ? 'bg-hot text-white' : gold ? 'bg-ink text-brand' : 'bg-volt text-ink'
                  }`}
                >
                  {step.num}
                </span>
                <h3 className="mt-6 font-display text-2xl font-bold md:text-3xl">{step.title}</h3>
                <p className={`mt-4 leading-relaxed ${ink ? 'text-white/70' : 'text-ink/65'}`}>
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
