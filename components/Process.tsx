import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'

const steps = [
  {
    num: '01',
    title: 'Discover',
    body: 'We learn your brand, audience, and goals — so every creative choice has a reason.',
  },
  {
    num: '02',
    title: 'Create',
    body: 'Strategy turns into visuals, content, and campaigns that feel premium and on-brand.',
  },
  {
    num: '03',
    title: 'Launch & grow',
    body: 'We ship, measure, and refine — so the work keeps earning attention after go-live.',
  },
]

export default function Process() {
  return (
    <section className="relative overflow-hidden section-aurora grain py-24 md:py-32">
      <div className="site-shell relative z-10">
        <div className="max-w-2xl">
          <p className="eyebrow">How we work</p>
          <AnimatedText
            as="h2"
            text="A clear process. Serious craft."
            shimmer
            className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
          />
          <p className="mt-5 max-w-lg text-lg text-ink/60">
            Three focused phases — built for brands that want polish without the chaos.
          </p>
        </div>

        <div className="relative mt-16">
          <div
            className="process-line pointer-events-none absolute left-0 right-0 top-[2.1rem] hidden h-px md:block"
            aria-hidden
          />

          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            {steps.map((step, index) => (
              <motion.article
                key={step.num}
                initial={{ y: 20 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                <div className="relative z-10 mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink/10 bg-white shadow-[0_12px_30px_-16px_rgba(14,14,14,0.35)]">
                  <span className="font-display text-lg font-bold text-ink">{step.num}</span>
                  <span
                    className="absolute inset-0 rounded-full ring-4 ring-brand/20"
                    aria-hidden
                  />
                </div>
                <h3 className="font-display text-2xl font-bold md:text-3xl">{step.title}</h3>
                <p className="mt-3 max-w-xs leading-relaxed text-ink/60">{step.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
