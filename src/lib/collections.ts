import type { ProductQuery, Shade } from "@/lib/commerce";

/**
 * Collection registry — the shelf-front taxonomy.
 *
 * Each collection is a named, SEO-addressable slice of the catalogue at
 * /collections/[slug], surfaced on the home rail and the mega-menu. A collection
 * is defined by a base `query` (filter-based) or a `select` keyword (New /
 * Bestsellers, which no single filter expresses), plus the editorial a
 * conversion page needs: an intro, and its own FAQ set. The construction,
 * texture and care guidance is brand-level and shared (below), so every page
 * carries substantial, honest copy without duplicating essays.
 *
 * Slugs and queries are derived from real catalogue attributes, so no collection
 * ever renders an empty grid. Imagery uses the on-brand gradient placeholders
 * (ProductImage) until the shoot lands — the brand's photographic system is
 * locked to hair only.
 */

/** Every shade that is not the natural-black default — the "colour" grouping. */
const COLOURED_SHADES: Shade[] = [
  "espresso",
  "brunette",
  "honey-blonde",
  "platinum",
  "custom-fashion",
  "blonde-613",
  "honey-balayage",
  "auburn-copper",
  "burgundy-99j",
];

/** Which refine groups the collection page exposes in its filter rail. */
export type RefineKey = "texture" | "lace" | "shade" | "fit";

export interface CollectionFaq {
  q: string;
  a: string;
}

export interface Collection {
  slug: string;
  /** Short label for the home rail card. */
  label: string;
  eyebrow: string;
  /** H1 on the collection page. */
  title: string;
  /** Optional italic second line of the H1. */
  titleItalic?: string;
  /** Hero body. */
  tagline: string;
  /** Gradient placeholder key for the card + hero. */
  cardImage: string;
  metaDescription: string;
  /** Base filter that defines the collection. */
  query?: ProductQuery;
  /** Special selection a single filter cannot express. */
  select?: "new" | "bestsellers";
  /** Refine groups shown in the filter rail (default: texture, shade). */
  refine?: RefineKey[];
  /** One-paragraph SEO intro under the grid. */
  intro: string;
  faqs: CollectionFaq[];
}

