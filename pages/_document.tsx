import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="Adwise Media - Marketing, Content Creation & Graphic Design Portfolio" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Museo+Moderno:wght@400;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body className="bg-white dark:bg-primary text-primary dark:text-light">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}