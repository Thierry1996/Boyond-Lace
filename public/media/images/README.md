# Beyond Lace — image asset library

Marketing / brand images for the app. Served at **`/media/images/…`**.

> **Product photos do NOT go here.** Catalogue product images come from the
> import → Cloudinary pipeline, not this folder. This library is for the
> promotional, editorial, and brand imagery around the products.

```
public/media/images/
├── hero/        ← homepage hero-carousel slide images
├── banners/     ← full-width banner strips
├── promos/      ← promotional / campaign images
├── models/      ← model photoshoot images
├── unboxing/    ← product unboxing shots
├── sidebar/     ← shop sidebar images
├── filters/     ← filter / category facet images
├── blog/        ← blog header banners
└── sections/    ← page-section header & feature-panel banners
```

## Format (all folders)
- **`.webp`** preferred (small, sharp); `.jpg` / `.png` fine. Long edge ≤ ~2000px,
  compressed, so pages stay fast.
- Match the slot's shape: hero/banners/blog = wide (~16:9 / wider); sidebar/filters
  = square-ish; sections/models = portrait or wide depending on the panel.

## How to proceed (step by step)
1. **Pick the folder** for the image type (table below).
2. **Drop the file** with a clear, descriptive name
   (e.g. `hero/hero-glueless.webp`, `blog/blog-lace-101-header.webp`,
   `sidebar/sidebar-shade-guide.webp`).
3. **Tell me the filename + which section/page** it should appear in.
4. I **wire it** into that slot in code (the same one-time step as the bestseller
   feature panel), and it goes live on the next load.

These images fill **fixed UI slots**, so a drop alone doesn't place them — step 3
is what tells me where each one belongs. As slots are wired, they're recorded in
the **Wired slots** list below so the mapping stays clear.

| Your image type | Folder |
|---|---|
| Hero slider / homepage slide | `hero/` |
| Banner (full-width) | `banners/` |
| Promotional / campaign | `promos/` |
| Model photoshoot | `models/` |
| Product unboxing | `unboxing/` |
| Shop sidebar | `sidebar/` |
| Filter / facet | `filters/` |
| Blog header banner | `blog/` |
| Page-section header / feature panel | `sections/` |

## Wired slots
| File | Appears at |
|---|---|
| `sections/bestseller-feature.jpg` | Home → "What people come back for." left feature panel |
| `sidebar/promo.gif` | Shop + collection filter sidebars (sticky promo). GIF/JPG/WebP; portrait ~4:5. Shows a placeholder until dropped. |
