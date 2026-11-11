# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended.
- Homepage order is Hero → Services (“What we do”) → Clients logo strip → Spotlight → Process → About → Contact. There is no “Now trending” section.
- **CMS**: Public pages load from `GET /api/content/` (GitHub when configured), with `workers.dev` fallback if the custom domain challenges `/api/*`. Static `/data/content.json` and `/uploads/*` are also served live by the Worker from GitHub so admin saves appear for **all visitors within seconds** (no rebuild required for text/colors/logos). Admin at `/login` edits logos, **theme colors**, all section copy, contact form labels, projects/404 pages, and password. Logo uploads: PNG/JPG/WebP only, 200–2400×40–1200px, max 2MB (see `lib/logo-rules.ts`). Saves commit to GitHub. Production Worker secrets: **`ADWISE_GITHUB_TOKEN`** (classic PAT, repo scope, no expiration), `GITHUB_REPO`. Admin login prefers Worker secret **`ADMIN_AUTH_JSON`** (full auth record JSON); GitHub `data/admin-auth.json` is legacy fallback only. Never commit live `data/admin-auth.json` — use `npm run bootstrap:admin` (writes `.data/`, gitignored). PBKDF2 uses 100k iterations. Deploy: `npm run deploy` then `npx wrangler deploy`; push secrets with `ADWISE_GITHUB_TOKEN=ghp_… npm run secrets:worker`.
- **Contact emails**: Form posts to `POST /api/contact` (Worker). Delivery order: `RESEND_API_KEY` → FormSubmit → GitHub issue notification (uses existing `GITHUB_TOKEN`). Do **not** redirect visitors to formsubmit.co. Human check is **Cloudflare Turnstile** only (`TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` Worker secrets; public config via `GET /api/captcha-config`). Fake on-page reCAPTCHA was removed. If Send fails with “Bad credentials”, refresh Worker `GITHUB_TOKEN` with a durable classic PAT (`repo` scope)—short-lived tokens expire. Prefer unsetting a bad shell `GITHUB_TOKEN` so `gh auth token` works. On `adwisemedia.co`, if zone CF challenges `/api/*`, the form falls back to `workers.dev` with CORS.
- Display type is **Syne**; body is **Outfit**. Brand motif is the logo yellow signal/dot on black.
- Hero is black full-bleed with yellow signal orb and opening veil (~1.1s). Opening respects `prefers-reduced-motion` and skips the veil.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`). Header becomes solid black when scrolled or open.
- Palette is **black / logo yellow (`#fdc621`) / white** — sharp geometry, no cream paper, no soft rounded cards. Do not reintroduce cyan/pink accents or ivory backgrounds.
- Yellow type and CTAs on dark stages; black type on yellow (`brand-field`) stages.
