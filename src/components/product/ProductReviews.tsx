"use client";

import { useMemo, useState } from "react";
import { Star, ThumbsUp, ShieldCheck, Play } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Product, Review, RatingBreakdown, SocialShot } from "@/lib/commerce";
import { SocialProofGallery } from "./SocialProofGallery";

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
  socialProof,
}: {
  product: Product;
  breakdown: RatingBreakdown;
  reviews: Review[];
  facets: Array<{ label: string; count: number }>;
  photoCount: number;
  socialProof: SocialShot[];
}) {
  const [sort, setSort] = useState<"hottest" | "newest">("hottest");
  const [facet, setFacet] = useState<string>("All");
  const [galleryOpen, setGalleryOpen] = useState(false);
  // Every gallery submission bumps both the photo count and the review total.
  const [submitted, setSubmitted] = useState(0);
  // Which reviews the shopper has marked helpful, so the count bumps live and
  // the vote can be taken back.
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  const sorted = useMemo(() => {
    const list = reviews.filter((r) => facet === "All" || r.tags.includes(facet));
    return sort === "newest"
      ? [...list].sort((a, b) => b.date.localeCompare(a.date))
      : [...list].sort((a, b) => b.helpful - a.helpful);
  }, [reviews, sort, facet]);

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
            Based on {(breakdown.count + submitted).toLocaleString()} reviews
          </p>

          <div className="mt-6 max-w-sm space-y-2.5">
            <Bar label="Quality" value={breakdown.quality} />
            <Bar label="Shipping" value={breakdown.shipping} />
            <Bar label="Service" value={breakdown.service} />
          </div>
        </div>

        {/* Customer photo strip — the whole strip opens the masonry wall. */}
        <button
          type="button"
          onClick={() => setGalleryOpen(true)}
          aria-label={`View all ${photoCount + submitted} customer photos and videos`}
          className="group grid grid-cols-4 gap-3"
        >
          {socialProof.slice(0, 3).map((shot, i) => (
            <div key={shot.id} className="relative overflow-hidden rounded-lg">
              <ProductImage src={shot.src} alt={`Customer photo ${i + 1}`} ratio="1 / 1" />
              {shot.video && (
                <span className="absolute inset-0 grid place-items-center bg-ink/25">
                  <span className="grid size-8 place-items-center rounded-full bg-ink/50 text-paper">
                    <Play size={13} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              )}
            </div>
          ))}
          <div className="relative overflow-hidden rounded-lg">
            <ProductImage src={product.images[0].src} alt="More customer photos" ratio="1 / 1" />
            <span className="absolute inset-0 flex flex-col items-center justify-center bg-ink/65 text-paper transition-colors group-hover:bg-ink/75">
              <span className="text-[1.0625rem] font-medium tabular-nums">
                {(photoCount + submitted).toLocaleString()}
              </span>
              <span className="text-[0.625rem] tracking-[0.12em] text-neutral-200 uppercase">
                view all →
              </span>
            </span>
          </div>
        </button>
      </div>

      <SocialProofGallery
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        title={product.title}
        shots={socialProof}
        onSubmit={() => setSubmitted((s) => s + 1)}
      />

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
              {r.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFacet(t)}
                      className="rounded-full border border-white/12 px-2.5 py-0.5 text-[0.6875rem] text-neutral-400 transition-colors hover:border-gold hover:text-gold"
                    >
                      {t}
                    </button>
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
        {sorted.length === 0 && (
          <li className="py-12 text-center text-[0.9375rem] text-neutral-400">
            No reviews tagged &ldquo;{facet}&rdquo; yet.
          </li>
        )}
      </ul>

      <p className="mt-8 text-center text-[0.75rem] text-neutral-400">
        Reviews shown are illustrative sample content pending our verified-review integration.
      </p>
    </div>
  );
}
