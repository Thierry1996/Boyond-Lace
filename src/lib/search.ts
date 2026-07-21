/**
 * Site search index.
 *
 * The route list is DERIVED from the navigation ecosystem rather than retyped,
 * so a page that is renamed or removed cannot leave a dead result behind — the
 * same guarantee navigation.ts already makes ("nothing 404s"). Curated blurbs
 * and keywords are layered on top for the destinations people actually search
 * for, keyed by href.
 *
 * Products are not indexed here: they come from the commerce adapter at query
 * time so the catalogue is always live.
 */

import { primaryNav, footerColumns, type NavLink } from "@/lib/navigation";
import type { Product } from "@/lib/commerce";

export type SearchSection = "Products" | "Guides" | "Support" | "Wholesale" | "Brand" | "FAQ";

export interface SearchDoc {
  title: string;
  href: string;
  blurb: string;
  section: SearchSection;
  /** Extra terms people actually type that do not appear in the title. */
  keywords?: string[];
}

export interface SearchHit extends SearchDoc {
  score: number;
}

export interface ProductHit {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: number;
  image: string;
  imageAlt: string;
  score: number;
}

export interface SearchResults {
  query: string;
  products: ProductHit[];
  docs: SearchHit[];
  total: number;
}

/** Minimum characters before a live search is worth running. */
export const MIN_QUERY_LENGTH = 3;

/**
 * Editorial layer: blurbs and synonyms for the destinations that carry real
 * search intent. Anything not listed still gets indexed from its nav label —
 * it simply ranks on the label alone.
 */
