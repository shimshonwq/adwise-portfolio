import Link from 'next/link'
import { useSiteContent } from '../lib/SiteContentContext'
import { DEFAULT_BRAND, DEFAULT_CONTENT } from '../lib/content'

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  bright?: boolean
}

const sizes = {
  sm: 'h-8 md:h-9',
  md: 'h-10 md:h-11',
  lg: 'h-14 md:h-16',
}

export default function Logo({ href = '/', className = '', size = 'md', bright = false }: LogoProps) {
  const { content } = useSiteContent()
  const name = content.site?.name || DEFAULT_CONTENT.site.name
  const src = content.brand?.logoSrc || DEFAULT_BRAND.logoSrc

  return (
    <Link href={href} className={`inline-flex items-center ${className}`} aria-label={name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        width={200}
        height={62}
        className={`w-auto ${sizes[size]} ${bright ? 'drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]' : ''}`}
      />
    </Link>
  )
}
