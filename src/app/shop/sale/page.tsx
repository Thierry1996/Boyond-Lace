import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Archive Sale — Last-of-Batch Pricing",
  description:
    "Beyond Lace archive pricing: last units of a completed batch, full construction standard, reduced because the run is ending — never because the quality did.",
};

export default async function SalePage() {
  const all = await commerce.getProducts();
  const products = all.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">
          <Link href="/shop" className="hover:text-paper">
            Shop
          </Link>{" "}
          / Archive
        </span>
        <span className="eyebrow tabular-nums">{products.length} units</span>
      </div>
      <div className="mt-16 mb-14">
        <SectionHeading
          eyebrow="Why a luxury brand discounts"
          title="The archive."
          body="No countdown timers, no fake urgency. When a batch run completes, its final units move to archive pricing — same construction, same warranty, reduced because the run is ending, never because the quality did."
        />
      </div>
      {products.length === 0 ? (
        <div className="border border-white/[0.07] px-8 py-20 text-center">
          <h2 className="text-2xl text-paper">The archive is empty right now.</h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9375rem] text-neutral-400">
            Batches sell through before they age. The Circle hears first when archive pricing opens.
          </p>
          <Link
            href="/circle"
            className="mt-8 inline-block border border-gold px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            Join the Circle
          </Link>
        </div>
      ) : (
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
