"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Star, ArrowRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { QuickAddButton } from "./QuickAddButton";
import { Money } from "@/components/ui/Money";
import type { ReachItem } from "./ReachCarousel";

/**
 * Tabbed collection catalogue. One parent surface; each tab renders a different
 * child set of products (2 rows × 5) already fetched from the commerce database,
 * switching dynamically on click. Every card links to the PDP, the heart writes
 * to the wishlist and the bag to the cart; "View More" routes to that tab's
 * collection/category.
 */

export interface CatalogTab {
  id: string;
  label: string;
  href: string;
  items: ReachItem[];
}

function Card({ item }: { item: ReachItem }) {
  const onSale = !!item.compareAtPrice && item.compareAtPrice > item.price;
  const discount = onSale
    ? Math.round((1 - item.price / (item.compareAtPrice as number)) * 100)
    : 0;
  const href = `/product/${item.slug}`;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-plum-900/10 bg-white shadow-[0_14px_36px_-24px_rgba(90,45,103,0.4)] transition-shadow duration-300 hover:shadow-[0_22px_48px_-24px_rgba(90,45,103,0.55)]">
      <div className="relative">
        <Link href={href} aria-label={item.title} className="block">
          <ProductImage
            src={item.image}
            alt={item.title}
            ratio="1 / 1"
            className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          />
        </Link>
        <WishlistButton slug={item.slug} />
        {discount > 0 && (
          <span className="absolute top-0 left-0 z-10 flex items-center gap-1 rounded-br-xl bg-plum-700 px-2.5 py-1 text-[0.625rem] font-bold text-white">
            <Zap size={10} strokeWidth={2.5} className="fill-white" />-{discount}%
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        {item.tag && (
          <span className="mb-1.5 w-fit rounded bg-blush-300/70 px-1.5 py-0.5 text-[0.5625rem] font-semibold tracking-[0.04em] text-plum-800 uppercase">
            {item.tag}
          </span>
        )}
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.25rem] text-[0.8125rem] leading-snug font-medium text-plum-900 transition-colors duration-300 group-hover:text-plum-600">
            {item.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-baseline gap-1.5">
          <Money
            usd={item.price}
            className="text-[0.9375rem] font-semibold text-plum-700 tabular-nums"
          />
          {onSale && (
            <Money
              usd={item.compareAtPrice as number}
              className="text-[0.75rem] text-plum-900/40 line-through tabular-nums"
            />
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          <span className="flex items-center gap-1 text-[0.6875rem] text-plum-900/55">
            <Star size={11} strokeWidth={0} className="fill-gold" />
            <span className="tabular-nums">{item.rating.toFixed(1)}</span>
            <span className="text-plum-900/35">·</span>
            <span className="tabular-nums">{item.reviewCount.toLocaleString()} reviews</span>
          </span>
          <QuickAddButton
            productId={item.id}
            slug={item.slug}
            title={item.title}
            price={item.price}
            image={item.image}
          />
        </div>
      </div>
    </div>
  );
}

export function CollectionTabs({ tabs }: { tabs: CatalogTab[] }) {
  const [active, setActive] = useState(0);
  const current = tabs[active];
  if (!current) return null;

  return (
    <section className="bg-[#faf6f9] py-16">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        {/* Tab bar */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(i)}
              aria-selected={i === active}
              className={`relative pb-1.5 font-[family-name:var(--font-display)] text-[clamp(1.125rem,2.2vw,1.5rem)] transition-colors duration-300 ${
                i === active ? "text-plum-900" : "text-plum-900/40 hover:text-plum-700"
              }`}
            >
              {t.label}
              {i === active && (
                <motion.span
                  layoutId="catalog-tab-underline"
                  className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-plum-700"
                />
              )}
            </button>
          ))}
        </div>

        {/* Grid — 2 rows × 5 */}
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
        >
          {current.items.slice(0, 10).map((item) => (
            <Card key={`${current.id}-${item.slug}`} item={item} />
          ))}
        </motion.div>

        {/* View More — loads that category only */}
        <div className="mt-12 text-center">
          <Link
            href={current.href}
            className="inline-flex items-center gap-2 rounded-full bg-plum-900 px-10 py-3.5 text-[0.75rem] font-semibold tracking-[0.14em] text-blush-200 uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-plum-800"
          >
            View More
            <ArrowRight size={14} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}
