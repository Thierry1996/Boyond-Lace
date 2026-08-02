import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { commerce, type Product, type ProductQuery } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { Section, SectionHeading } from "@/components/ui/Section";
import { FaqAccordion } from "@/components/collections/FaqAccordion";
import {
  collections,
  getCollectionBySlug,
  type Collection,
  type RefineKey,
} from "@/lib/collections";

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

/* ── Refine filter config (shared vocabulary with /shop) ─────────────────── */
const FILTERS: Record<
  RefineKey,
  {
    label: string;
    param: string;
    field: keyof ProductQuery;
    options: { value: string; label: string }[];
  }
> = {
  texture: {
    label: "Texture",
    param: "texture",
    field: "texture",
    options: [
      { value: "straight", label: "Straight" },
      { value: "body-wave", label: "Body Wave" },
      { value: "deep-wave", label: "Deep Wave" },
      { value: "kinky-straight", label: "Kinky Straight" },
      { value: "kinky-curly", label: "Kinky Curly (4C)" },
      { value: "jerry-curl", label: "Jerry Curl" },
    ],
  },
  lace: {
    label: "Construction",
    param: "lace",
    field: "laceType",
    options: [
      { value: "hd-swiss-full", label: "Full Lace" },
      { value: "hd-swiss-13x6", label: "13x6 Frontal" },
      { value: "hd-swiss-13x4", label: "13x4 Frontal" },
      { value: "hd-swiss-5x5", label: "5x5 Closure" },
      { value: "closure-4x4", label: "4x4 Closure" },
      { value: "silk-top", label: "Silk Top" },
    ],
  },
  shade: {
    label: "Shade",
    param: "shade",
    field: "shade",
    options: [
      { value: "natural-black", label: "Natural Black" },
      { value: "espresso", label: "Espresso" },
      { value: "brunette", label: "Brunette" },
      { value: "auburn-copper", label: "Auburn Copper" },
      { value: "burgundy-99j", label: "Burgundy 99J" },
      { value: "honey-balayage", label: "Honey Balayage" },
      { value: "blonde-613", label: "613 Blonde" },
      { value: "platinum", label: "Platinum" },
    ],
  },
  fit: {
    label: "Fit",
    param: "fit",
    field: "capConstruction",
    options: [
      { value: "glueless-wear-go", label: "Wear & go" },
      { value: "bye-bye-knots", label: "Bye-bye-knots" },
      { value: "reinforced-trans-fit", label: "Reinforced cap" },
      { value: "closure", label: "Closure" },
    ],
  },
};

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "rating", label: "Best rated" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "newest", label: "Newest" },
] as const;

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

/** Toggle a single refine value on the collection's own URL, preserving the rest. */
function toggleHref(slug: string, params: SearchParams, key: string, value: string): string {
  const next = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    const s = one(v);
    if (s && k !== key) next.set(k, s);
  }
  if (one(params[key]) !== value) next.set(key, value);
  const qs = next.toString();
  return qs ? `/collections/${slug}?${qs}` : `/collections/${slug}`;
}

/** Base collection query merged with any active refine params + sort. */
function buildQuery(collection: Collection, params: SearchParams): ProductQuery {
  const q: ProductQuery = { ...(collection.query ?? {}) };
  for (const key of collection.refine ?? []) {
    const f = FILTERS[key];
    const val = one(params[f.param]);
    if (!val) continue;
    // Refine groups never overlap the base filter, so a plain assign is safe.
    (q as Record<string, unknown>)[f.field as string] = [val];
  }
  q.sort = (one(params.sort) as ProductQuery["sort"]) ?? "featured";
  return q;
}

async function resolveProducts(collection: Collection, params: SearchParams): Promise<Product[]> {
  const q = buildQuery(collection, params);
  if (collection.select === "new") {
    const all = await commerce.getProducts({ ...q, sort: q.sort ?? "newest" });
    return all.filter((p) => p.badges.includes("New") && p.price > 0);
  }
  if (collection.select === "bestsellers") {
    const all = await commerce.getProducts({ ...q, sort: "rating" });
    return all.filter((p) => p.price > 0).slice(0, 18);
  }
  return commerce.getProducts(q);
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
  const products = await resolveProducts(collection, sp);
  const refineKeys = collection.refine ?? ["texture", "shade"];
  const activeCount = refineKeys.filter((k) => one(sp[FILTERS[k].param])).length;

  // Hot Picks — the six best-rated in the collection, ignoring active refines.
  const hotPicks = (
    collection.query
      ? await commerce.getProducts({ ...collection.query, sort: "rating" })
      : await resolveProducts(collection, {})
  )
    .filter((p) => p.price > 0)
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
        <div className="grid gap-14 lg:grid-cols-[240px_1fr]">
          <aside aria-label="Refine">
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

            {refineKeys.map((key) => {
              const group = FILTERS[key];
              return (
                <div key={key} className="border-b border-white/[0.07] py-6">
                  <p className="eyebrow mb-4">{group.label}</p>
                  <ul className="space-y-2.5">
                    {group.options.map((opt) => {
                      const active = one(sp[group.param]) === opt.value;
                      return (
                        <li key={opt.value}>
                          <Link
                            href={toggleHref(collection.slug, sp, group.param, opt.value)}
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
          </aside>

          <div>
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
              <p className="text-[0.8125rem] text-neutral-400 tabular-nums">
                {products.length} {products.length === 1 ? "unit" : "units"}
              </p>
              <div className="flex flex-wrap items-center gap-5">
                {SORTS.map((s) => {
                  const active = (one(sp.sort) ?? "featured") === s.value;
                  return (
                    <Link
                      key={s.value}
                      href={toggleHref(collection.slug, sp, "sort", s.value)}
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
              <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
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
