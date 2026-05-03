# Contributing

Thanks for taking a look. PRs are welcome.

## Where to file issues and PRs

This fork only — file issues and pull requests at [hilljw/trust-center-static](https://github.com/hilljw/trust-center-static/issues).

For bugs in the public render path (rendering, schema, theming) that also affect upstream, please consider also filing them at [kodustech/trust-center](https://github.com/kodustech/trust-center/issues) so the original project benefits.

## Local setup

```bash
yarn install
yarn dev
# open http://localhost:3000
```

## Before opening a PR

```bash
yarn build   # confirm the static export still succeeds
yarn lint    # zero warnings expected
```

If you're adding fields to the schema, update both [`src/lib/trust-config.ts`](src/lib/trust-config.ts) and [`docs/trust-center-schema.md`](docs/trust-center-schema.md), and add the new field to [`data/trust.yaml`](data/trust.yaml) so the example renders it.

## Scope

Out of scope for this fork: Supabase, NextAuth, an admin UI, or anything that requires a server runtime. If you want those, use [upstream](https://github.com/kodustech/trust-center) instead — the goal here is "static site, one YAML file, deploy anywhere."
