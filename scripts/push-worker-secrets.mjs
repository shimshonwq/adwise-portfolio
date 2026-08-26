#!/usr/bin/env node
/**
 * Validate a durable GitHub PAT and push Worker secrets (ADWISE_GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH).
 *
 * Usage:
 *   ADWISE_GITHUB_TOKEN=ghp_… npm run secrets:worker
 *
 * Requires CLOUDFLARE_API_TOKEN in the environment (or wrangler OAuth login).
 */
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureGithubEnv } from './github-env.mjs'
import { resolveGithubTokenFromEnv, validateDurableGithubToken } from './github-token.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
ensureGithubEnv(root)

const token = resolveGithubTokenFromEnv()
const repo = process.env.GITHUB_REPO || 'shimshonwq/adwise-portfolio'
const branch = process.env.GITHUB_BRANCH || 'main'

console.log('[secrets] Validating GitHub token…')
const { kind } = await validateDurableGithubToken(token)
console.log(`[secrets] Token kind: ${kind} — repo access OK`)

function putSecret(name, value) {
  console.log(`[secrets] Uploading Worker secret ${name}…`)
  const res = spawnSync(
    'npx',
    ['wrangler', 'secret', 'put', name, '--config', 'wrangler.jsonc'],
    {
      cwd: root,
      input: value,
      encoding: 'utf8',
      stdio: ['pipe', 'inherit', 'inherit'],
    },
  )
  if (res.status !== 0) {
    throw new Error(`wrangler secret put ${name} failed (exit ${res.status})`)
  }
}

putSecret('ADWISE_GITHUB_TOKEN', token)
putSecret('GITHUB_TOKEN', token)
putSecret('GITHUB_REPO', repo)
putSecret('GITHUB_BRANCH', branch)

console.log('')
console.log('[secrets] Done. Redeploy if needed: npm run deploy && npx wrangler deploy')
console.log('[secrets] Admin login now reads password only from GitHub data/admin-auth.json.')
