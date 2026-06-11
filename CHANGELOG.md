# Changelog

All notable changes to this project will be documented here.

## [Unreleased]

### Added
- `CODE_OF_CONDUCT.md` — Contributor Covenant v2.1
- `SUPPORT.md` — where to get help (README, Discussions, Issues, Security)
- `.github/CODEOWNERS` — default reviewer for all changes
- `.github/ISSUE_TEMPLATE/config.yml` — issue routing to Discussions and SECURITY.md
- Public `CLAUDE.md` — AI assistant context for building on the template
- `.gitignore` entry for `CLAUDE.local.md` (personal AI-assistant config)
- `CONTRIBUTING.md` — pre-PR checklist, protected-main note, schema-change rules
- `SECURITY.md` — scope section and reporter credit policy

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
