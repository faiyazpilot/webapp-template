# CLAUDE.md — AI assistant context

This file teaches AI coding tools (Claude Code, Cursor, etc.) about this project — keep it updated as you build.

## What this is

A secure Next.js + Supabase **app-shell template**: auth, roles, navigation, and
theming are done so you can build your actual idea on top. It's a template, not
a framework — simplicity beats cleverness.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** — CSS-variable theming in `src/app/globals.css`, no tailwind config file
- **Supabase** (`@supabase/ssr`) — Auth + PostgreSQL with row-level security
- **Vitest** for tests

## File map

| File | What it does |
|---|---|
| `src/middleware.ts` | Auth gate for every route except `/login` and `/auth/*` |
| `src/app/auth/callback/route.ts` | OAuth code exchange |
| `src/lib/supabase.ts` | Browser client factory |
| `src/context/AppContext.tsx` | User + role state |
| `src/components/AppShell.tsx` | Nav (`navItems` / `adminNavItems` arrays) |
| `supabase-schema.sql` | Single source of truth for the database |

## How to add a page

1. Create `src/app/<name>/page.tsx` (`'use client'` if interactive)
2. Add it to `navItems` or `adminNavItems` in `src/components/AppShell.tsx`
3. Done — the middleware protects it automatically

## Security rules (non-negotiable)

- Every new table gets `enable row level security` + policies **before** any client code touches it
- Never put the `service_role` key in any `NEXT_PUBLIC_*` variable
- Client-side role checks are UX only — RLS in Postgres is the real enforcement
- Do not widen the CSP in `next.config.ts` without a concrete reason

## Conventions

- Theme colors via CSS variables (`var(--text-primary)` etc.) with inline `style`; Tailwind for layout
- Icons from `lucide-react`
- Descriptive names over clever ones
- No new dependencies without strong justification

## Do not touch

- The inline theme script in `src/app/layout.tsx` — it prevents dark-mode flash; the `dangerouslySetInnerHTML` is intentional
- The middleware `matcher` in `src/middleware.ts`
- `.env.local` stays gitignored — never commit it

## Workflow

- Changes go to `main` via PR
- CI runs lint, tsc, vitest, and build — all must pass
- Run `npm test` before pushing
