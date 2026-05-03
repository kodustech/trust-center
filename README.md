# trust-center-static

A static, YAML-driven trust center. Edit one file, run `yarn build`, drop the `out/` directory on any static host. No database, no auth provider, no server-side runtime.

Forked from [kodustech/trust-center](https://github.com/kodustech/trust-center) — credit to the Kodus team for the design system, schema, and the polished rendering layer that does the heavy lifting.

## What's different from upstream

| | Upstream (`kodustech/trust-center`) | This fork |
| --- | --- | --- |
| Storage | Supabase (Postgres) for YAML and document requests | A single `data/trust.yaml` file in the repo |
| Auth | NextAuth + GitHub SSO, admin allowlist | None |
| Admin UI | YAML editor with live preview, request inbox | None |
| Document requests | Modal posts to `/api/requests`, stored in Supabase | Modal removed; "Request access" opens a `mailto:` draft |
| Runtime | Next.js with Node server (admin routes, API routes) | Next.js `output: "export"` — pure static HTML/CSS/JS |
| Deploy targets | Anywhere that runs Node (Vercel, Fly, etc.) | Anywhere that serves files (Cloudflare Pages, S3, GitHub Pages, Netlify…) |

The public render path — schema, theming, every section component — is unchanged from upstream.

## How it works

1. Edit [`data/trust.yaml`](data/trust.yaml). The schema is defined in [`src/lib/trust-config.ts`](src/lib/trust-config.ts) and documented in [`docs/trust-center-schema.md`](docs/trust-center-schema.md).
2. Run `yarn build`. The page is rendered at build time and emitted to `out/` as static HTML.
3. Deploy `out/` to any static host.

If `data/trust.yaml` is missing or fails Zod validation, the build throws — no silent fallback to placeholder content.

## Local development

```bash
yarn install
yarn dev
# open http://localhost:3000
```

To preview the production build locally:

```bash
yarn build
npx serve out
```

## Document requests

The "Request access" button on `request`-only documents opens a prefilled `mailto:` draft. The recipient address comes from the top-level `contactEmail` field in `data/trust.yaml`, falling back to `contacts.email`. Set whichever you prefer (or both).

If your request volume grows past what email can handle, the cleanest upgrade is to wire the dialog back in and POST to a serverless function (Resend, Cloudflare Workers, etc.). That's out of scope for this fork.

## Stack

- Next.js 16 (App Router) with `output: "export"`
- TypeScript, Zod, js-yaml
- Tailwind CSS v4 + shadcn/ui (accordion, badge, button, card)
- Radix UI primitives (accordion, slot)

## License

MIT — see [LICENSE](./LICENSE). Original copyright held by Kodus per the upstream README.

## Contributing

PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md). Issues and pull requests should be filed against this fork; for upstream issues, file at [kodustech/trust-center](https://github.com/kodustech/trust-center/issues).
