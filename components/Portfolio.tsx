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
    <section id="work" className="scroll-mt-24 bg-paper py-20 md:py-28">
      <div className="site-shell">
        <div className="max-w-2xl">
          <p className="eyebrow">Selected work</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Logos & brand graphics we’ve made
          </h2>
          <p className="mt-4 text-ink/55">
            Real client logos, branding, and signage — designed to look great in the real world.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`px-4 py-2 text-sm font-semibold transition-colors ${
                active === cat
                  ? 'bg-ink text-white'
                  : 'border border-line text-ink/55 hover:border-ink hover:text-ink'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, index) => {
              const isWide = project.category === 'Signage'
              return (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.03, 0.18) }}
                  className={isWide ? 'sm:col-span-2 lg:col-span-2' : ''}
                >
                  <Link href={`/projects/${project.slug}`} className="group block">
                    <div
                      className={`logo-tile ${isWide ? 'wide' : ''}`}
                      style={{ background: project.surface }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={project.coverImage} alt={project.title} />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 via-ink/35 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand">
                          {project.category}
                        </p>
                        <p className="mt-1 font-display text-base font-bold text-white">
                          {project.title}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink md:text-xl">
                          {project.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-muted">
                          {project.client} · {project.year}
                        </p>
                      </div>
                      <span className="mt-1 text-sm font-semibold text-ink/30 transition-colors group-hover:text-ink">
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
