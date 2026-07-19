import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Beyond Lace units, guides, brand pages, and wholesale resources.",
};

/** Static page index — grows with the CMS phase; covers every live route today. */
const PAGE_INDEX = [
  {
    title: "The Beyond Lace Manifesto",
    href: "/brand",
    blurb: "Why this brand exists — transformation over hair sales.",
  },
  {
    title: "The 6 Empire Pillars",
    href: "/brand#pillars",
    blurb: "The six load-bearing systems behind the brand.",
  },
  {
    title: "Wholesale Salon Programme",
    href: "/wholesale",
    blurb: "Bronze / Silver / Gold tiers, MOQ 50, MAP-protected.",
  },
  {
    title: "Private Label — Beyond Lace Pro",
    href: "/wholesale#private-label",
    blurb: "Your branding, our construction and batch guarantee.",
  },
  {
    title: "Sourcing & Batch Consistency",
    href: "/wholesale#sourcing",
    blurb: "Virgin Remy standards and the measured batch guarantee.",
  },
  {
    title: "Lace Colour Matching Guide",
    href: "/learn#shade",
    blurb: "The $5 answer to the industry's biggest friction point.",
  },
  {
    title: "Size & Cap Guide",
    href: "/learn#sizing",
    blurb: "Petite, average, large — and how to measure honestly.",
  },
  {
    title: "Hair Grades, Explained",
    href: "/learn#grades",
    blurb: "What 10A/12A actually means, and what to check instead.",
  },
  {
    title: "Lace Melting Tutorial",
    href: "/learn#melting",
    blurb: "The full melt sequence, including the step tutorials skip.",
  },
  {
    title: "Find Your Unit — Quiz",
    href: "/learn/quiz",
    blurb: "Five questions, three ranked matches, ninety seconds.",
  },
  {
    title: "The Beyond Circle",
    href: "/circle",
    blurb: "Community, transformation stories, loyalty, masterclasses.",
  },
  {
    title: "Ambassador Programme",
    href: "/circle#ambassadors",
    blurb: "Three tiers, from micro-affiliate to celebrity stylist.",
  },
  {
    title: "Track My Order",
    href: "/support#track",
    blurb: "Order status, dispatch emails, and who to ask.",
  },
  {
    title: "Returns & Exchanges",
    href: "/support#returns",
    blurb: "Thirty days, lace uncut, Lace Test credit automatic.",
  },
  {
    title: "Warranty",
    href: "/support#warranty",
    blurb: "Twelve months on construction, unlimited on batch claims.",
  },
  {
    title: "Virtual Try-On",
    href: "/try-on",
    blurb: "On-device AR try-on — your face never leaves the browser.",
  },
  { title: "Careers", href: "/careers", blurb: "Open roles at Beyond Lace." },
  {
    title: "Privacy Policy",
    href: "/legal/privacy",
    blurb: "What we collect, what we never do with it.",
  },
  { title: "Terms of Service", href: "/legal/terms", blurb: "The agreement, in legible English." },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const allProducts = await commerce.getProducts();
  const productHits = query
    ? allProducts.filter((p) =>
        [p.title, p.tagline, p.description, p.texture, p.laceType, ...p.badges]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : [];
  const pageHits = query
    ? PAGE_INDEX.filter((pg) => `${pg.title} ${pg.blurb}`.toLowerCase().includes(query))
    : [];

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Search</span>
        <span className="eyebrow">Units · Guides · Brand · Wholesale</span>
      </div>

      <form action="/search" method="get" className="mt-14 max-w-2xl" role="search">
        <label htmlFor="q" className="eyebrow mb-3 block">
          What are you looking for?
        </label>
        <div className="flex gap-3">
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={q ?? ""}
            placeholder="Glueless, silk top, shade matching, MAP policy…"
            className="w-full border border-white/15 bg-transparent px-5 py-4 text-lg text-paper placeholder:text-neutral-400/50 focus:border-gold focus:outline-none"
          />
          <button
            type="submit"
            className="shrink-0 border border-gold px-8 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Search
          </button>
        </div>
      </form>

      {query && (
        <div className="mt-16">
          <p className="eyebrow tabular-nums">
            {productHits.length + pageHits.length} results for &ldquo;{q}&rdquo;
          </p>

          {productHits.length > 0 && (
            <div className="mt-10">
              <h2 className="mb-8 text-2xl text-paper">Units & products</h2>
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                {productHits.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {pageHits.length > 0 && (
            <div className="mt-14">
              <h2 className="mb-6 text-2xl text-paper">Guides & pages</h2>
              <div className="divide-y divide-white/[0.07] border-t border-white/[0.07]">
                {pageHits.map((pg) => (
                  <Link key={pg.href} href={pg.href} className="group block py-5">
                    <span className="text-[1.0625rem] text-paper group-hover:text-blush-300">
                      {pg.title}
                    </span>
                    <span className="mt-1 block text-[0.875rem] text-neutral-400">{pg.blurb}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {productHits.length === 0 && pageHits.length === 0 && (
            <div className="mt-12 max-w-lg">
              <h2 className="text-2xl text-paper">Nothing found for that.</h2>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-neutral-400">
                Try a construction (&ldquo;glueless&rdquo;, &ldquo;silk top&rdquo;), a texture, or a
                topic (&ldquo;returns&rdquo;, &ldquo;shade&rdquo;). Or skip the search entirely —{" "}
                <Link href="/learn/quiz" className="text-gold underline-offset-4 hover:underline">
                  the quiz finds your unit in ninety seconds
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
