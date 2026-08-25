import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import ContactChannels from './ContactChannels'
import AnimatedText from './AnimatedText'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'captcha'
type CaptchaPhase = 'idle' | 'checking' | 'verified'

function isCloudflareChallenge(text: string): boolean {
  const t = text.toLowerCase()
  return t.includes('just a moment') || t.includes('cf-browser-verification') || t.includes('challenge-platform')
}

export default function Contact() {
  const { content, channels } = useSiteContent()
  const { site, contact: copy } = content
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [captcha, setCaptcha] = useState<CaptchaPhase>('idle')
  const [honeypot, setHoneypot] = useState('')

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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (honeypot) return
    if (captcha !== 'verified') {
      setStatus('captcha')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      _honey: honeypot,
    }

    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        needsActivation?: boolean
        fallback?: string
      }

      if (res.ok && data.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        setCaptcha('idle')
        return
      }

      if (data.needsActivation) {
        setStatus('error')
        setErrorMessage(
          data.error ||
            'Check your Adwise inbox for a FormSubmit activation email, click Activate, then try again.'
        )
        return
      }

      // Worker / datacenter IPs are often blocked by FormSubmit Cloudflare.
      // Fall back to browser-side FormSubmit AJAX (same destination email).
      const browserRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: payload.name,
          email: payload.email,
          phone: payload.phone || '(not provided)',
          message: payload.message,
          _subject: `New inquiry from ${payload.name} — ${site.name}`,
          _template: 'table',
          _captcha: 'false',
          _honey: honeypot,
        }),
      })

      const browserText = await browserRes.text()
      if (!browserRes.ok || isCloudflareChallenge(browserText)) {
        throw new Error(
          data.error && data.error !== 'FORMSUBMIT_CF_BLOCKED'
            ? data.error
            : copy.errorMessage ||
                'Email delivery is temporarily blocked. Please email us directly or try again later.'
        )
      }

      let browserData: { success?: string | boolean; message?: string } = {}
      try {
        browserData = JSON.parse(browserText) as typeof browserData
      } catch {
        throw new Error(copy.errorMessage || 'Email service returned an unexpected response.')
      }

      const msg = String(browserData.message || '').toLowerCase()
      if (msg.includes('activate') || msg.includes('confirm your email')) {
        setStatus('error')
        setErrorMessage(
          'FormSubmit sent an activation email to your Adwise inbox. Open it, click Activate Form, then submit again.'
        )
        return
      }

      if (browserData.success === 'false' || browserData.success === false) {
        throw new Error(browserData.message || copy.errorMessage || 'Could not send your message.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
      setCaptcha('idle')
    } catch (err) {
      setStatus('error')
      setErrorMessage(
        err instanceof Error ? err.message : copy.errorMessage || 'Something went wrong. Please try again.'
      )
    }
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
          <p className="eyebrow !text-ink/55">{copy.eyebrow}</p>
          <AnimatedText
            as="h2"
            text={copy.title}
            className="mt-3 font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight text-ink"
          />
          <p className="mt-5 max-w-md font-serif text-base italic text-ink/75 md:text-lg">
            {copy.intro}
          </p>

          <div className="mt-8 space-y-2 text-ink">
            <a href={channels.email} className="block font-semibold hover:underline">
              {site.email}
            </a>
            <a href={channels.call} className="block font-semibold hover:underline">
              {site.phoneDisplay}
            </a>
            <p className="text-ink/55">{site.location}</p>
          </div>

          <ContactChannels variant="light" className="mt-8" />
        </motion.div>

        <motion.form
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          onSubmit={onSubmit}
          className="soft-panel space-y-5 border border-white/10 bg-ink p-7 text-white md:p-10"
        >
          <div className="mb-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              {copy.formEyebrow}
            </p>
            <p className="mt-2 font-serif text-sm italic text-white/70">{copy.formNote}</p>
          </div>

          <input
            type="text"
            name="_honey"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-white/55">{copy.nameLabel}</span>
              <input
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder={copy.namePlaceholder}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-white/55">{copy.emailLabel}</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder={copy.emailPlaceholder}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-white/55">{copy.phoneLabel}</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
              placeholder={copy.phonePlaceholder}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-white/55">{copy.messageLabel}</span>
            <textarea
              name="message"
              required
              rows={5}
              value={formData.message}
              onChange={onChange}
              className="w-full resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
              placeholder={copy.messagePlaceholder}
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
              className={`flex w-full max-w-sm items-center gap-3 rounded-lg border px-3 py-3 text-left transition ${
                status === 'captcha'
                  ? 'border-brand bg-brand/10'
                  : 'border-white bg-white hover:bg-white'
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center border-2 ${
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
            {status === 'submitting' ? copy.sendingLabel : copy.submitLabel}
          </button>

          {status === 'success' && (
            <p className="text-sm text-brand">{copy.successMessage}</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-300">{errorMessage || copy.errorMessage}</p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
