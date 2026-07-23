import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { type Product } from "@/lib/commerce";
import { ProductImage } from "@/components/ui/ProductImage";
import { Money } from "@/components/ui/Money";
import { WHOLESALE_MOQ } from "@/lib/channel";

/**
 * Wholesale listing card. Same visual language as the retail card, but the
 * price it leads with is per-unit at the trade minimum, and it routes into the
 * wholesale PDP — the two never share a link, which is half of what keeps the
 * channels from crossing.
 */
export function WholesaleProductCard({ product }: { product: Product }) {
  // Deepest standing tier = the price a 50-unit order actually pays.
  const unit = product.wholesale
    ? [...product.wholesale.tiers].sort((a, b) => b.minQty - a.minQty)[0].unitPrice
    : product.price;

  return (
    <Link href={`/wholesale/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg bg-plum-900">
        <ProductImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
        />
        <span className="absolute top-4 left-4 z-[2] border border-gold/40 bg-ink/70 px-2.5 py-1 text-[0.625rem] tracking-[0.14em] text-gold uppercase backdrop-blur-sm">
          MOQ {WHOLESALE_MOQ}
        </span>
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

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[0.75rem] text-neutral-400">from</span>
          <Money usd={unit} className="text-[0.9375rem] text-paper tabular-nums" />
          <span className="text-[0.75rem] text-neutral-400">/ unit</span>
        </div>
        <p className="mt-1.5 text-[0.6875rem] tracking-[0.08em] text-gold uppercase">
          Trade pricing · MAP-protected
        </p>
      </div>
    </Link>
  );
}
