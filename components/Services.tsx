import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Services() {
  const { content } = useSiteContent()
  const copy = content.services

  return (
    <section id="services" className="scroll-mt-24 bg-ink text-white">
      <div className="site-shell py-16 md:py-20">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow !text-brand">{copy.eyebrow}</p>
            <AnimatedText
              as="h2"
              text={copy.title}
              className="mt-4 font-display text-[clamp(2.4rem,8vw,5.5rem)] font-extrabold leading-[0.9] tracking-tight text-white"
            />
          </div>
          <p className="max-w-xs font-serif text-lg italic text-white/55 md:text-right md:text-xl">
            {copy.subtitle}
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        {copy.items.map((service, index) => {
          const tone = index % 3 === 0 ? 'yellow' : index % 3 === 1 ? 'ink' : 'signal'
          return (
            <motion.article
              key={service.id}
              initial={{ y: 18, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className={`service-panel service-panel-${tone}`}
            >
              <div className="site-shell service-panel-inner">
                <span className="service-num">{service.num}</span>
                <div>
                  <h3 className="font-display text-[clamp(2rem,6vw,4.2rem)] font-extrabold leading-[0.92] tracking-tight">
                    {service.title}
                  </h3>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {service.points.map((point) => (
                      <li key={point} className="service-chip">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
