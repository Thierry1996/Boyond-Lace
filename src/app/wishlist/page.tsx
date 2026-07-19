"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useWishlist } from "@/lib/stores/wishlist";
import { ProductCard } from "@/components/ui/ProductCard";
import type { Product } from "@/lib/commerce";

export default function WishlistPage() {
  const { slugs, hydrated } = useWishlist();

  const { data: products } = useQuery({
    queryKey: ["wishlist-products"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      return json.products;
    },
    enabled: hydrated && slugs.length > 0,
  });

  const saved = (products ?? []).filter((p) => slugs.includes(p.slug));

  if (!hydrated) return <div className="min-h-[60vh]" aria-busy="true" />;

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw] py-20">
      <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
        <span className="eyebrow">Wishlist</span>
        <span className="eyebrow tabular-nums">{slugs.length} saved</span>
      </div>

      <h1 className="mt-12 text-[clamp(2.5rem,5vw,4rem)] text-paper">Saved for later.</h1>

      {slugs.length === 0 ? (
        <div className="mt-14 max-w-lg">
          <p className="text-[1.0625rem] leading-relaxed text-neutral-400">
            Nothing saved yet. The heart on any unit keeps it here — useful when you are deciding
            between two, or waiting on your Lace Test kit before committing.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-block border border-gold px-8 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
          >
            View the collection
          </Link>
        </div>
      ) : (
        <div className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
