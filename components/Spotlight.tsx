import { motion } from 'framer-motion'
import Link from 'next/link'
import { CmsText } from '../lib/CmsText'
import { sectionBackground, textStyleToCss } from '../lib/content'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Spotlight() {
  const { content } = useSiteContent()
  const copy = content.spotlight
  const layoutBg = sectionBackground(content, 'spotlight', '')
  const usePreset = Boolean(layoutBg)
  const styles = content.textStyles || {}

  return (
    <section
      className={`spotlight-stage relative overflow-hidden py-20 md:py-36 ${
        usePreset ? layoutBg : ''
      }`}
    >
      {!usePreset && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(145deg, #1c1810 0%, #14130f 28%, #241e10 55%, #1c1810 78%, #14130f 100%)',
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(253,198,33,0.28), transparent 58%), radial-gradient(circle at 12% 85%, rgba(143,115,67,0.18), transparent 32%)',
            }}
            aria-hidden
          />
        </>
      )}

      <div className="site-shell relative z-10">
        <motion.p
          className="text-center text-xs font-extrabold uppercase tracking-[0.28em] text-brand"
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          style={textStyleToCss(styles['spotlight.eyebrow'])}
        >
          {copy.eyebrow}
        </motion.p>

        <div className="mx-auto mt-8 max-w-4xl px-1">
          <h2 className="text-center font-display text-[clamp(1.85rem,8vw,6.2rem)] font-bold leading-[1.02] tracking-tight">
            {copy.titleLines.map((line, i) => (
              <motion.span
                key={`${line}-${i}`}
                className="block brand-shimmer"
                initial={{ y: 36, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={textStyleToCss(styles[`spotlight.titleLines.${i}`])}
              >
                {line}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.div
          className="mx-auto mt-10 h-1 w-28 rounded-full bg-brand md:mt-12 md:w-40"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          aria-hidden
        />

        <motion.div
          className="mx-auto mt-8 max-w-2xl text-center md:mt-10"
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CmsText
            path="spotlight.body"
            as="p"
            className="font-serif text-base leading-relaxed text-white/85 md:text-xl"
          >
            {copy.body}
          </CmsText>
          <CmsText
            path="spotlight.accent"
            as="p"
            className="mt-4 font-serif text-lg italic text-brand md:text-2xl"
          >
            {copy.accent}
          </CmsText>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-9 md:gap-4">
            <Link
              href={copy.ctaPrimaryHref}
              className="btn btn-on-dark"
              style={textStyleToCss(styles['spotlight.ctaPrimaryLabel'])}
            >
              {copy.ctaPrimaryLabel}
            </Link>
            <Link
              href={copy.ctaSecondaryHref}
              className="btn btn-secondary-light"
              style={textStyleToCss(styles['spotlight.ctaSecondaryLabel'])}
            >
              {copy.ctaSecondaryLabel}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
