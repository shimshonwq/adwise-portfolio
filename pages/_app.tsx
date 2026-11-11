import type { AppProps } from 'next/app'
import { Bricolage_Grotesque, EB_Garamond, Sora } from 'next/font/google'
import SkipLink from '../components/SkipLink'
import { SiteContentProvider } from '../lib/SiteContentContext'
import type { CmsContent } from '../lib/content'
import '../styles/globals.css'

type PageProps = {
  initialContent?: CmsContent | null
}

/**
 * Bricolage Grotesque — distinctive display.
 * Sora — clean geometric body.
 * EB Garamond italic — editorial accent voice.
 */
const displayFont = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
})

const bodyFont = Sora({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const serifFont = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-serif-face',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: 'italic',
})

export default function App({ Component, pageProps }: AppProps & { pageProps: PageProps }) {
  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} ${serifFont.variable} ${bodyFont.className}`}
      style={
        {
          '--font-display-stack': displayFont.style.fontFamily,
          '--font-body-stack': bodyFont.style.fontFamily,
          '--font-serif-stack': serifFont.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <SkipLink />
      <SiteContentProvider initialContent={pageProps.initialContent}>
        <Component {...pageProps} />
      </SiteContentProvider>
    </div>
  )
}
