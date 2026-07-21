import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './Logo'
import { siteConfig } from '../config/site.config'

export default function Navigation() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const onDarkHero = !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background,border-color] duration-300 ${
        scrolled
          ? 'border-b border-line bg-paper/90 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="site-shell flex h-16 items-center justify-between md:h-20">
        <Logo href="/#top" size="sm" bright={onDarkHero} />

        <div
          className={`hidden items-center gap-8 rounded-full px-5 py-3 md:flex ${
            onDarkHero ? 'border border-white/10 bg-black/25 backdrop-blur-md' : ''
          }`}
        >
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              className={`text-sm font-medium tracking-wide transition-colors ${
                onDarkHero ? 'text-white/70 hover:text-white' : 'text-ink/65 hover:text-ink'
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contact"
            className={`btn !py-2.5 !px-5 ${onDarkHero ? 'btn-on-dark' : 'btn-primary'}`}
          >
            Start a project
          </a>
        </div>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`block h-0.5 w-6 transition ${onDarkHero && !open ? 'bg-white' : 'bg-ink'} ${open ? 'translate-y-2 rotate-45' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 transition ${onDarkHero && !open ? 'bg-white' : 'bg-ink'} ${open ? 'opacity-0' : ''}`}
          />
          <span
            className={`block h-0.5 w-6 transition ${onDarkHero && !open ? 'bg-white' : 'bg-ink'} ${open ? '-translate-y-2 -rotate-45' : ''}`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-paper md:hidden"
          >
            <div className="site-shell flex h-full flex-col justify-center gap-2 pt-16">
              {siteConfig.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={`/${item.href}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="font-display text-4xl font-bold tracking-tight text-ink"
                >
                  {item.label}
                </motion.a>
              ))}
              <a
                href="/#contact"
                onClick={() => setOpen(false)}
                className="btn btn-brand mt-8 w-fit"
              >
                Start a project
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
