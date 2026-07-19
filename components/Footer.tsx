import Logo from './Logo'
import { siteConfig } from '../config/site.config'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-paper py-14">
      <div className="site-shell flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo href="/#top" size="sm" />
          <p className="mt-4 max-w-xs text-sm text-ink/55">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-wrap gap-12 text-sm">
          <div>
            <p className="font-semibold text-ink">Explore</p>
            <ul className="mt-3 space-y-2 text-ink/55">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <a href={`/${item.href}`} className="hover:text-ink">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink">Contact</p>
            <ul className="mt-3 space-y-2 text-ink/55">
              <li>
                <a href={`mailto:${siteConfig.email}`} className="hover:text-ink">
                  {siteConfig.email}
                </a>
              </li>
              <li>
                <a href={`tel:+1${siteConfig.phone}`} className="hover:text-ink">
                  {siteConfig.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={siteConfig.url} className="hover:text-ink">
                  adwisemedia.co
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="site-shell mt-12 flex flex-col gap-2 border-t border-line pt-6 text-sm text-ink/40 sm:flex-row sm:justify-between">
        <p>
          © {year} {siteConfig.name}
        </p>
        <p>Marketing · Content · Design</p>
      </div>
    </footer>
  )
}
