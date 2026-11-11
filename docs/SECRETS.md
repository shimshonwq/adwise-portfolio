# Secrets still needed (GitHub is already set)

GitHub `ADWISE_GITHUB_TOKEN` is configured. These are the **other** production secrets for Cloudflare Worker (`adwise-portfolio`):

## Recommended — contact form email

| Secret | Required? | What to do |
|--------|-----------|------------|
| `RESEND_API_KEY` | Recommended | [resend.com](https://resend.com) → API Keys → create key |
| `RESEND_FROM` | Optional | Verified sender, e.g. `Adwise Media <hello@adwisemedia.co>` |

Without Resend, the contact form falls back to FormSubmit or a GitHub issue notification (less reliable).

## Already likely set — human verification (Turnstile)

| Secret | Required? | What to do |
|--------|-----------|------------|
| `TURNSTILE_SITE_KEY` | Yes (live site) | [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) → site key |
| `TURNSTILE_SECRET_KEY` | Yes (live site) | Same widget → secret key |

## Optional — nothing else required for CMS

| Item | Notes |
|------|--------|
| Cloudflare API token | Only for **you** or agents running `wrangler deploy` — not stored on the Worker |
| KV / Access | Not used for this site |

## Push secrets to Worker

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put RESEND_FROM          # optional
npx wrangler secret put TURNSTILE_SITE_KEY   # if not already set
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Or add them in **Cursor → Environment → Secrets** and ask the agent to run `npm run secrets:worker` / `wrangler secret put`.
