import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedText from './AnimatedText'

const placeholders = [
  { label: 'Logos', delay: 0, tone: 'bg-white' },
  { label: 'Branding', delay: 0.08, tone: 'bg-brand' },
  { label: 'Signage', delay: 0.16, tone: 'bg-ink text-white' },
]

export default function Portfolio() {
  return (
    <section id="work" className="scroll-mt-24 relative overflow-hidden section-aurora-deep py-24 md:py-32">
      <div className="site-shell relative z-10">
        <p className="eyebrow">Our work</p>
        <AnimatedText
          as="h2"
          text="Portfolio coming soon."
          shimmer
          className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl"
        />

        <motion.div
          className="mt-12 max-w-3xl rounded-[1.75rem] border border-ink/10 bg-white/90 p-8 shadow-[0_24px_60px_-36px_rgba(14,14,14,0.28)] backdrop-blur-sm md:p-10"
          initial={{ y: 20 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex items-center gap-3">
            <span className="pulse-dot" aria-hidden />
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-deep">
              Currently in progress
            </p>
          </div>
          <p className="mt-6 font-display text-2xl font-bold leading-snug text-ink md:text-3xl">
            We&apos;re currently working on it.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink/60">
            Our work will be uploaded soon — real client logos, branding, and graphics designed for
            businesses. Check back shortly.
          </p>
          <Link href="#contact" className="btn btn-primary mt-9">
            Start your project now
          </Link>
        </motion.div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {placeholders.map((item, index) => (
            <motion.div
              key={item.label}
              className={`relative flex min-h-[9.5rem] flex-col items-start justify-end overflow-hidden rounded-[1.75rem] border border-ink/8 p-5 shadow-[0_18px_40px_-30px_rgba(14,14,14,0.25)] ${item.tone}`}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: item.delay }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
            >
              <div
                className="placeholder-shimmer"
                style={{ animationDelay: `${index * 0.3}s` }}
                aria-hidden
              />
              <span
                className={`relative z-10 font-display text-sm font-bold uppercase tracking-widest ${
                  item.tone.includes('text-white') ? 'text-white/55' : 'text-ink/45'
                }`}
              >
                {item.label}
              </span>
              <span
                className={`relative z-10 mt-2 text-xs font-semibold ${
                  item.tone.includes('bg-brand')
                    ? 'text-ink'
                    : item.tone.includes('text-white')
                      ? 'text-brand'
                      : 'text-brand-deep'
                }`}
              >
                Coming soon
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
