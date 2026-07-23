import type { CapSize, Product, ProductOption, WholesalePricing } from "./types";

/**
 * Seed catalog. Copy is written to the Beyond Lace voice defined in
 * docs/brand/03-audience-and-aesthetics.md: elevation and reinvention, never
 * texture-and-density spec-speak. Every product leads with the transformation,
 * then earns it with the engineering underneath.
 *
 * Replace with live backend data once the commerce decision lands.
 */

const LENGTHS = [
  { label: '12"', value: "12", priceDelta: 0 },
  { label: '14"', value: "14", priceDelta: 4000 },
  { label: '16"', value: "16", priceDelta: 8000 },
  { label: '18"', value: "18", priceDelta: 13000 },
  { label: '20"', value: "20", priceDelta: 19000 },
  { label: '22"', value: "22", priceDelta: 26000 },
  { label: '24"', value: "24", priceDelta: 34000 },
  { label: '26"', value: "26", priceDelta: 44000, available: false },
];

const SHADES = [
  { label: "Natural Black", value: "natural-black", swatch: "#12100F" },
  { label: "Espresso", value: "espresso", swatch: "#2E1F1A" },
  { label: "Brunette", value: "brunette", swatch: "#5A3A28" },
  { label: "Honey Blonde", value: "honey-blonde", swatch: "#B8834A", priceDelta: 9000 },
  { label: "Platinum", value: "platinum", swatch: "#DFD3BE", priceDelta: 15000 },
];

const DENSITIES = [
  { label: "150% — Everyday", value: "150" },
  { label: "180% — Editorial", value: "180", priceDelta: 6000 },
  { label: "200% — Full Glamour", value: "200", priceDelta: 12000 },
];

/* ==========================================================================
   Launch assortment primitives
   --------------------------------------------------------------------------
   The buying directive stocks SKU *families*: one unit, a defined set of
   lengths. These helpers keep price ladders, reseller breaks and cap sizing
   derived from one place, so a margin change is one edit rather than twenty
   and the reseller structure stays internally consistent.
   ========================================================================== */

/** Length ladder in minor units, absolute from 12". Longer hair costs more. */
const LENGTH_LADDER: Record<number, number> = {
  12: 0,
  14: 3000,
  16: 6500,
  18: 10500,
  20: 15000,
  22: 20000,
  24: 26000,
  26: 33000,
  28: 41000,
};

/**
 * Build a Length option for exactly the inches a SKU family ships. The shortest
 * offered length anchors the listed price, so the ladder is always additive and
 * the advertised price is the price you can actually buy at.
 */
function lengthOption(inches: number[]): ProductOption {
  const base = LENGTH_LADDER[inches[0]];
  return {
    name: "Length",
    values: inches.map((i) => ({
      label: `${i}"`,
      value: String(i),
      priceDelta: LENGTH_LADDER[i] - base,
    })),
  };
}

const CAP_SIZE_LABEL: Record<CapSize, string> = {
  petite: 'Petite — 21" circumference',
  average: 'Average — 22.5" circumference',
  large: 'Large — 23.5" circumference',
};

/**
 * Cap sizing is a real fit axis, not a courtesy. Larger caps use more lace and
 * more hand-tying, so the large carries a genuine cost delta rather than being
 * quietly subsidised by everyone else.
 */
function capSizeOption(sizes: CapSize[]): ProductOption {
  return {
    name: "Cap size",
    values: sizes.map((s) => ({
      label: CAP_SIZE_LABEL[s],
      value: s,
      priceDelta: s === "large" ? 4000 : 0,
    })),
  };
}

/** Round to whole dollars — reseller sheets never quote cents. */
const dollars = (minor: number) => Math.round(minor / 100) * 100;

/**
 * Reseller ladder derived from retail. The directive wants the reseller and
 * creator tiers legible in the pricing structure itself, so the margin story is
 * arithmetic rather than adjectives:
 *
 *   Bronze  55% of retail   entry, at the SKU's MOQ
 *   Silver  48% of retail   25 units
 *   Gold    42% of retail   50 units
 *   MAP     90% of retail   the floor a partner may advertise
 *   Creator 65% of retail   one unit, vetted creators sampling pre-campaign
 *
 * MAP sits above every reseller break by design: a partner always has room to
 * discount toward MAP and still hold margin, and can never undercut us.
 */
function resellerPricing(retail: number, moq = 10): WholesalePricing {
  return {
    moq,
    mapPrice: dollars(retail * 0.9),
    creatorSamplePrice: dollars(retail * 0.65),
    tiers: [
      { label: "Bronze", minQty: moq, unitPrice: dollars(retail * 0.55) },
      { label: "Silver", minQty: 25, unitPrice: dollars(retail * 0.48) },
      { label: "Gold", minQty: 50, unitPrice: dollars(retail * 0.42) },
    ],
  };
}

/** Slugs of the two margin-layer kits attached by default. */
export const INSTALL_KIT_SLUG = "beyond-install-kit";
export const CARE_BUNDLE_SLUG = "beyond-wig-care-bundle";

/**
 * Every unit a customer has to attach to their head ships with the Install Kit
 * attached, and every unit ships with the Care Bundle offered. This is the
 * directive's "default cross-sell, not optional add-on" — encoded as data so
 * the cart can enforce it and a test can prove it.
 */
const UNIT_ATTACHMENTS = [INSTALL_KIT_SLUG, CARE_BUNDLE_SLUG];

