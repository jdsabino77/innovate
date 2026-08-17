# Innovate Conference Website

Static website for **Innovate: What's New in Medical Aesthetics**, a conference by Yasa Laser. Production domain is `https://innovateconference.ca` (Workers Custom Domain, attached at go-live). Until then the Worker is public at `https://innovate.jdsabino.workers.dev`.

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
