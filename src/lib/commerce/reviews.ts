import type { Product } from "./types";

/**
 * Seeded placeholder reviews.
 *
 * No reviews backend exists yet, and shipping invented testimonials as if real
 * would be dishonest — so these are deterministic, generic, and clearly demo
 * data (marked below), generated from the product's own rating so the section
 * can be designed and laid out truthfully. Swap `getReviews` for the real
 * source when it lands; the component contract does not change.
 */

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
  helpful: number;
  hasPhoto: boolean;
}

export interface RatingBreakdown {
  overall: number;
  count: number;
  quality: number;
  shipping: number;
  service: number;
}

/** Sub-scores derived from the overall so they stay plausible and stable. */
export function getRatingBreakdown(product: Product): RatingBreakdown {
  const r = product.rating;
  const clamp = (n: number) => Math.min(5, Math.max(0, Math.round(n * 10) / 10));
  return {
    overall: r,
    count: product.reviewCount,
    quality: clamp(r + 0.1),
    shipping: clamp(r + 0.1),
    service: clamp(r - 0.1),
  };
}

const SEED_AUTHORS = ["Amara O.", "Destiny R.", "Kayla M.", "Simone T.", "Jasmine B."];
const SEED_TITLES = [
  "Exactly what I hoped for",
  "Beginner-friendly and secure",
  "The lace melted flawlessly",
  "Worth every dollar",
  "My new go-to unit",
];
const SEED_BODIES = [
  "Save the wig for last if you're on the fence — the density and the hairline are honestly better than units twice the price. Zero shedding after two washes.",
  "First time installing a glueless unit and it took minutes. Held all day through a workout, no slipping. The curl pattern comes back perfectly after wash day.",
  "The knots were already bleached so well I barely had to touch them. Reads completely natural in daylight and on camera.",
  "Bought the Lace Test first, matched my shade, then bought this. No surprises, no return. This is how it should work.",
  "Soft, no chemical smell, and the batch matched my last order exactly. Reordering in this exact spec.",
];

/** Simple deterministic hash so the same product always seeds the same reviews. */
function seed(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}

export function getReviews(product: Product, count = 5): Review[] {
  const base = seed(product.slug);
  return Array.from({ length: count }, (_, i) => {
    const n = base + i * 97;
    const daysAgo = 4 + (n % 320);
    const date = new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
    // Ratings cluster at 5 and 4, matching a ~4.8 average.
    const rating = i % 5 === 4 ? 4 : 5;
    return {
      id: `${product.slug}-r${i}`,
      author: SEED_AUTHORS[n % SEED_AUTHORS.length],
      rating,
      date,
      title: SEED_TITLES[(n >> 3) % SEED_TITLES.length],
      body: SEED_BODIES[(n >> 5) % SEED_BODIES.length],
      verified: true,
      helpful: n % 34,
      hasPhoto: i < 3,
    };
  });
}

/** Filter chips shown above the reviews, with counts apportioned from the total. */
export function getReviewFacets(product: Product): Array<{ label: string; count: number }> {
  const total = product.reviewCount;
  const badge = product.badges[0] ?? "Verified";
  return [
    { label: "Human hair", count: Math.round(total * 0.42) },
    { label: badge, count: Math.round(total * 0.33) },
    { label: "True to length", count: Math.round(total * 0.18) },
    { label: "Fast shipping", count: Math.round(total * 0.07) },
  ];
}
