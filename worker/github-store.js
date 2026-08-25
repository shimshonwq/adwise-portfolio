/**
 * GitHub Contents API — used by local admin API and Cloudflare Worker.
 */

export function githubConfig(env) {
  const token = env.GITHUB_TOKEN || env.github_token
  const repo = env.GITHUB_REPO || env.github_repo || 'shimshonwq/adwise-portfolio'
  const branch = env.GITHUB_BRANCH || env.github_branch || 'main'
  const [owner, name] = String(repo).split('/')
  if (!token || !owner || !name) {
    throw new Error(
      'GitHub not configured. Set GITHUB_TOKEN and GITHUB_REPO (owner/repo) secrets.',
    )
  }
  return { token, owner, repo: name, branch, fullRepo: `${owner}/${name}` }
}

export function bytesToBase64(bytes) {
  let binary = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk))
  }
  return btoa(binary)
}

export function textToBase64(text) {
  return bytesToBase64(new TextEncoder().encode(text))
}

async function ghRequest(cfg, path, init = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
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
      const j = JSON.parse(body)
      msg = j.message || body
    } catch {
      /* ignore */
    }
    throw new Error(`GitHub API ${res.status}: ${msg}`)
  }
  return body ? JSON.parse(body) : {}
}

export async function readJsonFile(env, repoPath) {
  const cfg = githubConfig(env)
  const meta = await ghRequest(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`,
  )
  if (!meta) return null
  const raw = atob(meta.content.replace(/\n/g, ''))
  return { sha: meta.sha, data: JSON.parse(raw) }
}

export async function readTextOrBytes(env, repoPath) {
  const cfg = githubConfig(env)
  const meta = await ghRequest(
    cfg,
    `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}?ref=${encodeURIComponent(cfg.branch)}`,
  )
  if (!meta) return null
  const binary = atob(meta.content.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return { sha: meta.sha, bytes, text: binary }
}

export async function writeFile(env, repoPath, base64Content, message, sha = null) {
  const cfg = githubConfig(env)
  const payload = {
    message,
    content: base64Content,
    branch: cfg.branch,
  }
  if (sha) payload.sha = sha
  return ghRequest(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export async function writeJsonFile(env, repoPath, data, message) {
  const existing = await readJsonFile(env, repoPath).catch(() => null)
  const text = `${JSON.stringify(data, null, 2)}\n`
  await writeFile(env, repoPath, textToBase64(text), message, existing?.sha || null)
}

export async function writeBinaryFile(env, repoPath, bytes, message) {
  const existing = await readTextOrBytes(env, repoPath).catch(() => null)
  await writeFile(env, repoPath, bytesToBase64(bytes), message, existing?.sha || null)
}

export async function deleteFile(env, repoPath, message) {
  const cfg = githubConfig(env)
  const meta = await readTextOrBytes(env, repoPath)
  if (!meta?.sha) return null
  return ghRequest(cfg, `/repos/${cfg.owner}/${cfg.repo}/contents/${repoPath}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, sha: meta.sha, branch: cfg.branch }),
  })
}

export const CONTENT_REPO_PATH = 'public/data/content.json'

export async function readSiteContent(env) {
  const fromGh = await readJsonFile(env, CONTENT_REPO_PATH).catch(() => null)
  if (fromGh?.data) return fromGh.data
  return null
}

export async function publishSiteContent(env, content, message = 'CMS: update site content') {
  content.version = 1
  content.updatedAt = new Date().toISOString()
  await writeJsonFile(env, CONTENT_REPO_PATH, content, message)
  return content
}

export function logoRepoPath(src) {
  if (!src || typeof src !== 'string') return null
  if (src.startsWith('/uploads/logos/') || src.startsWith('/uploads/brand/')) return `public${src}`
  return null
}
