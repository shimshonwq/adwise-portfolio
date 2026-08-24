import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Process() {
  const { content } = useSiteContent()
  const copy = content.process

  return (
    <section id="process" className="scroll-mt-24 section-aurora py-20 md:py-28">
      <div className="site-shell">
        <p className="eyebrow">{copy.eyebrow}</p>
        <AnimatedText
          as="h2"
          text={copy.title}
          className="mt-3 max-w-2xl font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight text-ink"
        />
        <p className="mt-5 max-w-lg font-serif text-lg italic text-brass md:text-xl">
          {copy.subtitle}
        </p>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {copy.steps.map((step, index) => {
            const ink = step.tone === 'ink'
            const gold = step.tone === 'gold'
            return (
              <motion.article
                key={step.id}
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
                <h3 className="mt-6 font-display text-xl font-bold md:text-3xl">{step.title}</h3>
                <p className={`mt-4 font-serif leading-relaxed ${ink ? 'text-white/75' : 'text-ink/70'}`}>
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
