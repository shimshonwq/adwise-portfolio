import { motion } from 'framer-motion'
import Link from 'next/link'
import { siteConfig } from '../config/site.config'

const taglineLines = ['Thinkink', 'Your', 'Next', 'Thing']

/** Mid-page brand spotlight — clean stacked tagline on a soft gold/ink gradient */
export default function Spotlight() {
  return (
    <section className="spotlight-stage relative overflow-hidden py-20 md:py-28">
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
            'radial-gradient(ellipse 55% 50% at 50% 40%, rgba(253,198,33,0.22), transparent 60%), radial-gradient(circle at 15% 80%, rgba(253,198,33,0.1), transparent 35%), radial-gradient(circle at 85% 20%, rgba(255,255,255,0.06), transparent 30%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 grid items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div>
          <motion.p
            className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand"
            initial={{ y: 10 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
          >
            The Adwise way
          </motion.p>

          <h2 className="mt-6 font-display text-[clamp(2.8rem,6.5vw,5.2rem)] font-bold leading-[0.95] tracking-tight">
            {taglineLines.map((line, i) => (
              <motion.span
                key={line}
                className="block brand-shimmer"
                initial={{ y: 16 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                {line}
              </motion.span>
            ))}
          </h2>
        </div>

        <motion.div
          className="rounded-[1.75rem] border border-brand/25 bg-white/5 p-8 backdrop-blur-sm md:p-10"
          initial={{ y: 18 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg leading-relaxed text-white/75 md:text-xl">
            Bold ideas. Sharp logos. Graphics that stop people mid-scroll — and bring customers your
            way.
          </p>
          <p className="mt-4 text-sm font-semibold uppercase tracking-[0.18em] text-brand/90">
            {siteConfig.name}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="#contact" className="btn btn-on-dark">
              Let’s build your brand
            </Link>
            <Link href="#work" className="btn btn-secondary-light">
              See what’s coming
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
