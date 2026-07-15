import { motion } from 'framer-motion'
import { FiArrowDown, FiArrowUpRight } from 'react-icons/fi'
import { siteConfig } from '../config/site.config'

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden px-5 pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 -right-16 h-80 w-80 rounded-full bg-brand/40 blur-3xl animate-float-slow" />
        <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-brand/25 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/60 px-4 py-1.5 text-sm font-medium text-ink/70 backdrop-blur"
        >
          <span className="h-2 w-2 rounded-full bg-green-500" />
          Available for new projects
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
          className="mt-6 font-heading text-5xl font-bold leading-[1.05] text-ink md:text-7xl"
        >
          Marketing &amp; design that make brands <span className="text-gradient">impossible to ignore</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mx-auto mt-6 max-w-2xl text-lg text-ink/60 md:text-xl"
        >
          {siteConfig.name} — {siteConfig.tagline}. We help brands grow with
          strategic marketing, scroll-stopping content, and standout graphic design.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 text-base font-semibold text-ink shadow-glow transition-transform hover:-translate-y-0.5"
          >
            View our work
            <FiArrowUpRight />
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border-2 border-ink/15 px-7 py-3.5 text-base font-semibold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
          >
            Start a project
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4"
        >
          {siteConfig.stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-heading text-3xl font-bold text-ink md:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-ink/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.a
        href="#services"
        aria-label="Scroll to services"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="mx-auto mt-16 flex w-fit items-center justify-center"
      >
        <motion.span
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 text-ink/60"
        >
          <FiArrowDown />
        </motion.span>
      </motion.a>
    </section>
  )
}
