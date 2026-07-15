import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMail, FiMapPin, FiPhone, FiSend } from 'react-icons/fi'
import { FaInstagram, FaLinkedinIn, FaXTwitter, FaBehance } from 'react-icons/fa6'
import { siteConfig } from '../config/site.config'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    // FormSubmit delivers messages straight to the inbox — no backend required.
    // First-time use: FormSubmit sends a confirmation email to activate the form.
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${siteConfig.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _subject: `New inquiry from ${formData.name} — Adwise Media`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const socials = [
    { icon: FaInstagram, href: siteConfig.socialLinks.instagram, label: 'Instagram' },
    { icon: FaLinkedinIn, href: siteConfig.socialLinks.linkedin, label: 'LinkedIn' },
    { icon: FaXTwitter, href: siteConfig.socialLinks.twitter, label: 'Twitter / X' },
    { icon: FaBehance, href: siteConfig.socialLinks.behance, label: 'Behance' },
  ].filter((s) => s.href)

  const phoneHref = `tel:+1${siteConfig.phone}`

  return (
    <section id="contact" className="scroll-mt-24 px-5 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-ink text-white shadow-card">
        <div className="grid gap-0 md:grid-cols-5">
          <div className="relative flex flex-col justify-between gap-10 p-8 md:col-span-2 md:p-12">
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-brand/30 blur-3xl" />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand">Contact</p>
              <h2 className="mt-3 font-heading text-4xl font-bold">Let's work together</h2>
              <p className="mt-4 text-white/60">
                Have a project in mind? Tell us about it and we'll get back to you within one
                business day.
              </p>
            </div>

            <div className="relative space-y-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <FiMail />
                </span>
                {siteConfig.email}
              </a>
              <a
                href={phoneHref}
                className="flex items-center gap-3 text-white/80 transition-colors hover:text-white"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <FiPhone />
                </span>
                {siteConfig.phoneDisplay}
              </a>
              <div className="flex items-center gap-3 text-white/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                  <FiMapPin />
                </span>
                {siteConfig.location}
              </div>
            </div>

            {socials.length > 0 && (
              <div className="relative flex gap-3">
                {socials.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-lg transition-colors hover:bg-brand hover:text-ink"
                    >
                      <Icon />
                    </a>
                  )
                })}
              </div>
            )}
          </div>

          <motion.form
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-5 bg-white/[0.03] p-8 md:col-span-3 md:p-12"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-white/70">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/70">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="jane@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
                />
              </div>
            </div>
            <div>
              <label htmlFor="message" className="mb-2 block text-sm font-medium text-white/70">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us about your project..."
                rows={6}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-3.5 text-base font-semibold text-ink transition-all hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
            >
              {status === 'submitting' ? 'Sending...' : 'Send message'}
              <FiSend />
            </button>

            {status === 'success' && (
              <p className="text-sm font-medium text-brand">
                Thanks! Your message is on its way — we'll be in touch shortly.
                {` `}(If this is the first message ever, check {siteConfig.email} for a
                one-time FormSubmit confirmation link.)
              </p>
            )}
            {status === 'error' && (
              <p className="text-sm font-medium text-red-400">
                Something went wrong. Please email us directly at{' '}
                <a className="underline" href={`mailto:${siteConfig.email}`}>
                  {siteConfig.email}
                </a>{' '}
                or call {siteConfig.phoneDisplay}.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  )
}
