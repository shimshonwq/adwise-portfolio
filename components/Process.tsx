import { motion } from 'framer-motion'

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
        <h2 className="mt-3 max-w-xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
          A simple process. Serious craft.
        </h2>

        <div className="mt-14 grid gap-0 border-t border-line md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.article
              key={step.num}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="border-b border-line py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-brand-deep">
                {step.num}
              </span>
              <h3 className="mt-5 font-display text-2xl font-bold text-ink md:text-3xl">{step.title}</h3>
              <p className="mt-4 leading-relaxed text-ink/60">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
