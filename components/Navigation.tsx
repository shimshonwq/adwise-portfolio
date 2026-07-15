import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiMenu, FiX } from 'react-icons/fi'
import Logo from './Logo'
import { siteConfig } from '../config/site.config'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-black/5 bg-cream/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Logo href="/#top" />

        <div className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <a
              key={item.href}
              href={`/${item.href}`}
              className="text-sm font-medium text-ink/70 transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a
            href="/#contact"
            className="rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand hover:shadow-glow"
          >
            Get in touch
          </a>
        </div>

        <button
          onClick={() => setIsOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5 md:hidden"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-black/5 bg-cream/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {siteConfig.nav.map((item) => (
                <a
                  key={item.href}
                  href={`/${item.href}`}
                  onClick={() => setIsOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-ink/80 transition-colors hover:bg-black/5 hover:text-ink"
                >
                  {item.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 rounded-full bg-ink px-5 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-brand"
              >
                Get in touch
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
