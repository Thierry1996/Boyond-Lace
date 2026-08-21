import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check } from "lucide-react";
import { commerce, type Product, type ProductQuery } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/collections/FaqAccordion";
import { PriceFilter } from "@/components/collections/PriceFilter";
import { FilterGroup } from "@/components/collections/FilterGroup";
import { SidebarPromo } from "@/components/collections/SidebarPromo";
import { collections, getCollectionBySlug, type Collection } from "@/lib/collections";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: `${collection.title.replace(/\.$/, "")} — ${collection.eyebrow} | Beyond Lace`,
    description: collection.metaDescription,
    alternates: { canonical: `/collections/${collection.slug}` },
  };
}

/* ── Facets ──────────────────────────────────────────────────────────────────
   Every filter group is computed from the collection's own product set, so the
   options and their counts are always real and a group with only one value is
   hidden as redundant. Filtering is multi-select and applied in-page, which
   keeps colour, length, texture, construction, cap size, density and price on
   one consistent mechanism. */

const LABELS: Record<string, Record<string, string>> = {
  color: {
    "natural-black": "Natural Black",
    espresso: "Espresso",
    brunette: "Brunette",
    "honey-blonde": "Honey Blonde",
    platinum: "Platinum",
    "custom-fashion": "Custom Fashion",
    "blonde-613": "613 Blonde",
    "honey-balayage": "Honey Balayage",
    "auburn-copper": "Auburn Copper",
    "burgundy-99j": "Burgundy 99J",
  },
  texture: {
    straight: "Straight",
    "body-wave": "Body Wave",
    "deep-wave": "Deep Wave",
    curly: "Curly",
    "kinky-straight": "Kinky Straight",
    "kinky-curly": "Kinky Curly (4C)",
    "water-wave": "Water Wave",
    "jerry-curl": "Jerry Curl",
    yaki: "Yaki",
  },
  lace: {
    "hd-swiss-full": "Full Lace",
    "hd-swiss-13x6": "13×6 Frontal",
    "hd-swiss-13x4": "13×4 Frontal",
    "hd-swiss-7x5": "7×5 Bye-Bye-Knots",
    "hd-swiss-5x5": "5×5 Closure",
    "closure-4x4": "4×4 Closure",
    "silk-top": "Silk Top",
    glueless: "Glueless",
  },
  cap: {
    adjustable: "Adjustable (one size)",
    petite: "Petite",
    average: "Average",
    large: "Large",
  },
};

interface LengthBucket {
  value: string;
  label: string;
  min: number;
  max: number;
}
const LENGTH_BUCKETS: LengthBucket[] = [
  { value: "bob", label: 'Bob / Short (10–14")', min: 0, max: 14 },
  { value: "shoulder", label: 'Shoulder (16–18")', min: 15, max: 18 },
  { value: "medium", label: 'Medium (20–22")', min: 19, max: 22 },
  { value: "long", label: 'Long (24–26")', min: 23, max: 26 },
  { value: "xlong", label: 'Extra Long (28"+)', min: 27, max: 999 },
];

function lengthBucketsOf(lengths?: number[]): string[] {
  if (!lengths?.length) return [];
  return LENGTH_BUCKETS.filter((b) => lengths.some((l) => l >= b.min && l <= b.max)).map(
    (b) => b.value,
  );
}

const titleCase = (v: string) =>
  v.replace(/(^|[-\s])(\w)/g, (_, s, c) => (s ? " " : "") + c.toUpperCase());

interface FacetGroup {
  key: string;
  label: string;
  valuesOf: (p: Product) => string[];
  labelOf: (v: string) => string;
  order?: string[];
}

const FACETS: FacetGroup[] = [
  {
    key: "color",
    label: "Color",
    valuesOf: (p) => (p.shade ? [p.shade] : []),
    labelOf: (v) => LABELS.color[v] ?? titleCase(v),
    order: Object.keys(LABELS.color),
  },
  {
    key: "length",
    label: "Length",
    valuesOf: (p) => lengthBucketsOf(p.lengths),
    labelOf: (v) => LENGTH_BUCKETS.find((b) => b.value === v)?.label ?? v,
    order: LENGTH_BUCKETS.map((b) => b.value),
  },
  {
    key: "texture",
    label: "Texture",
    valuesOf: (p) => (p.texture ? [p.texture] : []),
    labelOf: (v) => LABELS.texture[v] ?? titleCase(v),
    order: Object.keys(LABELS.texture),
  },
  {
    key: "lace",
    label: "Construction",
    valuesOf: (p) => (p.laceType ? [p.laceType] : []),
    labelOf: (v) => LABELS.lace[v] ?? titleCase(v),
    order: Object.keys(LABELS.lace),
  },
  {
    key: "cap",
    label: "Cap size",
    valuesOf: (p) => (p.capSizes?.length ? p.capSizes : ["adjustable"]),
    labelOf: (v) => LABELS.cap[v] ?? titleCase(v),
    order: Object.keys(LABELS.cap),
  },
  {
    key: "density",
    label: "Density",
    valuesOf: (p) => (p.density ? [p.density] : []),
    labelOf: (v) => v,
    order: ["120%", "130%", "150%", "180%", "200%", "250%"],
  },
];

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Best rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "newest", label: "Newest" },
] as const;

