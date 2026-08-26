import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Clients from '../components/Clients'
import Services from '../components/Services'
import Spotlight from '../components/Spotlight'
import Process from '../components/Process'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { useSiteContent } from '../lib/SiteContentContext'
import { DEFAULT_CONTENT, type CmsContent } from '../lib/content'
import { loadBuildContent } from '../lib/load-build-content'

export default function Home() {
  const { content } = useSiteContent()
  const site = content.site || DEFAULT_CONTENT.site
  const title = `${site.name} — ${site.seoTitleSuffix || 'Logo Design & Marketing'}`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={site.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content={site.seoKeywords} />
        <link rel="canonical" href={site.url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={site.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={site.url} />
        <meta property="og:image" content={`${site.url}/logo.png`} />
        <meta property="og:site_name" content={site.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={site.description} />
      </Head>

      <JsonLd />
      <Navigation />
      <main id="main-content">
        <Hero />
        <Services />
        <Clients />
        <Spotlight />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  const initialContent: CmsContent = loadBuildContent()
  return { props: { initialContent } }
}
