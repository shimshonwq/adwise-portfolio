import { motion } from 'framer-motion'

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
    <section id="services" className="scroll-mt-24 ink-field py-24 md:py-32">
      <div className="site-shell">
        <p className="eyebrow !text-brand">What we do</p>
        <h2 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
          Three crafts. One studio.
        </h2>
        <p className="mt-5 max-w-xl text-lg text-white/60">
          From first impression to full campaigns — we cover the creative journey end to end.
        </p>

        <div className="mt-16 grid gap-0 border-t border-white/10 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              initial={{ y: 16 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="border-b border-white/10 py-10 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
            >
              <span className="font-display text-sm font-semibold tracking-[0.2em] text-brand">
                {service.num}
              </span>
              <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-white">
                {service.title}
              </h3>
              <p className="mt-4 leading-relaxed text-white/60">{service.description}</p>
              <ul className="mt-8 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-white/80">
                    <span className="h-px w-5 bg-brand" aria-hidden />
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
