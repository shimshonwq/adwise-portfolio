import type { AppProps } from 'next/app'
import { Fredoka, DM_Sans } from 'next/font/google'
import '../styles/globals.css'

/** Fredoka matches the rounded, chunky letterforms in the Adwise logo */
const logoFont = Fredoka({
  subsets: ['latin'],
  variable: '--font-logo',
  display: 'swap',
  weight: ['500', '600', '700'],
})

const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${logoFont.variable} ${dm.variable} font-body`}>
      <Component {...pageProps} />
    </div>
  )
}
