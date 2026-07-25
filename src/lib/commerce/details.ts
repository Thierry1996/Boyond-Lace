import type { Product } from "./types";
import { LACE_META, TEXTURE_META, COLOR_META } from "./variations";

/**
 * Extended product-detail sheet.
 *
 * The "Specification" section publishes the load-bearing construction; this is
 * the full spec list a considered buyer reads before an $800 decision, derived
 * from the product's structured fields so every listing exposes the same rows in
 * the same order rather than whatever prose the copy happened to include.
 */

export interface DetailRow {
  label: string;
  value: string;
}

const LACE_MATERIAL: Record<string, string> = {
  "hd-swiss-full": "HD Swiss lace",
  "hd-swiss-13x6": "HD Swiss lace",
  "hd-swiss-13x4": "HD Swiss lace",
  "hd-swiss-7x5": "HD Swiss, knotless front",
  "hd-swiss-5x5": "Transparent Swiss lace",
  "closure-4x4": "Transparent Swiss lace",
  "silk-top": "Silk top, hidden knots",
  glueless: "HD Swiss lace",
};

const PARTING: Record<string, string> = {
  "hd-swiss-full": "Any part, any direction",
  "hd-swiss-13x6": "Deep parts, middle or side",
  "hd-swiss-13x4": "Middle or side part",
  "hd-swiss-7x5": "Middle or side part",
  "hd-swiss-5x5": "Middle or side part",
  "closure-4x4": "Middle or side part",
  "silk-top": "Middle or side part",
  glueless: "Middle or side part",
};

const INSTALL: Record<string, string> = {
  "glueless-wear-go": "Glueless — wear and go",
  "bye-bye-knots": "Glueless, pre-bleached knots",
  "reinforced-trans-fit": "Glueless, reinforced band",
  closure: "Glueless closure",
  "standard-lace": "Adhesive or glueless",
  "wefted-bundles": "Sew-in / custom install",
};

const MAINTENANCE: Record<string, string> = {
  straight: "Low",
  "body-wave": "Low to moderate",
  "deep-wave": "Moderate",
  "kinky-straight": "Low to moderate",
  "kinky-curly": "Moderate",
  yaki: "Low to moderate",
  "jerry-curl": "Moderate",
  "water-wave": "Moderate",
  curly: "Moderate",
};

/** Build the ordered detail sheet from a product's structured attributes. */
export function deriveProductDetails(product: Product): DetailRow[] {
  const rows: DetailRow[] = [];
  const push = (label: string, value: string | undefined) => {
    if (value) rows.push({ label, value });
  };

  const is613 = product.shade === "blonde-613";

  push(
    "Installation method",
    product.capConstruction ? INSTALL[product.capConstruction] : undefined,
  );
  push(
    "Circumference",
    product.capSizes?.length
      ? `${product.capSizes.length} cap sizes (petite–large)`
      : 'Fits all head sizes (21.5"–22.5", adjustable)',
  );
  push("Material", "100% virgin Remy human hair");
  push("Hairstyle design", product.texture ? TEXTURE_META[product.texture] : undefined);
  push(
    "Dye compatibility",
    is613 ? "Pre-lightened — tones to any shade" : "Colour-safe; lifts to 613",
  );
  push("Hair texture", product.texture ? TEXTURE_META[product.texture] : undefined);
  push("Hair color", product.shade ? COLOR_META[product.shade]?.label : undefined);
  push("Hair smell", "No chemical smell");
  push("Cap construction", product.laceType ? `${LACE_META[product.laceType]} cap` : undefined);
  push("Lace size", product.laceType ? LACE_META[product.laceType] : undefined);
  push("Lace material", product.laceType ? LACE_MATERIAL[product.laceType] : undefined);
  push("Parting flexibility", product.laceType ? PARTING[product.laceType] : undefined);
  push("Collection", product.badges[0]);
  push(
    "Cap type",
    product.capConstruction === "reinforced-trans-fit"
      ? "Reinforced perimeter, double-stitched band"
      : "Adjustable band with combs",
  );
  push(
    "Lifespan",
    product.specs.find((s) => /lifespan/i.test(s.label))?.value ?? "18–30 months with Beyond Care",
  );
  push("Maintenance level", product.texture ? MAINTENANCE[product.texture] : "Low to moderate");
  push("Styling versatility", "Heat-friendly to 180°C / 356°F");
  push("Density", product.density);
  push("Origin", product.origin);

  return rows;
}

