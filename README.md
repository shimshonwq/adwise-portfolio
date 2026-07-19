# Adwise Media — adwisemedia.co

Premium portfolio for **Adwise Media**: marketing, content creation, and graphic design.

## Stack

- Next.js 15 static export → `out/`
- Tailwind CSS v4 + Framer Motion
- Cloudflare Workers Static Assets via `wrangler.jsonc`

## Local

```bash
npm install
npm run dev
npm run build   # writes out/
```

## Cloudflare deploy

This repo is already set up for Cloudflare’s Workers pipeline:

1. Build: `npm run build`
2. Publish: `npx wrangler versions upload` (uses `wrangler.jsonc` → `./out`)

**Production branch should be `main`.**

Optional env var: `NODE_VERSION=20`

Custom domain: attach **adwisemedia.co** in the Cloudflare dashboard.

> Connecting a Cloudflare account inside Cursor is not available from this agent environment. Deploy works through GitHub → Cloudflare once the project is linked and pointed at `main`.

## Content

| File | What to edit |
| --- | --- |
| `config/site.config.ts` | Name, email, phone, domain, socials |
| `data/projects.ts` | Case studies |
| `public/logo.png` | Brand logo |
| `styles/globals.css` | Colors & type tokens |

## Contact form

Messages go to **adwisecreativity@gmail.com** via FormSubmit. After the first live submission, confirm the email FormSubmit sends — then every inquiry arrives in Gmail.
