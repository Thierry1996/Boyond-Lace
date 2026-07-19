# Beyond Lace — Production Tech Stack (Proposal, pending approval)

Mandated foundation: **Next.js (App Router) + React**. Everything below is chosen to serve that, and to make the 6 Empire Pillars operationally real rather than decorative.

Status: **PROPOSAL — not approved, no code written yet.**

---

## 0. Architecture Shape

A single Next.js App Router monorepo serving three audiences from one codebase, separated by route groups:

```
apps/web/                       # Next.js 15 App Router
  app/
    (storefront)/               # D2C retail — Transformation Seeker aesthetic
    (men)/                      # Beyond Lace Men — dark-mode technical subsite
    (wholesale)/                # B2B portal — gated, tiered pricing, MAP
    (brand)/                    # Brand story, pillars, editorial gallery
    (learn)/                    # Tutorials, quizzes, FAQ, masterclasses
    (community)/                # The Beyond Circle
    (account)/                  # Dashboard, orders, subscriptions, try-on presets
    (campaign)/                 # Hidden ad-driven landing pages, noindex
    api/                        # Route handlers, webhooks
packages/ui/                    # Design system components
packages/tokens/                # Brand design tokens (single source of truth)
packages/commerce/              # Commerce SDK adapter layer
docs/brand/                     # This specification
```

**Why route groups:** each avatar gets its own layout, theme, and copy voice (per `03-audience-and-aesthetics.md`) without forking the codebase or duplicating the cart.

---

## 1. Core Framework

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15+, App Router, RSC** | Mandated. Server components keep PDP/PLP fast; streaming suits image-heavy editorial. |
| Language | **TypeScript (strict)** | Non-negotiable for a multi-channel commerce app. |
| Runtime | **Node 20+**, Edge runtime for middleware | Middleware handles geo currency, B2B gating, A/B tests. |
| Package manager | **pnpm** + Turborepo | Fast monorepo builds. |

---

## 2. Commerce Backend — the one decision that shapes everything

**Recommended: Shopify (Plus) headless via Storefront API + Hydrogen React, consumed by Next.js.**

Why, given this specific brand:
- **Subscriptions** (Beyond Care box) work out of the box via selling plans — building recurring billing from scratch is months of work.
- **B2B is native on Plus**: company accounts, tiered Bronze/Silver/Gold catalogs and price lists, per-company payment terms. This maps 1:1 to the Wholesale Salon Program without custom code.
- **PCI, fraud, tax, and multi-currency are Shopify's problem, not ours.** Critical for a $600+ AOV brand launching internationally.
- Checkout can stay Shopify-hosted (fastest, safest path to launch) and be re-skinned with Checkout UI Extensions in brand plum/gold.

Alternatives if you want full ownership of data and checkout:
- **Medusa v2** (Node, self-hosted) — total control, but you own subscriptions, tax, fraud, and B2B pricing logic yourself.
- **Saleor** — strong B2B/multi-channel, GraphQL-native, heavier ops burden.

> Decision needed from you. The rest of this stack is written assuming Shopify; swapping is contained to `packages/commerce`.

**Adapter rule:** all commerce reads/writes go through `packages/commerce`. No Shopify types leak into UI components. That is what keeps a future migration survivable.

---

## 3. Content & Merchandising

| Need | Choice |
|---|---|
| Editorial CMS (brand story, pillars, tutorials, lookbooks, landing pages) | **Sanity** — real-time preview, portable text, strong image pipeline, generous free tier |
| Product data | Shopify (source of truth), enriched with Sanity fields for editorial storytelling |
| Visual page building for campaign LPs | Sanity page-builder schema — marketing ships landing pages without engineering |
| Media / DAM | **Cloudinary** — AI cropping, skin-tone-safe color handling, on-the-fly AVIF/WebP, video for UGC reels |

Rationale: the brand's moat is narrative. Marketing must be able to publish manifesto pages, transformation stories, and drop campaigns without a deploy.

---

## 4. Design System & Styling

| Layer | Choice |
|---|---|
| Styling | **Tailwind CSS v4** with brand tokens (no default palette usage) |
| Primitives | **shadcn/ui** on Radix — owned in-repo, restyled to brand, fully accessible |
| Tokens | `packages/tokens` — Style Dictionary, exports CSS vars + TS types + Figma sync |
| Motion | **Motion (Framer Motion)** — restrained, editorial easing; respects `prefers-reduced-motion` |
| Typography | Sharp modern serif wordmark + clean sans body, self-hosted via `next/font` (zero CLS, no Google request) |
| Theming | Four themes off one token set: `luxe` (default plum/gold), `clinical` (medical buyer), `editorial` (Gen Z), `men` (dark technical) |

**Palette tokens** (from the brand kit):
`plum #3C2C3A` · `gold #D4AF47` · Regal Amethyst · Blush Aura · Infinite Black · Luminous White

**Hard rule encoded in lint:** no raw hex in components; tokens only. This is what prevents the site drifting into cheap glamour.

---

## 5. Application Data (everything commerce doesn't own)

**Postgres via Supabase** — quiz results, try-on presets, community profiles, wholesale applications, loyalty ledger, UGC submissions.

| Concern | Choice |
|---|---|
| ORM | **Drizzle** — typed, SQL-honest, fast on serverless |
| Auth (D2C) | Shopify Customer Account API (passwordless, owns the order relationship) |
| Auth (B2B portal) | **Auth.js** + Supabase, with company/role claims and manual approval gate |
| File uploads (UGC, private-label artwork) | Supabase Storage or Cloudinary signed uploads |
| Caching | Next.js `revalidateTag` + **Upstash Redis** for cart/session/rate limits |

