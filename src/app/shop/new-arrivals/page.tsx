import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "New Arrivals — Fresh From the Reserve Floor",
  description:
    "The newest Beyond Lace human hair units — including capsule editions cut from the 20% trend-reserve manufacturing capacity.",
};

export default async function NewArrivalsPage() {
  const all = await commerce.getProducts({ sort: "newest" });
  const products = all.filter((p) => p.price > 0);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">
          <Link href="/shop" className="hover:text-paper">
            Shop
          </Link>{" "}
          / New Arrivals
        </span>
        <span className="eyebrow tabular-nums">{products.length} units</span>
      </div>
      <div className="mt-16 mb-14">
        <SectionHeading
          eyebrow="Fresh from the reserve floor"
          title="New arrivals."
          body="A fifth of our manufacturing capacity is held for what's moving right now. When something lands here marked Limited, it means two hundred numbered units — and no second run."
        />
      </div>
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