const ENRICHMENT: Record<string, { blurb: string; keywords?: string[] }> = {
  "/shop": {
    blurb: "Every unit currently in production.",
    keywords: ["buy", "wigs", "catalogue", "collection", "browse"],
  },
  "/shop/bestsellers": { blurb: "What actually sells, ranked.", keywords: ["popular", "top"] },
  "/shop/new-arrivals": { blurb: "The most recent drops.", keywords: ["latest", "new in"] },
  "/shop/sale": { blurb: "Reduced units, while they last.", keywords: ["discount", "offer"] },
  "/recommended": {
    blurb: "Top picks by construction, silhouette and purpose.",
    keywords: ["best", "picks", "compare", "which wig"],
  },
  "/recommended#compare": {
    blurb: "Beyond Lace against the mass-market norm, four dimensions.",
    keywords: ["comparison", "versus", "vs", "difference"],
  },
  "/learn#shade": {
    blurb: "The $5 answer to the industry's biggest friction point.",
    keywords: ["colour match", "color match", "shade", "matching", "lace test"],
  },
  "/learn#sizing": {
    blurb: "Petite, average, large — and how to measure honestly.",
    keywords: ["size", "measure", "cap", "circumference", "fit"],
  },
  "/learn#grades": {
    blurb: "What 10A/12A actually means, and what to check instead.",
    keywords: ["grade", "10a", "12a", "virgin", "remy", "quality"],
  },
  "/learn#melting": {
    blurb: "The full melt sequence, including the step tutorials skip.",
    keywords: ["melt", "glue", "adhesive", "install", "apply"],
  },
  "/learn#maintenance": {
    blurb: "Washing, detangling and storage that actually extends lifespan.",
    keywords: ["wash", "care", "detangle", "storage", "maintain"],
  },
  "/learn#faq": {
    blurb: "The questions we are asked most, answered plainly.",
    keywords: ["faq", "questions", "help", "answers"],
  },
  "/learn/quiz": {
    blurb: "Five questions, three ranked matches, ninety seconds.",
    keywords: ["quiz", "find my unit", "recommend", "match"],
  },
  "/support": { blurb: "Orders, returns, warranty and how to reach a human." },
  "/support#track": {
    blurb: "Order status, dispatch emails, and who to ask.",
    keywords: ["track", "tracking", "where is my order", "delivery"],
  },
  "/support#returns": {
    blurb: "Thirty days, lace uncut, Lace Test credit automatic.",
    keywords: ["return", "refund", "exchange", "send back"],
  },
  "/support#warranty": {
    blurb: "Twelve months on construction, unlimited on batch claims.",
    keywords: ["warranty", "guarantee", "faulty", "defect"],
  },
  "/support#shipping": {
    blurb: "Timelines, duties, and complimentary thresholds.",
    keywords: ["shipping", "delivery", "customs", "duty", "postage"],
  },
  "/support#contact": {
    blurb: "Email, WhatsApp and hours in your timezone.",
    keywords: ["contact", "email", "whatsapp", "phone", "talk to someone"],
  },
  "/support/returns-portal": {
    blurb: "Start a return and print a label.",
    keywords: ["return portal", "rma", "label"],
  },
  "/support/size-guide": {
    blurb: "Cap measurements with a printable tape guide.",
    keywords: ["size guide", "measurement", "chart"],
  },
  "/support/tutorials": {
    blurb: "Step-by-step video walkthroughs.",
    keywords: ["how to", "tutorial", "video", "guide"],
  },
  "/support/lace-comparison": {
    blurb: "HD, Swiss, transparent and silk top, compared honestly.",
    keywords: ["hd lace", "swiss lace", "transparent", "silk top", "which lace"],
  },
  "/support/wholesale-pricing": {
    blurb: "Tier pricing and volume breaks.",
    keywords: ["price list", "pricing", "trade price", "cost"],
  },
  "/support/bulk-orders": {
    blurb: "Large-volume and repeat ordering.",
    keywords: ["bulk", "volume", "large order"],
  },
  "/wholesale": {
    blurb: "Bronze / Silver / Gold tiers, MOQ 50, MAP-protected.",
    keywords: ["wholesale", "salon", "trade", "reseller", "stockist", "b2b"],
  },
  "/wholesale#apply": {
    blurb: "Become a stocking partner.",
    keywords: ["apply", "partner", "account"],
  },
  "/wholesale#map": {
    blurb: "Minimum advertised price, enforced not suggested.",
    keywords: ["map", "price protection", "undercut"],
  },
  "/wholesale#private-label": {
    blurb: "Your branding, our construction and batch guarantee.",
    keywords: ["private label", "white label", "own brand", "oem"],
  },
  "/wholesale#samples": { blurb: "Sample units before committing to a tier." },
  "/wholesale#sourcing": {
    blurb: "Virgin Remy standards and the measured batch guarantee.",
    keywords: ["sourcing", "origin", "ethical", "batch"],
  },
  "/brand": {
    blurb: "Why this brand exists — transformation over hair sales.",
    keywords: ["about", "story", "manifesto", "who we are"],
  },
  "/brand#pillars": { blurb: "The six load-bearing systems behind the brand." },
  "/brand#founder": { blurb: "Who started this, and why.", keywords: ["founder", "team"] },
  "/circle": {
    blurb: "Community, transformation stories, loyalty, masterclasses.",
    keywords: ["community", "loyalty", "rewards", "members"],
  },
  "/circle#ambassadors": {
    blurb: "Three tiers, from micro-affiliate to celebrity stylist.",
    keywords: ["ambassador", "affiliate", "creator", "influencer", "commission"],
  },
  "/ambassadors/apply": { blurb: "Apply to the ambassador programme." },
  "/try-on": {
    blurb: "On-device AR try-on — your face never leaves the browser.",
    keywords: ["try on", "ar", "virtual", "preview"],
  },
  "/drops": {
    blurb: "Two hundred numbered units, never restocked.",
    keywords: ["drop", "capsule", "limited", "release"],
  },
  "/account": { blurb: "Orders, addresses and preferences." },
  "/wishlist": { blurb: "Units you have saved." },
  "/legal/shipping-policy": {
    blurb: "The formal shipping terms.",
    keywords: ["shipping policy", "terms"],
  },
  "/legal/privacy": {
    blurb: "What we collect, what we never do with it.",
    keywords: ["privacy", "data", "gdpr"],
  },
  "/legal/terms": { blurb: "The agreement, in legible English." },
  "/careers": { blurb: "Open roles at Beyond Lace.", keywords: ["jobs", "hiring", "work with us"] },
};

