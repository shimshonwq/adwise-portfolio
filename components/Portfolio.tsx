import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, projects } from '../data/projects'
import AnimatedText from './AnimatedText'

export default function Portfolio() {
  const [active, setActive] = useState<(typeof categories)[number]>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  return (
    <section id="work" className="scroll-mt-24 bg-paper py-20 md:py-28">
      <div className="site-shell">
        <div className="max-w-2xl">
          <motion.p
            className="eyebrow"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Selected work
          </motion.p>
          <AnimatedText
            as="h2"
            text="Logos & brand graphics we’ve made"
            className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl"
          />
          <motion.p
            className="mt-4 text-lg text-ink/55"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            Real client logos and graphics — colorful, clickable, and built to catch the eye.
          </motion.p>
        </div>

        <div className="mt-9 flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`chip ${active === cat ? 'chip-active' : 'chip-idle'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => {
              const isWide = project.category === 'Signage'
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 28, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
                  className={isWide ? 'sm:col-span-2' : ''}
                >
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div
                      className={`logo-tile ${isWide ? 'wide' : ''}`}
                      style={{
                        background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.55), transparent 45%), ${project.surface}`,
                      }}
                    >
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-white/85 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-widest text-ink shadow-sm backdrop-blur-sm">
                        {project.category}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.coverImage} alt={project.title} />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent p-5 pt-16 opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <p className="font-display text-lg font-bold text-white">{project.title}</p>
                        <span className="rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-ink">
                          View
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 px-1">
                      <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover:text-brand-deep md:text-2xl">
                        {project.title}
                      </h3>
                      <p className="mt-1 text-sm font-semibold text-ink/45">{project.client}</p>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
