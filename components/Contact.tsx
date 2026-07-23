import { useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import ContactChannels from './ContactChannels'
import AnimatedText from './AnimatedText'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
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
          phone: formData.phone,
          message: formData.message,
          _subject: `New inquiry from ${formData.name} — Adwise Media`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      if (res.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 relative overflow-hidden brand-field grain py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.45), transparent 35%), radial-gradient(circle at 85% 75%, rgba(14,14,14,0.1), transparent 30%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 grid gap-14 md:grid-cols-[0.95fr_1.05fr] md:items-start">
        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow !text-ink/55">Contact</p>
          <AnimatedText
            as="h2"
            text="Let’s make something people can’t ignore."
            shimmer
            className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
          />
          <p className="mt-5 max-w-md text-lg text-ink/70">
            Tell us about your project — or reach out right now on WhatsApp, email, call, or text.
          </p>

          <div className="panel-3d mt-8 space-y-3 rounded-[1.5rem] border border-ink/10 bg-white/70 p-6 backdrop-blur-sm">
            <a
              href={siteConfig.contactChannels.email}
              className="block text-lg font-semibold hover:underline"
            >
              {siteConfig.email}
            </a>
            <a
              href={siteConfig.contactChannels.call}
              className="block text-lg font-semibold hover:underline"
            >
              {siteConfig.phoneDisplay}
            </a>
            <p className="text-ink/55">{siteConfig.location}</p>
          </div>

          <ContactChannels variant="light" className="mt-8" />
        </motion.div>

        <motion.form
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          onSubmit={onSubmit}
          className="soft-panel panel-3d panel-3d-dark space-y-5 border border-ink/20 bg-ink p-8 text-white md:p-10"
        >
          <div className="mb-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              Project inquiry
            </p>
            <p className="mt-2 text-sm text-white/50">Usually reply within one business day.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-white/55">Name</span>
              <input
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder="Your name"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-white/55">Email</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder="you@company.com"
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-white/55">Phone number</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
              placeholder="(555) 000-0000"
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-white/55">Message</span>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={onChange}
              className="w-full resize-none rounded-2xl border border-white/15 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
              placeholder="What are we building?"
            />
          </label>

          <button type="submit" disabled={status === 'submitting'} className="btn btn-on-dark mt-2">
            {status === 'submitting' ? 'Sending…' : 'Send message'}
          </button>

          {status === 'success' && (
            <p className="text-sm text-brand">Thanks! We’ll be in touch shortly.</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-300">
              Something went wrong — email {siteConfig.email} or call {siteConfig.phoneDisplay}.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
