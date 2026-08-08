"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Gift } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { useCart } from "@/lib/stores/cart";

/**
 * Bundle / combo free-gift trigger. After a shopper has been browsing a while,
 * a spend-and-get-a-free-gift offer appears once per session, pulling five real
 * accessories from the store. "Add Free Gift" drops the item into the cart at
 * zero and opens the drawer — the reward nudge that lifts basket size.
 */

const SESSION_KEY = "bl.freegift.v1";
const DELAY_MS = 25_000;

export interface GiftItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number;
}

export function FreeGiftPopup({ gifts }: { gifts: GiftItem[] }) {
  const { add, setOpen: setCartOpen } = useCart();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (gifts.length === 0) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setMounted(true);
      requestAnimationFrame(() => setOpen(true));
    }, DELAY_MS);
    return () => clearTimeout(t);
  }, [gifts.length]);

  function close() {
    setOpen(false);
    setTimeout(() => setMounted(false), 300);
  }

  function addGift(g: GiftItem) {
    add({
      productId: g.id,
      slug: g.slug,
      title: `${g.title} (Free gift)`,
      selections: { Gift: "Spend & save reward" },
      unitPrice: 0,
      quantity: 1,
      image: g.image,
    });
    close();
    setCartOpen(true);
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close"
        onClick={close}
        className={`absolute inset-0 bg-ink/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="Spend and get a free gift"
        className={`relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_30px_90px_-24px_rgba(0,0,0,0.7)] transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 grid size-9 place-items-center rounded-full text-plum-900/60 transition-colors hover:bg-plum-900/10 hover:text-plum-900"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="p-6 text-center sm:p-8">
          <h2 className="flex flex-wrap items-center justify-center gap-2 font-[family-name:var(--font-display)] text-[clamp(1.4rem,3.5vw,2rem)] text-plum-900">
            Spend $150+ or $400+ &amp; Get a Free Gift
            <Sparkles size={20} className="text-gold" />
          </h2>
          <span className="mt-3 inline-block rounded-full bg-gold/20 px-3 py-1 text-[0.6875rem] font-semibold text-plum-800">
            You can add 1 gift product
          </span>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {gifts.slice(0, 5).map((g) => (
              <div
                key={g.id}
                className="flex flex-col overflow-hidden rounded-xl border border-plum-900/10"
              >
                <div className="relative">
                  <ProductImage src={g.image} alt={g.title} ratio="1 / 1" />
                </div>
                <div className="flex flex-1 flex-col p-2.5 text-left">
                  <p className="line-clamp-2 min-h-[2.25rem] text-[0.6875rem] leading-tight font-medium text-plum-900">
                    {g.title}
                  </p>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[0.75rem] font-bold text-rose-600">$0.00</span>
                    <Money
                      usd={g.compareAtPrice ?? g.price}
                      className="text-[0.625rem] text-plum-900/40 line-through tabular-nums"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => addGift(g)}
                    className="mt-2.5 flex items-center justify-center gap-1 rounded-md bg-plum-800 py-2 text-[0.5625rem] font-bold tracking-[0.08em] text-blush-200 uppercase transition-colors hover:bg-plum-700"
                  >
                    <Gift size={11} /> Add Free Gift
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={close}
            className="mt-6 text-[0.6875rem] tracking-[0.08em] text-plum-900/45 uppercase hover:text-plum-700"
          >
            No thanks, keep shopping
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
