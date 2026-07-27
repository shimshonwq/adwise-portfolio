import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

/** Clear studio focus — graphic design + marketing */
const cycleWords = [
  'logo design',
  'brand graphics',
  'marketing creatives',
  'campaign visuals',
  'content design',
  'print & signage',
]

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((i) => (i + 1) % cycleWords.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Rich constellation opening — gold bloom, rings, sparks, brand dissolve */}
      <div className="hero-open pointer-events-none fixed inset-0 z-[60]" aria-hidden>
        <div className="hero-open-stage">
          <div className="hero-open-core" />
          <div className="hero-open-ring hero-open-ring-a" />
          <div className="hero-open-ring hero-open-ring-b" />
          <div className="hero-open-ring hero-open-ring-c" />
          <span className="hero-open-spark hero-open-spark-1" />
          <span className="hero-open-spark hero-open-spark-2" />
          <span className="hero-open-spark hero-open-spark-3" />
          <span className="hero-open-spark hero-open-spark-4" />
          <span className="hero-open-spark hero-open-spark-5" />
          <span className="hero-open-spark hero-open-spark-6" />
        </div>
        <div className="hero-open-copy">
          <p className="hero-open-word font-display text-3xl font-bold tracking-tight text-ink md:text-5xl">
            {siteConfig.shortName}
          </p>
          <p className="hero-open-sub mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.35em] text-brand-deep md:text-xs">
            Graphic design · Marketing
          </p>
          <span className="hero-open-underline mx-auto mt-5 block h-0.5 w-24 rounded-full bg-brand" />
        </div>
      </div>

      {/* Soft atmospheric shapes */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="hero-blob hero-blob-a right-[-8%] top-[18%] h-[42vmin] w-[42vmin] bg-brand/35 md:right-[6%] md:top-[20%]" />
        <div className="hero-blob hero-blob-b right-[18%] top-[52%] h-[26vmin] w-[26vmin] bg-white/75 md:right-[26%]" />
        <div className="hero-blob hero-blob-c bottom-[20%] left-[8%] h-[20vmin] w-[20vmin] bg-brand/20 md:left-[12%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/25 via-transparent to-paper/75 md:bg-gradient-to-r md:from-paper md:via-paper/60 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
          <div className="hero-content-3d">
            <motion.span
              className="panel-3d mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep backdrop-blur-sm"
              initial={{ x: -12 }}
              animate={{ x: 0 }}
              transition={{ delay: 1.45, duration: 0.55 }}
            >
              <span className="pulse-dot" aria-hidden />
              Graphic design & marketing studio
            </motion.span>

            <AnimatedText
              as="h1"
              text="We make brands impossible to ignore."
              immediate
              shimmer
              delay={1.4}
              className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
            />

            <motion.p
              className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.7, duration: 0.55 }}
            >
              Logos, brand graphics, and marketing creatives — designed so businesses look premium
              and get remembered.
            </motion.p>

            <motion.div
              className="mt-9 flex flex-wrap items-center gap-3"
              initial={{ y: 14 }}
              animate={{ y: 0 }}
              transition={{ delay: 1.85, duration: 0.55 }}
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

      {/* Side craft cycle — graphic + marketing words */}
      <aside className="pointer-events-none absolute bottom-8 left-5 z-10 md:bottom-auto md:left-auto md:right-8 md:top-1/2 md:-translate-y-1/2">
        <a
          href="#services"
          className="pointer-events-auto hero-perspective flex max-w-[15rem] flex-col items-start gap-2 rounded-2xl border border-ink/8 bg-white/75 px-4 py-3.5 shadow-[0_18px_40px_-28px_rgba(14,14,14,0.35)] backdrop-blur-md transition hover:-translate-y-1 md:px-5 md:py-4"
        >
          <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-ink/40">
            We craft
          </span>
          <span className="relative block h-[1.4em] w-full overflow-hidden font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
            <AnimatePresence mode="wait">
              <motion.span
                key={cycleWords[wordIndex]}
                className="absolute inset-x-0 top-0 brand-shimmer"
                initial={{ y: 20, rotateX: 55 }}
                animate={{ y: 0, rotateX: 0 }}
                exit={{ y: -20, rotateX: -55 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {cycleWords[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
          <span className="hero-cycle-line h-0.5 w-20 rounded-full bg-brand" aria-hidden />
          <span className="text-xs font-semibold text-ink/45">Graphic · Marketing →</span>
        </a>
      </aside>
    </section>
  )
}