const PER_PAGE = 16;

/* ── Shared, brand-level editorial (same on every collection page) ───────── */
const CONSTRUCTION_ROWS = [
  {
    name: "HD Full Lace",
    best: "Updos, any parting direction",
    part: "Whole cap",
    ease: "Advanced",
  },
  { name: "13x6 Frontal", best: "Deep parts, front buns", part: "6 inches", ease: "Intermediate" },
  {
    name: "13x4 Frontal",
    best: "Everyday front-facing styles",
    part: "4 inches",
    ease: "Beginner",
  },
  {
    name: "5x5 / 4x4 Closure",
    best: "Sew-ins, protective installs",
    part: "Centre / side",
    ease: "Beginner",
  },
  { name: "Glueless", best: "Wear-and-go, no adhesive", part: "Pre-set", ease: "Easiest" },
];

const CARE_STEPS = [
  {
    t: "Wash cool, downward",
    b: "Co-wash every 8–10 wears with cool water, stroking down the strand — never scrubbing the knots.",
  },
  {
    t: "Condition mid-to-end",
    b: "Keep conditioner off the lace and knots; concentrate it where the hair is oldest and driest.",
  },
  {
    t: "Air-dry on a stand",
    b: "Dry on a canvas head to hold the cap shape. Diffuse waves and curls; never brush them dry.",
  },
  {
    t: "Wrap or bonnet nightly",
    b: "Satin at night stops friction frizz and doubles the time between washes.",
  },
];

type SearchParams = Record<string, string | string[] | undefined>;

function one(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function csv(params: SearchParams, key: string): string[] {
  const v = one(params[key]);
  return v ? v.split(",").filter(Boolean) : [];
}

/** Toggle a value inside a comma-list param, preserving every other param. Any
 *  refine change drops `page`, so it always returns to the first page. */
function toggleMultiHref(slug: string, params: SearchParams, key: string, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== key && k !== "page") next.set(k, s);
  }
  const cur = csv(params, key);
  const updated = cur.includes(value) ? cur.filter((x) => x !== value) : [...cur, value];
  if (updated.length) next.set(key, updated.join(","));
  const qs = next.toString();
  return qs ? `/collections/${slug}?${qs}` : `/collections/${slug}`;
}

/** Set a single-value param (sort), preserving the rest; resets to page 1. */
function sortHref(slug: string, params: SearchParams, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== "sort" && k !== "page") next.set(k, s);
  }
  if (value !== "featured") next.set("sort", value);
  const qs = next.toString();
  return qs ? `/collections/${slug}?${qs}` : `/collections/${slug}`;
}

/** Link to a specific page, preserving the active refine + sort. */
function pageHref(slug: string, params: SearchParams, page: number): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== "page") next.set(k, s);
  }
  if (page > 1) next.set("page", String(page));
  const qs = next.toString();
  return qs ? `/collections/${slug}?${qs}` : `/collections/${slug}`;
}

/** The collection's product set before refine — drives the grid and the facets. */
async function getBaseProducts(
  collection: Collection,
  sort: ProductQuery["sort"],
): Promise<Product[]> {
  if (collection.select === "new") {
    const all = await commerce.getProducts({ sort: sort ?? "newest" });
    return all.filter((p) => p.badges.includes("New") && p.price > 0);
  }
  if (collection.select === "bestsellers") {
    const all = await commerce.getProducts({ sort: "rating" });
    return all.filter((p) => p.price > 0).slice(0, 18);
  }
  return commerce.getProducts({ ...(collection.query ?? {}), sort: sort ?? "featured" });
}

/** Apply active facet + price refines in-page (multi-select, AND across groups). */
function applyRefines(products: Product[], params: SearchParams): Product[] {
  const min = one(params.min) ? Number(one(params.min)) : null;
  const max = one(params.max) ? Number(one(params.max)) : null;
  return products.filter((p) => {
    for (const g of FACETS) {
      const sel = csv(params, g.key);
      if (!sel.length) continue;
      const vals = g.valuesOf(p);
      if (!sel.some((s) => vals.includes(s))) return false;
    }
    const dollars = p.price / 100;
    if (min != null && dollars < min) return false;
    if (max != null && dollars > max) return false;
    return true;
  });
}

