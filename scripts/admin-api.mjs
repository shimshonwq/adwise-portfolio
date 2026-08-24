/**
 * Local admin API for logo management (used by `npm run dev`).
 * Mirrors the Cloudflare Worker routes under /api/*.
 * Persist to .data/ so uploads survive restarts without touching git assets.
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const i = trimmed.indexOf('=')
    if (i === -1) continue
    const key = trimmed.slice(0, i).trim()
    let val = trimmed.slice(i + 1).trim()
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadEnvFile(path.join(ROOT, '.env.local'))
loadEnvFile(path.join(ROOT, '.env'))

const DATA_DIR = path.join(ROOT, '.data')
const STORE_PATH = path.join(DATA_DIR, 'logos.json')
const UPLOAD_DIR = path.join(ROOT, 'public', 'uploads', 'logos')

const PORT = Number(process.env.ADMIN_API_PORT || 8787)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'adwise-admin'
const ADMIN_COOKIE = 'adwise_admin'
const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
const MAX_BYTES = 2.5 * 1024 * 1024

const DEFAULT_LOGOS = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'public', 'data', 'logos.json'), 'utf8'),
)

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true })
  fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function readStore() {
  ensureDirs()
  if (!fs.existsSync(STORE_PATH)) {
    fs.writeFileSync(STORE_PATH, JSON.stringify(DEFAULT_LOGOS, null, 2))
  }
  try {
    const raw = JSON.parse(fs.readFileSync(STORE_PATH, 'utf8'))
    return Array.isArray(raw) ? raw : DEFAULT_LOGOS
  } catch {
    return DEFAULT_LOGOS
  }
}

function writeStore(logos) {
  ensureDirs()
  fs.writeFileSync(STORE_PATH, JSON.stringify(logos, null, 2))
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function sign(payload) {
  return b64url(crypto.createHmac('sha256', ADMIN_PASSWORD).update(payload).digest())
}

function makeSession() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const payload = `v1.${exp}`
  return `${payload}.${sign(payload)}`
}

function verifySession(token) {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const [v, expStr, sig] = parts
  const payload = `${v}.${expStr}`
  if (sig !== sign(payload)) return false
  const exp = Number(expStr)
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000)
}

function parseCookies(header) {
  const out = {}
  if (!header) return out
  for (const part of header.split(';')) {
    const i = part.indexOf('=')
    if (i === -1) continue
    const k = part.slice(0, i).trim()
    const v = part.slice(i + 1).trim()
    out[k] = decodeURIComponent(v)
  }
  return out
}

function json(res, status, body, extraHeaders = {}) {
  const data = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
    ...extraHeaders,
  })
  res.end(data)
}

function setCookie(token) {
  return `${ADMIN_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_MAX_AGE_SEC}`
}

function clearCookie() {
  return `${ADMIN_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
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

function extFor(mime, fileName = '') {
  if (mime === 'image/png') return 'png'
  if (mime === 'image/jpeg') return 'jpg'
  if (mime === 'image/webp') return 'webp'
  if (mime === 'image/svg+xml') return 'svg'
  const m = String(fileName).toLowerCase().match(/\.([a-z0-9]+)$/)
  return m ? m[1] : 'png'
}

async function readBody(req) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > MAX_BYTES * 1.4) throw new Error('File too large (max 2.5MB)')
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

function requireAuth(req) {
  const cookies = parseCookies(req.headers.cookie)
  return verifySession(cookies[ADMIN_COOKIE])
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://127.0.0.1:${PORT}`)
  // Match Next trailingSlash redirects (/api/logos/ → same handlers)
  const pathname = url.pathname.replace(/\/+$/, '') || '/'

  if (req.method === 'OPTIONS') {
    return json(res, 204, {})
  }

  try {
    if (req.method === 'GET' && pathname === '/api/logos') {
      return json(res, 200, { logos: readStore() })
    }

    if (req.method === 'POST' && pathname === '/api/admin/login') {
      const raw = await readBody(req)
      const body = JSON.parse(raw.toString('utf8') || '{}')
      if (body.password !== ADMIN_PASSWORD) {
        return json(res, 401, { error: 'Wrong password' })
      }
      const token = makeSession()
      return json(res, 200, { ok: true }, { 'Set-Cookie': setCookie(token) })
    }

    if (req.method === 'POST' && pathname === '/api/admin/logout') {
      return json(res, 200, { ok: true }, { 'Set-Cookie': clearCookie() })
    }

    if (req.method === 'GET' && pathname === '/api/admin/session') {
      return json(res, 200, { ok: requireAuth(req) })
    }

    if (req.method === 'GET' && pathname === '/api/admin/logos') {
      if (!requireAuth(req)) return json(res, 401, { error: 'Please log in' })
      return json(res, 200, { logos: readStore() })
    }

    if (req.method === 'POST' && pathname === '/api/admin/logos') {
      if (!requireAuth(req)) return json(res, 401, { error: 'Please log in' })
      const raw = await readBody(req)
      const body = JSON.parse(raw.toString('utf8') || '{}')
      const name = String(body.name || '').trim()
      const dataUrl = String(body.dataUrl || '')
      if (!name) return json(res, 400, { error: 'Name is required' })
      const match = dataUrl.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/)
      if (!match) return json(res, 400, { error: 'Upload a PNG, JPG, WebP, or SVG' })
      const mime = match[1]
      const buf = Buffer.from(match[2], 'base64')
      if (buf.length > MAX_BYTES) return json(res, 400, { error: 'File too large (max 2.5MB)' })

      ensureDirs()
      const id = `${slugify(name)}-${Date.now().toString(36)}`
      const file = `${id}.${extFor(mime)}`
      fs.writeFileSync(path.join(UPLOAD_DIR, file), buf)
      const logos = readStore()
      logos.push({ id, name, src: `/uploads/logos/${file}` })
      writeStore(logos)
      return json(res, 200, { ok: true, logos })
    }

    if (req.method === 'DELETE' && pathname.startsWith('/api/admin/logos/')) {
      if (!requireAuth(req)) return json(res, 401, { error: 'Please log in' })
      const id = decodeURIComponent(pathname.slice('/api/admin/logos/'.length))
      const logos = readStore().filter((l) => l.id !== id)
      writeStore(logos)
      return json(res, 200, { ok: true, logos })
    }

    return json(res, 404, { error: 'Not found' })
  } catch (err) {
    return json(res, 500, { error: err?.message || 'Server error' })
  }
})

ensureDirs()
if (!fs.existsSync(STORE_PATH)) writeStore(DEFAULT_LOGOS)

server.listen(PORT, '127.0.0.1', () => {
  console.log(`[admin-api] http://127.0.0.1:${PORT}  (password from ADMIN_PASSWORD or default)`)
})
