import Link from "next/link";
import type { Metadata } from "next";
import { ProductImage } from "@/components/ui/ProductImage";
import { collections } from "@/lib/collections";

export const metadata: Metadata = {
  title: "Collections — Shop by Style, Texture & Construction",
  description:
    "Browse every Beyond Lace collection: glueless wigs, HD lace, 13x4 and 13x6 frontals, body wave, deep wave, straight, coloured units, and closures & bundles.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsIndexPage() {
  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Collections</span>
            <span className="eyebrow tabular-nums">{collections.length} collections</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              Every way in
              <span className="block italic">to the collection.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Shop by the thing you actually decide on — construction, texture, or colour. Every
              collection is the same batch-matched virgin Remy human hair underneath.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-[4vw] py-16">
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collections.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group block">
              <div className="relative overflow-hidden rounded-xl bg-plum-900 ring-1 ring-white/[0.06] transition-all duration-500 group-hover:ring-gold/50">
                <ProductImage
                  src={c.cardImage}
                  alt={c.label}
                  ratio="4 / 5"
                  className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-[0.625rem] tracking-[0.14em] text-gold uppercase">
                    {c.eyebrow}
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-xl text-paper">
                    {c.label}
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-[0.875rem] leading-snug text-neutral-400">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
