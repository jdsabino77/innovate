# Innovate Conference Website

Static website for **Innovate: What's New in Medical Aesthetics**, a conference by YASA Laser.

- **Production:** https://innovateconference.ca (Worker `innovate`)
- **Preview (client review):** https://innovate-preview.jdsabino.workers.dev (Worker `innovate-preview`)

Deploy flow: [`docs/deploy.md`](docs/deploy.md).

## Pages

- `/` — landing page
- `/schedule` — draft program
- `/speakers` — faculty placeholders
- `/sponsors` — sponsorship tiers
- `/venue` — venue details
- `/register` — conference pass sales (C$99 Eventbrite checkout when configured)
- `/contact` — conference inquiries

## Configuration

Event metadata lives in [`event-config.json`](event-config.json). Update dates, venue, contact email, and ticketing (`ticketing.embedUrl`) there; pages read from this file.

Ticket purchasing setup and fee comparison: [`docs/ticket-purchasing.md`](docs/ticket-purchasing.md).

Newsletter signup (D1 + Resend): [`docs/newsletter-setup.md`](docs/newsletter-setup.md).

Content placeholders for the program are in [`src/data/`](src/data/).

## Development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run check
npm run build
npm run smoke-test
```

## Deploy

```sh
# Preview only (safe default) — does not update innovateconference.ca
npm run deploy

# Production — only after client confirmation
npm run deploy:production
```

Pushes to `main` deploy **preview** via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). Production requires a manual workflow run with target **production**. Secrets:

- `CLOUDFLARE_API_TOKEN` — token with **Edit Cloudflare Workers** ([create one](https://dash.cloudflare.com/profile/api-tokens))
- `CLOUDFLARE_ACCOUNT_ID` — Cloudflare account ID for Worker `innovate`

Details: [`docs/deploy.md`](docs/deploy.md).
