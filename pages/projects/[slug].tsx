import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { FiArrowLeft, FiArrowUpRight } from 'react-icons/fi'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { projects, type Project } from '../../data/projects'
import { siteConfig } from '../../config/site.config'

interface ProjectPageProps {
  project: Project
}

export default function ProjectPage({ project }: ProjectPageProps) {
  return (
    <>
      <Head>
        <title>{`${project.title} — ${siteConfig.name}`}</title>
        <meta name="description" content={project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main>
        {/* Hero */}
        <section
          className="relative flex min-h-[60vh] items-end px-5 pt-32 pb-14"
          style={{ background: project.gradient }}
        >
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage:
                'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.85) 0, transparent 45%)',
            }}
          />
          <div className="relative mx-auto w-full max-w-4xl text-white">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              <FiArrowLeft /> Back to work
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
              <span className="rounded-full bg-black/25 px-3 py-1 font-semibold uppercase tracking-wide backdrop-blur">
                {project.category}
              </span>
              <span>{project.client}</span>
              <span>·</span>
              <span>{project.year}</span>
            </div>
            <h1 className="mt-4 font-heading text-4xl font-bold md:text-6xl">{project.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/85">{project.description}</p>
          </div>
        </section>

        {/* Body */}
        <section className="px-5 py-16">
          <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-heading text-2xl font-bold text-ink">Project overview</h2>
              <p className="mt-4 text-lg leading-relaxed text-ink/70">{project.fullDescription}</p>

              {project.deliverables && project.deliverables.length > 0 && (
                <>
                  <h3 className="mt-10 font-heading text-xl font-bold text-ink">Deliverables</h3>
                  <ul className="mt-4 space-y-2">
                    {project.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-ink/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <aside className="space-y-8">
              {project.results && project.results.length > 0 && (
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card">
                  <h3 className="font-heading text-lg font-bold text-ink">Results</h3>
                  <div className="mt-4 space-y-4">
                    {project.results.map((result) => (
                      <div key={result.label}>
                        <div className="font-heading text-3xl font-bold text-brand">
                          {result.value}
                        </div>
                        <div className="text-sm text-ink/60">{result.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-card">
                <h3 className="font-heading text-lg font-bold text-ink">Skills &amp; tools</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-cream px-3 py-1 text-sm font-medium text-ink/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="mx-auto mt-16 max-w-4xl rounded-3xl bg-ink p-10 text-center text-white">
            <h2 className="font-heading text-3xl font-bold">Have a project like this?</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/60">
              Let's create something your audience won't be able to scroll past.
            </p>
            <Link
              href="/#contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3.5 font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Start a project <FiArrowUpRight />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: projects.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ProjectPageProps> = async ({ params }) => {
  const slug = params?.slug as string
  const project = projects.find((p) => p.slug === slug)

  if (!project) {
    return { notFound: true }
  }

  return { props: { project } }
}
