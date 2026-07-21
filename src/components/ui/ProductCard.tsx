import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Product } from "@/lib/commerce";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";
import { Money } from "./Money";

/**
 * Product card.
 *
 * Deliberately CSS-only so it stays a server component across the ten pages
 * that render it. The premium read comes from layering several small moves on
 * one hover rather than a single lift:
 *   · image scales slowly (900ms) while the frame stays put — the picture
 *     moves inside its window, which is how print crops behave
 *   · a gold hairline draws across the base of the frame
 *   · corner ticks fade in, borrowing from the brand's framed-board layout
 *   · the title shifts a few pixels and an arrow arrives
 * Nothing exceeds 6px of travel. Restraint is the whole point.
 */
export function ProductCard({ product }: { product: Product }) {
  const out = !product.inStock;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-plum-900">
        <WishlistButton slug={product.slug} />

        <ProductImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />

        {/* Scrim deepens on hover so the overlay type stays legible */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-95"
        />

        {/* Corner ticks — the brand's framed-board motif, at card scale */}
        {(["left-3 top-3", "right-3 top-3", "left-3 bottom-3", "right-3 bottom-3"] as const).map(
          (pos, i) => (
            <span
              key={pos}
              aria-hidden="true"
              className={`pointer-events-none absolute ${pos} h-3 w-3 opacity-0 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100`}
              style={{
                borderTop: i < 2 ? "1px solid var(--color-gold)" : undefined,
                borderBottom: i >= 2 ? "1px solid var(--color-gold)" : undefined,
                borderLeft: i % 2 === 0 ? "1px solid var(--color-gold)" : undefined,
                borderRight: i % 2 === 1 ? "1px solid var(--color-gold)" : undefined,
                transitionDelay: `${60 + i * 45}ms`,
              }}
            />
          ),
        )}

        {product.badges[0] && (
          <span className="absolute top-4 left-4 z-[2] border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
            {product.badges[0]}
          </span>
        )}

        {out && (
          <span className="absolute inset-x-0 bottom-0 z-[2] bg-ink/85 py-3 text-center text-[0.6875rem] tracking-[0.16em] text-neutral-200 uppercase backdrop-blur-sm">
            Waitlist open
          </span>
        )}

        {/* Gold rule drawing across the base of the frame */}
        {!out && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-px origin-left scale-x-0 bg-gold transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
          />
        )}
      </div>

      <div className="pt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[1.0625rem] text-paper transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1 group-hover:text-gold">
            {product.title}
          </h3>
          <ArrowUpRight
            size={15}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-1 shrink-0 -translate-x-1.5 translate-y-1.5 text-gold opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100"
          />
        </div>

        <p className="mt-1 text-[0.8125rem] leading-snug text-neutral-400">{product.tagline}</p>

        <div className="mt-3 flex items-baseline gap-3">
          {product.price > 0 ? (
            <>
              <Money usd={product.price} className="text-[0.9375rem] text-paper tabular-nums" />
              {product.compareAtPrice && (
                <Money
                  usd={product.compareAtPrice}
                  className="text-[0.8125rem] text-neutral-400 line-through tabular-nums"
                />
              )}
            </>
          ) : (
            <span className="text-[0.9375rem] text-gold">By application</span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-neutral-400">
          <span className="text-gold" aria-hidden="true">
            {"★".repeat(Math.round(product.rating))}
          </span>
          <span className="tabular-nums">
            {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}
