# Beyond Lace — Tech Stack LOCKED (supersedes 04-tech-stack.md)

Locked per the user's phased directive, 2026-07-19. Status column is honest:
what runs today vs. what is wired-but-awaiting-keys vs. deferred.

**Corrections applied (op-text vs. locked decisions):**
- Palette hexes in the directive were v1 (`#3C2C3A`/`#D4AF47`). **Brand Kit v2
  wins**: plum `#5A2D67`, gold `#C9A66B` — see `06-brand-kit-v2.md`.
- Domain: **beyondlace.com primary** (user's original directive);
  beyondlacehair.com registered as 301 redirect.
- Hosting: **Vercel locked**; Hostinger conflicts with it and is not adopted.

---

## Phase 0 — AI Dev Environment
| Item | Decision | Status |
|---|---|---|
| AI agent | Claude Code (this) — codebase gen, refactors, fixes | ✅ Active |
| MCP server | Anthropic MCP → inventory/order/customer DB | ⏳ After Prisma DB exists |
| Package manager | pnpm v9 workspaces | ⏳ Adopted at monorepo split (Medusa backend join). npm until then — one lockfile, zero migration risk mid-build |
| Medusa × Claude plugin | B2B/wholesale admin generation | ⏳ With Medusa adoption |

## Phase 1 — Frontend Storefront
| Item | Decision | Status |
|---|---|---|
| Framework | Next.js 16 (App Router, RSC, ISR) — *newer than the 15+ floor; 15.x has CVE-2025-66478* | ✅ Running |
| Language / runtime | TypeScript 5 strict · Node 20+ (24 local) | ✅ |
| Styling | Tailwind v4, kit-v2 token preset, no raw hex | ✅ |
| Components | shadcn/ui pattern (owned in-repo, restyled) | ✅ Incremental |
| Motion | Framer Motion | ✅ Installed (quiz flow) |
| Icons | Lucide React | ✅ Installed |
| Brand assets | Vercel Blob | ⏳ Token needed; local `src/fonts/`+placeholders until shoot lands |
| Server state | TanStack Query v5 | ✅ Installed (quiz) |
| Client state | Zustand (cart, wishlist, persisted) | ✅ Replaces context cart |
| Forms | React Hook Form + Zod resolvers | ✅ Wholesale, contact, checkout, quiz |

## Phase 2 — Backend, API & Database
| Item | Decision | Status |
|---|---|---|
| API | Next Route Handlers (Node runtime), Zod-validated | ✅ products, wholesale, contact, quiz-lead |
| Heavy B2B service | Express 4 standalone | ⏳ Only when bulk-order volume demands it |
| Structure | Controller → Service → Repository; commerce behind `CommerceAdapter` | ✅ Adapter live; Medusa implements it |
| Auth | **Clerk** primary (B2C + B2B SSO), Auth.js fallback, middleware route guards | ⏳ Requires Clerk keys — UI shells built, gates stubbed |
| DB | PostgreSQL 15+ on **Neon**, Prisma 5 ORM | ⏳ Requires provisioning; models spec'd below |
| Cache | Upstash Redis (catalog, rate-limit, sessions) | ⏳ With DB phase |
| Assets | Vercel Blob; R2/S3 for distributor bulk | ⏳ Keys |

**Prisma models (locked shape):** Product, ProductVariant (length/texture/shade/salon-exclusive), Collection (HD Lace, Medical Comfort, Men's Systems, Beyond Luxe, Beyond Pro), User (roles: Consumer, SalonPartner, WhiteLabelReseller, Distributor, Ambassador, Admin), Cart, Order (retail/wholesale tagged, fulfillment tracking), Inventory (batch-consistency lot tracking, low-stock alerts), Review/UGC (moderation queue), WhiteLabelAsset.

## Phase 3 — Payments
Stripe primary processor (cards Visa/Mastercard, live+test), PayPal + Alipay as
additional methods, Payment Element skinned plum/gold, webhooks for
order-confirm/refund/subscription, Beyond Care recurring billing, B2B tier
pricing as Stripe price objects (Bronze/Silver/Gold).
**Status:** ⏳ blocked on Stripe/PayPal keys. Checkout flow is built and runs in
clearly-labelled demo mode until keys land.

## Phase 4 — CMS
**Payload CMS 3** (Next-native, self-hosted) — product LPs, brand story, pillar
articles, guides, blog, FAQ, B2B docs (MAP, MOQ, spec sheets). Contentful is the
named fallback. ⏳ Installs with the DB phase (Payload needs Postgres).

## Phase 5 — Claude AI Integration
Vercel AI SDK + Anthropic API. Use cases locked: SEO product descriptions,
quiz-driven recommendations (heuristic version live now, LLM upgrade later),
virtual stylist chat, vision shade-match from customer photos, review
summarisation, abandoned-cart copy. ⏳ Requires `ANTHROPIC_API_KEY` in env.

## Phase 6 — Testing
| Layer | Tool | Status |
|---|---|---|
| Unit | Vitest | ✅ Running in repo |
| Component | React Testing Library | ✅ |
| API | Vitest (+Supertest at Express phase) | ✅ Zod schemas covered |
| E2E | Playwright — checkout, auth roles, catalog/AR, webhooks, sample-request | ⏳ Browser download unreliable on this network; config lands with CI runners |

## Phase 7 — CI/CD & Hosting
GitHub Actions (typecheck + unit + build on PR; E2E pre-merge) — ✅ workflow in
repo. Vercel hosting + preview deploys, Neon Postgres, Blob/R2 assets,
**beyondlace.com** primary. Env vars (Vercel secrets): `DATABASE_URL`,
`DIRECT_URL`, Clerk pk/sk, Stripe sk + webhook secret, `ANTHROPIC_API_KEY`,
Blob token.

## Phase 8 — Observability & Analytics
OpenTelemetry tracing, SigNoz APM, Pino structured logging, Next
instrumentation hook — ⏳ deploy-time. Vercel Analytics + PostHog with
per-avatar funnels (Transformation / Medical / Gen Z / Men / Salon), Stripe
sales reporting + wholesale margin dashboard.

## Phase 9 — DX & Quality
Prettier (✅ scripts in repo) · `tsc --noEmit` in CI (✅) · ESLint 9 flat +
Husky/lint-staged (⏳ next pass — `next lint` was removed in Next 16, so the
lint script now runs Prettier check) · Stripe CLI + Prisma Studio at their
phases.

## Starter kits — evaluated, not adopted
The storefront already exists on the locked brand system; importing Your Next
Store / Nimara now would replace working branded code with generic templates.
**Medusa 2.x monorepo starter** is the reference for the backend split.

## Launch checklist
Kept verbatim as the release gate, in order: repo → Vercel+domain → secrets →
`prisma migrate deploy` → Stripe webhook → assets/CMS → SigNoz → Playwright
staging run → Stripe live → PostHog avatar tracking → launch + stylist bot →
B2B portal rollout.

## Launch SKU mix (from directive §4)
8–15 hero SKUs, not 100. Current catalog: 15 SKUs — 5 glueless/beginner-friendly
units, 3 textured (kinky-straight, coily 4A, deep wave), natural-density soft
unit, closure+bundle set, silk-top medical, men's system, Lace Test kit, care
line. Mapped to the directive's mix; trimmed or extended per merchandising.