export const collections: Collection[] = [
  {
    slug: "new-in",
    label: "New In",
    eyebrow: "Just landed",
    title: "New in.",
    titleItalic: "Freshly cut, first to ship.",
    tagline:
      "The most recent units to come off the floor — new textures, new caps, new colour work, batch-matched and ready to reorder.",
    cardImage: "aurora",
    metaDescription:
      "New arrivals at Beyond Lace: the latest HD Swiss lace human hair wigs, glueless units and colour work, freshly cut and batch-matched.",
    select: "new",
    refine: ["texture", "shade"],
    intro:
      "New in is where a texture proves itself before it earns a permanent place in the collection. Everything here is the same virgin Remy human hair, individually bleached knots and pre-plucked hairline as the rest of the range — it has simply arrived most recently.",
    faqs: [
      {
        q: "How often do new units drop?",
        a: "New units land in small, numbered runs rather than a seasonal calendar. The moment a silhouette moves, we cut a sample and it appears here first.",
      },
      {
        q: "Are new arrivals batch-guaranteed like the rest?",
        a: "Yes. Every unit — new or established — is cut from a single production run and matched to its reference batch, so a reorder in eighteen months matches the one you buy today.",
      },
    ],
  },
  {
    slug: "bestsellers",
    label: "Bestsellers",
    eyebrow: "Most reordered",
    title: "The units people",
    titleItalic: "come back for.",
    tagline:
      "Ranked by what actually reorders. These are the caps and textures our customers install, review, and buy again — the safest place to start.",
    cardImage: "gold",
    metaDescription:
      "Beyond Lace bestselling human hair wigs — the most reviewed, most reordered HD lace units. The safest place to start.",
    select: "bestsellers",
    refine: ["texture", "lace", "shade"],
    intro:
      "A bestseller here is not a marketing badge — it is the unit with the deepest review history and the highest reorder rate. If you are buying your first Beyond Lace unit and want the shortest path to a result you have already seen on other people, start on this shelf.",
    faqs: [
      {
        q: "What makes a unit a bestseller?",
        a: "Review volume and reorder rate, not paid placement. The ranking reflects units customers keep coming back for.",
      },
      {
        q: "Are bestsellers beginner-friendly?",
        a: "Most are. The glueless and 13x4 frontal units in particular are built to go on with minimal work, which is part of why they reorder so well.",
      },
    ],
  },
  {
    slug: "glueless-wigs",
    label: "Glueless Wigs",
    eyebrow: "Wear & go",
    title: "Glueless.",
    titleItalic: "On in four minutes, no adhesive.",
    tagline:
      "Pre-plucked, pre-bleached, elastic-band and clip-secured units you can put on and walk out in — no glue, no melt, no appointment.",
    cardImage: "velvet",
    metaDescription:
      "Glueless human hair wigs from Beyond Lace: pre-plucked, wear-and-go HD lace units that go on in minutes with no adhesive.",
    query: { capConstruction: ["glueless-wear-go", "bye-bye-knots"] },
    refine: ["texture", "shade"],
    intro:
      "A glueless unit does the two hardest parts for you before it ships: the knots are already bleached through the parting and the hairline is already plucked. An adjustable band and clips do the rest, so the unit goes on flat and secure in minutes and comes off in ninety seconds without lifting your own edges.",
    faqs: [
      {
        q: "Will a glueless wig actually stay on?",
        a: "Yes — the adjustable band and combs hold it through a full day. For workouts or a week-long install you can still add adhesive, but none is required for daily wear.",
      },
      {
        q: "Is the hairline pre-plucked?",
        a: "Every glueless unit ships with a pre-plucked, natural-density hairline and bleached knots, so it reads as scalp straight out of the box.",
      },
      {
        q: "Can I still customise a glueless unit?",
        a: "You can cut the lace, tint it to your skin tone, and style the parting. What you cannot undo is the plucking — so we keep it natural rather than over-thinned.",
      },
    ],
  },
  {
    slug: "hd-full-lace",
    label: "HD Full Lace",
    eyebrow: "The invisible cap",
    title: "HD full lace.",
    titleItalic: "Part it anywhere.",
    tagline:
      "Swiss HD lace across the entire cap — a scalp-melt so thin you can part it in any direction and wear it up without a seam showing.",
    cardImage: "plum",
    metaDescription:
      "HD Swiss full lace human hair wigs from Beyond Lace — an undetectable cap you can part anywhere and wear in an updo.",
    query: { laceType: ["hd-swiss-full"] },
    refine: ["texture", "shade"],
    intro:
      "Full lace is the construction you buy when the parting has to move — an updo, a centre part today and a deep side part tomorrow, a ponytail that shows the perimeter. The whole cap is HD Swiss lace with knots bleached individually through it, which is why it disappears where a frontal would show a track.",
    faqs: [
      {
        q: "Full lace vs a frontal — which do I need?",
        a: "Choose full lace if you want to wear updos or move the parting freely. A 13x6 or 13x4 frontal is more affordable and plenty if you part in the front third and rarely go up.",
      },
      {
        q: "Is HD lace more fragile?",
        a: "HD lace is thinner, so it melts more invisibly but wants a gentler hand. Ours is reinforced at the stress points, but treat the knots kindly and it lasts.",
      },
    ],
  },
  {
    slug: "13x6-hd-frontals",
    label: "13x6 Frontals",
    eyebrow: "Deep parting",
    title: "13x6 HD frontals.",
    titleItalic: "Six inches of parting space.",
    tagline:
      "A frontal deep enough to part six inches back — the versatility of a full lace look at a frontal's price, with a pre-plucked HD hairline.",
    cardImage: "mono-2",
    metaDescription:
      "13x6 HD lace frontal human hair wigs from Beyond Lace — six inches of parting depth with a pre-plucked, undetectable hairline.",
    query: { laceType: ["hd-swiss-13x6"] },
    refine: ["texture", "shade"],
    intro:
      "The 13x6 gives you six inches of parting depth against the 13x4's four — enough for a dramatic middle part, a deep side part, or a small bun at the front without the lace running out. It is the frontal to choose when you want parting freedom but do not need a full-lace updo.",
    faqs: [
      {
        q: "What does 13x6 mean?",
        a: "The lace panel is 13 inches ear-to-ear and 6 inches front-to-back, so you can part up to six inches deep and still land on lace, not wefts.",
      },
      {
        q: "Is 13x6 worth it over 13x4?",
        a: "If you part deep or wear the hair off your face, yes. If you keep a shallow front parting, the 13x4 saves money for the same front-facing result.",
      },
    ],
  },
  {
    slug: "13x4-frontal-wigs",
    label: "13x4 Frontals",
    eyebrow: "Ear to ear",
    title: "13x4 frontals.",
    titleItalic: "The everyday workhorse.",
    tagline:
      "Ear-to-ear lace, a natural front parting, and the most-stocked construction we run — the reliable default for a front-facing style.",
    cardImage: "blush",
    metaDescription:
      "13x4 HD lace frontal human hair wigs from Beyond Lace — ear-to-ear lace with a natural, pre-plucked front parting.",
    query: { laceType: ["hd-swiss-13x4"] },
    refine: ["texture", "shade"],
    intro:
      "The 13x4 is the construction most people actually need: thirteen inches of lace ear-to-ear with four inches of parting depth, which covers a middle or side part and a face-framing style without paying for lace you will not use. It is the deepest-stocked cap we run, so it is also where the widest choice of texture and colour lives.",
    faqs: [
      {
        q: "Is a 13x4 frontal beginner-friendly?",
        a: "It is one of the easiest to wear. The hairline is pre-plucked and the knots pre-bleached, so most people install it with a band and a little lace tint.",
      },
      {
        q: "How far back can I part it?",
        a: "Up to about four inches. For deeper parts or updos, size up to a 13x6 or a full lace.",
      },
    ],
  },
  {
    slug: "body-wave-wigs",
    label: "Body Wave",
    eyebrow: "Soft movement",
    title: "Body wave.",
    titleItalic: "The wave that reads as a blow-out.",
    tagline:
      "A loose, glossy S-wave that photographs like a fresh salon blow-out and returns to pattern after every wash — our most-reached-for texture.",
    cardImage: "aurora",
    metaDescription:
      "Body wave human hair wigs from Beyond Lace — a soft, glossy S-wave that reads as a blow-out and bounces back after every wash.",
    query: { texture: ["body-wave"] },
    refine: ["lace", "shade"],
    intro:
      "Body wave is the texture that flatters almost everyone: enough movement to look effortless, not so much that it needs daily definition. Because it is virgin human hair, you can wrap it straight or scrunch the wave back — and it returns to its pattern after a wash rather than dropping flat.",
    faqs: [
      {
        q: "Will the wave hold after washing?",
        a: "Yes. It is a permanent wave pattern in virgin hair, so it returns after every wash. Air-dry or diffuse to bring it back fastest.",
      },
      {
        q: "Can I straighten body wave?",
        a: "You can flat-iron it bone-straight and it reverts to wave on the next wash — one unit, two looks.",
      },
    ],
  },
  {
    slug: "straight-wigs",
    label: "Straight",
    eyebrow: "Sleek & sharp",
    title: "Straight.",
    titleItalic: "Bone-straight, mirror finish.",
    tagline:
      "From a soft natural straight to a sharp bone-straight press — the cleanest way to show off length, shine, and a healthy cuticle.",
    cardImage: "gold",
    metaDescription:
      "Straight human hair wigs from Beyond Lace — natural straight to bone-straight, with a mirror finish that shows cuticle-aligned quality.",
    query: { texture: ["straight"] },
    refine: ["lace", "shade"],
    intro:
      "Straight hair hides nothing, which is exactly why it is the honest test of quality — every split cuticle or silicone coating shows. Ours is cuticle-aligned virgin Remy, so the shine is the hair's own and it stays sleek from root to end without a mid-length frizz line.",
    faqs: [
      {
        q: "Bone-straight or natural straight?",
        a: "Natural straight has a slight body and reads softest; bone-straight is pressed sharp and glassy. Both are the same hair — the finish is how it is styled.",
      },
      {
        q: "Will heat damage it?",
        a: "It is human hair, so it takes heat like your own. Use a heat protectant and keep the iron under 200°C to protect the cuticle over time.",
      },
    ],
  },
  {
    slug: "deep-wave-wigs",
    label: "Deep Wave",
    eyebrow: "Defined curl",
    title: "Deep wave.",
    titleItalic: "Wet-look definition, dry-hand hold.",
    tagline:
      "A tight, defined wave with real depth — the texture for volume, a wet-look finish, and a curl that survives to wash day.",
    cardImage: "velvet",
    metaDescription:
      "Deep wave human hair wigs from Beyond Lace — a defined, voluminous curl with a wet-look finish that holds to wash day.",
    query: { texture: ["deep-wave"] },
    refine: ["lace", "shade"],
    intro:
      "Deep wave is the texture you choose for volume and drama — a defined, springy wave that reads full without teasing and takes a wet-look gel beautifully. Keep it hydrated and scrunch rather than brush, and the pattern stays crisp from install to wash day.",
    faqs: [
      {
        q: "How do I keep deep wave from frizzing?",
        a: "Never brush it dry. Detangle wet with conditioner and fingers, scrunch in a leave-in, and refresh with a water-and-conditioner mist between washes.",
      },
      {
        q: "Does deep wave shrink the length?",
        a: "Curl pattern takes up length, so a 20-inch deep wave reads shorter than a 20-inch straight. Size up two inches if you want the same visual length.",
      },
    ],
  },
  {
    slug: "coloured-wigs",
    label: "Colored Wigs",
    eyebrow: "Beyond natural black",
    title: "Colour.",
    titleItalic: "Lifted properly, cuticle intact.",
    tagline:
      "613 blonde, honey balayage, auburn copper, burgundy 99J and custom colour — lifted on virgin hair so the tone is rich and the cuticle survives.",
    cardImage: "blush",
    metaDescription:
      "Coloured human hair wigs from Beyond Lace — 613 blonde, balayage, copper and burgundy, lifted on virgin hair with the cuticle intact.",
    query: { shade: COLOURED_SHADES },
    refine: ["texture", "lace"],
    intro:
      "Colour is where cheap hair falls apart — over-processed lift leaves the cuticle stripped and the ends straw-dry. Ours is lifted slowly on virgin hair, so a 613 blonde tones cleanly to any shade a colourist wants and a burgundy reads deep rather than flat. Every colour unit is still the same batch-matched hair underneath.",
    faqs: [
      {
        q: "Can I tone or dye a 613 unit myself?",
        a: "That is the point of 613 — it is a blank blonde canvas. A colourist (or a careful home toner) can take it to almost any shade. Deposit-only colour is safest.",
      },
      {
        q: "Will coloured hair be dry or brittle?",
        a: "Not if it was lifted properly. Because we process slowly on virgin hair, the cuticle stays intact — but colour hair always wants more conditioning than natural black.",
      },
    ],
  },
  {
    slug: "closures-and-bundles",
    label: "Closures & Bundles",
    eyebrow: "The stylist's raw material",
    title: "Closures & bundles.",
    titleItalic: "Build it your way.",
    tagline:
      "Wefted bundles with matching 5x5 and 4x4 closures — cut from one production run so the sew-in matches from crown to hem.",
    cardImage: "mono",
    metaDescription:
      "Human hair bundles and closures from Beyond Lace — wefted bundles with matching 5x5 and 4x4 closures, cut from one batch for a seamless sew-in.",
    query: { laceType: ["hd-swiss-5x5", "closure-4x4"] },
    refine: ["texture", "shade"],
    intro:
      "For a sew-in, the risk is always the match — bundles from one lot and a closure from another that reads a shade off. We solve it by cutting the closure and its bundles from a single production run, so the install is one continuous head of hair rather than three pieces pretending to agree.",
    faqs: [
      {
        q: "5x5 or 4x4 closure?",
        a: "A 5x5 gives more parting room and a slightly more versatile part; a 4x4 is a touch more affordable for a simple middle or side part. Both match our bundles.",
      },
      {
        q: "How many bundles do I need?",
        a: "For most lengths up to 20 inches, three bundles and a closure fill a full head. Add a fourth bundle from 22 inches up.",
      },
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/** Collections shown on the home rail and /collections index, in order. */
export const homeCollections = collections;
