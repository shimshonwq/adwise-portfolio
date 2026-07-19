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

## Content

| File | Edit for |
| --- | --- |
| `config/site.config.ts` | Email, phone, WhatsApp |
| `data/projects.ts` | Case studies + media paths |
| `public/projects/{slug}/` | Screenshots, videos, covers |
| `public/logo.png` | Brand logo |
