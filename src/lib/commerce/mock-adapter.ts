import { catalog } from "./catalog";
import type {
  CommerceAdapter,
  Product,
  ProductQuery,
  WholesaleQuote,
  WholesaleTier,
} from "./types";

/**
 * In-memory adapter backed by the seed catalog.
 *
 * This exists so the storefront can be built, reviewed, and tested before the
 * commerce backend decision lands (docs/brand/04-tech-stack.md §11). Replacing
 * it with Shopify means writing a ShopifyAdapter that satisfies CommerceAdapter
 * — no page or component changes.
 */

function matchesQuery(product: Product, q: ProductQuery): boolean {
  if (q.line && product.line !== q.line) return false;
  if (q.avatar && product.avatar !== q.avatar) return false;
  if (q.texture?.length && (!product.texture || !q.texture.includes(product.texture))) return false;
  if (q.laceType?.length && (!product.laceType || !q.laceType.includes(product.laceType)))
    return false;
  if (q.shade?.length && (!product.shade || !q.shade.includes(product.shade))) return false;
  if (
    q.capConstruction?.length &&
    (!product.capConstruction || !q.capConstruction.includes(product.capConstruction))
  )
    return false;
  if (q.capSize?.length && !q.capSize.some((s) => product.capSizes?.includes(s))) return false;
  if (q.launchTier?.length && (!product.launchTier || !q.launchTier.includes(product.launchTier)))
    return false;
  if (q.launchOnly && product.launchRank == null) return false;
  if (q.wholesaleOnly && !product.wholesale) return false;
  if (q.minPrice != null && product.price < q.minPrice) return false;
  if (q.maxPrice != null && product.price > q.maxPrice) return false;
  return true;
}

/**
 * The break a quantity actually lands in: the highest tier whose minimum it
 * meets. Below the entry tier the buyer still gets a quote, flagged as
 * indicative, rather than a dead end — a reseller comparing suppliers should
 * never have to email us to find out what ten units would cost.
 */
function tierFor(tiers: WholesaleTier[], quantity: number): WholesaleTier {
  const ordered = [...tiers].sort((a, b) => a.minQty - b.minQty);
  let match = ordered[0];
  for (const t of ordered) if (quantity >= t.minQty) match = t;
  return match;
}

function sortProducts(products: Product[], sort: ProductQuery["sort"]): Product[] {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest":
      return sorted.sort(
        (a, b) => Number(b.badges.includes("New")) - Number(a.badges.includes("New")),
      );
    case "launch-rank":
      // Unranked SKUs sort last rather than colliding at zero.
      return sorted.sort((a, b) => (a.launchRank ?? 999) - (b.launchRank ?? 999));
    default:
      // Featured: in-stock first, then by review volume as a proxy for proven converters.
      return sorted.sort(
        (a, b) => Number(b.inStock) - Number(a.inStock) || b.reviewCount - a.reviewCount,
      );
  }
}

export const mockAdapter: CommerceAdapter = {
  async getProducts(query = {}) {
    const filtered = catalog.filter((p) => matchesQuery(p, query));
    const sorted = sortProducts(filtered, query.sort);
    return query.limit ? sorted.slice(0, query.limit) : sorted;
  },

  async getProduct(slug) {
    return catalog.find((p) => p.slug === slug) ?? null;
  },

  async getRelated(slug, limit = 4) {
    const product = catalog.find((p) => p.slug === slug);
    if (!product) return catalog.slice(0, limit);

    // Same avatar first — a medical buyer should never be cross-sold a capsule drop.
    const scored = catalog
      .filter((p) => p.slug !== slug && p.price > 0)
      .map((p) => ({
        product: p,
        score:
          (p.avatar === product.avatar ? 4 : 0) +
          (p.line === product.line ? 2 : 0) +
          (p.texture && p.texture === product.texture ? 1 : 0),
      }))
      .sort((a, b) => b.score - a.score || b.product.reviewCount - a.product.reviewCount);

    return scored.slice(0, limit).map((s) => s.product);
  },

  async getAttachments(slug) {
    const product = catalog.find((p) => p.slug === slug);
    if (!product?.crossSell?.length) return [];
    // Preserve the order declared on the product: the Install Kit leads because
    // it is the one that decides whether the first install succeeds.
    return product.crossSell
      .map((s) => catalog.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p) && p!.inStock);
  },

  async getLaunchAssortment() {
    return catalog
      .filter((p) => p.launchRank != null)
      .sort((a, b) => a.launchRank! - b.launchRank!);
  },

  async getWholesaleQuote(slug, quantity) {
    const product = catalog.find((p) => p.slug === slug);
    if (!product?.wholesale) return null;

    const { tiers, moq, mapPrice } = product.wholesale;
    const tier = tierFor(tiers, quantity);
    const qty = Math.max(1, Math.floor(quantity));

    return {
      slug: product.slug,
      sku: product.sku,
      quantity: qty,
      tier,
      unitPrice: tier.unitPrice,
      subtotal: tier.unitPrice * qty,
      mapPrice,
      belowMoq: qty < moq,
      currency: product.currency,
    } satisfies WholesaleQuote;
  },
};
