import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'

type Phase = 'void' | 'burst' | 'assemble' | 'lock' | 'exit' | 'done'

/** Full-bleed black hero — yellow signal, sharp type, less copy */
export default function Hero() {
  const { content } = useSiteContent()
  const { hero } = content
  const { tagline, shortName } = content.site
  const openName = hero.openName
  const headline = hero.headline
  const showOpening = hero.showOpening !== false
  const letters = useMemo(() => openName.split(''), [openName])

  const [phase, setPhase] = useState<Phase>('void')
  const [ready, setReady] = useState(false)
  const [typed, setTyped] = useState('')
  const [typingDone, setTypingDone] = useState(false)

  const scatters = useMemo(
    () =>
      letters.map((_, i) => ({
        x: 0,
        y: 16 + (i % 3) * 2,
        r: 0,
        delay: 0.012 * i,
      })),
    [letters],
  )

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !showOpening) {
      setPhase('done')
      setReady(true)
      setTyped(headline)
      setTypingDone(true)
      return
    }

    const t1 = window.setTimeout(() => setPhase('burst'), 40)
    const t2 = window.setTimeout(() => setPhase('assemble'), 90)
    const t3 = window.setTimeout(() => setPhase('lock'), 520)
    const t4 = window.setTimeout(() => setPhase('exit'), 780)
    const t5 = window.setTimeout(() => {
      setPhase('done')
      setReady(true)
    }, 1120)

    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      window.clearTimeout(t3)
      window.clearTimeout(t4)
      window.clearTimeout(t5)
    }
  }, [showOpening, headline])

  useEffect(() => {
    if (!ready || typingDone) return
    let i = 0
    setTyped('')
    const id = window.setInterval(() => {
      i += 1
      setTyped(headline.slice(0, i))
      if (i >= headline.length) {
        window.clearInterval(id)
        setTypingDone(true)
      }
    }, 26)
    return () => window.clearInterval(id)
  }, [ready, typingDone, headline])

  const showVeil = showOpening && phase !== 'done'

  return (
    <section id="top" className="hero-stage relative min-h-[100svh] overflow-hidden">
      {showVeil && (
        <div className={`hero-shock ${phase === 'exit' ? 'hero-shock-exit' : ''}`} aria-hidden>
          <div className="hero-shock-void" />
          {(phase === 'burst' || phase === 'assemble' || phase === 'lock' || phase === 'exit') && (
            <span className="hero-shock-core" />
          )}
          <div className="hero-shock-copy">
            <p className="hero-shock-letters" aria-label={content.site.name}>
              {letters.map((ch, i) => {
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
            <p className={`hero-shock-tag ${phase === 'lock' || phase === 'exit' ? 'is-visible' : ''}`}>
              {tagline}
            </p>
          </div>
        </div>
      )}

      <div className="hero-signal" aria-hidden>
        <span className="hero-signal-ring" />
        <span className="hero-signal-ring-2" />
      </div>
      <span className="hero-slash" aria-hidden />

      <div className="site-shell relative z-10 grid min-h-[100svh] items-end gap-10 pb-16 pt-28 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center md:pb-24 md:pt-32">
        <div className={ready ? 'hero-content-ready' : 'hero-content-wait'}>
          <p className="eyebrow !text-brand/90">{hero.eyebrow}</p>

          <h1
            className="mt-6 font-display text-[clamp(2.4rem,9vw,6.4rem)] font-extrabold leading-[0.92] tracking-tight text-white"
            aria-label={headline}
          >
            {typed}
            {!typingDone && ready && <span className="hero-type-caret" aria-hidden />}
          </h1>

          <motion.p
            className="mt-7 max-w-md text-base leading-relaxed text-white/65 md:text-lg"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.28 : 0, duration: 0.5 }}
          >
            {hero.body}
          </motion.p>

          <motion.div
            className="mt-10 flex flex-wrap items-center gap-3"
            initial={{ y: 14, opacity: 0 }}
            animate={{ y: ready ? 0 : 14, opacity: ready ? 1 : 0 }}
            transition={{ delay: ready ? 0.38 : 0, duration: 0.5 }}
          >
            <a href={hero.ctaPrimaryHref} className="btn btn-primary">
              {hero.ctaPrimaryLabel}
            </a>
            <a href={hero.ctaSecondaryHref} className="btn btn-secondary">
              {hero.ctaSecondaryLabel}
            </a>
          </motion.div>
        </div>

        <motion.div
          className="relative hidden md:block"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: ready ? 1 : 0, scale: ready ? 1 : 0.92 }}
          transition={{ delay: ready ? 0.25 : 0, duration: 0.7 }}
          aria-hidden
        >
          <div className="ml-auto max-w-sm border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm">
            <p className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-none tracking-tight text-brand">
              {shortName}
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
              {tagline}
            </p>
            <div className="mt-8 h-px w-16 bg-brand" />
            <p className="mt-6 text-sm leading-relaxed text-white/55">{hero.bodyAccent}</p>
          </div>
        </motion.div>
      </div>

      <span className="sr-only">{tagline}</span>
    </section>
  )
}
