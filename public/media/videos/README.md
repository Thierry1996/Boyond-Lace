# Beyond Lace — video asset library

All app video lives under this folder and is served at **`/media/videos/…`**.
There are **two kinds** of video, and they render in different ways — drop each
kind in its folder below.

```
public/media/videos/
├── products/   ← clips tied to ONE product (PDP + home video rails)
├── hero/       ← homepage hero-carousel background clips
├── promos/     ← banner / slider / sidebar-ad promotional clips
└── story/      ← brand & trust: factory tour, packing, packaging,
                   customer visit, branding process, expo (esp. wholesale)
```

## Format (all folders)
- **`.mp4` (H.264 + AAC)** is safest; `.webm` also plays. `.mov` works but is heavy.
- Keep them compressed — ≤ 1080p, a few MB each. Background/hero clips should be
  **muted and loopable** (they autoplay silently).
- Landscape ~16:9 for hero/banners; square ~1:1 for sidebar ads; portrait ~9:16
  for slider/story reels reads best.

---

## 1. Product videos → `products/`
These **auto-link to a live product** — no code change needed.

- Name the file with the product's URL slug: **`‹product-slug›.mp4`**
  (the slug is the last part of its PDP URL, `/product/‹slug›`).
- Drop it in `products/`, then run the linker once:
  ```bash
  cd apps/backend
  npx medusa exec ./src/scripts/link-local-videos.ts
  ```
  It sets each matching product's `video_url` → the clip autoplays in the product
  gallery and the home video rails. Idempotent; re-run any time you add more.

See `products/README.md` for details.

## 2. Brand / marketing videos → `hero/`, `promos/`, `story/`
These fill **fixed UI slots** (a hero slide, a banner, the wholesale page, etc.),
so each one has to be pointed at its section in code — the same one-time wiring
as the `bestseller-feature` image.

**How to proceed:** drop the file in the right folder with a clear name
(e.g. `hero/hero-glueless.mp4`, `story/factory-tour.mp4`,
`promos/summer-sale-banner.mp4`, `story/expo-2026.mp4`), then tell me the
filename **and which section it should appear in** — I wire it and it goes live.
As slots get wired, they're listed in each folder's README so the mapping stays
clear.

| You said | Folder | Example filename |
|---|---|---|
| Hero / homepage background video | `hero/` | `hero-wear-and-go.mp4` |
| Banner / slider / promotional | `promos/` | `new-drop-banner.mp4` |
| Sidebar ad video | `promos/` | `ad-glueless-square.mp4` |
| New product release | `products/` (if for one product) or `promos/` | `‹slug›.mp4` |
| Factory tour (wholesale) | `story/` | `factory-tour.mp4` |
| Packing / packaging | `story/` | `packing-line.mp4` |
| Customer visit | `story/` | `customer-visit-lagos.mp4` |
| Branding process | `story/` | `branding-process.mp4` |
| Expo / event | `story/` | `expo-2026.mp4` |
