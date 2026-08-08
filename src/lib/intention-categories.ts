import { getDataClient } from "@/lib/supabase/data";

/**
 * Shop-by-intention categories — the merchandising wall on /shop-by-intentions.
 *
 * These sit alongside the editorial `collections` (lib/collections.ts). A
 * collection is a full landing page with its own copy and FAQ; an intention
 * category is a lighter shortcut — a labelled circle that routes to the right
 * place: an existing collection, a pre-filtered /shop view, or a content hub.
 * That keeps merchandising buckets (sale, trending, accessories, price bands)
 * out of the heavy Collection type while still being real, working links.
 *
 * Categories that duplicate an existing collection (Best Sellers, HD invisible
 * lace, all-glueless, bundles-and-closure-only) are deliberately omitted here —
 * the collection already covers them.
 *
 * `count` is a merchandising display number, not a live query count (these
 * buckets span the aspirational full catalogue). Swap for live counts when the
 * real catalogue lands. Slugs, labels and routes are the source of truth; the
 * Supabase table below mirrors this seed and is the storefront's live source,
 * with this array as a bulletproof fallback.
 */
export interface IntentionCategory {
  slug: string;
  label: string;
  eyebrow: string;
  /** Gradient placeholder key (aurora/velvet/plum/blush/gold/mono/mono-2). */
  image: string;
  /** Working destination — existing collection, filtered /shop, or a hub. */
  href: string;
  /** Merchandising display count. Omitted where the bucket has no headline number. */
  count?: number;
}

export const intentionCategories: IntentionCategory[] = [
  {
    slug: "premium-wigs",
    label: "Premium Wigs",
    eyebrow: "The signature line",
    image: "plum",
    href: "/shop?line=luxe",
    count: 1200,
  },
  {
    slug: "premium-double-drawn-wigs",
    label: "Premium Double Drawn Wigs",
    eyebrow: "Root-to-tip fullness",
    image: "gold",
    href: "/shop?line=luxe&sort=price-desc",
    count: 700,
  },
  {
    slug: "top-tier-favourites",
    label: "Top-Tier Favourites",
    eyebrow: "Most loved",
    image: "gold",
    href: "/shop?sort=rating",
    count: 104,
  },
  {
    slug: "currently-trending",
    label: "Currently Trending",
    eyebrow: "Moving fast",
    image: "aurora",
    href: "/shop?sort=rating",
    count: 612,
  },
  {
    slug: "wear-go-straight-wigs",
    label: "Wear & Go (Glueless) Straight Wigs",
    eyebrow: "Wear & go",
    image: "velvet",
    href: "/shop?fit=glueless-wear-go&texture=straight",
    count: 77,
  },
  {
    slug: "glueless-curly-units",
    label: "Glueless Curly Units",
    eyebrow: "Wear & go curls",
    image: "plum",
    href: "/shop?fit=glueless-wear-go&texture=kinky-curly",
    count: 100,
  },
  {
    slug: "curly-full-frontal-wigs",
    label: "Curly Full Frontal Wigs",
    eyebrow: "Defined curls",
    image: "velvet",
    href: "/shop?lace=hd-swiss-full&texture=kinky-curly",
    count: 512,
  },
  {
    slug: "fringe-bob-pixie",
    label: "Fringe Bob & Pixie Cut",
    eyebrow: "Short & sharp",
    image: "blush",
    href: "/shop?texture=straight",
    count: 782,
  },
  {
    slug: "crochet-braids",
    label: "Crochet Braids",
    eyebrow: "Protective styles",
    image: "velvet",
    href: "/shop?texture=kinky-curly",
    count: 698,
  },
  {
    slug: "headband-wigs",
    label: "Headband Wigs",
    eyebrow: "Five-minute, no lace",
    image: "plum",
    href: "/shop?fit=glueless-wear-go",
    count: 683,
  },
  {
    slug: "colour-highlighted-curly-fringe",
    label: "Colour: Double Drawn Highlighted Curly Fringe",
    eyebrow: "Fashion colour",
    image: "blush",
    href: "/shop?shade=honey-balayage",
  },
  {
    slug: "combos",
    label: "Combos",
    eyebrow: "Buy together, save",
    image: "plum",
    href: "/shop?line=bundle",
    count: 198,
  },
  {
    slug: "extensions-and-bundles",
    label: "Extensions & Bundles",
    eyebrow: "Build your install",
    image: "mono",
    href: "/shop?line=bundle",
    count: 3120,
  },
  {
    slug: "maintenance-accessories",
    label: "Maintenance & Wig Accessories",
    eyebrow: "Care & tools",
    image: "mono",
    href: "/shop?line=care",
    count: 700,
  },
  {
    slug: "accessories",
    label: "Accessories",
    eyebrow: "Tools & care",
    image: "mono-2",
    href: "/shop?line=care",
    count: 542,
  },
  {
    slug: "anniversary-sale",
    label: "10 Year Anniversary Sale",
    eyebrow: "Limited time",
    image: "blush",
    href: "/shop?sort=price-asc",
    count: 900,
  },
  {
    slug: "flash-sales",
    label: "Flash Sales",
    eyebrow: "While stocks last",
    image: "blush",
    href: "/shop?sort=price-asc",
    count: 83,
  },
  {
    slug: "below-250",
    label: "Below $250",
    eyebrow: "Under budget",
    image: "gold",
    href: "/shop?sort=price-asc",
    count: 450,
  },
  {
    slug: "clearance-samples",
    label: "Clearance: Pre-tested Samples",
    eyebrow: "Lace cut units",
    image: "mono",
    href: "/shop?sort=price-asc",
    count: 340,
  },
  {
    slug: "hair-masterclasses",
    label: "The Beyond Lace Hair Masterclasses",
    eyebrow: "Learn the craft",
    image: "mono-2",
    href: "/learn",
    count: 8,
  },
  {
    slug: "all-products",
    label: "All Products",
    eyebrow: "The whole floor",
    image: "mono-2",
    href: "/shop",
    count: 7860,
  },
];

/* ── Supabase-backed source, static registry as fallback ─────────────────────
   Mirrors the pattern in lib/collections.ts: read the live table when the data
   client is configured, otherwise (or on any failure) fall back to the in-code
   seed so the storefront never breaks. */

interface IntentionRow {
  slug: string;
  label: string;
  eyebrow: string;
  image: string;
  href: string;
  count: number | null;
}

function rowToCategory(r: IntentionRow): IntentionCategory {
  return {
    slug: r.slug,
    label: r.label,
    eyebrow: r.eyebrow,
    image: r.image,
    href: r.href,
    count: r.count ?? undefined,
  };
}

/** Every intention category, in display order. Supabase-first, static fallback. */
export async function getIntentionCategories(): Promise<IntentionCategory[]> {
  const sb = getDataClient();
  if (!sb) return intentionCategories;
  try {
    const { data, error } = await sb.from("intention_categories").select("*").order("sort_order");
    if (error || !data || data.length === 0) return intentionCategories;
    return (data as IntentionRow[]).map(rowToCategory);
  } catch {
    return intentionCategories;
  }
}
