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
