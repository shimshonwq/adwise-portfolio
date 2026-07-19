import type { AppProps } from 'next/app'
import { Fredoka, Nunito } from 'next/font/google'
import '../styles/globals.css'

/**
 * Fredoka = rounded chunky display (matches Adwise logo / THINKINK letterforms).
 * Applied via style.fontFamily so headings always pick it up (not just a CSS variable).
 */
const logoFont = Fredoka({
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const bodyFont = Nunito({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${logoFont.variable} ${bodyFont.variable} ${bodyFont.className}`}
      style={
        {
          '--font-logo-stack': logoFont.style.fontFamily,
          '--font-body-stack': bodyFont.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <Component {...pageProps} />
    </div>
  )
}
