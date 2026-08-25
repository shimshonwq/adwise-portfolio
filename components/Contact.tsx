import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import ContactChannels from './ContactChannels'
import AnimatedText from './AnimatedText'
import TurnstileField from './TurnstileField'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'captcha'

export default function Contact() {
  const { content, channels } = useSiteContent()
  const { site, contact: copy } = content
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null)
  const [turnstileRequired, setTurnstileRequired] = useState(false)
  const [captchaConfigLoaded, setCaptchaConfigLoaded] = useState(false)
  const [turnstileMountKey, setTurnstileMountKey] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('sent') === '1') setStatus('success')
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/captcha-config/')
        const data = (await res.json().catch(() => ({}))) as { siteKey?: string | null }
        if (cancelled) return
        const key = String(data.siteKey || '').trim()
        if (key) {
          setTurnstileSiteKey(key)
          setTurnstileRequired(true)
        } else {
          setTurnstileSiteKey(null)
          setTurnstileRequired(false)
        }
      } catch {
        if (!cancelled) {
          setTurnstileSiteKey(null)
          setTurnstileRequired(false)
        }
      } finally {
        if (!cancelled) setCaptchaConfigLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const resetTurnstile = () => {
    setTurnstileToken(null)
    setTurnstileMountKey((k) => k + 1)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (honeypot) return

    if (turnstileRequired && !turnstileToken) {
      setStatus('captcha')
      setErrorMessage('Please complete the “Verify you are human” check.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      turnstileToken: turnstileToken || '',
      _honey: honeypot,
    }

    try {
      const controller = new AbortController()
      const timer = window.setTimeout(() => controller.abort(), 25000)
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      })
      window.clearTimeout(timer)

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
        needsActivation?: boolean
        provider?: string
      }

      if (res.ok && data.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        resetTurnstile()
        return
      }

      setStatus('error')
      setErrorMessage(
        data.error ||
          copy.errorMessage ||
          `Something went wrong — email us at ${site.email}.`
      )
      resetTurnstile()
    } catch (err) {
      setStatus('error')
      const aborted = err instanceof Error && err.name === 'AbortError'
      setErrorMessage(
        aborted
          ? `Sending timed out — please email us at ${site.email}.`
          : err instanceof Error
            ? err.message
            : copy.errorMessage || 'Something went wrong. Please try again.'
      )
      resetTurnstile()
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
          <p className="eyebrow !text-ink/80">{copy.eyebrow}</p>
          <AnimatedText
            as="h2"
            text={copy.title}
            className="mt-3 font-display text-[clamp(1.65rem,6vw,3.25rem)] font-bold tracking-tight text-ink"
          />
          <p className="mt-5 max-w-md font-serif text-base italic text-ink/80 md:text-lg">
            {copy.intro}
          </p>

          <div className="mt-8 space-y-2 text-ink">
            <a href={channels.email} className="block font-semibold hover:underline">
              {site.email}
            </a>
            <a href={channels.call} className="block font-semibold hover:underline">
              {site.phoneDisplay}
            </a>
            <p className="text-ink/70">{site.location}</p>
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
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-2 block text-white/70">{copy.nameLabel}</span>
              <input
                name="name"
                required
                value={formData.name}
                onChange={onChange}
                autoComplete="name"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder={copy.namePlaceholder}
              />
            </label>
            <label className="block text-sm">
              <span className="mb-2 block text-white/70">{copy.emailLabel}</span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={onChange}
                autoComplete="email"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
                placeholder={copy.emailPlaceholder}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="mb-2 block text-white/70">{copy.phoneLabel}</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={onChange}
              autoComplete="tel"
              className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3.5 text-white outline-none transition focus:border-brand"
              placeholder={copy.phonePlaceholder}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-white/70">{copy.messageLabel}</span>
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

          {(!captchaConfigLoaded || turnstileSiteKey) && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                {copy.captchaLabel || 'Verify you’re human'}
              </p>
              {!captchaConfigLoaded ? (
                <p className="text-sm text-white/55">Loading security check…</p>
              ) : turnstileSiteKey ? (
                <div className="max-w-sm rounded-lg bg-white p-3">
                  <TurnstileField
                    key={turnstileMountKey}
                    siteKey={turnstileSiteKey}
                    theme="light"
                    onToken={(token) => {
                      setTurnstileToken(token)
                      if (token) {
                        setStatus((s) => (s === 'captcha' ? 'idle' : s))
                        setErrorMessage('')
                      }
                    }}
                  />
                </div>
              ) : null}
              {status === 'captcha' && (
                <p className="text-sm text-brand" role="alert">
                  {errorMessage || 'Please complete the “Verify you are human” check.'}
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn btn-on-dark mt-2"
          >
            {status === 'submitting' ? copy.sendingLabel : copy.submitLabel}
          </button>

          {status === 'success' && (
            <p className="text-sm text-brand" role="status">
              {copy.successMessage}
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-red-300" role="alert">
              {errorMessage || copy.errorMessage}{' '}
              <a className="underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