---

## 6. Pillar-Specific Systems

### AR Virtual Try-On (return-rate killer)
- **MediaPipe Face Landmarker** (WASM, on-device) + Three.js / React Three Fiber overlay
- **On-device only — no face data ever leaves the browser.** This must be stated plainly in the UI and privacy policy; it is also a trust asset for the medical and male avatars.
- Loaded via `next/dynamic`, never in the main bundle

### Quiz Engine (zero-party data)
- Sanity-authored question schema, results written to Supabase, piped to Klaviyo as profile properties
- Powers "Find Your Perfect Wig" + Face Shape Quiz + retargeting segments

### Lace Shade Matching
- Cloudinary color extraction + a curated shade-match matrix; outputs a recommended lace tone with a "closest 3" fallback

### Subscriptions (Beyond Care)
- Shopify selling plans; management surfaced natively in the account dashboard (never bounce customers to a third-party portal)

### Wholesale / Private Label
- Gated portal, tiered price lists, MAP policy acknowledgement gate before pricing is revealed
- Sample request + application workflows in Supabase with an internal review queue
- PDF generation (pricing sheets, spec sheets, MAP docs) via **React PDF**

### Loyalty & Community
- Points ledger in Postgres (append-only, auditable), tiers evaluated server-side
- Transformation story gallery with **moderation queue** — no user media goes live unreviewed

---

## 7. Growth, Data & Messaging

| Need | Choice |
|---|---|
| Email + SMS lifecycle | **Klaviyo** — the standard for this category; abandoned cart, quiz nurture, post-purchase |
| WhatsApp recovery | Twilio or Klaviyo WhatsApp |
| Product analytics | **PostHog** — funnels, session replay, feature flags, A/B tests in one tool |
| Server-side ad tracking | **Meta CAPI + TikTok Events API**, server-side from route handlers (survives iOS/ad-blockers — directly serves the Data-First Advertising pillar) |
| Consent | **Cookiebot** or in-house CMP; consent-gated tag firing (GDPR/CCPA) |
| Search | **Algolia** (or Typesense to cut cost) — federated across products, guides, brand pages, wholesale docs |
| Reviews / UGC | **Okendo** or Yotpo — photo reviews are the conversion engine for this category |
| Affiliate / ambassador tracking | **Refersion** or Impact — tiered commission structures for the 3-tier program |
| Support | **Gorgias** (commerce-native) or Intercom for live chat |

---

## 8. Infrastructure & Delivery

| Layer | Choice |
|---|---|
| Hosting | **Vercel** — the native Next.js target; ISR, edge middleware, preview deploys per PR |
| CDN / WAF | Vercel Edge + **Cloudflare** in front for bot and drop-day traffic protection |
| CI/CD | GitHub Actions — typecheck, lint, unit, E2E, Lighthouse budget, visual diff |
| Error tracking | **Sentry** (source-mapped, session replay on error) |
| Uptime | Better Stack, with drop-day alerting |
| Secrets | Vercel env + 1Password/Doppler; nothing in the repo |

---

## 9. Quality Gates (non-negotiable before launch)

| Gate | Tooling | Threshold |
|---|---|---|
| Unit / component | Vitest + Testing Library | Critical paths covered |
| E2E | Playwright | Full purchase, subscription, wholesale application, quiz |
| Visual regression | Chromatic or Playwright snapshots | All four themes |
| Accessibility | axe-core in CI + manual keyboard/screen-reader pass | **WCAG 2.2 AA** — legally required and directly serves the medical avatar |
| Performance | Lighthouse CI budgets | LCP < 2.0s on PDP (4G), CLS < 0.05, INP < 200ms |
| i18n | `next-intl` | Multi-currency + multi-language from day one, per the utility nav |

**Why the perf bar is this strict:** a luxury brand that loads slowly is not a luxury brand. Perceived quality is the price justification.

---

## 10. Launch Sequence (suggested)

**Phase 1 — Foundation:** tokens, design system, four themes, layout shells, CMS schemas
**Phase 2 — Commerce core:** PLP/PDP, cart, checkout, account, search
**Phase 3 — Conversion systems:** quiz, shade matcher, try-on kits, reviews, Klaviyo flows
**Phase 4 — B2B:** wholesale portal, tiered pricing, MAP gate, applications, PDF assets
**Phase 5 — Retention:** subscriptions, loyalty, Beyond Circle, transformation gallery
**Phase 6 — Differentiators:** AR try-on, capsule drop mechanics, campaign landing pages
**Phase 7 — Hardening:** a11y audit, perf budgets, load test for drop day, legal pages, launch

---

## 11. Open Decisions For You

1. **Commerce backend** — Shopify Plus (recommended) vs. Medusa vs. Saleor?
2. **Checkout** — Shopify-hosted and re-skinned (fast, safe) vs. fully custom (slower, riskier, more control)?
3. **Shopify Plus budget** — B2B company accounts and tiered price lists require Plus. Confirmed?
4. **AR try-on at launch** or Phase 2 post-launch? It is the most technically expensive item here.
5. **Beyond Lace Men** — subsite inside beyondlace.com, or a separate domain for full discretion?
6. **Launch markets & currencies** — determines tax, i18n, and shipping scope.
