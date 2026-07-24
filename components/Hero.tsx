import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const cycleWords = ['identity', 'presence', 'momentum', 'clarity']

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % cycleWords.length)
    }, 2800)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Soft modern dissolve — paper + gold wash, matches site system */}
      <div className="hero-open pointer-events-none fixed inset-0 z-[60]" aria-hidden>
        <div className="hero-open-wash" />
        <p className="hero-open-word font-display text-2xl font-bold tracking-tight text-ink md:text-4xl">
          {siteConfig.shortName}
        </p>
      </div>

      {/* Abstract atmosphere — no uploaded Thinking graphic */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="hero-blob hero-blob-a right-[-8%] top-[18%] h-[42vmin] w-[42vmin] bg-brand/35 md:right-[4%] md:top-[22%]" />
        <div className="hero-blob hero-blob-b right-[12%] top-[48%] h-[28vmin] w-[28vmin] bg-white/70 md:right-[22%]" />
        <div className="hero-blob hero-blob-c bottom-[18%] right-[28%] h-[22vmin] w-[22vmin] bg-brand/25 md:bottom-[22%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/20 via-transparent to-paper/70 md:bg-gradient-to-r md:from-paper md:via-paper/55 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-32 pt-28 md:justify-center md:pb-36 md:pt-32">
        <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
          <div className="hero-content-3d">
            <motion.span
              className="panel-3d mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep backdrop-blur-sm"
              initial={{ x: -12 }}
              animate={{ x: 0 }}
              transition={{ delay: 1.25, duration: 0.55 }}
            >
              <span className="pulse-dot" aria-hidden />
              Branding & marketing studio
            </motion.span>

            <AnimatedText
              as="h1"
              text="We make brands impossible to ignore."
              immediate
              shimmer
              delay={1.2}
              className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
            />

            <motion.p
              className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.5, duration: 0.55 }}
            >
              Strategy-led logos, brand systems, and marketing creatives that make businesses look
              premium — and get remembered.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.65, duration: 0.55 }}
            >
              <a href="#work" className="btn btn-primary">
                Our projects
              </a>
              <a href="#contact" className="btn btn-brand">
                Start a project
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live word cycle — different motion + copy from the old ribbon */}
      <div className="absolute inset-x-0 bottom-7 z-10 md:bottom-9">
        <a
          href="#work"
          className="hero-perspective mx-auto flex w-fit flex-col items-start gap-2 px-4"
        >
          <span className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-ink/40">
            Built for
          </span>
          <span className="flex items-baseline gap-3">
            <span className="relative block h-[1.35em] min-w-[9ch] overflow-hidden font-display text-2xl font-bold tracking-tight text-ink md:text-3xl">
              <AnimatePresence mode="wait">
                <motion.span
                  key={cycleWords[wordIndex]}
                  className="absolute inset-x-0 top-0 brand-shimmer"
                  initial={{ y: 18, rotateX: 50 }}
                  animate={{ y: 0, rotateX: 0 }}
                  exit={{ y: -18, rotateX: -50 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {cycleWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="text-sm font-semibold text-ink/45 md:text-base">→ see the work</span>
          </span>
          <span className="hero-cycle-line h-0.5 w-28 rounded-full bg-brand" aria-hidden />
        </a>
      </div>
    </section>
  )
}
