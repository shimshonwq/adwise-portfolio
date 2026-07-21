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
    <section id="top" className="relative min-h-[100svh] overflow-hidden bg-paper text-ink">
      {/* Light atmosphere with soft gold + white mix */}
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="gold-field absolute inset-0" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.9),transparent_28%),radial-gradient(circle_at_78%_28%,rgba(253,198,33,0.42),transparent_34%),radial-gradient(circle_at_55%_80%,rgba(253,198,33,0.18),transparent_30%),radial-gradient(circle_at_8%_78%,rgba(14,14,14,0.05),transparent_28%)]" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-white/70 via-paper/55 to-paper lg:bg-[linear-gradient(105deg,rgba(255,255,255,0.92)_0%,rgba(247,244,238,0.88)_38%,rgba(253,198,33,0.18)_72%,rgba(247,244,238,0.95)_100%)]"
          aria-hidden
        />
      </div>

      {/* Eye-catching logo / tagline art */}
      <div className="pointer-events-none absolute inset-x-0 top-[7.5rem] z-0 flex justify-center px-6 md:inset-y-0 md:right-[-2%] md:left-auto md:top-0 md:w-[58%] md:items-center md:justify-end md:px-0 lg:w-[54%]">
        <div className="relative w-full max-w-[420px] md:max-w-none md:w-[92%]">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(253,198,33,0.35)_0%,rgba(255,255,255,0.55)_42%,transparent_70%)] blur-2xl"
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
              className="mx-auto h-auto w-full max-w-[340px] drop-shadow-[0_28px_60px_rgba(14,14,14,0.18)] select-none sm:max-w-[400px] md:max-w-none md:w-full"
            />
          </motion.div>
        </div>
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-[22rem] md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-xl lg:max-w-2xl">
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-deep shadow-sm backdrop-blur-sm"
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
            className="font-display text-[clamp(2.5rem,6.4vw,4.6rem)] font-bold leading-[1.05] tracking-tight text-ink"
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
            <a href="#contact" className="btn btn-secondary">
              Start a project
            </a>
          </motion.div>
        </div>
      </div>

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
