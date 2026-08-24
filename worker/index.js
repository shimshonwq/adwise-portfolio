/**
 * Cloudflare Worker — handles /api/* for the static marketing site.
 * Logo list lives in KV (binding: LOGOS). Uploaded marks are stored as data URLs
 * so we don't need R2 for small client logos.
 */
const ADMIN_COOKIE = 'adwise_admin'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
const LOGOS_KV_KEY = 'logos:v1'
const MAX_BYTES = 2.5 * 1024 * 1024

const DEFAULT_LOGOS = [
  { id: 'kalmys', name: 'Kalmys', src: '/clients/kalmys.png' },
  { id: 'shloimy', name: 'Shloimy Friedlander', src: '/clients/shloimy.png' },
  { id: 'coffee-break', name: 'Coffee Break', src: '/clients/coffee-break.png' },
  { id: 'flavor-max', name: 'Flavor Max', src: '/clients/flavor-max.png' },
  { id: 'ride-24', name: 'Ride 24', src: '/clients/ride-24.png' },
  { id: 'planit', name: 'Planit Architecture', src: '/clients/planit.png' },
  { id: 'icontact', name: 'iContact Studio', src: '/clients/icontact.png' },
  { id: 'garden-gourmet', name: 'Garden Gourmet', src: '/clients/garden-gourmet.png' },
  { id: 'hvn', name: 'HVN', src: '/clients/hvn.png' },
  { id: 'vish-vash', name: 'Vish Vash', src: '/clients/vish-vash.png' },
  { id: 'shvitz', name: 'The Shvitz', src: '/clients/shvitz.png' },
  { id: 'greenpower', name: 'Green Power Electric', src: '/clients/greenpower.png' },
  { id: 'mendel-style', name: 'Mendel Style Events', src: '/clients/mendel-style.png' },
]

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
  const expected = await hmac(secret, payload)
  if (parts[2] !== expected) return false
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

async function readLogos(env) {
  if (!env.LOGOS) return DEFAULT_LOGOS
  const raw = await env.LOGOS.get(LOGOS_KV_KEY, 'json')
  return Array.isArray(raw) && raw.length >= 0 ? raw : DEFAULT_LOGOS
}

async function writeLogos(env, logos) {
  if (!env.LOGOS) throw new Error('Logo storage is not configured (KV binding LOGOS)')
  await env.LOGOS.put(LOGOS_KV_KEY, JSON.stringify(logos))
}

async function handleApi(request, env) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'
  const password = env.ADMIN_PASSWORD
  const secure = url.protocol === 'https:'

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Credentials': 'true',
      },
    })
  }

  if (request.method === 'GET' && pathname === '/api/logos') {
    return json({ logos: await readLogos(env) })
  }

  if (!password) {
    if (pathname.startsWith('/api/admin')) {
      return json({ error: 'Set ADMIN_PASSWORD secret in Cloudflare to enable admin.' }, 503)
    }
  }

  if (request.method === 'POST' && pathname === '/api/admin/login') {
    const body = await request.json().catch(() => ({}))
    if (!password || body.password !== password) {
      return json({ error: 'Wrong password' }, 401)
    }
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

  if (request.method === 'GET' && pathname === '/api/admin/logos') {
    return json({ logos: await readLogos(env) })
  }

  if (request.method === 'POST' && pathname === '/api/admin/logos') {
    const body = await request.json().catch(() => ({}))
    const name = String(body.name || '').trim()
    const dataUrl = String(body.dataUrl || '')
    if (!name) return json({ error: 'Name is required' }, 400)
    const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
    if (!match) return json({ error: 'Upload a PNG, JPG, WebP, or SVG' }, 400)
    // rough size check from base64 length
    if (match[2].length * 0.75 > MAX_BYTES) {
      return json({ error: 'File too large (max 2.5MB)' }, 400)
    }
    const id = `${slugify(name)}-${Date.now().toString(36)}`
    const logos = await readLogos(env)
    logos.push({ id, name, src: dataUrl })
    await writeLogos(env, logos)
    return json({ ok: true, logos })
  }

  if (request.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
    const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
    const logos = (await readLogos(env)).filter((l) => l.id !== id)
    await writeLogos(env, logos)
    return json({ ok: true, logos })
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
    // Fallback — normally assets are served without hitting the worker
    if (env.ASSETS) return env.ASSETS.fetch(request)
    return new Response('Not found', { status: 404 })
  },
}
