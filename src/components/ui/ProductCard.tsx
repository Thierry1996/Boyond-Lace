import Link from "next/link";
import { type Product } from "@/lib/commerce";
import { ProductImage } from "./ProductImage";
import { WishlistButton } from "./WishlistButton";
import { Money } from "./Money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden">
        <WishlistButton slug={product.slug} />
        <ProductImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          className="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.03]"
        />

        {product.badges[0] && (
          <span className="absolute top-4 left-4 border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
            {product.badges[0]}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute inset-x-0 bottom-0 bg-ink/85 py-3 text-center text-[0.6875rem] tracking-[0.16em] text-neutral-200 uppercase backdrop-blur-sm">
            Waitlist open
          </span>
        )}
      </div>

      <div className="pt-5">
        <h3 className="text-[1.0625rem] text-paper transition-colors group-hover:text-blush-300">
          {product.title}
        </h3>
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
