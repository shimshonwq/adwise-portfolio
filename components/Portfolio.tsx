import Link from 'next/link'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

function ProjectVisual({
  gradient,
  coverImage,
  title,
  category,
}: {
  gradient: string
  coverImage?: string
  title: string
  category: string
}) {
  return (
    <div
      className="relative aspect-[16/10] overflow-hidden transition-transform duration-500 group-hover:-translate-y-1 md:aspect-[5/3]"
      style={{ background: gradient }}
    >
      {coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={coverImage}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0 opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 0, transparent 45%)',
          }}
        />
      )}
      <span className="absolute left-4 top-4 bg-ink/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
        {category}
      </span>
    </div>
  )
}

export default function Portfolio() {
  return (
    <section id="work" className="scroll-mt-24 bg-paper py-24 md:py-32">
      <div className="site-shell">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
              Projects that earn attention
            </h2>
          </div>
          <p className="max-w-sm text-ink/55 md:text-right">
            Brand systems, campaigns, and content built to look sharp and perform.
          </p>
        </div>

        <hr className="rule mt-12" />

        <ul className="divide-y divide-line">
          {projects.map((project, index) => (
            <li key={project.id}>
              <Link href={`/projects/${project.slug}`} className="group block py-8 md:py-10">
                <motion.div
                  initial={{ y: 18 }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.2) }}
                  className="grid items-center gap-6 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1.35fr)_auto]"
                >
                  <ProjectVisual
                    gradient={project.gradient}
                    coverImage={project.coverImage}
                    title={project.title}
                    category={project.category}
                  />

                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                      <span>{project.client}</span>
                      <span aria-hidden>·</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-brand-deep md:text-3xl">
                      {project.title}
                    </h3>
                    <p className="mt-3 max-w-md text-ink/60">{project.description}</p>
                  </div>

                  <span className="hidden text-sm font-semibold tracking-wide text-ink/40 transition-colors group-hover:text-ink md:inline">
                    View case →
                  </span>
                </motion.div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
