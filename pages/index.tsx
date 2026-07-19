import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { siteConfig } from '../config/site.config'

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${siteConfig.name} — Marketing, Content & Graphic Design`}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteConfig.url} />
        <meta property="og:title" content={`${siteConfig.name} — Marketing & Design Studio`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content={`${siteConfig.url}/logo.png`} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${siteConfig.name} — Marketing & Design Studio`} />
        <meta name="twitter:description" content={siteConfig.description} />
        <meta name="twitter:image" content={`${siteConfig.url}/logo.png`} />
      </Head>

      <Navigation />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
