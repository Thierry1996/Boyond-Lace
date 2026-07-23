import type { LaceType, Product, ProductOption, Shade, Texture } from "./types";

/**
 * Canonical variation taxonomy.
 *
 * Every wig in the industry is chosen along the same five axes — style, lace,
 * colour, length, density — and the storefront must present them the same way
 * on every listing, or the catalogue reads as a pile of one-off products. This
 * module is the single source of truth for the labels and swatches of those
 * axes, and `deriveVariations` normalises any product into that shared shape,
 * whatever its raw `options` happen to be named.
 */

/** Fixed order every listing renders axes in. */
export type VariationAxis = "style" | "lace" | "color" | "length" | "density" | "other";

const AXIS_ORDER: VariationAxis[] = ["style", "lace", "color", "length", "density", "other"];

export const AXIS_LABEL: Record<VariationAxis, string> = {
  style: "Style",
  lace: "Lace",
  color: "Color",
  length: "Length",
  density: "Density",
  other: "Options",
};

/** Colour swatches for every shade we sell. 613 and balayage read as gradients. */
export const COLOR_META: Record<Shade, { label: string; swatch: string }> = {
  "natural-black": { label: "Natural Black", swatch: "#12100F" },
  espresso: { label: "Espresso", swatch: "#2E1F1A" },
  brunette: { label: "Brunette", swatch: "#5A3A28" },
  "honey-blonde": { label: "Honey Blonde", swatch: "#B8834A" },
  "honey-balayage": {
    label: "Honey Balayage",
    swatch: "linear-gradient(135deg, #2E1F1A 0%, #2E1F1A 42%, #C69A5B 100%)",
  },
  "auburn-copper": { label: "Auburn Copper", swatch: "#7E3B23" },
  "burgundy-99j": { label: "Burgundy 99J", swatch: "#4A1220" },
  "blonde-613": { label: "613 Blonde", swatch: "#E6C98A" },
  platinum: { label: "Platinum", swatch: "#DFD3BE" },
  "custom-fashion": {
    label: "Custom Fashion",
    swatch: "linear-gradient(135deg, #5A2D67 0%, #DCA8B7 50%, #C9A66B 100%)",
  },
};

export const LACE_META: Record<LaceType, string> = {
  "hd-swiss-full": "Full Lace",
  "hd-swiss-13x6": "13×6 Frontal",
  "hd-swiss-13x4": "13×4 Frontal",
  "hd-swiss-7x5": "7×5 Bye-Bye-Knots",
  "hd-swiss-5x5": "5×5 Closure",
  "closure-4x4": "4×4 Closure",
  "silk-top": "Silk Top",
  glueless: "Glueless",
};

export const TEXTURE_META: Record<Texture, string> = {
  straight: "Straight",
  "body-wave": "Body Wave",
  "deep-wave": "Deep Wave",
  curly: "Curly",
  "kinky-straight": "Kinky Straight",
  "kinky-curly": "Kinky Curly",
  "water-wave": "Water Wave",
  "jerry-curl": "Jerry Curl",
  yaki: "Yaki",
};

/** Which axis a raw option name maps to, so mixed legacy names still normalise. */
function axisForOption(name: string): VariationAxis {
  const n = name.toLowerCase();
  if (n.includes("color") || n.includes("colour") || n.includes("shade")) return "color";
  if (n.includes("length")) return "length";
  if (n.includes("density")) return "density";
  if (n.includes("texture") || n.includes("style")) return "style";
  // Cap size is a fit axis, not lace — mapping it to lace would hide the unit's
  // real lace attribute chip.
  if (n.includes("lace") || n.includes("construction")) return "lace";
  return "other";
}

/** A read-only chip for an axis the product does not let you choose. */
export interface FixedAttribute {
  axis: VariationAxis;
  label: string;
  value: string;
  swatch?: string;
}

/** An interactive option, normalised and tagged with its axis. */
export interface NormalizedOption extends ProductOption {
  axis: VariationAxis;
}

export interface DerivedVariations {
  /** Interactive, priced options in canonical order. */
  options: NormalizedOption[];
  /** Standard axes the product is fixed on — shown so every listing is complete. */
  attributes: FixedAttribute[];
}

/**
 * Normalise a product into the shared variation shape: its real options tagged
 * by axis and reordered, plus fixed chips for any standard axis it does not
 * vary (its texture, its lace, its single colour), so a fixed-length unit and a
 * three-length family still read as the same kind of thing.
 */
export function deriveVariations(product: Product): DerivedVariations {
  const options: NormalizedOption[] = product.options
    .map((opt) => {
      const axis = axisForOption(opt.name);
      // Guarantee colour options carry a swatch even when the raw data omits it.
      const values =
        axis === "color"
          ? opt.values.map((v) => ({
              ...v,
              swatch: v.swatch ?? COLOR_META[v.value as Shade]?.swatch,
            }))
          : opt.values;
      return { ...opt, values, axis };
    })
    .sort((a, b) => AXIS_ORDER.indexOf(a.axis) - AXIS_ORDER.indexOf(b.axis));

  const variedAxes = new Set(options.map((o) => o.axis));
  const attributes: FixedAttribute[] = [];

  if (!variedAxes.has("style") && product.texture) {
    attributes.push({
      axis: "style",
      label: AXIS_LABEL.style,
      value: TEXTURE_META[product.texture],
    });
  }
  if (!variedAxes.has("lace") && product.laceType) {
    attributes.push({ axis: "lace", label: AXIS_LABEL.lace, value: LACE_META[product.laceType] });
  }
  if (!variedAxes.has("color") && product.shade) {
    const meta = COLOR_META[product.shade];
    attributes.push({
      axis: "color",
      label: AXIS_LABEL.color,
      value: meta?.label ?? product.shade,
      swatch: meta?.swatch,
    });
  }
  if (!variedAxes.has("density") && product.density) {
    attributes.push({ axis: "density", label: AXIS_LABEL.density, value: product.density });
  }

  return { options, attributes };
}
