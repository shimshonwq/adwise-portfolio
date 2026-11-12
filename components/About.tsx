import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'

/** Slim manifesto band — less copy, more presence */
export default function About() {
  const { content } = useSiteContent()
  const copy = content.about
  const eyebrow = copy.eyebrow.replace('{shortName}', content.site.shortName)

  return (
    <section id="about" className="about-band scroll-mt-24 overflow-hidden">
      <div className="site-shell py-16 md:py-20">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow !text-ink/50">{eyebrow}</p>
            <h2 className="mt-4 font-display text-[clamp(2.2rem,7vw,4.8rem)] font-extrabold leading-[0.92] tracking-tight text-ink">
              {copy.title}
            </h2>
            <p className="mt-5 max-w-lg font-serif text-xl italic text-ink/70 md:text-2xl">
              {copy.accent}
            </p>
          </div>
          <motion.ul
            className="flex flex-wrap gap-2 md:max-w-sm md:justify-end"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {copy.principles.map((item) => (
              <li key={item.id} className="about-chip">
                {item.title}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
