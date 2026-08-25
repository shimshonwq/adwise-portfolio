import Head from 'next/head'
import Link from 'next/link'
import fs from 'node:fs'
import path from 'node:path'
import Navigation from '../../components/Navigation'
import Footer from '../../components/Footer'
import { normalizeContent, type CustomPage } from '../../lib/content'

type Props = { page: CustomPage; siteName: string }

export async function getStaticPaths() {
  const file = path.join(process.cwd(), 'public/data/content.json')
  let pages: CustomPage[] = []
  try {
    const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
    const content = normalizeContent(raw)
    pages = (content.customPages || []).filter((p) => p.published && p.slug)
  } catch {
    pages = []
  }
  return {
    paths: pages.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const file = path.join(process.cwd(), 'public/data/content.json')
  const raw = JSON.parse(fs.readFileSync(file, 'utf8'))
  const content = normalizeContent(raw)
  const page = (content.customPages || []).find(
    (p) => p.slug === params.slug && p.published,
  )
  if (!page) return { notFound: true }
  return { props: { page, siteName: content.site.name } }
}

export default function CustomCmsPage({ page, siteName }: Props) {
  return (
    <>
      <Head>
        <title>{`${page.title} - ${siteName}`}</title>
        <meta name="description" content={page.body.slice(0, 160)} />
      </Head>
      <Navigation />
      <main className="min-h-[70svh] bg-paper pt-28 text-ink md:pt-32">
        <div className="site-shell py-16 md:py-24">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brass">Page</p>
          <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">{page.title}</h1>
          <div className="mt-8 max-w-2xl whitespace-pre-wrap font-serif text-lg italic leading-relaxed text-ink/80">
            {page.body}
          </div>
          <Link href="/" className="btn btn-primary mt-10">
            Back to home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
