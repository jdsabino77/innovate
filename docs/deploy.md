# Deploy preview vs production

Use **preview** for client review. Use **production** only after changes are approved.

| Target | Worker | URL | How to deploy |
|--------|--------|-----|----------------|
| **Preview** | `innovate-preview` | https://innovate-preview.jdsabino.workers.dev | Default: push to `main`, `npm run deploy`, or `npm run deploy:preview` |
| **Production** | `innovate` | https://innovateconference.ca | Explicit only: `npm run deploy:production` or Actions → Run workflow → **production** |

**Share with clients for review:** https://innovate-preview.jdsabino.workers.dev only.

**Not for client review:** https://innovate.jdsabino.workers.dev — that is the production Worker’s `workers.dev` subdomain. It serves the **same live content** as https://innovateconference.ca. `npm run deploy` does **not** update it; only a production deploy does.

`innovateconference.ca` is a Workers Custom Domain on the **production** Worker only (dashboard). Do not add it under `env.preview` in [`wrangler.jsonc`](../wrangler.jsonc).

## Local commands

```sh
# Safe default — preview Worker only
npm run deploy
# same as
npm run deploy:preview

# Live site — only after client confirmation
npm run deploy:production
```

## GitHub Actions

- **Push / merge to `main`** → deploys **preview** only.
- **workflow_dispatch** → choose `preview` or `production`.

## Secrets

Secrets are per Worker. After the first preview deploy, copy the Resend key if newsletter signup should work on preview:

```sh
npx wrangler secret put RESEND_API_KEY --env preview
```

Preview currently shares the production D1 newsletter database. Signups from the preview URL land in the same table as production.

## Typical review flow

1. Merge or deploy to preview.
2. Share https://innovate-preview.jdsabino.workers.dev with the client.
3. After approval, run a **production** deploy of the same commit.
