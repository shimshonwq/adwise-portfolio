/**
 * Cloudflare Worker — /api/* for CMS admin.
 * Recommended: GITHUB_TOKEN + GITHUB_REPO secrets → commits to GitHub, Cloudflare rebuilds.
 * Optional fallback: KV binding LOGOS (legacy).
 */
import DEFAULT_CONTENT from './cms-default.json'
import {
  ADMIN_COOKIE,
  SESSION_MAX_AGE_SEC,
  makeSessionToken,
  rotatePassword,
  verifyPassword,
  verifySessionToken,
  validatePasswordStrength,
  AUTH_REPO_PATH,
} from './admin-auth.js'
import {
  deleteFile,
  logoRepoPath,
  publishSiteContent,
  readJsonFile,
  readTextOrBytes,
  writeBinaryFile,
  writeJsonFile,
} from './github-store.js'
import { validateLogoUpload, extForLogoMime, LOGO_MAX_BYTES } from './logo-rules.js'
import { sanitizeDeep } from './text-sanitize.js'
import {
  deliverContactMessage,
  validateContactPayload,
  verifyTurnstileToken,
  friendlyContactError,
} from './contact-mail.js'
import { securityHeaders } from './security-headers.js'

const CONTENT_KV_KEY = 'content:v1'
const LEGACY_LOGOS_KEY = 'logos:v1'
const MAX_BYTES = LOGO_MAX_BYTES
const LOGIN_MAX_ATTEMPTS = 5
const LOGIN_WINDOW_MS = 15 * 60 * 1000
const CONTACT_MAX_ATTEMPTS = 8
const CONTACT_WINDOW_MS = 15 * 60 * 1000
const CONTENT_CACHE_MS = 10_000
const PUBLISH_MSG =
  'Saved. Live site updates for everyone within a few seconds — no rebuild needed for text, colors, or logos.'
const CORS_ORIGINS = new Set([
  'https://adwisemedia.co',
  'https://www.adwisemedia.co',
  'https://adwise-portfolio.adwisecreativity.workers.dev',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
])

/** @type {{ record: object | null, at: number }} */
let authCache = { record: null, at: 0 }
/** @type {{ data: object | null, sha: string | null, at: number }} */
let contentCache = { data: null, sha: null, at: 0 }
/** @type {Map<string, { bytes: Uint8Array, mime: string, at: number }>} */
const uploadCache = new Map()
const loginAttempts = new Map()
const contactAttempts = new Map()

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || ''
  if (!origin || !CORS_ORIGINS.has(origin)) return {}
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  }
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Adwise-Build': '2026-08-26-fast-logos',
      ...securityHeaders(),
      ...headers,
    },
  })
}

function withSecurity(res) {
  const headers = new Headers(res.headers)
  for (const [key, value] of Object.entries(securityHeaders())) {
    if (!headers.has(key)) headers.set(key, value)
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  })
}

function adminOriginAllowed(request) {
  const origin = request.headers.get('Origin')
  if (origin) return CORS_ORIGINS.has(origin)
  const referer = request.headers.get('Referer')
  if (!referer) return true
  try {
    return CORS_ORIGINS.has(new URL(referer).origin)
  } catch {
    return false
  }
}

function hasGithub(env) {
  return Boolean(
    env.ADWISE_GITHUB_TOKEN ||
      env.adwise_github_token ||
      env.GITHUB_TOKEN ||
      env.github_token,
  )
}

async function getAuthRecord(env) {
  if (authCache.record && Date.now() - authCache.at < 60_000) {
    return authCache.record
  }

  // Production auth always comes from GitHub so password changes take effect
  // immediately and old/bootstrap passwords cannot bypass a rotation.
  if (!hasGithub(env)) {
    throw new Error(
      'Admin auth requires ADWISE_GITHUB_TOKEN (or GITHUB_TOKEN) and GITHUB_REPO Worker secrets.',
    )
  }

  const row = await readJsonFile(env, AUTH_REPO_PATH)
  if (!row?.data?.hash || !row.data.sessionKey) {
    throw new Error(
      'Missing data/admin-auth.json in GitHub. Run npm run bootstrap:admin locally and push.',
    )
  }

  authCache = { record: row.data, at: Date.now() }
  return row.data
}

