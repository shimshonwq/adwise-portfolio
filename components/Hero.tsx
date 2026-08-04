import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const craftStrip = [
  'Logo Design',
  'Brand Graphics',
  'Campaign Creatives',
  'Signage',
  'Print Systems',
  'Content Design',
]

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora text-ink">
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_32%,rgba(253,198,33,0.38),transparent_38%),radial-gradient(circle_at_18%_72%,rgba(255,255,255,0.8),transparent_32%)]" />
        <div className="hero-gold-glow absolute right-[-6%] top-[18%] h-[48vmin] w-[48vmin] rounded-full blur-3xl md:right-[4%] md:top-[22%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/85 md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-xl lg:max-w-2xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm">
            <span className="pulse-dot" aria-hidden />
            The business of creative
          </span>

          <AnimatedText
            as="h1"
            text="Turn heads. Grow brands."
            immediate
            shimmer
            className="font-display text-[clamp(2.6rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
          />

          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl">
            Logo design, brand graphics, and marketing that make businesses look sharp — and get
            noticed.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <a href="#work" className="btn btn-primary">
              Our clients
            </a>
            <a href="#contact" className="btn btn-brand">
              Start a project
            </a>
          </div>

          <a
            href="#work"
            className="mt-12 inline-flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.28em] text-ink/40 transition hover:text-ink"
          >
            Scroll
            <span className="inline-block h-px w-10 bg-current" aria-hidden />
          </a>
        </div>
      </div>

      <span className="sr-only">{siteConfig.tagline}</span>

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