/** Length band from the SKU family's longest offered inch. */
function lengthBand(product: Product): string {
  const max = Math.max(...(product.lengths ?? [22]));
  if (max >= 24) return "Long";
  if (max >= 16) return "Medium to long";
  return "Short to medium";
}

/** The private-label / OEM feature line from cap construction. */
function featureLine(product: Product): string {
  const parts = ["pre-plucked hairline", "bleached knots"];
  if (
    product.capConstruction?.startsWith("glueless") ||
    product.capConstruction === "bye-bye-knots"
  )
    parts.unshift("glueless");
  if (product.laceType?.startsWith("hd-swiss")) parts.push("HD melt lace");
  return parts.join(", ");
}

export interface KeyAttributes {
  /** The full paired attribute table. */
  rows: DetailRow[];
  /** A short subset for the quick "at a glance" view. */
  glance: DetailRow[];
  /** Bolded feature highlights for the quick view. */
  highlights: Array<{ title: string; body: string }>;
}

/**
 * Trade "key attributes" — the exhaustive attribute grid a wholesale buyer
 * scans, plus a quick-glance subset and headline highlights for experienced
 * buyers who do not need the full table. Extends the retail detail sheet with
 * the private-label, sourcing and MOQ facts that only matter to a stockist.
 */
export function deriveKeyAttributes(product: Product): KeyAttributes {
  const lace = product.laceType;
  const rows: DetailRow[] = [
    { label: "Lace wig type", value: lace ? LACE_META[lace] : "Lace front" },
    { label: "Wigs length type", value: lengthBand(product) },
    { label: "Human hair type", value: product.origin ?? "Virgin Remy human hair" },
    { label: "Hair grade", value: "Virgin Remy, cuticle-aligned" },
    { label: "Lace material", value: lace ? LACE_MATERIAL[lace] : "HD Swiss lace" },
    { label: "Colour of lace", value: "Transparent, HD, medium & dark brown" },
    { label: "Density", value: "150%, 180%, 200%" },
    { label: "Feature", value: featureLine(product) },
    { label: "Suitable dyeing colours", value: "All colours (virgin, undyed)" },
    {
      label: "Cap size",
      value: product.capSizes?.length ? "Petite, average, large" : "Average (adjustable)",
    },
    { label: "Cap construction", value: "13×4 · 4×4 · 13×6 · 5×5 · 6×6 · 360 · full lace" },
    { label: "Bleach knots", value: "Tiny single knots, melt-skin film lace" },
    { label: "Wig style", value: "Straight, body wave, deep wave, curly, kinky, yaki" },
    { label: "Unit weight", value: "175–500g by length" },
    { label: "Quality", value: "No shedding, no tangling, long-lasting" },
    { label: "Virgin hair", value: "Unprocessed — can be dyed and bleached" },
    { label: "Model number", value: product.sku },
    { label: "Place of origin", value: "Xuchang, Henan, China" },
    { label: "Brand", value: "Beyond Lace · OEM / private label available" },
    { label: "Customized logo", value: "Free custom logo service" },
    { label: "Customized packaging", value: "Tag, label, box, bag — your branding" },
    { label: "Wrap", value: "Private-label packaging box" },
    { label: "Advantage", value: "Batch-matched, large quantities in stock" },
    { label: "MOQ", value: "50 units, MAP-protected" },
    { label: "Shipping", value: "Within 72 hours in stock; 2–4 days customised" },
  ];

  // Six attributes an experienced buyer scans first.
  const glanceLabels = [
    "Human hair type",
    "Wigs length type",
    "Feature",
    "Lace wig type",
    "Lace material",
    "Density",
  ];
  const glance = glanceLabels
    .map((l) => rows.find((r) => r.label === l))
    .filter((r): r is DetailRow => Boolean(r));

  const highlights = [
    {
      title: "100% unprocessed virgin hair",
      body: "High quality and natural — dye, bleach or restyle to any specific need.",
    },
    {
      title: lace?.startsWith("hd-swiss") ? "HD melt lace" : "Premium Swiss lace",
      body: "Mimics the scalp for an undetectable hairline that survives flash and 4K video.",
    },
    {
      title: "Batch-consistent construction",
      body: "Every run is cut from one production batch — reorders match the units on your shelf.",
    },
  ];

  return { rows, glance, highlights };
}
