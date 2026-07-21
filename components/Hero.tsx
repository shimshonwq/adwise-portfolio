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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(255,255,255,0.08),transparent_22%),radial-gradient(circle_at_82%_26%,rgba(253,198,33,0.18),transparent_28%),radial-gradient(circle_at_64%_72%,rgba(253,198,33,0.12),transparent_24%)]" />
        <div className="pointer-events-none absolute left-1/2 top-[8%] w-[155%] -translate-x-1/2 opacity-[0.18] mix-blend-screen lg:left-auto lg:right-[-6%] lg:top-1/2 lg:w-[70%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-60">
          <div className="motion-safe:animate-[float_18s_ease-in-out_infinite]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tagline-hero.png" alt="" className="w-full max-w-none select-none" />
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-ink/68 to-ink lg:bg-[linear-gradient(90deg,rgba(14,14,14,0.95)_0%,rgba(14,14,14,0.86)_38%,rgba(14,14,14,0.62)_68%,rgba(14,14,14,0.82)_100%)]"
          aria-hidden
        />
      </div>

      <div className="site-shell relative z-10 flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="relative max-w-2xl">
          <div
            className="pointer-events-none absolute left-[-6%] top-[18%] -z-10 h-[320px] w-[320px] rounded-full hero-gold-glow blur-3xl md:h-[440px] md:w-[440px]"
            aria-hidden
          />

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
            className="font-display text-[clamp(2.6rem,6.8vw,4.8rem)] font-bold leading-[1.05] tracking-tight text-white"
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
