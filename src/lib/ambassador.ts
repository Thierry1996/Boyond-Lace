import type { ImageryKey } from "@/lib/imagery";

/**
 * Beyond Ambassador programme definition — three tiers, each a different
 * commercial relationship rather than a discount ladder
 * (docs/brand/02-brand-strategy.md §5). Tier is assigned by the social
 * marketing division at review; applicants never self-select.
 */

export type TierSlug = "tier-3" | "tier-2" | "tier-1";

export interface Tier {
  slug: TierSlug;
  name: string;
  audience: string;
  reach: string;
  headline: string;
  italic: string;
  summary: string;
  reward: string;
  /** Commission expressed in basis points for the affiliate tiers. */
  commissionBps?: [number, number];
  benefits: string[];
  expectations: string[];
  upgrade: string;
  image: ImageryKey;
}

export const TIERS: Tier[] = [
  {
    slug: "tier-3",
    name: "Tier 3 — Micro Affiliate",
    audience: "Micro creators",
    reach: "10k – 50k followers",
    headline: "Your lace-melt journey",
    italic: "is worth 15–20%.",
    summary:
      "A straight affiliate partnership. You create honest transformation content, we track every sale to your own link, and you keep 15–20% of it.",
    reward: "15–20% commission on tracked sales",
    commissionBps: [1500, 2000],
    benefits: [
      "15–20% commission, tracked to your personal affiliate links",
      "Monthly payouts by PayPal, CashApp, or crypto wallet",
      "Product seeding on approval, yours to keep",
      "Your content licensed for paid ads — credited and paid separately",
      "Automatic tier review every quarter",
    ],
    expectations: [
      "Minimum two pieces of original content per month",
      "Genuine wear — the struggle and the reveal, not just the reveal",
      "Disclose the partnership per your local advertising rules",
    ],
    upgrade:
      "Cross 100k followers on any linked platform, or clear $10,000 in tracked sales across two consecutive quarters, and you are reviewed for Tier 2 automatically.",
    image: "tier3",
  },
  {
    slug: "tier-2",
    name: "Tier 2 — Macro Exclusive",
    audience: "Macro creators",
    reach: "100k+ followers",
    headline: "Early access,",
    italic: "exclusive contract.",
    summary:
      "A contracted relationship with a guaranteed fee, first sight of every capsule drop, and long-form work that earns beyond a single post's lifespan.",
    reward: "Contracted fee + commission + early access",
    commissionBps: [2000, 2500],
    benefits: [
      "Contracted monthly fee on top of 20–25% commission",
      "Capsule drops 48 hours before the public, with allocation held",
      "Paid long-form masterclasses hosted in our tutorial library",
      "Co-developed capsule input on texture, length and shade",
      "Named account contact and quarterly strategy call",
    ],
    expectations: [
      "Category exclusivity for the contract term",
      "One long-form piece and four short-form pieces per month",
      "Content usage rights for paid social and the ad creative library",
    ],
    upgrade:
      "Tier 1 is invitation-only, but Tier 2 partners with red-carpet or editorial placement are put forward for it by the social marketing division.",
    image: "tier2",
  },
  {
    slug: "tier-1",
    name: "Tier 1 — Celebrity & Stylist",
    audience: "Celebrities and A-list stylists",
    reach: "By invitation and referral",
    headline: "Equity, retainer,",
    italic: "and the red carpet.",
    summary:
      "We court the stylists before the talent. Stylists decide what walks a red carpet, and that decision is made months before anyone sees it.",
    reward: "Equity participation + high retainer",
    benefits: [
      "Equity participation alongside a senior retainer",
      "Bespoke units built to your specification, unlimited",
      "Direct line to the manufacturing floor for custom work",
      "Co-branded capsule opportunity under your own name",
      "First refusal on new construction before it reaches the line",
    ],
    expectations: [
      "Placement on talent for editorial, red carpet, or press",
      "Advance notice of appearances for production planning",
      "Long-term exclusivity within the hair category",
    ],
    upgrade:
      "This is the top of the programme. Terms are negotiated individually and reviewed annually.",
    image: "tier1",
  },
];

export function getTier(slug: string): Tier | undefined {
  return TIERS.find((t) => t.slug === slug);
}

/**
 * The three promotable categories ambassadors choose from. Maps the brand's
 * commercial lines onto the storefront catalog.
 */
export interface PromotableCategory {
  id: string;
  name: string;
  blurb: string;
  /** Catalog `line` values that belong to this category. */
  lines: string[];
  /** Commission basis points paid on this category at Tier 3 baseline. */
  baseCommissionBps: number;
  image: ImageryKey;
  href: string;
}

export const PROMOTABLE_CATEGORIES: PromotableCategory[] = [
  {
    id: "core-wig-lines",
    name: "Core Wig Lines",
    blurb:
      "Beyond Lace Luxe and Silk — full virgin Remy signature units and silk-top caps for sensitive scalps. The highest ticket, the highest commission.",
    lines: ["luxe", "silk"],
    baseCommissionBps: 2000,
    image: "navShop",
    href: "/shop",
  },
  {
    id: "beyond-lace-pro",
    name: "Beyond Lace Pro",
    blurb:
      "The salon-exclusive white-label line. Refer a salon or reseller and earn on the partnership, not just the unit.",
    lines: ["pro"],
    baseCommissionBps: 1500,
    image: "b2bResources",
    href: "/wholesale",
  },
  {
    id: "aftercare",
    name: "Aftercare Vertical",
    blurb:
      "Beyond Care — adhesives, cleansers, stands and combs, plus the monthly subscription. Lower ticket, but it recurs every single month.",
    lines: ["care", "try-on"],
    baseCommissionBps: 1500,
    image: "fitGuides",
    href: "/shop?line=care",
  },
];

/** Commission payable on a USD minor-unit price at a given basis-point rate. */
export function commissionOn(priceMinorUnits: number, bps: number): number {
  return Math.round((priceMinorUnits * bps) / 10000);
}
