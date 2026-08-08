"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * "Shop by Occasion" — an impulse-buy conversion rail cloned from a tested
 * competitor layout: tall editorial tiles, each an occasion (Daily, Wedding,
 * Party…), with a label chip at the foot. The two reference slides are stacked
 * into one interactive carousel — four tiles to a view, chevrons to browse, and
 * a slow auto-advance. Every tile routes to the real collection or filtered shop
 * view that fits that moment, so the emotional pick lands on live product.
 * Brand-skinned: plum/gold on a unique blush→plum gradient ground, our voice.
 */

export interface Occasion {
  slug: string;
  label: string;
  eyebrow: string;
  /** Gradient placeholder key (brand imagery is hair-only until the shoot). */
  image: string;
  /** Working destination — a collection or a pre-filtered /shop view. */
  href: string;
}

const OCCASIONS: Occasion[] = [
  {
    slug: "daily",
    label: "Daily",
    eyebrow: "Four-minute wear & go",
    image: "velvet",
    href: "/collections/glueless-wigs",
  },
  {
    slug: "wedding",
    label: "Wedding",
    eyebrow: "The aisle, undetectable",
    image: "blush",
    href: "/collections/hd-full-lace",
  },
  {
    slug: "party",
    label: "Party",
    eyebrow: "Sleek, all-night glam",
    image: "plum",
    href: "/collections/straight-wigs",
  },
  {
    slug: "vacation",
    label: "Vacation",
    eyebrow: "Beach-proof movement",
    image: "aurora",
    href: "/collections/body-wave-wigs",
  },
  {
    slug: "working",
    label: "Working",
    eyebrow: "The boardroom bob",
    image: "mono-2",
    href: "/collections/13x4-frontal-wigs",
  },
  {
    slug: "dating",
    label: "Dating",
    eyebrow: "Soft, romantic waves",
    image: "gold",
    href: "/collections/deep-wave-wigs",
  },
  {
    slug: "fitness",
    label: "Fitness",
    eyebrow: "Secure through every rep",
    image: "mono",
    href: "/shop?fit=glueless-wear-go",
  },
];

const VISIBLE = 4;
const DWELL = 6000;

function Tile({ o }: { o: Occasion }) {
  return (
    <Link href={o.href} className="group block">
      <div className="dark-island relative overflow-hidden rounded-2xl bg-plum-900 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.08] transition-all duration-500 group-hover:ring-gold/50">
        <ProductImage
          src={o.image}
          alt={`${o.label} — Beyond Lace units for the occasion`}
          ratio="3 / 4"
          className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1.5 p-5 text-center">
          <span className="text-[0.5625rem] font-medium tracking-[0.18em] text-blush-200/80 uppercase opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            {o.eyebrow}
          </span>
          <span className="rounded-md bg-ink/70 px-5 py-2 text-[0.8125rem] font-semibold tracking-[0.16em] text-paper uppercase backdrop-blur-sm transition-colors duration-300 group-hover:bg-gold group-hover:text-ink">
            {o.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ShopByOccasion() {
  const reduced = useReducedMotion();
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = OCCASIONS.length;

  useEffect(() => {
    if (paused || len <= VISIBLE) return;
    const t = setInterval(() => setBase((b) => (b + 1) % len), DWELL);
    return () => clearInterval(t);
  }, [paused, len]);

  const count = Math.min(VISIBLE, len);
  const visible = Array.from({ length: count }, (_, i) => OCCASIONS[(base + i) % len]);
  const step = (d: number) => setBase((b) => (b + d + len) % len);

  return (
    <section
      aria-label="Shop by occasion"
      className="dark-island relative overflow-hidden border-y border-white/[0.06] bg-gradient-to-br from-[#2a1122] via-plum-800 to-plum-900 py-16"
    >
      {/* Soft blush bloom for the unique ground */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[52rem] -translate-x-1/2 rounded-full bg-blush-400/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1600px] px-[3vw]">
        <div className="mb-10 text-center">
          <p className="eyebrow text-gold">Dress the moment</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3rem)] text-paper">
            Shop by Occasion
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[0.9375rem] text-blush-200/70">
            Pick the moment — we&rsquo;ll match the unit. Every look routes to the collection built
            for it.
          </p>
        </div>

        <div
          className="flex items-center gap-2 sm:gap-3"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <button
            type="button"
            aria-label="Previous"
            onClick={() => step(-1)}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex flex-1 items-stretch gap-3 overflow-hidden py-2 sm:gap-5">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((o) => (
                <motion.div
                  key={o.slug}
                  layout
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 70 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -70 }}
                  transition={{
                    layout: { duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] },
                    duration: reduced ? 0.2 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ flexGrow: 1, flexBasis: 0 }}
                  className="min-w-0"
                >
                  <Tile o={o} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Next"
            onClick={() => step(1)}
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-blush-200 transition-colors hover:border-gold hover:bg-gold hover:text-ink sm:flex"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
