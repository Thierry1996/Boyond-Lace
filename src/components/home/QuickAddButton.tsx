"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/stores/cart";

/**
 * Grid quick-add. Adds one unit (no options) to the cart and opens the drawer —
 * the same store every other add-to-cart writes to, so the header count and the
 * persisted cart stay in sync. Lives outside the card's product link so the two
 * click targets never overlap.
 */
export function QuickAddButton({
  productId,
  slug,
  title,
  price,
  image,
}: {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      aria-label={`Add ${title} to bag`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        add({ productId, slug, title, selections: {}, unitPrice: price, quantity: 1, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
      }}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-plum-900 text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-700 active:scale-90"
    >
      {added ? <Check size={16} strokeWidth={2.25} /> : <ShoppingCart size={16} strokeWidth={1.75} />}
    </button>
  );
}
