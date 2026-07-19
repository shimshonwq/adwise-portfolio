import type { AppProps } from 'next/app'
import { Outfit, Manrope } from 'next/font/google'
import '../styles/globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${outfit.variable} ${manrope.variable} font-body`}>
      <Component {...pageProps} />
    </div>
  )
}
