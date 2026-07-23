import { motion } from 'framer-motion'
import AnimatedText from './AnimatedText'

const services = [
  {
    num: '01',
    title: 'Marketing',
    description:
      'Strategy and campaigns that turn attention into measurable growth — social, paid, and always on-brand.',
    points: ['Social strategy', 'Paid advertising', 'Campaign management'],
  },
  {
    num: '02',
    title: 'Content Creation',
    description:
      'Video, photography, and copy that stops the scroll and keeps your audience coming back.',
    points: ['Short-form video', 'Editorial & copy', 'Content calendars'],
  },
  {
    num: '03',
    title: 'Graphic Design',
    description:
      'Logos, brand systems, and visuals that make your brand feel premium in every channel.',
    points: ['Logo & branding', 'Print & digital', 'Design systems'],
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 relative overflow-hidden brand-field grain py-24 md:py-32">
      <div
        className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-white/25 blur-3xl"
        aria-hidden
      />
      <div className="site-shell relative z-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow !text-ink/50">What we do</p>
            <AnimatedText
              as="h2"
              text="Full-stack brand & marketing craft"
              shimmer
              className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
            />
          </div>
          <p className="max-w-sm text-base leading-relaxed text-ink/70 md:text-right md:text-lg">
            From first mark to launch campaign — one studio, one sharp visual system.
          </p>
        </div>

        <div className="tilt-3d-wrap mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              initial={{ y: 22, rotateX: 6 }}
              whileInView={{ y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className={`tilt-3d group relative overflow-hidden soft-panel border p-8 shadow-[0_24px_55px_-32px_rgba(14,14,14,0.4)] md:p-9 ${
                index === 1
                  ? 'border-ink/20 bg-ink text-white md:-translate-y-3'
                  : 'border-ink/10 bg-white/95 text-ink'
              }`}
            >
              <div
                className={`pointer-events-none absolute -right-6 -top-8 font-display text-[7rem] font-bold leading-none opacity-[0.07] ${
                  index === 1 ? 'text-brand' : 'text-ink'
                }`}
                aria-hidden
              >
                {service.num}
              </div>
              <span
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full font-display text-sm font-bold ${
                  index === 1 ? 'bg-brand text-ink' : 'bg-ink text-brand'
                }`}
              >
                {service.num}
              </span>
              <h3 className="mt-5 font-display text-3xl font-bold tracking-tight">{service.title}</h3>
              <p className={`mt-4 leading-relaxed ${index === 1 ? 'text-white/65' : 'text-ink/65'}`}>
                {service.description}
              </p>
              <ul className="mt-8 space-y-2.5">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className={`flex items-center gap-3 text-sm font-medium ${
                      index === 1 ? 'text-white/80' : 'text-ink/75'
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${index === 1 ? 'bg-brand' : 'bg-ink'}`}
                      aria-hidden
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
