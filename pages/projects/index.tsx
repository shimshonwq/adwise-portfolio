import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { useSiteContent } from '../../lib/SiteContentContext'
import { DEFAULT_CONTENT } from '../../lib/content'

export default function ProjectsComingSoon() {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const page = content.projectsPage || DEFAULT_CONTENT.projectsPage

  return (
    <>
      <Head>
        <title>{`${page.title} — ${site.name}`}</title>
        <meta name="description" content={page.body} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main className="min-h-[80svh] bg-ink pt-28 text-white md:pt-32">
        <div className="site-shell py-20 md:py-28">
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className="coming-soon-panel max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">{page.eyebrow}</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">{page.title}</h1>
            <p className="mt-6 text-lg text-white/65">{page.body}</p>
            <Link href="/#work" className="btn btn-on-dark mt-9">
              Back to homepage
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  )
}
