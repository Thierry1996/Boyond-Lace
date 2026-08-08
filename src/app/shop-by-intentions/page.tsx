import Link from "next/link";
import type { Metadata } from "next";
import { ProductImage } from "@/components/ui/ProductImage";
import { getCollectionsWithCounts } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Shop by Intention — Find Your Collection | Beyond Lace",
  description:
    "Start with the look you want. Browse every Beyond Lace collection — glueless wear-and-go, HD lace, frontals, body wave, deep wave, straight, coloured units and closures & bundles — each a route into batch-matched virgin Remy human hair.",
  alternates: { canonical: "/shop-by-intentions" },
};

export default async function ShopByIntentionsPage() {
  const collections = await getCollectionsWithCounts();

  return (
    <>
      {/* Hero */}
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Shop by intention</span>
            <span className="eyebrow tabular-nums">{collections.length} collections</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              Start with the look,
              <span className="block italic">we&apos;ll match the unit.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Every circle is a different intention — a texture, a construction, a colour story. Tap
              one and it opens the full, filterable collection. All of it is the same batch-matched
              virgin Remy human hair underneath.
            </p>
          </div>
        </div>
      </section>

      {/* Collections — circular intention cards (each routes to its catalogue) */}
      <section className="mx-auto max-w-[1440px] px-[4vw] py-20">
        <h2 className="mb-14 text-center font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] text-paper">
          Collections
        </h2>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          {collections.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/collections/${c.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <div className="relative aspect-square w-full overflow-hidden rounded-full bg-plum-900 ring-1 ring-white/[0.08] transition-all duration-500 group-hover:ring-2 group-hover:ring-gold/60">
                  <ProductImage
                    src={c.cardImage}
                    alt={c.label}
                    ratio="1 / 1"
                    className="absolute inset-0 h-full w-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-ink/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                </div>
                <p className="mt-4 px-2 text-[0.9375rem] leading-snug font-medium text-paper transition-colors duration-300 group-hover:text-gold">
                  {c.label} <span className="text-neutral-500 tabular-nums">({c.count})</span>
                </p>
                <p className="mt-1 text-[0.6875rem] tracking-[0.14em] text-gold/70 uppercase">
                  {c.eyebrow}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Foot CTA — the two other ways in */}
      <section className="border-t border-white/[0.07] bg-plum-900 py-14">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-[4vw] text-center">
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] text-paper">
            Rather not choose from a wall?
          </h2>
          <p className="max-w-lg text-[0.9375rem] leading-relaxed text-neutral-400">
            Answer five questions and we&apos;ll rank three units for you, or browse the whole floor
            at once.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/learn/quiz"
              className="rounded-full bg-gold px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-ink uppercase transition-transform duration-300 hover:-translate-y-0.5"
            >
              Take the match quiz
            </Link>
            <Link
              href="/shop"
              className="rounded-full border border-gold/50 px-8 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-gold uppercase transition-colors duration-300 hover:bg-gold hover:text-ink"
            >
              Shop all units
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
