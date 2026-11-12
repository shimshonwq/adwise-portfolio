import fs from 'fs'
import path from 'path'
import { normalizeContent, type CmsContent } from './content'

/** Read bundled CMS JSON at build time so static HTML/meta match published content. */
export function loadBuildContent(): CmsContent {
  const file = path.join(process.cwd(), 'public/data/content.json')
  const raw = fs.readFileSync(file, 'utf8')
  return normalizeContent(JSON.parse(raw))
}
