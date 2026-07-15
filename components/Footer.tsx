import Logo from './Logo'
import { siteConfig } from '../config/site.config'
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaBehance } from 'react-icons/fa6'

export default function Footer() {
  const year = new Date().getFullYear()

  const socials = [
    { icon: FaInstagram, href: siteConfig.socialLinks.instagram, label: 'Instagram' },
    { icon: FaLinkedinIn, href: siteConfig.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: FaXTwitter, href: siteConfig.socialLinks.twitter, label: 'Twitter / X' },
    { icon: FaBehance, href: siteConfig.socialLinks.behance, label: 'Behance' },
  ].filter((s) => s.href)

  return (
    <footer className="border-t border-black/5 bg-cream px-5 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo href="/#top" />
            <p className="mt-4 max-w-xs text-sm text-ink/60">{siteConfig.tagline}</p>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-ink">Explore</h4>
            <ul className="mt-4 space-y-2 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={`/${item.href}`}
                    className="text-ink/60 transition-colors hover:text-brand"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-lg font-bold text-ink">Get in touch</h4>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 block text-sm text-ink/60 transition-colors hover:text-brand"
            >
              {siteConfig.email}
            </a>
            <p className="mt-1 text-sm text-ink/60">{siteConfig.location}</p>
            {socials.length > 0 && (
              <div className="mt-4 flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-ink/70 transition-colors hover:border-brand hover:bg-brand hover:text-white"
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-black/5 pt-6 text-sm text-ink/50 sm:flex-row">
          <p>
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p>Crafted with care.</p>
        </div>
      </div>
    </footer>
  )
}
