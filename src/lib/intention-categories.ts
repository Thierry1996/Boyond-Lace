import { commerce } from "@/lib/commerce";

/**
 * Shop-by-intention categories — the merchandising wall on /shop-by-intentions.
 *
 * These sit alongside the editorial `collections` (lib/collections.ts). A
 * collection is a full landing page with its own copy and FAQ; an intention
 * category is a lighter shortcut — a labelled circle that routes straight into
 * the shop, pre-filtered to one real Medusa category.
 *
 * Everything here is DATA-DRIVEN: the category is a real collection the importer
 * sorts products into, the count is a live query against that collection, the
 * image is a real product photo from it, and the href hits the shop's actual
 * filter param (`?<group>=<Category Name>`). No hard-coded phantom numbers, no
 * dead links. Categories already owned by an editorial collection (glueless,
 * frontals, body/deep wave, straight, colour, closures) are intentionally left
 * out so each circle earns its place.
 */
export interface IntentionCategory {
  slug: string;
  label: string;
  eyebrow: string;
  /** Real product-image URL, or an on-brand gradient key if the category is empty. */
  image: string;
  /** Working shop route, pre-filtered to this category. */
  href: string;
  /** Live count of units in the category. */
  count: number;
}

/** Seed = real category name + the shop filter group it lives under + copy. */
interface IntentionSeed {
  name: string;
  group: "construction" | "cut" | "texture" | "colour" | "range";
  eyebrow: string;
  /** Fallback gradient key when the category has no photographed unit yet. */
  poster: string;
}

const SEEDS: IntentionSeed[] = [
  { name: "Crochet Braids", group: "range", eyebrow: "Boho & feather", poster: "velvet" },
  { name: "Hair Extensions & Bundles", group: "range", eyebrow: "Build your install", poster: "mono" },
  { name: "Curly Wigs", group: "texture", eyebrow: "Defined coils", poster: "plum" },
  { name: "Kinky Straight Wigs", group: "texture", eyebrow: "Pressed natural", poster: "gold" },
  { name: "Loose & Water Wave Wigs", group: "texture", eyebrow: "Beachy movement", poster: "aurora" },
  { name: "Bob & Short Wigs", group: "cut", eyebrow: "Short & sharp", poster: "blush" },
  { name: "Long Wigs", group: "cut", eyebrow: '26" and beyond', poster: "velvet" },
  { name: "Layered Wigs", group: "cut", eyebrow: "Butterfly & layers", poster: "aurora" },
  { name: "Curtain Bang Wigs", group: "cut", eyebrow: "Face-framing", poster: "blush" },
  { name: "U-Part & V-Part Wigs", group: "construction", eyebrow: "No leave-out", poster: "plum" },
  { name: "Natural Black Wigs", group: "colour", eyebrow: "The 1B classic", poster: "mono-2" },
];

const slugify = (s: string) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Every intention category with a LIVE count and a real representative image,
 * derived from one products fetch. Empty categories fall back to their gradient
 * poster and still render (count 0), so the wall never shows a broken circle.
 */
export async function getIntentionCategoriesWithCounts(): Promise<IntentionCategory[]> {
  const all = await commerce.getProducts({ sort: "rating" });
  return SEEDS.map((s) => {
    const inCat = all.filter((p) => (p.collections ?? []).includes(s.name));
    const hero = inCat.find((p) => p.price > 0 && p.images?.[0]?.src);
    return {
      slug: slugify(s.name),
      label: s.name.replace(/ Wigs$/, ""),
      eyebrow: s.eyebrow,
      image: hero?.images[0].src ?? s.poster,
      href: `/shop?${s.group}=${encodeURIComponent(s.name)}`,
      count: inCat.length,
    };
  });
}
