# Beyond Lace — media library

Everything here is served at the site root under **`/media/…`**. Two halves:

```
public/media/
├── images/   → brand & marketing images   (see images/README.md)
└── videos/   → brand & product videos      (see videos/README.md)
```

- **`images/`** — hero, banners, promos, model shoots, unboxing, sidebar,
  filters, blog headers, section banners. All fill fixed UI slots: drop the file
  in the right sub-folder, tell me the section, I wire it. Product catalogue
  photos are **not** here — those come from the import → Cloudinary pipeline.
- **`videos/`** — `products/` clips auto-link to a PDP by slug (run the linker);
  `hero/` `promos/` `story/` are brand/marketing clips that get wired to a slot.

Open either sub-folder's `README.md` for the full drop instructions, format
specs, and the running list of wired slots.
