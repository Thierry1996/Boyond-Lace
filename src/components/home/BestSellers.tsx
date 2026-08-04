import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { QuickAddButton } from "./QuickAddButton";

/**
 * "Best Sale" — the bestseller drop, five rounded cards to a row. Cloned from
 * the tested layout: a discount flag, a price pill and offer note over the
 * image, feature chips, a rating that links to the reviews, the compare-at
 * strike, and a bordered price box with a quick-add cart button. Every image,
 * title, and rating links to the PDP; the cart button writes to the persisted
 * cart; "View all" routes to the Bestsellers collection.
 */

const OFFERS = ["Ships in 24H", "Ready to wear", "Bestseller", "Pay in 4 available"];

export function BestSellers({ products }: { products: Product[] }) {
  return (
    <section className="bg-gradient-to-b from-[#f3eefb] to-[#faf6f9] py-16">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-[0.02em] text-plum-900 uppercase">
            Best Sale
          </h2>
          <Link
            href="/collections/bestsellers"
            className="inline-flex items-center gap-1.5 border-b border-plum-700 pb-0.5 text-[0.75rem] tracking-[0.12em] text-plum-700 uppercase transition-colors hover:text-plum-500"
          >
            View all
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p, idx) => {
            const onSale = !!p.compareAtPrice && p.compareAtPrice > p.price;
            const discount = onSale
              ? Math.round((1 - p.price / (p.compareAtPrice as number)) * 100)
              : 0;
            const href = `/product/${p.slug}`;
            const dollars = Math.round(p.price / 100);
            const chips = [
              p.density ? `${p.density} Density` : null,
              p.badges[0] ?? "Ready to Wear",
            ].filter(Boolean) as string[];

            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-plum-900/10 bg-white shadow-[0_14px_36px_-24px_rgba(90,45,103,0.4)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-24px_rgba(90,45,103,0.55)]"
              >
                {/* Image + overlays */}
                <div className="relative">
                  <Link href={href} aria-label={p.title}>
                    <ProductImage
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      ratio="4 / 5"
                      className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </Link>

                  {discount > 0 && (
                    <span className="absolute top-0 left-0 rounded-br-xl bg-plum-700 px-2.5 py-1 text-[0.6875rem] font-bold text-white">
                      {discount}%
                    </span>
                  )}

                  {/* Price pill + offer note */}
                  <div className="pointer-events-none absolute bottom-2.5 left-2.5 flex items-center gap-2">
                    <span className="rounded-full bg-white px-3 py-1 text-[1.0625rem] font-bold text-plum-900 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.4)]">
                      ${dollars}
                    </span>
                    <span className="rounded-full bg-plum-900/80 px-2.5 py-1 text-[0.5625rem] font-medium text-blush-200 backdrop-blur-sm">
                      {OFFERS[idx % OFFERS.length]}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-3.5">
                  <div className="flex flex-wrap gap-1.5">
                    {chips.map((c) => (
                      <span
                        key={c}
                        className="rounded-full border border-plum-900/12 px-2 py-0.5 text-[0.5625rem] tracking-[0.04em] text-plum-900/60 uppercase"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <Link href={href}>
                    <h3 className="mt-2.5 truncate text-[0.875rem] font-medium text-plum-900 transition-colors duration-300 group-hover:text-plum-600">
                      {p.title}
                    </h3>
                  </Link>

                  <Link
                    href={`${href}#reviews`}
                    className="mt-1.5 flex items-center gap-1.5 text-[0.6875rem] text-plum-900/55"
                  >
                    <span className="text-gold" aria-hidden>
                      {"★".repeat(Math.max(1, Math.round(p.rating)))}
                    </span>
                    <span className="underline underline-offset-2 hover:text-plum-700">
                      {p.reviewCount.toLocaleString()} Reviews
                    </span>
                  </Link>

                  <div className="mt-auto pt-3">
                    {onSale && (
                      <Money
                        usd={p.compareAtPrice as number}
                        className="text-[0.8125rem] text-plum-900/40 line-through tabular-nums"
                      />
                    )}
                    <div className="mt-1 flex items-center justify-between gap-2 rounded-lg border border-plum-900/15 py-1.5 pr-1.5 pl-3">
                      <Money
                        usd={p.price}
                        className="text-[0.9375rem] font-semibold text-plum-900 tabular-nums"
                      />
                      {p.inStock && (
                        <QuickAddButton
                          productId={p.id}
                          slug={p.slug}
                          title={p.title}
                          price={p.price}
                          image={p.images[0].src}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
