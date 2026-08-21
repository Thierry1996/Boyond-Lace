import Link from "next/link";
import type { Metadata } from "next";
import { commerce, type ProductQuery } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { FilterGroup } from "@/components/collections/FilterGroup";
import { SidebarPromo } from "@/components/collections/SidebarPromo";

export const metadata: Metadata = {
  title: "All Units — Luxury HD Lace Human Hair Wigs",
  description:
    "Hand-tied HD Swiss lace human hair wigs, glueless units, and silk tops. Batch-consistent virgin Remy, individually bleached knots, pre-plucked hairlines.",
};

/**
 * Native filter facets, built from the collections the importer sorts products
 * into. Each group is one filter key; its options are collection names. Only
 * collections that actually exist in the catalogue are shown, so the filter
 * grows automatically as the catalogue does — no hand-maintained enum lists.
 */
const FILTER_GROUPS: { key: string; label: string; collections: string[] }[] = [
  {
    key: "construction",
    label: "Construction",
    collections: [
      "Full Lace Wigs", "Lace Front Wigs", "Lace Closure Wigs", "Glueless Wigs",
      "U-Part & V-Part Wigs", "Lace Frontals", "Closures", "Full Lace Units",
    ],
  },
  {
    key: "cut",
    label: "Length & Cut",
    collections: ["Bob & Short Wigs", "Long Wigs", "Layered Wigs", "Curtain Bang Wigs"],
  },
  {
    key: "texture",
    label: "Texture",
    collections: [
      "Straight Wigs", "Body Wave Wigs", "Deep Wave Wigs", "Loose & Water Wave Wigs",
      "Curly Wigs", "Kinky Straight Wigs",
    ],
  },
  {
    key: "colour",
    label: "Colour",
    collections: ["Natural Black Wigs", "Coloured & Fashion Wigs"],
  },
  {
    key: "range",
    label: "Range",
    collections: ["Hair Extensions & Bundles", "Crochet Braids"],
  },
];
const FACET_OF = new Map<string, string>(
  FILTER_GROUPS.flatMap((g) => g.collections.map((c) => [c, g.key] as [string, string])),
);

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Best rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "newest", label: "Newest" },
] as const;

type SearchParams = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

const PER_PAGE = 16;

/** Toggle a single filter value while preserving the rest. Any filter/sort change
 *  drops `page`, so refining always returns you to the first page. */
function toggleHref(params: SearchParams, key: string, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== key && k !== "page") next.set(k, s);
  }
  if (one(params[key]) !== value) next.set(key, value);
  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

