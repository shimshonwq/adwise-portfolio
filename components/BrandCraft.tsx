import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'

const MARKS = [
  {
    id: 'a-bolt',
    label: 'Mark',
    tone: 'ink' as const,
    svg: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <rect width="120" height="120" fill="currentColor" opacity="0" />
        <path
          d="M18 98 L52 22 H68 L102 98 H82 L74 78 H46 L38 98 Z M52 62 H68 L60 42 Z"
          fill="currentColor"
        />
        <circle cx="96" cy="28" r="8" fill="var(--color-signal)" />
      </svg>
    ),
  },
  {
    id: 'signal-ring',
    label: 'Signal',
    tone: 'brand' as const,
    svg: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <circle cx="60" cy="60" r="46" fill="none" stroke="currentColor" strokeWidth="6" />
        <circle cx="60" cy="60" r="28" fill="none" stroke="currentColor" strokeWidth="4" opacity="0.55" />
        <circle cx="60" cy="60" r="10" fill="var(--color-signal)" />
      </svg>
    ),
  },
  {
    id: 'slash-lockup',
    label: 'Lockup',
    tone: 'paper' as const,
    svg: (
      <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden>
        <path d="M22 98 L78 18" stroke="currentColor" strokeWidth="10" strokeLinecap="square" />
        <rect x="70" y="72" width="32" height="12" fill="var(--color-brand)" />
        <rect x="18" y="28" width="18" height="18" fill="var(--color-signal)" />
      </svg>
    ),
  },
]

/** Visual branding theater — marks, lockups, client logos as design objects */
export default function BrandCraft() {
  const { logos } = useSiteContent()
  const featured = logos.slice(0, 6)

  return (
    <section id="craft" className="craft-stage scroll-mt-24 overflow-hidden py-16 md:py-24">
      <div className="site-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow !text-ink/45">Brand craft</p>
            <h2 className="mt-3 max-w-xl font-display text-[clamp(2.2rem,7vw,4.6rem)] font-extrabold leading-[0.92] tracking-tight text-ink">
              Logos that{' '}
              <span className="font-serif italic text-signal">land</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm font-medium uppercase tracking-[0.18em] text-ink/45 md:text-right">
            Identity · Campaign · Design
          </p>
        </div>

        <div className="craft-grid mt-12 md:mt-16">
          {MARKS.map((mark, i) => (
            <motion.article
              key={mark.id}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`craft-board craft-board-${mark.tone}`}
            >
              <span className="craft-tag">{mark.label}</span>
              <div className="craft-mark">{mark.svg}</div>
            </motion.article>
          ))}

          {featured.map((logo, i) => (
            <motion.article
              key={logo.id}
              initial={{ y: 24, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
              className={`craft-board craft-logo-board ${i % 3 === 0 ? 'is-skew' : ''} ${
                i % 2 === 0 ? 'tone-yellow' : i % 3 === 1 ? 'tone-ink' : 'tone-white'
              }`}
            >
              <span className="craft-tag">{logo.name}</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={logo.src} alt={logo.name} className="craft-logo" draggable={false} />
            </motion.article>
          ))}

          <motion.article
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, delay: 0.2 }}
            className="craft-board craft-board-signal craft-board-wide"
          >
            <p className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-none tracking-tight text-white">
              Thinking your
              <br />
              <span className="font-serif italic text-brand">next thing</span>
            </p>
            <a href="/#contact" className="btn btn-primary mt-8 !bg-white hover:!bg-brand">
              Start a project
            </a>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
