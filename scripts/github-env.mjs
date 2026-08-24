/**
 * Resolve GitHub token from env or `gh auth token` (local dev only).
 */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

export function resolveGithubToken() {
  if (process.env.GITHUB_TOKEN?.trim()) return process.env.GITHUB_TOKEN.trim()
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    if (token) return token
  } catch {
    /* gh not available */
  }
  return ''
}

export function ensureGithubEnv(root) {
  if (!process.env.GITHUB_REPO) {
    process.env.GITHUB_REPO = 'shimshonwq/adwise-portfolio'
  }
  if (!process.env.GITHUB_BRANCH) {
    process.env.GITHUB_BRANCH = 'main'
  }
  if (!process.env.GITHUB_TOKEN) {
    const token = resolveGithubToken()
    if (token) process.env.GITHUB_TOKEN = token
  }
  for (const file of ['.env.local', '.env']) {
    const p = `${root}/${file}`
    if (!fs.existsSync(p)) continue
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
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
}
