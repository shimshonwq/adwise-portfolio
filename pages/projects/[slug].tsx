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

  return (
    <>
      <Head>
        <title>{`${project.title} — ${siteConfig.name}`}</title>
        <meta name="description" content={project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main>
        <section
          className="relative flex min-h-[58vh] items-end overflow-hidden px-0 pb-14 pt-32 md:min-h-[68vh]"
          style={{ background: project.gradient }}
        >
          {project.coverImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-50"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

          <div className="site-shell relative w-full text-white">
            <Link
              href="/#work"
              className="text-sm font-medium text-white/75 transition-colors hover:text-white"
            >
              ← Back to work
            </Link>
            <motion.div
              initial={{ y: 24 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-8"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">
                {project.category} · {project.client} · {project.year}
              </p>
              <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-6xl">
                {project.title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-white/85">{project.description}</p>
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-on-dark mt-8"
                >
                  View live project →
                </a>
              )}
            </motion.div>
          </div>
        </section>

        <section className="bg-paper py-16 md:py-24">
          <div className="site-shell grid gap-14 md:grid-cols-[1.4fr_0.8fr]">
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

              {/* Video */}
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
                    <video controls className="aspect-video w-full" src={project.videoUrl}>
                      Your browser does not support the video tag.
                    </video>
                  ) : null}
                </div>
              )}

              {/* Gallery */}
              {project.gallery && project.gallery.length > 0 && (
                <div className="mt-12">
                  <h3 className="font-display text-xl font-bold text-ink">Gallery</h3>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {project.gallery.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt=""
                        className="w-full border border-line object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-8">
              {project.results && (
                <div className="border border-line bg-paper-deep p-7">
                  <h3 className="font-display text-lg font-bold text-ink">Results</h3>
                  <div className="mt-6 space-y-6">
                    {project.results.map((r) => (
                      <div key={r.label}>
                        <p className="font-display text-4xl font-bold text-brand-deep">{r.value}</p>
                        <p className="mt-1 text-sm text-muted">{r.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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
            </aside>
          </div>

          <div className="site-shell mt-20 bg-ink px-8 py-14 text-center text-white md:px-16">
            <h2 className="font-display text-3xl font-bold md:text-4xl">Have a project like this?</h2>
            <p className="mx-auto mt-4 max-w-md text-white/60">
              Let’s create something your audience won’t scroll past.
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
