# webapp-template

A production-ready Next.js app shell you can clone and build on top of — today.

It handles the boring-but-hard stuff (auth, roles, navigation, dark mode) so you can skip straight to building your actual idea.

---

## What you get out of the box

- **Google OAuth login** — users sign in with Google, no passwords to manage
- **Role-based access** — admin, manager, and viewer roles enforced at the database level
- **App shell** — top bar + collapsible sidebar, ready for your own pages
- **Light / dark mode** — auto-detects system preference, user can override
- **Dashboard** — tab-based layout with placeholder content to replace
- **User management page** — see and manage your users
- **Activity / logs page** — placeholder for an audit trail
- **Settings page** — user preferences scaffold

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth + DB | Supabase |

---

## Get started in 5 steps

### 1. Clone and install

```bash
git clone https://github.com/faiyazpilot/webapp-template.git
cd webapp-template
npm install
```

### 2. Create a Supabase project

Go to [supabase.com](https://supabase.com), create a free project, then:

- Go to **Authentication → Providers** and enable Google
- Get your **Project URL** and **anon key** from Project Settings → API

### 3. Add your environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run the database schema

In Supabase → SQL Editor, paste and run the contents of `supabase-schema.sql`.

This creates the `app_roles` table and sets up row-level security.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the login page.

---

## Auth callback URL

In Supabase → Authentication → URL Configuration, add:

```
http://localhost:3000/auth/callback        # dev
https://your-domain.com/auth/callback     # prod
```

---

## Customizing

| What to change | Where |
|---|---|
| App name / logo | `src/components/AppShell.tsx`, `src/app/login/page.tsx` |
| Sidebar nav items | `src/components/AppShell.tsx` — `navItems` and `adminNavItems` arrays |
| Dashboard tabs | `src/app/dashboard/page.tsx` — `TABS` array |
| Theme colors | `src/app/globals.css` — CSS variables |
| Page title / metadata | `src/app/layout.tsx` — `metadata` object |

---

## Role system

New users get the `viewer` role automatically on first login.

To promote someone to `admin` or `manager`, go to your Supabase project → Table Editor → `app_roles` and update their row.

Roles are enforced at the database level via RLS — not just in the UI.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — free to use, modify, and build on.
