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
]

export default function Hero() {
  return (
    <section id="top" className="relative min-h-[100svh] overflow-hidden section-aurora text-ink">
      {/* Soft blended Thinkink atmosphere — no heavy frame */}
      <div className="pointer-events-none absolute inset-0 -z-0" aria-hidden>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(253,198,33,0.32),transparent_36%),radial-gradient(circle_at_18%_70%,rgba(255,255,255,0.75),transparent_30%)]" />
        <div className="absolute left-1/2 top-[18%] w-[120%] -translate-x-1/2 opacity-35 mix-blend-multiply md:left-auto md:right-[-8%] md:top-1/2 md:w-[58%] md:translate-x-0 md:-translate-y-1/2 md:opacity-90 md:mix-blend-normal">
          <div className="relative">
            <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.35),transparent_65%)] blur-3xl" />
            <div className="motion-safe:animate-[float_20s_ease-in-out_infinite]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero-logo.png"
                alt=""
                className="relative w-full max-w-none select-none drop-shadow-[0_24px_60px_rgba(14,14,14,0.12)]"
              />
            </div>
          </div>
        </div>
        {/* Soft fade so type stays readable over the art */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/40 via-transparent to-paper/80 md:bg-gradient-to-r md:from-paper md:via-paper/75 md:to-transparent" />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-xl lg:max-w-2xl">
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/85 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm"
            initial={{ x: -12 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pulse-dot" aria-hidden />
            Creative studio
          </motion.span>

          <AnimatedText
            as="h1"
            text="We make brands impossible to ignore."
            immediate
            shimmer
            className="font-display text-[clamp(2.5rem,6.2vw,4.5rem)] font-bold leading-[1.05] tracking-tight"
          />

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/60 md:text-xl"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
          >
            Professional branding, logos, and graphics designed to make businesses stand out and stay
            remembered.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ y: 14 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.45, duration: 0.55 }}
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

      {/* Accessible label for the decorative Thinkink art */}
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
