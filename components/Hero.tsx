import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const marqueeItems = [
  'Logo Design',
  'Graphic Design',
  'Business Branding',
  'Signage',
  'Print Design',
  'Brand Identity',
  'Marketing',
  'Content Creation',
]

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Full-viewport opening veil — ink flash then reveal */}
      <div
        className="hero-open-veil pointer-events-none fixed inset-0 z-[60] bg-ink"
        aria-hidden
      >
        <div className="hero-open-flash absolute left-1/2 top-[42%] h-[min(70vw,520px)] w-[min(70vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.95)_0%,rgba(253,198,33,0.45)_35%,transparent_68%)] blur-md" />
        <p className="absolute inset-x-0 top-[48%] text-center font-display text-sm font-bold uppercase tracking-[0.45em] text-brand md:text-base">
          {siteConfig.name}
        </p>
      </div>

      {/* Soft blended Thinking graphic + creative opening entrance */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(253,198,33,0.38),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.8),transparent_30%)]" />
        <div className="absolute left-1/2 top-[16%] w-[125%] -translate-x-1/2 opacity-40 mix-blend-multiply md:left-auto md:right-[-10%] md:top-1/2 md:w-[62%] md:translate-x-0 md:-translate-y-1/2 md:opacity-95 md:mix-blend-normal">
          <div className="relative">
            <div className="hero-bulb-glow absolute left-[62%] top-[38%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.95)_0%,rgba(253,198,33,0.4)_36%,transparent_70%)] blur-2xl md:left-[68%] md:top-[36%]" />
            <div className="hero-bulb-ring absolute left-[62%] top-[38%] h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand md:left-[68%] md:top-[36%]" />
            <div className="hero-bulb-ring-delay absolute left-[62%] top-[38%] h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/60 md:left-[68%] md:top-[36%]" />
            <div className="hero-beam absolute left-[20%] top-[-10%] h-[140%] w-[28%] bg-gradient-to-r from-transparent via-brand/35 to-transparent blur-xl" />
            <div className="hero-logo-enter">
              <div className="motion-safe:animate-[float_20s_ease-in-out_infinite]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-logo.png"
                  alt=""
                  className="relative w-full max-w-none select-none"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/85 md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-xl lg:max-w-2xl">
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm"
            initial={{ x: -16 }}
            animate={{ x: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
          >
            <span className="pulse-dot" aria-hidden />
            Branding & marketing studio
          </motion.span>

          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.95, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <AnimatedText
              as="h1"
              text="We make brands impossible to ignore."
              immediate
              shimmer
              delay={1}
              className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
            />
          </motion.div>

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.15, duration: 0.55 }}
          >
            Strategy-led logos, brand systems, and marketing creatives that make businesses look
            premium — and get remembered.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ delay: 1.25, duration: 0.55 }}
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

      <span className="sr-only">{siteConfig.tagline}</span>

      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-ink/10 bg-ink py-3.5 text-brand">
        <div className="marquee-track flex gap-12 whitespace-nowrap px-6 text-xs font-extrabold tracking-[0.22em] uppercase md:text-sm">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-12">
              {marqueeItems.map((label) => (
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
