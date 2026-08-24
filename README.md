# Adwise Media — adwisemedia.co

Portfolio for **Adwise Media**: marketing, content creation, and graphic design.

## Local

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starts Next.js **and** the local CMS API (`scripts/admin-api.mjs` on port 8787).

## Cloudflare

- Build: `npm run build`
- Publish uses `wrangler.jsonc` → `./out` + Worker for `/api/*`
- Production branch: `main`
- Domain: `adwisemedia.co`

## Admin CMS (edit from anywhere)

Hidden URL: **`/login`** (not linked from the public site).

Control logos (add / remove / rename / reorder / hide), site contact info, hero, services, spotlight, process, about, contact copy, nav labels, and footer — from one simple password-protected screen.

### Local

1. `npm run dev`
2. Open `http://localhost:3000/login/`
3. Password: `ADMIN_PASSWORD` in `.env.local`, or default **`adwise-admin`**
4. Edit a tab → **Save changes** (logo tools save immediately)

### Production (so `/login` works on your phone / any computer)

1. `npx wrangler kv namespace create LOGOS`
2. `npx wrangler kv namespace create LOGOS --preview`
3. Paste both ids into `wrangler.jsonc` under `kv_namespaces` (see comments in that file)
4. `npx wrangler secret put ADMIN_PASSWORD` — pick a strong password
5. Deploy (`npm run deploy` or your Cloudflare pipeline)

Then open **`https://adwisemedia.co/login/`** from anywhere. Saves update the live site immediately (no rebuild required).

## Content

| What | Where |
| --- | --- |
| Live site copy & logos | `/login` admin (preferred) |
| CMS defaults / seed | `data/cms-default.json` |
| Case studies | `data/projects.ts` + `public/projects/` |
| Brand mark file | `public/logo.png` |
| Fallback contact (SEO / JsonLd) | `config/site.config.ts` |
