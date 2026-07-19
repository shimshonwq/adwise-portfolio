import Head from 'next/head'
import Link from 'next/link'
import type { GetStaticPaths, GetStaticProps } from 'next'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { projects, type Project } from '../../data/projects'
import { siteConfig } from '../../config/site.config'
import { getVideoEmbedSrc } from '../../lib/media'

interface Props {
  project: Project
}

export default function ProjectPage({ project }: Props) {
  const embedSrc = project.videoUrl ? getVideoEmbedSrc(project.videoUrl) : null
  const isLocalVideo = project.videoUrl?.startsWith('/')
  const images = [project.coverImage, ...(project.gallery || [])]

  return (
    <>
      <Head>
        <title>{`${project.title} — ${siteConfig.name}`}</title>
        <meta name="description" content={project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:image" content={`${siteConfig.url}${project.coverImage}`} />
      </Head>

      <Navigation />

      <main>
        <section className="bg-paper-deep px-0 pb-10 pt-28 md:pt-32">
          <div className="site-shell">
            <Link href="/#work" className="text-sm font-medium text-ink/55 hover:text-ink">
              ← Back to work
            </Link>
            <motion.div
              initial={{ y: 18 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.55 }}
              className="mt-8 max-w-3xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
                {project.category} · {project.client} · {project.year}
              </p>
              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 text-lg text-ink/60">{project.description}</p>
            </motion.div>
          </div>

          <div className="site-shell mt-10 overflow-hidden border border-line bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              className="mx-auto max-h-[70vh] w-full object-contain"
            />
          </div>
        </section>

        <section className="bg-paper py-16 md:py-24">
          <div className="site-shell grid gap-14 md:grid-cols-[1.35fr_0.85fr]">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">Overview</h2>
              <p className="mt-5 text-lg leading-relaxed text-ink/65">{project.fullDescription}</p>

              {project.deliverables && project.deliverables.length > 0 && (
                <>
                  <h3 className="mt-12 font-display text-xl font-bold text-ink">Deliverables</h3>
                  <ul className="mt-5 space-y-3">
                    {project.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-ink/70">
                        <span className="h-px w-6 bg-brand" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {images.length > 1 && (
                <div className="mt-14">
                  <h3 className="font-display text-xl font-bold text-ink">Gallery</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {images.slice(1).map((src) => (
                      <div key={src} className="border border-line bg-white p-4">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" className="mx-auto w-full object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {project.videoUrl && (
                <div className="mt-12 overflow-hidden border border-line bg-ink">
                  {embedSrc ? (
                    <div className="aspect-video w-full">
                      <iframe
                        src={embedSrc}
                        title={`${project.title} video`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : isLocalVideo ? (
                    <video controls className="aspect-video w-full" src={project.videoUrl} />
                  ) : null}
                </div>
              )}
            </div>

            <aside className="space-y-8">
              <div className="border border-line p-7">
                <h3 className="font-display text-lg font-bold text-ink">Skills & tools</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-line bg-paper-deep px-3 py-1.5 text-sm text-ink/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {project.link && (
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full">
                  View live project →
                </a>
              )}
            </aside>
          </div>

          <div className="site-shell mt-20 bg-ink px-8 py-14 text-center text-white md:px-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Want work like this?</h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              Let’s build a brand people remember.
            </p>
            <Link href="/#contact" className="btn btn-on-dark mt-8">
              Start a project
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: projects.map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const project = projects.find((p) => p.slug === params?.slug)
  if (!project) return { notFound: true }
  return { props: { project } }
}