interface FacetOption {
  value: string;
  label: string;
  count: number;
}
function facetOptions(base: Product[], g: FacetGroup): FacetOption[] {
  const counts = new Map<string, number>();
  for (const p of base)
    for (const v of g.valuesOf(p)) if (v) counts.set(v, (counts.get(v) ?? 0) + 1);
  const opts = [...counts.entries()].map(([value, count]) => ({
    value,
    label: g.labelOf(value),
    count,
  }));
  if (g.order) opts.sort((a, b) => g.order!.indexOf(a.value) - g.order!.indexOf(b.value));
  else opts.sort((a, b) => b.count - a.count);
  return opts;
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const sp = await searchParams;
  const sort = (one(sp.sort) as ProductQuery["sort"]) ?? "featured";
  const base = await getBaseProducts(collection, sort);
  const products = applyRefines(base, sp);

  // Paginate the refined set — 16 per page.
  const totalPages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const page = Math.min(Math.max(1, parseInt(one(sp.page) ?? "1", 10) || 1), totalPages);
  const pageProducts = products.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const firstOnPage = products.length ? (page - 1) * PER_PAGE + 1 : 0;
  const lastOnPage = Math.min(page * PER_PAGE, products.length);

  // Facet groups with two or more options (a single-value group is redundant).
  const facetGroups = FACETS.map((g) => ({ g, options: facetOptions(base, g) })).filter(
    (x) => x.options.length >= 2,
  );
  const prices = base.map((p) => p.price / 100);
  const priceFloor = prices.length ? Math.floor(Math.min(...prices)) : 0;
  const priceCeil = prices.length ? Math.ceil(Math.max(...prices)) : 0;

  const activeCount = [...FACETS.map((g) => g.key), "min", "max"].filter((k) => one(sp[k])).length;

  // Hot Picks — best-rated in the collection, independent of active refines.
  const hotPicks = [...base]
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${collection.title.replace(/\.$/, "")} — Beyond Lace`,
    description: collection.metaDescription,
    url: `https://beyondlace.com/collections/${collection.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="surface-velvet border-b border-white/[0.07] pt-16 pb-14">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center gap-2 text-[0.75rem] text-neutral-400">
            <Link href="/shop" className="hover:text-paper">
              Shop
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/collections" className="hover:text-paper">
              Collections
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-200">{collection.label}</span>
          </div>
          <div className="mt-12 max-w-3xl">
            <p className="eyebrow mb-5 text-gold">{collection.eyebrow}</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              {collection.title}
              {collection.titleItalic && (
                <span className="block italic">{collection.titleItalic}</span>
              )}
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              {collection.tagline}
            </p>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <div className="mx-auto max-w-[1440px] px-[4vw] py-16">
        <div className="grid gap-14 lg:grid-cols-[248px_1fr]">
          <aside
            aria-label="Refine"
            className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-1"
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
              <p className="eyebrow">Refine</p>
              {activeCount > 0 && (
                <Link
                  href={`/collections/${collection.slug}`}
                  className="text-[0.75rem] text-gold underline-offset-4 hover:underline"
                >
                  Clear ({activeCount})
                </Link>
              )}
            </div>

            {facetGroups.map(({ g, options }) => (
              <FilterGroup key={g.key} label={g.label}>
                <ul className="space-y-2.5">
                  {options.map((opt) => {
                    const active = csv(sp, g.key).includes(opt.value);
                    return (
                      <li key={opt.value}>
                        <Link
                          href={toggleMultiHref(collection.slug, sp, g.key, opt.value)}
                          aria-pressed={active}
                          className={`flex items-center justify-between gap-2.5 text-[0.875rem] transition-colors ${
                            active ? "text-gold" : "text-neutral-400 hover:text-paper"
                          }`}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={`grid h-[15px] w-[15px] shrink-0 place-items-center border transition-colors ${
                                active ? "border-gold bg-gold/15" : "border-neutral-500"
                              }`}
                            >
                              {active && <Check size={11} strokeWidth={3} className="text-gold" />}
                            </span>
                            {opt.label}
                          </span>
                          <span className="text-[0.6875rem] text-neutral-500 tabular-nums">
                            {opt.count}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </FilterGroup>
            ))}

            {priceCeil > priceFloor && (
              <FilterGroup label="Price">
                <PriceFilter floor={priceFloor} ceil={priceCeil} />
              </FilterGroup>
            )}

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

          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
              <p className="text-[0.8125rem] text-neutral-400 tabular-nums">
                {products.length === 0
                  ? "0 units"
                  : `${firstOnPage}–${lastOnPage} of ${products.length} units`}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {SORTS.map((s) => {
                  const active = (one(sp.sort) ?? "featured") === s.value;
                  return (
                    <Link
                      key={s.value}
                      href={sortHref(collection.slug, sp, s.value)}
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
                  Widen the refine, or browse the full collection.
                </p>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="mt-8 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
                >
                  Clear refine
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
                        href={pageHref(collection.slug, sp, page - 1)}
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
                        href={pageHref(collection.slug, sp, page + 1)}
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

      {/* Hot Picks */}
      {hotPicks.length >= 3 && (
        <Section
          className="py-16"
          eyebrowLeft="Hot picks"
          eyebrowCenter={collection.label}
          eyebrowRight="Most reviewed"
        >
          <SectionHeading title="What moves fastest here." />
          <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {hotPicks.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Section>
      )}

      {/* Promo bands */}
      <section className="border-y border-white/[0.07] bg-plum-900 py-14">
        <div className="mx-auto grid max-w-[1440px] gap-6 px-[4vw] md:grid-cols-3">
          {[
            {
              eyebrow: "Try before you commit",
              title: "The Lace Test — $5",
              body: "Six swatches, five shade cards, credited back in full when you buy.",
              href: "/product/lace-test-kit",
              cta: "Order the kit",
            },
            {
              eyebrow: "For salons & resellers",
              title: "Trade pricing from 5 units",
              body: "Per-unit wholesale pricing, custom packaging and MAP protection.",
              href: "/wholesale",
              cta: "See wholesale",
            },
            {
              eyebrow: "Members only",
              title: "The Beyond Circle",
              body: "See twenty women with your hair type wearing it before your box lands.",
              href: "/circle",
              cta: "Join the Circle",
            },
          ].map((b) => (
            <Link
              key={b.title}
              href={b.href}
              className="group border border-white/[0.08] p-7 transition-colors duration-300 hover:border-gold/50"
            >
              <p className="eyebrow mb-3 text-gold">{b.eyebrow}</p>
              <h3 className="text-xl text-paper">{b.title}</h3>
              <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{b.body}</p>
              <span className="mt-5 inline-block text-[0.75rem] tracking-[0.1em] text-gold uppercase underline-offset-4 group-hover:underline">
                {b.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Editorial — intro + how to choose + care */}
      <Section
        className="py-20"
        eyebrowLeft="The guide"
        eyebrowCenter={collection.label}
        eyebrowRight="How to choose"
      >
        <div className="grid gap-14 lg:grid-cols-[1fr_1.2fr]">
          <SectionHeading title="Buying this well." body={collection.intro} />
          <div>
            <p className="eyebrow mb-4 text-gold">Choose your construction</p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.12]">
                    <th className="py-3 pr-4 text-[0.6875rem] tracking-[0.12em] text-neutral-400 uppercase">
                      Cap
                    </th>
                    <th className="py-3 pr-4 text-[0.6875rem] tracking-[0.12em] text-neutral-400 uppercase">
                      Best for
                    </th>
                    <th className="py-3 pr-4 text-[0.6875rem] tracking-[0.12em] text-neutral-400 uppercase">
                      Parting
                    </th>
                    <th className="py-3 text-[0.6875rem] tracking-[0.12em] text-neutral-400 uppercase">
                      Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.07]">
                  {CONSTRUCTION_ROWS.map((r) => (
                    <tr key={r.name}>
                      <td className="py-3 pr-4 text-[0.875rem] text-paper">{r.name}</td>
                      <td className="py-3 pr-4 text-[0.875rem] text-neutral-400">{r.best}</td>
                      <td className="py-3 pr-4 text-[0.875rem] text-neutral-400">{r.part}</td>
                      <td className="py-3 text-[0.875rem] text-gold">{r.ease}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <p className="eyebrow mb-6 text-gold">Make it last</p>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {CARE_STEPS.map((s, i) => (
              <div key={s.t} className="border-t border-gold/20 pt-5">
                <span className="font-[family-name:var(--font-display)] text-2xl text-gold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[1.0625rem] text-paper">{s.t}</h3>
                <p className="mt-2 text-[0.875rem] leading-relaxed text-neutral-400">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <section className="border-t border-white/[0.07] py-20">
        <div className="mx-auto max-w-[900px] px-[4vw]">
          <div className="mb-10 text-center">
            <p className="eyebrow mb-3 text-gold">Questions</p>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] text-paper">
              {collection.label}, answered.
            </h2>
          </div>
          <FaqAccordion items={collection.faqs} />
          <p className="mt-10 text-center text-[0.875rem] text-neutral-400">
            Still deciding?{" "}
            <Link href="/support#contact" className="text-gold underline-offset-4 hover:underline">
              Ask our team
            </Link>{" "}
            or{" "}
            <Link href="/learn/quiz" className="text-gold underline-offset-4 hover:underline">
              take the two-minute match quiz
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
