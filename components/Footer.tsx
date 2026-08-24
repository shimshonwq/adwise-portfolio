import Logo from './Logo'
import ContactChannels from './ContactChannels'
import { siteConfig } from '../config/site.config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-ink py-16 text-white">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 50% 40% at 85% 0%, rgba(253,198,33,0.18), transparent 55%)',
        }}
        aria-hidden
      />
      <div className="site-shell relative z-10">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <Logo href="/#top" size="sm" bright />
            <p className="mt-5 font-display text-2xl font-bold leading-snug md:text-3xl">
              <span className="brand-shimmer">{siteConfig.tagline}</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Branding, logos, and marketing creatives for businesses that want to stand out.
            </p>
            <ContactChannels variant="onDark" className="mt-7" />
          </div>

          <div className="flex flex-wrap gap-14 text-sm">
            <div>
              <p className="font-semibold text-brand">Explore</p>
              <ul className="mt-4 space-y-2.5 text-white/55">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a href={`/${item.href}`} className="transition-colors hover:text-white">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold text-brand">Contact</p>
              <ul className="mt-4 space-y-2.5 text-white/55">
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

        <div className="mt-14 flex flex-col gap-2 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:justify-between">
          <p>
            © {year} {siteConfig.name}
          </p>
          <p>Marketing · Content · Design</p>
        </div>
      </div>
    </footer>
  )
}
