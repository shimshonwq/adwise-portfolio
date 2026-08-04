import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '../config/site.config'
import ContactChannels from './ContactChannels'
import AnimatedText from './AnimatedText'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'captcha'
type CaptchaPhase = 'idle' | 'checking' | 'verified'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [captcha, setCaptcha] = useState<CaptchaPhase>('idle')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('sent') === '1') setStatus('success')
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onCaptchaPress = () => {
    if (captcha === 'checking' || captcha === 'verified') return
    setCaptcha('checking')
    setStatus((s) => (s === 'captcha' ? 'idle' : s))
    window.setTimeout(() => setCaptcha('verified'), 650)
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (captcha !== 'verified') {
      e.preventDefault()
      setStatus('captcha')
      return
    }
    setStatus('submitting')
  }

  return (
    <section id="contact" className="scroll-mt-24 relative overflow-hidden brand-field py-24 md:py-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 15% 20%, rgba(255,255,255,0.45), transparent 35%), radial-gradient(circle at 85% 75%, rgba(14,14,14,0.1), transparent 30%)',
        }}
        aria-hidden
      />

      <div className="site-shell relative z-10 grid gap-14 md:grid-cols-2 md:items-start">
        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow !text-ink/55">Contact</p>
          <AnimatedText
            as="h2"
            text="Get in touch"
            shimmer
            className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl"
          />
          <p className="mt-5 max-w-md text-lg text-ink/70">
            Tell us what you’re building — or reach us on WhatsApp, email, call, or text.
          </p>

          <div className="mt-8 space-y-2 text-ink">
            <a href={siteConfig.contactChannels.email} className="block font-semibold hover:underline">
              {siteConfig.email}
            </a>
            <a href={siteConfig.contactChannels.call} className="block font-semibold hover:underline">
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
          action={`https://formsubmit.co/${siteConfig.email}`}
          method="POST"
          onSubmit={onSubmit}
          className="soft-panel space-y-5 border border-ink/15 bg-ink p-8 text-white md:p-10"
        >
          <div className="mb-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              Project inquiry
            </p>
            <p className="mt-2 text-sm text-white/50">Usually reply within one business day.</p>
          </div>

          <input
            type="hidden"
            name="_subject"
            value={`New inquiry from ${formData.name || 'website'} — Adwise Media`}
          />
          <input type="hidden" name="_template" value="table" />
          <input type="hidden" name="_captcha" value="true" />
          <input type="hidden" name="_next" value={`${siteConfig.url}/?sent=1#contact`} />
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

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

          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Verify you’re human
            </p>
            <button
              type="button"
              onClick={onCaptchaPress}
              aria-pressed={captcha === 'verified'}
              className={`flex w-full max-w-sm items-center gap-3 rounded-xl border px-3 py-3 text-left transition ${
                status === 'captcha'
                  ? 'border-brand/60 bg-brand/10'
                  : 'border-white/20 bg-white hover:bg-white'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded border-2 ${
                  captcha === 'verified'
                    ? 'border-emerald-600 bg-emerald-500 text-white'
                    : 'border-black/35 bg-white'
                }`}
                aria-hidden
              >
                {captcha === 'checking' && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-ink/25 border-t-ink" />
                )}
                {captcha === 'verified' && (
                  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
                    <path
                      d="M5 10.5 8.2 13.5 15 6.5"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="flex-1 text-sm font-medium text-ink">
                {captcha === 'checking'
                  ? 'Checking…'
                  : captcha === 'verified'
                    ? 'Verified'
                    : 'I’m not a robot'}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/40">
                reCAPTCHA
              </span>
            </button>
            {status === 'captcha' && (
              <p className="text-sm text-brand">Please press “I’m not a robot” before sending.</p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'submitting' || captcha === 'checking'}
            className="btn btn-on-dark mt-2"
          >
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
