import { motion } from 'framer-motion'
import { CmsText } from '../lib/CmsText'
import { sectionBackground, textStyleToCss } from '../lib/content'
import { useSiteContent } from '../lib/SiteContentContext'
import AnimatedText from './AnimatedText'

export default function Process() {
  const { content } = useSiteContent()
  const copy = content.process
  const bg = sectionBackground(content, 'process', 'section-aurora')
  const styles = content.textStyles || {}

  return (
    <section id="process" className={`scroll-mt-24 ${bg} py-20 md:py-28`}>
      <div className="site-shell">
        <CmsText path="process.eyebrow" as="p" className="eyebrow">
          {copy.eyebrow}
        </CmsText>
        <AnimatedText
          as="h2"
          text={copy.title}
          className="mt-3 max-w-2xl font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight text-ink"
          style={textStyleToCss(styles['process.title'])}
        />
        <CmsText
          path="process.subtitle"
          as="p"
          className="mt-5 max-w-lg font-serif text-lg italic text-brass md:text-xl"
        >
          {copy.subtitle}
        </CmsText>

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
                <CmsText
                  path={`process.steps.${step.id}.num`}
                  as="span"
                  className={`inline-flex h-11 w-11 items-center justify-center rounded-lg font-display text-sm font-bold ${
                    ink ? 'bg-brand text-ink' : gold ? 'bg-ink text-brand' : 'bg-ink text-brand'
                  }`}
                >
                  {step.num}
                </CmsText>
                <CmsText
                  path={`process.steps.${step.id}.title`}
                  as="h3"
                  className="mt-6 font-display text-xl font-bold md:text-3xl"
                >
                  {step.title}
                </CmsText>
                <CmsText
                  path={`process.steps.${step.id}.body`}
                  as="p"
                  className={`mt-4 font-serif leading-relaxed ${ink ? 'text-white/75' : 'text-ink/70'}`}
                >
                  {step.body}
                </CmsText>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
