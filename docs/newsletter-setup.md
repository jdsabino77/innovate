# Newsletter signup

The landing page newsletter form posts to `POST /api/newsletter` on the Worker. Signups are stored in Cloudflare D1 and an admin notification email is sent via MailChannels.

## Email addresses

| Role | Variable | Value | DNS needed? |
|------|----------|-------|-------------|
| **From** (sender) | `NEWSLETTER_FROM_EMAIL` | `noreply@innovateconference.ca` | Yes — on `innovateconference.ca` |
| **To** (admin alert) | `NEWSLETTER_NOTIFY_EMAIL` | `events@yasalaser.com` | No — any inbox can receive |

The Worker sends **from** `@innovateconference.ca` **to** `events@yasalaser.com`. You do not need DNS access to `yasalaser.com` for notifications to arrive. **Reply-To** on each alert is set to the person who submitted the form.

## One-time setup

### 1. D1 database

Create the D1 database and copy the returned `database_id` into [`wrangler.jsonc`](../wrangler.jsonc) under the `DB` binding:

```sh
npx wrangler d1 create innovate-newsletter
```

The `d1_databases` entry must use `"binding": "DB"` (the Worker reads `env.DB`) and include `"migrations_dir": "migrations"` on that same object.

### 2. Apply migrations (remote)

One-time; run locally with an authenticated Wrangler session:

```sh
npx wrangler d1 migrations apply innovate-newsletter --remote
```

CI does not run migrations automatically — the deploy API token may not include D1 permissions. Re-run this command locally whenever a new file is added under `migrations/`.

### 3. MailChannels DNS on `innovateconference.ca`

Add these records in the Cloudflare DNS dashboard for **innovateconference.ca** (the From domain). Do not add them on `yasalaser.com`.

**SPF** — one TXT record on the root domain `@` (merge with an existing SPF record if you already have one; only one SPF record per domain):

```text
v=spf1 include:relay.mailchannels.net ~all
```

If you already have SPF, insert `include:relay.mailchannels.net` before the final `~all` or `-all`.

**Domain lockdown** — TXT record on `_mailchannels`:

For Cloudflare Workers, MailChannels historically used:

```text
v=mc1 cfid=<your-workers-subdomain>.workers.dev
```

Find `<your-workers-subdomain>` in the Cloudflare dashboard under **Workers & Pages** (e.g. `jdsabino.workers.dev`).

MailChannels has updated their domain lockdown format for newer Outbound accounts (`v=mc1 auth=<account-id> senderid=<sender-id>`). If the `cfid` record does not work, see [MailChannels domain lockdown](https://docs.mailchannels.com/outbound/domain-lockdown) or their [domain health check](https://dash.mailchannels.com/domain-health).

> **Note:** MailChannels ended free email sending for Cloudflare Workers in 2024. If notifications fail after DNS is correct, you may need a MailChannels Outbound account or an alternative provider (e.g. Resend). The Worker code would need to be updated for a different API.

### 4. Deploy

```sh
npm run deploy
```

Merging to `main` also deploys via GitHub Actions. Ensure `CLOUDFLARE_API_TOKEN` has **Workers Scripts Edit** for the `innovate` Worker.

After changing `NEWSLETTER_FROM_EMAIL` or `NEWSLETTER_NOTIFY_EMAIL` in `wrangler.jsonc`, redeploy so production picks up the new values.

## Configuration reference

| Setting | Location | Current value |
|---------|----------|---------------|
| Admin notification email | `wrangler.jsonc` → `NEWSLETTER_NOTIFY_EMAIL` | `events@yasalaser.com` |
| From address | `wrangler.jsonc` → `NEWSLETTER_FROM_EMAIL` | `noreply@innovateconference.ca` |
| Public site URL in emails | `wrangler.jsonc` → `SITE_URL` | `https://innovateconference.ca` |

Event metadata also includes `newsletterNotifyEmail` in [`event-config.json`](../event-config.json) for reference.

## Export signups

```sh
npx wrangler d1 execute innovate-newsletter --remote --command \
  "SELECT first_name, last_name, email, created_at FROM newsletter_signups ORDER BY created_at DESC"
```

## Local testing

```sh
npx wrangler d1 migrations apply innovate-newsletter --local
npm run build
npx wrangler dev
```

Then submit the form at `http://localhost:8787`.

## Verify end-to-end

1. Submit the newsletter form on https://innovateconference.ca
2. Confirm a row appears in D1 (export command above)
3. Confirm `events@yasalaser.com` receives an alert **from** `noreply@innovateconference.ca`
