import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Services() {
  const { content } = useSiteContent()
  const copy = content.services

  return (
    <section id="services" className="scroll-mt-24 brand-field py-20 md:py-32">
      <div className="site-shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="max-w-2xl">
            <p className="eyebrow !text-ink/60">{copy.eyebrow}</p>
            <AnimatedText
              as="h2"
              text={copy.title}
              className="mt-3 font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight text-ink"
            />
          </div>
          <p className="max-w-sm font-serif text-lg italic leading-relaxed text-ink/80 md:text-right md:text-xl">
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:mt-14 md:grid-cols-3 md:gap-6">
          {copy.items.map((service, index) => {
            const ink = service.tone === 'ink'
            const gold = service.tone === 'gold'
            return (
              <motion.article
                key={service.id}
                initial={{ y: 18 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`soft-panel relative overflow-hidden border p-7 md:p-9 ${
                  ink
                    ? 'border-ink/20 bg-ink text-white md:-translate-y-2'
                    : gold
                      ? 'border-ink/10 bg-paper text-ink'
                      : 'border-ink/10 bg-white text-ink'
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-lg font-display text-sm font-bold ${
                    ink ? 'bg-brand text-ink' : gold ? 'bg-ink text-brand' : 'bg-brand text-ink'
                  }`}
                >
                  {service.num}
                </span>
                <h3 className="mt-5 font-display text-[clamp(1.6rem,4vw,1.9rem)] font-bold tracking-tight">
                  {service.title}
                </h3>
                <p className={`mt-4 font-serif leading-relaxed ${ink ? 'text-white/80' : 'text-ink/75'}`}>
                  {service.description}
                </p>
                <ul className="mt-8 space-y-2.5">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className={`flex items-center gap-3 text-sm font-medium ${
                        ink ? 'text-white/80' : 'text-ink/75'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${ink ? 'bg-brand' : 'bg-ink'}`}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
