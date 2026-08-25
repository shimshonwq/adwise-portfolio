/**
 * GitHub Contents API for local admin API (Node).
 */
import fs from 'node:fs'

const API = 'https://api.github.com'

export function githubConfigured() {
  return Boolean(process.env.GITHUB_TOKEN && process.env.GITHUB_REPO)
}

export function githubConfig() {
  const token = process.env.GITHUB_TOKEN
  const repo = process.env.GITHUB_REPO || 'shimshonwq/adwise-portfolio'
  const branch = process.env.GITHUB_BRANCH || 'main'
  const [owner, name] = String(repo).split('/')
  if (!token || !owner || !name) {
    throw new Error('Set GITHUB_TOKEN and GITHUB_REPO (owner/repo) to publish to GitHub.')
  }
  return { token, owner, repo: name, branch, fullRepo: `${owner}/${name}` }
}

async function ghRequest(cfg, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'adwise-cms',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {}),
    },
  })
  if (res.status === 404) return null
  const body = await res.text()
  if (!res.ok) {
    let msg = body
    try {
      msg = JSON.parse(body).message || body
    } catch {
      /* ignore */
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        'Site storage token expired (GitHub). Login and saves need a fresh GITHUB_TOKEN — this is not your CMS password.',
      )
    }
    throw new Error(`GitHub API ${res.status}: ${msg}`)
  }
  return body ? JSON.parse(body) : {}
}

export async function readJsonFile(repoPath) {
  const cfg = githubConfig()
  const meta = await ghRequest(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`,
  )
  if (!meta) return null
  return { sha: meta.sha, data: JSON.parse(Buffer.from(meta.content, 'base64').toString('utf8')) }
}

export async function writeJsonFile(repoPath, data, message) {
  const cfg = githubConfig()
  const existing = await readJsonFile(repoPath).catch(() => null)
  const text = `${JSON.stringify(data, null, 2)}\n`
  const payload = {
    message,
    content: Buffer.from(text, 'utf8').toString('base64'),
    branch: cfg.branch,
  }
  if (existing?.sha) payload.sha = existing.sha
  return ghRequest(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function writeBinaryFile(repoPath, buffer, message) {
  const cfg = githubConfig()
  let sha = null
  try {
    const meta = await ghRequest(
      cfg,
      `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`,
    )
    sha = meta?.sha || null
  } catch {
    /* new file */
  }
  const payload = {
    message,
    content: buffer.toString('base64'),
    branch: cfg.branch,
  }
  if (sha) payload.sha = sha
  return ghRequest(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function deleteRepoFile(repoPath, message) {
  const cfg = githubConfig()
  const meta = await ghRequest(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`,
  )
  if (!meta?.sha) return null
  return ghRequest(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: meta.sha, branch: cfg.branch }),
  })
}

export const CONTENT_REPO_PATH = 'public/data/content.json'

export function logoRepoPath(src) {
  if (!src || typeof src !== 'string') return null
  if (src.startsWith('/uploads/logos/') || src.startsWith('/uploads/brand/')) return `public${src}`
  return null
}

export async function publishSiteContent(content, message = 'CMS: update site content') {
  content.version = 1
  content.updatedAt = new Date().toISOString()
  await writeJsonFile(CONTENT_REPO_PATH, content, message)
  return { published: true, message: 'Pushed to GitHub. Cloudflare will rebuild in 1–3 minutes.' }
}

export async function readSiteContentFromGitHub() {
  const row = await readJsonFile(CONTENT_REPO_PATH).catch(() => null)
  return row?.data || null
}

/** Optional: load token from env files when running locally */
export function loadGithubEnv(root) {
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
