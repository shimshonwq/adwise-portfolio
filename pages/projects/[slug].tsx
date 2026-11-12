import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { useSiteContent } from '../../lib/SiteContentContext'
import { DEFAULT_CONTENT, type CmsContent } from '../../lib/content'
import { loadBuildContent } from '../../lib/load-build-content'
import { getVideoEmbedSrc } from '../../lib/media'
import { projects, type Project } from '../../data/projects'

type Props = {
  project: Project
  initialContent: CmsContent
}

export default function ProjectDetailPage({ project }: Props) {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const title = `${project.title} — ${site.name}`
  const embed = project.videoUrl ? getVideoEmbedSrc(project.videoUrl) : null

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={project.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={`${site.url}/projects/${project.slug}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={project.description} />
        <meta property="og:image" content={`${site.url}${project.coverImage}`} />
      </Head>

      <Navigation />

      <main id="main-content" className="bg-ink pt-28 text-white md:pt-32">
        <div className="site-shell py-16 md:py-24">
          <Link
            href="/projects/"
            className="text-sm font-semibold text-brand hover:underline"
          >
            ← All projects
          </Link>

          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="mt-8 max-w-4xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
              {project.category} · {project.year}
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{project.title}</h1>
            <p className="mt-4 font-serif text-lg italic text-white/70">{project.client}</p>
            <p className="mt-6 text-lg leading-relaxed text-white/80">{project.fullDescription}</p>
          </motion.div>

          <div
            className="soft-panel mt-10 overflow-hidden border border-white/10"
            style={{ background: project.gradient }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.coverImage}
              alt={project.title}
              width={1200}
              height={900}
              className="mx-auto w-full max-w-5xl object-contain p-8 md:p-12"
            />
          </div>

          {project.gallery && project.gallery.length > 0 && (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {project.gallery.map((src) => (
                <div key={src} className="soft-panel overflow-hidden border border-white/10 bg-white/5 p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="w-full object-contain" />
                </div>
              ))}
            </div>
          )}

          {embed && (
            <div className="mt-10 aspect-video overflow-hidden rounded-xl border border-white/10">
              <iframe
                src={embed}
                title={`${project.title} video`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-brand">Deliverables</h2>
                <ul className="mt-3 space-y-2 text-white/75">
                  {project.deliverables.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
            {project.tags.length > 0 && (
              <div>
                <h2 className="font-display text-xl font-bold text-brand">Tags</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 px-3 py-1 text-sm text-white/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-14">
            <Link href="/#contact" className="btn btn-on-dark">
              Start a project like this
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: projects.map((project) => ({ params: { slug: project.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params?: { slug?: string } }) {
  const slug = String(params?.slug || '')
  const project = projects.find((p) => p.slug === slug)
  if (!project) return { notFound: true }
  const initialContent = loadBuildContent()
  return { props: { project, initialContent } }
}
