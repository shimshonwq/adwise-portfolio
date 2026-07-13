import Head from 'next/head'
import Hero from '../components/Hero'
import Portfolio from '../components/Portfolio'
import About from '../components/About'
import Contact from '../components/Contact'
import Navigation from '../components/Navigation'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Adwise Media - Marketing & Design Portfolio</title>
        <meta name="description" content="Explore my work as a marketer, content creator, and graphic designer. See logos, campaigns, and creative projects." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Adwise Media Portfolio" />
        <meta property="og:description" content="Marketing, Content Creation & Graphic Design" />
        <meta property="og:type" content="website" />
      </Head>

      <Navigation />
      <main>
        <Hero />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  )
}