import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'

const OPEN_NAME = 'ADWISE MEDIA'
const LETTERS = OPEN_NAME.split('')
const HEADLINE = 'Turn heads. Grow brands.'

type Phase = 'void' | 'burst' | 'assemble' | 'lock' | 'exit' | 'done'

/** Cinematic opening — gold shock, then a quick typewriter headline */
export default function Hero() {
  const [phase, setPhase] = useState<Phase>('void')
  const [ready, setReady] = useState(false)
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  const scatters = useMemo(
    () =>
      LETTERS.map((_, i) => {
        const angle = (i / LETTERS.length) * Math.PI * 2 + (i % 3) * 0.4
        const dist = 180 + (i % 5) * 55
        return {
          x: Math.cos(angle) * dist * (i % 2 === 0 ? 1.4 : -1.2),
          y: Math.sin(angle) * dist * (i % 2 === 0 ? -1.1 : 1.3),
          r: (i % 2 === 0 ? 1 : -1) * (28 + (i % 4) * 18),
          delay: 0.04 * i,
        }
      }),
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

    const t1 = window.setTimeout(() => setPhase('burst'), 280)
    const t2 = window.setTimeout(() => setPhase('assemble'), 720)
    const t3 = window.setTimeout(() => setPhase('lock'), 2100)
    const t4 = window.setTimeout(() => setPhase('exit'), 2900)
    const t5 = window.setTimeout(() => {
      setPhase('done')
      setReady(true)
    }, 3700)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
    }
  }, [])

  // Quick typewriter as soon as the opening peels away
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
            <>
              <span className="hero-shock-core" />
              <span className="hero-shock-ring hero-shock-ring-a" />
              <span className="hero-shock-ring hero-shock-ring-b" />
              <span className="hero-shock-ring hero-shock-ring-c" />
              <span className="hero-shock-flare" />
              {Array.from({ length: 14 }).map((_, i) => (
                <span
                  key={i}
                  className="hero-shock-shard"
                  style={
                    {
                      '--sx': `${(i % 2 === 0 ? 1 : -1) * (40 + i * 18)}px`,
                      '--sy': `${(i % 3 === 0 ? -1 : 1) * (30 + i * 14)}px`,
                      '--sd': `${0.02 * i}s`,
                      '--sr': `${(i % 2 === 0 ? 1 : -1) * (20 + i * 8)}deg`,
                    } as React.CSSProperties
                  }
                />
              ))}
            </>
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(253,198,33,0.38),transparent_38%),radial-gradient(circle_at_18%_72%,rgba(255,255,255,0.8),transparent_32%)]" />
        <div className="hero-gold-glow absolute right-[-6%] top-[18%] h-[48vmin] w-[48vmin] rounded-full blur-3xl md:right-[4%] md:top-[22%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/85 md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-28 md:justify-center md:pb-20 md:pt-32">
        <div
          className={`relative max-w-xl lg:max-w-2xl ${ready ? 'hero-content-ready' : 'hero-content-wait'}`}
        >
          <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.28em] text-brand-deep">
            Made to be noticed
          </p>

          <h1
            className="font-display text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight brand-shimmer"
            aria-label={HEADLINE}
          >
            {typed}
            {!typingDone && ready && <span className="hero-type-caret" aria-hidden />}
          </h1>

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/75 md:text-xl"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.35 : 0, duration: 0.55 }}
          >
            Logo design, brand graphics, and marketing that make businesses look sharp — and get
            noticed.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
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
      </div>

      <span className="sr-only">{siteConfig.tagline}</span>
    </section>
  )
}
