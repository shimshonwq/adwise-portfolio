import { motion } from 'framer-motion'
import { FiTrendingUp, FiEdit3, FiPenTool } from 'react-icons/fi'
import type { IconType } from 'react-icons'

interface Service {
  icon: IconType
  title: string
  description: string
  points: string[]
}

const services: Service[] = [
  {
    icon: FiTrendingUp,
    title: 'Marketing',
    description:
      'Data-driven strategy and campaigns that turn attention into measurable growth.',
    points: ['Social media strategy', 'Paid advertising', 'Campaign management'],
  },
  {
    icon: FiEdit3,
    title: 'Content Creation',
    description:
      'Scroll-stopping video, photography, and copy that keeps your audience coming back.',
    points: ['Short-form video', 'Copywriting', 'Content calendars'],
  },
  {
    icon: FiPenTool,
    title: 'Graphic Design',
    description:
      'Logos, brand systems, and visuals that make your brand look premium everywhere.',
    points: ['Logo & branding', 'Print & digital design', 'Design systems'],
  },
]

export default function Services() {
  return (
    <section id="services" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand">What we do</p>
          <h2 className="mt-3 font-heading text-4xl font-bold text-ink md:text-5xl">
            Everything your brand needs to stand out
          </h2>
          <p className="mt-4 text-lg text-ink/60">
            One studio, three superpowers. From first impression to full-scale campaigns, we've got
            the whole creative journey covered.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true, margin: '-60px' }}
                className="group relative overflow-hidden rounded-3xl border border-black/5 bg-white p-8 shadow-card transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand to-brand-dark transition-transform duration-300 group-hover:scale-x-100" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand/20 text-2xl text-ink transition-colors group-hover:bg-brand group-hover:text-ink">
                  <Icon />
                </div>
                <h3 className="mt-6 font-heading text-2xl font-bold text-ink">{service.title}</h3>
                <p className="mt-3 text-ink/60">{service.description}</p>
                <ul className="mt-6 space-y-2">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-ink/70">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
