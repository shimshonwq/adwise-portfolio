# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended.
- Homepage order is Hero → Services (“What we do”) → Clients logo strip → Spotlight → Process → About → Contact. There is no “Now trending” section.
- **CMS**: Public pages load from `GET /api/content/` (GitHub when configured), fallback `public/data/content.json`. Admin at `/login` edits logos, **theme colors**, all section copy, contact form labels, projects/404 pages, and password. Logo uploads: PNG/JPG/WebP only, 200–2400×40–1200px, max 2MB (see `lib/logo-rules.ts`). Saves commit to GitHub — Cloudflare rebuilds. Production Worker secrets: `GITHUB_TOKEN`, `GITHUB_REPO`. PBKDF2 uses 100k iterations. Deploy: `npm run deploy` then `npx wrangler versions deploy <version-id>`.
- **Contact emails**: Form posts to `POST /api/contact` (Worker). Prefer Worker secret `RESEND_API_KEY` (+ optional `RESEND_FROM`) — FormSubmit is often Cloudflare-blocked from Worker/datacenter IPs and AJAX CORS fails from the site origin. Without Resend, the UI falls back to a top-level FormSubmit HTML POST (`_captcha=false`). If FormSubmit asks for activation, open the one-time Activate email sent to `site.email`.
- Editorial accent type is **EB Garamond italic** (`.font-serif`).
- The hero lightbulb (`HeroOrbit` in `components/Hero.tsx`) is scroll-driven. To verify it, load `/`, wait for the short opening (~1.2s), then scroll — the bulb and rings should tilt/shift.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`), not inside a `backdrop-filter` header. Open it mid-page to confirm links are visible. Header uses a solid paper background when scrolled or open.
- Opening animation respects `prefers-reduced-motion` and skips the veil.
- Palette is gold, black, white, and brass on a warm ivory paper (`#e8dfd0`). Do not reintroduce cyan/pink “kids” accents.
- Headlines on gold sections (`brand-field`) stay ink for contrast. Gold type is for dark sections only.
