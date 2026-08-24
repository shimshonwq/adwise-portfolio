/**
 * Starts the local admin API, then Next.js. Used by `npm run dev`.
 */
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ensureGithubEnv } from './github-env.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
ensureGithubEnv(root)
const env = { ...process.env }

const api = spawn(process.execPath, [path.join(root, 'scripts', 'admin-api.mjs')], {
  cwd: root,
  env,
  stdio: 'inherit',
})

const next = spawn('npx', ['next', 'dev', ...(process.argv.slice(2))], {
  cwd: root,
  env,
  stdio: 'inherit',
  shell: true,
})

function shutdown(code = 0) {
  try {
    api.kill('SIGTERM')
  } catch {
    /* ignore */
  }
  try {
    next.kill('SIGTERM')
  } catch {
    /* ignore */
  }
  process.exit(code)
}

api.on('exit', (code) => {
  if (code && code !== 0) shutdown(code)
})
next.on('exit', (code) => shutdown(code ?? 0))
process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
