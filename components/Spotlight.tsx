import { motion } from 'framer-motion'
import Link from 'next/link'

const taglineLines = ['Thinking', 'Your', 'Next', 'Thing']

export default function Spotlight() {
  return (
    <section className="spotlight-stage relative overflow-hidden py-24 md:py-36">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(145deg, #1a1608 0%, #111111 28%, #2a2208 55%, #1a1608 78%, #111111 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(253,198,33,0.32), transparent 58%), radial-gradient(circle at 10% 88%, rgba(255,77,141,0.22), transparent 32%), radial-gradient(circle at 90% 12%, rgba(46,230,214,0.2), transparent 30%)',
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute left-8 top-10 h-12 w-12 bg-hot md:left-16" aria-hidden />
      <div className="pointer-events-none absolute bottom-12 right-10 h-10 w-10 bg-volt md:right-20" aria-hidden />

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
          className="mx-auto mt-12 h-2 w-40 bg-gradient-to-r from-brand via-volt to-hot"
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
          <p className="mt-4 font-serif text-2xl italic text-volt">Unexpected on purpose.</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
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
