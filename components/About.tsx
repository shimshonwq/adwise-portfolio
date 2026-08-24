import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function About() {
  const { content } = useSiteContent()
  const copy = content.about
  const eyebrow = copy.eyebrow.replace('{shortName}', content.site.shortName)

  return (
    <section id="about" className="scroll-mt-24 section-ink-gold py-20 md:py-32">
      <div className="site-shell grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-14">
        <div>
          <p className="eyebrow !text-brand">{eyebrow}</p>
          <AnimatedText
            as="h2"
            text={copy.title}
            shimmer
            className="mt-3 font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight"
          />
          <p className="mt-6 font-serif text-base leading-relaxed text-white/85 md:text-lg">
            {copy.body}
          </p>
          <p className="mt-4 font-serif text-lg italic text-brand md:text-2xl">{copy.accent}</p>
        </div>

        <div className="space-y-4">
          {copy.principles.map((item, index) => {
            const gold = item.tone === 'gold'
            const paper = item.tone === 'paper'
            return (
              <motion.div
                key={item.id}
                initial={{ y: 14 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: index * 0.07 }}
                whileHover={{ x: 6, transition: { duration: 0.2 } }}
                className={`soft-panel border p-6 md:p-7 ${
                  gold
                    ? 'border-brand/50 bg-brand text-ink'
                    : paper
                      ? 'border-white/15 bg-paper text-ink'
                      : 'border-white/10 bg-white/5 text-white'
                }`}
              >
                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                <p className={`mt-2 font-serif ${gold || paper ? 'text-ink/70' : 'text-white/70'}`}>{item.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
