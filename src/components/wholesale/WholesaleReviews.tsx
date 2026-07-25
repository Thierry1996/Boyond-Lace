"use client";

import { useMemo, useState } from "react";
import { Star, ThumbsUp, ShieldCheck, CornerDownRight, ChevronDown } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product, Review } from "@/lib/commerce";

/**
 * Wholesale supplier-review section — the trade marketplace layout: product vs
 * store review tabs, a rating summary, mention chips that filter, and reviews
 * carrying buyer country, verified/repeat-buyer status, photo thumbnails and a
 * supplier reply. Data is seeded placeholder (see lib/commerce/reviews.ts).
 */

function Stars({ value, size = 14 }: { value: number; size?: number }) {
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

export function WholesaleReviews({
  product,
  reviews,
  mentions,
  storeReviewCount,
}: {
  product: Product;
  reviews: Review[];
  mentions: Array<{ label: string; count: number }>;
  storeReviewCount: number;
}) {
  const [tab, setTab] = useState<"product" | "store">("product");
  const [mention, setMention] = useState<string>("All");
  const [withMedia, setWithMedia] = useState(false);
  const [sort, setSort] = useState<"relevant" | "recent">("relevant");
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  const shown = useMemo(() => {
    let list = reviews;
    if (mention !== "All") list = list.filter((r) => r.tags.includes(mention));
    if (withMedia) list = list.filter((r) => (r.photos ?? 0) > 0);
    return sort === "recent"
      ? [...list].sort((a, b) => b.date.localeCompare(a.date))
      : [...list].sort((a, b) => b.helpful - a.helpful);
  }, [reviews, mention, withMedia, sort]);

  const withMediaCount = reviews.filter((r) => (r.photos ?? 0) > 0).length;

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      {/* Product vs store tabs */}
      <div className="flex gap-8 border-b border-white/[0.08]">
        {(["product", "store"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`relative pb-4 text-[1.0625rem] transition-colors ${
              tab === t ? "text-paper" : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            {t === "product"
              ? `Product reviews (${product.reviewCount.toLocaleString()})`
              : `Store reviews (${storeReviewCount.toLocaleString()})`}
            {tab === t && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gold" />}
          </button>
        ))}
      </div>

      {tab === "store" ? (
        <p className="py-12 text-[0.9375rem] text-neutral-400">
          Store-wide reviews across every unit Beyond Lace supplies —{" "}
          {storeReviewCount.toLocaleString()} verified trade purchases, {""}
          rated {product.rating.toFixed(1)} on average. The per-unit reviews are under the Product
          tab.
        </p>
      ) : (
        <>
          {/* Summary */}
          <div className="flex flex-wrap items-center gap-4 pt-8">
            <span className="font-[family-name:var(--font-display)] text-[clamp(2.25rem,4vw,3rem)] leading-none text-paper tabular-nums">
              {product.rating.toFixed(1)}
            </span>
            <div>
              <Stars value={product.rating} size={18} />
              <p className="mt-1 text-[0.8125rem] text-neutral-400">
                <span className="text-gold">Very satisfied</span> · Based on{" "}
                {product.reviewCount.toLocaleString()} verified purchases
              </p>
            </div>
          </div>

          {/* Filters + sort */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {[
                { key: "All", label: `All`, count: null as number | null },
                { key: "media", label: "With photos/videos", count: withMediaCount },
              ].map((f) => {
                const active = f.key === "media" ? withMedia : mention === "All" && !withMedia;
                return (
                  <button
                    key={f.key}
                    type="button"
                    onClick={() => {
                      if (f.key === "media") setWithMedia((v) => !v);
                      else {
                        setMention("All");
                        setWithMedia(false);
                      }
                    }}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-1.5 text-[0.8125rem] transition-colors ${
                      active
                        ? "border-gold text-gold"
                        : "border-white/15 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
                    }`}
                  >
                    {f.label}
                    {f.count != null && (
                      <span className="ml-1.5 text-[0.6875rem] opacity-70">({f.count})</span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setSort((s) => (s === "relevant" ? "recent" : "relevant"))}
              className="inline-flex items-center gap-1.5 text-[0.8125rem] text-neutral-400 transition-colors hover:text-paper"
            >
              Sort by:{" "}
              <span className="text-paper">
                {sort === "relevant" ? "Most relevant" : "Most recent"}
              </span>
              <ChevronDown size={14} strokeWidth={1.75} />
            </button>
          </div>

          {/* Mention chips */}
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <span className="text-[0.8125rem] text-neutral-400">Reviews that mention:</span>
            {mentions.map((m) => {
              const active = mention === m.label;
              return (
                <button
                  key={m.label}
                  type="button"
                  onClick={() => setMention(active ? "All" : m.label)}
                  aria-pressed={active}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] transition-colors ${
                    active
                      ? "border-gold text-gold"
                      : "border-white/12 text-neutral-400 hover:border-white/40 hover:text-neutral-200"
                  }`}
                >
                  {m.label} <span className="text-[0.6875rem] opacity-70">({m.count})</span>
                </button>
              );
            })}
          </div>

          {/* Review list */}
          <ul className="mt-4 divide-y divide-white/[0.07]">
            {shown.map((r) => (
              <li key={r.id} className="grid gap-5 py-8 sm:grid-cols-[150px_1fr]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="grid size-8 place-items-center rounded-full bg-plum-800 text-[0.75rem] text-paper">
                      {r.author.charAt(0)}
                    </span>
                    <span className="text-[0.875rem] text-paper">{r.author}</span>
                  </div>
                  {r.country && <p className="mt-2 text-[0.75rem] text-neutral-400">{r.country}</p>}
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-[0.6875rem] text-neutral-400">
                    <ShieldCheck size={12} strokeWidth={1.75} className="text-gold" />
                    Verified purchase
                  </p>
                  {r.repeatBuyer && (
                    <p className="mt-1.5 inline-block rounded bg-white/[0.06] px-2 py-0.5 text-[0.625rem] tracking-[0.06em] text-neutral-200 uppercase">
                      Repeat buyer
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Stars value={r.rating} />
                    <span className="text-[0.75rem] text-neutral-400 tabular-nums">{r.date}</span>
                  </div>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-paper">{r.body}</p>

                  {/* Supplier reply */}
                  {r.supplierReply && (
                    <div className="mt-4 flex gap-2.5 border-l-2 border-gold/40 bg-white/[0.03] p-4">
                      <CornerDownRight
                        size={15}
                        strokeWidth={1.75}
                        className="mt-0.5 shrink-0 text-gold"
                      />
                      <p className="text-[0.875rem] leading-relaxed text-neutral-400">
                        <span className="text-gold">Beyond Lace replied:</span> {r.supplierReply}
                      </p>
                    </div>
                  )}

                  {/* Photo thumbnails */}
                  {(r.photos ?? 0) > 0 && (
                    <div className="mt-4 flex gap-2.5">
                      {Array.from({ length: Math.min(4, r.photos ?? 0) }).map((_, i) => (
                        <span key={i} className="w-16 overflow-hidden rounded">
                          <ProductImage
                            src={product.images[i % product.images.length].src}
                            alt="Buyer photo"
                            ratio="1 / 1"
                          />
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setVoted((v) => ({ ...v, [r.id]: !v[r.id] }))}
                    aria-pressed={voted[r.id]}
                    className={`mt-4 inline-flex items-center gap-1.5 text-[0.75rem] transition-colors ${
                      voted[r.id] ? "text-gold" : "text-neutral-400 hover:text-gold"
                    }`}
                  >
                    <ThumbsUp
                      size={13}
                      strokeWidth={1.6}
                      fill={voted[r.id] ? "currentColor" : "none"}
                    />
                    Helpful ({r.helpful + (voted[r.id] ? 1 : 0)})
                  </button>
                </div>
              </li>
            ))}
            {shown.length === 0 && (
              <li className="py-12 text-center text-[0.9375rem] text-neutral-400">
                No reviews match that filter.
              </li>
            )}
          </ul>

          <p className="mt-6 text-center text-[0.75rem] text-neutral-400">
            Reviews are illustrative sample content pending our verified-review integration.
          </p>
        </>
      )}
    </div>
  );
}
