import { catalog } from "./catalog";
import type { CommerceAdapter, Product, ProductQuery } from "./types";

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
  if (q.minPrice != null && product.price < q.minPrice) return false;
  if (q.maxPrice != null && product.price > q.maxPrice) return false;
  return true;
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
};
