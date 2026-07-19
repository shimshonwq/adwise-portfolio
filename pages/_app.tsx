import type { AppProps } from 'next/app'
import { Syne, DM_Sans } from 'next/font/google'
import '../styles/globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

const dm = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${syne.variable} ${dm.variable} font-body`}>
      <Component {...pageProps} />
    </div>
  )
}
