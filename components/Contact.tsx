import { useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')

    try {
      const res = await fetch(`https://formsubmit.co/ajax/${siteConfig.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
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

  return (
    <section id="contact" className="scroll-mt-24 bg-brand py-24 md:py-32">
      <div className="site-shell grid gap-14 md:grid-cols-2 md:items-start">
        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="eyebrow !text-ink/55">Contact</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
            Let’s make something people can’t ignore.
          </h2>
          <p className="mt-5 max-w-md text-lg text-ink/70">
            Tell us about your project. We typically reply within one business day.
          </p>

          <div className="mt-10 space-y-3 text-ink">
            <a href={`mailto:${siteConfig.email}`} className="block font-semibold hover:underline">
              {siteConfig.email}
            </a>
            <a href={`tel:+1${siteConfig.phone}`} className="block font-semibold hover:underline">
              {siteConfig.phoneDisplay}
            </a>
            <p className="text-ink/60">{siteConfig.location}</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
          onSubmit={onSubmit}
          className="space-y-5 bg-ink p-8 text-paper md:p-10"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-paper/55">Name</span>
              <input
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-paper outline-none transition focus:border-brand"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-paper/55">Email</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                className="w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-paper outline-none transition focus:border-brand"
                placeholder="you@company.com"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-paper/55">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={onChange}
              className="w-full resize-none border-0 border-b border-white/20 bg-transparent px-0 py-3 text-paper outline-none transition focus:border-brand"
              placeholder="What are we building?"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="mt-2 bg-brand px-7 py-3.5 text-sm font-semibold text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-brand">
              Message sent. If this is your first inquiry, check {siteConfig.email} for a one-time
              FormSubmit confirmation link.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-300">
              Something went wrong — email us at {siteConfig.email} or call {siteConfig.phoneDisplay}.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
