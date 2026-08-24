/**
 * Admin authentication — PBKDF2 password hash + rotating session key.
 * Auth file lives at data/admin-auth.json (NOT in public/ — never served as static).
 */
import crypto from 'node:crypto'

export const AUTH_REPO_PATH = 'data/admin-auth.json'
export const AUTH_LOCAL_PATH = '.data/admin-auth.json'
export const ADMIN_COOKIE = 'adwise_admin'
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 14
export const PBKDF2_ITERATIONS = 210_000

const MIN_PASSWORD_LEN = 12

export function generateSecurePassword() {
  const base = crypto.randomBytes(18).toString('base64url')
  return `Adwise-${base}!`
}

export function validatePasswordStrength(password) {
  const p = String(password || '')
  if (p.length < MIN_PASSWORD_LEN) {
    return `Use at least ${MIN_PASSWORD_LEN} characters.`
  }
  if (!/[a-z]/.test(p)) return 'Include a lowercase letter.'
  if (!/[A-Z]/.test(p)) return 'Include an uppercase letter.'
  if (!/[0-9]/.test(p)) return 'Include a number.'
  if (!/[^A-Za-z0-9]/.test(p)) return 'Include a symbol (e.g. ! @ #).'
  return null
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16)
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    32,
    'sha256',
  )
  return {
    version: 1,
    algo: 'pbkdf2-sha256',
    iterations: PBKDF2_ITERATIONS,
    salt: salt.toString('base64'),
    hash: hash.toString('base64'),
    sessionKey: crypto.randomBytes(32).toString('base64'),
    updatedAt: new Date().toISOString(),
  }
}

export function verifyPassword(password, record) {
  if (!record?.salt || !record?.hash) return false
  const salt = Buffer.from(record.salt, 'base64')
  const expected = Buffer.from(record.hash, 'base64')
  const actual = crypto.pbkdf2Sync(
    password,
    salt,
    record.iterations || PBKDF2_ITERATIONS,
    expected.length,
    'sha256',
  )
  if (actual.length !== expected.length) return false
  return crypto.timingSafeEqual(actual, expected)
}

export function createAuthRecord(password) {
  const err = validatePasswordStrength(password)
  if (err) throw new Error(err)
  return hashPassword(password)
}

export function rotatePassword(record, newPassword) {
  const err = validatePasswordStrength(newPassword)
  if (err) throw new Error(err)
  return hashPassword(newPassword)
}

function b64url(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

export function signSession(sessionKey, payload) {
  return b64url(crypto.createHmac('sha256', sessionKey).update(payload).digest())
}

export function makeSessionToken(sessionKey) {
  const exp = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC
  const payload = `v2.${exp}`
  return `${payload}.${signSession(sessionKey, payload)}`
}

export function verifySessionToken(sessionKey, token) {
  if (!sessionKey || !token) return false
  const parts = String(token).split('.')
  if (parts.length !== 3 || parts[0] !== 'v2') return false
  const payload = `${parts[0]}.${parts[1]}`
  const expected = signSession(sessionKey, payload)
  if (parts[2].length !== expected.length) return false
  try {
    if (!crypto.timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected))) {
      return false
    }
  } catch {
    return false
  }
  const exp = Number(parts[1])
  return Number.isFinite(exp) && exp > Math.floor(Date.now() / 1000)
}
