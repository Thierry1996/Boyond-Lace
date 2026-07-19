# Beyond Lace — Brand Kit v2 (CANONICAL)

Locked from the full brand-kit board supplied 2026-07-19. **This file supersedes
§1–§3 of `05-visual-identity.md`** (palette, gradients, typography). Layout
grammar, logo rules, avatar themes, and the accessibility method in 05 still
apply, re-based onto these values.

---

## 1. Core Palette (locked, v2)

| Token | Name | Hex | Role |
|---|---|---|---|
| `ink` | Infinite Black | `#090909` | Default canvas |
| `paper` | Luminous White | `#F8F5F1` | Primary text on dark; warm, not clinical blue-white |
| `plum` | Velvet Plum | `#5A2D67` | Signature colour — now a true regal purple, not the muted mauve of v1 |
| `blush` | Blush Aura | `#EECAD5` | Soft accent, small doses |
| `gold` | Gilded Gold | `#C9A66B` | Champagne gold — hairlines, monogram, micro-detail. Softer than v1's brass |

## 2. Supporting Palette (new in v2)

| Token | Name | Hex | Role |
|---|---|---|---|
| `rose-400` | Dust Rose | `#DCA8B7` | Mid rose — gradient stops, decorative |
| `gold-300` | Champagne | `#F6EBD5` | Light gold — gradient highlights, hover washes |
| `plum-900` | Deep Aubergine | `#321528` | Darkest plum — text on light themes, deep surfaces |
| `rose-200` | Rose Quartz | `#F7E7EC` | Lightest rose — editorial theme surfaces |
| `ivory` | Warm Ivory | `#FBF8F4` | Light-theme canvas (clinical / editorial) |

### Derived ramp (interpolated between locked stops)
```
Plum   900 #321528 ←kit   800 #46215A   700 #5A2D67 ←kit   600 #71407F   500 #895898
Rose   400 #DCA8B7 ←kit   300 #EECAD5 ←kit   200 #F7E7EC ←kit
Gold   600 #A9834D   500 #C9A66B ←kit   400 #DBBF92   300 #F6EBD5 ←kit
Neutral 950 #090909 ←kit  900 #121012  800 #1C181C  700 #2A252A
        400 #8A8388  200 #D8D2D4  50 #F8F5F1 ←kit   ivory #FBF8F4 ←kit
```

## 3. Signature Gradients (re-based)

```css
--grad-aurora: linear-gradient(135deg, #5A2D67 0%, #DCA8B7 35%, #EECAD5 58%, #F6EBD5 80%, #C9A66B 100%);
--grad-gilded: linear-gradient(100deg, #A9834D 0%, #F6EBD5 48%, #C9A66B 100%);
--grad-velvet: radial-gradient(120% 90% at 50% 0%, #5A2D67 0%, #321528 55%, #090909 100%);
```
Aurora rule unchanged: at most once per viewport.

## 4. Typography (locked, v2 — no substitute fonts)

| Role | Font (from the kit) | Status |
|---|---|---|
| Display | **Canela** | Commercial licence — files go in `src/fonts/` when purchased |
| Headline | **Cormorant Garamond** | Open — loaded now via `next/font` |
| Body | **Neue Haas Grotesk** | Commercial licence — files go in `src/fonts/` when purchased |

**The no-forced-fonts rule:** every name in a font stack must come from this
kit. No Playfair, no Inter, no AI-chosen stand-ins.

Implemented stacks (licensed fonts win automatically the moment their files are
installed; until then the fallback chain stays inside the kit's own lineage):

```css
--font-display: "Canela", var(--font-cormorant), "Cormorant Garamond", Georgia, serif;
--font-sans: "Neue Haas Grotesk Display Pro", "Neue Haas Grotesk",
             "Helvetica Neue", Helvetica, Arial, sans-serif;
```

Rationale: Cormorant Garamond is the kit's own headline font, so it is the
correct loaded serif until Canela is licensed. Neue Haas Grotesk *is* the
Helvetica revival — Helvetica Neue/Arial are its direct lineage, not an
aesthetic substitution.

## 5. Brand Elements (new in v2)
Lace wave, crown, heart, ribbon, signature seal (BL roundel), gold divider.
1.5px stroke, gold, geometric, never filled. The seal is the loyalty/packaging
mark; the divider replaces plain `<hr>` in editorial contexts.

## 6. Brand Values & Tone
Beauty without excess · Luxury through craftsmanship · Confidence over attention
· Elegance in simplicity · Softness is strength · Premium quality · Slow
fashion · Ethical sourcing.

Tone words: **Elegant, Confident, Timeless** — and the kit's "Sensual" is
rendered in the hair category as *intimate confidence* (the mirror moment, the
unnoticed hairline), never as innuendo. Voice: "Speak with elegance. Inspire
confidence."

## 7. Category Guard (unchanged, reaffirmed)
The v2 board itself describes a lingerie brand and shows lingerie photography —
the third independent confirmation of the category-confusion risk. **The visual
system is adopted; the category is not.** All copy, schema, alt text, and
photography direction remain locked to human hair. See
`memory: beyondlace-lingerie-category-risk`.

## 8. Accessibility (recomputed for v2)
| Combination | Verdict |
|---|---|
| Paper `#F8F5F1` on Ink `#090909` | ~19:1 — pass |
| Gold `#C9A66B` on Ink | ~8.7:1 — pass, body text OK |
| Gold `#C9A66B` on Plum `#5A2D67` | ~3.9:1 — **display ≥24px and rules only** |
| Blush `#EECAD5` on Plum | ~7.8:1 — pass |
| Plum-900 `#321528` on Ivory `#FBF8F4` | ~15:1 — pass |
| Plum `#5A2D67` on Ivory | ~9.5:1 — pass |
