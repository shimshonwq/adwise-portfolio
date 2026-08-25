import { motion } from 'framer-motion'
import { CmsText } from '../lib/CmsText'
import { sectionBackground, textStyleToCss } from '../lib/content'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function About() {
  const { content } = useSiteContent()
  const copy = content.about
  const eyebrow = copy.eyebrow.replace('{shortName}', content.site.shortName)
  const bg = sectionBackground(content, 'about', 'section-ink-gold')
  const styles = content.textStyles || {}

  return (
    <section id="about" className={`scroll-mt-24 ${bg} py-20 md:py-32`}>
      <div className="site-shell grid gap-12 md:grid-cols-[1.1fr_0.9fr] md:items-start md:gap-14">
        <div>
          <CmsText path="about.eyebrow" as="p" className="eyebrow !text-brand">
            {eyebrow}
          </CmsText>
          <AnimatedText
            as="h2"
            text={copy.title}
            shimmer
            className="mt-3 font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight"
            style={textStyleToCss(styles['about.title'])}
          />
          <CmsText
            path="about.body"
            as="p"
            className="mt-6 font-serif text-base leading-relaxed text-white/85 md:text-lg"
          >
            {copy.body}
          </CmsText>
          <CmsText
            path="about.accent"
            as="p"
            className="mt-4 font-serif text-lg italic text-brand md:text-2xl"
          >
            {copy.accent}
          </CmsText>
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
                <CmsText
                  path={`about.principles.${item.id}.title`}
                  as="h3"
                  className="font-display text-xl font-bold"
                >
                  {item.title}
                </CmsText>
                <CmsText
                  path={`about.principles.${item.id}.body`}
                  as="p"
                  className={`mt-2 font-serif ${gold || paper ? 'text-ink/70' : 'text-white/70'}`}
                >
                  {item.body}
                </CmsText>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