function invalidateAuthCache() {
  authCache = { record: null, at: 0 }
}

function invalidateContentCache() {
  contentCache = { data: null, sha: null, at: 0 }
}

function clientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

function loginRateLimited(ip) {
  const now = Date.now()
  let entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOGIN_WINDOW_MS }
    loginAttempts.set(ip, entry)
  }
  return entry.count >= LOGIN_MAX_ATTEMPTS
}

function recordLoginFailure(ip) {
  const now = Date.now()
  let entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + LOGIN_WINDOW_MS }
  }
  entry.count += 1
  loginAttempts.set(ip, entry)
}

function clearLoginFailures(ip) {
  loginAttempts.delete(ip)
}

function contactRateLimited(ip) {
  const now = Date.now()
  let entry = contactAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + CONTACT_WINDOW_MS }
    contactAttempts.set(ip, entry)
  }
  return entry.count >= CONTACT_MAX_ATTEMPTS
}

function recordContactAttempt(ip) {
  const now = Date.now()
  let entry = contactAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + CONTACT_WINDOW_MS }
  }
  entry.count += 1
  contactAttempts.set(ip, entry)
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i === -1) continue
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim())
  }
  return out
}

function setCookie(token, secure) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}${
    secure ? '; Secure' : ''
  }`
}

function clearCookie(secure) {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? '; Secure' : ''}`
}

function slugify(name) {
  return (
    String(name || 'logo')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'logo'
  )
}

function extFor(mime) {
  return extForLogoMime(mime) || 'png'
}

