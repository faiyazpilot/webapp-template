# Roadmap

This is an open-source project maintained with limited bandwidth. Everything here is a community invitation, not a commitment. No dates.

Want to pick something up? Open a PR or start a [Discussion](https://github.com/faiyazpilot/webapp-template/discussions). If an item doesn't have a GitHub Issue yet, feel free to create one and tag it `help wanted` or `good first issue`.

---

## Labels

| Label | Meaning |
|---|---|
| `easy` | Familiar with Next.js + Supabase — doable in under a day |
| `medium` | Needs solid understanding of the stack — 1 to 3 days |
| `hard` | Architectural work — 3+ days, touches auth or security core |
| `high` | Unblocks most users of this template |
| `medium` | Useful for a meaningful subset of use cases |
| `low` | Nice to have |

---

## Items

### Auth & Security

| Item | Difficulty | Impact | Notes |
|---|---|---|---|
| Magic-link / passwordless email login | `medium` | `high` | Needs a login page variant, Supabase email provider config, and email template. Alongside Google, not replacing it. |
| GitHub OAuth provider | `easy` | `medium` | Same wiring as Google — swap the provider in `login/page.tsx` and Supabase dashboard. Good first issue. |
| Microsoft OAuth provider | `easy` | `low` | Same pattern as GitHub. |
| MFA / TOTP (enroll + challenge flow) | `hard` | `medium` | Needs enroll page, challenge page, middleware check on `aal` assurance level, and Supabase MFA enabled in the dashboard. See `src/middleware.ts`. |

---

### Data & API

| Item | Difficulty | Impact | Notes |
|---|---|---|---|
| Worked example: server-side API route calling an external service | `easy` | `high` | The template has zero `/api/` routes. A minimal Resend email example would fill the biggest gap for builders connecting third-party services. See [BLUEPRINT.md § Connecting to external services](BLUEPRINT.md#1-connecting-to-external-services-stripe-hubspot-email-apis-ai-apis). |
| Data-querying guide (two Supabase clients + RLS silent-failure fix) | `easy` | `high` | Docs only — no code to write. Cover when to use `supabase.ts` vs `supabase-server.ts` and the empty-array RLS gotcha. See [BLUEPRINT.md § Querying your own data](BLUEPRINT.md#2-querying-your-own-data--the-pattern-and-a-known-trap). |
| File upload example (Supabase Storage) | `easy` | `medium` | A reusable `FileUpload` component + Storage bucket SQL with RLS. No UI exists yet. |

---

### Features

| Item | Difficulty | Impact | Notes |
|---|---|---|---|
| Audit log wired to Activity page | `medium` | `medium` | DB trigger on `app_roles` (and optionally any user table) writing to an `audit_log` table, then rendering in `src/app/activity/page.tsx`. Currently the Activity page is a placeholder. |
| Real-time data (Supabase channel subscriptions) | `medium` | `medium` | A worked example of `supabase.channel()` keeping a table or counter live without a page refresh. |
| Dashboard metric cards pulling real data | `easy` | `medium` | Replace the placeholder tabs in `src/app/dashboard/page.tsx` with cards that query an actual table. Requires a sample table in `supabase-schema.sql`. |

---

### Developer Experience

| Item | Difficulty | Impact | Notes |
|---|---|---|---|
| Convert ROADMAP items to GitHub Issues | `easy` | `low` | Create a GitHub Issue for each item above tagged `help wanted` or `good first issue` so they surface in GitHub's contributor discovery. |
| End-to-end test setup (Playwright) | `medium` | `medium` | Basic smoke tests for login flow and role-based access. Vitest handles unit tests; E2E is uncovered. |
