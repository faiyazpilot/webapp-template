# Changelog

All notable changes to this project will be documented here.

## [1.1.0] - 2026-06-11

### Security
- Hardened the database schema: roles can no longer be self-assigned through the API. Role reads and changes are now governed by a `SECURITY DEFINER` `is_admin()` helper (which also fixes a policy-recursion bug that broke repeat logins in 1.0.0).
- The auth callback now only redirects to same-site paths.

### Fixed
- Repeat logins no longer sign you out as "not authorized".
- Managers can now see the users list.

### Added
- The new-user `viewer` role is created by a database trigger (it was client-side in 1.0.0), so it holds even if the app is bypassed.
- Admin role-management UI on the Users page (change roles from a dropdown).
- `NEXT_PUBLIC_APP_NAME` to set the app name shown in the top bar, sidebar, login, and tab title.
- Open Graph / Twitter card metadata.
- Community files: `CODE_OF_CONDUCT.md`, `SUPPORT.md`, `.github/CODEOWNERS`.
- CI hardening: `npm ci`, dependency caching, and SHA-pinned actions; Dependabot auto-merge restricted to non-major updates.

### Changed
- Dependencies updated (Next.js, React, `@supabase/ssr`, TypeScript, lucide-react).

### Upgrade notes (from 1.0.0)
- Re-run `supabase-schema.sql` in the Supabase SQL Editor. It drops the old policies and recreates everything safely; your data is untouched.

## [1.0.0] - 2026-06-07

### Added
- Next.js 16 App Router scaffold with TypeScript
- Google OAuth login via Supabase Auth
- Role-based access control (admin / manager / viewer)
- Top bar + collapsible sidebar navigation (AppShell)
- Light/dark theme with system preference detection
- Dashboard with placeholder tab system
- User management page
- Activity/logs page
- Settings page
- Supabase PostgreSQL schema with RLS policies
- Middleware for auth-gated routes
