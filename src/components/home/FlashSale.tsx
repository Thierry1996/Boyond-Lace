"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { FLASH_SALE } from "@/lib/flash-sale";

/**
 * Flash-sale image accordion. Five rounded panels; the active one is expanded
 * for six seconds, then the strip advances by one — a fresh unit swipes in and
 * sizes up on the left while the rest shift and the far one slides out, looping
 * continuously through the catalogue. Hovering a panel expands it and pauses the
 * loop. Every panel routes to its real collection; the BUY button does too.
 */

const PANELS = 5;
const DWELL = 6000;
const CYCLE = 2 * 3600; // countdown loops on a rolling two-hour window

export function FlashSale() {
  const reduced = useReducedMotion();
  const [base, setBase] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [now, setNow] = useState<number | null>(null);

  // Countdown clock — client-only so SSR and first paint agree.
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  // Auto-advance, paused while a panel is hovered.
  useEffect(() => {
    if (hovered !== null) return;
    const t = setInterval(() => setBase((b) => (b + 1) % FLASH_SALE.length), DWELL);
    return () => clearInterval(t);
  }, [hovered]);

  const left = now === null ? null : CYCLE - (Math.floor(now / 1000) % CYCLE);
  const pad = (n: number) => String(n).padStart(2, "0");
  const clock =
    left === null
      ? ["--", "--", "--"]
      : [pad(Math.floor(left / 3600)), pad(Math.floor((left % 3600) / 60)), pad(left % 60)];

  const expandedIndex = hovered ?? 0;
  const visible = Array.from({ length: PANELS }, (_, i) => FLASH_SALE[(base + i) % FLASH_SALE.length]);

  return (
    <section className="bg-gradient-to-b from-[#fdeef6] to-[#fbe3ef] py-16">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        {/* Header */}
        <div className="text-center">
          <p className="flex items-center justify-center gap-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3rem)] text-pink-600">
            <Zap size={26} strokeWidth={2} className="fill-pink-500 text-pink-500" aria-hidden />
            Flash Sale
            <Zap size={26} strokeWidth={2} className="fill-pink-500 text-pink-500" aria-hidden />
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="text-[0.8125rem] font-semibold tracking-[0.06em] text-plum-900 italic sm:text-[0.9375rem]">
              Limited Time Offer
            </span>
            <span className="flex items-center gap-1.5 tabular-nums">
              {clock.map((seg, i) => (
                <span key={i} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-pink-600">:</span>}
                  <span className="min-w-[2.1rem] rounded-md bg-plum-900 px-2 py-1 text-center text-[0.9375rem] font-bold text-white">
                    {seg}
                  </span>
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Accordion */}
        <div className="mt-10 flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => setBase((b) => (b - 1 + FLASH_SALE.length) % FLASH_SALE.length)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-600/30 text-pink-600 transition-colors hover:bg-pink-600 hover:text-white sm:flex"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex h-[380px] flex-1 gap-2 overflow-hidden sm:h-[460px] sm:gap-3">
            <AnimatePresence initial={false} mode="popLayout">
            {visible.map((p, i) => {
              const expanded = i === expandedIndex;
              return (
                <motion.div
                  key={p.slug}
                  layout
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 70 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -70 }}
                  transition={{
                    layout: { duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] },
                    duration: reduced ? 0.2 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ flexGrow: expanded ? 5 : 1, flexBasis: 0 }}
                  className="group relative min-w-[2.5rem] overflow-hidden rounded-2xl shadow-[0_18px_40px_-24px_rgba(190,24,93,0.5)]"
                >
                  {/* Image (also the link target) */}
                  <Link href={p.href} aria-label={p.name} className="absolute inset-0 z-0 block">
                    <ProductImage
                      src={p.image}
                      alt={p.name}
                      className="!absolute inset-0 !h-full !w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 bg-gradient-to-t from-plum-900/85 via-plum-900/20 to-transparent"
                    />
                  </Link>

                  {/* Discount badge */}
                  <span className="pointer-events-none absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-pink-600 px-2.5 py-1 text-[0.625rem] font-bold text-white shadow">
                    <Zap size={11} strokeWidth={2.5} className="fill-white" />
                    -{p.discountPct}%
                  </span>
                  {p.presale && (
                    <span className="pointer-events-none absolute top-3 right-3 z-10 rounded-full bg-plum-900/85 px-2.5 py-1 text-[0.5625rem] font-semibold tracking-[0.1em] text-blush-200 uppercase">
                      Pre-Sale
                    </span>
                  )}

                  {/* Expanded detail */}
                  {expanded && (
                    <div
                      key={p.slug}
                      className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-5"
                      style={{ animation: "blFade 500ms var(--ease-editorial)" }}
                    >
                      <h3 className="line-clamp-2 text-[0.9375rem] font-semibold text-white sm:text-[1.0625rem]">
                        {p.name}
                      </h3>
                      <div className="mt-2 flex items-baseline gap-2">
                        <Money
                          usd={p.priceUsd}
                          className="text-lg font-bold text-white tabular-nums sm:text-xl"
                        />
                        <Money
                          usd={p.compareUsd}
                          className="text-[0.8125rem] text-white/50 line-through tabular-nums"
                        />
                      </div>
                      <Link
                        href={p.href}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-pink-600 px-5 py-2 text-[0.75rem] font-bold tracking-[0.1em] text-white uppercase transition-all duration-300 hover:-translate-y-0.5 hover:bg-pink-500"
                      >
                        <Zap size={13} strokeWidth={2.5} className="fill-white" />
                        Buy
                      </Link>
                    </div>
                  )}
                </motion.div>
              );
            })}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => setBase((b) => (b + 1) % FLASH_SALE.length)}
            className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-pink-600/30 text-pink-600 transition-colors hover:bg-pink-600 hover:text-white sm:flex"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/shop?sort=newest"
            className="inline-flex items-center gap-1.5 rounded-full border border-pink-600/40 px-6 py-2.5 text-[0.75rem] font-semibold tracking-[0.12em] text-pink-600 uppercase transition-colors hover:bg-pink-600 hover:text-white"
          >
            Shop all flash deals
          </Link>
        </div>
      </div>
    </section>
  );
}
