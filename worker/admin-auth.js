/**
 * Admin authentication (Web Crypto) — mirrors scripts/admin-auth.mjs
 */
export const AUTH_REPO_PATH = 'data/admin-auth.json'
export const ADMIN_COOKIE = 'adwise_admin'
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
export const PBKDF2_ITERATIONS = 210_000

const MIN_PASSWORD_LEN = 12
const te = new TextEncoder()

export function validatePasswordStrength(password) {
  const p = String(password || '')
  if (p.length < MIN_PASSWORD_LEN) return `Use at least ${MIN_PASSWORD_LEN} characters.`
  if (!/[a-z]/.test(p)) return 'Include a lowercase letter.'
  if (!/[A-Z]/.test(p)) return 'Include an uppercase letter.'
  if (!/[0-9]/.test(p)) return 'Include a number.'
  if (!/[^A-Za-z0-9]/.test(p)) return 'Include a symbol (e.g. ! @ #).'
  return null
}

function b64ToBytes(b64) {
  const bin = atob(b64.replace(/\n/g, ''))
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function bytesToB64(bytes) {
  let s = ''
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i])
  return btoa(s)
}

function b64url(bytes) {
  return bytesToB64(bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function pbkdf2(password, salt, iterations) {
  const key = await crypto.subtle.importKey('raw', te.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ])
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    key,
    256,
  )
  return new Uint8Array(bits)
}

function randomBytes(n) {
  const buf = new Uint8Array(n)
  crypto.getRandomValues(buf)
  return buf
}

export async function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = await pbkdf2(password, salt, PBKDF2_ITERATIONS)
  const sessionKey = randomBytes(32)
  return {
    version: 1,
    algo: 'pbkdf2-sha256',
    iterations: PBKDF2_ITERATIONS,
    salt: bytesToB64(salt),
    hash: bytesToB64(hash),
    sessionKey: bytesToB64(sessionKey),
    updatedAt: new Date().toISOString(),
  }
}

export async function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash) return false
  const salt = b64ToBytes(record.salt)
  const expected = b64ToBytes(record.hash)
  const actual = await pbkdf2(password, salt, record.iterations || PBKDF2_ITERATIONS)
  if (actual.length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < actual.length; i++) diff |= actual[i] ^ expected[i]
  return diff === 0
}

export async function createAuthRecord(password) {
  const err = validatePasswordStrength(password)
  if (err) throw new Error(err)
  return hashPassword(password)
}

export async function rotatePassword(_record, newPassword) {
  const err = validatePasswordStrength(newPassword)
  if (err) throw new Error(err)
  return hashPassword(newPassword)
}

async function hmacSign(sessionKeyB64, payload) {
  const raw = b64ToBytes(sessionKeyB64)
  const key = await crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, te.encode(payload))
  return b64url(new Uint8Array(sig))
}

export async function makeSessionToken(sessionKeyB64) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const payload = `v2.${exp}`
  return `${payload}.${await hmacSign(sessionKeyB64, payload)}`
}

export async function verifySessionToken(sessionKeyB64, token) {
  if (!sessionKeyB64 || !token) return false
  const parts = String(token).split('.')
  if (parts.length !== 3 || parts[0] !== 'v2') return false
  const payload = `${parts[0]}.${parts[1]}`
  const expected = await hmacSign(sessionKeyB64, payload)
  if (parts[2].length !== expected.length) return false
  let diff = 0
  for (let i = 0; i < parts[2].length; i++) diff |= parts[2].charCodeAt(i) ^ expected.charCodeAt(i)
  if (diff !== 0) return false
  const exp = Number(parts[1])
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000)
}
