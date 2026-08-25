# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000 + local CMS API on 8787). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended. Prefer `npx next build --no-lint` for builds.
- Homepage order/visibility/backgrounds are CMS-driven via `layout.sections` (admin **Page layout** tab). Default order: Hero → Services → Clients → Spotlight → Process → About → Contact.
- **CMS (`/login`)**: Full site builder — brand logo/favicon/OG (`POST /api/admin/brand`), client logos, theme colors + fonts, per-field text styles (`textStyles` + `CmsText` on the public site), section backgrounds, nav, contact buttons, custom pages (`/p/[slug]/` after rebuild; `showInNav` merges into header/footer), and password. Logo uploads: PNG/JPG/WebP only, size rules in `lib/logo-rules.ts`. Saves commit to GitHub — Cloudflare rebuilds (~1–3 min). Production Worker secrets: `GITHUB_TOKEN`, `GITHUB_REPO` (`shimshonwq/adwise-portfolio`), `GITHUB_BRANCH`=`main`. PBKDF2 uses 100k iterations. Deploy: `npx next build --no-lint` then `npx wrangler versions upload` / `deploy`. Do **not** reset `data/admin-auth.json` unless the user asks.
- **GitHub 401 on login/save**: That is the Cloudflare Worker `GITHUB_TOKEN` secret (expired/revoked), **not** the CMS password. Fix: `echo "$GITHUB_TOKEN" | npx wrangler secret put GITHUB_TOKEN` (use a durable classic PAT with `repo` scope on `shimshonwq/adwise-portfolio`, not a short-lived `gh auth token`). Also set `GITHUB_REPO` / `GITHUB_BRANCH` if missing. Do not change the user’s admin password when fixing this.
- Editorial accent type is **EB Garamond italic** (`.font-serif`). Per-line overrides use the admin “Text style” control on each field.
- The hero lightbulb (`HeroOrbit` in `components/Hero.tsx`) is scroll-driven. Opening animation respects `prefers-reduced-motion`.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`). Header uses a solid paper background when scrolled or open.
- Palette is gold, black, white, and brass on warm ivory paper. Do not reintroduce cyan/pink accents.
- Headlines on gold sections (`brand-field`) stay ink for contrast. Gold type is for dark sections only.
