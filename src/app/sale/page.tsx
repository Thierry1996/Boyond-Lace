import Link from "next/link";
import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";

export const metadata: Metadata = {
  title: "Flash Sale — Limited-Time Human Hair Wig Deals",
  description:
    "The Beyond Lace flash-sale drop: HD lace human hair wigs, glueless units, and bundles marked down for a limited time. Batch-matched virgin Remy, while stock lasts.",
};

/** Deepest markdown first, so the strongest deals lead the grid. */
function discount(p: { price: number; compareAtPrice?: number }): number {
  return p.compareAtPrice && p.compareAtPrice > p.price
    ? Math.round((1 - p.price / p.compareAtPrice) * 100)
    : 0;
}

export default async function SalePage() {
  const pool = await commerce.getProducts({ flashOnly: true, sort: "rating" });
  const deals = pool
    .filter((p) => p.price > 0)
    .sort((a, b) => discount(b) - discount(a) || b.rating - a.rating);

  const topPct = deals.length ? Math.max(...deals.map(discount)) : 0;

  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow flex items-center gap-2 text-pink-400">
              <Zap size={13} strokeWidth={2.5} className="fill-pink-400" aria-hidden />
              Flash sale
            </span>
            <span className="eyebrow hidden md:block">Limited time · While stock lasts</span>
            <span className="eyebrow tabular-nums">{deals.length} deals</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              The drop is live
              {topPct > 0 && (
                <span className="block italic">
                  up to <span className="text-pink-400">{topPct}% off</span>.
                </span>
              )}
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              A rotating cut of the collection, marked down while it lasts. Same hand-tied HD lace,
              same batch-matched virgin Remy — the only thing that changed is the price.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-[4vw] py-16">
        {deals.length === 0 ? (
          <div className="border border-white/[0.07] px-8 py-24 text-center">
            <h2 className="text-2xl text-paper">The next drop is loading.</h2>
            <p className="mx-auto mt-4 max-w-md text-[0.9375rem] leading-relaxed text-neutral-400">
              No flash deals are live this moment. Browse the full collection, or check back — the
              floor cuts a new batch every week.
            </p>
            <Link
              href="/shop"
              className="mt-8 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
            >
              Shop all units
            </Link>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
