import { motion } from 'framer-motion'
import Link from 'next/link'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

/** Surprise mid-page brand spotlight — colorful, eye-catching, conversion-focused */
export default function Spotlight() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(125deg, #0e0e0e 0%, #1a1608 28%, #fdc621 52%, #fff8e0 72%, #0e0e0e 100%)',
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          background:
            'radial-gradient(circle at 20% 40%, rgba(253,198,33,0.45), transparent 35%), radial-gradient(circle at 80% 60%, rgba(255,255,255,0.25), transparent 30%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 text-center">
        <motion.p
          className="text-xs font-extrabold uppercase tracking-[0.28em] text-brand"
          initial={{ y: 10 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
        >
          The Adwise way
        </motion.p>
        <AnimatedText
          as="h2"
          text={siteConfig.tagline}
          shimmer
          className="mx-auto mt-5 max-w-4xl font-display text-[clamp(2.4rem,7vw,5rem)] font-bold leading-[1.05] tracking-tight"
        />
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">
          Bold ideas. Sharp logos. Graphics that stop people mid-scroll — and bring customers your way.
        </p>
        <motion.div
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
          initial={{ y: 12 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
        >
          <Link href="#contact" className="btn btn-on-dark">
            Let’s build your brand
          </Link>
          <Link href="#work" className="btn btn-secondary-light">
            See what’s coming
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
