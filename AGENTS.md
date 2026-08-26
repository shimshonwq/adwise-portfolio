# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended.
- Homepage order is Hero → Services (“What we do”) → Clients logo strip → Spotlight → Process → About → Contact. There is no “Now trending” section.
- **CMS**: Public pages load from `GET /api/content/` (GitHub when configured), with `workers.dev` fallback if the custom domain challenges `/api/*`. Static `/data/content.json` and `/uploads/*` are also served live by the Worker from GitHub so admin saves appear for **all visitors within seconds** (no rebuild required for text/colors/logos). Admin at `/login` edits logos, **theme colors**, all section copy, contact form labels, projects/404 pages, and password. Logo uploads: PNG/JPG/WebP only, 200–2400×40–1200px, max 2MB (see `lib/logo-rules.ts`). Saves commit to GitHub. Production Worker secrets: `GITHUB_TOKEN`, `GITHUB_REPO`. PBKDF2 uses 100k iterations. Deploy: `npm run deploy` then `npx wrangler versions deploy <version-id>`.
- **Contact emails**: Form posts to `POST /api/contact` (Worker). Delivery order: `RESEND_API_KEY` → FormSubmit → GitHub issue notification (uses existing `GITHUB_TOKEN`). Do **not** redirect visitors to formsubmit.co. Human check is **Cloudflare Turnstile** only (`TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` Worker secrets; public config via `GET /api/captcha-config`). Fake on-page reCAPTCHA was removed. If Send fails with “Bad credentials”, refresh Worker `GITHUB_TOKEN` with a durable classic PAT (`repo` scope)—short-lived tokens expire. Prefer unsetting a bad shell `GITHUB_TOKEN` so `gh auth token` works. On `adwisemedia.co`, if zone CF challenges `/api/*`, the form falls back to `workers.dev` with CORS.
- Editorial accent type is **EB Garamond italic** (`.font-serif`).
- The hero lightbulb (`HeroOrbit` in `components/Hero.tsx`) is scroll-driven. To verify it, load `/`, wait for the short opening (~1.2s), then scroll — the bulb and rings should tilt/shift.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`), not inside a `backdrop-filter` header. Open it mid-page to confirm links are visible. Header uses a solid paper background when scrolled or open.
- Opening animation respects `prefers-reduced-motion` and skips the veil.
- Palette is gold, black, white, and brass on a warm ivory paper (`#e8dfd0`). Do not reintroduce cyan/pink “kids” accents.
- Headlines on gold sections (`brand-field`) stay ink for contrast. Gold type is for dark sections only.
