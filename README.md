# Adwise Media — adwisemedia.co

Portfolio for **Adwise Media**: marketing, content creation, and graphic design.

## Local

```bash
npm install
npm run dev
npm run build
```

## Cloudflare

- Build: `npm run build`
- Publish uses `wrangler.jsonc` → `./out`
- Production branch: `main`
- Domain: `adwisemedia.co`

## Admin (logo bar)

Hidden URL: **`/login`** (not linked from the public site).

1. Run `npm run dev`
2. Open `http://localhost:3000/login/`
3. Password: `ADMIN_PASSWORD` from `.env.local`, or default **`adwise-admin`**
4. Upload or remove logos — they appear on the homepage logo bar right away

### Production (Cloudflare)

1. `npx wrangler kv namespace create LOGOS` (and again with `--preview`)
2. Add the `kv_namespaces` block to `wrangler.jsonc` (see comments there)
3. `npx wrangler secret put ADMIN_PASSWORD`
4. Deploy as usual (`npm run deploy`)

## Content

| File | Edit for |
| --- | --- |
| `config/site.config.ts` | Email, phone, WhatsApp |
| `data/projects.ts` | Case studies + media paths |
| `public/projects/{slug}/` | Screenshots, videos, covers |
| `public/logo.png` | Brand logo |
| `/login` (admin) | Live logo bar uploads |
