import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { FiArrowUpRight } from 'react-icons/fi'
import { projects, categories } from '../data/projects'

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>('All')

  const filteredProjects =
    activeCategory === 'All'
      ? projects
      : projects.filter((p) => p.category === activeCategory)

  return (
    <section id="work" className="scroll-mt-24 bg-ink px-5 py-24 text-white">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand">Selected work</p>
            <h2 className="mt-3 font-heading text-4xl font-bold md:text-5xl">
              Projects we're proud of
            </h2>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-brand text-white'
                  : 'border border-white/15 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div
                    className="relative flex h-72 flex-col justify-between overflow-hidden rounded-3xl p-6 transition-transform duration-300 group-hover:-translate-y-1.5"
                    style={{ background: project.gradient }}
                  >
                    <div
                      className="absolute inset-0 opacity-20 mix-blend-overlay"
                      style={{
                        backgroundImage:
                          'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.8) 0, transparent 40%)',
                      }}
                    />
                    <div className="relative flex items-center justify-between">
                      <span className="rounded-full bg-black/25 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90 backdrop-blur">
                        {project.category}
                      </span>
                      <span className="text-xs font-medium text-white/70">{project.year}</span>
                    </div>
                    <div className="relative">
                      <h3 className="font-heading text-2xl font-bold text-white">{project.title}</h3>
                      <p className="mt-2 text-sm text-white/80">{project.description}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        View case study <FiArrowUpRight />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
