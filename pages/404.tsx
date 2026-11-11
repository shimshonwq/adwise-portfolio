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
      <main className="flex min-h-screen flex-col items-center justify-center bg-ink px-6 text-center text-white">
        <Logo href="/" size="md" tone="brand" />
        <p className="mt-14 font-display text-8xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 font-display text-3xl font-extrabold text-white">{page.title}</h1>
        <p className="mt-3 max-w-md text-white/55">{page.body}</p>
        <Link href="/" className="btn btn-primary mt-8">
          {page.ctaLabel}
        </Link>
      </main>
    </>
  )
}
