# BLUEPRINT — Build and Ship Your App

> **Who this is for:** non-developers using AI tools (Claude Code, Cursor, v0) to turn an idea into a live web app.
> Read top to bottom. Do one phase at a time. Everything is in order.

---

## What's already built — don't rebuild it

This template ships with a complete foundation. Before you write a single line of code, you already have:

| Done for you | What it means |
|---|---|
| Google sign-in | Users log in with Google. You never store or touch passwords. |
| Three roles (admin / manager / viewer) | Enforced by the database — not just hidden buttons. |
| Auto role assignment | Every new sign-in becomes a viewer automatically, even if someone calls your API directly. |
| User management page | Admins promote or demote anyone from a web UI. |
| Navigation shell | Top bar + collapsible sidebar. Add your pages to it. |
| Light / dark mode | Follows the system setting, with a manual toggle. |
| Security headers + CSP | Standard browser protections enabled out of the box. |
| CI pipeline | Lint, type-check, tests, and build run on every code push — automatically. |
| Open-redirect protection | Login can only ever send users to a page inside your own app. |

**You build:** your pages, your data tables, your business logic. Everything else is done.

---

## The mental model — three layers

Understanding this saves you hours of confusion later.

```
┌─────────────────────────────────────────────────┐
│  Layer 3: YOUR IDEA                             │
│  The pages, forms, and logic unique to you.     │
│  Nothing here yet — this is entirely yours.     │
├─────────────────────────────────────────────────┤
│  Layer 2: THE APP (Next.js)                     │
│  Web pages users see and interact with.         │
│  Already built: login, nav, user management.    │
│  You add: pages for your idea.                  │
├─────────────────────────────────────────────────┤
│  Layer 1: THE DATABASE (Supabase / Postgres)    │
│  Where all data lives.                          │
│  Already set up: login, roles, security rules.  │
│  You add: tables for your own data.             │
└─────────────────────────────────────────────────┘
```

When you ask an AI to build something, it touches Layer 1, Layer 2, or both. Every prompt in this blueprint tells the AI exactly which layers to touch and how.

---

## What is a terminal and how do I open one?

The terminal is a text window where you type commands. You'll use it to start your app and push code to GitHub. It sounds intimidating — it's not. You'll mostly copy and paste.

**Mac:** Press `Cmd + Space` → type `Terminal` → press Enter.
**Windows:** Press `Win + R` → type `cmd` → press Enter.

When this guide shows a command in a grey box:
```bash
npm install
```
Paste it into your terminal and press Enter. Wait for it to finish before running the next one. If you see errors in red, paste the error text into Claude and ask what to do.

---

## Before you start — accounts you need

All free. No credit card required for any of these.

| Account | Why | Sign up at |
|---|---|---|
| Google account | Sign in to your app + set up OAuth | Already have one |
| GitHub account | Store your code | github.com |
| Supabase account | Your database and user auth | supabase.com |
| Vercel account | Host your app on a real URL | vercel.com |

