# GitHub, Vercel & Supabase — setup guide

Use this to run **locally**, ship **Vercel Preview** URLs tonight, and keep room for a **production** stack later.

---

## 1. GitHub

1. Create a **new empty repository** on GitHub (no README/license if you’ll push existing history).
2. From the project root (`r1/`):

   ```bash
   git add -A
   git status   # confirm .env.local is NOT listed (it stays ignored)
   git commit -m "Initial R1 prototype"
   git branch -M main
   git remote add origin git@github.com:YOUR_ORG/YOUR_REPO.git
   git push -u origin main
   ```

3. **Branch workflow:** open PRs for features; Vercel can build **every PR** as a Preview deployment.

**Never commit:** `.env.local`, service role keys, or Shopify tokens. **Do commit:** `.env.local.example`.

---

## 2. Supabase — two-project layout (recommended)

| Project        | Purpose                                      | Used by                          |
|----------------|----------------------------------------------|----------------------------------|
| **Staging**    | Safe testing, previews, shared dev data      | Local (optional), **Vercel Preview** |
| **Production** | Real users                                   | **Vercel Production** (`main`)    |

**Tonight (minimal):** one Supabase project can back **both** local and Vercel Preview if you accept shared data. Add a **second** project when you want prod isolated.

### Per Supabase project

1. **SQL:** run migrations in order in the SQL Editor (or `supabase db push` if you use the CLI linked to that project):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_quiz_sessions_auth_user.sql`

2. **Auth → URL configuration**
   - **Site URL:**  
     - Staging: `http://localhost:3000` *or* your first Vercel preview URL (see below).  
     - Production: your real domain, e.g. `https://r1.example.com`
   - **Redirect URLs** (add all that apply):
     - `http://localhost:3000/auth/callback`
     - `https://YOUR_PROJECT.vercel.app/auth/callback` (first production deployment on Vercel)
     - `https://*.vercel.app/auth/callback` — **if** your Supabase plan supports wildcard redirect URLs (simplifies every Preview URL).

3. **API keys:** Dashboard → **Settings → API** — copy `URL`, `anon` `public`, and `service_role` (server-only).

---

## 3. Vercel

1. **Import** the GitHub repo: [vercel.com/new](https://vercel.com/new).
2. **Root directory:** repository root (where `package.json` lives).
3. **Framework:** Next.js (auto-detected).
4. **Environment variables** — add the same names as `.env.local.example`. Use **different values** for Preview vs Production when you have two Supabase projects.

### Suggested Vercel env scoping

| Variable | Development (local) | Preview | Production |
|----------|----------------------|---------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | staging URL | staging URL | **prod** URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | staging anon | staging anon | **prod** anon |
| `SUPABASE_SERVICE_ROLE_KEY` | staging service role | staging service role | **prod** service role |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | optional — see below | `https://your-domain.com` |
| Shopify + protocol vars | staging store / test variants | same as staging | prod store |

**Preview URL / magic links**

- The app uses **`getAppOrigin()`** (`lib/site-url.ts`): if `NEXT_PUBLIC_SITE_URL` is **unset** on Vercel, it uses **`https://${VERCEL_URL}`** automatically (good for Preview).
- You can still set **`NEXT_PUBLIC_SITE_URL`** in Production to your custom domain.
- **Supabase Redirect URLs** must include the callback URL for each environment (localhost + Vercel + production domain).

---

## 4. Local development

1. Copy env: `cp .env.local.example .env.local`
2. Point `.env.local` at **staging** Supabase (recommended) so local behavior matches Preview.
3. `npm install` then `npm run dev`

---

## 5. Checklist before “Preview works tonight”

- [ ] Migrations applied on the Supabase project used by Vercel Preview  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in Vercel (server-only)  
- [ ] Supabase **Redirect URLs** include your Vercel preview origin + `/auth/callback`  
- [ ] Shopify Storefront token valid for the store you’re using on Preview  
- [ ] Push to a branch → open PR → confirm **Vercel Preview** URL loads and quiz → results → shop paths work  

---

## 6. Optional: Supabase CLI

If you use the CLI (`supabase link` + `supabase db push`), keep **one link per machine** or use **explicit `--project-ref`** when pushing to staging vs production.

---

*Aligned with CLAUDE.md: Vercel hosting + preview deployments on PRs.*
