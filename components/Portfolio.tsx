import { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { categories, projects } from '../data/projects'

export default function Portfolio() {
  const [active, setActive] = useState<(typeof categories)[number]>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  return (
    <section id="work" className="scroll-mt-24 bg-paper py-24 md:py-32">
      <div className="site-shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Real brands. Real craft.
            </h2>
            <p className="mt-4 max-w-lg text-ink/55">
              Logos, brand systems, and signage designed to look sharp in the real world — not just on a screen.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                active === cat
                  ? 'bg-ink text-white'
                  : 'border border-line text-ink/60 hover:border-ink hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => {
              const isWide = project.category === 'Signage'
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.2) }}
                  className={isWide ? 'sm:col-span-2 lg:col-span-2' : ''}
                >
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div className={`logo-tile ${isWide ? 'wide' : ''}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.coverImage} alt={project.title} />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/80 via-ink/40 to-transparent p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
                          {project.category}
                        </p>
                        <p className="mt-1 font-display text-lg font-bold text-white">{project.title}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink">{project.title}</h3>
                        <p className="mt-1 text-sm text-muted">
                          {project.client} · {project.year}
                        </p>
                      </div>
                      <span className="mt-1 text-sm font-semibold text-ink/35 transition-colors group-hover:text-ink">
                        View →
                      </span>
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
