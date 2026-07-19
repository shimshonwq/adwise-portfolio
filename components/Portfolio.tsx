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
    <section id="work" className="scroll-mt-20 bg-ink">
      <div className="border-b border-white/10 bg-ink py-20 md:py-28">
        <div className="site-shell">
          <p className="eyebrow !text-brand">Selected work</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Brands we’ve brought to life
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white/55">
            Real client work — staged large, quiet, and beautiful.
          </p>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`text-sm font-semibold tracking-wide transition-colors ${
                  active === cat ? 'text-brand' : 'text-white/35 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="popLayout">
        {filtered.map((project, index) => {
          const onDark = project.theme === 'light'
          const num = String(index + 1).padStart(2, '0')
          const flip = index % 2 === 1
          const isWide = project.category === 'Signage'

          return (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="relative min-h-[100svh] overflow-hidden"
              style={{ background: project.surface }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-40"
                style={{
                  background: onDark
                    ? 'radial-gradient(ellipse at 70% 40%, rgba(253,198,33,0.12), transparent 55%)'
                    : 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.55), transparent 60%)',
                }}
                aria-hidden
              />

              <div
                className={`site-shell relative grid min-h-[100svh] items-center gap-12 py-20 md:grid-cols-12 md:gap-10 md:py-24 ${
                  flip ? 'md:[direction:rtl]' : ''
                }`}
              >
                <div
                  className={`md:col-span-4 md:[direction:ltr] ${
                    onDark ? 'text-white' : 'text-ink'
                  }`}
                >
                  <p
                    className={`font-display text-sm font-semibold tracking-[0.28em] ${
                      onDark ? 'text-brand' : 'text-brand-deep'
                    }`}
                  >
                    {num}
                  </p>
                  <p
                    className={`mt-8 text-[0.7rem] font-bold uppercase tracking-[0.24em] ${
                      onDark ? 'text-white/45' : 'text-ink/35'
                    }`}
                  >
                    {project.category}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1.05] tracking-tight">
                    {project.title}
                  </h3>
                  <p className={`mt-3 text-sm ${onDark ? 'text-white/45' : 'text-ink/40'}`}>
                    {project.client} · {project.year}
                  </p>
                  <p
                    className={`mt-6 max-w-sm text-base leading-relaxed ${
                      onDark ? 'text-white/70' : 'text-ink/60'
                    }`}
                  >
                    {project.description}
                  </p>
                  <Link
                    href={`/projects/${project.slug}`}
                    className={`btn mt-9 ${onDark ? 'btn-on-dark' : 'btn-primary'}`}
                  >
                    View project
                  </Link>
                </div>

                <Link
                  href={`/projects/${project.slug}`}
                  className="group md:col-span-8 md:[direction:ltr]"
                >
                  <motion.div
                    initial={{ y: 36, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className={`relative mx-auto flex items-center justify-center transition-transform duration-700 group-hover:-translate-y-3 ${
                      isWide
                        ? 'aspect-[16/9] w-full'
                        : 'aspect-square w-full max-w-[620px]'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className={
                        isWide
                          ? 'h-full w-full object-cover shadow-[0_50px_120px_-40px_rgba(0,0,0,0.55)] transition-transform duration-700 group-hover:scale-[1.015]'
                          : 'h-full w-full object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,0.22)] transition-transform duration-700 group-hover:scale-[1.04]'
                      }
                    />
                  </motion.div>
                </Link>
              </div>
            </motion.article>
          )
        })}
      </AnimatePresence>
    </section>
  )
}
