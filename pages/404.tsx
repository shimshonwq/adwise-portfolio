import Head from 'next/head'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'
import Logo from '../components/Logo'
import { siteConfig } from '../config/site.config'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{`Page not found — ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
        <Logo href="/" />
        <p className="mt-10 font-heading text-7xl font-bold text-gradient">404</p>
        <h1 className="mt-4 font-heading text-3xl font-bold text-ink">This page took a wrong turn</h1>
        <p className="mt-3 max-w-md text-ink/60">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-white transition-colors hover:bg-brand"
        >
          <FiArrowLeft /> Back home
        </Link>
      </main>
    </>
  )
}
