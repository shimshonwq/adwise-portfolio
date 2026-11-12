/**
 * Validate a durable GitHub token for CMS / Worker (classic PAT recommended).
 */
import { execSync } from 'node:child_process'

/** @returns {'classic' | 'fine-grained' | 'ephemeral' | 'unknown'} */
export function githubTokenKind(token) {
  const t = String(token || '').trim()
  if (t.startsWith('ghp_')) return 'classic'
  if (t.startsWith('github_pat_')) return 'fine-grained'
  if (t.startsWith('ghs_')) return 'ephemeral'
  return 'unknown'
}

export function resolveGithubTokenFromEnv() {
  if (process.env.ADWISE_GITHUB_TOKEN?.trim()) return process.env.ADWISE_GITHUB_TOKEN.trim()
  if (process.env.GITHUB_TOKEN?.trim()) return process.env.GITHUB_TOKEN.trim()
  try {
    const token = execSync('gh auth token', {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      env: { ...process.env, GITHUB_TOKEN: '' },
    }).trim()
    if (token) return token
  } catch {
    /* gh not available */
  }
  return ''
}

export async function verifyGithubRepoAccess(token, repo = 'shimshonwq/adwise-portfolio', branch = 'main') {
  const [owner, name] = repo.split('/')
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${name}/contents/data/admin-auth.json?ref=${encodeURIComponent(branch)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'adwise-cms',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
  if (res.status === 401) {
    throw new Error('GitHub rejected this token (401 Bad credentials).')
  }
  if (res.status === 403) {
    throw new Error('GitHub token lacks repo access (403). Use classic PAT with repo scope.')
  }
  if (res.status === 404) {
    throw new Error('data/admin-auth.json not found in GitHub. Run npm run bootstrap:admin and push.')
  }
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`GitHub API ${res.status}: ${body.slice(0, 200)}`)
  }
  return true
}

/**
 * @param {string} token
 * @param {{ allowEphemeral?: boolean }} [opts]
 */
export async function validateDurableGithubToken(token, opts = {}) {
  const kind = githubTokenKind(token)
  if (!token) {
    throw new Error('No GitHub token found. Set ADWISE_GITHUB_TOKEN or GITHUB_TOKEN.')
  }
  if (kind === 'ephemeral' && !opts.allowEphemeral) {
    throw new Error(
      'Token is short-lived (ghs_). Create a classic PAT at https://github.com/settings/tokens with repo scope and No expiration, then set ADWISE_GITHUB_TOKEN.',
    )
  }
  if (kind === 'unknown') {
    throw new Error('Unrecognized token format. Use a classic PAT (ghp_…) or fine-grained PAT (github_pat_…).')
  }
  await verifyGithubRepoAccess(token)
  return { kind, ok: true }
}
