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
    <section id="top" className="relative min-h-[100svh] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-paper" aria-hidden>
        <div className="gold-field absolute inset-0 opacity-95" />
        <div className="pointer-events-none absolute left-1/2 top-[4%] w-[135%] -translate-x-1/2 opacity-30 lg:left-auto lg:right-[-10%] lg:top-1/2 lg:w-[56%] lg:translate-x-0 lg:-translate-y-1/2 lg:opacity-90">
          <div className="motion-safe:animate-[float_18s_ease-in-out_infinite]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/tagline-hero.png" alt="" className="w-full max-w-none select-none" />
          </div>
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-paper/80 via-paper/55 to-paper lg:bg-gradient-to-r lg:from-paper lg:via-paper/90 lg:to-transparent"
          aria-hidden
        />
      </div>

      <div className="site-shell relative flex min-h-[100svh] flex-col justify-end pb-28 pt-28 md:justify-center md:pb-32 md:pt-32">
        <div className="max-w-2xl">
          <motion.img
            src="/logo.png"
            alt={siteConfig.name}
            width={420}
            height={130}
            className="mb-9 h-14 w-auto md:mb-11 md:h-20"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          <AnimatedText
            as="h1"
            text="Logos & graphics for businesses."
            className="font-display text-[clamp(2.6rem,6.8vw,4.8rem)] font-bold leading-[1.05] tracking-tight text-ink"
          />

          <motion.p
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/60 md:text-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            We design logos, brand graphics, and visuals that help companies look sharp, stand out,
            and get remembered.
          </motion.p>

          <motion.div
            className="mt-9 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.55 }}
          >
            <a href="#work" className="btn btn-primary">
              See our logos
            </a>
            <a href="#contact" className="btn btn-secondary">
              Start a project
            </a>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 overflow-hidden border-t border-ink/10 bg-ink py-3.5 text-brand">
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
