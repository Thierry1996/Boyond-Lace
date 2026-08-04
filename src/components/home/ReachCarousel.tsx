"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { WishlistButton } from "@/components/ui/WishlistButton";
import { QuickAddButton } from "./QuickAddButton";
import { Money } from "@/components/ui/Money";

/**
 * Catalogue teaser carousel. Five equal cards to a view; every ~5s the strip
 * advances by one — a new unit slides in from the right, the far one slides out,
 * so each product gets a moment to land. Chevrons step it manually; hovering
 * pauses the loop. Two card styles: "rtw" (ready-to-wear, style-tag band) and
 * "color" (fashion-colour, BNPL + returns overlays). Cards link to the PDP; the
 * heart writes to the wishlist and the bag to the cart.
 */

export interface ReachItem {
  id: string;
  slug: string;
  title: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  rating: number;
  reviewCount: number;
  tag?: string;
  /** Autoplay product video source when available; falls back to the image. */
  video?: string;
}

const PANELS = 5;
const DWELL = 5000;

/** Video-ready thumbnail. Renders an autoplay loop when a source exists. */
function Thumb({ item, className = "" }: { item: ReachItem; className?: string }) {
  if (item.video) {
    return (
      <video
        src={item.video}
        autoPlay
        muted
        loop
        playsInline
        aria-label={item.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return (
    <ProductImage
      src={item.image}
      alt={item.title}
      ratio="3 / 4"
      className={`transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05] ${className}`}
    />
  );
}

function Rating({ item, compact }: { item: ReachItem; compact?: boolean }) {
  return (
    <span className="flex items-center gap-1.5 text-[0.6875rem] text-plum-900/55">
      <span className="flex text-gold" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={11} strokeWidth={0} className="fill-gold" />
        ))}
      </span>
      {compact ? (
        <span>
          {item.rating.toFixed(1)} ({item.reviewCount.toLocaleString()} Reviews)
        </span>
      ) : (
        <span className="underline underline-offset-2">
          {item.reviewCount.toLocaleString()} Reviews
        </span>
      )}
    </span>
  );
}

function Card({ item, variant }: { item: ReachItem; variant: "rtw" | "color" }) {
  const onSale = !!item.compareAtPrice && item.compareAtPrice > item.price;
  const href = `/product/${item.slug}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-plum-900/10 bg-white shadow-[0_14px_36px_-24px_rgba(90,45,103,0.4)] transition-shadow duration-300 hover:shadow-[0_22px_48px_-24px_rgba(90,45,103,0.55)]">
      <div className="relative">
        <Link href={href} aria-label={item.title} className="block">
          <Thumb item={item} />
          {variant === "color" && (
            <span className="absolute inset-0 flex items-center justify-center bg-plum-900/0 opacity-0 transition-all duration-300 group-hover:bg-plum-900/25 group-hover:opacity-100">
              <span className="rounded-full bg-white px-6 py-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-plum-900 uppercase">
                Quick Buy
              </span>
            </span>
          )}
        </Link>

        <WishlistButton slug={item.slug} />

        {onSale && (
          <span className="absolute top-0 left-0 z-10 rounded-br-xl bg-plum-700 px-2.5 py-1 text-[0.625rem] font-bold text-white">
            Sale
          </span>
        )}

        {variant === "rtw" && item.tag && (
          <div className="absolute inset-x-0 bottom-0 bg-blush-300/90 py-1.5 text-center backdrop-blur-sm">
            <span className="text-[0.75rem] font-semibold text-plum-800">{item.tag}</span>
          </div>
        )}

        {variant === "color" && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-2.5 text-[0.5625rem] leading-tight text-white">
            <span className="rounded-md bg-plum-900/75 px-2 py-1 backdrop-blur-sm">
              Buy now, pay later from{" "}
              <Money usd={Math.round(item.price / 4)} className="font-bold" />
            </span>
            <span className="rounded-md bg-plum-900/75 px-2 py-1 text-right font-semibold backdrop-blur-sm">
              Free 30-day returns
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <Link href={href}>
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[0.8125rem] leading-snug font-medium text-plum-900 transition-colors duration-300 group-hover:text-plum-600">
            {item.title}
          </h3>
        </Link>

        <div className="mt-1.5">
          <Rating item={item} compact={variant === "color"} />
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <div className="flex items-baseline gap-1.5">
            {variant === "color" && <span className="text-[0.6875rem] text-plum-900/50">From</span>}
            <Money
              usd={item.price}
              className="text-[0.9375rem] font-semibold text-plum-900 tabular-nums"
            />
            {onSale && variant === "rtw" && (
              <Money
                usd={item.compareAtPrice as number}
                className="text-[0.75rem] text-plum-900/40 line-through tabular-nums"
              />
            )}
          </div>
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

export function ReachCarousel({
  title,
  subtitle,
  items,
  variant,
  viewAllHref,
  dots = false,
}: {
  title: string;
  subtitle?: string;
  items: ReachItem[];
  variant: "rtw" | "color";
  viewAllHref: string;
  dots?: boolean;
}) {
  const reduced = useReducedMotion();
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = items.length;

  useEffect(() => {
    if (paused || len <= PANELS) return;
    const t = setInterval(() => setBase((b) => (b + 1) % len), DWELL);
    return () => clearInterval(t);
  }, [paused, len]);

  if (len === 0) return null;
  const count = Math.min(PANELS, len);
  const visible = Array.from({ length: count }, (_, i) => items[(base + i) % len]);
  const step = (d: number) => setBase((b) => (b + d + len) % len);

  return (
    <section className="bg-gradient-to-b from-[#f6f0f9] to-[#faf6f9] py-16">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="mb-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] text-plum-900">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-[0.8125rem] tracking-[0.08em] text-plum-700 uppercase">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className="flex items-center gap-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum-700/30 text-plum-700 transition-colors hover:bg-plum-700 hover:text-white sm:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex flex-1 gap-3 overflow-hidden sm:gap-4">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((item) => (
                <motion.div
                  key={item.slug}
                  layout
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 70 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -70 }}
                  transition={{
                    layout: { duration: reduced ? 0.2 : 0.55, ease: [0.16, 1, 0.3, 1] },
                    duration: reduced ? 0.2 : 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ flexGrow: 1, flexBasis: 0 }}
                  className="min-w-0"
                >
                  <Card item={item} variant={variant} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-plum-700/30 text-plum-700 transition-colors hover:bg-plum-700 hover:text-white sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {dots && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: Math.min(len, 6) }, (_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setBase(i % len)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  base % Math.min(len, 6) === i ? "w-5 bg-plum-700" : "w-1.5 bg-plum-900/25"
                }`}
              />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href={viewAllHref}
            className="inline-flex items-center gap-1.5 rounded-full border border-plum-700/40 px-6 py-2.5 text-[0.75rem] font-semibold tracking-[0.12em] text-plum-700 uppercase transition-colors hover:bg-plum-700 hover:text-white"
          >
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}
