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
    <section className="bg-paper py-24 md:py-28">
      <div className="site-shell">
        <p className="eyebrow">How we work</p>
        <AnimatedText
          as="h2"
          text="A simple process. Serious craft."
          className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl"
        />

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => (
            <motion.article
              key={step.num}
              initial={{ y: 22, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`soft-panel border p-8 md:p-9 ${
                index === 1
                  ? 'border-brand/40 bg-ink text-white'
                  : 'border-line bg-white text-ink'
              }`}
            >
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold ${
                  index === 1 ? 'bg-brand text-ink' : 'bg-brand text-ink'
                }`}
              >
                {step.num}
              </span>
              <h3 className="mt-6 font-display text-2xl font-bold md:text-3xl">{step.title}</h3>
              <p className={`mt-4 leading-relaxed ${index === 1 ? 'text-white/65' : 'text-ink/60'}`}>
                {step.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
