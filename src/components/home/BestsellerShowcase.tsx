"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { Money } from "@/components/ui/Money";
import { useCart } from "@/lib/stores/cart";
import { QuickView, type ShowcaseProduct } from "./RealLooks";

/**
 * "What people come back for" — rebuilt to the reference architecture (image 1):
 * a tall editorial feature panel on the left ("Wear & Go" + Shop all), with the
 * product cards laid out as a grid to its right — not a uniform full-width grid.
 * Each card keeps the reference product architecture: image with stacked brand +
 * discount badges, a centred name, the sale price against a struck-through
 * compare, star rating, and a full-width action button. Variant units show
 * "Choose options" (opens the Quick View picker — the same modal as the Real
 * Looks clone); simple units one-tap "Add to Cart". Wishlist, rating, price,
 * badge, name and dark-plum branding are all carried over.
 */

export interface BestsellerItem extends ShowcaseProduct {
  tagline: string;
  rating: number;
  reviewCount: number;
  badges: string[];
  inStock: boolean;
}

export interface FeaturePanelData {
  eyebrow: string;
  title: string;
  href: string;
  /** Gradient placeholder key (aurora/velvet/plum/blush/gold/mono/mono-2). */
  image: string;
  cta?: string;
}

/** Full-bleed editorial panel — the left column of the split (image 1). */
function FeaturePanel({ feature }: { feature: FeaturePanelData }) {
  return (
    <Link
      href={feature.href}
      className="group relative flex min-h-[24rem] flex-col justify-end overflow-hidden rounded-xl ring-1 ring-white/[0.06] transition-all duration-500 hover:ring-gold/40 lg:min-h-full"
    >
      <ProductImage
        src={feature.image}
        alt={feature.title}
        className="absolute inset-0 h-full w-full transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent"
      />
      <div className="relative p-7 sm:p-8">
        <p className="text-[0.6875rem] font-semibold tracking-[0.2em] text-gold uppercase">
          {feature.eyebrow}
        </p>
        <h3 className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.05] text-paper">
          {feature.title}
        </h3>
        <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[0.6875rem] font-semibold tracking-[0.14em] text-ink uppercase transition-transform duration-300 group-hover:-translate-y-0.5">
          {feature.cta ?? "Shop all"}
          <ArrowUpRight size={14} strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

function Card({ item, onQuickView }: { item: BestsellerItem; onQuickView: () => void }) {
  const { add, setOpen: setCartOpen } = useCart();

  const priced = item.price > 0;
  const onSale = !!item.compareAtPrice && item.compareAtPrice > item.price;
  const discountPct = onSale
    ? Math.round((1 - item.price / (item.compareAtPrice as number)) * 100)
    : 0;
  const hasChoices = item.options.some((o) => o.values.length > 1);
  const fromPrice = item.options.some((o) => o.values.some((v) => (v.priceDelta ?? 0) > 0));

  function quickAdd() {
    const labels: Record<string, string> = {};
    let delta = 0;
    for (const o of item.options) {
      const v = o.values[0];
      if (v) {
        labels[o.name] = v.label;
        delta += v.priceDelta ?? 0;
      }
    }
    add({
      productId: item.id,
      slug: item.slug,
      title: item.title,
      selections: labels,
      unitPrice: item.price + delta,
      quantity: 1,
      image: item.image,
    });
    setCartOpen(true);
  }

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl bg-plum-900 ring-1 ring-white/[0.06] transition-all duration-500 hover:ring-gold/40">
      {/* Image frame — badges, wishlist, hover quick view */}
      <div className="relative overflow-hidden">
        <Link href={`/product/${item.slug}`} className="block">
          <ProductImage
            src={item.image}
            alt={item.title}
            ratio="4 / 5"
            className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
          />
        </Link>

        {/* Badges, top-left — New/signature + discount, stacked (image 1) */}
        <div className="pointer-events-none absolute top-3 left-3 z-[2] flex flex-col gap-1.5">
          {item.badges[0] && (
            <span className="w-fit border border-gold/40 bg-ink/75 px-2.5 py-1 text-[0.5625rem] font-semibold tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
              {item.badges[0]}
            </span>
          )}
          {onSale && (
            <span className="w-fit bg-rose-600 px-2.5 py-1 text-[0.5625rem] font-bold tracking-[0.1em] text-white uppercase">
              {discountPct}% off
            </span>
          )}
        </div>

        <WishlistButton slug={item.slug} />

        {/* Quick view — appears on hover, opens the shared picker modal */}
        {priced && item.inStock && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] flex justify-center p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <button
              type="button"
              onClick={onQuickView}
              className="pointer-events-auto flex items-center gap-1.5 rounded-full bg-ink/85 px-4 py-2 text-[0.625rem] font-semibold tracking-[0.14em] text-paper uppercase backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
            >
              <Eye size={13} /> Quick view
            </button>
          </div>
        )}

        {!item.inStock && (
          <span className="absolute inset-x-0 bottom-0 z-[2] bg-ink/85 py-3 text-center text-[0.6875rem] tracking-[0.16em] text-neutral-200 uppercase backdrop-blur-sm">
            Waitlist open
          </span>
        )}
      </div>

      {/* Body — name, price, rating, action (image 1, brand palette) */}
      <div className="flex flex-1 flex-col p-4 text-center">
        <h3 className="text-[0.9375rem] leading-snug text-paper transition-colors duration-300 group-hover:text-gold">
          <Link href={`/product/${item.slug}`}>{item.title}</Link>
        </h3>

        <div className="mt-2 flex items-baseline justify-center gap-2">
          {priced ? (
            <>
              {fromPrice && <span className="text-[0.75rem] text-neutral-400 lowercase">from</span>}
              <Money
                usd={item.price}
                className={`text-[0.9375rem] tabular-nums ${onSale ? "font-semibold text-rose-300" : "text-paper"}`}
              />
              {onSale && (
                <Money
                  usd={item.compareAtPrice as number}
                  className="text-[0.8125rem] text-neutral-500 line-through tabular-nums"
                />
              )}
            </>
          ) : (
            <span className="text-[0.9375rem] text-gold">By application</span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-center gap-2 text-[0.75rem] text-neutral-400">
          <span className="text-gold" aria-hidden="true">
            {"★".repeat(Math.round(item.rating))}
          </span>
          <span className="tabular-nums">
            {item.rating.toFixed(1)} · {item.reviewCount.toLocaleString()} reviews
          </span>
        </div>

        {priced ? (
          <button
            type="button"
            onClick={hasChoices ? onQuickView : quickAdd}
            disabled={!item.inStock}
            className="mt-4 w-full rounded-md border border-gold/50 py-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase transition-colors duration-300 hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gold"
          >
            {!item.inStock ? "Join waitlist" : hasChoices ? "Choose options" : "Add to Cart"}
          </button>
        ) : (
          <Link
            href={`/product/${item.slug}`}
            className="mt-4 w-full rounded-md border border-gold/50 py-3 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase transition-colors duration-300 hover:bg-gold hover:text-ink"
          >
            View details
          </Link>
        )}
      </div>
    </div>
  );
}

export function BestsellerShowcase({
  items,
  feature,
}: {
  items: BestsellerItem[];
  feature: FeaturePanelData;
}) {
  const [qv, setQv] = useState<BestsellerItem | null>(null);
  if (items.length === 0) return null;

  return (
    <>
      {/* Split: editorial feature left, product cards gridded right (image 1) */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,2fr)]">
        <FeaturePanel feature={feature} />
        <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} item={item} onQuickView={() => setQv(item)} />
          ))}
        </div>
      </div>
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </>
  );
}
