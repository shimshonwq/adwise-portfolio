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
      <div className="absolute inset-0 -z-10" aria-hidden>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_28%,rgba(253,198,33,0.38),transparent_34%),radial-gradient(circle_at_12%_78%,rgba(255,255,255,0.8),transparent_30%)]" />
      </div>

      <div className="site-shell relative z-10 grid min-h-[100svh] items-center gap-10 pb-28 pt-28 md:grid-cols-12 md:gap-8 md:pb-32 md:pt-32">
        {/* Copy */}
        <div className="order-2 md:order-1 md:col-span-5 lg:col-span-5">
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
            className="font-display text-[clamp(2.4rem,5.8vw,4.2rem)] font-bold leading-[1.05] tracking-tight"
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

        {/* Thinkink graphic — premium framed stage */}
        <div className="order-1 md:order-2 md:col-span-7 lg:col-span-7">
          <motion.div
            className="relative mx-auto w-full max-w-[520px] md:max-w-none"
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="pointer-events-none absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_55%_40%,rgba(253,198,33,0.45),rgba(255,255,255,0.35)_42%,transparent_70%)] blur-2xl"
              aria-hidden
            />
            <div className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-gradient-to-br from-ink via-[#1a1608] to-ink p-8 shadow-[0_40px_80px_-40px_rgba(14,14,14,0.55)] sm:p-10 md:p-12 lg:p-14">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_35%,rgba(253,198,33,0.2),transparent_45%)]"
                aria-hidden
              />
              <div className="motion-safe:animate-[float_18s_ease-in-out_infinite]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/hero-logo.png"
                  alt={siteConfig.tagline}
                  className="relative z-10 mx-auto h-auto w-full max-w-[420px] drop-shadow-[0_20px_50px_rgba(253,198,33,0.25)] select-none md:max-w-[480px]"
                />
              </div>
            </div>
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