/** Link to a specific page, preserving the active filters + sort. */
function pageHref(params: SearchParams, page: number): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== "page") next.set(k, s);
  }
  if (page > 1) next.set("page", String(page));
  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const sort = (one(params.sort) as ProductQuery["sort"]) ?? "featured";

  // Live, unfiltered set — the facets and their counts are derived from it.
  const all = await commerce.getProducts({ sort });

  // Active collection filter per facet group (AND across groups).
  const active = FILTER_GROUPS.map((g) => one(params[g.key])).filter(Boolean) as string[];
  const products = active.length
    ? all.filter((p) => active.every((c) => (p.collections ?? []).includes(c)))
    : all;

  // Counts respect the *other* active facets, so refining never dead-ends.
  const countFor = (collection: string) => {
    const others = active.filter((c) => FACET_OF.get(c) !== FACET_OF.get(collection));
    return all.filter(
      (p) =>
        (p.collections ?? []).includes(collection) &&
        others.every((c) => (p.collections ?? []).includes(c)),
    ).length;
  };

  // Paginate the filtered set — 16 per page.
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const page = Math.min(Math.max(1, parseInt(one(params.page) ?? "1", 10) || 1), totalPages);
  const pageProducts = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const firstOnPage = products.length ? (page - 1) * PER_PAGE + 1 : 0;
  const lastOnPage = Math.min(page * PER_PAGE, products.length);

  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">The collection</span>
            <span className="eyebrow hidden md:block">Hand-tied · Batch-matched</span>
            <span className="eyebrow tabular-nums">{all.length} units</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              Every unit here
              <span className="block italic">was built to disappear.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Individually bleached knots, pre-plucked hairlines, and a batch consistency guarantee
              that means the unit you reorder in eighteen months matches the one in your hand today.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-[4vw] py-16">
        <div className="grid gap-14 lg:grid-cols-[240px_1fr]">
          {/* Filters — one group per facet, options are live collections */}
          <aside
            aria-label="Filters"
            className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <p className="eyebrow">Refine</p>
              {active.length > 0 && (
                <Link href="/shop" className="text-[0.75rem] text-gold underline-offset-4 hover:underline">
                  Clear ({active.length})
                </Link>
              )}
            </div>

            {FILTER_GROUPS.map((group) => {
              const opts = group.collections
                .map((c) => ({ name: c, count: countFor(c) }))
                .filter((o) => o.count > 0 || one(params[group.key]) === o.name);
              if (!opts.length) return null;
              return (
                <FilterGroup key={group.key} label={group.label}>
                  <ul className="space-y-2.5">
                    {opts.map((opt) => {
                      const isActive = one(params[group.key]) === opt.name;
                      return (
                        <li key={opt.name}>
                          <Link
                            href={toggleHref(params, group.key, opt.name)}
                            aria-pressed={isActive}
                            className={`flex items-center gap-2.5 text-[0.875rem] transition-colors ${
                              isActive ? "text-gold" : "text-neutral-400 hover:text-paper"
                            }`}
                          >
                            <span
                              className={`inline-block h-[7px] w-[7px] rotate-45 border transition-colors ${
                                isActive ? "border-gold bg-gold" : "border-neutral-400"
                              }`}
                            />
                            <span className="flex-1">{opt.name.replace(/ Wigs?$/, "")}</span>
                            <span className="text-[0.6875rem] text-neutral-400/70 tabular-nums">
                              {opt.count}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </FilterGroup>
              );
            })}

            <div className="mt-8 border border-gold/25 p-6">
              <p className="eyebrow mb-3 text-gold">Unsure of your shade?</p>
              <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                The Lace Test sends six swatches and five shade cards for $5, redeemable in full.
              </p>
              <Link
                href="/product/lace-test-kit"
                className="mt-4 inline-block border-b border-gold pb-0.5 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
              >
                Order the kit
              </Link>
            </div>

            <SidebarPromo />
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
              <p className="text-[0.8125rem] text-neutral-400 tabular-nums">
                {products.length === 0
                  ? "0 units"
                  : `${firstOnPage}–${lastOnPage} of ${products.length} units`}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {SORTS.map((s) => {
                  const isActive = (one(params.sort) ?? "featured") === s.value;
                  return (
                    <Link
                      key={s.value}
                      href={toggleHref(params, "sort", s.value)}
                      className={`text-[0.75rem] tracking-[0.08em] uppercase transition-colors ${
                        isActive ? "text-gold" : "text-neutral-400 hover:text-paper"
                      }`}
                    >
                      {s.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {products.length === 0 ? (
              <div className="border border-white/[0.07] px-8 py-24 text-center">
                <h2 className="text-2xl text-paper">Nothing matches that combination.</h2>
                <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-neutral-400">
                  Widen the filters, or tell us what you were looking for and we will tell you when it
                  exists.
                </p>
                <Link
                  href="/shop"
                  className="mt-8 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <>
                <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {pageProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Pagination"
                    className="mt-16 flex items-center justify-center gap-6 border-t border-white/[0.07] pt-10"
                  >
                    {page > 1 ? (
                      <Link
                        href={pageHref(params, page - 1)}
                        rel="prev"
                        className="text-[0.75rem] tracking-[0.12em] text-neutral-200 uppercase transition-colors hover:text-gold"
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span className="text-[0.75rem] tracking-[0.12em] text-neutral-400/40 uppercase">
                        ← Previous
                      </span>
                    )}

                    <span className="text-[0.75rem] tracking-[0.12em] text-neutral-400 uppercase tabular-nums">
                      Page {page} of {totalPages}
                    </span>

                    {page < totalPages ? (
                      <Link
                        href={pageHref(params, page + 1)}
                        rel="next"
                        className="border border-gold px-7 py-3 text-[0.75rem] tracking-[0.14em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-ink"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="border border-white/10 px-7 py-3 text-[0.75rem] tracking-[0.14em] text-neutral-400/40 uppercase">
                        Next →
                      </span>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
