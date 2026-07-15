import type { AppProps } from 'next/app'
import { Inter, MuseoModerno } from 'next/font/google'
import '../styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const museo = MuseoModerno({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-museo',
  display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={`${inter.variable} ${museo.variable}`}>
      <Component {...pageProps} />
    </div>
  )
}
