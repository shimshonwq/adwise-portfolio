import type { AppProps } from 'next/app'
import { Manrope, Syne } from 'next/font/google'
import '../styles/globals.css'

/**
 * Syne gives the site a sharper premium display voice.
 * Applied via style.fontFamily so headings always pick it up reliably.
 */
const displayFont = Syne({
  subsets: ['latin'],
  variable: '--font-display-face',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body-face',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} ${bodyFont.className}`}
      style={
        {
          '--font-display-stack': displayFont.style.fontFamily,
          '--font-body-stack': bodyFont.style.fontFamily,
        } as React.CSSProperties
      }
    >
      <Component {...pageProps} />
    </div>
  )
}
