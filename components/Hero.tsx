import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import AnimatedText from './AnimatedText'

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora grain text-ink">
      {/* Creative split-signature opening — gold seam, then panels part */}
      <div className="hero-open hero-perspective pointer-events-none fixed inset-0 z-[60]" aria-hidden>
        <div className="hero-panel-left" />
        <div className="hero-panel-right" />
        <div className="hero-seam" />
        <p className="hero-open-mark font-display text-sm font-bold uppercase tracking-[0.32em] text-brand md:text-base">
          {siteConfig.name}
        </p>
      </div>

      <div className="hero-scene-zoom absolute inset-0">
        <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(253,198,33,0.38),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.8),transparent_30%)]" />
          <div className="hero-perspective absolute left-1/2 top-[14%] w-[125%] -translate-x-1/2 opacity-40 mix-blend-multiply md:left-auto md:right-[-10%] md:top-[46%] md:w-[62%] md:translate-x-0 md:-translate-y-1/2 md:opacity-95 md:mix-blend-normal">
            <div className="relative">
              <div className="absolute left-[62%] top-[38%] h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.55)_0%,rgba(253,198,33,0.18)_40%,transparent_70%)] blur-2xl md:left-[68%] md:top-[36%]" />
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

        <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-36 pt-28 md:justify-center md:pb-40 md:pt-32">
          <div className="hero-perspective relative max-w-xl lg:max-w-2xl">
            <div className="hero-content-3d">
              <motion.span
                className="panel-3d mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep backdrop-blur-sm"
                initial={{ x: -12, rotateY: 10 }}
                animate={{ x: 0, rotateY: 0 }}
                transition={{ delay: 1.7, duration: 0.6 }}
              >
                <span className="pulse-dot" aria-hidden />
                Branding & marketing studio
              </motion.span>

              <AnimatedText
                as="h1"
                text="We make brands impossible to ignore."
                immediate
                shimmer
                delay={1.65}
                className="font-display text-[clamp(2.65rem,6.4vw,4.75rem)] font-bold leading-[1.04] tracking-tight"
              />

              <motion.p
                className="mt-6 max-w-md text-lg leading-relaxed text-ink/65 md:text-xl"
                initial={{ y: 16, rotateX: 6 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ delay: 1.95, duration: 0.6 }}
              >
                Strategy-led logos, brand systems, and marketing creatives that make businesses look
                premium — and get remembered.
              </motion.p>

              <motion.div
                className="mt-9 flex flex-wrap items-center gap-3"
                initial={{ y: 16, rotateX: 6 }}
                animate={{ y: 0, rotateX: 0 }}
                transition={{ delay: 2.1, duration: 0.6 }}
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

      {/* Professional brand ribbon — unique, calm, eye-catching */}
      <div className="absolute inset-x-0 bottom-6 z-10 px-4 md:bottom-8">
        <a
          href="#contact"
          className="hero-ribbon panel-3d mx-auto flex max-w-xl items-center gap-4 rounded-full border border-ink/10 bg-white/90 px-5 py-3.5 backdrop-blur-md transition hover:-translate-y-1 md:gap-5 md:px-7 md:py-4"
        >
          <span className="hero-diamond relative z-10 h-3 w-3 shrink-0 rounded-[2px]" aria-hidden />
          <span className="relative z-10 min-w-0 flex-1">
            <span className="block font-display text-sm font-bold tracking-tight text-ink md:text-base">
              {siteConfig.tagline}
            </span>
            <span className="hero-ribbon-line mt-1.5 block h-px w-full bg-gradient-to-r from-transparent via-brand to-transparent" />
          </span>
          <span className="relative z-10 shrink-0 text-xs font-extrabold uppercase tracking-[0.16em] text-brand-deep">
            Begin →
          </span>
        </a>
      </div>
    </section>
  )
}
