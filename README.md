# Kodus Trust Center · Dead-simple Trust Hub

Kodus’ trust center is a self-hosted, YAML-driven builder. Paste your security program into a single YAML document and instantly expose a polished trust portal with compliance badges, document requests, subprocessors, FAQs, and more—no paid SaaS, no vendor lock-in.

## Why this project?

- **Own your data**: Everything lives in your repo/Supabase project. Deploy anywhere.
- **YAML in, trust center out**: The public site and admin builder render directly from one source of truth.
- **Fast to operate**: Sales and security teams can edit the YAML, save, and immediately refresh the public page.
- **Real document requests**: Visitors request sensitive documents via email + admin review.
- **Lego layout**: Sections can be hidden or set to `half` / `full` width for flexible compositions.

## Features

| Capability | Details |
| --- | --- |
| YAML builder + live preview | Admin area with copy/reset, Supabase-backed persistence, hide preview toggle. |
| Public trust center | Theming (`light`/`dark`), company logo, hero commitments, metrics, compliance cards, policies, documents, infra, monitoring, updates, FAQs accordion, subprocessors, contacts. |
| Document requests | Modal collects work email/context → stored via Supabase (`document_requests` table). |
| Admin dashboard | Tabs for requests + YAML editor, GitHub SSO (NextAuth). |
| API endpoints | `/api/requests` (list/create) + `/api/trust-config` (load/save YAML). |

## Tech Stack

- **Next.js 16 / App Router** + TypeScript
- **Supabase** for storing requests + YAML config
- **Shadcn/ui + Tailwind CSS v4** for styling
- **NextAuth (GitHub provider)** for admin access
- **Zod + js-yaml** for schema validation

## Quick Start

> Prereqs: Node 18+, npm. Optional: Supabase project + GitHub OAuth app.

```bash
npm install
cp .env.example .env          # fill in NEXTAUTH_*, GITHUB_*, SUPABASE_* env vars
npm run dev
```

Create the Supabase tables (SQL):

```sql
create table public.document_requests (
  id text primary key,
  email text not null,
  document text not null,
  company text not null,
  message text,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table public.trust_configs (
  id text primary key,
  yaml text not null,
  updated_at timestamptz not null default now()
);
```

Seed `trust_configs` with `id='default'` (or just save via the admin UI).

## YAML Schema Overview

Everything lives under a single document. The schema (in `docs/trust-center-schema.md`) includes:

- `theme`: `"light"` or `"dark"`
- `layout`: map of section → `"full"` / `"half"`
- `company`, `hero`, `metrics`, `compliance`, `documents`, `policies`
- `infrastructure`, `monitoring`, `updates`, `faqs`
- `subprocessors` (with optional `subprocessorsLink`)
- `contacts`

Delete a section to hide its block entirely. Example snippet:

```yaml
theme: dark
layout:
  compliance: half
  policies: half
  documents: full
subprocessors:
  - name: AWS
    category: IT infrastructure
    location: United States
    logo: https://.../aws.svg
    description: Primary cloud provider.
```

## Deployment

1. Push this repo to your Git provider.
2. Deploy to Vercel, Fly, Render, or any Next.js-compatible host.
3. Configure env vars on the platform (NEXTAUTH_URL, SUPABASE_URL, keys, etc.).
4. Ensure Supabase tables exist and row-level security allows your service-role key.

## Roadmap / Ideas

- Webhook integrations (Slack/email) for new document requests.
- Versioned YAML history + diff view.
- Multiple trust centers / multi-tenant mode.
- Automated compliance evidence importers.

## License

MIT. Build your trust center, own the infra, and share the YAML freely. Contributions welcome!
