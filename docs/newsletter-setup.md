# Newsletter signup

The landing page newsletter form posts to `POST /api/newsletter` on the Worker. Signups are stored in Cloudflare D1 and an admin notification email is sent via MailChannels.

## One-time setup

1. Create the D1 database and copy the returned `database_id` into [`wrangler.jsonc`](../wrangler.jsonc):

   ```sh
   npx wrangler d1 create innovate-newsletter
   ```

2. Apply migrations to the remote database:

   ```sh
   npx wrangler d1 migrations apply innovate-newsletter --remote
   ```

3. Configure MailChannels for the sending domain (`yasalaser.com` or `innovateconference.ca`):
   - Add the `_mailchannels` TXT record Cloudflare documents for your From domain.
   - Ensure SPF allows MailChannels if required by your DNS provider.

4. Deploy:

   ```sh
   npm run deploy
   ```

## Configuration

| Setting | Location | Default |
|---------|----------|---------|
| Admin notification email | `wrangler.jsonc` → `NEWSLETTER_NOTIFY_EMAIL` | `events@yasalaser.com` |
| From address | `wrangler.jsonc` → `NEWSLETTER_FROM_EMAIL` | `events@yasalaser.com` |
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
