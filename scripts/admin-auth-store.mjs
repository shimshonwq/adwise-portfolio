/**
 * Load / persist admin credentials (data/admin-auth.json — never in public/).
 */
import fs from 'node:fs'
import path from 'node:path'
import {
  AUTH_LOCAL_PATH,
  AUTH_REPO_PATH,
  createAuthRecord,
  generateSecurePassword,
  validatePasswordStrength,
} from './admin-auth.mjs'
import { githubConfigured, readJsonFile, writeJsonFile } from './github-store.mjs'

export function authLocalPath(root) {
  return path.join(root, AUTH_LOCAL_PATH)
}

export function authRepoSeedPath(root) {
  return path.join(root, AUTH_REPO_PATH)
}

export async function readAuthRecord(root) {
  if (githubConfigured()) {
    try {
      const row = await readJsonFile(AUTH_REPO_PATH)
      if (row?.data?.hash && row.data.sessionKey) {
        writeLocalAuth(root, row.data)
        return row.data
      }
    } catch (err) {
      console.warn('[cms-auth] GitHub auth read failed:', err.message)
    }
  }

  const local = authLocalPath(root)
  if (fs.existsSync(local)) {
    try {
      const record = JSON.parse(fs.readFileSync(local, 'utf8'))
      if (record?.hash && record.sessionKey) return record
    } catch {
      /* fall through */
    }
  }

  const seed = authRepoSeedPath(root)
  if (fs.existsSync(seed)) {
    try {
      const record = JSON.parse(fs.readFileSync(seed, 'utf8'))
      if (record?.hash && record.sessionKey) return record
    } catch {
      /* fall through */
    }
  }

  return null
}

function writeLocalAuth(root, record) {
  const local = authLocalPath(root)
  fs.mkdirSync(path.dirname(local), { recursive: true })
  fs.writeFileSync(local, `${JSON.stringify(record, null, 2)}\n`, { mode: 0o600 })
}

export function writeSeedAuth(root, record) {
  const seed = authRepoSeedPath(root)
  fs.mkdirSync(path.dirname(seed), { recursive: true })
  fs.writeFileSync(seed, `${JSON.stringify(record, null, 2)}\n`)
}

export async function persistAuthRecord(root, record, message = 'CMS: update admin credentials') {
  writeLocalAuth(root, record)
  writeSeedAuth(root, record)
  if (githubConfigured()) {
    await writeJsonFile(AUTH_REPO_PATH, record, message)
  }
}

export async function ensureAuthRecord(root) {
  const existing = await readAuthRecord(root)
  if (existing?.hash) return { record: existing, created: false, password: null }

  let password = process.env.ADMIN_PASSWORD?.trim() || ''
  if (validatePasswordStrength(password)) {
    password = generateSecurePassword()
  }

  const record = createAuthRecord(password)
  await persistAuthRecord(root, record, 'CMS: bootstrap admin credentials')

  const hintPath = path.join(root, '.data', 'admin-default-password.txt')
  fs.mkdirSync(path.dirname(hintPath), { recursive: true })
  fs.writeFileSync(
    hintPath,
    `Adwise admin default password (change after first login):\n${password}\n`,
    { mode: 0o600 },
  )

  return { record, created: true, password, hintPath }
}
