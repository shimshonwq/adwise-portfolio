import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const OPEN_NAME = 'ADWISE MEDIA'
const LETTERS = OPEN_NAME.split('')

const craftStrip = [
  'Logo Design',
  'Brand Graphics',
  'Campaign Creatives',
  'Signage',
  'Print Systems',
  'Content Design',
]

type Phase = 'void' | 'burst' | 'assemble' | 'lock' | 'exit' | 'done'

/** Cinematic opening — sudden gold shock from nowhere, letters snap in, then reveal */
export default function Hero() {
  const [phase, setPhase] = useState<Phase>('void')
  const [ready, setReady] = useState(false)

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

  const showVeil = phase !== 'done'

  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora text-ink">
      {/* Unexpected opening veil */}
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

      {/* Soft gold atmosphere (no heavy framed art) */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(253,198,33,0.38),transparent_38%),radial-gradient(circle_at_18%_72%,rgba(255,255,255,0.8),transparent_32%)]" />
        <div className="hero-gold-glow absolute right-[-6%] top-[18%] h-[48vmin] w-[48vmin] rounded-full blur-3xl md:right-[4%] md:top-[22%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/85 md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className={`relative max-w-xl lg:max-w-2xl ${ready ? 'hero-content-ready' : 'hero-content-wait'}`}>
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm"
            initial={{ x: -12 }}
            animate={{ x: ready ? 0 : -12 }}
            transition={{ duration: 0.5, delay: ready ? 0.05 : 0 }}
          >
            <span className="pulse-dot" aria-hidden />
            The business of creative
          </motion.span>

          {ready ? (
            <AnimatedText
              key="hero-title"
              as="h1"
              text="Turn heads. Grow brands."
              immediate
              shimmer
              delay={0.05}
              className="font-display text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
            />
          ) : (
            <h1 className="font-display text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight opacity-0">
              Turn heads. Grow brands.
            </h1>
          )}

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.2 : 0, duration: 0.55 }}
          >
            Logo design, brand graphics, and marketing that make businesses look sharp — and get
            noticed.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.3 : 0, duration: 0.55 }}
          >
            <a href="#work" className="btn btn-primary">
              Our clients
            </a>
            <a href="#contact" className="btn btn-brand">
              Start a project
            </a>
          </motion.div>

          <motion.a
            href="#work"
            className="mt-12 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.28em] text-ink/40 transition hover:text-ink"
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.5 : 0 }}
          >
            Scroll
            <span className="hero-scroll-line" aria-hidden />
          </motion.a>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-ink/10 bg-ink py-3.5 text-brand">
        <div className="marquee-track flex gap-12 whitespace-nowrap px-6 text-xs font-extrabold tracking-[0.22em] uppercase md:text-sm">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-12">
              {craftStrip.map((label) => (
                <span key={`${loop}-${label}`} className="inline-flex items-center gap-12">
                  {label}
                  <span className="inline-block h-2 w-2 rounded-full bg-brand" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