export const catalog: Product[] = [
  {
    id: "bl-luxe-001",
    slug: "the-reinvention-hd-swiss-full-lace",
    sku: "BL-LUXE-001",
    title: "The Reinvention",
    line: "luxe",
    avatar: "transformation",
    tagline: "The wig you stop explaining.",
    description:
      "Hand-tied across a full HD Swiss lace cap, with knots bleached individually and a hairline plucked to sit the way your own would. The point is not that it looks like good hair. The point is that nobody asks about it.",
    price: 89500,
    compareAtPrice: 104000,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-full",
    shade: "natural-black",
    density: "180%",
    origin: "Single-donor virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS },
      { name: "Color", values: SHADES },
      { name: "Density", values: DENSITIES },
    ],
    images: [
      { src: "aurora", alt: "The Reinvention full lace unit, body wave, natural black" },
      { src: "velvet", alt: "Hairline detail showing bleached knots and plucked density" },
      { src: "plum", alt: "The Reinvention styled, three-quarter view" },
    ],
    specs: [
      { label: "Cap", value: "Full HD Swiss lace, hand-tied throughout" },
      { label: "Hairline", value: "Pre-plucked, graduated density" },
      { label: "Knots", value: "Individually bleached" },
      { label: "Hair", value: "Single-donor virgin Remy, cuticle aligned" },
      { label: "Batch guarantee", value: "Texture and tone matched across every production run" },
      { label: "Lifespan", value: "18–36 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 412,
    badges: ["Signature", "Camera-ready"],
    inStock: true,
  },
  {
    id: "bl-luxe-002",
    slug: "the-occasion-13x6-hd-frontal",
    sku: "BL-LUXE-002",
    title: "The Occasion",
    line: "luxe",
    avatar: "transformation",
    tagline: "For the day the photographs outlive the day.",
    description:
      "Built for the moments that get framed. A 13x6 HD Swiss frontal that survives flash photography, close-up video, and the second look in daylight — the three conditions where ordinary lace gives itself away.",
    price: 76500,
    compareAtPrice: 84500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-13x6",
    shade: "espresso",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS },
      { name: "Color", values: SHADES },
      { name: "Density", values: DENSITIES },
    ],
    images: [
      { src: "plum", alt: "The Occasion 13x6 frontal, straight, espresso" },
      { src: "velvet", alt: "Frontal parting space detail" },
    ],
    specs: [
      { label: "Cap", value: "13x6 HD Swiss frontal, machine-wefted back" },
      { label: "Parting", value: "6 inches deep — any part, any direction" },
      { label: "Knots", value: "Individually bleached" },
      { label: "Finish", value: "Melt-tested under flash and 4K video" },
      { label: "Lifespan", value: "12–24 months with Beyond Care maintenance" },
    ],
    rating: 4.8,
    reviewCount: 287,
    badges: ["Bestseller"],
    inStock: true,
  },
  {
    id: "bl-luxe-003",
    slug: "the-standard-glueless-bob",
    sku: "BL-LUXE-003",
    title: "The Standard",
    line: "luxe",
    avatar: "transformation",
    tagline: "Four minutes. No adhesive. No compromise.",
    description:
      "A glueless unit engineered for the woman whose morning does not have room for a wig. Pre-cut lace, adjustable band, silicone grip. It goes on in the time it takes coffee to brew and reads as an expensive salon blowout all day.",
    price: 58500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-5x5",
    shade: "natural-black",
    density: "150%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "glueless-wear-go",
    launchTier: "core",
    launchRank: 3,
    lengths: [12, 14],
    wholesale: resellerPricing(58500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([12, 14]), { name: "Color", values: SHADES.slice(0, 4) }],
    images: [
      { src: "velvet", alt: "The Standard 5x5 glueless closure bob in natural black human hair" },
      { src: "plum", alt: "Adjustable band and silicone grip detail on the 5x5 closure cap" },
    ],
    specs: [
      { label: "Cap", value: "5x5 HD closure, glueless, adjustable band" },
      { label: "Install", value: "Under 4 minutes, no adhesive required" },
      { label: "Grip", value: "Medical-grade silicone, removable" },
      { label: "Best for", value: "First wig — the least intimidating unit we make" },
      { label: "Hair", value: "Virgin Remy, cuticle aligned" },
      { label: "Lifespan", value: "12–18 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 631,
    badges: ["Low maintenance", "Bestseller", "Beginner-friendly"],
    inStock: true,
  },
  {
    id: "bl-silk-001",
    slug: "the-restoration-silk-top",
    sku: "BL-SILK-001",
    title: "The Restoration",
    line: "silk",
    avatar: "medical",
    tagline: "Made for scalps that have been through something.",
    description:
      "A silk-top cap with no lace against the skin, no adhesive required, and a breathable base built for sensitive and post-treatment scalps. Designed with the understanding that this is not a fashion purchase. It should feel like nothing, and look like it grew there.",
    price: 94500,
    currency: "USD",
    texture: "straight",
    laceType: "silk-top",
    shade: "natural-black",
    density: "150%",
    origin: "Virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS.slice(0, 5) },
      { name: "Color", values: SHADES },
      {
        name: "Cap Size",
        values: [
          { label: 'Petite (21")', value: "petite" },
          { label: 'Average (22.5")', value: "average" },
          { label: 'Large (23.5")', value: "large" },
        ],
      },
    ],
    images: [
      { src: "plum", alt: "The Restoration silk-top unit" },
      { src: "velvet", alt: "Silk base detail showing the scalp-side finish" },
    ],
    specs: [
      { label: "Cap", value: "Silk top — hair emerges from beneath, no knots visible" },
      { label: "Skin contact", value: "No lace, no adhesive, no tape required" },
      { label: "Base", value: "Breathable, hypoallergenic, seam-flat interior" },
      { label: "Fit", value: "Three cap sizes, fully adjustable" },
      { label: "Discretion", value: "Unbranded outer packaging as standard" },
    ],
    rating: 5.0,
    reviewCount: 198,
    badges: ["Sensitive scalp", "Discreet delivery"],
    inStock: true,
  },
  {
    id: "bl-men-001",
    slug: "beyond-system-one",
    sku: "BL-MEN-001",
    title: "System One",
    line: "luxe",
    avatar: "men",
    tagline: "Restoration, not replacement.",
    description:
      "A hair system built to the same tolerances as our women's units and finished to be undetectable at conversational distance. Matched to your existing density and growth pattern. Shipped in unmarked packaging. Nobody is told anything.",
    price: 82500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-full",
    density: "120%",
    origin: "Virgin Remy, cuticle intact",
    options: [
      {
        name: "Base",
        values: [
          { label: "Full lace — most natural", value: "lace" },
          { label: "Skin — most durable", value: "skin" },
          { label: "Hybrid — lace front, skin back", value: "hybrid", priceDelta: 5000 },
        ],
      },
      {
        name: "Density",
        values: [
          { label: "100% — Mature", value: "100" },
          { label: "120% — Standard", value: "120" },
          { label: "140% — Full", value: "140", priceDelta: 6000 },
        ],
      },
      { name: "Color", values: SHADES.slice(0, 3) },
    ],
    images: [
      { src: "mono", alt: "System One hair system, front hairline detail" },
      { src: "mono-2", alt: "System One base construction" },
    ],
    specs: [
      { label: "Base", value: "Full lace, skin, or hybrid" },
      {
        label: "Hairline",
        value: "Irregular, graduated — engineered against the straight-line tell",
      },
      { label: "Attachment", value: "Tape, adhesive, or clip — your choice" },
      { label: "Packaging", value: "Unmarked outer carton, no branding, plain invoice" },
      { label: "Consultation", value: "Private 1:1 fitting call included" },
    ],
    rating: 4.8,
    reviewCount: 143,
    badges: ["Discreet delivery", "Includes fitting call"],
    inStock: true,
  },
  {
    id: "bl-tryon-001",
    slug: "lace-test-kit",
    sku: "BL-TRYON-001",
    title: "The Lace Test",
    line: "try-on",
    avatar: "transformation",
    tagline: "Five dollars, so the eight hundred is never a gamble.",
    description:
      "Six lace swatches and five shade cards, sent to your door. Hold them against your skin in your own light — not a showroom's, not a ringlight's. Redeemable in full against any unit. We would rather spend five dollars than have you return eight hundred.",
    price: 500,
    currency: "USD",
    options: [],
    images: [{ src: "blush", alt: "The Lace Test kit — lace swatches and shade cards" }],
    specs: [
      { label: "Contents", value: "6 HD Swiss lace swatches, 5 shade cards" },
      { label: "Redeemable", value: "Full $5 credited against any unit purchase" },
      { label: "Shipping", value: "Free, worldwide" },
      {
        label: "Why",
        value: "Shade mismatch is the single largest cause of returns in this category",
      },
    ],
    rating: 4.9,
    reviewCount: 1840,
    badges: ["Fully redeemable", "Free shipping"],
    inStock: true,
  },
  {
    id: "bl-care-001",
    slug: "beyond-care-ritual-box",
    sku: "BL-CARE-001",
    title: "The Care Ritual",
    line: "care",
    avatar: "transformation",
    tagline: "A unit lasts as long as the hands that keep it.",
    description:
      "Sulfate-free cleanser, lace-safe conditioner, adhesive solvent, and a gold-finished carbon comb — delivered monthly. Human hair does not renew itself. Everything it will ever be, it already is. This is how you keep it.",
    price: 6800,
    currency: "USD",
    subscribable: true,
    options: [
      {
        name: "Cadence",
        values: [
          { label: "Monthly — save 20%", value: "monthly" },
          { label: "Every 2 months — save 15%", value: "bimonthly" },
          { label: "One-time", value: "once", priceDelta: 1700 },
        ],
      },
    ],
    images: [{ src: "gold", alt: "The Care Ritual monthly maintenance box" }],
    specs: [
      { label: "Contents", value: "Cleanser 250ml, conditioner 250ml, solvent 100ml, carbon comb" },
      { label: "Formulation", value: "Sulfate-free, lace-safe, colour-safe" },
      { label: "Cadence", value: "Monthly, bi-monthly, or one-time" },
      { label: "Flexibility", value: "Pause, skip, or cancel from your account, anytime" },
    ],
    rating: 4.7,
    reviewCount: 924,
    badges: ["Subscription", "Save 20%"],
    inStock: true,
  },
  {
    id: "bl-luxe-004",
    slug: "the-capsule-deep-wave",
    sku: "BL-LUXE-004",
    title: "The Capsule — Deep Wave",
    line: "luxe",
    avatar: "editorial",
    tagline: "Made in a run of two hundred. Then never again.",
    description:
      "Our manufacturing floor holds twenty percent of its capacity in reserve for exactly this. A silhouette moves on Tuesday; the sample is cut by Friday. Two hundred units, numbered, and the mould is broken.",
    price: 64500,
    currency: "USD",
    texture: "deep-wave",
    laceType: "hd-swiss-13x4",
    shade: "brunette",
    density: "200%",
    origin: "Virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS.slice(2, 7) },
      { name: "Color", values: SHADES.slice(1, 5) },
    ],
    images: [
      { src: "aurora", alt: "The Capsule deep wave unit, brunette" },
      { src: "plum", alt: "Deep wave pattern detail" },
    ],
    specs: [
      { label: "Edition", value: "200 numbered units" },
      { label: "Cap", value: "13x4 HD Swiss frontal" },
      { label: "Pattern", value: "Deep wave, steam-set, reverts after washing" },
      { label: "Restock", value: "None. Capsule runs are not repeated." },
    ],
    rating: 4.8,
    reviewCount: 96,
    badges: ["Limited — 200 units", "New"],
    inStock: true,
  },
  {
    id: "bl-luxe-005",
    slug: "the-quiet-kinky-straight",
    sku: "BL-LUXE-005",
    title: "The Quiet",
    line: "luxe",
    avatar: "transformation",
    tagline: "Texture that reads as your own, because it was matched to it.",
    description:
      "Kinky-straight, cut to blend at the leave-out rather than sit on top of it. For anyone who has spent years choosing between a wig that matches their texture and a wig that matches their standards.",
    price: 71500,
    currency: "USD",
    // The directive calls this "Kinky Straight (Yaki texture)" — the same thing
    // in trade terms. Merchandised under the name customers search for; the
    // yaki finish is carried in the spec rows rather than as a rival facet.
    texture: "kinky-straight",
    laceType: "hd-swiss-5x5",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "closure",
    launchTier: "textured",
    launchRank: 9,
    lengths: [16, 20],
    wholesale: resellerPricing(71500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      lengthOption([16, 20]),
      { name: "Color", values: SHADES.slice(0, 3) },
      { name: "Density", values: DENSITIES },
    ],
    images: [
      { src: "velvet", alt: "The Quiet yaki kinky-straight human hair closure unit" },
      { src: "plum", alt: "Leave-out blend detail on the 5x5 closure" },
    ],
    specs: [
      { label: "Cap", value: "5x5 HD closure" },
      { label: "Texture", value: "Yaki kinky-straight — reads as pressed natural hair" },
      { label: "Blend", value: "Matched at the leave-out, not layered over it" },
      { label: "Knots", value: "Individually bleached" },
      { label: "Lifespan", value: "18–30 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 355,
    badges: ["Texture match"],
    inStock: true,
  },
  {
    id: "bl-care-002",
    slug: "the-hold-lace-adhesive",
    sku: "BL-CARE-002",
    title: "The Hold",
    line: "care",
    avatar: "transformation",
    tagline: "Invisible for sixteen hours. Gone in ninety seconds.",
    description:
      "A waterproof lace adhesive that does not shine, does not flake at the hairline, and releases cleanly with our solvent instead of taking your edges with it.",
    price: 3400,
    currency: "USD",
    options: [
      {
        name: "Size",
        values: [
          { label: "38ml", value: "38" },
          { label: "80ml", value: "80", priceDelta: 2200 },
        ],
      },
    ],
    images: [{ src: "gold", alt: "The Hold lace adhesive" }],
    specs: [
      { label: "Hold", value: "Up to 16 hours, waterproof, sweat-resistant" },
      { label: "Finish", value: "Matte — no shine at the hairline" },
      { label: "Removal", value: "Clean release with Beyond Care solvent, ~90 seconds" },
      { label: "Skin", value: "Latex-free, dermatologically tested" },
    ],
    rating: 4.6,
    reviewCount: 1203,
    badges: ["Bestseller"],
    inStock: true,
  },
  {
    id: "bl-luxe-007",
    slug: "the-crown-coily-4a",
    sku: "BL-LUXE-007",
    title: "The Crown",
    line: "luxe",
    avatar: "transformation",
    tagline: "Coily, matched to the crown you already have.",
    description:
      "A tight 4C-adjacent coil that blends at the leave-out instead of arguing with it. Most brands treat textured units as an afterthought line, priced down and sampled last. This one gets the same hand-tied cap, the same individually bleached knots, and the same batch guarantee as everything else on this site — because it is not an afterthought, it is the reason a lot of people are here.",
    price: 69500,
    currency: "USD",
    texture: "kinky-curly",
    laceType: "hd-swiss-13x4",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "standard-lace",
    launchTier: "textured",
    launchRank: 8,
    lengths: [14, 18],
    wholesale: resellerPricing(69500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      lengthOption([14, 18]),
      { name: "Color", values: SHADES.slice(0, 3) },
      { name: "Density", values: DENSITIES },
    ],
    images: [
      { src: "aurora", alt: "The Crown kinky curly 4C-adjacent human hair unit in natural black" },
      { src: "velvet", alt: "4C-adjacent coil pattern and leave-out blend detail" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss frontal, hand-tied parting" },
      { label: "Pattern", value: "4C-adjacent coil, steam-set, reverts true after wash day" },
      { label: "Blend", value: "Texture-matched at the leave-out" },
      { label: "Why it exists", value: "Coil patterns the majors under-stock and under-sample" },
      { label: "Lifespan", value: "18–30 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 218,
    badges: ["Texture match", "New"],
    inStock: true,
  },
  {
    id: "bl-luxe-008",
    slug: "the-ease-natural-density",
    sku: "BL-LUXE-008",
    title: "The Ease",
    line: "luxe",
    avatar: "transformation",
    tagline: "The density your own head would have chosen.",
    description:
      "A featherweight 130% unit built for people who want hair, not a headline. No wall of density, no obvious wig-line fullness — just soft, believable coverage for anyone stepping into themselves. Glueless, breathable, and gentle enough for daily wear.",
    price: 54500,
    currency: "USD",
    texture: "straight",
    laceType: "glueless",
    shade: "natural-black",
    density: "130%",
    origin: "Virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS.slice(0, 4) },
      { name: "Color", values: SHADES.slice(0, 4) },
    ],
    images: [
      { src: "mono-2", alt: "The Ease natural-density glueless unit" },
      { src: "plum", alt: "Featherweight cap and natural density detail" },
    ],
    specs: [
      { label: "Cap", value: "Glueless, pre-cut HD lace, adjustable band" },
      { label: "Density", value: "130% — deliberately natural, never wall-of-hair" },
      { label: "Weight", value: "Under 160g at 16 inches" },
      { label: "Packaging", value: "Unbranded outer carton available at checkout" },
    ],
    rating: 4.8,
    reviewCount: 167,
    badges: ["Featherweight", "Everyday"],
    inStock: true,
  },
  {
    id: "bl-luxe-009",
    slug: "the-foundation-closure-set",
    sku: "BL-LUXE-009",
    title: "The Foundation",
    line: "bundle",
    avatar: "transformation",
    tagline: "A closure and three bundles. The stylist's raw material.",
    description:
      "A 4x4 HD closure with three batch-matched bundles — the set stylists and salons build custom units from. Every piece in the box is cut from the same production run, so the closure and the bundles agree on tone and texture without a colourist's intervention.",
    price: 39500,
    currency: "USD",
    texture: "body-wave",
    laceType: "closure-4x4",
    shade: "natural-black",
    origin: "Virgin Remy, cuticle intact, single production run per set",
    capConstruction: "wefted-bundles",
    launchTier: "core",
    launchRank: 7,
    wholesale: resellerPricing(39500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      {
        name: "Bundle Length",
        values: [
          { label: '14" / 16" / 18"', value: "14-16-18" },
          { label: '18" / 20" / 22"', value: "18-20-22", priceDelta: 12000 },
          { label: '22" / 24" / 26"', value: "22-24-26", priceDelta: 26000 },
        ],
      },
      { name: "Color", values: SHADES.slice(0, 3) },
    ],
    images: [
      { src: "gold", alt: "The Foundation 4x4 closure and three human hair bundles, body wave" },
      { src: "plum", alt: "Batch-matched human hair bundles detail" },
    ],
    specs: [
      { label: "Contents", value: "4x4 HD Swiss closure + 3 bundles, 100g each" },
      { label: "Batch rule", value: "All four pieces cut from one production run" },
      { label: "For", value: "Stylists, salons, and custom-unit builds" },
      { label: "Wholesale", value: "Salon tier pricing available — see the programme" },
    ],
    rating: 4.8,
    reviewCount: 289,
    badges: ["Stylist favourite"],
    inStock: true,
  },
  {
    id: "bl-pro-001",
    slug: "beyond-lace-pro-salon-program",
    sku: "BL-PRO-001",
    title: "Beyond Lace Pro",
    line: "pro",
    avatar: "wholesale",
    tagline: "Your salon's name on our manufacturing floor.",
    description:
      "The private-label line. Your branding, our cap construction and batch consistency guarantee. Fifty-unit minimum, custom packaging, and a turnkey asset kit so you can sell it the day it lands.",
    price: 0,
    currency: "USD",
    options: [],
    images: [{ src: "plum", alt: "Beyond Lace Pro private label programme" }],
    specs: [
      { label: "MOQ", value: "50 units" },
      { label: "Tiers", value: "Bronze, Silver, Gold — volume-based" },
      { label: "Customisation", value: "Branded packaging, combs, hang tags, inserts" },
      { label: "Assets", value: "Lifestyle photography, spec sheets, launch copy" },
      { label: "Protection", value: "MAP enforced — your margin is contractually defended" },
    ],
    rating: 5.0,
    reviewCount: 41,
    badges: ["B2B", "Application required"],
    inStock: true,
  },
  {
    id: "bl-luxe-006",
    slug: "the-arrival-platinum",
    sku: "BL-LUXE-006",
    title: "The Arrival",
    line: "luxe",
    avatar: "editorial",
    tagline: "Platinum, lifted properly, with the cuticle still intact.",
    description:
      "Most platinum units are stripped until the hair gives up. Ours is lifted in stages across nine days by colourists who work on human heads. It moves like hair because it is still, structurally, hair.",
    price: 118000,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-full",
    shade: "platinum",
    density: "150%",
    origin: "Single-donor virgin Remy, cuticle intact",
    options: [
      { name: "Length", values: LENGTHS.slice(1, 6) },
      { name: "Density", values: DENSITIES.slice(0, 2) },
    ],
    images: [
      { src: "blush", alt: "The Arrival platinum full lace unit" },
      { src: "aurora", alt: "Platinum tone and cuticle integrity detail" },
    ],
    specs: [
      { label: "Cap", value: "Full HD Swiss lace, hand-tied throughout" },
      { label: "Lift", value: "Staged over nine days, cuticle preserved" },
      { label: "Tone", value: "Cool platinum, toner refresh recommended at 8 weeks" },
      { label: "Care", value: "Purple-toning cleanser included" },
    ],
    rating: 4.7,
    reviewCount: 74,
    badges: ["Colour specialist", "Signature"],
    inStock: false,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — core credibility (ranks 1–7)
     Ranks 3 and 7 are carried by The Standard and The Foundation above.
     ======================================================================== */
  {
    id: "bl-luxe-010",
    slug: "the-signature-13x4-straight",
    sku: "BL-LUXE-010",
    title: "The Signature",
    line: "luxe",
    avatar: "transformation",
    launchTier: "core",
    launchRank: 1,
    tagline: "The unit every other unit gets measured against.",
    description:
      "A 13x4 HD lace front in natural black at 180% — the most-bought specification in the category, built to the standard the category does not meet. If a buyer is going to test us against what they already stock, this is the one they will test. It is priced and made to win that comparison.",
    price: 68500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-13x4",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "standard-lace",
    lengths: [18, 22, 26],
    wholesale: resellerPricing(68500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([18, 22, 26]), { name: "Density", values: DENSITIES.slice(1) }],
    images: [
      {
        src: "velvet",
        alt: "The Signature 13x4 HD lace front human hair wig, straight, natural black",
      },
      { src: "plum", alt: "13x4 HD lace hairline with individually bleached knots" },
      { src: "mono", alt: "The Signature straight human hair wig, three-quarter view" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss lace front" },
      { label: "Density", value: "180% — the category's working standard" },
      { label: "Knots", value: "Individually bleached" },
      { label: "Hairline", value: "Pre-plucked, graduated" },
      { label: "Lengths", value: '18", 22", 26" — one SKU family' },
      { label: "Lifespan", value: "18–30 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 168,
    badges: ["Core stock", "Bestseller"],
    inStock: true,
  },
  {
    id: "bl-luxe-011",
    slug: "the-morning-wear-and-go",
    sku: "BL-LUXE-011",
    title: "The Morning",
    line: "luxe",
    avatar: "transformation",
    launchTier: "core",
    launchRank: 2,
    tagline: "Wear and go. The whole point is that there is no ritual.",
    description:
      "A 13x6 glueless wear-and-go in body wave. Pre-cut lace, pre-plucked hairline, adjustable band and four combs — it is on your head before the kettle boils. The parting space is a full 13x6, so the convenience costs you nothing in how far back you can style it.",
    price: 79500,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-13x6",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "glueless-wear-go",
    lengths: [22, 26],
    wholesale: resellerPricing(79500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([22, 26]), { name: "Density", values: DENSITIES.slice(1) }],
    images: [
      { src: "aurora", alt: "The Morning 13x6 glueless wear and go human hair wig, body wave" },
      { src: "velvet", alt: "Glueless cap with adjustable band and combs" },
    ],
    specs: [
      { label: "Cap", value: "13x6 HD Swiss, glueless, adjustable band + 4 combs" },
      { label: "Install", value: "Under 3 minutes, no adhesive" },
      { label: "Parting", value: "Full 13x6 — deep side parts and middle parts both hold" },
      { label: "Lengths", value: '22", 26"' },
      { label: "Lifespan", value: "18–30 months with Beyond Care maintenance" },
    ],
    rating: 4.9,
    reviewCount: 203,
    badges: ["Core stock", "Glueless"],
    inStock: true,
  },
  {
    id: "bl-luxe-012",
    slug: "the-canvas-613-straight",
    sku: "BL-LUXE-012",
    title: "The Canvas",
    line: "luxe",
    avatar: "editorial",
    launchTier: "core",
    launchRank: 4,
    tagline: "613, so a colourist can make it anything.",
    description:
      "Lifted to a clean 613 over nine staged sessions rather than forced in one, because the difference between a blank canvas and a ruined one is patience. Colourists buy this to tone it themselves. It arrives even, porous in the right way, and with the cuticle still doing its job.",
    price: 84500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-13x4",
    shade: "blonde-613",
    density: "180%",
    origin: "Virgin Remy, staged lift, cuticle preserved",
    capConstruction: "standard-lace",
    lengths: [22, 26],
    wholesale: resellerPricing(84500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([22, 26])],
    images: [
      { src: "blush", alt: "The Canvas 613 blonde 13x4 lace front human hair wig, straight" },
      { src: "gold", alt: "613 blonde tone evenness and cuticle detail on human hair" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss lace front" },
      { label: "Lift", value: "Staged over nine days to a clean 613" },
      { label: "Takes colour", value: "Tones to any shade without patching" },
      { label: "Lengths", value: '22", 26"' },
      { label: "Care", value: "Purple-toning cleanser recommended from week one" },
    ],
    rating: 4.8,
    reviewCount: 96,
    badges: ["Core stock", "Colour specialist"],
    inStock: true,
  },
  {
    id: "bl-luxe-013",
    slug: "the-canvas-613-body-wave",
    sku: "BL-LUXE-013",
    title: "The Canvas, Long",
    line: "luxe",
    avatar: "editorial",
    launchTier: "core",
    launchRank: 5,
    tagline: "613 body wave, at the lengths that photograph.",
    description:
      "The same staged lift as The Canvas, carried into a body wave at 26 and 28 inches — the lengths that read on camera and the lengths colourists charge the most to create from scratch. Buy it blonde, tone it once, and skip the nine days.",
    price: 99500,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-13x6",
    shade: "blonde-613",
    density: "180%",
    origin: "Virgin Remy, staged lift, cuticle preserved",
    capConstruction: "standard-lace",
    lengths: [26, 28],
    wholesale: resellerPricing(99500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([26, 28])],
    images: [
      { src: "gold", alt: "The Canvas Long 613 blonde 13x6 human hair wig, body wave" },
      { src: "blush", alt: "613 blonde body wave human hair length and movement detail" },
    ],
    specs: [
      { label: "Cap", value: "13x6 HD Swiss frontal" },
      { label: "Lift", value: "Staged over nine days to a clean 613" },
      { label: "Lengths", value: '26", 28"' },
      { label: "Care", value: "Purple-toning cleanser; toner refresh at 8 weeks" },
    ],
    rating: 4.8,
    reviewCount: 71,
    badges: ["Core stock", "Colour specialist"],
    inStock: true,
  },
  {
    id: "bl-luxe-014",
    slug: "the-shortcut-bye-bye-knots",
    sku: "BL-LUXE-014",
    title: "The Shortcut",
    line: "luxe",
    avatar: "transformation",
    launchTier: "core",
    launchRank: 6,
    tagline: "The knots are already gone. So is the bleaching appointment.",
    description:
      "A 7x5 bye-bye-knots cap in deep wave: knots pre-treated at the factory so the hairline reads scalp-clean out of the box, glueless, and ready in minutes. It removes the two steps that make people give up on lace — bleaching knots and getting adhesive right.",
    price: 73500,
    currency: "USD",
    texture: "deep-wave",
    laceType: "hd-swiss-7x5",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "bye-bye-knots",
    lengths: [20, 24],
    wholesale: resellerPricing(73500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([20, 24])],
    images: [
      { src: "velvet", alt: "The Shortcut 7x5 bye-bye-knots glueless human hair wig, deep wave" },
      { src: "plum", alt: "Pre-treated knot-free hairline detail on 7x5 lace" },
    ],
    specs: [
      { label: "Cap", value: "7x5 bye-bye-knots, glueless" },
      { label: "Knots", value: "Pre-treated — no bleaching required" },
      { label: "Install", value: "Under 3 minutes, no adhesive" },
      { label: "Lengths", value: '20", 24"' },
      { label: "Lifespan", value: "12–24 months with Beyond Care maintenance" },
    ],
    rating: 4.8,
    reviewCount: 142,
    badges: ["Core stock", "Glueless", "New"],
    inStock: true,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — textured differentiation (ranks 10–11)
     Ranks 8 and 9 are carried by The Crown and The Quiet above.
     ======================================================================== */
  {
    id: "bl-luxe-015",
    slug: "the-spiral-finger-coil",
    sku: "BL-LUXE-015",
    title: "The Spiral",
    line: "luxe",
    avatar: "transformation",
    launchTier: "textured",
    launchRank: 10,
    tagline: "Finger-coil definition that survives wash day.",
    description:
      "A jerry-curl finger-coil pattern, steam-set so it reverts instead of relaxing into frizz the first time it meets water. This is the texture most catalogues photograph beautifully and then ship inconsistently. Ours is cut from one production run and measured against the reference batch before it leaves the floor.",
    price: 71500,
    currency: "USD",
    texture: "jerry-curl",
    laceType: "hd-swiss-13x6",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "standard-lace",
    lengths: [16, 20],
    wholesale: resellerPricing(71500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([16, 20]), { name: "Density", values: DENSITIES.slice(1) }],
    images: [
      { src: "aurora", alt: "The Spiral jerry curl finger coil human hair wig, 13x6 lace" },
      { src: "velvet", alt: "Finger coil curl pattern definition detail on human hair" },
    ],
    specs: [
      { label: "Cap", value: "13x6 HD Swiss frontal" },
      { label: "Pattern", value: "Jerry curl / finger coil, steam-set" },
      { label: "Wash day", value: "Reverts true — no re-setting required" },
      { label: "Lengths", value: '16", 20"' },
    ],
    rating: 4.8,
    reviewCount: 88,
    badges: ["Texture match", "New"],
    inStock: true,
  },
  {
    id: "bl-bundle-002",
    slug: "the-workroom-deep-wave-frontal-set",
    sku: "BL-BUNDLE-002",
    title: "The Workroom",
    line: "bundle",
    avatar: "wholesale",
    launchTier: "textured",
    launchRank: 11,
    tagline: "Three deep-wave bundles and a frontal, from one run.",
    description:
      "The textured counterpart to The Foundation: three deep-wave bundles with a 13x4 frontal, every piece cut from a single production run. Textured hair is where batch drift shows first and where most suppliers quietly fail — matching a frontal to bundles months apart is a colourist's problem nobody should be sold.",
    price: 45500,
    currency: "USD",
    texture: "deep-wave",
    laceType: "hd-swiss-13x4",
    shade: "natural-black",
    origin: "Virgin Remy, cuticle intact, single production run per set",
    capConstruction: "wefted-bundles",
    wholesale: resellerPricing(45500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      {
        name: "Bundle Length",
        values: [
          { label: '16" / 18" / 20"', value: "16-18-20" },
          { label: '20" / 22" / 24"', value: "20-22-24", priceDelta: 14000 },
          { label: '24" / 26" / 28"', value: "24-26-28", priceDelta: 29000 },
        ],
      },
    ],
    images: [
      { src: "gold", alt: "The Workroom deep wave human hair bundles with 13x4 frontal" },
      { src: "plum", alt: "Batch-matched deep wave human hair bundle detail" },
    ],
    specs: [
      { label: "Contents", value: "13x4 HD Swiss frontal + 3 bundles, 100g each" },
      { label: "Batch rule", value: "All four pieces cut from one production run" },
      { label: "For", value: "Stylists building textured custom units" },
      { label: "Wholesale", value: "Salon tier pricing available — see the programme" },
    ],
    rating: 4.8,
    reviewCount: 64,
    badges: ["Stylist favourite", "Texture match"],
    inStock: true,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — trans-affirming fit (ranks 12–14)
     The real white space. These are not restyled women's units: the cap is
     reinforced, the sizing runs larger, and the hairline is designed for a
     higher, squarer natural line rather than assumed away.
     ======================================================================== */
  {
    id: "bl-luxe-016",
    slug: "the-affirmation-reinforced-front",
    sku: "BL-LUXE-016",
    title: "The Affirmation",
    line: "luxe",
    avatar: "transformation",
    launchTier: "trans-fit",
    launchRank: 12,
    tagline: "Built for your head, not adapted to it.",
    description:
      "A reinforced 13x4 cap with a hairline designed around a higher, squarer natural line, in three real cap sizes rather than one-size-and-hope. The band is double-stitched and the perimeter is reinforced, because a unit that shifts is a unit you spend the day thinking about. Nobody should have to think about it.",
    price: 89500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-13x4",
    shade: "natural-black",
    density: "180%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "reinforced-trans-fit",
    capSizes: ["petite", "average", "large"],
    lengths: [16, 20],
    wholesale: resellerPricing(89500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      lengthOption([16, 20]),
      capSizeOption(["petite", "average", "large"]),
      { name: "Color", values: SHADES.slice(0, 3) },
    ],
    images: [
      { src: "velvet", alt: "The Affirmation reinforced cap human hair wig, straight, 13x4 lace" },
      { src: "plum", alt: "Reinforced perimeter and double-stitched band detail" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss, reinforced perimeter, double-stitched band" },
      { label: "Sizing", value: 'Petite 21", Average 22.5", Large 23.5"' },
      { label: "Hairline", value: "Designed for a higher, squarer natural line" },
      { label: "Security", value: "Holds through a full day without adjustment" },
      { label: "Fitting", value: "Free virtual fitting with every order" },
      { label: "Lengths", value: '16", 20"' },
    ],
    rating: 4.9,
    reviewCount: 57,
    badges: ["Trans-fit", "Reinforced cap", "New"],
    inStock: true,
  },
  {
    id: "bl-luxe-017",
    slug: "the-affirmation-glueless-bob",
    sku: "BL-LUXE-017",
    title: "The Affirmation, Bob",
    line: "luxe",
    avatar: "transformation",
    launchTier: "trans-fit",
    launchRank: 13,
    tagline: "Soft layers, secure cap, four minutes.",
    description:
      "The reinforced fit in its least intimidating form: a glueless bob with soft layers cut to break up a straight jawline rather than frame it. For a first unit — or for the days when you want to put something on and leave the house without a mirror check at every window.",
    price: 62500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-5x5",
    shade: "natural-black",
    density: "150%",
    origin: "Virgin Remy, cuticle intact",
    capConstruction: "reinforced-trans-fit",
    capSizes: ["petite", "average", "large"],
    lengths: [12, 14],
    wholesale: resellerPricing(62500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      lengthOption([12, 14]),
      capSizeOption(["petite", "average", "large"]),
      { name: "Color", values: SHADES.slice(0, 4) },
    ],
    images: [
      { src: "mono-2", alt: "The Affirmation glueless bob human hair wig with soft layers" },
      { src: "velvet", alt: "Soft layered bob cut and reinforced glueless cap detail" },
    ],
    specs: [
      { label: "Cap", value: "5x5 HD closure, glueless, reinforced perimeter" },
      { label: "Cut", value: "Soft layers, jaw-softening rather than jaw-framing" },
      { label: "Sizing", value: 'Petite 21", Average 22.5", Large 23.5"' },
      { label: "Install", value: "Under 4 minutes, no adhesive" },
      { label: "Lengths", value: '12", 14"' },
    ],
    rating: 4.9,
    reviewCount: 41,
    badges: ["Trans-fit", "Beginner-friendly", "New"],
    inStock: true,
  },
  {
    id: "bl-luxe-018",
    slug: "the-affirmation-balayage",
    sku: "BL-LUXE-018",
    title: "The Affirmation, Lit",
    line: "luxe",
    avatar: "transformation",
    launchTier: "trans-fit",
    launchRank: 14,
    tagline: "Fuller crown, lit hairline, reinforced cap.",
    description:
      "Balayage through a body wave, weighted heavier at the crown and brightened at the front where a hairline needs to read soft. The colour placement is doing structural work here, not decoration — it is the same trick a good fitting uses to build width where it is wanted and lose it where it is not.",
    price: 96500,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-13x6",
    shade: "honey-balayage",
    density: "200%",
    origin: "Virgin Remy, hand-painted balayage, cuticle preserved",
    capConstruction: "reinforced-trans-fit",
    capSizes: ["petite", "average", "large"],
    lengths: [20, 24],
    wholesale: resellerPricing(96500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([20, 24]), capSizeOption(["petite", "average", "large"])],
    images: [
      { src: "gold", alt: "The Affirmation Lit balayage human hair wig, body wave, 13x6 lace" },
      { src: "blush", alt: "Hand-painted balayage placement and crown density detail" },
    ],
    specs: [
      { label: "Cap", value: "13x6 HD Swiss, reinforced perimeter, 200% crown" },
      { label: "Colour", value: "Hand-painted balayage, brightened at the hairline" },
      { label: "Sizing", value: 'Petite 21", Average 22.5", Large 23.5"' },
      { label: "Fitting", value: "Free virtual fitting with every order" },
      { label: "Lengths", value: '20", 24"' },
    ],
    rating: 4.9,
    reviewCount: 33,
    badges: ["Trans-fit", "Colour specialist", "New"],
    inStock: true,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — trend colour drivers (ranks 15–17)
     ======================================================================== */
  {
    id: "bl-luxe-019",
    slug: "the-money-piece-balayage",
    sku: "BL-LUXE-019",
    title: "The Money Piece",
    line: "luxe",
    avatar: "editorial",
    launchTier: "trend-colour",
    launchRank: 15,
    tagline: "Two bright pieces at the front. That is the whole trick.",
    description:
      "Honey balayage through the mid-lengths with two deliberately brighter pieces framing the face — the single most-requested colour placement of the last three years, and the one most often done badly. Hand-painted, not foiled, so the grow-out never draws a line.",
    price: 87500,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-13x4",
    shade: "honey-balayage",
    density: "180%",
    origin: "Virgin Remy, hand-painted balayage, cuticle preserved",
    capConstruction: "standard-lace",
    lengths: [20, 24],
    wholesale: resellerPricing(87500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([20, 24])],
    images: [
      { src: "gold", alt: "The Money Piece honey balayage human hair wig, body wave" },
      { src: "blush", alt: "Face-framing money piece colour placement on human hair" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss lace front" },
      { label: "Colour", value: "Honey balayage, hand-painted, two face-framing pieces" },
      { label: "Grow-out", value: "No line — painted, not foiled" },
      { label: "Lengths", value: '20", 24"' },
    ],
    rating: 4.8,
    reviewCount: 129,
    badges: ["Trending", "Colour specialist"],
    inStock: true,
  },
  {
    id: "bl-luxe-020",
    slug: "the-ember-auburn-copper",
    sku: "BL-LUXE-020",
    title: "The Ember",
    line: "luxe",
    avatar: "editorial",
    launchTier: "trend-colour",
    launchRank: 16,
    tagline: "Auburn copper, warm enough to change your whole face.",
    description:
      "A reddish-brown copper that sits between auburn and true red — the shade that flatters the widest range of skin tones and the one people book a consultation for before they commit. Buy it already done. Toner refresh at eight weeks keeps it from going brassy.",
    price: 74500,
    currency: "USD",
    texture: "straight",
    laceType: "hd-swiss-13x4",
    shade: "auburn-copper",
    density: "180%",
    origin: "Virgin Remy, cuticle preserved",
    capConstruction: "standard-lace",
    lengths: [18, 22],
    wholesale: resellerPricing(74500),
    crossSell: UNIT_ATTACHMENTS,
    options: [
      lengthOption([18, 22]),
      {
        name: "Texture",
        values: [
          { label: "Straight", value: "straight" },
          { label: "Body Wave", value: "body-wave", priceDelta: 3000 },
        ],
      },
    ],
    images: [
      { src: "gold", alt: "The Ember auburn copper human hair wig, 13x4 lace front" },
      { src: "aurora", alt: "Auburn copper tone depth detail on human hair" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss lace front" },
      { label: "Colour", value: "Auburn copper, between warm brown and true red" },
      { label: "Available in", value: "Straight or body wave" },
      { label: "Care", value: "Colour-safe cleanser; toner refresh at 8 weeks" },
      { label: "Lengths", value: '18", 22"' },
    ],
    rating: 4.8,
    reviewCount: 112,
    badges: ["Trending", "Colour specialist"],
    inStock: true,
  },
  {
    id: "bl-luxe-021",
    slug: "the-verdict-burgundy-99j",
    sku: "BL-LUXE-021",
    title: "The Verdict",
    line: "luxe",
    avatar: "editorial",
    launchTier: "trend-colour",
    launchRank: 17,
    tagline: "99J burgundy. It comes back every year for a reason.",
    description:
      "Deep burgundy with a cool violet base, at the lengths that make it read as expensive rather than costume. 99J is the rare fashion colour that resells season after season — which is exactly why it belongs in a launch assortment rather than a capsule.",
    price: 82500,
    currency: "USD",
    texture: "body-wave",
    laceType: "hd-swiss-13x4",
    shade: "burgundy-99j",
    density: "180%",
    origin: "Virgin Remy, cuticle preserved",
    capConstruction: "standard-lace",
    lengths: [24, 26],
    wholesale: resellerPricing(82500),
    crossSell: UNIT_ATTACHMENTS,
    options: [lengthOption([24, 26])],
    images: [
      { src: "plum", alt: "The Verdict burgundy 99J human hair wig, body wave, 13x4 lace" },
      { src: "velvet", alt: "99J burgundy violet-base tone detail on human hair" },
    ],
    specs: [
      { label: "Cap", value: "13x4 HD Swiss lace front" },
      { label: "Colour", value: "99J burgundy, cool violet base" },
      { label: "Repeatability", value: "Batch-matched — reorders match the first order" },
      { label: "Lengths", value: '24", 26"' },
    ],
    rating: 4.8,
    reviewCount: 147,
    badges: ["Trending", "Repeat seller"],
    inStock: true,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — wholesale bulk (rank 18)
     ======================================================================== */
  {
    id: "bl-pro-002",
    slug: "the-first-order-reseller-pack",
    sku: "BL-PRO-002",
    title: "The First Order",
    line: "pro",
    avatar: "wholesale",
    launchTier: "wholesale-bulk",
    launchRank: 18,
    tagline: "Five units. One decision. No fifty-piece leap of faith.",
    description:
      "A five-unit assorted pack at pre-set lengths — two natural black straight, two body wave, one 613 blonde — built as a low-friction first order for a small wig business testing us as a supplier. Fifty units is the right MOQ once you trust a factory. This is how you find out whether you should.",
    price: 245000,
    compareAtPrice: 312000,
    currency: "USD",
    origin: "Virgin Remy, cuticle intact, single production run per pack",
    wholesale: {
      moq: 1,
      mapPrice: 294000,
      // No creator sample tier: this pack IS the low-friction entry point.
      tiers: [
        { label: "Starter", minQty: 1, unitPrice: 245000 },
        { label: "Bronze", minQty: 4, unitPrice: 228000 },
        { label: "Silver", minQty: 10, unitPrice: 210000 },
      ],
    },
    options: [
      {
        name: "Length set",
        values: [
          { label: 'Short — 14" to 18"', value: "short" },
          { label: 'Mid — 18" to 22"', value: "mid", priceDelta: 18000 },
          { label: 'Long — 22" to 26"', value: "long", priceDelta: 39000 },
        ],
      },
    ],
    images: [
      { src: "mono", alt: "The First Order five-unit assorted human hair wig reseller pack" },
      { src: "gold", alt: "Assorted human hair wig units in a reseller starter pack" },
    ],
    specs: [
      { label: "Contents", value: "5 units — 2 straight 1B, 2 body wave 1B, 1 613 blonde" },
      { label: "MOQ", value: "One pack. No fifty-unit commitment to start." },
      { label: "Per-unit", value: "Works out around $490 — below our Bronze single-SKU break" },
      { label: "Batch rule", value: "All five cut from one production run" },
      { label: "Next step", value: "Reorder at Bronze, Silver or Gold on any single SKU" },
      { label: "MAP", value: "Protected — partners cannot be undercut on these units" },
    ],
    rating: 4.9,
    reviewCount: 38,
    badges: ["Wholesale", "Low-friction first order"],
    inStock: true,
  },

  /* ========================================================================
     LAUNCH ASSORTMENT — accessory margin layer (ranks 19–20)
     These are the attach-rate drivers. They are deliberately priced under the
     sum of their parts (the adhesive alone retails at $34) because the margin
     case is attach rate on every unit sold, not standalone kit revenue.
     ======================================================================== */
  {
    id: "bl-kit-001",
    slug: INSTALL_KIT_SLUG,
    sku: "BL-KIT-001",
    title: "The Install Kit",
    line: "kit",
    avatar: "transformation",
    launchTier: "accessory",
    launchRank: 19,
    tagline: "Everything the unit needs and nothing it does not.",
    description:
      "Waterproof lace adhesive, lace tape, melting spray and a wig grip band. Four things, and the reason most first installs fail is not owning all four. It attaches to every glueless unit by default because sending someone a $700 wig and letting them find out at home is not a service.",
    price: 4000,
    compareAtPrice: 6200,
    currency: "USD",
    options: [
      {
        name: "Hold",
        values: [
          { label: "Everyday — 3 to 5 days", value: "everyday" },
          { label: "Extended — 10 to 14 days", value: "extended", priceDelta: 900 },
        ],
      },
    ],
    images: [
      { src: "mono-2", alt: "The Install Kit — lace adhesive, tape, melting spray and grip band" },
      { src: "mono", alt: "Wig install kit contents laid out" },
    ],
    specs: [
      { label: "Contents", value: "Waterproof lace glue, lace tape, melting spray, grip band" },
      { label: "Attaches to", value: "Every glueless and lace unit, by default" },
      { label: "Sensitivity", value: "Latex-free; patch test card included" },
      { label: "Value", value: "Priced under the sum of its parts — deliberately" },
    ],
    rating: 4.8,
    reviewCount: 486,
    badges: ["Default attach", "Bestseller"],
    inStock: true,
  },
  {
    id: "bl-kit-002",
    slug: CARE_BUNDLE_SLUG,
    sku: "BL-KIT-002",
    title: "The Care Bundle",
    line: "kit",
    avatar: "transformation",
    launchTier: "accessory",
    launchRank: 20,
    tagline: "The difference between twelve months and thirty.",
    description:
      "A multi-pack of mesh wig caps, a stand, and a storage and travel bag. Human hair does not renew itself: what decides whether a unit lasts a year or three is whether it was stored on a stand or in a drawer. Sold as an add-on, given as a gift-with-purchase, and stocked by every retailer we supply.",
    price: 4800,
    compareAtPrice: 7100,
    currency: "USD",
    subscribable: true,
    options: [
      {
        name: "Cap pack",
        values: [
          { label: "3 mesh caps", value: "3" },
          { label: "6 mesh caps", value: "6", priceDelta: 900 },
          { label: "12 mesh caps — retailer pack", value: "12", priceDelta: 2200 },
        ],
      },
    ],
    images: [
      { src: "mono", alt: "The Care Bundle — mesh wig caps, wig stand and storage travel bag" },
      { src: "mono-2", alt: "Wig care bundle storage and travel bag detail" },
    ],
    specs: [
      { label: "Contents", value: "Mesh wig caps, wig stand, storage and travel bag" },
      { label: "Extends lifespan", value: "Stand storage is the single biggest factor" },
      { label: "Retail", value: "12-cap pack sized for resellers and gift-with-purchase" },
      { label: "Subscription", value: "Available on the Beyond Care cycle" },
    ],
    rating: 4.7,
    reviewCount: 402,
    badges: ["Default attach", "Gift-with-purchase"],
    inStock: true,
  },
];