You also need **Node.js 20 or newer** installed on your computer. Check: open your terminal and type `node -v`. If you see a number like `v20.x.x` or higher, you're good. If not — or if the command isn't found — go to [nodejs.org](https://nodejs.org), click the **LTS** button, download and install it.

---

## Phase 0 — Get the code onto your computer

**Time: 5 minutes**

1. Go to the [webapp-template GitHub repo](https://github.com/faiyazpilot/webapp-template). Click the green **Use this template** button → **Create a new repository**.
   - Name: your app name, lowercase, hyphens instead of spaces (e.g. `my-sales-tool`)
   - Visibility: **Private** (recommended — your code stays private)
   - Click **Create repository**

2. On your new repo page, click the green **Code** button → copy the URL that appears.

3. In your terminal, run:
   ```bash
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   npm install
   cp .env.example .env.local
   ```

   - `git clone` downloads your code
   - `npm install` downloads the packages the app needs (takes 1–2 minutes)
   - `cp .env.example .env.local` creates your local config file (this file holds your secret keys and never gets uploaded to GitHub)

**What done looks like:** no red errors in the terminal. A new folder exists on your computer with the project files inside.

---

## Phase 1 — Connect to Supabase

**Time: 10 minutes**

Supabase is your database and auth provider. Think of it as the back-office system your app talks to.

### 1.1 Create a project

1. Go to [supabase.com](https://supabase.com) → sign in → **New project**
2. Name it the same as your app. Set a database password (save it — you won't see it again, but you won't need it again either). Pick a region near you. Click **Create new project**.
3. Wait ~2 minutes while it provisions.

### 1.2 Copy your keys into your config file

1. Supabase → **Project Settings** (gear icon, bottom left) → **API**
2. Copy two values:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon / publishable key** — the long string that starts with `eyJ...`
3. Open `.env.local` in a text editor (TextEdit on Mac, Notepad on Windows) and fill in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-key-here
   NEXT_PUBLIC_APP_NAME=Your App Name
   ```

### 1.3 Run the database schema

1. Supabase → **SQL Editor** (left nav) → **New query**
2. Open `supabase-schema.sql` from your project folder. Copy **all** of it. Paste it into the SQL editor. Click **Run**.
3. You should see: **"Success. No rows returned."**

### 1.4 Add your local redirect URL

1. Supabase → **Authentication** → **URL Configuration** → **Redirect URLs** → click Add
2. Add: `http://localhost:3000/auth/callback`

**What done looks like:** the `app_roles` table appears in Supabase → **Table Editor**.

---

## Phase 2 — Set up Google login

**Time: 15 minutes. Go slowly. This is the fiddliest part.**

### 2.1 Create a Google Cloud project

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Top-left project dropdown → **New Project** → give it a name → **Create**

### 2.2 Configure the OAuth consent screen

1. In the left nav, find **OAuth consent screen** (some dashboards call it **Google Auth Platform**)
2. Audience: **External** → click **Get started** (or **Create**)
3. Fill in: App name, User support email (your email), Developer contact email (your email)
4. Leave everything else at defaults and save

### 2.3 Create credentials

1. Left nav → **Credentials** → **Create credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Under **Authorized JavaScript origins**, click **Add URI** and enter:
   ```
   https://YOUR-PROJECT-REF.supabase.co
   ```
   *(Your project ref is the subdomain of your Supabase URL — e.g. if your URL is `https://abcdefgh.supabase.co`, the ref is `abcdefgh`)*
4. Under **Authorized redirect URIs**, click **Add URI** and enter:
   ```
   https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback
   ```

   > **Critical:** this is Supabase's callback URL — not your app's URL. Putting your app's URL here is the #1 cause of login errors. Google hands the user to Supabase first; Supabase then hands them to your app.

5. Click **Create** → copy the **Client ID** and **Client secret**

### 2.4 Connect Google to Supabase

1. Supabase → **Authentication** → **Sign In / Providers** → **Google**
2. Toggle it **on**
3. Paste the **Client ID** and **Client secret**
4. Click **Save**

**What done looks like:** when you run the app (next phase), the "Continue with Google" button works.

---

## Phase 3 — Run it locally

**Time: 2 minutes**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Click **Continue with Google** and sign in with your Google account. You'll land on the dashboard as a **viewer**.

**What done looks like:** you're logged in. Your name or photo appears in the top bar.

---

## Phase 4 — Brand it

**Time: 20–30 minutes**

### App name

Already done in Phase 1 — you set `NEXT_PUBLIC_APP_NAME` in `.env.local`. That name appears in the top bar, login page, and browser tab.

### Colors

Open `src/app/globals.css`. The color palette is at the top. Change any value and the whole app updates instantly while `npm run dev` is running.

```css
:root {
  --accent: #3b82f6;        /* brand color — buttons, links, highlights */
  --accent-hover: #2563eb;  /* slightly darker, used on hover */
  --sidebar-bg: #1e293b;    /* sidebar background */
  --bg-primary: #ffffff;    /* main page background */
  --text-primary: #1e293b;  /* main text */
}
```

To find your brand's hex color: Google `[your brand name] brand color hex`, or use [coolors.co](https://coolors.co) to pick one interactively.

There's a matching `[data-theme="dark"]` block directly below — update the same variables there for the dark mode palette.

### Logo

The template currently shows a colored square with your app's first letter. Two files need updating:

**1. Top bar (`src/components/AppShell.tsx`)** — find this block (around line 77):
```tsx
{/* Placeholder logo */}
<div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
  {APP_NAME.charAt(0).toUpperCase()}
</div>
```
Replace it with:
```tsx
<img src="/logo.png" alt={APP_NAME} className="h-7 w-7 object-contain" />
```

**2. Login page (`src/app/login/page.tsx`)** — find this block (around line 52):
```tsx
{/* Placeholder logo */}
<div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
  <span className="text-white font-bold text-2xl">{APP_NAME.charAt(0).toUpperCase()}</span>
</div>
```
Replace it with:
```tsx
<img src="/logo.png" alt={APP_NAME} className="w-16 h-16 object-contain mx-auto mb-4" />
```

Then put your logo file at `public/logo.png`.

**Or — let AI do it:** paste this into Claude:
```
In src/components/AppShell.tsx and src/app/login/page.tsx, replace the placeholder logo blocks
(marked with {/* Placeholder logo */} comments) with an <img> tag pointing to /logo.png.
Keep the same sizing classes. Don't touch anything else.
```

### Font

The default font is Geist (clean, modern). To change it:

1. Go to [fonts.google.com](https://fonts.google.com), pick a font, click **Get font → Get embed code → Next.js**. Google will give you import code.
2. Paste this prompt into Claude:
   ```
   Change the font in src/app/layout.tsx from Geist to [font name from Google Fonts].
   Here is the import code Google gave me: [paste it here].
   Update the CSS variable --font-sans in globals.css to match.
   ```

### Favicon (browser tab icon)

1. Create a 512×512 PNG of your logo or icon
2. Go to [favicon.io](https://favicon.io/favicon-converter/) → upload your PNG → download the generated files
3. Replace `public/favicon.ico` with the downloaded `favicon.ico`

### Social card (the image that appears when you share your URL on Slack, LinkedIn, etc.)

1. Design a 1200×630 image in [Canva](https://canva.com) — search for "Open Graph" template
2. Download as PNG and save it to `public/og.png` (replace the existing file)

---

## Phase 5 — Build your idea with AI

This is where the template becomes your product. The pattern is always the same:

1. Tell the AI what feature you want
2. Tell it what data it needs
3. Tell it who can see it (admin / manager / viewer / all logged-in users)
4. Let it write the code

### The master context prompt — paste this first, every session

Before asking Claude or Cursor to build anything new, paste this at the start of your conversation:

```
I'm building [describe your app in one sentence] on the webapp-template.

Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Supabase (auth + PostgreSQL with RLS), Vitest.

Key files:
- src/middleware.ts — auth gate. Do not touch this.
- src/app/auth/callback/route.ts — OAuth callback. Do not touch this.
- src/lib/supabase.ts — browser Supabase client factory
- src/context/AppContext.tsx — user + role state (user, userRole, loading)
- src/components/AppShell.tsx — nav shell. Add pages to navItems or adminNavItems arrays here.
- supabase-schema.sql — single source of truth for the database schema
- src/app/globals.css — all theme colors as CSS variables

Security rules (non-negotiable):
- Every new table must have RLS enabled + policies before any client code touches it
- Never put service_role key in any NEXT_PUBLIC_ variable
- Client-side role checks are cosmetic; RLS in Postgres is the real enforcement
- All role checks use is_admin() or is_admin_or_manager() helper functions already defined in the schema

Theming: use CSS variables (var(--text-primary), var(--accent), var(--bg-primary), etc.) with inline style props. Use Tailwind for layout only.
Icons: lucide-react only.

[DESCRIBE WHAT YOU WANT TO BUILD]
```

### Ready-to-use feature prompts

Copy the master context first, then add one of these:

---

**A list/table page (contacts, customers, deals, tasks, etc.):**
```
I want a [Contacts / Customers / Deals / Tasks] page.

Table name: [your_table_name]
Fields: [list them — e.g. name (text), email (text), company (text), status (active/inactive), notes (text), created_at (timestamp)]
Who can view: [all logged-in users / admin + manager only]
Who can create/edit/delete: [admin only / admin + manager]

Please:
1. Write the SQL for supabase-schema.sql — table + RLS policies
2. Create src/app/[page-name]/page.tsx with a data table, add/edit/delete actions
3. Add it to navItems (or adminNavItems if admin-only) in AppShell.tsx
```

---

**A dashboard with metric cards:**
```
I want the Dashboard page (src/app/dashboard/page.tsx) to show metric cards.

Metrics I want:
1. [Metric name] — count of rows in [table] where [condition]
2. [Metric name] — sum of [field] in [table]
3. [Add more as needed]

Show them as cards across the top, then the existing tab content below.
Pull the numbers server-side from Supabase. Use the existing CSS variable theming.
```

---

**A form to collect submissions:**
```
I want a form page where logged-in users can submit [describe what — e.g. support requests, expense reports, feedback].

Table name: [submissions / requests / etc.]
Form fields: [list them — e.g. subject (text), description (textarea), priority (low/medium/high), attachment_url (text, optional)]
Who can submit: all logged-in users
Who can view all submissions: admin + manager only
Users can only see their own submissions.

Please:
1. SQL for supabase-schema.sql — table + RLS policies (users see own rows; admin+manager see all)
2. Create src/app/[page-name]/page.tsx with the form + a list of the user's own past submissions
3. Add to navItems in AppShell.tsx
```

---

**A page only admins can see:**
```
I want an [Analytics / Reports / Config] page only admins can access.

[Describe what it shows or does]

Please:
1. Create src/app/[page-name]/page.tsx — check userRole === 'admin' at the top and return a "not authorized" message if not
2. Add it to adminNavItems in AppShell.tsx (so it only appears in the nav for admins)
```

---

**Add email notifications:**
```
When [trigger — e.g. a new form submission is created / a user's role changes], send an email to [who — e.g. the admin / the submitting user].

Use Supabase Edge Functions with the Resend email API.
My Resend API key will be in Supabase as a secret named RESEND_API_KEY.
The from address is: [your email]

Give me:
1. The Edge Function code (supabase/functions/[name]/index.ts)
2. The SQL trigger or webhook setup to call the function
3. Instructions on how to deploy the function and set the secret
```

---

**File uploads:**
```
I want users to be able to upload [describe what — e.g. profile photos / documents / receipts].

Storage bucket name: [bucket-name]
Who can upload: [all logged-in users / admin only]
Who can view files: [only the uploader / all logged-in users / admin only]

Please:
1. SQL to create the Supabase Storage bucket with the right RLS policies
2. A reusable upload component at src/components/FileUpload.tsx
3. Integration into [the page where it should appear]
```

---

## Phase 6 — Add your data to the database

Every time you add a new feature with data, you'll update `supabase-schema.sql`. This file is the single source of truth for your entire database.

**The workflow:**

1. AI writes the SQL and adds it to `supabase-schema.sql`
2. You open Supabase → **SQL Editor** → paste the new SQL → **Run**
3. The table appears in Supabase → **Table Editor**

**Never create tables manually in the Supabase UI** — always add them to `supabase-schema.sql` so the file stays accurate. When you re-run the full file on a fresh Supabase project, everything recreates correctly.

**RLS is required on every table.** If AI forgets to add it, paste this:
```
The table [table_name] is missing RLS. Add:
1. ALTER TABLE public.[table_name] ENABLE ROW LEVEL SECURITY;
2. Policies that match these rules: [describe who can read, write, update, delete]
Use the is_admin() and is_admin_or_manager() helper functions already defined in the schema.
```

---

## Phase 7 — Deploy to production

**Time: 15 minutes**

### 7.1 Push your code to GitHub

In your terminal:
```bash
git add .
git commit -m "initial version"
git push
```

If this is your first push, GitHub may ask you to set up authentication. Follow the prompts, or paste the error message into Claude.

### 7.2 Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New… → Project** → import your GitHub repo
2. Before clicking Deploy, open **Environment Variables** and add all three:
   - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
   - `NEXT_PUBLIC_APP_NAME` — your app name
3. Apply them to **all environments** (Production, Preview, Development)
4. Click **Deploy** — takes 2–3 minutes. You'll get a live URL like `https://your-app.vercel.app`.

### 7.3 Tell Supabase about your production URL

1. Supabase → **Authentication → URL Configuration**:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: add `https://your-app.vercel.app/auth/callback`

### 7.4 Make yourself admin

New sign-ins (including yours) start as `viewer`. Promote yourself:

1. Supabase → **Table Editor → app_roles** → find your row → change `role` to `admin` → **Save**
2. Refresh your app — the **Users** page appears in the nav

**What done looks like:** your app is live at a real URL, Google login works, and you can see the Users management page.

---

## Phase 8 — Invite your team

New users sign in with their Google account and automatically get the `viewer` role. You then promote them from the Users page in your app.

**If login is blocked with "App not verified" or "Access blocked":**

Your Google OAuth consent screen is in Testing mode. Fix it one of two ways:
- **Small team:** Google Cloud → OAuth consent screen → **Test users** → add each person's Gmail address
- **Public / larger team:** Google Cloud → OAuth consent screen → **Publish app** (Google may ask you to verify your domain)

---

## Free tier limits — know before you hit them

| Service | Free limit | What happens if you exceed it |
|---|---|---|
| Supabase | 2 active projects, 500 MB database, 5 GB bandwidth/month | Project pauses after 1 week of inactivity; paid plan ~$25/month |
| Vercel | 100 GB bandwidth/month, 6,000 build minutes/month | They email you; rarely an issue for early-stage apps |
| Google OAuth | Unlimited | No limit for standard login |

**Practical advice:** one Supabase project per product. Don't create test projects and leave them running — they count against your 2-project limit.

---

## Troubleshooting with AI

If something breaks, paste this into Claude with the error message:

```
I'm building on webapp-template (Next.js 16, Supabase, Tailwind CSS v4).
Here is the error I'm seeing: [paste the full error message or screenshot description]
Here is what I was trying to do: [describe the action]
Here is the relevant file if applicable: [paste the file content]
What is wrong and how do I fix it?
```

Common issues and where they live:

| Symptom | Where to look |
|---|---|
| Login fails with `redirect_uri_mismatch` | Google Credentials → the redirect URI must be Supabase's, not your app's |
| Bounced back to login after Google consent | Supabase → Authentication → URL Configuration → Redirect URLs — add your callback URL |
| App works locally but not on Vercel | Vercel → Project → Settings → Environment Variables — check all three are set, then redeploy |
| "not set up yet" error | Re-run `supabase-schema.sql` in the SQL Editor |
| Changed an env var and nothing changed | Environment variables are baked in at build time — redeploy on Vercel after any change |
| Users page is empty | You're a viewer — promote yourself to admin (Phase 7.4) |

---

## How to add common things — quick reference

### Add a new page

1. Create `src/app/your-page-name/page.tsx`
2. Add it to `navItems` (or `adminNavItems`) in `src/components/AppShell.tsx`
3. The middleware automatically protects it — no extra auth code needed

Prompt for Claude:
```
Add a new page called [Page Name] at src/app/[page-name]/page.tsx.
It should [describe what it shows or does].
Add it to [navItems / adminNavItems] in AppShell.tsx.
Use the existing CSS variable theming. Use lucide-react for any icons.
```

### Add a new database table

Always add it to `supabase-schema.sql`, then run it in Supabase SQL Editor.

Prompt for Claude:
```
Add a new table called [table_name] to supabase-schema.sql.
Fields: [list them with types]
RLS rules: [describe who can read/write/update/delete]
Use is_admin() and is_admin_or_manager() helpers already in the file.
Pattern the policies after the existing app_roles policies.
```

### Change who can see a page

In the page component, check `userRole` from `useApp()`:
```tsx
const { userRole } = useApp()
if (userRole !== 'admin') return <p>Not authorized.</p>
```

Or ask Claude:
```
In src/app/[page-name]/page.tsx, add a check that only shows the page content
to [admin / admin and manager / viewer and above] users.
For other roles, show a simple "You don't have permission to view this page" message.
Use userRole from the useApp() context hook.
```

---

## What this template does not cover yet

This is an open-source project maintained with limited resources. The sections below are honest about what's missing so you know where to expect friction — and where contributions are welcome.

---

### 1. Connecting to external services (Stripe, HubSpot, email APIs, AI APIs)

**The gap:** the template has no example of calling a third-party API. There are no Next.js API routes (`/api/` directory) at all.

**Why it matters:** any external API call that requires a secret key — payment processors, CRM integrations, email providers, AI models — must happen server-side. If you call those APIs directly from a client component, your secret key gets exposed in the browser. This is a critical security mistake and it's easy to make by accident.

**What to do now:** use this prompt with Claude when you need to integrate an external service:
```
I'm building on webapp-template (Next.js 16 App Router, TypeScript).
I need to call [service name] API to [describe what you want to do].
The API key must stay server-side — never exposed to the browser.

Please:
1. Create a Next.js API route at src/app/api/[route-name]/route.ts that calls the external API
2. Show me how to call that route from my client component using fetch()
3. Store the API key as [KEY_NAME] in .env.local — tell me what to add
4. Tell me what to add to Vercel's environment variables before deploying
```

**Status:** a worked example (e.g. sending email via Resend) is on the roadmap. Until then, the prompt above is the reliable path.

---

### 2. Querying your own data — the pattern and a known trap

**The gap:** the template has no written guide on how to read and write data. The pattern exists in the code but is never explained.

**The short version:**
- Use `src/lib/supabase.ts` (browser client) in any component with `'use client'` at the top
- Use `src/lib/supabase-server.ts` (server client) in server components and API routes
- Never import the server client into a client component — it will error

**The known trap — RLS silent failures:** when a write is blocked by a database security rule (RLS), Supabase returns an empty array instead of an error. If you check only for `error`, you'll think the write succeeded when it was silently rejected. Always chain `.select()` after an update or insert and check that `data.length > 0`:

```ts
// WRONG — misses silent RLS rejection
const { error } = await supabase.from('my_table').update({ field: value }).eq('id', id)
if (error) handleError()  // ← passes even when RLS blocked it

// CORRECT
const { data, error } = await supabase.from('my_table').update({ field: value }).eq('id', id).select('id')
if (error || !data?.length) handleError()  // ← catches both real errors and silent RLS blocks
```

**Status:** a full data-querying guide is on the roadmap. Until then, use the prompt below with Claude:
```
I'm building on webapp-template (Next.js 16 App Router, Supabase, TypeScript).
I want to [read / create / update / delete] data from the [table_name] table.
This is a ['use client' component / server component / API route].
Write the Supabase query. If it's a write, chain .select() so RLS failures surface correctly.
```

---

### 3. What's not here and likely won't be soon

| Missing | Why it's out of scope for now |
|---|---|
| Multi-factor authentication (MFA / TOTP) | Requires enroll + challenge flow; significant UI surface area. Tracked in Discussions. |
| Magic-link / passwordless email login | Supabase supports it — needs a login page variant and email template setup |
| GitHub / Microsoft OAuth | Same pattern as Google — the wiring just needs repeating per provider |
| Audit log (who changed what, when) | Needs a DB trigger + a wired-up Activity page |
| Real-time data (live-updating tables) | Supabase supports it via `channel()` subscriptions — no example exists yet |
| File storage | Supabase Storage is available — no example or UI yet |

Want to contribute one of these? Open a PR or start a [Discussion](https://github.com/faiyazpilot/webapp-template/discussions).

---

## Glossary — no jargon

| Term | Plain English |
|---|---|
| **Terminal** | A text window where you type commands to control your computer. |
| **npm install** | Downloads all the packages this app depends on. Run once when you first clone the repo. |
| **npm run dev** | Starts the app on your computer. Open `localhost:3000` in your browser to see it. |
| **.env.local** | A hidden file that holds your secret keys. Never share it. Never commit it to GitHub. |
| **git add / commit / push** | Save your changes locally (add + commit), then upload them to GitHub (push). |
| **Deploy** | Making your app accessible on the internet at a real URL. |
| **Supabase** | The service that hosts your database and handles login/auth. |
| **Vercel** | The service that hosts your web app and serves it to users. |
| **anon key** | Supabase's public key — safe to put in browser code. It's not a secret. |
| **service_role key** | Supabase's admin key that bypasses all security rules. Never put this in your app. |
| **RLS (Row Level Security)** | Database rules that control who can see or change each row. This is your real security layer. |
| **TypeScript** | The programming language this app is written in. Claude and Cursor understand it well. |
| **App Router** | The way Next.js organizes pages. Each folder in `src/app/` becomes a URL path. |
| **Middleware** | Code that runs before every page load. Used here to check if you're logged in. |
| **CSS variable** | A named color or value you define once and reuse everywhere. Changing it once updates the whole app. |
| **PR / pull request** | A way to propose code changes on GitHub before they go live. The CI checks run here. |
| **CI pipeline** | Automated checks (lint, type-check, tests, build) that run every time you push code. |
