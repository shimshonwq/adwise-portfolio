import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Spotlight() {
  const { content } = useSiteContent()
  const copy = content.spotlight

  return (
    <section className="spotlight-stage relative overflow-hidden py-24 md:py-36">
      <div className="spotlight-glow" aria-hidden />
      <div className="site-shell relative z-10">
        <motion.p
          className="eyebrow !text-brand"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {copy.eyebrow}
        </motion.p>

        <h2 className="mt-8 max-w-5xl font-display text-[clamp(2.8rem,12vw,8rem)] font-extrabold leading-[0.88] tracking-tight text-white">
          {copy.titleLines.map((line, i) => {
            const serif = i === 1 || i === copy.titleLines.length - 1
            return (
              <motion.span
                key={`${line}-${i}`}
                className={`block ${serif ? 'font-serif italic text-brand' : ''}`}
                initial={{ y: 48, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            )
          })}
        </h2>

        <motion.div
          className="spotlight-slash mt-10"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
        />

        <motion.p
          className="mt-8 max-w-md text-base text-white/55 md:text-lg"
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          {copy.body}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center gap-3"
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.32 }}
        >
          <Link href={copy.ctaPrimaryHref} className="btn btn-primary">
            {copy.ctaPrimaryLabel}
          </Link>
          <Link href={copy.ctaSecondaryHref} className="btn btn-secondary">
            {copy.ctaSecondaryLabel}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
