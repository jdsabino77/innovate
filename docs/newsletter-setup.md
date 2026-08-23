# Newsletter signup

The landing page newsletter form posts to `POST /api/newsletter` on the Worker. Signups are stored in Cloudflare D1 and an admin notification email is sent via [Resend](https://resend.com).

## Email addresses

| Role | Variable | Value | DNS needed? |
|------|----------|-------|-------------|
| **From** (sender) | `NEWSLETTER_FROM_EMAIL` | `noreply@innovateconference.ca` | Yes — verify domain in Resend |
| **To** (admin alert) | `NEWSLETTER_NOTIFY_EMAIL` | `jdsabino@gmail.com,events@yasalaser.com` | No — any inbox can receive |

The Worker sends **from** `@innovateconference.ca` **to** every address in `NEWSLETTER_NOTIFY_EMAIL` (comma-separated). You do not need DNS access to `yasalaser.com` for notifications to arrive. **Reply-To** on each alert is set to the person who submitted the form.

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

### 3. Resend domain on `innovateconference.ca`

1. Add **innovateconference.ca** in the [Resend Domains](https://resend.com/domains) dashboard.
2. Copy the DNS records Resend generates into Cloudflare DNS for **innovateconference.ca**:
   - **TXT** `resend._domainkey` — DKIM
   - **TXT** `send` — SPF (`v=spf1 include:amazonses.com ~all`)
   - **MX** `send` — priority **10**, target from Resend (e.g. `feedback-smtp.us-east-1.amazonses.com`)
3. Wait until Resend shows the domain as **Verified**.
4. Leave **Enable receiving** off — only outbound admin alerts are needed.

Optional: add **TXT** `_dmarc` with `v=DMARC1; p=none;` for better deliverability.

Do **not** add MailChannels records (`_mailchannels`, `include:relay.mailchannels.net`); that integration is no longer used.

### 4. Worker secret

Store your Resend API key as a Worker secret (never commit it):

```sh
npx wrangler secret put RESEND_API_KEY
```

You can reuse the same key as other projects on the same Resend account. Confirm it is set:

```sh
npx wrangler secret list
```

For local dev, create `.dev.vars` (gitignored) with `RESEND_API_KEY=re_...`.

### 5. Deploy

```sh
npm run deploy
```

Merging to `main` also deploys via GitHub Actions. Ensure `CLOUDFLARE_API_TOKEN` has **Workers Scripts Edit** for the `innovate` Worker.

After changing `NEWSLETTER_FROM_EMAIL` or `NEWSLETTER_NOTIFY_EMAIL` in `wrangler.jsonc`, redeploy so production picks up the new values.

## Configuration reference

| Setting | Location | Current value |
|---------|----------|---------------|
| Resend API key | Worker secret `RESEND_API_KEY` | set via `wrangler secret put` |
| Admin notification emails | `wrangler.jsonc` → `NEWSLETTER_NOTIFY_EMAIL` | `jdsabino@gmail.com,events@yasalaser.com` (comma-separated) |
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
3. Confirm each address in `NEWSLETTER_NOTIFY_EMAIL` receives an alert **from** `noreply@innovateconference.ca`
4. Check [Resend → Emails](https://resend.com/emails) for a delivered send

If email fails, check **Workers & Pages → innovate → Observability → Logs** for `Resend notification failed` with the API error body.
