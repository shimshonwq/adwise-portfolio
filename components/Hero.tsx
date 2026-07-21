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
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-ink text-white">
      {/* Atmosphere */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="gold-field-dark absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(255,255,255,0.07),transparent_24%),radial-gradient(circle_at_78%_30%,rgba(253,198,33,0.22),transparent_30%),radial-gradient(circle_at_60%_78%,rgba(253,198,33,0.1),transparent_28%)]" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/10 via-ink/55 to-ink lg:bg-[linear-gradient(105deg,rgba(14,14,14,0.97)_0%,rgba(14,14,14,0.88)_42%,rgba(14,14,14,0.45)_72%,rgba(14,14,14,0.75)_100%)]"
          aria-hidden
        />
      </div>

      {/* Eye-catching logo / tagline art */}
      <div className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-0 flex justify-center px-6 md:inset-y-0 md:right-[-2%] md:left-auto md:top-0 md:w-[58%] md:items-center md:justify-end md:px-0 lg:w-[54%]">
        <div className="relative w-full max-w-[420px] md:max-w-none md:w-[92%]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full hero-gold-glow blur-3xl"
            aria-hidden
          />
          <motion.div
            className="relative motion-safe:animate-[float_18s_ease-in-out_infinite]"
            initial={{ y: 22, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-logo.png"
              alt={siteConfig.tagline}
              className="mx-auto h-auto w-full max-w-[340px] drop-shadow-[0_30px_80px_rgba(253,198,33,0.22)] select-none sm:max-w-[400px] md:max-w-none md:w-full"
            />
          </motion.div>
        </div>
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-[22rem] md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-xl lg:max-w-2xl">
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand"
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
            className="font-display text-[clamp(2.5rem,6.4vw,4.6rem)] font-bold leading-[1.05] tracking-tight text-white"
          />

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-white/70 md:text-xl"
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
            <a href="#work" className="btn btn-on-dark">
              Our projects
            </a>
            <a href="#contact" className="btn btn-secondary-light">
              Start a project
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-brand/20 bg-brand py-3.5 text-ink">
        <div className="marquee-track flex gap-12 whitespace-nowrap px-6 text-xs font-extrabold tracking-[0.22em] uppercase md:text-sm">
          {Array.from({ length: 2 }).map((_, loop) => (
            <div key={loop} className="flex gap-12">
              {marqueeItems.map((label) => (
                <span key={`${loop}-${label}`} className="inline-flex items-center gap-12">
                  {label}
                  <span className="inline-block h-2 w-2 rounded-full bg-ink" aria-hidden />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
