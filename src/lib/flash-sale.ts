import type { ImageryKey } from "@/lib/imagery";

/**
 * Flash-sale catalogue — Beyond Lace's retail FOMO drop. A curated list of
 * discounted units; the image-accordion on the home page loops through it
 * continuously. Every item routes to a real collection/category so a click
 * always lands somewhere shoppable. Swap RAW for a live endpoint later without
 * touching the component — it only depends on the FlashItem shape.
 */
export interface FlashItem {
  name: string;
  slug: string;
  /** Minor units (cents). */
  priceUsd: number;
  compareUsd: number;
  discountPct: number;
  /** A real product-image URL, or an on-brand gradient poster key. Both render
   *  through <ProductImage>, so the accordion works with live or seed data. */
  image: ImageryKey | string;
  href: string;
  presale?: boolean;
}

const IMAGES: ImageryKey[] = [
  "navShop",
  "navBrand",
  "company",
  "tier1",
  "tier2",
  "tier3",
  "laceDetail",
  "ordersLogistics",
  "brandPress",
  "navCircle",
  "educationPartnership",
  "navLearn",
  "fitGuides",
  "b2bResources",
];

const HREF = {
  bundles: "/shop?line=bundle",
  glueless: "/collections/glueless-wigs",
  hdlace: "/collections/hd-full-lace",
  highlight: "/collections/coloured-wigs",
  frontal: "/collections/13x4-frontal-wigs",
  kinky: "/shop?texture=kinky-curly",
  bodywave: "/collections/body-wave-wigs",
  straight: "/collections/straight-wigs",
  deepwave: "/collections/deep-wave-wigs",
} as const;

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

// [name, priceUsd, compareUsd, hrefKey, presale?]
const RAW: [string, number, number, keyof typeof HREF, boolean?][] = [
  ["Burmese Curly Crochet Human Hair for Boho Braids", 74.2, 90.49, "bundles"],
  ["Kinky Curly Bundles Sade's Same Hair Natural Black Color", 60.5, 80.67, "bundles"],
  ["Water Wave Feather Crochet Braid Human Hair", 76.39, 101.85, "bundles"],
  ["Burmese Curly Feather Crochet Braid Human Hair", 76.39, 101.85, "bundles"],
  ["M-Cap Pre-Cut 9x6 HD Lace Body Wave Wear Go Glueless Wig", 140.72, 213.21, "glueless"],
  ["Wear Go Half Wig Water Wave Flip Over Wig", 89.9, 119.9, "glueless"],
  ["Kinky Curly Feather Crochet Braid Human Hair", 72.0, 96.0, "bundles"],
  ["Deep Curly Feather Crochet Braid Human Hair", 73.5, 98.0, "bundles"],
  ["Loose Deep Feather Crochet Braid Human Hair", 71.2, 95.0, "bundles"],
  ["13x6 HD Invisi Draw-strings Straight Full Lace Frontal Wear Go Wig", 159.9, 219.9, "straight"],
  ["Afro Curly Feather Crochet Knotless Human Hair", 68.4, 90.0, "kinky"],
  ["Wear Go Half Wig Highlight Brown Kinky Curly Flip Over Wig", 99.9, 139.9, "highlight"],
  ["Invisi Draw-strings Body Wave 13x6 HD Full Lace Frontal Wear Go Wig", 169.9, 229.9, "hdlace"],
  [
    "Invisi Draw-strings Deep Wave 13x6 HD Full Lace Frontal Wear Go Wig",
    169.9,
    229.9,
    "hdlace",
    true,
  ],
  [
    "Invisi Draw-strings Burmese Curly 13x6 HD Full Lace Frontal Wear Go Wig",
    172.9,
    234.9,
    "hdlace",
  ],
  [
    "M-Cap 9x6 Pre-Cut HD Lace Pre-Plucked Kinky Curly Wear Go Glueless Wig",
    145.9,
    210.0,
    "glueless",
  ],
  ["Pre-Styled Layer Kinky Curly Half Wig", 84.9, 112.0, "kinky"],
  ["Invisi Draw-strings Water Wave 13x6 HD Full Lace Frontal Wear Go Wig", 167.9, 225.9, "hdlace"],
  [
    "Highlight Brown 360 Pre-Cut Lace InvisiFit Water Wave Wear Go Glueless Wig",
    179.9,
    249.9,
    "highlight",
  ],
  ["Body Wave 13x4 HD Lace Wig", 129.9, 179.9, "frontal"],
  ["V Part Wig Kinky Curly Human Hair Glueless Wig", 94.9, 129.9, "kinky"],
  ["10A Body Wave 1/3/4 Bundles", 65.0, 88.0, "bodywave"],
  ["Wear Go Blow Out Straight Bob 7x5 Transparent Lace Glueless Wig", 119.9, 159.9, "straight"],
  ["M-Cap 9x6 Wear Go Yaki & Kinky Straight HD Lace Glueless Wig", 134.9, 189.9, "straight"],
  ["Wear Go V5 | Pre-Bleached Water Wave Wear Go Wig", 124.9, 169.9, "glueless", true],
  ["Afro Curly Human Hair Crochet", 62.9, 84.0, "kinky"],
  ["Drawstring Straight Lace Ponytail", 88.0, 118.0, "straight"],
  ["Pre-Cut HD Lace Body Wave Wear Go Wig", 139.9, 199.9, "bodywave"],
];

export const FLASH_SALE: FlashItem[] = RAW.map(([name, price, compare, key, presale], i) => ({
  name,
  slug: slugify(name),
  priceUsd: Math.round(price * 100),
  compareUsd: Math.round(compare * 100),
  discountPct: Math.round((1 - price / compare) * 100),
  image: IMAGES[i % IMAGES.length],
  href: HREF[key],
  presale: !!presale,
}));
