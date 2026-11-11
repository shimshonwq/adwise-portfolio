import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Services() {
  const { content } = useSiteContent()
  const copy = content.services

  return (
    <section id="services" className="scroll-mt-24 bg-ink py-20 text-white md:py-28">
      <div className="site-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="eyebrow !text-brand/80">{copy.eyebrow}</p>
            <AnimatedText
              as="h2"
              text={copy.title}
              className="mt-4 font-display text-[clamp(2rem,6vw,4rem)] font-extrabold tracking-tight text-white"
            />
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/55 md:text-right md:text-base">
            {copy.subtitle}
          </p>
        </div>

        <div className="mt-12 md:mt-16">
          {copy.items.map((service, index) => (
            <motion.article
              key={service.id}
              initial={{ y: 12, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="service-row group"
            >
              <span className="service-num">{service.num}</span>
              <div>
                <h3 className="font-display text-[clamp(1.5rem,3.5vw,2.4rem)] font-extrabold tracking-tight">
                  {service.title}
                </h3>
                <p className="service-muted mt-2 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                  {service.description}
                </p>
              </div>
              <ul className="service-muted flex flex-wrap gap-x-4 gap-y-1 text-xs font-semibold uppercase tracking-[0.14em] text-white/45 md:justify-end">
                {service.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
