import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/Logo'
import { siteConfig } from '../config/site.config'

export default function NotFound() {
  return (
    <>
      <Head>
        <title>{`Page not found — ${siteConfig.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="gold-field flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Logo href="/" size="md" />
        <p className="mt-14 font-display text-7xl font-bold text-ink">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">This page took a wrong turn</h1>
        <p className="mt-3 max-w-md text-ink/60">
          The page you’re looking for doesn’t exist — or it moved.
        </p>
        <Link href="/" className="btn btn-primary mt-8">
          Back home
        </Link>
      </main>
    </>
  )
}
