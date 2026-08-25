/**
 * Deliver contact-form messages (Cloudflare Worker copy).
 * Prefer Resend when RESEND_API_KEY is set; otherwise FormSubmit.co (no FormSubmit captcha page).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateContactPayload(body) {
  const name = String(body?.name || '').trim()
  const email = String(body?.email || '').trim()
  const company = String(body?.company || '').trim()
  const budget = String(body?.budget || '').trim()
  const phone = String(body?.phone || '').trim()
  const message = String(body?.message || '').trim()
  const honey = String(body?._honey || body?.honey || '').trim()

  if (honey) return { ok: false, status: 200, error: null, spam: true }
  if (!name || name.length > 200) return { ok: false, status: 400, error: 'Please enter your name.' }
  if (!email || !EMAIL_RE.test(email) || email.length > 200) {
    return { ok: false, status: 400, error: 'Please enter a valid email.' }
  }
  if (!message || message.length < 5) {
    return { ok: false, status: 400, error: 'Please enter a message.' }
  }
  if (message.length > 5000) {
    return { ok: false, status: 400, error: 'Message is too long.' }
  }
  if (company.length > 200) {
    return { ok: false, status: 400, error: 'Company name is too long.' }
  }
  if (budget.length > 120) {
    return { ok: false, status: 400, error: 'Budget value is too long.' }
  }
  if (phone.length > 80) {
    return { ok: false, status: 400, error: 'Phone number is too long.' }
  }
  return { ok: true, data: { name, email, company, budget, phone, message } }
}

function buildEmailText(payload) {
  return [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    payload.company ? `Company: ${payload.company}` : null,
    payload.budget ? `Budget: ${payload.budget}` : null,
    payload.phone ? `Phone: ${payload.phone}` : null,
    '',
    payload.message,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

async function sendWithResend({ apiKey, to, from, payload, siteName }) {
  const subject = `New inquiry from ${payload.name} - ${siteName || 'website'}`
  const text = buildEmailText(payload)

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: from || 'Adwise Media <onboarding@resend.dev>',
      to: [to],
      reply_to: payload.email,
      subject,
      text,
    }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `Resend error ${res.status}`)
  }
  return { provider: 'resend', id: data.id || null }
}

async function sendWithFormSubmit({ to, payload, siteName }) {
  const subject = `New inquiry from ${payload.name} - ${siteName || 'website'}`
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      company: payload.company || '(not provided)',
      budget: payload.budget || '(not provided)',
      phone: payload.phone || '(not provided)',
      message: payload.message,
      _subject: subject,
      _template: 'table',
      _captcha: 'false',
      _honey: '',
    }),
  })

  const text = await res.text()
  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text }
  }

  const msg = String(data.message || data.error || text || '')
  const lower = msg.toLowerCase()

  if (lower.includes('just a moment') || lower.includes('cf-mitigated') || lower.includes('challenge-platform')) {
    const err = new Error('FORMSUBMIT_CF_BLOCKED')
    err.code = 'FORMSUBMIT_CF_BLOCKED'
    throw err
  }

  if (
    lower.includes('activate') ||
    lower.includes('activation') ||
    lower.includes('confirm your email')
  ) {
    return {
      provider: 'formsubmit',
      needsActivation: true,
      message:
        'FormSubmit sent an activation email to your inbox. Open it and click Activate Form, then try again.',
    }
  }

  if (!res.ok) {
    throw new Error(msg || `FormSubmit error ${res.status}`)
  }

  // FormSubmit sometimes returns success:false with 200
  if (data.success === false || data.success === 'false') {
    throw new Error(msg || 'FormSubmit rejected the submission.')
  }

  return { provider: 'formsubmit', needsActivation: false }
}

/**
 * @param {{
 *   to: string,
 *   payload: { name: string, email: string, company?: string, budget?: string, phone?: string, message: string },
 *   siteName?: string,
 *   resendApiKey?: string,
 *   resendFrom?: string,
 * }} opts
 */
export async function deliverContactMessage(opts) {
  const to = String(opts.to || '').trim()
  if (!to || !EMAIL_RE.test(to)) {
    throw new Error('Site contact email is not configured.')
  }

  if (opts.resendApiKey) {
    return sendWithResend({
      apiKey: opts.resendApiKey,
      to,
      from: opts.resendFrom,
      payload: opts.payload,
      siteName: opts.siteName,
    })
  }

  return sendWithFormSubmit({
    to,
    payload: opts.payload,
    siteName: opts.siteName,
  })
}
