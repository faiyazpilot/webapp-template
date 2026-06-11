# Contributing

Thanks for your interest in improving this template.

## How to contribute

1. **Fork** the repo and create a branch from `main`
2. Make your changes
3. Open a **Pull Request** — describe what you changed and why
4. A maintainer will review and merge

## What makes a good contribution

- Bug fixes with a clear description of the problem
- Improvements to the setup docs or README
- New reusable components that fit the template's scope (auth, nav, RBAC, theme)
- Keep it simple — this is a starter template, not a full app framework

## What to avoid

- App-specific features (analytics integrations, payment flows, etc.) — those belong in your own project
- Breaking changes to the auth or RBAC layer without discussion first

## Before you open a PR

Run all four checks locally — CI runs the same ones:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

Note: `main` is protected — all changes go in via a Pull Request with green CI.

## Schema changes

Schema changes must keep `supabase-schema.sql` safe to re-run, and must include
RLS policies for any new table.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your Supabase keys
npm run dev
```

## Questions?

Not sure where to ask? See [SUPPORT.md](SUPPORT.md) for where each kind of
question belongs. And please follow our [Code of Conduct](CODE_OF_CONDUCT.md)
in all project spaces.
