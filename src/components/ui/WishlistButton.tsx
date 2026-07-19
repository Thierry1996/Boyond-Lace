"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/stores/wishlist";

/** Card-overlay wishlist toggle. Sits inside a Link, so it must swallow the click. */
export function WishlistButton({ slug }: { slug: string }) {
  const { slugs, toggle, hydrated } = useWishlist();
  const saved = hydrated && slugs.includes(slug);

  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={`absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border bg-ink/60 backdrop-blur-sm transition-colors duration-300 ${
        saved
          ? "border-gold text-gold"
          : "border-white/20 text-neutral-200 hover:border-gold hover:text-gold"
      }`}
    >
      <Heart size={15} strokeWidth={1.5} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
