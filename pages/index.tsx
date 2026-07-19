import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import Services from '../components/Services'
import Process from '../components/Process'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { siteConfig } from '../config/site.config'

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${siteConfig.name} — ${siteConfig.tagline}`}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteConfig.url} />
        <meta property="og:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content={`${siteConfig.url}/logo.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
        <meta name="twitter:description" content={siteConfig.description} />
      </Head>

      <Navigation />
      <main>
        <Hero />
        <Portfolio />
        <Services />
        <Process />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
