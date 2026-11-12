import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Process() {
  const { content } = useSiteContent()
  const copy = content.process

  return (
    <section id="process" className="process-stage scroll-mt-24 py-20 md:py-28">
      <div className="site-shell">
        <p className="eyebrow !text-ink/45">{copy.eyebrow}</p>
        <h2 className="mt-4 font-display text-[clamp(2rem,6vw,3.8rem)] font-extrabold tracking-tight text-ink">
          {copy.title}{' '}
          <span className="font-serif italic text-signal">{copy.subtitle}</span>
        </h2>

        <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {copy.steps.map((step, index) => (
            <motion.article
              key={step.id}
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`process-card process-card-${index}`}
            >
              <span className="font-display text-sm font-bold tracking-[0.22em] opacity-60">
                {step.num}
              </span>
              <h3 className="mt-8 whitespace-nowrap font-display text-[clamp(1.85rem,3.2vw,2.75rem)] font-extrabold leading-none tracking-tight">
                {step.title}
              </h3>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
