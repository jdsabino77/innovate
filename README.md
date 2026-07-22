# Innovate Conference Website

Static website for **Innovate**, an aesthetic medicine conference by Yasa Laser. Deployed to Cloudflare Workers at `https://innovate.jdsabino.workers.dev`.

## Pages

- `/` — landing page
- `/schedule` — draft program
- `/speakers` — faculty placeholders
- `/sponsors` — sponsorship tiers
- `/venue` — venue details
- `/register` — registration (Typeform when configured)
- `/contact` — conference inquiries

## Configuration

Event metadata lives in [`event-config.json`](event-config.json). Update dates, venue, Typeform URL, and contact email there; pages and layout read from this file.

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
npm run deploy
```

Pushes to `main` also deploy via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) when Cloudflare secrets are configured.
