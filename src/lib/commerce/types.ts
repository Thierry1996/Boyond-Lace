/**
 * Commerce domain types.
 *
 * These are Beyond Lace's types, not any vendor's. No Shopify/Medusa/Saleor
 * shape is permitted to leak past the adapter — that boundary is what keeps
 * the backend decision (docs/brand/04-tech-stack.md §11) reversible.
 */

export type Texture = "straight" | "body-wave" | "deep-wave" | "curly" | "kinky-straight";
export type LaceType =
  "hd-swiss-full" | "hd-swiss-13x6" | "hd-swiss-13x4" | "silk-top" | "glueless";
export type Shade =
  "natural-black" | "espresso" | "brunette" | "honey-blonde" | "platinum" | "custom-fashion";

/** Which avatar this product primarily speaks to. Drives theme + copy voice. */
export type Avatar = "transformation" | "medical" | "editorial" | "men" | "wholesale";

export type ProductLine = "luxe" | "silk" | "pro" | "care" | "try-on";

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
  title: string;
  line: ProductLine;
  avatar: Avatar;
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
  minPrice?: number;
  maxPrice?: number;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
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
}
