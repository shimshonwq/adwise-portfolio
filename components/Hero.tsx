import { useEffect, useMemo, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { siteConfig } from '../config/site.config'

const OPEN_NAME = 'ADWISE MEDIA'
const LETTERS = OPEN_NAME.split('')
const HEADLINE = 'Turn heads. Grow brands.'

type Phase = 'void' | 'burst' | 'assemble' | 'lock' | 'exit' | 'done'

/** Lightbulb + craft marks that react to page scroll */
function HeroOrbit({ active }: { active: boolean }) {
  const { scrollY } = useScroll()
  const yRaw = useTransform(scrollY, [0, 640], [0, 195])
  const xRaw = useTransform(scrollY, [0, 640], [0, 48])
  const rotateRaw = useTransform(scrollY, [0, 720], [0, 50])
  const bulbRaw = useTransform(scrollY, [0, 720], [0, -78])
  const ringRaw = useTransform(scrollY, [0, 720], [0, 260])
  const scaleRaw = useTransform(scrollY, [0, 600], [1, 0.82])

  const y = useSpring(yRaw, { stiffness: 70, damping: 22, mass: 0.6 })
  const x = useSpring(xRaw, { stiffness: 70, damping: 22, mass: 0.6 })
  const rotate = useSpring(rotateRaw, { stiffness: 55, damping: 20 })
  const bulbRotate = useSpring(bulbRaw, { stiffness: 50, damping: 18 })
  const ringRotate = useSpring(ringRaw, { stiffness: 40, damping: 18 })
  const ringRev = useTransform(ringRotate, (v) => -v * 0.7)
  const scale = useSpring(scaleRaw, { stiffness: 70, damping: 22 })

  return (
    <motion.div
      className="hero-orbit"
      aria-hidden
      initial={{ opacity: 0, scale: 0.88, x: 28 }}
      animate={active ? { opacity: 1 } : { opacity: 0 }}
      style={active ? { y, x, rotate, scale } : undefined}
      transition={{ duration: 0.85, delay: active ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="hero-orbit-glow" />
      <div className="hero-orbit-core">
        <motion.span className="hero-orbit-ring hero-orbit-ring-outer" style={{ rotate: ringRotate }} />
        <motion.span className="hero-orbit-ring hero-orbit-ring-mid" style={{ rotate: ringRev }} />
        <span className="hero-orbit-ring hero-orbit-ring-inner" />
        <span className="hero-orbit-cross hero-orbit-cross-h" />
        <span className="hero-orbit-cross hero-orbit-cross-v" />
        <motion.span className="hero-orbit-mark" style={{ rotate: bulbRotate }}>
          <svg viewBox="0 0 120 120" className="hero-orbit-ink" aria-hidden>
            <path
              d="M60 18c-16 0-28 12.5-28 28 0 10.5 5.5 19.5 14 24.2V80c0 3.3 2.7 6 6 6h16c3.3 0 6-2.7 6-6V70.2c8.5-4.7 14-13.7 14-24.2C88 30.5 76 18 60 18z"
              fill="currentColor"
            />
            <path
              d="M48 92h24M51 100h18"
              fill="none"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M60 28v14M48 34l8 10M72 34l-8 10"
              fill="none"
              stroke="#111111"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.35"
            />
          </svg>
        </motion.span>
      </div>

      <span className="hero-orbit-chip hero-orbit-chip-a" />
      <span className="hero-orbit-chip hero-orbit-chip-b" />
      <span className="hero-orbit-chip hero-orbit-chip-c" />
      <span className="hero-orbit-dot hero-orbit-dot-a" />
      <span className="hero-orbit-dot hero-orbit-dot-b" />
      <span className="hero-orbit-dot hero-orbit-dot-c" />
      <span className="hero-orbit-arc" />
      <span className="hero-orbit-nib" />
    </motion.div>
  )
}

/** Cinematic opening — gold shock, then a quick typewriter headline */
export default function Hero() {
  const [phase, setPhase] = useState<Phase>('void')
  const [ready, setReady] = useState(false)
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  const scatters = useMemo(
    () =>
      LETTERS.map((_, i) => ({
        x: 0,
        y: 14 + (i % 3) * 2,
        r: 0,
        delay: 0.012 * i,
      })),
    [],
  )

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setPhase('done')
      setReady(true)
      setTyped(HEADLINE)
      setTypingDone(true)
      return
    }

    const t1 = window.setTimeout(() => setPhase('burst'), 40)
    const t2 = window.setTimeout(() => setPhase('assemble'), 80)
    const t3 = window.setTimeout(() => setPhase('lock'), 520)
    const t4 = window.setTimeout(() => setPhase('exit'), 780)
    const t5 = window.setTimeout(() => {
      setPhase('done')
      setReady(true)
    }, 1150)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
    }
  }, [])

  useEffect(() => {
    if (!ready || typingDone) return
    let i = 0
    setTyped('')
    const id = window.setInterval(() => {
      i += 1
      setTyped(HEADLINE.slice(0, i))
      if (i >= HEADLINE.length) {
        window.clearInterval(id)
        setTypingDone(true)
      }
    }, 28)
    return () => window.clearInterval(id)
  }, [ready, typingDone])

  const showVeil = phase !== 'done'

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora text-ink">
      {showVeil && (
        <div className={`hero-shock ${phase === 'exit' ? 'hero-shock-exit' : ''}`} aria-hidden>
          <div className="hero-shock-void" />
          {(phase === 'burst' || phase === 'assemble' || phase === 'lock' || phase === 'exit') && (
            <span className="hero-shock-core" />
          )}

          <div className="hero-shock-copy">
            <p className="hero-shock-letters" aria-label="Adwise Media">
              {LETTERS.map((ch, i) => {
                const s = scatters[i]
                const assembled = phase === 'assemble' || phase === 'lock' || phase === 'exit'
                const locked = phase === 'lock' || phase === 'exit'
                return (
                  <span
                    key={`${ch}-${i}`}
                    className={`hero-shock-letter ${ch === ' ' ? 'hero-shock-space' : ''} ${
                      assembled ? 'is-in' : ''
                    } ${locked ? 'is-lock' : ''}`}
                    style={
                      {
                        '--lx': `${s.x}px`,
                        '--ly': `${s.y}px`,
                        '--lr': `${s.r}deg`,
                        '--ld': `${s.delay}s`,
                      } as React.CSSProperties
                    }
                  >
                    {ch === ' ' ? '\u00A0' : ch}
                  </span>
                )
              })}
            </p>
            <p
              className={`hero-shock-tag ${
                phase === 'lock' || phase === 'exit' ? 'is-visible' : ''
              }`}
            >
              {siteConfig.tagline}
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="hero-gold-glow absolute right-[-6%] top-[18%] h-[48vmin] w-[48vmin] blur-3xl md:right-[4%] md:top-[22%]" />
      </div>

      <div className="site-shell relative z-10 grid min-h-[100svh] items-center gap-8 pb-14 pt-24 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:gap-8 md:pb-20 md:pt-32 lg:gap-12">
        <div className={`${ready ? 'hero-content-ready' : 'hero-content-wait'}`}>
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.22em] text-ink sm:tracking-[0.28em]">
            <span className="inline-block rounded-md bg-brand px-2.5 py-1">Made to be noticed</span>
          </p>

          <h1
            className="font-display text-[clamp(1.9rem,8.4vw,5.2rem)] font-bold leading-[1.08] tracking-tight text-ink"
            aria-label={HEADLINE}
          >
            {typed}
            {!typingDone && ready && <span className="hero-type-caret" aria-hidden />}
          </h1>

          <motion.p
            className="mt-6 max-w-md font-serif text-[0.98rem] leading-relaxed text-ink/80 md:text-xl"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.35 : 0, duration: 0.55 }}
          >
            Logo design, brand graphics, and marketing that make businesses look sharp — and get
            noticed.{' '}
            <span className="font-serif italic text-brass">Creative that actually works.</span>
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-4"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.45 : 0, duration: 0.55 }}
          >
            <a href="#work" className="btn btn-primary">
              Our clients
            </a>
            <a href="#contact" className="btn btn-brand">
              Start a project
            </a>
          </motion.div>
        </div>

        <div className="relative mx-auto flex w-full max-w-[34rem] flex-col items-center justify-center md:max-w-none md:items-end md:justify-end">
          <HeroOrbit active={ready} />
          <p className="mt-3 font-serif italic text-brass md:mr-8">Scroll — ideas in motion.</p>
        </div>
      </div>

      <span className="sr-only">{siteConfig.tagline}</span>
    </section>
  )
}
