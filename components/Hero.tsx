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
      {/* Layered 3D opening — ink → gold → paper zoom reveal */}
      <div className="hero-perspective pointer-events-none fixed inset-0 z-[60]" aria-hidden>
        <div className="hero-layer hero-layer-ink" />
        <div className="hero-layer hero-layer-gold" />
        <div className="hero-layer hero-layer-paper" />
        <p className="hero-open-mark absolute inset-x-0 top-[46%] text-center font-display text-sm font-bold uppercase tracking-[0.4em] text-brand md:text-base">
          {siteConfig.name}
        </p>
      </div>

      <div className="hero-scene-zoom absolute inset-0">
        {/* Soft blended Thinking graphic + 3D logo entrance */}
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(253,198,33,0.38),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.8),transparent_30%)]" />
          <div className="hero-perspective absolute left-1/2 top-[16%] w-[125%] -translate-x-1/2 opacity-40 mix-blend-multiply md:left-auto md:right-[-10%] md:top-1/2 md:w-[62%] md:translate-x-0 md:-translate-y-1/2 md:opacity-95 md:mix-blend-normal">
            <div className="relative">
              <div className="hero-bulb-glow absolute left-[62%] top-[38%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.9)_0%,rgba(253,198,33,0.35)_36%,transparent_70%)] blur-2xl md:left-[68%] md:top-[36%]" />
              <div className="hero-bulb-ring absolute left-[62%] top-[38%] h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-brand/70 md:left-[68%] md:top-[36%]" />
              <div className="hero-bulb-ring-delay absolute left-[62%] top-[38%] h-[48%] w-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/45 md:left-[68%] md:top-[36%]" />
              <div className="hero-logo-enter">
                <div className="hero-float-3d">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/hero-logo.png"
                    alt=""
                    className="relative w-full max-w-none select-none drop-shadow-[0_30px_50px_rgba(14,14,14,0.18)]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-paper/35 via-transparent to-paper/85 md:bg-gradient-to-r md:from-paper md:via-paper/70 md:to-transparent" />
        </div>

        <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
          <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
            <div className="hero-content-3d">
              <motion.span
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm"
                initial={{ x: -12 }}
                animate={{ x: 0 }}
                transition={{ delay: 1.25, duration: 0.5 }}
              >
                <span className="pulse-dot" aria-hidden />
                Branding & marketing studio
              </motion.span>

              <AnimatedText
                as="h1"
                text="We make brands impossible to ignore."
                immediate
                shimmer
                delay={1.2}
                className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
              />

              <motion.p
                className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ delay: 1.45, duration: 0.55 }}
              >
                Strategy-led logos, brand systems, and marketing creatives that make businesses look
                premium — and get remembered.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3"
                initial={{ y: 14 }}
                animate={{ y: 0 }}
                transition={{ delay: 1.55, duration: 0.55 }}
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
