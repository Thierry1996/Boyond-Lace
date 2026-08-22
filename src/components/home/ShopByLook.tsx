"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import { useResponsiveCount } from "@/lib/useResponsiveCount";

/**
 * "Shop by Look" — an editorial discovery rail cloned from a competitor layout,
 * sitting under the social-proof masonry. The two reference slides are stacked
 * into one carousel: three tall look-tiles to a view, a serif look name plated
 * across the foot, chevrons and a slow auto-advance. Each look routes to the
 * real collection or filtered shop view that delivers it. Brand-skinned.
 */

export interface Look {
  slug: string;
  label: string;
  image: string;
  href: string;
}

const LOOKS: Look[] = [
  {
    slug: "vacation-hair",
    label: "Vacation Hair",
    image: "/media/images/models/41-22.png",
    href: "/collections/body-wave-wigs",
  },
  {
    slug: "wedding-hair",
    label: "Wedding Hair",
    image: "/media/images/models/model-1.avif",
    href: "/collections/hd-full-lace",
  },
  {
    slug: "chic-bob",
    label: "Chic Bob",
    image: "/media/images/models/model-2.avif",
    href: "/shop?texture=straight",
  },
  {
    slug: "trendy-color",
    label: "Trendy Color",
    image: "/media/images/models/model-3.avif",
    href: "/collections/coloured-wigs",
  },
  {
    slug: "bundles-deal",
    label: "Bundles Deal",
    image: "/media/images/models/32-10Pre-cut-lace-body-wave-wear-go-glueless-wig-1.jpg",
    href: "/collections/closures-and-bundles",
  },
  {
    slug: "braiding-hair",
    label: "Braiding Hair",
    image: "/media/images/models/32-3upgrade-6x5-pre-cut-everything-wear-go-glueless-wig-3.jpg",
    href: "/shop?texture=kinky-curly",
  },
];

const DWELL = 6000;
// Look tiles per view by width: phone → 4K.
const STEPS = [
  { min: 0, count: 1 },
  { min: 640, count: 2 },
  { min: 1024, count: 3 },
  { min: 2200, count: 4 },
];

function Card({ look }: { look: Look }) {
  return (
    <Link href={look.href} className="group block">
      <div className="dark-island relative overflow-hidden rounded-2xl bg-plum-900 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.85)] ring-1 ring-white/[0.08] transition-all duration-500 group-hover:ring-gold/50">
        <ProductImage
          src={look.image}
          alt={`${look.label} — Beyond Lace units for the look`}
          ratio="1 / 1"
          className="transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center p-6">
          <span className="font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.6vw,2rem)] text-paper drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)] transition-colors duration-300 group-hover:text-gold">
            {look.label}
          </span>
        </div>
      </div>
    </Link>
  );
}

export function ShopByLook() {
  const reduced = useReducedMotion();
  const visibleCount = useResponsiveCount(STEPS);
  const [base, setBase] = useState(0);
  const [paused, setPaused] = useState(false);
  const len = LOOKS.length;

  useEffect(() => {
    if (paused || len <= visibleCount) return;
    const t = setInterval(() => setBase((b) => (b + 1) % len), DWELL);
    return () => clearInterval(t);
  }, [paused, len, visibleCount]);

  const count = Math.min(visibleCount, len);
  const visible = Array.from({ length: count }, (_, i) => LOOKS[(base + i) % len]);
  const step = (d: number) => setBase((b) => (b + d + len) % len);

  return (
    <section aria-label="Shop by look" className="border-t border-white/[0.06] bg-ink py-16">
      <div className="mx-auto max-w-[1440px] px-[3vw]">
        <h2 className="mb-10 text-center font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.75rem)] text-paper">
          Shop by Look
        </h2>

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

          <div className="flex flex-1 items-stretch gap-4 overflow-hidden py-2 sm:gap-6">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((look) => (
                <motion.div
                  key={look.slug}
                  layout
                  initial={reduced ? { opacity: 0 } : { opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, x: -80 }}
                  transition={{
                    layout: { duration: reduced ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] },
                    duration: reduced ? 0.2 : 0.55,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ flexGrow: 1, flexBasis: 0 }}
                  className="min-w-0"
                >
                  <Card look={look} />
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
