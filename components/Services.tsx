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
    <section id="services" className="scroll-mt-24 brand-field py-24 md:py-32">
      <div className="site-shell">
        <p className="eyebrow !text-ink/50">What we do</p>
        <AnimatedText
          as="h2"
          text="What we make for businesses"
          className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-tight text-ink md:text-5xl"
        />
        <p className="mt-5 max-w-xl text-lg text-ink/70">
          Logos, graphics, and marketing creatives — from first impression to full campaigns.
        </p>

        <div className="mt-14 grid gap-5 md:grid-cols-3 md:gap-6">
          {services.map((service, index) => (
            <motion.article
              key={service.num}
              initial={{ y: 18 }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className="soft-panel border border-ink/10 bg-white/90 p-8 shadow-[0_20px_50px_-30px_rgba(14,14,14,0.35)] md:p-9"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-brand">
                {service.num}
              </span>
              <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-ink">
                {service.title}
              </h3>
              <p className="mt-4 leading-relaxed text-ink/65">{service.description}</p>
              <ul className="mt-8 space-y-2">
                {service.points.map((point) => (
                  <li key={point} className="flex items-center gap-3 text-sm text-ink/75">
                    <span className="h-2 w-2 rounded-full bg-ink" aria-hidden />
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
