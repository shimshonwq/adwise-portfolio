import { motion } from 'framer-motion'
import Link from 'next/link'
import { useSiteContent } from '../lib/SiteContentContext'

export default function Spotlight() {
  const { content } = useSiteContent()
  const copy = content.spotlight

  return (
    <section className="spotlight-stage relative overflow-hidden py-24 md:py-36">
      <div
        className="pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
        aria-hidden
      />

      <div className="site-shell relative z-10">
        <motion.p
          className="eyebrow !text-brand justify-center"
          initial={{ y: 10, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          {copy.eyebrow}
        </motion.p>

        <div className="mx-auto mt-8 max-w-5xl">
          <h2 className="text-center font-display text-[clamp(2.4rem,11vw,7.5rem)] font-extrabold leading-[0.9] tracking-tight">
            {copy.titleLines.map((line, i) => (
              <motion.span
                key={`${line}-${i}`}
                className="block brand-shimmer"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.div
          className="spotlight-slash mt-10 md:mt-12"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.2 }}
        />

        <motion.p
          className="mx-auto mt-8 max-w-lg text-center text-base leading-relaxed text-white/60 md:text-lg"
          initial={{ y: 12, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          {copy.body}
        </motion.p>

        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
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
