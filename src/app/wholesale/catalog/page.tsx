import Link from "next/link";
import type { Metadata } from "next";
import { commerce } from "@/lib/commerce";
import { WholesaleProductCard } from "@/components/wholesale/WholesaleProductCard";
import { WHOLESALE_MOQ } from "@/lib/channel";

export const metadata: Metadata = {
  title: "Wholesale Catalogue — Trade Pricing, MOQ 50",
  description:
    "The Beyond Lace wholesale catalogue: per-unit trade pricing from 50 units, MAP-protected, batch-consistent virgin Remy human hair. Apply once, order the whole range.",
  robots: { index: true, follow: true },
};

/**
 * Wholesale product listing — the trade channel's answer to /shop. It shows
 * only SKUs stocked for resale, priced per unit, and routes into the wholesale
 * PDP. Retail's /shop is untouched; the two listings never overlap.
 */
export default async function WholesaleCatalogPage() {
  const products = await commerce.getProducts({ wholesaleOnly: true, sort: "launch-rank" });

  return (
    <>
      <section className="surface-velvet border-b border-white/[0.07] pt-20 pb-16">
        <div className="mx-auto max-w-[1440px] px-[4vw]">
          <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
            <span className="eyebrow">Wholesale · Trade catalogue</span>
            <span className="eyebrow tabular-nums">{products.length} units</span>
          </div>
          <div className="mt-16 max-w-3xl">
            <p className="eyebrow mb-5 text-gold">MOQ {WHOLESALE_MOQ} · MAP-protected</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-paper">
              Stock the brand
              <span className="block italic">your clients ask about.</span>
            </h1>
            <p className="mt-7 max-w-xl text-[1.0625rem] leading-relaxed text-neutral-400">
              Per-unit pricing from fifty units, defended by an enforced MAP so no partner undercuts
              another. Every SKU is cut from a single production run, so the batch you reorder in
              eighteen months matches the one on your shelf today.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <Link
                href="/wholesale#apply"
                className="cta-primary px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase"
              >
                Apply as a partner
              </Link>
              <Link
                href="/shop"
                className="border-b border-white/25 pb-1 text-[0.8125rem] tracking-[0.1em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
              >
                Shopping for yourself? View retail →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1440px] px-[4vw] py-16">
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <WholesaleProductCard key={p.id} product={p} />
          ))}
        </div>

        {/* Reseller starter — the low-friction first order, called out. */}
        <div className="mt-20 border border-gold/25 p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <p className="eyebrow mb-3 text-gold">New partner? Start smaller</p>
              <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-paper">
                Fifty is the standing minimum. Five is how you test us.
              </h2>
              <p className="mt-5 max-w-xl text-[0.9375rem] leading-relaxed text-neutral-400">
                The First Order pack is five assorted units at Gold-adjacent pricing — the way a
                small wig business finds out whether Beyond Lace is the supplier before committing
                to a full tier.
              </p>
            </div>
            <Link
              href="/wholesale/product/the-first-order-reseller-pack"
              className="cta-secondary justify-self-start px-8 py-4 text-[0.8125rem] tracking-[0.14em] uppercase md:justify-self-end"
            >
              See the starter pack
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
