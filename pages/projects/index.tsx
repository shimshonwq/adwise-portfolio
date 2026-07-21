import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { siteConfig } from '../../config/site.config'

export default function ProjectsComingSoon() {
  return (
    <>
      <Head>
        <title>{`Work — ${siteConfig.name}`}</title>
        <meta name="description" content="Our portfolio is coming soon. Real client work will be uploaded shortly." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navigation />

      <main className="min-h-[80svh] bg-ink pt-28 text-white md:pt-32">
        <div className="site-shell py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="coming-soon-panel max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand">Our work</p>
            <h1 className="mt-4 font-display text-4xl font-bold md:text-5xl">
              Portfolio coming soon
            </h1>
            <p className="mt-6 text-lg text-white/65">
              We&apos;re currently working on it. Our work will be uploaded soon.
            </p>
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