/** Which bucket a route belongs to, by path shape. */
function sectionFor(href: string): SearchSection {
  if (href.startsWith("/wholesale")) return "Wholesale";
  if (href.startsWith("/support")) return "Support";
  if (href.startsWith("/brand") || href.startsWith("/circle")) return "Brand";
  if (href === "/learn#faq") return "FAQ";
  if (href.startsWith("/learn")) return "Guides";
  return "Guides";
}

/**
 * Flatten the navigation tree into indexable documents. Query-string routes
 * (/shop?texture=curly) are filter views rather than destinations, so they are
 * skipped to keep results meaningful.
 */
function buildIndex(): SearchDoc[] {
  const seen = new Map<string, SearchDoc>();

  const add = (link: NavLink) => {
    if (link.external || link.href.includes("?")) return;
    if (seen.has(link.href)) return;
    const extra = ENRICHMENT[link.href];
    seen.set(link.href, {
      title: link.label,
      href: link.href,
      blurb: extra?.blurb ?? link.note ?? "",
      section: sectionFor(link.href),
      keywords: extra?.keywords,
    });
    link.children?.forEach(add);
  };

  for (const item of primaryNav) {
    add({ label: item.label, href: item.href });
    item.groups?.forEach((g) => g.links.forEach(add));
  }
  for (const col of footerColumns) col.links.forEach(add);

  return [...seen.values()];
}

export const searchIndex: SearchDoc[] = buildIndex();

/**
 * Scored match. A title that starts with the query beats one that merely
 * contains it, which beats a keyword synonym, which beats blurb prose — so
 * typing "ret" surfaces Returns before a page that mentions returns in passing.
 */
function scoreText(query: string, doc: SearchDoc): number {
  const q = query.toLowerCase();
  const title = doc.title.toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (doc.keywords?.some((k) => k.toLowerCase().startsWith(q))) return 50;
  if (doc.keywords?.some((k) => k.toLowerCase().includes(q))) return 40;
  if (doc.blurb.toLowerCase().includes(q)) return 20;
  return 0;
}

function scoreProduct(query: string, p: Product): number {
  const q = query.toLowerCase();
  const title = p.title.toLowerCase();

  if (title.startsWith(q)) return 90;
  if (title.includes(q)) return 70;
  if ([p.texture, p.laceType, ...p.badges].join(" ").toLowerCase().includes(q)) return 45;
  if (p.tagline.toLowerCase().includes(q)) return 30;
  if (p.description.toLowerCase().includes(q)) return 15;
  return 0;
}

/** Run a query across products and the page index. Returns ranked groups. */
export function searchSite(
  rawQuery: string,
  products: Product[],
  limits: { products?: number; docs?: number } = {},
): SearchResults {
  const query = rawQuery.trim();
  if (query.length < MIN_QUERY_LENGTH) {
    return { query, products: [], docs: [], total: 0 };
  }

  const productHits: ProductHit[] = products
    .map((p) => ({ p, score: scoreProduct(query, p) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.p.title.localeCompare(b.p.title))
    .slice(0, limits.products ?? 6)
    .map(({ p, score }) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      tagline: p.tagline,
      price: p.price,
      image: p.images[0]?.src ?? "",
      imageAlt: p.images[0]?.alt ?? p.title,
      score,
    }));

  const docHits: SearchHit[] = searchIndex
    .map((doc) => ({ ...doc, score: scoreText(query, doc) }))
    .filter((d) => d.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
    .slice(0, limits.docs ?? 8);

  return {
    query,
    products: productHits,
    docs: docHits,
    total: productHits.length + docHits.length,
  };
}
