import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'

type Phase = 'void' | 'burst' | 'assemble' | 'lock' | 'exit' | 'done'

/** Full-bleed SIGNAL hero — massive type, yellow field, red spark */
export default function Hero() {
  const { content } = useSiteContent()
  const { hero } = content
  const { tagline, shortName, name } = content.site
  const openName = hero.openName
  const headline = hero.headline
  const showOpening = hero.showOpening !== false
  const letters = useMemo(() => openName.split(''), [openName])

  const [phase, setPhase] = useState<Phase>('void')
  const [ready, setReady] = useState(false)
  // Don't SSR the opening veil — if JS fails to hydrate (e.g. flaky tunnels),
  // a server-rendered veil would leave visitors on a blank black page.
  const [client, setClient] = useState(false)
  useEffect(() => {
    setClient(true)
  }, [])

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
  }, [showOpening])

  const showVeil = client && showOpening && phase !== 'done'
  const words = headline.trim().split(/\s+/)

  return (
    <section id="top" className="hero-stage relative min-h-[100svh] overflow-hidden">
      {showVeil && (
        <div className={`hero-shock ${phase === 'exit' ? 'hero-shock-exit' : ''}`} aria-hidden>
          <div className="hero-shock-void" />
          {(phase === 'burst' || phase === 'assemble' || phase === 'lock' || phase === 'exit') && (
            <span className="hero-shock-core" />
          )}
          <div className="hero-shock-copy">
            <p className="hero-shock-letters" aria-label={name}>
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

      <div className="hero-field" aria-hidden />
      <div className="hero-signal" aria-hidden>
        <span className="hero-signal-ring" />
        <span className="hero-signal-ring-2" />
        <span className="hero-signal-core" />
      </div>
      <p className="hero-watermark" aria-hidden>
        {shortName}
      </p>

      <div className="site-shell relative z-10 grid min-h-[100svh] items-end gap-6 pb-14 pt-24 md:grid-cols-[minmax(0,1.2fr)_minmax(240px,0.75fr)] md:items-end md:pb-20 md:pt-28">
        <div className="hero-content-ready">
          <p className="eyebrow !text-brand">{hero.eyebrow}</p>

          <h1 className="hero-headline mt-5" aria-label={headline}>
            {words.map((word, i) => {
              const accent = i === words.length - 1 && words.length > 1
              return (
                <span key={`${word}-${i}`} className={`hero-word ${accent ? 'is-accent' : ''}`}>
                  {word}
                  {i < words.length - 1 ? '\u00A0' : ''}
                </span>
              )
            })}
          </h1>

          <p className="mt-8 max-w-sm text-sm font-medium tracking-wide text-white/70 md:text-base">
            {hero.body}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a href={hero.ctaPrimaryHref} className="btn btn-primary">
              {hero.ctaPrimaryLabel}
            </a>
            <a href={hero.ctaSecondaryHref} className="btn btn-signal">
              {hero.ctaSecondaryLabel}
            </a>
          </div>
        </div>

        <motion.aside
          className="hero-side"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: ready ? 1 : 0, x: ready ? 0 : 24 }}
          transition={{ delay: ready ? 0.3 : 0, duration: 0.65 }}
          aria-hidden={!ready}
        >
          <div className="hero-side-card">
            <p className="font-display text-[clamp(1.85rem,3.5vw,2.6rem)] font-extrabold leading-none tracking-tight text-ink">
              {shortName}
            </p>
            <p className="mt-3 font-serif text-xl italic text-ink/70">{tagline}</p>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-3 w-3 bg-signal" />
              <span className="h-3 w-10 bg-ink" />
              <span className="h-3 w-16 bg-brand" />
            </div>
            <p className="mt-8 text-xs font-bold uppercase tracking-[0.22em] text-ink/50">
              {hero.bodyAccent}
            </p>
          </div>
        </motion.aside>
      </div>

      <a href="#craft" className="hero-scroll" aria-label="Scroll to brand craft">
        <span className="hero-scroll-arrow" />
      </a>
    </section>
  )
}
