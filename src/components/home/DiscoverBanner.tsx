import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * "Discover the Perfect Wig for You" — a full-width promo banner (image 1): a
 * full-bleed lifestyle image on the left against a subtle plum gradient on the
 * right, with an eyebrow, headline, supporting line and a Shop Now CTA. The CTA
 * is the doorway into the standalone shop-by-intention page, from which every
 * circle routes on to its catalogue collection. Rounded, ring-bordered, and
 * self-contained so it can sit between any two dark sections.
 */
export function DiscoverBanner({ href = "/shop-by-intentions" }: { href?: string }) {
  return (
    <section aria-label="Discover the perfect wig" className="px-[4vw] py-10">
      <div className="mx-auto max-w-[1560px]">
        <div className="grid overflow-hidden rounded-3xl bg-gradient-to-br from-plum-800 via-plum-900 to-[#2a1122] ring-1 ring-white/[0.08] lg:h-[24rem] lg:grid-cols-2">
          {/* Lifestyle image — full-bleed left */}
          <div className="relative h-52 overflow-hidden lg:h-full">
            <ProductImage
              src="aurora"
              alt="A woman glowing in a Beyond Lace human hair unit"
              className="absolute inset-0 h-full w-full"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent to-plum-900/40 lg:to-plum-900/60"
            />
          </div>

          {/* Copy — centred right */}
          <div className="flex flex-col items-center justify-center gap-3.5 p-6 text-center sm:p-8 lg:p-10">
            <p className="border-b border-gold/50 pb-1.5 text-[0.6875rem] font-semibold tracking-[0.24em] text-gold uppercase">
              Premium quality, stunning looks
            </p>
            <h2 className="max-w-[15ch] font-[family-name:var(--font-display)] text-[clamp(1.9rem,4vw,3.25rem)] leading-[1.05] text-paper">
              Discover the Perfect Wig for You
            </h2>
            <p className="max-w-md text-[0.9375rem] leading-relaxed text-blush-200/75">
              Elevate your style with our units. Made from the finest virgin Remy human hair, each
              one offers unmatched quality and a natural look that blends seamlessly with your own
              hair.
            </p>
            <Link
              href={href}
              className="group mt-2 inline-flex items-center gap-2 rounded-md border border-gold/70 px-9 py-3.5 text-[0.75rem] font-semibold tracking-[0.16em] text-gold uppercase transition-all duration-300 hover:bg-gold hover:text-ink"
            >
              Shop Now
              <ArrowUpRight
                size={15}
                strokeWidth={2}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
