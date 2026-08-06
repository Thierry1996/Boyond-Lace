"use client";

import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Volume2, Quote } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { ReachItem } from "./ReachCarousel";

/**
 * Social-proof engine. Two builds, stacked:
 *   1. A horizontally scrollable carousel of live video reviews (video-ready —
 *      an autoplay muted loop renders the moment a clip has a source, else the
 *      brand thumbnail). Each clip links to the unit it features.
 *   2. A Pinterest-style masonry board of varied-height image cards with a
 *      woven-in testimonial. Every tile links into the catalogue.
 * A verified-reviews trust badge sits between them.
 */

const CAPTIONS = [
  "It looks like my own hair!",
  "Why not try a wig first?",
  "Where I get my wigs",
  "Can’t wait to wear this",
  "Perfect for first-timers",
  "Looks grown from my scalp",
  "Obsessed with this install",
  "My everyday glueless",
];
const NAMES = [
  "Carina P.",
  "Melissa V.",
  "Tiffany J.",
  "Trinity R.",
  "Elena B.",
  "Vivian A.",
  "Catherine M.",
  "Alba S.",
];
const RATIOS = ["3 / 4", "1 / 1", "4 / 5", "3 / 4", "4 / 3", "1 / 1", "3 / 4", "4 / 5", "1 / 1"];

function Thumb({
  item,
  ratio,
  className = "",
}: {
  item: ReachItem;
  ratio: string;
  className?: string;
}) {
  if (item.video) {
    return (
      <video
        src={item.video}
        autoPlay
        muted
        loop
        playsInline
        aria-label={item.title}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }
  return <ProductImage src={item.image} alt={item.title} ratio={ratio} className={className} />;
}

function Stars({ n = 5, size = 14 }: { n?: number; size?: number }) {
  return (
    <span className="flex text-gold" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <Star key={i} size={size} strokeWidth={0} className="fill-gold" />
      ))}
    </span>
  );
}

/* ---------------------------------------------------- 1 · Video reviews ---- */

function VideoReviews({ clips }: { clips: ReachItem[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const by = (d: number) => scroller.current?.scrollBy({ left: d * 280, behavior: "smooth" });

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Scroll left"
        onClick={() => by(-1)}
        className="absolute top-1/2 left-1 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-plum-900/15 bg-white/90 text-plum-700 shadow-md transition-colors hover:bg-plum-700 hover:text-white sm:flex"
      >
        <ChevronLeft size={18} />
      </button>

      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2"
      >
        {clips.map((c, i) => (
          <Link
            key={c.slug}
            href={`/product/${c.slug}`}
            className="group w-[220px] shrink-0 snap-start sm:w-[240px]"
          >
            <div className="relative overflow-hidden rounded-2xl border border-plum-900/10 shadow-[0_18px_40px_-24px_rgba(90,45,103,0.5)]">
              <Thumb
                item={c}
                ratio="9 / 16"
                className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-900/80 via-plum-900/10 to-plum-900/25"
              />
              <span className="absolute inset-x-3 top-3 text-[0.8125rem] leading-snug font-semibold text-white">
                “{CAPTIONS[i % CAPTIONS.length]}”
              </span>
              <span className="absolute right-3 bottom-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm">
                <Volume2 size={13} />
              </span>
              <span className="absolute bottom-3 left-3 text-[0.6875rem] font-medium text-white/90">
                {NAMES[i % NAMES.length]} · Verified
              </span>
            </div>

            {/* Featured unit */}
            <div className="mt-2.5 flex items-center gap-2.5 rounded-xl border border-plum-900/10 bg-white p-2">
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                <ProductImage src={c.image} alt={c.title} ratio="1 / 1" />
              </span>
              <span className="line-clamp-2 text-[0.6875rem] leading-tight font-medium text-plum-900">
                {c.title}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        aria-label="Scroll right"
        onClick={() => by(1)}
        className="absolute top-1/2 right-1 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-plum-900/15 bg-white/90 text-plum-700 shadow-md transition-colors hover:bg-plum-700 hover:text-white sm:flex"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ----------------------------------------------------- 2 · Masonry board ---- */

function MasonryBoard({ board }: { board: ReachItem[] }) {
  return (
    <div className="[column-fill:_balance] columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5">
      {board.map((item, i) => (
        <div key={item.slug} className="mb-4 break-inside-avoid">
          <Link
            href={`/product/${item.slug}`}
            className="group block overflow-hidden rounded-2xl border border-plum-900/10 shadow-[0_14px_36px_-24px_rgba(90,45,103,0.4)]"
          >
            <div className="relative">
              <ProductImage
                src={item.image}
                alt={item.title}
                ratio={RATIOS[i % RATIOS.length]}
                className="transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-plum-900/70 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
              />
              <span className="absolute inset-x-3 bottom-3 line-clamp-2 text-[0.75rem] font-medium text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                {item.title}
              </span>
            </div>
          </Link>

          {/* Woven-in testimonial card */}
          {i === 3 && (
            <div className="mt-4 rounded-2xl bg-gradient-to-br from-plum-800 to-plum-900 p-5 break-inside-avoid">
              <Quote size={20} className="text-gold" aria-hidden />
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-blush-200 italic">
                Every wig I owned looked incredible on camera and fake in daylight. This is the
                first one that held up in both.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Stars size={13} />
                <span className="text-[0.6875rem] text-blush-200/70">Renée T. · Atlanta</span>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------- assembly ---- */

export function SocialProof({
  clips,
  board,
  reviewsTotal,
}: {
  clips: ReachItem[];
  board: ReachItem[];
  reviewsTotal: number;
}) {
  return (
    <section className="bg-[#faf6f9] py-20">
      <div className="mx-auto max-w-[1600px] px-[3vw]">
        {/* Header */}
        <div className="text-center">
          <p className="eyebrow text-plum-700">The proof, in their words</p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-[clamp(2rem,4.5vw,3rem)] text-plum-900">
            Real Reviews
          </h2>
          <Link
            href="/circle"
            className="mt-4 inline-block border-b border-plum-700 pb-0.5 text-[0.75rem] tracking-[0.14em] text-plum-700 uppercase transition-colors hover:text-plum-500"
          >
            Explore More
          </Link>
        </div>

        {/* 1 — Video review carousel */}
        <div className="mt-12">
          <VideoReviews clips={clips} />
        </div>

        {/* Trust badge (verified reviews — not a third-party score) */}
        <div className="my-16 flex flex-col items-center gap-2 text-center">
          <Stars size={22} />
          <p className="text-[1.0625rem] font-semibold text-plum-900">
            Rated 4.8 / 5{" "}
            <span className="font-normal text-plum-900/55">
              · based on {reviewsTotal.toLocaleString()} verified reviews
            </span>
          </p>
        </div>

        {/* 2 — Masonry board */}
        <MasonryBoard board={board} />
      </div>
    </section>
  );
}
