/**
 * Commerce domain types.
 *
 * These are Beyond Lace's types, not any vendor's. No Shopify/Medusa/Saleor
 * shape is permitted to leak past the adapter — that boundary is what keeps
 * the backend decision (docs/brand/04-tech-stack.md §11) reversible.
 */

export type Texture =
  | "straight"
  | "body-wave"
  | "deep-wave"
  | "curly"
  | "kinky-straight"
  /** 4C-adjacent coil pattern — the differentiation bet majors underweight. */
  | "kinky-curly"
  | "water-wave"
  | "jerry-curl"
  /** Yaki: pressed-natural texture, reads as relaxed hair rather than silk. */
  | "yaki";

/**
 * Lace area is what wholesale buyers actually shop by, so the parting size is
 * part of the type rather than prose in a spec row. "glueless" is retained as a
 * legacy value; new units carry both a lace size and a capConstruction.
 */
export type LaceType =
  | "hd-swiss-full"
  | "hd-swiss-13x6"
  | "hd-swiss-13x4"
  | "hd-swiss-7x5"
  | "hd-swiss-5x5"
  | "closure-4x4"
  | "silk-top"
  | "glueless";

export type Shade =
  | "natural-black"
  | "espresso"
  | "brunette"
  | "honey-blonde"
  | "platinum"
  | "custom-fashion"
  /** 613 — the blank canvas colourists buy to tone themselves. */
  | "blonde-613"
  | "honey-balayage"
  | "auburn-copper"
  | "burgundy-99j";

/** Which avatar this product primarily speaks to. Drives theme + copy voice. */
export type Avatar = "transformation" | "medical" | "editorial" | "men" | "wholesale";

export type ProductLine = "luxe" | "silk" | "pro" | "care" | "try-on" | "bundle" | "kit";

/**
 * How the cap is built. This is the axis the trans-affirming range competes on
 * and it is not derivable from lace size, so it is modelled separately.
 */
export type CapConstruction =
  | "standard-lace"
  | "glueless-wear-go"
  | "bye-bye-knots"
  | "reinforced-trans-fit"
  | "closure"
  | "wefted-bundles";

export type CapSize = "petite" | "average" | "large";

/**
 * Launch assortment tiers, in the strategic order of the buying directive:
 * credibility first, then the two differentiation bets, then the trend-colour
 * drivers, then wholesale bulk, then the accessory margin layer.
 */
export type LaunchTier =
  "core" | "textured" | "trans-fit" | "trend-colour" | "wholesale-bulk" | "accessory";

/**
 * MOQ-based reseller pricing. The directive asks for the reseller/creator split
 * to be visible in the pricing structure itself rather than only in marketing
 * copy, so tiers are data the storefront and the wholesale portal both read.
 */
export interface WholesaleTier {
  label: string;
  minQty: number;
  /** Minor units (cents), per unit at this break. */
  unitPrice: number;
}

export interface WholesalePricing {
  /** Minimum order quantity for this SKU at the entry tier. */
  moq: number;
  tiers: WholesaleTier[];
  /** Minimum advertised price — enforced, not suggested. */
  mapPrice: number;
  /**
   * Single-unit price for vetted creators sampling before a campaign. Absent on
   * SKUs where sampling is meaningless — a five-unit reseller pack has no
   * "one unit for a creator" price; that is what the single SKUs are for.
   */
  creatorSamplePrice?: number;
}

export interface ProductOption {
  /** e.g. "Length" */
  name: string;
  /** e.g. { label: '18"', value: "18", priceDelta: 4000 } */
  values: Array<{
    label: string;
    value: string;
    /** Minor units (cents). Added to base price. */
    priceDelta?: number;
    available?: boolean;
    /** Hex for swatch rendering — shade options only. */
    swatch?: string;
  }>;
}

export interface Product {
  id: string;
  slug: string;
  /** Merchandising SKU code. Stable across length variants in a family. */
  sku: string;
  title: string;
  line: ProductLine;
  avatar: Avatar;
  /** Set when this SKU is part of the launch assortment. */
  launchTier?: LaunchTier;
  /** 1-20 priority from the buying directive; lower is stocked first. */
  launchRank?: number;
  /** The transformation promise, not a spec sheet. */
  tagline: string;
  description: string;
  /** Minor units (cents). */
  price: number;
  compareAtPrice?: number;
  currency: string;
  texture?: Texture;
  laceType?: LaceType;
  shade?: Shade;
  density?: string;
  origin?: string;
  capConstruction?: CapConstruction;
  /** Offered cap sizes. Only the trans-fit range currently varies this. */
  capSizes?: CapSize[];
  /** Lengths in this SKU family, in inches — the merchandising unit. */
  lengths?: number[];
  wholesale?: WholesalePricing;
  /**
   * Slugs attached by default at checkout. The directive is explicit that the
   * Install Kit and Care Bundle are default cross-sell rather than optional
   * add-ons, because that is where margin survives while units compete on price.
   */
  crossSell?: string[];
  options: ProductOption[];
  images: Array<{ src: string; alt: string }>;
  /** Spec rows for the PDP detail table. */
  specs: Array<{ label: string; value: string }>;
  rating: number;
  reviewCount: number;
  badges: string[];
  inStock: boolean;
  /** Subscription-eligible (Beyond Care). */
  subscribable?: boolean;
}

export interface CartLine {
  id: string;
  productId: string;
  slug: string;
  title: string;
  /** Selected option values, e.g. { Length: '20"', Shade: "Espresso" } */
  selections: Record<string, string>;
  unitPrice: number;
  quantity: number;
  image: string;
}

export interface Cart {
  id: string;
  lines: CartLine[];
  subtotal: number;
  currency: string;
}

export interface ProductQuery {
  line?: ProductLine;
  avatar?: Avatar;
  texture?: Texture[];
  laceType?: LaceType[];
  shade?: Shade[];
  capConstruction?: CapConstruction[];
  capSize?: CapSize[];
  launchTier?: LaunchTier[];
  /** Only SKUs carrying a launch rank. */
  launchOnly?: boolean;
  /** Only SKUs a reseller can order at MOQ. */
  wholesaleOnly?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating" | "launch-rank";
  limit?: number;
}

/**
 * The contract every backend must satisfy. Swapping the mock adapter for
 * Shopify means implementing this interface and nothing else.
 */
export interface CommerceAdapter {
  getProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getRelated(slug: string, limit?: number): Promise<Product[]>;
  /** Default-attached kit items for a unit, resolved from crossSell slugs. */
  getAttachments(slug: string): Promise<Product[]>;
  /** The launch assortment in buying-directive order. */
  getLaunchAssortment(): Promise<Product[]>;
  /** Resolve the reseller unit price for a quantity, or null if not stocked B2B. */
  getWholesaleQuote(slug: string, quantity: number): Promise<WholesaleQuote | null>;
}

export interface WholesaleQuote {
  slug: string;
  sku: string;
  quantity: number;
  /** The tier the quantity actually lands in. */
  tier: WholesaleTier;
  unitPrice: number;
  subtotal: number;
  mapPrice: number;
  /** True when quantity is below the SKU's MOQ — quote is indicative only. */
  belowMoq: boolean;
  currency: string;
}
