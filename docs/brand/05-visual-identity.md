# Beyond Lace — Visual Identity Lockdown

> **⚠ PARTIALLY SUPERSEDED (2026-07-19).** The full brand-kit board (v2) landed
> after this file was written. **`06-brand-kit-v2.md` now owns the palette,
> gradients, and typography** — the hexes and font names below are v1 history.
> The layout grammar (§5), logo system rules (§4), avatar theme structure (§6),
> and accessibility method (§7) in this file still apply.

Derived from the supplied brand kit boards (logo mark, identity board, palette/type boards, lockup board). **This file is the single source of truth for appearance.** Where it conflicts with anything earlier, this file wins. `packages/tokens` will be generated from this document.

---

## 1. Core Palette (locked)

| Token | Name | Hex | Role |
|---|---|---|---|
| `--bl-black` | Infinite Black | `#0A0A0A` | Default canvas. The brand lives on black, not white. |
| `--bl-white` | Luminous White | `#F8F9FA` | Primary text on dark; canvas for the clinical theme. |
| `--bl-plum` | Velvet Plum | `#3E2C3A` | Signature brand color. Surfaces, cards, packaging. |
| `--bl-amethyst` | Regal Amethyst | `#8C6B8A` | Mid-tone accent, gradient midpoint, muted text on dark. |
| `--bl-blush` | Blush Aura | `#E8D0D2` | Soft accent. Used sparingly — restraint is what keeps it luxury. |
| `--bl-gold` | Gilded Gold | `#D4AF37` | Rules, hairlines, monogram, micro-detail. **Never** large fills. |

### Corrections applied from earlier notes
- Velvet Plum is **`#3E2C3A`** (boards), not `#3C2C3A`.
- Gilded Gold is **`#D4AF37`** (boards) — the canonical metallic gold hex. Earlier `#D4AF47` was a typo.
- Board 3/4 label the gold swatch "Gilded Aura" and repeat "Velvet Plum" twice — generation artifacts. Canonical names: **Gilded Gold**, and the second plum tile is the **Plum 600** step below.

### Extended ramp (needed for real UI — states, borders, disabled, charts)

```
Plum      900 #241A22   800 #2F2230   700 #3E2C3A ←core   600 #55405A   500 #6B4F72
Amethyst  600 #6E5270   500 #8C6B8A ←core   400 #A98BA6   300 #C6AEC3
Blush     400 #D9B4B8   300 #E8D0D2 ←core   200 #F2E4E5
Gold      600 #A8862A   500 #D4AF37 ←core   400 #E3C766   300 #F0DFA8
Neutral   950 #0A0A0A ←core  900 #121212  800 #1C1A1C  700 #2A272A
          400 #8A868A  200 #D6D3D6  50 #F8F9FA ←core
```

**Deep royal purple** (the header band on the identity board) reads as `#5B2A54` — this is a *campaign accent*, not a core token. Registered as `--bl-royal`, permitted on marketing banners and drop campaigns only.

---

## 2. Signature Gradients

The monogram's aurora gradient is the brand's most distinctive asset. Two locked recipes:

```css
/* Aurora — logo, hero accents, active states */
--bl-grad-aurora: linear-gradient(135deg, #8C6B8A 0%, #C6AEC3 32%, #E8D0D2 58%, #E3C766 82%, #D4AF37 100%);

/* Gilded — foil rules, dividers, premium badges */
--bl-grad-gilded: linear-gradient(100deg, #A8862A 0%, #F0DFA8 48%, #D4AF37 100%);

/* Velvet — surface depth on dark sections */
--bl-grad-velvet: radial-gradient(120% 90% at 50% 0%, #3E2C3A 0%, #1C1A1C 62%, #0A0A0A 100%);
```

**Rule:** aurora gradient appears at most **once per viewport**. It is the crown jewel; repeat it and it becomes decoration.

---

## 3. Typography

| Role | Style | Usage |
|---|---|---|
| Display / wordmark | **Sharp modern high-contrast serif** — tall ascenders, fine hairlines, teardrop terminals | H1/H2, wordmark, hero statements, price |
| Body / UI | **Clean geometric-humanist sans** | Everything else: nav, body, forms, buttons, tables |

Recommended pairing (self-hosted, licensed, `next/font`):
- Display: **Canela**, **Ogg**, or **Reckless** — free-tier fallback: **Playfair Display** tuned to optical size 60+
- Body: **Söhne**, **Neue Haas Grotesk**, or **Suisse Intl** — free-tier fallback: **Inter** with `tracking-tight`

**Typographic rules from the boards:**
- Wordmark sets **Beyond Lace** with generous letter-spacing at large sizes and **no** letter-spacing below 32px.
- Tagline *Beyond Lace. Beyond Beautiful.* always sets in the **sans**, never the serif, at roughly 22–26% of the wordmark's size, centered beneath it.
- Board eyebrows (small caps, wide tracking, ~10px, muted) are a real system element: `--type-eyebrow` = 10px / 0.18em tracking / uppercase / `neutral-400`.
- Display type is **white or gold on black** — never blush, never amethyst. Purple display type (board 5) is a campaign-only variant.

---

## 4. Logo System (4 assets)

1. **Primary wordmark** — "Beyond Lace" in display serif with the ligature flourish off the B, tagline lockup beneath. Website header, packaging, retail hero.
2. **BL monogram, aurora** — interlocking script B/L with the orbital swoosh and dot trail, aurora gradient on black. App icon, social avatar, splash, loading states.
3. **BL monogram, flat gold** — solid `#D4AF37` on plum. Hang tags, foil deboss, favicons, anywhere the gradient would break down.
4. **Crown / hair-wave icon** — abstract crown over flowing wave lines. Watermarks, loyalty tier badges, Beyond Circle community marks.

