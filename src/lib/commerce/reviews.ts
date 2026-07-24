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
  /** Facet labels this review belongs to, so the chips can filter for real. */
  tags: string[];
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
  const badge = product.badges[0] ?? "Verified";
  // The pool a review's facet tags are drawn from — the same labels the chips
  // above the list expose, so filtering by a chip actually narrows the list.
  const tagPool = ["Human hair", badge, "True to length", "Fast shipping"];
  return Array.from({ length: count }, (_, i) => {
    const n = base + i * 97;
    const daysAgo = 4 + (n % 320);
    const date = new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
    // Ratings cluster at 5 and 4, matching a ~4.8 average.
    const rating = i % 5 === 4 ? 4 : 5;
    // Every review carries "Human hair"; the rest are seeded so each chip has a
    // real, deterministic subset behind it.
    const tags = ["Human hair"];
    if ((n >>> 4) % 2 === 0) tags.push(badge);
    if ((n >>> 6) % 3 === 0) tags.push("True to length");
    if ((n >>> 7) % 4 === 0) tags.push("Fast shipping");
    return {
      id: `${product.slug}-r${i}`,
      author: SEED_AUTHORS[n % SEED_AUTHORS.length],
      rating,
      date,
      title: SEED_TITLES[(n >>> 3) % SEED_TITLES.length],
      body: SEED_BODIES[(n >>> 5) % SEED_BODIES.length],
      verified: true,
      helpful: n % 34,
      hasPhoto: i < 3,
      tags: [...new Set(tags.filter(Boolean))].filter((t) => tagPool.includes(t)),
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

/**
 * Seeded placeholder Q&A — same honesty stance as the reviews above. Real
 * questions and answers arrive with the community integration; until then the
 * layout runs on generic, deterministic, clearly-labelled demo content. The
 * first answer to each is attributed to Beyond Lace (the brand's own reply),
 * the rest to other shoppers, mirroring how a real Q&A reads.
 */
export interface Question {
  id: string;
  question: string;
  askedBy: string;
  answer: string;
  answeredBy: string;
  fromBrand: boolean;
  date: string;
  answerCount: number;
}

const SEED_QUESTIONS = [
  "Will this hold a defined curl after a wash, or does the pattern relax?",
  "How do you keep the style looking fresh through a full day?",
  "Is this unit beginner-friendly if I've never installed a wig before?",
  "Does the lace need bleaching, or is it ready to install out of the box?",
  "How true to the listed length is it once it's stretched out?",
  "Can I dye or tone this at home without ruining it?",
  "Is the cap secure enough for workouts and humidity?",
];

const SEED_ANSWERS = [
  "It's built to hold. Refresh with a little mousse or light oil on damp hair, scrunch upward, and air-dry — the texture redefines every time.",
  "A pea of curl cream or mousse on damp hair, then let it air-dry. It stays soft and defined all day without feeling heavy or crunchy.",
  "Yes — this is one of the least intimidating units we make. Glueless, adjustable band, on your head in minutes, no adhesive to get right.",
  "The knots come pre-bleached and the hairline is pre-plucked, so it reads scalp-natural out of the box. No bleaching appointment needed.",
  "Measured stretched, so it lands true to the label. Curl and wave patterns sit shorter until you stretch them — that's the texture, not the length.",
  "It takes colour well. We'd still order the $5 Lace Test first to confirm your target shade, and tone rather than lift where you can.",
  "The band and combs hold through a full day. For heavy sweat or humidity, add the grip band from the Install Kit and it will not budge.",
];

export function getQuestions(product: Product, count = 5): Question[] {
  const base = seed(product.slug + "-qa");
  return Array.from({ length: count }, (_, i) => {
    const n = base + i * 61;
    const daysAgo = 3 + (n % 200);
    const date = new Date(Date.now() - daysAgo * 86_400_000).toISOString().slice(0, 10);
    const fromBrand = i === 0;
    return {
      id: `${product.slug}-q${i}`,
      question: SEED_QUESTIONS[(n >>> 2) % SEED_QUESTIONS.length],
      askedBy: SEED_AUTHORS[(n >>> 4) % SEED_AUTHORS.length],
      answer: SEED_ANSWERS[(n >>> 2) % SEED_ANSWERS.length],
      answeredBy: fromBrand ? "Beyond Lace" : SEED_AUTHORS[(n >>> 6) % SEED_AUTHORS.length],
      fromBrand,
      date,
      answerCount: 1 + (n % 4),
    };
  });
}
