import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/Logo'
import { useSiteContent } from '../lib/SiteContentContext'
import { DEFAULT_CONTENT } from '../lib/content'

export default function NotFound() {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const page = content.notFoundPage || DEFAULT_CONTENT.notFoundPage

  return (
    <>
      <Head>
        <title>{`Page not found — ${site.name}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="gold-field flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <Logo href="/" size="md" />
        <p className="mt-14 font-display text-7xl font-bold text-brand">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink">{page.title}</h1>
        <p className="mt-3 max-w-md text-ink/60">{page.body}</p>
        <Link href="/" className="btn btn-primary mt-8">
          {page.ctaLabel}
        </Link>
      </main>
    </>
  )
}