**Clear space:** minimum of the cap-height of the "B" on all sides.
**Minimum sizes:** wordmark 120px wide; aurora monogram 48px; flat gold monogram 24px (below 48px, *always* use flat gold — the gradient muddies).
**Never:** stretch, recolor outside the locked set, place the aurora monogram on light backgrounds, or apply drop shadows. The glow in the source art is a *render*, not a CSS effect — reproduce it as a subtle radial bloom behind the mark, never `box-shadow`.

---

## 5. Layout Language (read off the boards)

The boards themselves define the site's structural grammar — this is the most useful thing in them:

- **Framed composition.** A hairline rule inset ~4% from each edge, with small tracked-out eyebrow labels sitting on the top rule (left / center / right). This becomes the site's section header pattern.
- **Massive display type, tight vertical rhythm.** The wordmark occupies 30–40% of the board width with the tagline immediately beneath. Heroes inherit this: one enormous serif statement, one sans line, nothing else.
- **Gold hairline dividers** — 1px, `#D4AF37` at 40–60% opacity, sometimes gradient-faded at the ends. Primary section separator.
- **Card grid on near-black** (`#121212` cards on `#0A0A0A`), 3-up, generous gutters, sharp or lightly rounded corners (`4px`).
- **Icon style:** 1.5px stroke, gold or blush, rounded joins, geometric. Never filled, never duotone.
- **Whitespace is the luxury signal.** Boards run ~60% empty. Section padding scales to `clamp(96px, 12vw, 200px)`.

---

## 6. Avatar Themes Mapped to These Tokens

One token set, four surface treatments:

| Theme | Canvas | Surface | Primary text | Accent | Notes |
|---|---|---|---|---|---|
| `luxe` (default) | `--bl-black` | Plum 800 | Luminous White | Gold + aurora | Transformation Seeker. Moody editorial. |
| `clinical` | Luminous White | `#FAF7F9` | Plum 900 | Amethyst 500 only | Medical buyer. **Gold and aurora are disabled.** Dignified, never glamorous. |
| `editorial` | `#FBFAFB` | White | Neutral 900 | Blush 300 + thin gold rule | Gen Z. Crisp, light, minimal. |
| `men` | `--bl-black` | Neutral 800 | Luminous White | Gold at 60%, **no blush, no aurora** | Beyond Lace Men. Technical, discreet, monochrome-leaning. |

Enforced in code: `blush` and `grad-aurora` tokens are compile-time unavailable in the `men` theme; `gold` and `grad-aurora` unavailable in `clinical`. Theme violations fail the build rather than shipping.

---

## 7. Accessibility Reconciliation (must-fix, not optional)

The boards are gorgeous and two combinations are illegal at WCAG 2.2 AA:

| Combination | Contrast | Verdict |
|---|---|---|
| Luminous White on Infinite Black | 18.9:1 | Pass |
| Gold `#D4AF37` on Infinite Black | 8.6:1 | Pass |
| **Gold `#D4AF37` on Velvet Plum** | **4.3:1** | **Fails for body text.** Permitted for ≥24px display and non-text rules only. |
| **Blush `#E8D0D2` on Velvet Plum** | 7.4:1 | Pass |
| **Amethyst `#8C6B8A` on Infinite Black** | **4.0:1** | **Fails.** Use Amethyst 400 `#A98BA6` (6.4:1) for any text. |
| Plum `#3E2C3A` on Luminous White | 12.1:1 | Pass |

**Resolution:** Amethyst 500 is a *decorative* token — borders, fills, gradient stops. Amethyst 400 is the text-safe step. This costs nothing visually and keeps the medical avatar and legal compliance intact.

---

## 8. Two Flags Worth Your Decision

**1. The imagery on the identity board is off-category.** The three lifestyle tiles show satin lingerie, not hair. "Beyond Lace" reads as an intimates brand to an image generator — and it will read that way to Google, Meta's ad classifier, and a first-time visitor too. This is a real positioning risk, not a rendering nitpick.

*Recommendation:* the photographic system should be locked to **hair only** — lace-melt macro detail, hairline close-ups, editorial transformation portraits, plum/gold styled product-on-stand. The satin-and-silk *texture* language is worth keeping; the garments are not. Worth considering how the brand signals "hair" in ad creative and meta tags so the category never gets confused.

**2. The boards carry generation artifacts** — placeholder gibberish body copy, a duplicated plum swatch, the "Gilded Aura" mislabel, and a 豆包AI watermark. They are excellent *direction*, not deliverable assets. Before launch you'll need real vector logo files.

*What I need from you:* drop the source logo files into `assets/brand/` as SVG (or the highest-res PNG you have) when available. I can build the entire system against tokens without them and swap the marks in later — this is not a blocker.

---

## 9. The Feel, In One Paragraph

Black canvas. Enormous serif that behaves like it was set for print. Gold used like jewelry — a hairline, an edge, a monogram — never like paint. Plum for depth, blush for warmth, both in small doses. Vast empty space that says the brand is not trying to sell you anything. One aurora gradient per screen, and it lands on the thing that matters. Motion is slow, eased, and almost imperceptible. Nothing sparkles. Nothing bounces. The restraint *is* the price tag.
