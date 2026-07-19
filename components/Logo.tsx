import Link from 'next/link'
import { siteConfig } from '../config/site.config'

interface LogoProps {
  href?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'h-8 md:h-9',
  md: 'h-10 md:h-11',
  lg: 'h-14 md:h-16',
}

export default function Logo({ href = '/', className = '', size = 'md' }: LogoProps) {
  return (
    <Link href={href} className={`inline-flex items-center ${className}`} aria-label={siteConfig.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt={siteConfig.name}
        width={200}
        height={62}
        className={`w-auto ${sizes[size]}`}
      />
    </Link>
  )
}
