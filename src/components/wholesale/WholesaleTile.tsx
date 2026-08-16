"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortal } from "react-dom";
import { Play, X, Eye, Zap, Check } from "lucide-react";
import { type Product } from "@/lib/commerce";
import { useCart } from "@/lib/stores/cart";
import { Money } from "@/components/ui/Money";
import { ProductImage } from "@/components/ui/ProductImage";
import { WHOLESALE_MOQ } from "@/lib/channel";

/**
 * Compact wholesale product tile — the small card from the reference grids.
 * Trade per-unit pricing, MOQ, and (crucially) a Quick View + Buy Now so a
 * partner can purchase in-place without a detour to the full catalogue. Buy Now
 * drops the MOQ into the bag and jumps straight to checkout.
 */
export function WholesaleTile({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [qty, setQty] = useState(0);

  const tiers = [...(product.wholesale?.tiers ?? [])].sort((a, b) => a.minQty - b.minQty);
  const moq = product.wholesale?.moq ?? WHOLESALE_MOQ;
  const entry = tiers[0]?.unitPrice ?? product.price;
  const best = tiers[tiers.length - 1]?.unitPrice ?? entry;
  const image = product.images[0]?.src;

  useEffect(() => setMounted(true), []);
  useEffect(() => setQty(moq), [moq]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Live per-unit price for the chosen quantity (deepest tier the qty clears).
  const unitFor = (n: number) => tiers.reduce((m, t) => (n >= t.minQty ? t.unitPrice : m), entry);

  const buyNow = (n = moq) => {
    add({
      productId: product.id,
      slug: product.slug,
      title: product.title,
      selections: { Trade: `${n} units @ ${(unitFor(n) / 100).toFixed(2)}` },
      unitPrice: unitFor(n),
      quantity: n,
      image: image ?? "",
    });
    router.push("/checkout");
  };

  return (
    <>
      <div className="group flex flex-col">
        {/* Image + play + quick-view overlay */}
        <div className="relative aspect-square overflow-hidden rounded-md bg-plum-900">
          <ProductImage src={image ?? "plum"} alt={product.title} ratio="1 / 1" />
          {product.video && (
            <span className="pointer-events-none absolute inset-0 grid place-items-center">
              <span className="grid size-9 place-items-center rounded-full bg-ink/55 text-paper backdrop-blur-sm">
                <Play size={14} strokeWidth={1.75} fill="currentColor" className="ml-0.5" />
              </span>
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="absolute inset-0 flex items-end justify-center bg-ink/0 pb-3 opacity-0 transition-all duration-300 group-hover:bg-ink/25 group-hover:opacity-100"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper/95 px-3 py-1.5 text-[0.6875rem] tracking-[0.1em] text-ink uppercase">
              <Eye size={12} strokeWidth={2} /> Quick view
            </span>
          </button>
        </div>

        <span className="mt-2.5 inline-flex items-center gap-1 self-start text-[0.625rem] tracking-[0.08em] text-gold uppercase">
          <Check size={11} strokeWidth={2.5} /> Trade verified
        </span>
        <Link
          href={`/wholesale/product/${product.slug}`}
          className="mt-1 line-clamp-2 text-[0.8125rem] leading-snug text-neutral-200 transition-colors hover:text-gold"
        >
          {product.title}
        </Link>
        <p className="mt-1.5 text-[0.875rem] text-paper tabular-nums">
          <Money usd={entry} />
          {best < entry && (
            <>
              <span className="text-neutral-400"> – </span>
              <Money usd={best} />
            </>
          )}
          <span className="text-[0.6875rem] text-neutral-400"> / unit</span>
        </p>
        <p className="text-[0.6875rem] text-neutral-400">MOQ {moq} units</p>

        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex-1 border border-white/15 py-1.5 text-[0.6875rem] tracking-[0.08em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => buyNow()}
            className="flex flex-1 items-center justify-center gap-1 bg-gold py-1.5 text-[0.6875rem] tracking-[0.08em] text-ink uppercase transition-colors hover:bg-paper"
          >
            <Zap size={11} strokeWidth={2.5} /> Buy
          </button>
        </div>
      </div>

      {/* Quick View */}
      {mounted &&
        open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`${product.title} quick view`}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/85 p-[5vw] backdrop-blur-sm"
            style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="dark-island relative grid w-full max-w-3xl gap-6 overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900 p-6 sm:grid-cols-2 sm:p-8"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-4 right-4 z-[3] grid size-8 place-items-center rounded-full text-neutral-400 transition-colors hover:text-gold"
              >
                <X size={18} strokeWidth={1.75} />
              </button>

              <div className="overflow-hidden rounded-lg">
                {product.video ? (
                  <video src={product.video} poster={image} controls playsInline className="aspect-square w-full bg-ink object-cover" />
                ) : (
                  <ProductImage src={image ?? "plum"} alt={product.title} ratio="1 / 1" />
                )}
              </div>

              <div className="flex flex-col">
                <p className="eyebrow text-gold">Wholesale · Trade price</p>
                <h3 className="mt-2 text-[1.0625rem] leading-snug text-paper">{product.title}</h3>

                <div className="mt-4 flex items-baseline gap-2">
                  <Money usd={unitFor(qty)} className="font-[family-name:var(--font-display)] text-3xl text-paper tabular-nums" />
                  <span className="text-[0.8125rem] text-neutral-400">/ unit</span>
                </div>

                {/* Volume tiers */}
                <div className="mt-4 space-y-1.5">
                  {tiers.map((t) => (
                    <div key={t.minQty} className="flex justify-between text-[0.8125rem]">
                      <span className="text-neutral-400">{t.minQty}+ units</span>
                      <Money usd={t.unitPrice} className="text-neutral-200 tabular-nums" />
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="flex items-center border border-white/15">
                    <button type="button" onClick={() => setQty((q) => Math.max(moq, q - moq))} className="px-3 py-2 text-neutral-200 hover:text-gold" aria-label="Decrease">−</button>
                    <span className="w-12 text-center text-[0.875rem] text-paper tabular-nums">{qty}</span>
                    <button type="button" onClick={() => setQty((q) => q + moq)} className="px-3 py-2 text-neutral-200 hover:text-gold" aria-label="Increase">+</button>
                  </div>
                  <span className="text-[0.75rem] text-neutral-400">MOQ {moq}</span>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => buyNow(qty)}
                    className="flex items-center justify-center gap-2 bg-gold px-6 py-3.5 text-[0.8125rem] tracking-[0.12em] text-ink uppercase transition-colors hover:bg-paper"
                  >
                    <Zap size={15} strokeWidth={2.5} /> Buy now — <Money usd={unitFor(qty) * qty} />
                  </button>
                  <Link
                    href={`/wholesale/product/${product.slug}`}
                    className="border border-white/15 px-6 py-3 text-center text-[0.75rem] tracking-[0.12em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
                  >
                    Full details & customization
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
