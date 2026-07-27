import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FaBullhorn, FaCamera, FaPaintBrush, FaPenNib, FaVideo } from 'react-icons/fa'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const bgIcons = [
  { Icon: FaPaintBrush, className: 'hero-bg-icon hero-bg-icon-a right-[8%] top-[22%] md:right-[14%] md:top-[24%]' },
  { Icon: FaVideo, className: 'hero-bg-icon hero-bg-icon-b right-[22%] top-[48%] md:right-[28%] md:top-[46%]' },
  { Icon: FaBullhorn, className: 'hero-bg-icon hero-bg-icon-c right-[6%] top-[62%] md:right-[10%] md:top-[58%]' },
  { Icon: FaCamera, className: 'hero-bg-icon hero-bg-icon-d right-[30%] top-[28%] md:right-[36%] md:top-[30%]' },
  { Icon: FaPenNib, className: 'hero-bg-icon hero-bg-icon-e right-[18%] top-[72%] md:right-[22%] md:top-[68%]' },
]

const OPEN_NAME = 'Adwise Media'

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
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)
  const [veilOut, setVeilOut] = useState(false)

  useEffect(() => {
    let i = 0
    const typeId = window.setInterval(() => {
      i += 1
      setTyped(OPEN_NAME.slice(0, i))
      if (i >= OPEN_NAME.length) {
        window.clearInterval(typeId)
        setTypingDone(true)
        window.setTimeout(() => setVeilOut(true), 850)
      }
    }, 95)
    return () => window.clearInterval(typeId)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => {
      setWordIndex((n) => (n + 1) % cycleWords.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [])

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Constellation + hand-typed Adwise Media */}
      <div
        className={`hero-open pointer-events-none fixed inset-0 z-[60] ${veilOut ? 'hero-open-out' : ''}`}
        aria-hidden
      >
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
          <p className="font-display text-[clamp(1.85rem,6vw,3.25rem)] font-bold tracking-tight text-ink">
            <span>{typed}</span>
            <span
              className={`hero-type-caret ml-0.5 inline-block h-[0.95em] w-[0.08em] translate-y-[0.08em] bg-brand align-middle ${
                typingDone ? 'hero-type-caret-done' : ''
              }`}
            />
          </p>
          <p
            className={`mt-3 text-[0.7rem] font-extrabold uppercase tracking-[0.35em] text-brand-deep transition-opacity duration-500 md:text-xs ${
              typingDone ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {siteConfig.tagline}
          </p>
          <span
            className={`mx-auto mt-5 block h-0.5 w-28 rounded-full bg-brand transition-transform duration-700 origin-center ${
              typingDone ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </div>
      </div>

      {/* Soft atmosphere + subtle craft icons in the background */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="hero-blob hero-blob-a right-[-8%] top-[18%] h-[42vmin] w-[42vmin] bg-brand/35 md:right-[6%] md:top-[20%]" />
        <div className="hero-blob hero-blob-b right-[18%] top-[52%] h-[26vmin] w-[26vmin] bg-white/75 md:right-[26%]" />
        <div className="hero-blob hero-blob-c bottom-[12%] left-[8%] h-[20vmin] w-[20vmin] bg-brand/20 md:left-[12%]" />
        {bgIcons.map(({ Icon, className }) => (
          <span key={className} className={className}>
            <Icon />
          </span>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/25 via-transparent to-paper/75 md:bg-gradient-to-r md:from-paper md:via-paper/55 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-center py-28 md:py-32">
        <div className="grid items-end gap-10 md:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.55fr)] md:items-center md:gap-12">
          <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
            <div className={`hero-content-3d ${veilOut ? 'hero-content-ready' : ''}`}>
              <motion.span
                className="panel-3d mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep backdrop-blur-sm"
                initial={{ x: -12 }}
                animate={{ x: 0 }}
                transition={{ delay: 2.15, duration: 0.55 }}
              >
                <span className="pulse-dot" aria-hidden />
                Graphic design & marketing studio
              </motion.span>

              <AnimatedText
                as="h1"
                text="Design that makes your brand stand out."
                immediate
                shimmer
                delay={2.1}
                className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
              />

              <motion.p
                className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ delay: 2.4, duration: 0.55 }}
              >
                Logos, visuals, and campaigns — built to look sharp everywhere you show up.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3"
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ delay: 2.55, duration: 0.55 }}
              >
                <a href="#work" className="btn btn-primary">
                  View clients
                </a>
                <a href="#contact" className="btn btn-brand">
                  Start a project
                </a>
              </motion.div>
            </div>
          </div>

          {/* Craft cycle — in-flow, never overlays CTAs or cards */}
          <aside className="w-full max-w-xs justify-self-start md:justify-self-end">
            <a
              href="#services"
              className="hero-perspective panel-3d flex w-full flex-col items-start gap-2 border border-ink/8 bg-white/80 px-5 py-4 backdrop-blur-md transition hover:-translate-y-1"
            >
              <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.22em] text-ink/40">
                We craft
              </span>
              <span className="relative block h-[1.45em] w-full overflow-hidden font-display text-xl font-bold tracking-tight text-ink md:text-2xl">
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
              <span className="text-xs font-semibold text-ink/45">See what we do →</span>
            </a>
            <p className="sr-only">{siteConfig.name}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
