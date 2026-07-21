import { motion } from 'framer-motion'
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
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="gold-field-dark absolute inset-0" />
        <div className="pointer-events-none absolute left-1/2 top-[4%] w-[135%] -translate-x-1/2 opacity-20 lg:left-auto lg:right-[-10%] lg:top-1/2 lg:w-[56%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-75">
          <div className="motion-safe:animate-[float_18s_ease-in-out_infinite]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tagline-hero.png" alt="" className="w-full max-w-none select-none" />
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/70 to-ink lg:bg-gradient-to-r lg:from-ink lg:via-ink/85 lg:to-ink/60"
          aria-hidden
        />
      </div>

      <div className="site-shell relative flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="max-w-2xl">
          <motion.span
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="pulse-dot" aria-hidden />
            Creative studio
          </motion.span>

          <AnimatedText
            as="h1"
            text="We catch eyes."
            immediate
            className="font-display text-[clamp(2.6rem,6.8vw,4.8rem)] font-bold leading-[1.05] tracking-tight text-white"
          />

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-white/65 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Professional branding, logos, and graphics designed to make businesses stand out and stay
            remembered.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
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

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-brand/20 bg-brand py-3.5 text-ink">
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
