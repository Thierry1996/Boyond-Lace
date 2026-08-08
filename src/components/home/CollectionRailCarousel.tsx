"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Shop-by-collection carousel. Six bold cards to a view; every six seconds the
 * strip advances by one — the incoming spotlight card zooms up (image scaled,
 * never distorted, thanks to object-cover), then resizes back and slides out for
 * the next. The loop runs through every collection and restarts. Chevrons let a
 * shopper browse freely. Far more of the range is seen than a static strip.
 */

export interface RailItem {
  slug: string;
  label: string;
  eyebrow: string;
  cardImage: string;
}

const VISIBLE = 6;
const DWELL = 6000;

function Card({ c, active }: { c: RailItem; active: boolean }) {
  return (
    <Link href={`/collections/${c.slug}`} className="group block">
      <div
        className={`relative overflow-hidden rounded-2xl bg-plum-900 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.8)] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          active ? "z-10 scale-[1.05] ring-2 ring-gold/70" : "scale-100 ring-1 ring-white/[0.06]"
        }`}
      >
        <ProductImage
          src={c.cardImage}
          alt={c.label}
          ratio="4 / 5"
          className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/75 to-transparent" />
        <span className="absolute bottom-3 left-3.5 text-[0.6875rem] tracking-[0.14em] text-paper/90 uppercase">
          {c.eyebrow}
        </span>
      </div>
      <p className="mt-3 text-center text-[0.875rem] font-medium text-neutral-200 transition-colors duration-300 group-hover:text-gold">
        {c.label}
      </p>
    </Link>
  );
}

export function CollectionRailCarousel({ items }: { items: RailItem[] }) {
  const reduced = useReducedMotion();
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = items.length;

  useEffect(() => {
    if (paused || len <= VISIBLE) return;
    const t = setInterval(() => setBase((b) => (b + 1) % len), DWELL);
    return () => clearInterval(t);
  }, [paused, len]);

  if (len === 0) return null;
  const count = Math.min(VISIBLE, len);
  const visible = Array.from({ length: count }, (_, i) => items[(base + i) % len]);
  const step = (d: number) => setBase((b) => (b + d + len) % len);

  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <button
        type="button"
        aria-label="Previous"
        onClick={() => step(-1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex flex-1 items-start gap-3 overflow-hidden py-4 sm:gap-5">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map((c, i) => (
            <motion.div
              key={c.slug}
              layout
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: -60 }}
              transition={{
                layout: { duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] },
                duration: reduced ? 0.2 : 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ flexGrow: 1, flexBasis: 0 }}
              className="min-w-0"
            >
              <Card c={c} active={i === 0} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button
        type="button"
        aria-label="Next"
        onClick={() => step(1)}
        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
