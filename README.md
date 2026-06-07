# webapp-template

A production-ready Next.js web app shell with:
- Top bar + collapsible sidebar navigation
- Google OAuth login via Supabase
- Role-based access control (admin / manager / viewer)
- Light/dark theme
- Dashboard with placeholder tabs
- User management page
- Activity/logs page
- Settings page

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS v4 |
| Auth | Supabase Auth + Google OAuth |
| Database | Supabase (PostgreSQL + RLS) |

## Setup

### 1. Clone and install

```bash
git clone https://github.com/faiyazpilot/webapp-template.git
cd webapp-template
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Enable Google OAuth in Authentication → Providers
3. Copy your project URL and anon key

```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Run the database schema

Open the Supabase SQL Editor and run `supabase-schema.sql`.

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth callback URL

In Supabase → Authentication → URL Configuration, add:

```
http://localhost:3000/auth/callback        # dev
https://your-domain.com/auth/callback     # prod
```

## Customizing

| What | Where |
|---|---|
| App name / logo | `src/components/AppShell.tsx`, `src/app/login/page.tsx` |
| Sidebar nav items | `src/components/AppShell.tsx` — `navItems` and `adminNavItems` arrays |
| Dashboard tabs | `src/app/dashboard/page.tsx` — `TABS` array |
| Theme colors | `src/app/globals.css` — CSS variables |
| DB table name | `src/context/AppContext.tsx` — `app_roles` references |

## Role system

New users get `viewer` role automatically on first login. Promote them to `admin` or `manager` directly in Supabase.
