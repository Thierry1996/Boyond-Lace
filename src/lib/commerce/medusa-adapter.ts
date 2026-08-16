import type {
  CommerceAdapter,
  Product,
  ProductOption,
  ProductQuery,
  WholesaleQuote,
  WholesaleTier,
} from "./types";

/**
 * Medusa backend adapter — the real commerce engine behind the Beyond Lace
 * storefront. Reads live from Medusa's Store API and maps each Medusa product
 * back into the Beyond Lace `Product` shape, so every branded page keeps working
 * and any change made in Medusa admin reflects here on the next fetch.
 *
 * Prices in Medusa were built as base + additive Length/Colour deltas, so we
 * reconstruct the option `priceDelta`s the storefront expects. Falls back to the
 * mock adapter when MEDUSA_BACKEND_URL is unset (see index.ts).
 */

const BACKEND = process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
const KEY =
  process.env.MEDUSA_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const REGION_ID = process.env.MEDUSA_REGION_ID || "";

const FIELDS = [
  "id,title,handle,subtitle,description,thumbnail",
  "*images",
  "*options,*options.values",
  "*variants,*variants.calculated_price,*variants.options,+variants.inventory_quantity",
  "*categories",
  "metadata",
].join(",");

async function storeFetch(path: string, params: Record<string, string | number | undefined>) {
  const url = new URL(`${BACKEND}/store/${path}`);
  for (const [k, v] of Object.entries(params)) if (v != null) url.searchParams.set(k, String(v));
  const res = await fetch(url.toString(), {
    headers: { "x-publishable-api-key": KEY },
    // Stock/price must reflect Medusa in real time. The full catalogue payload
    // also exceeds Next's 2MB fetch-cache limit, so caching it silently serves
    // stale data (a product stays "in stock" after selling out). Until the list
    // is paginated with lean fields, read live. See scaling follow-up.
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Medusa ${path} → ${res.status}`);
  return res.json();
}

const slugify = (s: string) => s.toLowerCase().replace(/["\s]+/g, "-").replace(/[^a-z0-9-]/g, "");
const toCents = (n: number | null | undefined) => (n == null ? null : Math.round(n * 100));

/** Review media is stored as a JSON string in metadata; tolerate absence/garbage. */
function parseReviewMedia(raw: unknown): Product["reviewMedia"] {
  if (!raw) return undefined;
  try {
    const arr = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (!Array.isArray(arr) || !arr.length) return undefined;
    return arr
      .map((m: any) => ({ type: /\.(mp4|webm|mov)/i.test(m.src ?? m.url ?? "") ? "video" : "image", src: m.src ?? m.url }))
      .filter((m: any) => m.src) as Product["reviewMedia"];
  } catch {
    return undefined;
  }
}

// On-brand gradient posters ProductImage knows how to render. Until real image
// URLs arrive (via the catalogue CSV → Medusa media), each product gets a stable,
// varied trio so galleries look intentional rather than empty.
const POSTERS = ["aurora", "velvet", "plum", "blush", "gold", "mono"];
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};
function fallbackImages(seed: string, title: string) {
  const start = hash(seed) % POSTERS.length;
  return [0, 2, 4].map((off) => ({ src: POSTERS[(start + off) % POSTERS.length], alt: title }));
}

/** Map a Medusa variant's options to a { [optionTitle]: value } record. */
function variantCombo(variant: any, optionIdToTitle: Map<string, string>): Record<string, string> {
  const combo: Record<string, string> = {};
  for (const vo of variant.options ?? []) {
    const title = optionIdToTitle.get(vo.option_id) ?? vo.option?.title;
    if (title) combo[title] = vo.value;
  }
  return combo;
}

function mapProduct(m: any): Product {
  const md = m.metadata ?? {};
  const options: any[] = m.options ?? [];
  const variants: any[] = m.variants ?? [];
  const optionIdToTitle = new Map<string, string>(options.map((o) => [o.id, o.title]));

  // price lookup keyed by ordered option-value combo
  const key = (combo: Record<string, string>) =>
    options.map((o) => combo[o.title] ?? "").join("|");
  const priceByCombo = new Map<string, number>();
  const allPrices: number[] = [];
  for (const v of variants) {
    const cents = toCents(v.calculated_price?.calculated_amount);
    if (cents == null) continue;
    allPrices.push(cents);
    priceByCombo.set(key(variantCombo(v, optionIdToTitle)), cents);
  }
  const base = allPrices.length ? Math.min(...allPrices) : 0;

  // base combo = first value of each option
  const baseCombo: Record<string, string> = {};
  for (const o of options) baseCombo[o.title] = o.values?.[0]?.value;

  const mappedOptions: ProductOption[] = options.map((o) => ({
    name: o.title,
    values: (o.values ?? []).map((val: any) => {
      const combo = { ...baseCombo, [o.title]: val.value };
      const p = priceByCombo.get(key(combo));
      return {
        label: val.value,
        value: slugify(val.value),
        priceDelta: p != null ? Math.max(0, p - base) : 0,
      };
    }),
  }));

  let wholesale;
  try {
    wholesale = md.wholesale ? JSON.parse(md.wholesale) : undefined;
  } catch {
    wholesale = undefined;
  }

  const line = (md.line as Product["line"]) ?? "luxe";
  const category = m.categories?.[0]?.name as string | undefined;
  const avatar: Product["avatar"] =
    category === "Extensions & Bundles" || line === "pro" || line === "bundle"
      ? "wholesale"
      : "transformation";

  const specs = [
    md.lace_type && { label: "Lace type", value: String(md.lace_type) },
    md.lace_design && { label: "Lace design", value: String(md.lace_design) },
    md.density && { label: "Density", value: String(md.density) },
    md.texture && { label: "Texture", value: String(md.texture) },
    md.origin && { label: "Origin", value: String(md.origin) },
  ].filter(Boolean) as { label: string; value: string }[];

  return {
    id: (md.bl_id as string) ?? m.id,
    slug: m.handle,
    sku: (md.bl_sku as string) ?? variants[0]?.sku ?? m.id,
    title: m.title,
    line,
    avatar,
    tagline: m.subtitle ?? "",
    description: m.description ?? "",
    price: base,
    compareAtPrice: md.compare_at_price ? Math.round(Number(md.compare_at_price) * 100) : undefined,
    currency: "USD",
    texture: (md.texture ? slugify(String(md.texture)) : undefined) as Product["texture"],
    shade: (md.shade as Product["shade"]) ?? undefined,
    density: md.density ? String(md.density) : undefined,
    origin: md.origin ? String(md.origin) : undefined,
    options: mappedOptions,
    images:
      (m.images ?? []).length > 0
        ? m.images.map((i: any) => ({ src: i.url, alt: m.title }))
        : m.thumbnail
          ? [{ src: m.thumbnail, alt: m.title }]
          : fallbackImages(m.handle ?? m.id, m.title),
    video: md.video_url ? String(md.video_url) : undefined,
    reviewMedia: parseReviewMedia(md.review_media),
    specs,
    rating: Number(md.rating) || 4.8,
    reviewCount: Number(md.review_count) || 0,
    badges: md.badges ? String(md.badges).split(",").filter(Boolean) : [],
    inStock: variants.some((v) => (v.inventory_quantity ?? 1) > 0),
    launchRank: md.launch_rank != null ? Number(md.launch_rank) : undefined,
    wholesale,
  };
}

async function fetchAll(): Promise<Product[]> {
  const { products } = await storeFetch("products", {
    region_id: REGION_ID,
    fields: FIELDS,
    limit: 1000,
  });
  return (products ?? []).map(mapProduct);
}

function matches(p: Product, q: ProductQuery): boolean {
  if (q.line && p.line !== q.line) return false;
  if (q.avatar && p.avatar !== q.avatar) return false;
  if (q.wholesaleOnly && !p.wholesale) return false;
  if (q.launchOnly && p.launchRank == null) return false;
  if (q.minPrice != null && p.price < q.minPrice) return false;
  if (q.maxPrice != null && p.price > q.maxPrice) return false;
  return true;
}

function sortProducts(list: Product[], sort: ProductQuery["sort"]): Product[] {
  const s = [...list];
  switch (sort) {
    case "price-asc":
      return s.sort((a, b) => a.price - b.price);
    case "price-desc":
      return s.sort((a, b) => b.price - a.price);
    case "rating":
      return s.sort((a, b) => b.rating - a.rating);
    case "launch-rank":
      return s.sort((a, b) => (a.launchRank ?? 999) - (b.launchRank ?? 999));
    default:
      return s.sort((a, b) => Number(b.inStock) - Number(a.inStock) || b.reviewCount - a.reviewCount);
  }
}

export const medusaAdapter: CommerceAdapter = {
  async getProducts(query = {}) {
    const all = await fetchAll();
    const filtered = all.filter((p) => matches(p, query));
    const sorted = sortProducts(filtered, query.sort);
    return query.limit ? sorted.slice(0, query.limit) : sorted;
  },

  async getProduct(slug) {
    const { products } = await storeFetch("products", {
      handle: slug,
      region_id: REGION_ID,
      fields: FIELDS,
    });
    return products?.[0] ? mapProduct(products[0]) : null;
  },

  async getRelated(slug, limit = 4) {
    const all = await fetchAll();
    const product = all.find((p) => p.slug === slug);
    if (!product) return all.slice(0, limit);
    return all
      .filter((p) => p.slug !== slug)
      .map((p) => ({
        product: p,
        score: (p.avatar === product.avatar ? 4 : 0) + (p.line === product.line ? 2 : 0),
      }))
      .sort((a, b) => b.score - a.score || b.product.reviewCount - a.product.reviewCount)
      .slice(0, limit)
      .map((s) => s.product);
  },

  async getAttachments() {
    return [];
  },

  async getLaunchAssortment() {
    const all = await fetchAll();
    return all.filter((p) => p.launchRank != null).sort((a, b) => a.launchRank! - b.launchRank!);
  },

  async getWholesaleQuote(slug, quantity) {
    const product = await this.getProduct(slug);
    if (!product?.wholesale) return null;
    const { tiers, moq, mapPrice } = product.wholesale;
    const ordered = [...tiers].sort((a, b) => a.minQty - b.minQty);
    let tier: WholesaleTier = ordered[0];
    for (const t of ordered) if (quantity >= t.minQty) tier = t;
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
