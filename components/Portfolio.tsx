import { motion } from 'framer-motion'
import Link from 'next/link'
import AnimatedText from './AnimatedText'

const placeholders = [
  {
    label: 'Logos',
    delay: 0,
    tone: 'bg-white',
    span: 'md:col-span-1 md:row-span-1',
    height: 'min-h-[12rem] md:min-h-[14rem]',
  },
  {
    label: 'Brand systems',
    delay: 0.08,
    tone: 'bg-brand',
    span: 'md:col-span-1 md:row-span-1',
    height: 'min-h-[12rem] md:min-h-[14rem]',
  },
  {
    label: 'Signage & print',
    delay: 0.16,
    tone: 'bg-ink text-white',
    span: 'md:col-span-1 md:row-span-1',
    height: 'min-h-[12rem] md:min-h-[14rem]',
  },
]

export default function Portfolio() {
  return (
    <section
      id="work"
      className="scroll-mt-24 relative overflow-hidden section-aurora-deep grain py-24 md:py-32"
    >
      <div
        className="pointer-events-none absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-brand/30 blur-3xl"
        aria-hidden
      />
      <div className="site-shell relative z-10">
        <div className="grid gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <AnimatedText
              as="h2"
              text="The portfolio is being crafted."
              shimmer
              className="mt-3 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl"
            />
          </div>
          <p className="max-w-md text-lg leading-relaxed text-ink/60 md:justify-self-end md:text-right">
            Real client logos, branding systems, and campaign graphics — uploading soon. Start your
            project while we finish the gallery.
          </p>
        </div>

        <motion.div
          className="panel-3d panel-3d-dark mt-12 overflow-hidden rounded-[2rem] border border-ink/10 bg-ink p-8 text-white md:p-12"
          initial={{ y: 28, rotateX: 8 }}
          whileInView={{ y: 0, rotateX: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="pulse-dot" aria-hidden />
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">
                Studio update
              </p>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Coming soon
            </p>
          </div>
          <p className="mt-8 max-w-2xl font-display text-3xl font-bold leading-snug md:text-4xl">
            Case studies, marks, and brand worlds — in progress.
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/60">
            We’re finishing a sharper showcase of logos, identities, and marketing work for
            businesses. Prefer to talk now? Let’s build yours.
          </p>
          <Link href="#contact" className="btn btn-on-dark mt-9">
            Start your project now
          </Link>
        </motion.div>

        <div className="tilt-3d-wrap mt-8 grid gap-4 sm:grid-cols-3">
          {placeholders.map((item, index) => (
            <motion.div
              key={item.label}
              className={`tilt-3d panel-3d relative flex flex-col items-start justify-end overflow-hidden rounded-[1.75rem] border border-ink/8 p-6 ${item.tone.includes('bg-ink') ? 'panel-3d-dark' : ''} ${item.tone} ${item.height} ${item.span}`}
              initial={{ y: 22, rotateX: 10 }}
              whileInView={{ y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: item.delay }}
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
                Preview soon
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
