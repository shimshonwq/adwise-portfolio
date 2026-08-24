# Adwise Media — adwisemedia.co

Portfolio for **Adwise Media**: marketing, content creation, and graphic design.

## Local

```bash
npm install
npm run dev
npm run build
```

`npm run dev` starts Next.js and the CMS API (`scripts/admin-api.mjs`).

## Admin CMS — edit from anywhere

Hidden URL: **`/login`** (not linked from the public site).

Edit logos (reorder, rename, hide, upload), contact info, hero, services, and all section copy.

### How saves work (GitHub — recommended)

1. You save in `/login`
2. The admin API **commits to GitHub** (`public/data/content.json` + uploaded logos)
3. **Cloudflare rebuilds** automatically (usually 1–3 minutes)
4. The live site updates — no KV, no manual deploy

This is the same idea as editing the repo yourself, but through a simple form.

### Local setup

1. Copy `.env.example` → `.env.local` (optional — `gh auth token` is used when `GITHUB_TOKEN` is unset)
2. `npm run bootstrap:admin` — creates `data/admin-auth.json` and prints a strong default password
3. `npm run dev` → `http://localhost:3000/login/`
4. After first login, open the **Security** tab and set your own password

### Production setup

Cloudflare Worker handles `/login` and `/api/*`. Set secrets:

```bash
npx wrangler secret put GITHUB_TOKEN
npx wrangler secret put GITHUB_REPO    # shimshonwq/adwise-portfolio
```

Ensure `data/admin-auth.json` is in the repo (`npm run bootstrap:admin` locally, then push). Passwords are stored as PBKDF2 hashes only — changing your password rotates the session key and signs out all other browsers.

Ensure Cloudflare Pages is connected to GitHub and rebuilds on push to `main`.

Then open **`https://adwisemedia.co/login/`** from any device.

## Cloudflare deploy

- Build: `npm run build` → static `./out`
- Worker: `worker/index.js` for admin API
- Publish: `npm run deploy` or Cloudflare Git integration

## Content files

| What | Where |
| --- | --- |
| Live CMS data (in git) | `public/data/content.json` |
| Admin credentials (hash only) | `data/admin-auth.json` |
| Defaults / seed | `data/cms-default.json` |
| Admin UI | `/login` |
| Case studies | `data/projects.ts` |
