"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, Expand } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Product gallery — a vertical rail of eight 1:1 thumbnails to the left of a
 * tall main viewer. The main image swipes with chevrons; one slide is the
 * product video, which plays in a lightbox. The whole gallery is meant to be
 * wrapped in a sticky container by the PDP so it holds while the details column
 * beside it scrolls.
 *
 * Real photography and video are not shot yet, so slots beyond the supplied
 * images are on-brand gradient placeholders — the interaction is real, the
 * media is provisional.
 */

const FILLER_POSTERS = ["velvet", "plum", "aurora", "blush", "gold", "mono", "mono-2"];
const THUMB_COUNT = 8;
/** Which slide is the product video. */
const VIDEO_INDEX = 2;

interface Slide {
  src: string;
  alt: string;
  video: boolean;
}

export function ProductGallery({
  images,
  title,
}: {
  images: Array<{ src: string; alt: string }>;
  title: string;
}) {
  // Build exactly eight slides: the real images first, then gradient fillers.
  const slides: Slide[] = Array.from({ length: THUMB_COUNT }, (_, i) => {
    const real = images[i];
    return {
      src: real?.src ?? FILLER_POSTERS[i % FILLER_POSTERS.length],
      alt: real?.alt ?? `${title} — view ${i + 1}`,
      video: i === VIDEO_INDEX,
    };
  });

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const go = (dir: 1 | -1) => setCurrent((c) => (c + dir + slides.length) % slides.length);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, slides.length]);

  const active = slides[current];

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Thumbnail rail — eight 1:1 squares, vertical, to the left */}
      <div className="flex w-14 shrink-0 flex-col gap-3 sm:w-16 lg:w-[4.5rem]">
        {slides.map((s, i) => {
          const selected = i === current;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`View ${i + 1}${s.video ? " (video)" : ""}`}
              aria-current={selected}
              className={`relative overflow-hidden rounded-md border transition-colors duration-300 ${
                selected ? "border-gold" : "border-white/12 hover:border-white/40"
              }`}
            >
              <ProductImage src={s.src} alt={s.alt} ratio="1 / 1" />
              {s.video && (
                <span className="absolute inset-0 grid place-items-center bg-ink/30">
                  <Play size={12} strokeWidth={2} className="text-paper" fill="currentColor" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main viewer */}
      <div className="group relative min-w-0 flex-1">
        <div className="overflow-hidden rounded-lg">
          <ProductImage src={active.src} alt={active.alt} ratio="4 / 5" />
        </div>

        {/* Prev / next */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous image"
          className="absolute top-1/2 left-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink group-hover:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next image"
          className="absolute top-1/2 right-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink group-hover:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>

        {/* Video play OR zoom, depending on the slide */}
        {active.video ? (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Play product video"
            className="absolute inset-0 z-[1] grid place-items-center"
          >
            <span className="grid size-16 place-items-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink">
              <Play size={24} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Expand image"
            className="absolute right-3 bottom-3 z-[2] grid size-9 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:text-gold group-hover:opacity-100"
          >
            <Expand size={16} strokeWidth={1.75} />
          </button>
        )}

        {/* Counter */}
        <span className="absolute bottom-3 left-3 z-[2] rounded bg-ink/55 px-2 py-0.5 text-[0.6875rem] text-paper tabular-nums backdrop-blur-sm">
          {current + 1} / {slides.length}
        </span>
      </div>

      {/* Lightbox — video player or full image, with the same chevrons */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.video ? `${title} video` : `${title} image`}
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-[95] flex items-center justify-center bg-ink/85 p-[5vw] backdrop-blur-sm"
          style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-island relative w-full max-w-4xl overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900"
          >
            <button
              type="button"
              onClick={() => setLightbox(false)}
              aria-label="Close"
              className="absolute top-4 right-4 z-[3] grid size-9 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:text-gold"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            <div className="relative aspect-[4/5] max-h-[80vh] sm:aspect-video">
              <ProductImage src={active.src} alt={active.alt} ratio="16 / 9" className="h-full" />
              {active.video && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-gold text-ink">
                    <Play size={24} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              )}
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous"
                className="absolute top-1/2 left-4 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper hover:bg-gold hover:text-ink"
              >
                <ChevronLeft size={18} strokeWidth={1.75} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next"
                className="absolute top-1/2 right-4 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper hover:bg-gold hover:text-ink"
              >
                <ChevronRight size={18} strokeWidth={1.75} />
              </button>
            </div>
            {active.video && (
              <p className="px-6 py-4 text-[0.75rem] text-neutral-400">
                Product video is an illustrative placeholder pending our media shoot.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
