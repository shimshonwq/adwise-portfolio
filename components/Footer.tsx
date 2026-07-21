import Logo from './Logo'
import ContactChannels from './ContactChannels'
import { siteConfig } from '../config/site.config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-ink py-14 text-white">
      <div className="site-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/#top" size="sm" bright />
          <p className="mt-4 max-w-xs text-sm">
            <span className="brand-shimmer font-display font-bold">{siteConfig.tagline}</span>
          </p>
          <ContactChannels variant="onDark" className="mt-6" />
        </div>

        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="font-semibold text-brand">Explore</p>
            <ul className="mt-3 space-y-2 text-white/55">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={`/${item.href}`} className="hover:text-white">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-brand">Contact</p>
            <ul className="mt-3 space-y-2 text-white/55">
              <li>
                <a href={siteConfig.contactChannels.email} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={siteConfig.contactChannels.call} className="hover:text-white">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contactChannels.whatsapp}
                  className="hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={siteConfig.url} className="hover:text-white">
                  adwisemedia.co
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-shell mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:justify-between">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>Marketing · Content · Design</p>
      </div>
    </footer>
  )
}
