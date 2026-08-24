#!/usr/bin/env node
/**
 * Create or refresh admin credentials in data/admin-auth.json (+ GitHub when configured).
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureGithubEnv } from './github-env.mjs'
import { ensureAuthRecord, readAuthRecord } from './admin-auth-store.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
ensureGithubEnv(root)

const existing = await readAuthRecord(root)
if (existing?.hash) {
  console.log('[bootstrap] Admin auth already exists (data/admin-auth.json).')
  console.log('[bootstrap] To reset, delete that file and re-run this script.')
  process.exit(0)
}

const { password, hintPath, created } = await ensureAuthRecord(root)
if (!created) {
  console.log('[bootstrap] Nothing to do.')
  process.exit(0)
}

console.log('')
console.log('Admin credentials created.')
console.log(`Default password: ${password}`)
console.log(`Also saved locally: ${hintPath}`)
console.log('Change this password under Security after your first login.')
console.log('')
