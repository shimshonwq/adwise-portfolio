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
  nextSlug: string | null
}

export default function ProjectPage({ project, nextSlug }: Props) {
  const embedSrc = project.videoUrl ? getVideoEmbedSrc(project.videoUrl) : null
  const isLocalVideo = project.videoUrl?.startsWith('/')
  const gallery = project.gallery || []
  const onDark = project.theme === 'light'
  const isWide = project.category === 'Signage'
  const nextProject = nextSlug ? projects.find((p) => p.slug === nextSlug) : null

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
        <section
          className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden pb-16 pt-28 md:pb-24 md:pt-32"
          style={{ background: project.surface }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: onDark
                ? 'radial-gradient(ellipse at 50% 35%, rgba(253,198,33,0.1), transparent 55%)'
                : 'radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.5), transparent 60%)',
            }}
            aria-hidden
          />

          <div className="site-shell relative z-10 mb-8 md:mb-12">
            <Link
              href="/#work"
              className={`text-sm font-medium transition-colors ${
                onDark ? 'text-white/55 hover:text-white' : 'text-ink/45 hover:text-ink'
              }`}
            >
              ← All work
            </Link>
          </div>

          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="site-shell relative z-10 flex flex-1 items-center justify-center"
          >
            <div
              className={`relative w-full overflow-hidden rounded-[2rem] ${
                isWide ? 'aspect-[16/9] max-w-6xl' : 'aspect-square max-w-2xl md:max-w-3xl'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className={
                  isWide
                    ? 'h-full w-full object-cover shadow-[0_60px_120px_-50px_rgba(0,0,0,0.5)]'
                    : 'h-full w-full object-contain drop-shadow-[0_40px_90px_rgba(0,0,0,0.2)]'
                }
              />
            </div>
          </motion.div>

          <div className={`site-shell relative z-10 mt-14 md:mt-20 ${onDark ? 'text-white' : 'text-ink'}`}>
            <p
              className={`inline-flex rounded-full px-3 py-1 text-[0.7rem] font-bold uppercase tracking-[0.24em] ${
                onDark ? 'bg-brand text-ink' : 'bg-ink text-brand'
              }`}
            >
              {project.category}
            </p>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,6vw,4.5rem)] font-bold leading-[1.05] tracking-tight">
              {project.title}
            </h1>
            <p className={`mt-4 text-sm font-semibold ${onDark ? 'text-white/50' : 'text-ink/45'}`}>
              {project.client}
            </p>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="site-shell grid gap-16 md:grid-cols-12">
            <div className="md:col-span-7">
              <p className="eyebrow">The work</p>
              <p className="mt-6 text-xl leading-relaxed text-ink/70 md:text-2xl md:leading-relaxed">
                {project.fullDescription}
              </p>

              {project.deliverables && project.deliverables.length > 0 && (
                <div className="mt-14">
                  <h2 className="font-display text-lg font-bold text-ink">Deliverables</h2>
                  <ul className="mt-6 space-y-3">
                    {project.deliverables.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-ink/65">
                        <span className="h-px w-6 bg-brand" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <aside className="md:col-span-4 md:col-start-9">
              <dl className="soft-panel space-y-7 border border-line bg-white p-7 text-sm">
                <div>
                  <dt className="text-ink/35">Client</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{project.client}</dd>
                </div>
                <div>
                  <dt className="text-ink/35">Category</dt>
                  <dd className="mt-1.5 font-semibold text-ink">{project.category}</dd>
                </div>
                <div>
                  <dt className="text-ink/35">Focus</dt>
                  <dd className="mt-3 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-paper-deep px-3 py-1 text-xs font-semibold text-ink/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </section>

        {gallery.length > 0 && (
          <section className="bg-paper-deep py-16 md:py-24">
            <div className="site-shell mb-10 md:mb-14">
              <p className="eyebrow">Gallery</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink md:text-4xl">
                More from this project
              </h2>
            </div>
            <div className="space-y-6 md:space-y-10">
              {gallery.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ y: 28, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.04 }}
                  className="soft-panel mx-auto flex min-h-[50vh] max-w-6xl items-center justify-center px-6 py-16 md:min-h-[70vh] md:px-16 md:py-24"
                  style={{ background: i % 2 === 0 ? project.surface : '#ffffff' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt=""
                    className="mx-auto max-h-[75vh] w-full max-w-4xl object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.12)]"
                  />
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {project.videoUrl && (
          <section className="bg-ink py-16">
            <div className="site-shell overflow-hidden rounded-[2rem]">
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
          </section>
        )}

        <section className="bg-ink py-20 text-white md:py-28">
          <div className="site-shell flex flex-col items-start justify-between gap-12 md:flex-row md:items-end">
            <div>
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-brand">
                {nextProject ? 'Next project' : 'Let’s work'}
              </p>
              <h2 className="mt-4 max-w-xl font-display text-3xl font-bold tracking-tight md:text-5xl">
                {nextProject ? nextProject.title : 'Want work like this for your brand?'}
              </h2>
              <Link
                href={nextProject ? `/projects/${nextSlug}` : '/#contact'}
                className="btn btn-on-dark mt-9"
              >
                {nextProject ? 'View next project' : 'Start a project'}
              </Link>
            </div>
            <Link href="/#contact" className="text-sm font-semibold text-white/40 hover:text-white">
              Get in touch →
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
  const index = projects.findIndex((p) => p.slug === params?.slug)
  const project = projects[index]
  if (!project) return { notFound: true }
  const next = projects[(index + 1) % projects.length]
  return {
    props: {
      project,
      nextSlug: next && next.slug !== project.slug ? next.slug : null,
    },
  }
}
