---
name: catalogue-import
description: >
  Import a scraped competitor product-catalogue JSON into Beyond Lace's Medusa backend and
  make it render in the branded storefront. Use whenever the user drops a *.json product
  dataset (schema.org-style scrape: name/offers/additionalProperties.{variants,images,extraProperties})
  into apps/backend/src/scripts and says import it, add the catalogue, load the products, or
  process dataset N. Covers the full pipeline: map → import → rehost images to Cloudinary →
  link to Retail → stock → verify. Follow it verbatim to avoid re-deriving the workflow.
---

# Beyond Lace — Catalogue Import Pipeline

The proven, low-token path to turn one scraped JSON file into live, branded, Cloudinary-hosted
products. **Run the steps in order.** Everything is idempotent, so re-running is safe.

## Layout & prerequisites (load-bearing)
- Backend (Medusa): `C:\Users\dell\Desktop\Beyond-lace-store\apps\backend` — scripts in `src/scripts`.
- Storefront (branded): `C:\Users\dell\Desktop\BeyondLace` (port 3000), reads Medusa via `src/lib/commerce/medusa-adapter.ts`.
- **Every backend `exec`/server command needs BOTH:** Node 22 on PATH and the Neon **pooled** DB URL.
  Use this exact preamble (Git Bash), then the command:
  ```bash
  export PATH="/c/Users/dell/node22/node-v22.23.2-win-x64:$PATH"
  cd /c/Users/dell/Desktop/Beyond-lace-store/apps/backend
  POOLED=$(grep -E '^DATABASE_URL=' .env | sed -E 's/^DATABASE_URL=//' | sed -E 's/(ep-[a-z0-9-]+)\.c-[0-9]+\./\1-pooler.c-5./')
  DATABASE_URL="$POOLED" node ../../node_modules/@medusajs/cli/cli.js exec ./src/scripts/<script>.ts <args>
  ```
- Medusa `exec` boots the app (~40–90s). **Always run these in the background** (`run_in_background: true`)
  writing to a log file, then read the log — a foreground call will time out.
- `CLOUDINARY_URL=cloudinary://<key>:<secret>@<cloud>` must be in `apps/backend/.env` for the rehost step.

## Step 0 — Profile the new file first (cheap, catches schema drift)
Read the top-level shape and one product with plain `node -e`. Confirm it has
`additionalProperties.{variants[].size, images[].url, extraProperties[{name,value}], sku, regularPrice}`.
If the shape differs, adjust `import-scraped-catalogue.ts` before importing.

## Step 1 — Dry-run the mapping
```
exec ./src/scripts/import-scraped-catalogue.ts <file-basename> dry cat:"<Category Name>"
```
Prints per-product summary + the full mapped object #1, creates nothing. Sanity-check price ranges,
lengths, texture normalisation, images, rating/sold. `<file-basename>` = JSON filename without `.json`.

## Step 2 — Real import
```
exec ./src/scripts/import-scraped-catalogue.ts <file-basename> cat:"<Category Name>"
```
Creates products/variants in the given category (created if new). Idempotent by handle.

## Step 3 — Rehost images to Cloudinary (kill hotlinks)
```
exec ./src/scripts/rehost-images.ts            # all un-rehosted products
```
Uploads each product's images to Cloudinary (server-side remote fetch, ≤8/product) and rewrites the
Medusa product to the Cloudinary URLs. Idempotent via `metadata.images_rehosted`. Run `... one` first
on the very first ever run to prove creds. **After this, no product may hotlink a competitor CDN.**

## Step 4 — Channel + stock
```
exec ./src/scripts/link-retail.ts              # add all products to the Retail sales channel
exec ./src/scripts/set-stock.ts 25             # give new variants a starting stock level
```

## Step 5 — Verify (servers must be running)
Start backend (`medusa develop --lint=false`, background) and storefront (`npm run dev` in BeyondLace,
background); wait for `:9000/health` = 200. Then:
- Store API count rose by the expected number: `GET :9000/store/products?limit=1&region_id=<REGION>` with `x-publishable-api-key`.
- A new PDP renders on `:3000/product/<handle>` with real rating, compare-at, length options, and
  Cloudinary images (check `thumbnail` host = `res.cloudinary.com`).

## Mapping reference (schema → Beyond Lace)
- `name`→title (brand-neutralised), `url` slug→handle (brand-neutralised, no `celie-…`).
- `offers.price`→base price; `additionalProperties.regularPrice`→compare-at (only if > price).
- `additionalProperties.variants[].size`→**Length** option; price scales via LEN_DELTA anchored at shortest length.
- `additionalProperties.images[].url` + `image`→product images (rehosted in Step 3).
- `rating`/`reviewCount`→metadata.rating/review_count (real, replaces the 4.8 placeholder).
- `extraProperties[]`→canonical facets (lace_type, lace_design, density, texture, shade, hairline, origin,
  cap_construction, **sold**) **plus every raw pair as `spec_<name>`** so nothing is ever lost.

## Elastic-schema rules (the catalogue is meant to GROW)
- **New texture** that should be a clean facet → add it to the `TEXTURES` array in `import-scraped-catalogue.ts`
  (compound/longer names first). Unlisted textures still pass through title-cased — never dropped.
- **New collection** → pass a new `cat:"Name"`; the category is auto-created.
- **New spec fields** need no code change — they land in metadata as `spec_<name>` automatically.
- Variant SKUs are de-duped batch-wide and against the DB (source reuses base SKUs); never bypass this,
  or the whole transactional create rolls back on the first collision.

## Follow-ups to remember
- Long SEO titles are kept verbatim (no hand-authored brand names at bulk scale) — only change on request.
- `metadata.sold` is stored but not yet surfaced in the UI (candidate social-proof badge).
