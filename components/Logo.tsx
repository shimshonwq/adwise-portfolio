import Link from 'next/link'
import { siteConfig } from '../config/site.config'

interface LogoProps {
  href?: string
  className?: string
  wordmarkClassName?: string
  showWordmark?: boolean
}

export default function Logo({
  href = '/',
  className = '',
  wordmarkClassName = 'text-ink',
  showWordmark = true,
}: LogoProps) {
  return (
    <Link href={href} className={`group inline-flex items-center gap-2.5 ${className}`} aria-label={siteConfig.name}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-mark.svg"
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:rotate-3"
      />
      {showWordmark && (
        <span className={`font-heading text-2xl font-bold tracking-tight ${wordmarkClassName}`}>
          adwise<span className="text-brand">.</span>
        </span>
      )}
    </Link>
  )
}
