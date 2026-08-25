import Link from 'next/link'
import { useSiteContent } from '../lib/SiteContentContext'

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  bright?: boolean
  /** brand = yellow mark (default); ink = dark mark for gold/cream backgrounds */
  tone?: 'brand' | 'ink'
}

const sizes = {
  sm: 'h-8 md:h-9',
  md: 'h-10 md:h-11',
  lg: 'h-14 md:h-16',
}

export default function Logo({
  href = '/',
  className = '',
  size = 'md',
  bright = false,
  tone = 'brand',
}: LogoProps) {
  const { content } = useSiteContent()
  const siteName = content.site.name
  const src = tone === 'ink' ? '/logo-ink.png' : '/logo.png'
  return (
    <Link href={href} className={`inline-flex items-center ${className}`} aria-label={siteName}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={siteName}
        width={200}
        height={62}
        className={`w-auto ${sizes[size]} ${bright ? 'drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]' : ''}`}
      />
    </Link>
  )
}
