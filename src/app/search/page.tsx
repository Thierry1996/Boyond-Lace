import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { searchSite } from "@/lib/search";
import { ProductCard } from "@/components/ui/ProductCard";

export const metadata: Metadata = {
  title: "Search",
  description: "Search Beyond Lace units, guides, brand pages, and wholesale resources.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  // Same ranking the header dropdown uses — one implementation, so a result
  // never appears in the live panel and then vanishes on the full page.
  const allProducts = await commerce.getProducts();
  const results = searchSite(query, allProducts, { products: 60, docs: 40 });
  const productHits = allProducts.filter((p) => results.products.some((r) => r.id === p.id));
  const pageHits = results.docs;

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
