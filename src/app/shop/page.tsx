import Link from "next/link";
import type { Metadata } from "next";
import {
  commerce,
  type ProductQuery,
  type Texture,
  type LaceType,
  type Shade,
} from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";

export const metadata: Metadata = {
  title: "All Units — Luxury HD Lace Human Hair Wigs",
  description:
    "Hand-tied HD Swiss lace human hair wigs, glueless units, and silk tops. Batch-consistent virgin Remy, individually bleached knots, pre-plucked hairlines.",
};

const FILTERS = {
  texture: {
    label: "Texture",
    options: [
      { value: "straight", label: "Straight" },
      { value: "body-wave", label: "Body Wave" },
      { value: "deep-wave", label: "Deep Wave" },
      { value: "kinky-straight", label: "Kinky Straight" },
      { value: "curly", label: "Curly" },
    ],
  },
  lace: {
    label: "Construction",
    options: [
      { value: "hd-swiss-full", label: "Full Lace" },
      { value: "hd-swiss-13x6", label: "13x6 Frontal" },
      { value: "hd-swiss-13x4", label: "13x4 Frontal" },
      { value: "glueless", label: "Glueless" },
      { value: "silk-top", label: "Silk Top" },
    ],
  },
  shade: {
    label: "Shade",
    options: [
      { value: "natural-black", label: "Natural Black" },
      { value: "espresso", label: "Espresso" },
      { value: "brunette", label: "Brunette" },
      { value: "honey-blonde", label: "Honey Blonde" },
      { value: "platinum", label: "Platinum" },
    ],
  },
} as const;

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Best rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "newest", label: "Newest" },
] as const;

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

/** Builds a href that toggles a single filter value while preserving the rest. */
function toggleHref(params: SearchParams, key: string, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== key) next.set(k, s);
  }
  if (one(params[key]) !== value) next.set(key, value);
  const qs = next.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const query: ProductQuery = {
    texture: one(params.texture) ? [one(params.texture) as Texture] : undefined,
    laceType: one(params.lace) ? [one(params.lace) as LaceType] : undefined,
    shade: one(params.shade) ? [one(params.shade) as Shade] : undefined,
    line: one(params.line) as ProductQuery["line"],
    sort: (one(params.sort) as ProductQuery["sort"]) ?? "featured",
  };

  const products = await commerce.getProducts(query);
  const activeCount = ["texture", "lace", "shade", "line"].filter((k) => one(params[k])).length;

  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">The collection</span>
            <span className="eyebrow hidden md:block">Hand-tied · Batch-matched</span>
            <span className="eyebrow tabular-nums">{products.length} units</span>
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
          {/* Filters */}
          <aside aria-label="Filters">
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <p className="eyebrow">Refine</p>
              {activeCount > 0 && (
                <Link
                  href="/shop"
                  className="text-[0.75rem] text-gold underline-offset-4 hover:underline"
                >
                  Clear ({activeCount})
                </Link>
              )}
            </div>

            {Object.entries(FILTERS).map(([key, group]) => (
              <div key={key} className="border-b border-white/[0.07] py-6">
                <p className="eyebrow mb-4">{group.label}</p>
                <ul className="space-y-2.5">
                  {group.options.map((opt) => {
                    const active = one(params[key]) === opt.value;
                    return (
                      <li key={opt.value}>
                        <Link
                          href={toggleHref(params, key, opt.value)}
                          aria-pressed={active}
                          className={`flex items-center gap-2.5 text-[0.875rem] transition-colors ${
                            active ? "text-gold" : "text-neutral-400 hover:text-paper"
                          }`}
                        >
                          <span
                            className={`inline-block h-[7px] w-[7px] rotate-45 border transition-colors ${
                              active ? "border-gold bg-gold" : "border-neutral-400"
                            }`}
                          />
                          {opt.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}

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
          </aside>

          {/* Grid */}
          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
              <p className="text-[0.8125rem] text-neutral-400 tabular-nums">
                {products.length} {products.length === 1 ? "unit" : "units"}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {SORTS.map((s) => {
                  const active = (one(params.sort) ?? "featured") === s.value;
                  return (
                    <Link
                      key={s.value}
                      href={toggleHref(params, "sort", s.value)}
                      className={`text-[0.75rem] tracking-[0.08em] uppercase transition-colors ${
                        active ? "text-gold" : "text-neutral-400 hover:text-paper"
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
                  Our capsule runs are deliberately narrow — two hundred units and no restock. Widen
                  the filters, or tell us what you were looking for and we will tell you when it
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
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
