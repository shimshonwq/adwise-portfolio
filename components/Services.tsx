import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'

const services = [
  {
    num: '01',
    title: 'Marketing',
    description: 'Campaigns and creative that get attention — social, paid, and always on-brand.',
    points: ['Social strategy', 'Paid advertising', 'Campaign management'],
    tone: 'white' as const,
  },
  {
    num: '02',
    title: 'Content Creation',
    description: 'Video, photography, and copy your audience actually wants to watch.',
    points: ['Short-form video', 'Editorial & copy', 'Content calendars'],
    tone: 'ink' as const,
  },
  {
    num: '03',
    title: 'Graphic Design',
    description: 'Logos, identity, and print that hold up at every size and channel.',
    points: ['Logo & branding', 'Print & digital', 'Design systems'],
    tone: 'volt' as const,
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 brand-field py-24 md:py-32">
      <div className="site-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow !text-ink/55">How we move you forward</p>
            <AnimatedText
              as="h2"
              text="What we do"
              shimmer
              className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
            />
          </div>
          <p className="max-w-sm font-serif text-xl italic leading-relaxed text-ink/80 md:text-right">
            One studio from first logo to launch campaign.
          </p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => {
            const ink = service.tone === 'ink'
            const volt = service.tone === 'volt'
            return (
              <motion.article
                key={service.num}
                initial={{ y: 18 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className={`soft-panel relative overflow-hidden border-2 p-8 shadow-[6px_6px_0_0_#111] md:p-9 ${
                  ink
                    ? 'border-ink bg-ink text-white md:-translate-y-2'
                    : volt
                      ? 'border-ink bg-volt text-ink'
                      : 'border-ink bg-white text-ink'
                }`}
              >
                <span
                  className={`inline-flex h-11 w-11 items-center justify-center font-display text-sm font-bold ${
                    ink ? 'bg-brand text-ink' : volt ? 'bg-ink text-volt' : 'bg-hot text-white'
                  }`}
                >
                  {service.num}
                </span>
                <h3 className="mt-5 font-display text-3xl font-bold tracking-tight">{service.title}</h3>
                <p className={`mt-4 leading-relaxed ${ink ? 'text-white/80' : 'text-ink/75'}`}>
                  {service.description}
                </p>
                <ul className="mt-8 space-y-2.5">
                  {service.points.map((point) => (
                    <li
                      key={point}
                      className={`flex items-center gap-3 text-sm font-medium ${
                        ink ? 'text-white/80' : 'text-ink/75'
                      }`}
                    >
                      <span className={`h-2 w-2 ${ink ? 'bg-brand' : 'bg-ink'}`} aria-hidden />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
