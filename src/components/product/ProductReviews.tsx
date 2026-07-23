"use client";

import { useMemo, useState } from "react";
import { Star, ThumbsUp, ShieldCheck } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product, Review, RatingBreakdown } from "@/lib/commerce";

/**
 * Reviews section. Overall score and sub-rating bars on the left, a customer
 * photo strip on the right, filter chips, and a sortable list. The review data
 * is seeded placeholder (see lib/commerce/reviews.ts) until a reviews backend
 * lands — the layout is real, the testimonials are labelled demo content.
 */

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${value} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          size={size}
          strokeWidth={1.5}
          className="text-gold"
          fill={i < Math.round(value) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-16 text-[0.8125rem] text-neutral-400">{label}</span>
      <span className="w-8 text-[0.8125rem] text-paper tabular-nums">{value.toFixed(1)}</span>
      <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-gold"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </span>
    </div>
  );
}

export function ProductReviews({
  product,
  breakdown,
  reviews,
  facets,
  photoCount,
}: {
  product: Product;
  breakdown: RatingBreakdown;
  reviews: Review[];
  facets: Array<{ label: string; count: number }>;
  photoCount: number;
}) {
  const [sort, setSort] = useState<"hottest" | "newest">("hottest");
  const [facet, setFacet] = useState<string>("All");

  const sorted = useMemo(() => {
    const list = [...reviews];
    return sort === "newest"
      ? list.sort((a, b) => b.date.localeCompare(a.date))
      : list.sort((a, b) => b.helpful - a.helpful);
  }, [reviews, sort]);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      {/* Summary + photo strip */}
      <div className="grid gap-12 border-b border-white/[0.08] pb-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <div className="flex items-end gap-4">
            <span className="font-[family-name:var(--font-display)] text-[clamp(2.5rem,5vw,3.5rem)] leading-none text-paper tabular-nums">
              {breakdown.overall.toFixed(1)}
            </span>
            <span className="pb-1 text-[1.0625rem] text-neutral-400">/ 5.0</span>
          </div>
          <div className="mt-3">
            <Stars value={breakdown.overall} size={20} />
          </div>
          <p className="mt-2 text-[0.9375rem] text-neutral-400">
            Based on {breakdown.count.toLocaleString()} reviews
          </p>

          <div className="mt-6 max-w-sm space-y-2.5">
            <Bar label="Quality" value={breakdown.quality} />
            <Bar label="Shipping" value={breakdown.shipping} />
            <Bar label="Service" value={breakdown.service} />
          </div>
        </div>

        {/* Customer photo strip — placeholder gradient tiles until real UGC. */}
        <div className="grid grid-cols-4 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg">
              <ProductImage
                src={product.images[i % product.images.length].src}
                alt={`Customer photo ${i + 1}`}
                ratio="1 / 1"
              />
            </div>
          ))}
          <div className="relative overflow-hidden rounded-lg">
            <ProductImage src={product.images[0].src} alt="More customer photos" ratio="1 / 1" />
            <span className="absolute inset-0 flex items-center justify-center bg-ink/60 text-[0.8125rem] font-medium text-paper">
              {photoCount} photos
            </span>
          </div>
        </div>
      </div>

      {/* Filters + sort */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex flex-wrap gap-2.5">
          {[{ label: "All", count: breakdown.count }, ...facets].map((f) => {
            const active = facet === f.label;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => setFacet(f.label)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-[0.8125rem] transition-colors duration-300 ${
                  active
                    ? "border-gold text-gold"
                    : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
                }`}
              >
                {f.label}
                <span className="text-[0.6875rem] tabular-nums opacity-70">{f.count}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4 text-[0.8125rem]">
          {(["hottest", "newest"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSort(s)}
              className={`capitalize transition-colors duration-300 ${
                sort === s
                  ? "text-paper underline decoration-gold underline-offset-8"
                  : "text-neutral-400 hover:text-paper"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Review list */}
      <ul className="divide-y divide-white/[0.07]">
        {sorted.map((r) => (
          <li key={r.id} className="grid gap-5 py-8 sm:grid-cols-[180px_1fr]">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-8 place-items-center rounded-full bg-plum-800 text-[0.75rem] text-paper">
                  {r.author.charAt(0)}
                </span>
                <span className="text-[0.875rem] text-paper">{r.author}</span>
              </div>
              {r.verified && (
                <span className="mt-2 inline-flex items-center gap-1.5 text-[0.6875rem] text-neutral-400">
                  <ShieldCheck size={12} strokeWidth={1.75} className="text-gold" />
                  Verified purchase
                </span>
              )}
              {r.hasPhoto && (
                <div className="mt-3 w-16 overflow-hidden rounded">
                  <ProductImage src={product.images[0].src} alt="Reviewer photo" ratio="1 / 1" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <Stars value={r.rating} />
                <span className="text-[0.75rem] text-neutral-400 tabular-nums">{r.date}</span>
              </div>
              <p className="mt-3 text-[0.9375rem] text-paper">{r.title}</p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-neutral-400">{r.body}</p>
              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] text-neutral-400 transition-colors hover:text-gold"
              >
                <ThumbsUp size={13} strokeWidth={1.6} />
                Helpful ({r.helpful})
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 text-center text-[0.75rem] text-neutral-400">
        Reviews shown are illustrative sample content pending our verified-review integration.
      </p>
    </div>
  );
}
