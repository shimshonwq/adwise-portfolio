/**
 * Cloudflare Worker — /api/* for CMS content + logos.
 * Stores full site content in KV (binding: LOGOS — reused as CMS store).
 * Set ADMIN_PASSWORD secret. Create KV and bind as LOGOS (see wrangler.jsonc).
 */
import DEFAULT_CONTENT from './cms-default.json'

const ADMIN_COOKIE = 'adwise_admin'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
const CONTENT_KV_KEY = 'content:v1'
const LEGACY_LOGOS_KEY = 'logos:v1'
const MAX_BYTES = 2.5 * 1024 * 1024

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...headers,
    },
  })
}

function b64url(bytes) {
  let str = ''
  const bin = bytes instanceof ArrayBuffer ? new Uint8Array(bytes) : bytes
  for (let i = 0; i < bin.length; i++) str += String.fromCharCode(bin[i])
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

async function hmac(secret, payload) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
  return b64url(sig)
}

async function makeSession(secret) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const payload = `v1.${exp}`
  return `${payload}.${await hmac(secret, payload)}`
}

async function verifySession(secret, token) {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const payload = `${parts[0]}.${parts[1]}`
  if (parts[2] !== (await hmac(secret, payload))) return false
  const exp = Number(parts[1])
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000)
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

async function readContent(env) {
  if (!env.LOGOS) return seedContent()
  const raw = await env.LOGOS.get(CONTENT_KV_KEY, 'json')
  if (raw?.site && Array.isArray(raw.logos)) return raw
  // Migrate legacy logos-only store
  const legacy = await env.LOGOS.get(LEGACY_LOGOS_KEY, 'json')
  const content = seedContent()
  if (Array.isArray(legacy) && legacy.length) {
    content.logos = legacy.map((l, i) => ({
      id: l.id || `logo-${i}`,
      name: l.name || 'Logo',
      src: l.src,
      order: typeof l.order === 'number' ? l.order : i,
      visible: l.visible !== false,
    }))
  }
  return content
}

async function writeContent(env, content) {
  if (!env.LOGOS) throw new Error('Logo/CMS storage is not configured (KV binding LOGOS)')
  content.version = 1
  content.updatedAt = new Date().toISOString()
  await env.LOGOS.put(CONTENT_KV_KEY, JSON.stringify(content))
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'
  const password = env.ADMIN_PASSWORD
  const secure = url.protocol === 'https:'

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204 })
  }

  if (request.method === 'GET' && pathname === '/api/content') {
    return json({ content: await readContent(env) })
  }

  if (request.method === 'GET' && pathname === '/api/logos') {
    return json({ logos: visibleLogos(await readContent(env)) })
  }

  if (!password && pathname.startsWith('/api/admin')) {
    return json({ error: 'Set ADMIN_PASSWORD secret in Cloudflare to enable admin.' }, 503)
  }

  if (request.method === 'POST' && pathname === '/api/admin/login') {
    const body = await request.json().catch(() => ({}))
    if (!password || body.password !== password) return json({ error: 'Wrong password' }, 401)
    const token = await makeSession(password)
    return json({ ok: true }, 200, { 'Set-Cookie': setCookie(token, secure) })
  }

  if (request.method === 'POST' && pathname === '/api/admin/logout') {
    return json({ ok: true }, 200, { 'Set-Cookie': clearCookie(secure) })
  }

  const cookies = parseCookies(request.headers.get('Cookie') || '')
  const authed = password ? await verifySession(password, cookies[ADMIN_COOKIE]) : false

  if (request.method === 'GET' && pathname === '/api/admin/session') {
    return json({ ok: authed })
  }

  if (!authed && pathname.startsWith('/api/admin')) {
    return json({ error: 'Please log in' }, 401)
  }

  if (request.method === 'GET' && pathname === '/api/admin/content') {
    return json({ content: await readContent(env) })
  }

  if (request.method === 'PUT' && pathname === '/api/admin/content') {
    const body = await request.json().catch(() => ({}))
    const next = body.content || body
    if (!next?.site || !Array.isArray(next.logos)) {
      return json({ error: 'Invalid content payload' }, 400)
    }
    await writeContent(env, next)
    return json({ ok: true, content: await readContent(env) })
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
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) return json({ error: 'Upload a PNG, JPG, WebP, or SVG' }, 400)
    if (match[2].length * 0.75 > MAX_BYTES) {
      return json({ error: 'File too large (max 2.5MB)' }, 400)
    }
    const content = await readContent(env)
    const maxOrder = content.logos.reduce((m, l) => Math.max(m, l.order ?? 0), -1)
    const id = `${slugify(name)}-${Date.now().toString(36)}`
    content.logos.push({
      id,
      name,
      src: dataUrl,
      order: maxOrder + 1,
      visible: true,
    })
    await writeContent(env, content)
    return json({ ok: true, logos: content.logos, content })
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
    await writeContent(env, content)
    return json({ ok: true, logos: content.logos, content })
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
    await writeContent(env, content)
    return json({ ok: true, logos: content.logos, content })
  }

  if (request.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
    const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
    const content = await readContent(env)
    content.logos = reindexOrders(content.logos.filter((l) => l.id !== id))
    await writeContent(env, content)
    return json({ ok: true, logos: content.logos, content })
  }

  return json({ error: 'Not found' }, 404)
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    if (url.pathname.startsWith('/api/')) {
      try {
        return await handleApi(request, env)
      } catch (err) {
        return json({ error: err?.message || 'Server error' }, 500)
      }
    }
    if (env.ASSETS) return env.ASSETS.fetch(request)
    return new Response('Not found', { status: 404 })
  },
}
