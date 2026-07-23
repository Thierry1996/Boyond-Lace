"use client";

import { useState } from "react";
import Link from "next/link";
import { Money } from "@/components/ui/Money";
import { WHOLESALE_MOQ, WHOLESALE_STEP } from "@/lib/stores/channel";
import type { WholesalePricing, WholesaleTier } from "@/lib/commerce";

/**
 * Wholesale quote calculator.
 *
 * This is the wholesale channel's answer to the retail Add-to-Bag: a quantity,
 * a live per-unit price at that quantity, and a request — never the retail cart.
 * The trade minimum is a hard 50 units, so a partner is always on the deepest
 * standing tier from their first order; smaller quantities are simply not a
 * wholesale transaction.
 */
export function WholesaleQuote({ slug, pricing }: { slug: string; pricing: WholesalePricing }) {
  const [qty, setQty] = useState(WHOLESALE_MOQ);

  // Highest tier whose minimum the quantity meets. At MOQ 50 that is the top
  // break, which is the point: wholesale never sees an entry-level unit price.
  const tier: WholesaleTier = [...pricing.tiers]
    .sort((a, b) => a.minQty - b.minQty)
    .reduce((match, t) => (qty >= t.minQty ? t : match), pricing.tiers[0]);

  const subtotal = tier.unitPrice * qty;
  const clamp = (n: number) =>
    Math.max(WHOLESALE_MOQ, Math.round(n / WHOLESALE_STEP) * WHOLESALE_STEP);

  return (
    <div className="border border-gold/25 p-6">
      <div className="flex items-baseline justify-between">
        <p className="eyebrow text-gold">Trade price</p>
        <p className="text-[0.75rem] text-neutral-400">MOQ {WHOLESALE_MOQ} units</p>
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <Money
          usd={tier.unitPrice}
          className="font-[family-name:var(--font-display)] text-4xl text-paper tabular-nums"
        />
        <span className="text-[0.875rem] text-neutral-400">/ unit</span>
      </div>

      {/* Quantity */}
      <div className="mt-6">
        <label className="eyebrow mb-2 block">Order quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border border-white/15">
            <button
              onClick={() => setQty((q) => clamp(q - WHOLESALE_STEP))}
              aria-label="Decrease quantity"
              className="px-3.5 py-2.5 text-neutral-200 transition-colors hover:text-gold"
            >
              −
            </button>
            <input
              type="number"
              value={qty}
              min={WHOLESALE_MOQ}
              step={WHOLESALE_STEP}
              onChange={(e) => setQty(clamp(Number(e.target.value) || WHOLESALE_MOQ))}
              aria-label="Order quantity in units"
              className="w-16 bg-transparent py-2.5 text-center text-[0.9375rem] text-paper tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={() => setQty((q) => clamp(q + WHOLESALE_STEP))}
              aria-label="Increase quantity"
              className="px-3.5 py-2.5 text-neutral-200 transition-colors hover:text-gold"
            >
              +
            </button>
          </div>
          <span className="text-[0.8125rem] text-neutral-400">
            units{qty === WHOLESALE_MOQ ? " (minimum)" : ""}
          </span>
        </div>
      </div>

      {/* Order total */}
      <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-5">
        <span className="text-[0.9375rem] text-neutral-400">Order subtotal</span>
        <Money usd={subtotal} className="text-xl text-paper tabular-nums" />
      </div>
      <p className="mt-2 text-[0.75rem] leading-relaxed text-neutral-400">
        MAP: you agree not to advertise below <Money usd={pricing.mapPrice} /> per unit. Larger
        volumes are negotiated with the partner team.
      </p>

      <Link
        href={`/wholesale#apply?sku=${encodeURIComponent(slug)}&qty=${qty}`}
        className="cta-primary mt-6 block w-full px-8 py-4 text-center text-[0.8125rem] tracking-[0.14em] uppercase"
      >
        Request this quote
      </Link>
      <Link
        href="/wholesale#samples"
        className="mt-3 block w-full border border-white/15 px-8 py-3.5 text-center text-[0.75rem] tracking-[0.14em] text-neutral-200 uppercase transition-colors hover:border-gold hover:text-gold"
      >
        Request samples first
      </Link>
    </div>
  );
}
