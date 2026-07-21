"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Star, Plus, Eye, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@/lib/commerce";
import { Money } from "@/components/ui/Money";
import { ProductImage } from "@/components/ui/ProductImage";
import { commissionOn, type PromotableCategory } from "@/lib/ambassador";

/**
 * Live promotable-product carousel for one category.
 *
 * Six 1:1 cards across on desktop. Every 15 seconds the window advances by a
 * full page, so outgoing products are replaced by the next set — matching the
 * brief's "outgoing slides replaced every 15s by incoming". Catalog data is
 * fetched live and refetched periodically, so newly published products appear
 * without a deploy.
 */

const ROTATE_MS = 15_000;
const PER_PAGE = 6;

export function LiveProductCarousel({ category }: { category: PromotableCategory }) {
  const [page, setPage] = useState(0);
  const [quickView, setQuickView] = useState<Product | null>(null);

  const { data: products = [] } = useQuery({
    queryKey: ["ambassador-catalog"],
    queryFn: async (): Promise<Product[]> => {
      const res = await fetch("/api/products?limit=50");
      const json = await res.json();
      return json.products ?? [];
    },
    // Live: pick up catalog changes without a page reload.
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  const items = useMemo(
    () => products.filter((p) => category.lines.includes(p.line) && p.price > 0),
    [products, category.lines],
  );

  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE));

  useEffect(() => {
    if (pageCount <= 1) return;
    const t = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS);
    return () => clearInterval(t);
  }, [pageCount]);

  // Guard against the page index dangling past the end when the catalog shrinks.
  useEffect(() => {
    if (page >= pageCount) setPage(0);
  }, [page, pageCount]);

  return (
    <section className="mb-16">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-1.5 text-gold">
            {category.name} · {(category.baseCommissionBps / 100).toFixed(0)}% commission
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-2xl text-paper">
            {category.blurb.split("—")[0].trim()}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              aria-label={`Show product set ${i + 1}`}
              aria-current={i === page}
              className={`h-[3px] transition-all duration-500 ${
                i === page ? "w-8 bg-gold" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
          <Link
            href={category.href}
            className="ml-2 text-[0.75rem] tracking-[0.1em] text-gold uppercase hover:opacity-75"
          >
            All
          </Link>
        </div>
      </div>

      {/* Sliding track */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-[1100ms] ease-[var(--ease-editorial)]"
          style={{ transform: `translateX(-${page * 100}%)` }}
        >
          {Array.from({ length: pageCount }).map((_, p) => (
            <div
              key={p}
              className="grid w-full shrink-0 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
            >
              {items.slice(p * PER_PAGE, p * PER_PAGE + PER_PAGE).map((product) => (
                <ProductTile
                  key={product.id}
                  product={product}
                  bps={category.baseCommissionBps}
                  onQuickView={() => setQuickView(product)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {items.length === 0 && (
        <p className="py-10 text-center text-[0.875rem] text-neutral-400">Loading live catalog…</p>
      )}

      {quickView && (
        <QuickView
          product={quickView}
          bps={category.baseCommissionBps}
          onClose={() => setQuickView(null)}
        />
      )}
    </section>
  );
}

function ProductTile({
  product,
  bps,
  onQuickView,
}: {
  product: Product;
  bps: number;
  onQuickView: () => void;
}) {
  return (
    <div className="group relative">
      {/* 1:1 square with border radius, per the brief */}
      <div className="relative overflow-hidden rounded-xl">
        <ProductImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          ratio="1 / 1"
          className="transition-transform duration-[900ms] ease-[var(--ease-editorial)] group-hover:scale-[1.08]"
        />

        {/* Hover scrim + actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-ink/70 opacity-0 backdrop-blur-[2px] transition-opacity duration-400 group-hover:opacity-100">
          <button
            onClick={onQuickView}
            className="flex items-center gap-1.5 rounded-full border border-gold bg-gold px-4 py-2 text-[0.6875rem] tracking-[0.1em] text-ink uppercase transition-transform duration-300 hover:scale-105"
          >
            <Eye size={12} strokeWidth={1.75} />
            Quick view
          </button>
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center gap-1.5 rounded-full border border-gold/60 px-4 py-2 text-[0.6875rem] tracking-[0.1em] text-gold uppercase transition-colors duration-300 hover:bg-gold hover:text-ink"
          >
            <Plus size={12} strokeWidth={1.75} />
            Promote
          </Link>
        </div>

        {/* Commission chip */}
        <span className="absolute top-2.5 left-2.5 rounded-full border border-gold/40 bg-ink/75 px-2.5 py-1 text-[0.625rem] text-gold tabular-nums backdrop-blur-sm">
          +<Money usd={commissionOn(product.price, bps)} />
        </span>
      </div>

      <p className="mt-3 truncate text-[0.8125rem] text-paper">{product.title}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <Money usd={product.price} className="text-[0.8125rem] text-neutral-400 tabular-nums" />
        <span className="flex items-center gap-1 text-[0.6875rem] text-gold">
          <Star size={10} fill="currentColor" strokeWidth={0} />
          {product.rating.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

function QuickView({
  product,
  bps,
  onClose,
}: {
  product: Product;
  bps: number;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} quick view`}
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-[5vw] backdrop-blur-sm"
      style={{ animation: "blFade 300ms var(--ease-editorial)" }}
      onClick={onClose}
    >
      <div
        className="grid max-h-[85vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-gold/30 bg-neutral-900 md:grid-cols-2"
        onClick={(e) => e.stopPropagation()}
      >
        <ProductImage
          src={product.images[0].src}
          alt={product.images[0].alt}
          ratio="1 / 1"
          className="h-full"
        />
        <div className="relative p-7">
          <button
            onClick={onClose}
            aria-label="Close quick view"
            className="absolute top-5 right-5 text-neutral-400 transition-colors hover:text-gold"
          >
            <X size={18} />
          </button>

          <p className="eyebrow text-gold">{product.badges[0] ?? "Beyond Lace"}</p>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-paper">
            {product.title}
          </h3>
          <p className="mt-1 text-[0.875rem] text-blush-300 italic">{product.tagline}</p>

          <div className="mt-5 flex items-baseline gap-4">
            <Money
              usd={product.price}
              className="font-[family-name:var(--font-display)] text-2xl text-paper tabular-nums"
            />
            <span className="text-[0.8125rem] text-gold">
              you earn <Money usd={commissionOn(product.price, bps)} />
            </span>
          </div>

          <div className="mt-2 flex items-center gap-2 text-[0.75rem] text-neutral-400">
            <span className="text-gold" aria-hidden="true">
              {"★".repeat(Math.round(product.rating))}
            </span>
            <span className="tabular-nums">
              {product.rating.toFixed(1)} · {product.reviewCount.toLocaleString()} reviews
            </span>
          </div>

          <p className="mt-5 text-[0.875rem] leading-relaxed text-neutral-400">
            {product.description.slice(0, 200)}…
          </p>

          <dl className="mt-5 space-y-1.5 border-t border-white/10 pt-5">
            {product.specs.slice(0, 3).map((s) => (
              <div key={s.label} className="flex gap-3 text-[0.75rem]">
                <dt className="w-24 shrink-0 text-neutral-400">{s.label}</dt>
                <dd className="text-neutral-200">{s.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold bg-gold px-6 py-3 text-[0.75rem] tracking-[0.12em] text-ink uppercase transition-all duration-500 hover:bg-transparent hover:text-gold"
            >
              Open product page
            </Link>
            <Link
              href="/ambassadors/dashboard/links"
              className="border-b border-gold pb-1 text-[0.75rem] tracking-[0.1em] text-gold uppercase"
            >
              Generate affiliate link
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
