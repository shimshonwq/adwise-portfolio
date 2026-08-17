# Adwise Media — agent notes

Portfolio site for Adwise Media (`adwisemedia.co`): Next.js 15 Pages Router, Tailwind v4, framer-motion, static export.

Standard install/run commands are in `README.md`.

## Cursor Cloud specific instructions

- Refresh deps with `npm install` from the repo root. Dev server: `npm run dev` (port 3000). There is no automated test suite (`package.json` has no `test` script). `npm run lint` may prompt to create an ESLint config — skip that prompt; do not run it unattended.
- Homepage order is Hero → Services (“What we do”) → Clients logo strip → Spotlight → Process → About → Contact. There is no “Now trending” section.
- Client marks live in `public/clients/` and are listed in `components/Clients.tsx`. The strip forces logos white via CSS. Do not process, crop, recolor, or regenerate uploaded client PNGs — copy the file in unchanged. Chat image attachments are descriptions only; they are not the binary file.
- The hero lightbulb (`HeroOrbit` in `components/Hero.tsx`) is scroll-driven. To verify it, load `/`, wait for the short opening (~1.2s), then scroll — the bulb and rings should tilt/shift.
- Mobile hamburger overlay is a sibling of `<header>` (`z-[60]`), not inside a `backdrop-filter` header. Open it mid-page to confirm links are visible. Header uses a solid paper background when scrolled or open.
- Opening animation respects `prefers-reduced-motion` and skips the veil.
- Palette is gold, black, white, and brass on a warm ivory paper (`#e8dfd0`). Do not reintroduce cyan/pink “kids” accents.
- Headlines on gold sections (`brand-field`) stay ink for contrast. Gold type is for dark sections only.
