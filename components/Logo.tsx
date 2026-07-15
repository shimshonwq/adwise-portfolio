import Link from 'next/link'
import { siteConfig } from '../config/site.config'

interface LogoProps {
  href?: string
  className?: string
  /** 'dark' = default nav on cream; 'light' = on dark backgrounds */
  variant?: 'dark' | 'light'
}

export default function Logo({
  href = '/',
  className = '',
  variant = 'dark',
}: LogoProps) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center ${className}`}
      aria-label={siteConfig.name}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.png"
        alt={siteConfig.name}
        width={180}
        height={56}
        className={`h-9 w-auto transition-transform duration-300 group-hover:-translate-y-0.5 md:h-10 ${
          variant === 'light' ? 'brightness-0 invert' : ''
        }`}
      />
    </Link>
  )
}