function visibleLogos(content) {
  return [...(content.logos || [])]
    .filter((l) => l.visible !== false)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

function reindexOrders(logos) {
  return logos.map((l, i) => ({ ...l, order: i }))
}

function seedContent() {
  return JSON.parse(JSON.stringify(DEFAULT_CONTENT))
}

async function readContentKv(env) {
  if (!env.LOGOS) return null
  const raw = await env.LOGOS.get(CONTENT_KV_KEY, 'json')
  if (raw?.site && Array.isArray(raw.logos)) return raw
  const legacy = await env.LOGOS.get(LEGACY_LOGOS_KEY, 'json')
  if (!Array.isArray(legacy) || !legacy.length) return null
  const content = seedContent()
  content.logos = legacy.map((l, i) => ({
    id: l.id || `logo-${i}`,
    name: l.name || 'Logo',
    src: l.src,
    order: typeof l.order === 'number' ? l.order : i,
    visible: l.visible !== false,
  }))
  return content
}

async function readContent(env) {
  if (contentCache.data && Date.now() - contentCache.at < CONTENT_CACHE_MS) {
    return contentCache.data
  }
  let result = null
  let sha = null
  if (hasGithub(env)) {
    try {
      const fromGh = await readJsonFile(env, 'public/data/content.json')
      if (fromGh?.data?.site) {
        result = fromGh.data
        sha = fromGh.sha || null
      }
    } catch (err) {
      console.error('GitHub read failed:', err)
    }
  }
  if (!result) {
    const fromKv = await readContentKv(env)
    if (fromKv) result = fromKv
  }
  if (!result) result = seedContent()
  contentCache = { data: result, sha, at: Date.now() }
  return result
}

async function writeContentKv(env, content) {
  if (!env.LOGOS) throw new Error('KV not configured')
  content.version = 1
  content.updatedAt = new Date().toISOString()
  await env.LOGOS.put(CONTENT_KV_KEY, JSON.stringify(content))
}

async function persistContent(env, content, message = 'CMS: update site content') {
  content = sanitizeDeep(content)
  if (hasGithub(env)) {
    const published = await publishSiteContent(env, content, message, contentCache.sha)
    contentCache = { data: published.content, sha: published.sha, at: Date.now() }
    return { content: published.content, publishMessage: PUBLISH_MSG, published: true }
  }
  await writeContentKv(env, content)
  invalidateContentCache()
  contentCache = { data: content, sha: null, at: Date.now() }
  return { content, publishMessage: 'Saved.', published: true }
}

function okPayload(result) {
  return {
    ok: true,
    content: result.content,
    logos: result.content.logos,
    publishMessage: result.publishMessage,
    published: result.published,
  }
}

function dataUrlToBytes(dataUrl) {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
  if (!match) return null
  const binary = atob(match[2])
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return { mime: match[1], bytes }
}

async function requireAuth(request, env) {
  const record = await getAuthRecord(env)
  const cookies = parseCookies(request.headers.get('Cookie') || '')
  let token = cookies[ADMIN_COOKIE]
  if (!token) {
    const auth = request.headers.get('Authorization') || ''
    if (auth.startsWith('Bearer ')) token = auth.slice(7).trim()
  }
  return verifySessionToken(record.sessionKey, token)
}

function mimeForUploadPath(pathname) {
  const lower = pathname.toLowerCase()
  if (lower.endsWith('.png')) return 'image/png'
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg'
  if (lower.endsWith('.webp')) return 'image/webp'
  if (lower.endsWith('.gif')) return 'image/gif'
  if (lower.endsWith('.svg')) return 'image/svg+xml'
  if (lower.endsWith('.ico')) return 'image/x-icon'
  return 'application/octet-stream'
}

/**
 * Serve CMS uploads: prefer static assets, else live from GitHub (so new logos
 * appear for everyone immediately without a redeploy).
 */
async function serveUpload(request, env, pathname) {
  if (env.ASSETS) {
    const assetRes = await env.ASSETS.fetch(request)
    if (assetRes.status !== 404) return assetRes
  }

  const cached = uploadCache.get(pathname)
  if (cached && Date.now() - cached.at < 5 * 60_000) {
    return new Response(cached.bytes, {
      headers: {
        'Content-Type': cached.mime,
        'Cache-Control': 'public, max-age=300',
      },
    })
  }

  if (!hasGithub(env)) return new Response('Not found', { status: 404 })

  const repoPath = `public${pathname}`
  try {
    const file = await readTextOrBytes(env, repoPath)
    if (!file?.bytes?.length) return new Response('Not found', { status: 404 })
    const mime = mimeForUploadPath(pathname)
    uploadCache.set(pathname, { bytes: file.bytes, mime, at: Date.now() })
    return new Response(file.bytes, {
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (err) {
    console.error('Upload proxy failed:', err)
    return new Response('Not found', { status: 404 })
  }
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'
  const secure = url.protocol === 'https:'
  const cors = corsHeaders(request)

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors })
  }

  if (request.method === 'GET' && pathname === '/api/health') {
    return json({ ok: true, service: 'adwise-portfolio' }, 200, cors)
  }

  if (request.method === 'GET' && pathname === '/api/content') {
    const content = await readContent(env)
    return json({ content: { ...content, logos: visibleLogos(content) } }, 200, cors)
  }

  if (request.method === 'GET' && pathname === '/api/logos') {
    return json({ logos: visibleLogos(await readContent(env)) }, 200, cors)
  }

  if (request.method === 'GET' && pathname === '/api/captcha-config') {
    const siteKey = String(env.TURNSTILE_SITE_KEY || env.turnstile_site_key || '').trim()
    return json(
      {
        provider: siteKey ? 'turnstile' : null,
        siteKey: siteKey || null,
      },
      200,
      cors,
    )
  }

  if (request.method === 'POST' && pathname === '/api/contact') {
    const ip = clientIp(request)
    if (contactRateLimited(ip)) {
      return json(
        { error: 'Too many messages from this connection. Please wait a bit and try again.' },
        429,
        cors,
      )
    }
    recordContactAttempt(ip)
    const body = await request.json().catch(() => ({}))
    const checked = validateContactPayload(body)
    if (checked.spam) return json({ ok: true }, 200, cors)
    if (!checked.ok) return json({ error: checked.error }, checked.status, cors)

    const turnstileSecret = String(env.TURNSTILE_SECRET_KEY || env.turnstile_secret_key || '').trim()
    const turnstileSiteKey = String(env.TURNSTILE_SITE_KEY || env.turnstile_site_key || '').trim()
    if (turnstileSiteKey && !turnstileSecret) {
      return json(
        { error: 'Human verification is not configured on the server.' },
        503,
        cors,
      )
    }
    if (turnstileSecret) {
      const captcha = await verifyTurnstileToken({
        token: checked.data.turnstileToken,
        secret: turnstileSecret,
        ip,
      })
      if (!captcha.ok) return json({ error: captcha.error }, 400, cors)
    }

    const content = await readContent(env)
    const to = String(content?.site?.email || '').trim()
    try {
      const result = await deliverContactMessage({
        to,
        payload: checked.data,
        siteName: content?.site?.name || 'Adwise Media',
        resendApiKey: env.RESEND_API_KEY || env.resend_api_key || '',
        resendFrom: env.RESEND_FROM || env.resend_from || '',
        githubToken:
          env.ADWISE_GITHUB_TOKEN ||
          env.adwise_github_token ||
          env.GITHUB_TOKEN ||
          env.github_token ||
          '',
        githubRepo: env.GITHUB_REPO || env.github_repo || 'shimshonwq/adwise-portfolio',
        githubBranch: env.GITHUB_BRANCH || env.github_branch || 'main',
      })
      if (result.needsActivation) {
        return json(
          {
            ok: false,
            needsActivation: true,
            error: result.message,
          },
          200,
          cors,
        )
      }
      return json({ ok: true, provider: result.provider }, 200, cors)
    } catch (err) {
      const message = friendlyContactError(err?.message || 'Could not send message right now.')
      return json({ error: message }, 502, cors)
    }
  }

  if (pathname.startsWith('/api/admin')) {
    try {
      await getAuthRecord(env)
    } catch (err) {
      return json({ error: err.message }, 503)
    }
  }

  const mutating =
    request.method === 'POST' ||
    request.method === 'PUT' ||
    request.method === 'PATCH' ||
    request.method === 'DELETE'
  if (mutating && pathname.startsWith('/api/admin') && !adminOriginAllowed(request)) {
    return json({ error: 'Request origin not allowed.' }, 403)
  }

  if (request.method === 'POST' && pathname === '/api/admin/login') {
    const ip = clientIp(request)
    if (loginRateLimited(ip)) {
      return json(
        { error: 'Too many login attempts. Wait about 15 minutes and try again.' },
        429,
      )
    }

    const body = await request.json().catch(() => ({}))
    const record = await getAuthRecord(env)
    if (!(await verifyPassword(String(body.password || ''), record))) {
      recordLoginFailure(ip)
      return json({ error: 'Wrong password' }, 401)
    }
    clearLoginFailures(ip)
    const token = await makeSessionToken(record.sessionKey)
    return json({ ok: true, token }, 200, { 'Set-Cookie': setCookie(token, secure) })
  }

  if (request.method === 'POST' && pathname === '/api/admin/logout') {
    return json({ ok: true }, 200, { 'Set-Cookie': clearCookie(secure) })
  }

  const authed = await requireAuth(request, env)

  if (request.method === 'GET' && pathname === '/api/admin/session') {
    return json({ ok: authed })
  }

  if (request.method === 'GET' && pathname === '/api/admin/session-token') {
    if (!authed) return json({ error: 'Please log in' }, 401)
    const cookies = parseCookies(request.headers.get('Cookie') || '')
    const token = cookies[ADMIN_COOKIE]
    if (!token) return json({ error: 'No session' }, 401)
    return json({ token })
  }

  if (!authed && pathname.startsWith('/api/admin')) {
    return json({ error: 'Please log in' }, 401)
  }

  if (request.method === 'GET' && pathname === '/api/admin/status') {
    return json({
      storage: hasGithub(env) ? 'github' : env.LOGOS ? 'kv' : 'none',
      repo: env.GITHUB_REPO || env.github_repo || 'shimshonwq/adwise-portfolio',
      branch: env.GITHUB_BRANCH || env.github_branch || 'main',
    })
  }

  if (
    !hasGithub(env) &&
    !env.LOGOS &&
    pathname.startsWith('/api/admin') &&
    pathname !== '/api/admin/status'
  ) {
    return json(
      {
        error:
          'Storage not configured. Set GITHUB_TOKEN + GITHUB_REPO secrets (recommended), or KV binding LOGOS.',
      },
      503,
    )
  }

  if (request.method === 'POST' && pathname === '/api/admin/password') {
    const body = await request.json().catch(() => ({}))
    const current = String(body.currentPassword || '')
    const next = String(body.newPassword || '')
    const confirm = String(body.confirmPassword || '')

    const record = await getAuthRecord(env)
    if (!(await verifyPassword(current, record))) {
      return json({ error: 'Current password is incorrect' }, 401)
    }
    if (next !== confirm) {
      return json({ error: 'New passwords do not match' }, 400)
    }
    const strengthErr = validatePasswordStrength(next)
    if (strengthErr) return json({ error: strengthErr }, 400)
    if (await verifyPassword(next, record)) {
      return json({ error: 'Choose a different password than your current one' }, 400)
    }

    const updated = await rotatePassword(record, next)
    await writeJsonFile(env, AUTH_REPO_PATH, updated, 'CMS: change admin password')
    invalidateAuthCache()
    const token = await makeSessionToken(updated.sessionKey)
    return json(
      {
        ok: true,
        message: 'Password updated. All other sessions were signed out.',
        authUpdatedAt: updated.updatedAt,
      },
      200,
      { 'Set-Cookie': setCookie(token, secure) },
    )
  }

  if (request.method === 'GET' && pathname === '/api/admin/content') {
    return json({ content: await readContent(env) })
  }

  if (request.method === 'PUT' && pathname === '/api/admin/content') {
    const body = await request.json().catch(() => ({}))
    const raw = JSON.stringify(body?.content ?? body)
    if (raw.length > 512_000) {
      return json({ error: 'Content payload is too large.' }, 413)
    }
    const next = body.content || body
    if (!next?.site || !Array.isArray(next.logos)) {
      return json({ error: 'Invalid content payload' }, 400)
    }
    const result = await persistContent(env, next, 'CMS: update site content')
    return json(okPayload(result))
  }

  if (request.method === 'GET' && pathname === '/api/admin/logos') {
    const content = await readContent(env)
    return json({
      logos: [...content.logos].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    })
  }

  if (request.method === 'POST' && pathname === '/api/admin/logos') {
    const body = await request.json().catch(() => ({}))
    const name = String(body.name || '').trim()
    const dataUrl = String(body.dataUrl || '')
    if (!name) return json({ error: 'Name is required' }, 400)
    const parsed = dataUrlToBytes(dataUrl)
    if (!parsed) return json({ error: 'Upload a PNG, JPG, or WebP' }, 400)
    const width = body.width != null ? Number(body.width) : null
    const height = body.height != null ? Number(body.height) : null
    const bad = validateLogoUpload({
      mime: parsed.mime,
      size: parsed.bytes.length,
      width: Number.isFinite(width) ? width : null,
      height: Number.isFinite(height) ? height : null,
    })
    if (bad) return json({ error: bad }, 400)
    const ext = extForLogoMime(parsed.mime)
    if (!ext) return json({ error: 'Upload a PNG, JPG, or WebP' }, 400)
    const id = `${slugify(name)}-${Date.now().toString(36)}`
    const file = `${id}.${ext}`
    const src = `/uploads/logos/${file}`
    if (hasGithub(env)) {
      await writeBinaryFile(env, `public${src}`, parsed.bytes, `CMS: add logo ${name}`)
      uploadCache.set(src, { bytes: parsed.bytes, mime: parsed.mime, at: Date.now() })
    }
    const content = structuredClone(await readContent(env))
    const maxOrder = content.logos.reduce((m, l) => Math.max(m, l.order ?? 0), -1)
    content.logos.push({
      id,
      name,
      src: hasGithub(env) ? src : dataUrl,
      order: maxOrder + 1,
      visible: true,
    })
    const result = await persistContent(env, content, `CMS: add logo ${name}`)
    return json(okPayload(result))
  }

  if (request.method === 'PATCH' && pathname.startsWith('/api/admin/logos/')) {
    const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
    const body = await request.json().catch(() => ({}))
    const content = await readContent(env)
    const idx = content.logos.findIndex((l) => l.id === id)
    if (idx === -1) return json({ error: 'Logo not found' }, 404)
    if (body.name !== undefined) {
      content.logos[idx].name = String(body.name).trim() || content.logos[idx].name
    }
    if (body.visible !== undefined) content.logos[idx].visible = Boolean(body.visible)
    if (body.dataUrl) {
      const parsed = dataUrlToBytes(String(body.dataUrl))
      if (!parsed) return json({ error: 'Upload a PNG, JPG, or WebP' }, 400)
      const width = body.width != null ? Number(body.width) : null
      const height = body.height != null ? Number(body.height) : null
      const bad = validateLogoUpload({
        mime: parsed.mime,
        size: parsed.bytes.length,
        width: Number.isFinite(width) ? width : null,
        height: Number.isFinite(height) ? height : null,
      })
      if (bad) return json({ error: bad }, 400)
      const ext = extForLogoMime(parsed.mime)
      if (!ext) return json({ error: 'Upload a PNG, JPG, or WebP' }, 400)
      const file = `${id}.${ext}`
      const src = `/uploads/logos/${file}`
      if (hasGithub(env)) {
        await writeBinaryFile(env, `public${src}`, parsed.bytes, `CMS: replace logo ${id}`)
        content.logos[idx].src = src
      } else {
        content.logos[idx].src = String(body.dataUrl)
      }
    }
    const result = await persistContent(env, content, `CMS: update logo ${id}`)
    return json(okPayload(result))
  }

  if (request.method === 'PUT' && pathname === '/api/admin/logos/reorder') {
    const body = await request.json().catch(() => ({}))
    const ids = body.ids
    if (!Array.isArray(ids)) return json({ error: 'ids array required' }, 400)
    const content = await readContent(env)
    const map = new Map(content.logos.map((l) => [l.id, l]))
    const next = []
    for (const id of ids) {
      if (map.has(id)) {
        next.push(map.get(id))
        map.delete(id)
      }
    }
    for (const left of map.values()) next.push(left)
    content.logos = reindexOrders(next)
    const result = await persistContent(env, content, 'CMS: reorder logos')
    return json(okPayload(result))
  }

  if (request.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
    const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
    const content = await readContent(env)
    const removed = content.logos.find((l) => l.id === id)
    content.logos = reindexOrders(content.logos.filter((l) => l.id !== id))
    if (hasGithub(env) && removed) {
      const repoPath = logoRepoPath(removed.src)
      if (repoPath) {
        try {
          await deleteFile(env, repoPath, `CMS: remove logo file ${id}`)
        } catch {
          /* ignore */
        }
      }
      if (removed.src) uploadCache.delete(removed.src)
    }
    const result = await persistContent(env, content, `CMS: remove logo ${id}`)
    return json(okPayload(result))
  }

  return json({ error: 'Not found' }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const pathname = url.pathname.replace(/\/+$/, '') || '/'

    try {
      if (url.pathname.startsWith('/api/')) {
        return await handleApi(request, env)
      }

      if (pathname === '/data/content.json') {
        const content = await readContent(env)
        return withSecurity(
          new Response(JSON.stringify(content), {
            status: 200,
            headers: {
              'Content-Type': 'application/json; charset=utf-8',
              'Cache-Control': 'no-store',
            },
          }),
        )
      }

      if (url.pathname.startsWith('/uploads/')) {
        return withSecurity(await serveUpload(request, env, pathname))
      }

      if (env.ASSETS) return withSecurity(await env.ASSETS.fetch(request))
      return withSecurity(new Response('Not found', { status: 404 }))
    } catch (err) {
      if (url.pathname.startsWith('/api/')) {
        return json({ error: err?.message || 'Server error' }, 500)
      }
      return withSecurity(new Response('Server error', { status: 500 }))
    }
  },
}
