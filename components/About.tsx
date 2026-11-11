import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function About() {
  const { content } = useSiteContent()
  const copy = content.about
  const eyebrow = copy.eyebrow.replace('{shortName}', content.site.shortName)

  return (
    <section id="about" className="scroll-mt-24 bg-ink py-20 text-white md:py-32">
      <div className="site-shell grid gap-12 md:grid-cols-[1.05fr_0.95fr] md:items-start md:gap-16">
        <div>
          <p className="eyebrow !text-brand">{eyebrow}</p>
          <AnimatedText
            as="h2"
            text={copy.title}
            className="mt-4 font-display text-[clamp(1.9rem,5.5vw,3.6rem)] font-extrabold tracking-tight text-white"
          />
          <p className="mt-6 max-w-lg text-base leading-relaxed text-white/60 md:text-lg">
            {copy.body}
          </p>
          <p className="mt-5 font-display text-xl font-bold text-brand md:text-2xl">{copy.accent}</p>
        </div>

        <div className="space-y-0 border-t border-white/10">
          {copy.principles.map((item, index) => {
            const gold = item.tone === 'gold'
            return (
              <motion.div
                key={item.id}
                initial={{ y: 12, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                className={`border-b border-white/10 px-1 py-7 transition-colors ${
                  gold ? 'hover:bg-brand hover:text-ink' : 'hover:bg-white/[0.03]'
                } group`}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-sm font-bold text-brand group-hover:text-inherit">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
                      {item.title}
                    </h3>
                    <p
                      className={`mt-2 text-sm leading-relaxed md:text-base ${
                        gold ? 'text-inherit/70 group-hover:text-ink/70' : 'text-white/55'
                      }`}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
