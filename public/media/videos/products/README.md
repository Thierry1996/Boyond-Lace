# Product videos (auto-linked to a PDP)

Served at **`/media/videos/products/<file>`**. A clip here shows on a product
only once it's linked to that product (via its Medusa `metadata.video_url`).

## Drop → link → live
1. Name the file with the product's URL slug: **`‹product-slug›.mp4`**
   (find the slug in the PDP URL: `/product/‹slug›`).
2. Drop it in this folder.
3. Run the linker (matches filename → product handle, sets `video_url`):
   ```bash
   cd apps/backend
   npx medusa exec ./src/scripts/link-local-videos.ts
   ```
   Point it elsewhere with `dir:"<path>"` if needed. Idempotent — safe to re-run
   as you add more; it warns about any file whose name doesn't match a product.

Once linked, the video autoplays in the product gallery and the home
Real-Looks / Reach / Social rails.

_Manual alternative:_ set `metadata.video_url = /media/videos/products/yourfile.mp4`
on the product in Medusa admin.
