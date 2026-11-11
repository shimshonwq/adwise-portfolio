import type { AppProps } from 'next/app'
import { Outfit, Syne } from 'next/font/google'
import SkipLink from '../components/SkipLink'
import { SiteContentProvider } from '../lib/SiteContentContext'
import type { CmsContent } from '../lib/content'
import '../styles/globals.css'

type PageProps = {
  initialContent?: CmsContent | null
}

/**
 * Syne — bold geometric display (matches logo energy).
 * Outfit — clean modern body.
 */
const displayFont = Syne({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
  weight: ['600', '700', '800'],
})

const bodyFont = Outfit({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export default function App({ Component, pageProps }: AppProps & { pageProps: PageProps }) {
  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} ${bodyFont.className}`}
      style={
        {
          '--font-display-stack': displayFont.style.fontFamily,
          '--font-body-stack': bodyFont.style.fontFamily,
          '--font-serif-stack': bodyFont.style.fontFamily,
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
