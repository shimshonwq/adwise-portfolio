# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended.
- Homepage order is Hero → Services (“What we do”) → Clients logo strip → Spotlight → Process → About → Contact. There is no “Now trending” section.
- Client logo bar: `components/Clients.tsx` loads from `/api/logos` (admin store), then `/data/logos.json`, then `DEFAULT_LOGOS` in `lib/logos.ts`. White strip, original colors, no invert. Same slot for every mark (`15rem` × `5.25rem`). Row auto-slides and is draggable.
- **Private admin** at `/login` (not in nav, `noindex`). `npm run dev` starts Next **and** `scripts/admin-api.mjs` (port 8787, rewritten via `next.config.mjs`). Default local password `adwise-admin` (override with `ADMIN_PASSWORD`). Upload/remove updates the homepage bar immediately. Production needs Worker KV binding `LOGOS` + `wrangler secret put ADMIN_PASSWORD` (see `wrangler.jsonc` comments). Do not add `/login` links to the public site.
- Editorial accent type is **EB Garamond italic** (`.font-serif`).
- The hero lightbulb (`HeroOrbit` in `components/Hero.tsx`) is scroll-driven. To verify it, load `/`, wait for the short opening (~1.2s), then scroll — the bulb and rings should tilt/shift.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`), not inside a `backdrop-filter` header. Open it mid-page to confirm links are visible. Header uses a solid paper background when scrolled or open.
- Opening animation respects `prefers-reduced-motion` and skips the veil.
- Palette is gold, black, white, and brass on a warm ivory paper (`#e8dfd0`). Do not reintroduce cyan/pink “kids” accents.
- Headlines on gold sections (`brand-field`) stay ink for contrast. Gold type is for dark sections only.
