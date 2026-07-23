import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

const floatChips = [
  { label: 'Brand', className: 'hero-chip-a left-[8%] top-2 md:left-[18%]' },
  { label: 'Design', className: 'hero-chip-b right-[8%] top-0 md:right-[18%]' },
  { label: 'Market', className: 'hero-chip-c left-1/2 top-10 -translate-x-1/2 md:top-12' },
]

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Layered 3D opening — slower ink → gold → paper zoom reveal */}
      <div className="hero-perspective pointer-events-none fixed inset-0 z-[60]" aria-hidden>
        <div className="hero-layer hero-layer-ink" />
        <div className="hero-layer hero-layer-gold" />
        <div className="hero-layer hero-layer-paper" />
        <p className="hero-open-mark absolute inset-x-0 top-[46%] text-center font-display text-sm font-bold uppercase tracking-[0.4em] text-brand md:text-base">
          {siteConfig.name}
        </p>
      </div>

      <div className="hero-scene-zoom absolute inset-0">
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(253,198,33,0.38),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.8),transparent_30%)]" />
          <div className="hero-perspective absolute left-1/2 top-[14%] w-[125%] -translate-x-1/2 opacity-40 mix-blend-multiply md:left-auto md:right-[-10%] md:top-[46%] md:w-[62%] md:translate-x-0 md:-translate-y-1/2 md:opacity-95 md:mix-blend-normal">
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

        <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-40 pt-28 md:justify-center md:pb-44 md:pt-32">
          <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
            <div className="hero-content-3d">
              <motion.span
                className="panel-3d mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep backdrop-blur-sm"
                initial={{ x: -12, rotateY: 12 }}
                animate={{ x: 0, rotateY: 0 }}
                transition={{ delay: 2.25, duration: 0.65 }}
              >
                <span className="pulse-dot" aria-hidden />
                Branding & marketing studio
              </motion.span>

              <AnimatedText
                as="h1"
                text="We make brands impossible to ignore."
                immediate
                shimmer
                delay={2.2}
                className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
              />

              <motion.p
                className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
                initial={{ y: 18, rotateX: 8 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ delay: 2.55, duration: 0.65 }}
              >
                Strategy-led logos, brand systems, and marketing creatives that make businesses look
                premium — and get remembered.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3"
                initial={{ y: 18, rotateX: 8 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ delay: 2.7, duration: 0.65 }}
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

      {/* Eye-catching 3D orb dock — replaces scrolling marquee */}
      <div className="hero-perspective absolute inset-x-0 bottom-0 z-10 pb-5 pt-2">
        <div className="hero-dock relative mx-auto flex h-28 max-w-lg items-end justify-center md:h-32">
          {floatChips.map((chip) => (
            <span
              key={chip.label}
              className={`panel-3d absolute rounded-full border border-ink/10 bg-white/90 px-3.5 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-ink shadow-sm backdrop-blur-sm md:text-xs ${chip.className}`}
            >
              {chip.label}
            </span>
          ))}

          <div className="relative mb-1 h-20 w-20 md:h-24 md:w-24">
            <div className="hero-orbit absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-brand/50" />
            <div className="hero-orbit absolute left-1/2 top-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand/20 [animation-direction:reverse] [animation-duration:20s]" />
            <a
              href="#work"
              className="hero-orb absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full md:h-16 md:w-16"
            >
              <span className="font-display text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink">
                Explore
              </span>
            </a>
          </div>
        </div>
        <div className="hero-scroll-cue mt-1 flex flex-col items-center gap-1 text-[0.65rem] font-bold uppercase tracking-[0.22em] text-ink/45">
          <span>Scroll</span>
          <span className="block h-5 w-px bg-gradient-to-b from-brand to-transparent" aria-hidden />
        </div>
      </div>
    </section>
  )
}
