/**
 * Deliver contact-form messages.
 * Prefer Resend → FormSubmit → GitHub issue notification (never redirects the visitor).
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
  const turnstileToken = String(body?.turnstileToken || body?.['cf-turnstile-response'] || '').trim()

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
  return {
    ok: true,
    data: { name, email, company, budget, phone, message, turnstileToken },
  }
}

export async function verifyTurnstileToken({ token, secret, ip }) {
  const secretKey = String(secret || '').trim()
  if (!secretKey) {
    return { ok: false, error: 'Human verification is not configured on the server.' }
  }
  if (!token) {
    return { ok: false, error: 'Please complete the “Verify you are human” check.' }
  }

  const body = new URLSearchParams()
  body.set('secret', secretKey)
  body.set('response', token)
  if (ip) body.set('remoteip', ip)

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  const data = await res.json().catch(() => ({}))
  if (!data.success) {
    return { ok: false, error: 'Human verification failed. Please try the check again.' }
  }
  return { ok: true }
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
  const lowerText = String(text || '').toLowerCase()
  if (
    lowerText.includes('just a moment') ||
    lowerText.includes('cf-mitigated') ||
    lowerText.includes('challenge-platform') ||
    lowerText.includes('cf-browser-verification')
  ) {
    const err = new Error('FORMSUBMIT_CF_BLOCKED')
    err.code = 'FORMSUBMIT_CF_BLOCKED'
    throw err
  }

  let data = {}
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    data = { message: text }
  }

  const msg = String(data.message || data.error || text || '')
  const lower = msg.toLowerCase()

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

  if (lower.includes('rate limit')) {
    const err = new Error('FORMSUBMIT_CF_BLOCKED')
    err.code = 'FORMSUBMIT_CF_BLOCKED'
    throw err
  }

  if (!res.ok) {
    throw new Error(msg || `FormSubmit error ${res.status}`)
  }

  if (data.success === false || data.success === 'false') {
    throw new Error(msg || 'FormSubmit rejected the submission.')
  }

  return { provider: 'formsubmit', needsActivation: false }
}

async function notifyViaGithub({ token, repo, branch, payload, siteName, to }) {
  const repoSlug = String(repo || '').trim()
  const auth = String(token || '').trim()
  if (!repoSlug || !auth) {
    throw new Error('GitHub notification is not configured.')
  }

  const title = `Contact inquiry: ${payload.name}`.slice(0, 120)
  const body = [
    `New website inquiry via the contact form.`,
    '',
    `**To:** ${to}`,
    `**Site:** ${siteName || 'Adwise Media'}`,
    `**Name:** ${payload.name}`,
    `**Email:** ${payload.email}`,
    payload.phone ? `**Phone:** ${payload.phone}` : null,
    payload.company ? `**Company:** ${payload.company}` : null,
    payload.budget ? `**Budget:** ${payload.budget}` : null,
    '',
    '**Message**',
    '',
    payload.message,
    '',
    `—`,
    `_Auto-created from /api/contact (${branch || 'main'})_`,
  ]
    .filter((line) => line !== null)
    .join('\n')

  const res = await fetch(`https://api.github.com/repos/${repoSlug}/issues`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${auth}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'adwise-portfolio-contact',
    },
    body: JSON.stringify({ title, body }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data?.message || `GitHub issue error ${res.status}`)
  }
  return { provider: 'github', id: data.number || null, url: data.html_url || null }
}

/**
 * @param {{
 *   to: string,
 *   payload: object,
 *   siteName?: string,
 *   resendApiKey?: string,
 *   resendFrom?: string,
 *   githubToken?: string,
 *   githubRepo?: string,
 *   githubBranch?: string,
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

  try {
    return await sendWithFormSubmit({
      to,
      payload: opts.payload,
      siteName: opts.siteName,
    })
  } catch (err) {
    const code = err?.code || err?.message || ''
    const formSubmitBlocked =
      String(code).includes('FORMSUBMIT_CF_BLOCKED') || String(code).includes('Just a moment')

    if (!formSubmitBlocked || !opts.githubToken || !opts.githubRepo) {
      throw err
    }

    // Reliable fallback: open a GitHub issue so the owner still gets notified.
    return notifyViaGithub({
      token: opts.githubToken,
      repo: opts.githubRepo,
      branch: opts.githubBranch,
      payload: opts.payload,
      siteName: opts.siteName,
      to,
    })
  }
}
