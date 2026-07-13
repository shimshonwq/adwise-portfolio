import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const socialLinks = [
    { icon: FaEnvelope, href: 'mailto:your-email@example.com', label: 'Email' },
    { icon: FaLinkedin, href: '#', label: 'LinkedIn' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
  ]

  return (
    <section id="contact" className="py-20 px-4 bg-light dark:bg-primary/50">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold font-heading mb-12 text-center text-primary dark:text-light">
          Let's Work Together
        </h2>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary focus:outline-none focus:border-secondary"
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary focus:outline-none focus:border-secondary"
            />
          </div>
          <textarea
            name="message"
            placeholder="Your Message"
            rows={6}
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-primary focus:outline-none focus:border-secondary"
          ></textarea>
          <button
            type="submit"
            className="w-full px-8 py-3 bg-secondary text-white rounded-lg font-bold hover:bg-opacity-80 transition"
          >
            {submitted ? 'Message Sent!' : 'Send Message'}
          </button>
        </motion.form>

        <div className="mt-16 flex justify-center gap-8">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.label}
                href={link.href}
                className="text-3xl text-primary dark:text-light hover:text-secondary transition"
                aria-label={link.label}
              >
                <Icon />
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}