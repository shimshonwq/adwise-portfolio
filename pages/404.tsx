import Head from 'next/head'
import Link from 'next/link'
import Logo from '../components/Logo'
import { CmsText } from '../lib/CmsText'
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
        <CmsText
          path="notFoundPage.title"
          as="h1"
          className="mt-4 font-display text-3xl font-bold text-ink"
        >
          {page.title}
        </CmsText>
        <CmsText path="notFoundPage.body" as="p" className="mt-3 max-w-md text-ink/60">
          {page.body}
        </CmsText>
        <Link href="/" className="btn btn-primary mt-8">
          <CmsText path="notFoundPage.ctaLabel" as="span">
            {page.ctaLabel}
          </CmsText>
        </Link>
      </main>
    </>
  )
}
