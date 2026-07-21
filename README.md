# Beyond Lace

Storefront for **beyondlace.com** — luxury HD Swiss lace human hair wigs.

Built on Next.js (App Router) + React, running on Node.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run typecheck
```

---

## What exists today

Full navigation ecosystem — **every link in the header, utility bar, and footer resolves**; verified by route sweep (35 routes, all 200).

| Area                       | Routes                                                                                                                                         |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Storefront                 | `/` · `/shop` (+filters/sorts) · `/shop/bestsellers` · `/shop/new-arrivals` · `/shop/sale` · `/drops` · `/product/[slug]` (15 SKUs)            |
| Purchase                   | `/cart` · `/checkout` (shipping → payment [demo mode] → confirmation) · `/wishlist` · `/account`                                               |
| Brand & community          | `/brand` (manifesto, mission, pillars, identity kit, gallery, press, founder) · `/circle` (stories, loyalty, events, 3-tier ambassadors)       |
| Education                  | `/learn` (tutorials, shade, sizing, grades, FAQ) · `/learn/quiz` (working recommender + consented lead capture) · `/try-on`                    |
| B2B                        | `/wholesale` (tiers, MAP, sourcing, private label, live application form)                                                                      |
| Support & legal            | `/support` (track, returns, shipping, warranty, contact form) · `/careers` · `/legal/*` (6 docs)                                               |
| Campaign (hidden, noindex) | `/lp/influencer-affiliates` · `/lp/salon-onboarding` · `/lp/quiz` · `/lp/comeback` · `/lp/drop-vip`                                            |
| System                     | `/search` (products + page index) · branded `404` · `/api/products` · `/api/wholesale` · `/api/contact` · `/api/quiz-lead` (all Zod-validated) |

**Quality gates:** `npm test` (Vitest, 26 tests) · `npm run typecheck` · `npm run lint` (Prettier) · GitHub Actions CI on every PR.

**Pending keys/provisioning (built as shells, clearly labelled):** Clerk auth, Stripe/PayPal/Alipay live payment, Neon+Prisma persistence, Claude AI stylist. See `docs/brand/07-tech-stack-locked.md` for the full phase status table.

---

## Architecture

```
src/
  app/                  App Router routes
    globals.css         Design tokens — generated from docs/brand/05-visual-identity.md
  components/
    brand/              Logo system (wordmark, monograms, crown-wave)
    cart/               Cart context, localStorage-persisted
    layout/             Header (mega nav) + Footer
    product/            PDP purchase island
    ui/                 ProductCard, ProductImage, Section
  lib/
    commerce/           Adapter boundary — types, catalog, mock adapter
    navigation.ts       Nav structure as data, mirrors docs/brand/01-sitemap.md
docs/brand/             Brand specification (the source of truth)
```

### The commerce boundary

Everything commerce-related goes through `src/lib/commerce`. No vendor's types
appear in any page or component. The backend is selected in exactly one place:

```ts
// src/lib/commerce/index.ts
export const commerce: CommerceAdapter = mockAdapter;
```

Today that's an in-memory catalog so the storefront can be built and reviewed
before the backend decision lands. Swapping to Shopify means writing a
`ShopifyAdapter` satisfying `CommerceAdapter` and changing that one line.

### Design tokens

`globals.css` is generated from `docs/brand/05-visual-identity.md`. **Do not put
raw hex values in components** — the palette is a price-justification asset and
drift is expensive. Four avatar themes (`luxe`, `clinical`, `editorial`, `men`)
share one token set and are applied via `data-theme` on a route group's layout.

---

## Conventions

- Category is stated explicitly in metadata, JSON-LD, and alt text. "Beyond Lace"
  reads as an intimates brand to search and ad classifiers otherwise — see
  `docs/brand/05-visual-identity.md` §8.
- Copy leads with the transformation and earns it with the engineering. Never
  spec-sheet first.
- Product photography does not exist yet; `ProductImage` renders on-brand
  gradient fields rather than misleading stock. Swap for `next/image` against the
  CDN when the shoot lands.

## Known issues

- **Root cause found for the earlier `next dev` hang:** `next/font/google`
  downloads font files at compile time, and `fonts.gstatic.com` is unreliable
  from this machine (curl times out; PowerShell succeeds intermittently). The
  dev compile stalled waiting on that fetch, and one production build failed
  outright with "Error while requesting resource". **Fixed permanently** by
  self-hosting Cormorant Garamond in `src/fonts/` via `next/font/local` — the
  build now has zero network dependencies. Do not reintroduce
  `next/font/google`.

- `npm audit` reports a moderate advisory for `postcss` bundled inside Next's own
  dependency tree (build-time CSS stringifier XSS). npm's only "fix" is
  downgrading Next to 9.3.3, which is not a real option. Not reachable at runtime;
  revisit when Next ships an updated bundle.
