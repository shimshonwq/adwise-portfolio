import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Process() {
  const { content } = useSiteContent()
  const copy = content.process

  return (
    <section id="process" className="process-stage scroll-mt-24 py-20 md:py-28">
      <div className="site-shell">
        <p className="eyebrow !text-ink/50">{copy.eyebrow}</p>
        <AnimatedText
          as="h2"
          text={copy.title}
          className="mt-4 max-w-2xl font-display text-[clamp(1.9rem,5.5vw,3.6rem)] font-extrabold tracking-tight text-ink"
        />
        <p className="mt-4 max-w-lg text-base text-ink/55 md:text-lg">{copy.subtitle}</p>

        <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-3 md:gap-8">
          {copy.steps.map((step, index) => (
            <motion.article
              key={step.id}
              initial={{ y: 16, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="process-step"
            >
              <span className="font-display text-sm font-bold tracking-[0.2em] text-brand">
                {step.num}
              </span>
              <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60 md:text-base">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
