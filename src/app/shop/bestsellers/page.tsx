import type { Metadata } from "next";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { ProductCard } from "@/components/ui/ProductCard";
import { SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Bestsellers — The Units People Come Back For",
  description:
    "The most re-ordered Beyond Lace human hair units, ranked by the only vote that counts: repeat purchases.",
};

export default async function BestsellersPage() {
  const products = await commerce.getProducts({ line: "luxe", sort: "featured", limit: 12 });

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">
          <Link href="/shop" className="hover:text-paper">
            Shop
          </Link>{" "}
          / Bestsellers
        </span>
        <span className="eyebrow tabular-nums">{products.length} units</span>
      </div>
      <div className="mt-16 mb-14">
        <SectionHeading
          eyebrow="Proven, repeatedly"
          title="What people come back for."
          body="Ranked by reorders and reviews, not by what we want to move. The batch guarantee means a reorder matches the original exactly — which is why these keep compounding."
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
