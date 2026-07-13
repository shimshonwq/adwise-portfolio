import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { href: '#portfolio', label: 'Portfolio' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 w-full bg-white dark:bg-primary shadow-lg z-50">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold font-heading text-secondary">
          ADWISE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {menuItems.map(item => (
            <a
              key={item.href}
              href={item.href}
              className="text-primary dark:text-light hover:text-secondary transition"
            >
              {item.label}
            </a>
          ))}
          <button className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-80 transition">
            Get in Touch
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex flex-col gap-1"
        >
          <div className="w-6 h-0.5 bg-primary dark:bg-light"></div>
          <div className="w-6 h-0.5 bg-primary dark:bg-light"></div>
          <div className="w-6 h-0.5 bg-primary dark:bg-light"></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-light dark:bg-primary border-t"
        >
          <div className="px-4 py-4 flex flex-col gap-4">
            {menuItems.map(item => (
              <a key={item.href} href={item.href} className="text-primary dark:text-light">
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  )
}