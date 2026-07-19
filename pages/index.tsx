import Head from 'next/head'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import Services from '../components/Services'
import Process from '../components/Process'
import About from '../components/About'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import JsonLd from '../components/JsonLd'
import { siteConfig } from '../config/site.config'

export default function Home() {
  return (
    <>
      <Head>
        <title>{`${siteConfig.name} — Logos & Graphics for Businesses`}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="keywords"
          content="Adwise Media, logo design, branding, graphic design, marketing, content creation, adwisemedia.co"
        />
        <link rel="canonical" href={siteConfig.url} />
        <meta property="og:title" content={`${siteConfig.name} — Logos & Graphics for Businesses`} />
        <meta property="og:description" content={siteConfig.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteConfig.url} />
        <meta property="og:image" content={`${siteConfig.url}/logo.png`} />
        <meta property="og:site_name" content={siteConfig.name} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${siteConfig.name} — Logos & Graphics for Businesses`} />
        <meta name="twitter:description" content={siteConfig.description} />
      </Head>

      <JsonLd />
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
