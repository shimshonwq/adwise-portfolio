import { motion } from 'framer-motion'
import Link from 'next/link'

const taglineLines = ['Thinking', 'Your', 'Next', 'Thing']

/** Manifesto-style spotlight — inspired by MOTG’s unexpected brand moment */
export default function Spotlight() {
  return (
    <section className="spotlight-stage relative overflow-hidden py-24 md:py-36">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, #1a1608 0%, #0e0e0e 28%, #2a2208 55%, #1a1608 78%, #0e0e0e 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(253,198,33,0.28), transparent 58%), radial-gradient(circle at 12% 85%, rgba(253,198,33,0.12), transparent 35%), radial-gradient(circle at 88% 15%, rgba(255,255,255,0.07), transparent 30%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10">
        <motion.p
          className="text-center text-xs font-extrabold uppercase tracking-[0.32em] text-brand"
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
        >
          Our manifesto
        </motion.p>

        <div className="mx-auto mt-8 max-w-4xl">
          <h2 className="text-center font-display text-[clamp(3rem,8vw,6.5rem)] font-bold leading-[0.92] tracking-tight">
            {taglineLines.map((line, i) => (
              <motion.span
                key={line}
                className="block brand-shimmer"
                initial={{ y: 36, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                {line}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.div
          className="mx-auto mt-12 h-px w-24 bg-gradient-to-r from-transparent via-brand to-transparent"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          aria-hidden
        />

        <motion.div
          className="mx-auto mt-10 max-w-2xl text-center"
          initial={{ y: 16 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <p className="text-lg leading-relaxed text-white/85 md:text-xl">
            Safe design gets safe results. We build logos, graphics, and campaigns that turn heads —
            and move the business forward.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href="#contact" className="btn btn-on-dark">
              Begin the unexpected
            </Link>
            <Link href="#process" className="btn btn-secondary-light">
              See how we work
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
