import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { QuickAddButton } from "./QuickAddButton";

/**
 * "New Looks, Best Investment" — the new-arrivals drop, five rounded cards to a
 * row. Every card links to its PDP; a discounted unit is flagged SALE, the rest
 * NEW. The cart button quick-adds to the persisted cart. "View all" routes to
 * the New In collection.
 */
export function NewArrivals({ products }: { products: Product[] }) {
  return (
    <section className="bg-[#faf6f9] py-16">
      <div className="mx-auto max-w-[1440px] px-[4vw]">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h2 className="mx-auto font-[family-name:var(--font-display)] text-[clamp(1.75rem,3.5vw,2.5rem)] text-plum-900 sm:mx-0">
            New Looks, Best Investment
          </h2>
          <Link
            href="/collections/new-in"
            className="hidden items-center gap-1.5 border-b border-plum-700 pb-0.5 text-[0.75rem] tracking-[0.12em] text-plum-700 uppercase transition-colors hover:text-plum-500 sm:inline-flex"
          >
            View all
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {products.map((p) => {
            const onSale = !!p.compareAtPrice && p.compareAtPrice > p.price;
            const badge = onSale ? "Sale" : "New";
            const href = `/product/${p.slug}`;
            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-plum-900/10 bg-white/70 shadow-[0_14px_36px_-24px_rgba(90,45,103,0.45)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_48px_-24px_rgba(90,45,103,0.55)]"
              >
                <div className="relative">
                  <Link href={href} aria-label={p.title}>
                    <ProductImage
                      src={p.images[0].src}
                      alt={p.images[0].alt}
                      ratio="3 / 4"
                      className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </Link>
                  <span
                    className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[0.5625rem] font-semibold tracking-[0.12em] text-white uppercase ${
                      onSale ? "bg-plum-900" : "bg-plum-600"
                    }`}
                  >
                    {badge}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <Link href={href}>
                    <h3 className="truncate text-[0.9375rem] font-medium text-plum-900 transition-colors duration-300 group-hover:text-plum-600">
                      {p.title}
                    </h3>
                  </Link>
                  <div className="mt-3 flex items-center justify-between gap-2">
                    {p.price > 0 ? (
                      <div className="flex items-baseline gap-2">
                        <Money
                          usd={p.price}
                          className="text-[0.9375rem] font-semibold text-plum-900 tabular-nums"
                        />
                        {onSale && (
                          <Money
                            usd={p.compareAtPrice!}
                            className="text-[0.8125rem] text-plum-900/40 line-through tabular-nums"
                          />
                        )}
                      </div>
                    ) : (
                      <span className="text-[0.875rem] font-medium text-plum-700">
                        By application
                      </span>
                    )}
                    {p.price > 0 && p.inStock && (
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
            );
          })}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/collections/new-in"
            className="inline-flex items-center gap-1.5 border-b border-plum-700 pb-0.5 text-[0.75rem] tracking-[0.12em] text-plum-700 uppercase"
          >
            View all new arrivals
            <ArrowRight size={13} strokeWidth={1.75} />
          </Link>
        </div>
      </div>
    </section>
  );
}
