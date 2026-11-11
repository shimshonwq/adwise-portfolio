import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useSiteContent } from '../lib/SiteContentContext'
import ContactChannels from './ContactChannels'
import AnimatedText from './AnimatedText'
import TurnstileField, { type TurnstileHandle } from './TurnstileField'
import { friendlyContactError } from '../lib/contact-errors'
import { WORKERS_API, looksLikeChallenge } from '../lib/api-fallback'

type Status = 'idle' | 'submitting' | 'success' | 'error' | 'captcha'

async function postContact(payload: Record<string, string>, signal: AbortSignal) {
  const urls = [`/api/contact/`, `${WORKERS_API}/api/contact/`]
  let lastError = 'Could not send your message.'

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
        signal,
        credentials: url.startsWith('/') ? 'same-origin' : 'omit',
        mode: 'cors',
      })
      const raw = await res.text()
      if (looksLikeChallenge(raw)) {
        lastError = 'Security check blocked the request. Retrying…'
        continue
      }
      let data: { ok?: boolean; error?: string; provider?: string; needsActivation?: boolean } = {}
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {}
      } catch {
        lastError = 'Unexpected response from the server.'
        continue
      }
      return { res, data }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') throw err
      lastError = err instanceof Error ? err.message : 'Network error'
    }
  }

  throw new Error(lastError)
}

export default function Contact() {
  const { content, channels } = useSiteContent()
  const { site, contact: copy } = content
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileSiteKey, setTurnstileSiteKey] = useState<string | null>(null)
  const [turnstileRequired, setTurnstileRequired] = useState(false)
  const [captchaConfigLoaded, setCaptchaConfigLoaded] = useState(false)
  const turnstileRef = useRef<TurnstileHandle | null>(null)
  const feedbackRef = useRef<HTMLParagraphElement | null>(null)
  const [honeypot, setHoneypot] = useState('')

  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('sent') === '1') setStatus('success')
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const urls = ['/api/captcha-config/', `${WORKERS_API}/api/captcha-config/`]
      for (const url of urls) {
        try {
          const res = await fetch(url, { credentials: url.startsWith('/') ? 'same-origin' : 'omit' })
          const raw = await res.text()
          if (looksLikeChallenge(raw)) continue
          const data = JSON.parse(raw) as { siteKey?: string | null }
          if (cancelled) return
          const key = String(data.siteKey || '').trim()
          if (key) {
            setTurnstileSiteKey(key)
            setTurnstileRequired(true)
            setCaptchaConfigLoaded(true)
            return
          }
        } catch {
          /* try next */
        }
      }
      if (!cancelled) {
        setTurnstileSiteKey(null)
        setTurnstileRequired(false)
        setCaptchaConfigLoaded(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (status === 'error' || status === 'captcha' || status === 'success') {
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [status, errorMessage])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    const token =
      turnstileRef.current?.getToken() ||
      turnstileToken ||
      ''

    if (turnstileRequired && !token) {
      setStatus('captcha')
      setErrorMessage('Please complete the “Verify you are human” check, then press Send again.')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
      turnstileToken: token,
      _honey: honeypot.trim(),
    }

    try {
      const controller = new AbortController()
      const timer = window.setTimeout(() => controller.abort(), 30000)
      const { res, data } = await postContact(payload, controller.signal)
      window.clearTimeout(timer)

      if (res.ok && data.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })
        setHoneypot('')
        setTurnstileToken(null)
        turnstileRef.current?.reset()
        return
      }

      if (data.needsActivation) {
        setStatus('error')
        setErrorMessage(
          data.error ||
            'Check your inbox for a FormSubmit activation email, then try again.',
        )
        return
      }

      setStatus('error')
      setErrorMessage(
        friendlyContactError(data.error || '') ||
          copy.errorMessage ||
          'Something went wrong. Please try again.',
      )
      // Keep Turnstile token usable for a quick retry unless server rejected captcha.
      if (/human verification|verify you/i.test(String(data.error || ''))) {
        setTurnstileToken(null)
        turnstileRef.current?.reset()
      }
    } catch (err) {
      setStatus('error')
      const aborted = err instanceof Error && err.name === 'AbortError'
      setErrorMessage(
        aborted
          ? 'Sending timed out. Please try again or email us directly.'
          : err instanceof Error
            ? friendlyContactError(err.message)
            : copy.errorMessage || 'Something went wrong. Please try again.',
      )
    }
  }

  return (
    <section id="contact" className="contact-stage scroll-mt-24 relative overflow-hidden py-24 md:py-32">
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-brand/15 blur-3xl"
        aria-hidden
      />

      <div className="site-shell relative z-10 grid gap-14 md:grid-cols-2 md:items-start">
        <motion.div
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
        >
          <p className="eyebrow !text-brand">{copy.eyebrow}</p>
          <AnimatedText
            as="h2"
            text={copy.title}
            className="mt-4 font-display text-[clamp(1.9rem,5.5vw,3.6rem)] font-extrabold tracking-tight text-white"
          />
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            {copy.intro}
          </p>

          <div className="mt-8 space-y-2 text-white">
            <a href={channels.email} className="block font-semibold hover:text-brand">
              {site.email}
            </a>
            <a href={channels.call} className="block font-semibold hover:text-brand">
              {site.phoneDisplay}
            </a>
            <p className="text-white/50">{site.location}</p>
          </div>

          <ContactChannels variant="onDark" className="mt-8" />
        </motion.div>

        <motion.form
          initial={{ y: 14 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45, delay: 0.06 }}
          onSubmit={onSubmit}
          className="contact-form space-y-5 text-white"
        >
          <div className="mb-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand">
              {copy.formEyebrow}
            </p>
            <p className="mt-2 text-sm text-white/55">{copy.formNote}</p>
          </div>

          {/* Server-only honeypot name that password managers rarely autofill */}
          <input
            type="text"
            name="_honey"
            value={honeypot}
            tabIndex={-1}
            autoComplete="off"
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
            aria-hidden
            onChange={(e) => setHoneypot(e.target.value)}
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
              className="resize-none"
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
                <div className="max-w-sm bg-white p-3">
                  <TurnstileField
                    ref={turnstileRef}
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
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn btn-primary mt-2 disabled:opacity-70"
          >
            {status === 'submitting' ? copy.sendingLabel || 'Sending…' : copy.submitLabel}
          </button>

          {status === 'captcha' && (
            <p ref={feedbackRef} className="text-sm font-medium text-brand" role="alert">
              {errorMessage || 'Please complete the “Verify you are human” check, then press Send again.'}
            </p>
          )}
          {status === 'success' && (
            <p ref={feedbackRef} className="text-sm font-medium text-brand" role="status">
              {copy.successMessage}
            </p>
          )}
          {status === 'error' && (
            <p ref={feedbackRef} className="text-sm font-medium text-red-300" role="alert">
              {errorMessage || copy.errorMessage}{' '}
              <span className="text-white/70">
                Or email us at{' '}
                <a className="underline text-white" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
              </span>
            </p>
          )}
        </motion.form>
      </div>
    </section>
  )
}
