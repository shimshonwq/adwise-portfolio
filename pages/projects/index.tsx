import { useMemo, useState } from 'react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import ProjectCard from '../../components/ProjectCard'
import { useSiteContent } from '../../lib/SiteContentContext'
import { DEFAULT_CONTENT, type CmsContent } from '../../lib/content'
import { loadBuildContent } from '../../lib/load-build-content'
import { categories, projects, type Category } from '../../data/projects'

export default function ProjectsPage() {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const page = content.projectsPage || DEFAULT_CONTENT.projectsPage
  const [active, setActive] = useState<'All' | Category>('All')

  const filtered = useMemo(
    () => (active === 'All' ? projects : projects.filter((p) => p.category === active)),
    [active],
  )

  const title = `${page.title} — ${site.name}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={page.body} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${site.url}/projects/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={page.body} />
      </Head>

      <Navigation />

      <main id="main-content" className="min-h-[80svh] bg-ink pt-28 text-white md:pt-32">
        <div className="site-shell py-16 md:py-24">
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="max-w-3xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">{page.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{page.title}</h1>
            <p className="mt-5 text-lg text-white/65">{page.body}</p>
          </motion.div>

          <div className="mt-10 flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActive(cat)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active === cat
                    ? 'bg-brand text-ink'
                    : 'border border-white/15 text-white/70 hover:border-brand/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                initial={{ y: 16, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.04 * (i % 6), duration: 0.4 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const initialContent: CmsContent = loadBuildContent()
  return { props: { initialContent } }
}
