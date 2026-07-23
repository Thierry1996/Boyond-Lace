"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Heart, X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { Tutorial } from "@/lib/tutorials";

/**
 * Tutorial video carousel. A horizontally scrolling, snapping row of guide
 * cards driven by chevron arrows and page dots. Every card is interactive:
 * likes toggle optimistically, and the play button opens a lightbox for the
 * guide (poster + placeholder player until real video lands).
 *
 * Navigation is scroll-position driven rather than an index counter, so it
 * stays correct however many cards fit the viewport at a given width — the
 * arrows page by a viewport width and disable at the ends, and the dots map to
 * scroll pages.
 */
export function TutorialCarousel({ tutorials }: { tutorials: Tutorial[] }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [page, setPage] = useState(0);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<Tutorial | null>(null);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setAtStart(scrollLeft < 8);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 8);
    const pages = Math.max(1, Math.ceil(scrollWidth / clientWidth));
    setPageCount(pages);
    setPage(Math.round(scrollLeft / clientWidth));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);

  function scrollByPage(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  }

  function scrollToPage(p: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: p * el.clientWidth, behavior: "smooth" });
  }

  const toggleLike = (id: string) => setLiked((prev) => ({ ...prev, [id]: !prev[id] }));

  // Close the lightbox on Escape.
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  return (
    <div className="mx-auto max-w-[1440px] px-[4vw]">
      {/* Heading + arrows */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-5">
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,3vw,2.5rem)] text-paper">
          Tutorials
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={atStart}
            aria-label="Previous tutorials"
            className="grid size-10 place-items-center rounded-full border border-white/15 text-neutral-200 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={18} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={atEnd}
            aria-label="Next tutorials"
            className="grid size-10 place-items-center rounded-full border border-white/15 text-neutral-200 transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={18} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Track */}
      <ul
        ref={trackRef}
        className="no-scrollbar mt-8 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2"
      >
        {tutorials.map((t) => {
          const isLiked = liked[t.id];
          const likeCount = t.likes + (isLiked ? 1 : 0);
          return (
            <li
              key={t.id}
              className="w-[min(78vw,20rem)] shrink-0 snap-start sm:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-4.5rem)/4)]"
            >
              <div className="group relative aspect-[3/4] overflow-hidden rounded-lg">
                <ProductImage
                  src={t.poster}
                  alt={`${t.title} — ${t.subtitle}`}
                  ratio="3 / 4"
                  className="h-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                />

                {/* Like — toggles optimistically */}
                <button
                  type="button"
                  onClick={() => toggleLike(t.id)}
                  aria-pressed={isLiked}
                  aria-label={isLiked ? "Unlike" : "Like"}
                  className="absolute top-3.5 right-3.5 z-[2] inline-flex items-center gap-1.5 rounded-full bg-ink/50 px-3 py-1.5 text-[0.8125rem] text-paper backdrop-blur-sm transition-colors hover:bg-ink/70"
                >
                  <Heart
                    size={14}
                    strokeWidth={1.75}
                    className={isLiked ? "text-gold" : "text-paper"}
                    fill={isLiked ? "currentColor" : "none"}
                  />
                  <span className="tabular-nums">{likeCount}</span>
                </button>

                {/* Play — opens the lightbox */}
                <button
                  type="button"
                  onClick={() => setActive(t)}
                  aria-label={`Play ${t.title}`}
                  className="absolute inset-0 z-[1] grid place-items-center"
                >
                  <span className="grid size-14 place-items-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink">
                    <Play size={20} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                  </span>
                </button>

                {/* Title block */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] bg-gradient-to-t from-ink/85 to-transparent p-5 pt-14">
                  <p className="font-[family-name:var(--font-display)] text-[1.0625rem] leading-tight tracking-wide text-paper uppercase">
                    {t.title}
                  </p>
                  <span className="mt-1 block h-px w-10 bg-gold/60" />
                  <p className="mt-2 text-[0.8125rem] text-neutral-200 italic">{t.subtitle}</p>
                </div>

                {/* Duration */}
                <span className="absolute bottom-3.5 right-3.5 z-[2] rounded bg-ink/60 px-1.5 py-0.5 text-[0.6875rem] text-paper tabular-nums backdrop-blur-sm">
                  {t.duration}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Page dots */}
      {pageCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2.5">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={page === i}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                page === i ? "w-8 bg-gold" : "w-4 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/80 p-[5vw] backdrop-blur-sm"
          style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-island relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-[2] grid size-9 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:text-gold"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            <div className="relative aspect-video">
              <ProductImage
                src={active.poster}
                alt={active.title}
                ratio="16 / 9"
                className="h-full"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid size-16 place-items-center rounded-full bg-gold text-ink">
                  <Play size={24} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                </span>
              </span>
            </div>
            <div className="p-6">
              <p className="font-[family-name:var(--font-display)] text-2xl text-paper">
                {active.title}
              </p>
              <p className="mt-1 text-[0.9375rem] text-neutral-400 italic">{active.subtitle}</p>
              <p className="mt-4 text-[0.75rem] text-neutral-400">
                Video guides are illustrative placeholders pending our tutorial library.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
