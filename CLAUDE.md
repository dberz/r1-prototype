# R1 — Project Context for Claude / Cursor

This file is the authoritative context for all AI-assisted development on this project.
Read it before writing any code. Follow these rules exactly.

---

## What we're building

**R1** is a premium regenerative skincare experience for women 35+, built by Dr. Robin Berzin MD.

The product is a **quiz-driven, personalized skincare protocol** built on top of either:
- **Path A (Environ):** R1 recommends Environ products (resold under Robin's MD license). A brief human consultation is required before purchase.
- **Path B (Own Brand):** R1 sells its own branded skincare formulas. Direct quiz → buy flow, no consultation required.

Both paths use the **same codebase**. A feature flag (`NEXT_PUBLIC_PRODUCT_PATH`) controls which variant is active.

The core thesis: **the quiz drives conversion**. The quiz is the product. Everything else supports it.

---

## Tech stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14+ (App Router) | Use server components by default |
| Hosting | Vercel | Use edge functions where appropriate |
| Styling | Tailwind CSS | No CSS-in-JS |
| Commerce | Shopify Storefront API (headless) | Native Shopify checkout |
| Database / Auth | Supabase | Postgres + RLS + Auth + Storage |
| Email | Klaviyo | Commerce lifecycle only |
| Transactional email | Resend | Order confirms, consult status |
| Analytics | PostHog + GA4 | PostHog for product funnel; GA4 for acquisition |
| AI | OpenAI API (GPT-4o) | Server-side only; no client-side AI calls |
| Deployment | Vercel | Preview deployments on every PR |

**Never use:**
- Client-side OpenAI API calls (always proxy through server actions or API routes)
- CSS modules or styled-components (use Tailwind only)
- `pages/` router (use App Router only)
- Any third-party state management library — React state + Supabase is sufficient for MVP

---

## Repository structure

```
/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public marketing pages
│   │   ├── page.tsx              # Homepage
│   │   ├── how-it-works/
│   │   └── science/
│   ├── quiz/                     # Quiz flow
│   │   ├── page.tsx              # Quiz entry
│   │   └── [step]/
│   ├── results/
│   │   └── [sessionId]/          # Protocol reveal page
│   ├── consult/                  # Environ path: consultation status page
│   ├── shop/                     # Product catalog
│   │   └── [handle]/
│   ├── account/                  # Authenticated dashboard
│   │   ├── page.tsx
│   │   ├── protocol/
│   │   ├── routine/
│   │   └── support/
│   ├── future-estrogen/          # Waitlist capture page (teaser only)
│   ├── admin/                    # Internal admin (protected by Supabase RLS)
│   │   ├── consultations/        # Consultant review queue
│   │   └── protocols/
│   └── api/                      # API routes
│       ├── quiz/
│       ├── recommendations/
│       ├── consultations/
│       └── ai/
├── components/
│   ├── quiz/                     # Quiz UI components
│   ├── protocol/                 # Protocol reveal components
│   ├── product/                  # Product cards, bundles
│   ├── dashboard/                # Account dashboard components
│   ├── admin/                    # Admin UI components
│   └── ui/                       # Shared primitives (buttons, inputs, etc.)
├── lib/
│   ├── supabase/                 # Supabase client (server + client)
│   ├── shopify/                  # Storefront API client
│   ├── openai/                   # OpenAI client (server only)
│   ├── klaviyo/                  # Klaviyo API client
│   └── analytics/                # PostHog + GA4 event helpers
├── features/
│   ├── quiz/                     # Quiz logic, state, types
│   ├── recommendations/          # Recommendation engine (rules-based)
│   ├── consultations/            # Consultation workflow
│   └── protocols/                # Protocol generation and display
├── types/                        # Shared TypeScript types
├── content/                      # Static content, quiz copy, FAQ
└── supabase/
    ├── migrations/               # SQL migration files
    └── seed/                     # Seed data for dev
```

---

## Feature flags

Control which product path is active:

```env
# In .env.local
NEXT_PUBLIC_PRODUCT_PATH=environ        # or: own-brand
NEXT_PUBLIC_CONSULT_ENABLED=true        # show consultation flow
NEXT_PUBLIC_AI_COMPANION_ENABLED=false  # toggle AI chat widget
NEXT_PUBLIC_ESTROGEN_TEASER_ENABLED=true # show /future-estrogen teaser
NEXT_PUBLIC_DASHBOARD_ENABLED=false     # toggle post-purchase dashboard
```

Use these flags liberally. The dual prototype is one codebase with two configurable surfaces.

---

## Data model — key tables

### `users`
```sql
id uuid primary key
email text unique not null
shopify_customer_id text
created_at timestamptz default now()
marketing_opt_in boolean default false
account_status text default 'active'
last_login_at timestamptz
```

### `profiles`
```sql
id uuid primary key references users(id)
age_band text           -- '35-39' | '40-44' | '45-49' | '50-54' | '55-60' | '60+'
hormone_stage text      -- 'premenopausal' | 'perimenopausal' | 'postmenopausal'
hrt_status text         -- 'none' | 'on_hrt' | 'considering' | 'past'
skin_sensitivity text   -- 'low' | 'medium' | 'high'
skin_type text          -- 'dry' | 'oily' | 'combination' | 'normal'
skin_oiliness text      -- 'dry' | 'balanced' | 'oily'
vitamin_a_experience text  -- 'none' | 'otc_retinol_weak' | 'otc_retinol_strong' | 'rx_retinoid'
primary_concerns text[] -- array: 'fine_lines' | 'texture' | 'firmness' | 'pigmentation' | 'breakouts' | 'sensitivity'
primary_goals text[]
pregnancy_status text   -- 'not_applicable' | 'pregnant' | 'nursing' | 'trying'
sun_exposure text       -- 'low' | 'moderate' | 'high'
lifestyle_notes text
is_estrogen_future_candidate boolean default false
is_consult_recommended boolean default false
current_protocol_id uuid
updated_at timestamptz default now()
```

### `quiz_sessions`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references users(id)   -- nullable (anonymous)
started_at timestamptz default now()
completed_at timestamptz
traffic_source text
quiz_version text default 'v1'
completion_status text default 'in_progress'  -- 'in_progress' | 'completed' | 'abandoned'
abandoned_at_step int
```

### `quiz_answers`
```sql
id uuid primary key default gen_random_uuid()
quiz_session_id uuid references quiz_sessions(id) not null
question_key text not null
answer_value text not null
answer_label text
answered_at timestamptz default now()
```

### `consultations` (Path A — Environ)
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references users(id) not null
quiz_session_id uuid references quiz_sessions(id)
skin_photo_url text
status text default 'pending'  -- 'pending' | 'in_review' | 'completed' | 'cancelled'
requested_at timestamptz default now()
assigned_consultant_id uuid references consultants(id)
reviewed_at timestamptz
consultant_notes text
protocol_suggestion_id uuid
final_protocol_id uuid references protocols(id)
turnaround_hours numeric
```

### `protocols`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references users(id) not null
quiz_session_id uuid references quiz_sessions(id)
consultation_id uuid references consultations(id)  -- null for own-brand path
protocol_level text not null    -- 'L1' | 'L2' | 'L3'
age_track text not null         -- 'under_40' | 'over_40'
summary_title text
summary_copy text
education_track text
step_up_milestone_days int default 90
consult_flag boolean default false
estrogen_future_flag boolean default false
generated_at timestamptz default now()
confirmed_at timestamptz
confirmed_by_consultant_id uuid references consultants(id)
product_path text not null      -- 'environ' | 'own-brand'
```

### `protocol_products`
```sql
id uuid primary key default gen_random_uuid()
protocol_id uuid references protocols(id) not null
shopify_product_id text not null
shopify_variant_id text
role text not null   -- 'tool' | 'cleanser' | 'vitamin_a' | 'antioxidant' | 'lactic_acid'
recommended_order int
usage_instructions text
step_up_notes text
```

### `dashboard_tasks`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references users(id) not null
protocol_id uuid references protocols(id) not null
task_type text    -- 'how_to' | 'ingredient_education' | 'check_in' | 'inside_out' | 'step_up_teaser' | 'reorder'
day_offset int not null
title text not null
body text not null
cta_type text     -- 'link' | 'product' | 'ai_chat' | 'none'
cta_target text
status text default 'pending'  -- 'pending' | 'completed' | 'dismissed'
```

### `consultants`
```sql
id uuid primary key default gen_random_uuid()
name text not null
email text unique not null
is_active boolean default true
derma_concepts_trained boolean default false
created_at timestamptz default now()
```

---

## Recommendation engine

The recommendation engine is **deterministic and rule-based** — no machine learning. Rules live in the database, not in application code. The engine takes quiz answers and outputs a protocol suggestion.

### Location
`features/recommendations/engine.ts`

### Inputs (from quiz answers)
```typescript
type QuizInputs = {
  ageBand: string
  hormoneStage: string
  hrtStatus: string
  skinSensitivity: string
  skinType: string
  vitaminAExperience: string
  primaryConcerns: string[]
  primaryGoals: string[]
  pregnancyStatus: string
  sunExposure: string
  readyForStronger: boolean
  supportConfidence: string
}
```

### Outputs
```typescript
type ProtocolSuggestion = {
  protocolLevel: 'L1' | 'L2' | 'L3'
  ageTrack: 'under_40' | 'over_40'
  cautionFlags: string[]
  consultRequired: boolean
  estrogenFutureCandidate: boolean
  educationTrack: string
  stepUpMilestoneDays: number
  rationale: string   // human-readable explanation for consultant brief
}
```

### Core logic rules (v1)

```
IF pregnancyStatus IN ('pregnant', 'nursing', 'trying')
  → protocol modified (no vitamin A), consultRequired = true

IF vitaminAExperience == 'none' OR skinSensitivity == 'high'
  → protocolLevel = 'L1'

IF vitaminAExperience == 'otc_retinol_weak' AND skinSensitivity IN ('low', 'medium')
  → protocolLevel = 'L1' or 'L2' (based on readyForStronger)

IF vitaminAExperience == 'otc_retinol_strong' AND skinSensitivity == 'low'
  → protocolLevel = 'L2'

IF vitaminAExperience == 'rx_retinoid'
  → protocolLevel = 'L2' or 'L3' (based on sensitivity + readyForStronger)

IF ageBand IN ('40-44', '45-49', '50-54', '55-60', '60+')
  → ageTrack = 'over_40', estrogenFutureCandidate = true (if hormoneStage != 'premenopausal' or hrtStatus != 'none')

IF skinSensitivity == 'high' AND vitaminAExperience != 'none'
  → consultRequired = true (override any L2/L3 suggestion to L1)
```

---

## Shopify integration

Use the **Storefront API** only. Never use the Admin API on the client.

```typescript
// lib/shopify/client.ts
// Storefront API client using @shopify/storefront-api-client
// Endpoint: https://{store}.myshopify.com/api/2024-01/graphql.json
// Auth: Storefront access token (public, safe for client)
```

Key operations:
- `getProducts(collection)` — fetch product catalog
- `getProduct(handle)` — fetch single product with variants
- `createCart()` — create a new cart
- `addToCart(cartId, lines)` — add line items
- `getCheckoutUrl(cartId)` — get Shopify native checkout URL

For the **pre-built cart** (protocol delivery → buy), generate a cart with protocol products pre-added, then redirect to Shopify checkout. This is the primary conversion moment.

---

## Compliance rules — NEVER violate these

These exist to protect the clinical lane expansion. Violating them creates technical debt that is painful to unwind.

1. **No health/quiz data in Shopify.** Never write hormone stage, skin concerns, health flags, or protocol data to Shopify customer metafields.

2. **No PHI in Klaviyo.** Klaviyo events and properties must never include hormone stage, health conditions, pregnancy status, consultation notes, or estrogen eligibility flags. Segment by protocol level and product behavior only.

3. **No analytics pixels on clinical paths.** When/if the estrogen intake or provider review paths go live, strip GA4, PostHog, and any ad pixels from those pages.

4. **Skin photos never in the main app database.** Store in a dedicated Supabase storage bucket (`consultation-photos`) with explicit access controls. Never store URLs in Shopify or Klaviyo.

5. **AI never makes the final recommendation.** OpenAI calls summarize and explain; they do not replace the rule engine output or the consultant confirmation (Environ path).

6. **Server-side AI only.** All OpenAI API calls go through Next.js API routes or server actions. Never expose the OpenAI API key to the browser.

---

## Styling conventions

- Tailwind only — no inline styles, no CSS modules
- Mobile-first (quiz is primarily a mobile experience)
- Use `cn()` utility for conditional classes (install `clsx` + `tailwind-merge`)
- Typography: use a serif for headings (`font-serif`), sans for UI (`font-sans`) — font variables set in `layout.tsx`
- Color tokens defined in `tailwind.config.ts`:
  - `brand-ivory`, `brand-cream`, `brand-stone`, `brand-espresso`, `brand-bronze`
- Component pattern: server component by default, add `'use client'` only when needed (event handlers, browser APIs, useState)

---

## Analytics events — key events to fire

Every significant user action should fire a PostHog event. Use the helper in `lib/analytics/events.ts`.

```typescript
// Must-fire events:
track('quiz_started', { traffic_source, quiz_version })
track('quiz_question_answered', { question_key, answer_value, step })
track('quiz_completed', { quiz_session_id, completion_time_seconds })
track('protocol_generated', { protocol_level, age_track, consult_required })
track('skin_photo_submitted', {})                          // Environ path
track('consultation_confirmed', { turnaround_hours })      // Environ path
track('results_viewed', { protocol_level, product_path })
track('product_added_to_cart', { product_id, role, protocol_level })
track('checkout_started', { cart_value, item_count })
track('estrogen_waitlist_signup', {})
track('dashboard_activated', {})
track('step_up_reminder_sent', { current_level })
```

**Never include** health data, hormone stage, or names in PostHog event properties.

---

## Environment variables

```env
# Next.js public (safe for browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_GA4_MEASUREMENT_ID=
NEXT_PUBLIC_PRODUCT_PATH=own-brand
NEXT_PUBLIC_CONSULT_ENABLED=false
NEXT_PUBLIC_AI_COMPANION_ENABLED=false
NEXT_PUBLIC_ESTROGEN_TEASER_ENABLED=true
NEXT_PUBLIC_DASHBOARD_ENABLED=false

# Server only (never expose to browser)
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
KLAVIYO_API_KEY=
RESEND_API_KEY=
```

---

## Build phases — what to build in order

### Phase 1 (build now)
- [ ] Project scaffold (Next.js + Tailwind + Supabase + Shopify connected)
- [ ] Global layout, font system, color tokens
- [ ] Homepage (`/`)
- [ ] Quiz flow (`/quiz`, `/quiz/[step]`) — full 12-step intake
- [ ] Recommendation engine (rule-based, TypeScript)
- [ ] Results / protocol reveal page (`/results/[sessionId]`)
- [ ] Shopify staging store with mock product catalog
- [ ] Pre-built cart link generation
- [ ] Basic Supabase auth (email magic link)
- [ ] PostHog + GA4 event instrumentation

### Phase 2
- [ ] Skin photo upload + consultation queue (Environ path, when `CONSULT_ENABLED=true`)
- [ ] Consultant admin view (`/admin/consultations`)
- [ ] Klaviyo lifecycle hooks (quiz abandonment, protocol delivery, onboarding)
- [ ] Account dashboard shell (`/account`)
- [ ] 30/60/90-day task card system

### Phase 3
- [ ] AI companion (post-purchase chat, `AI_COMPANION_ENABLED=true`)
- [ ] Step-up tracking and reorder prompts
- [ ] Estrogen waitlist page (`/future-estrogen`)
- [ ] Admin rule editor

---

## Brand voice — copy guidelines

- **Headlines:** serif font, confident, specific. "Regenerative skincare that works with your biology." Not "Discover your glow."
- **Body copy:** warm but precise. Explain the science briefly. Never vague ("our advanced formula"). Always specific ("vitamin A esters that convert in the skin").
- **Quiz copy:** conversational, educational. Intersperse science stats. Make the customer feel understood.
- **Protocol results:** personal, signed. Use "your protocol" framing. Sound like Robin is speaking directly.
- **Avoid:** "glow", "radiant", "anti-aging", "revolutionary", "luxury" (feel it, don't say it), "transformation"
- **Use:** "regenerate", "protocol", "biology", "longevity", "step-up", "guided", "cellular"

---

## Current product path status

- **Active path for prototype:** `own-brand` (direct quiz → buy, no consultation)
- **Environ path:** built but gated behind `CONSULT_ENABLED=true`
- **Products:** Shopify staging store with mock R1 SKUs (placeholder packaging imagery)
- **AI companion:** stubbed — placeholder UI, no live OpenAI calls yet
- **Clinical/estrogen branch:** teaser page only, intake not live

---

## Key decisions already made — don't re-litigate these

1. App Router only (not Pages Router)
2. Supabase for database and auth (not PlanetScale, not Prisma Cloud, not Firebase)
3. Shopify headless (not WooCommerce, not BigCommerce)
4. Rule-based recommendation engine (not ML, not vector search)
5. No third-party CMS for MVP (content lives in database tables)
6. Tailwind only (no Chakra UI, no MUI, no Radix directly — use shadcn/ui primitives if needed)
7. Consultation is a first-class data entity, not a Typeform or calendar embed
