"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, X, Expand } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Product gallery — a vertical rail of thumbnails to the left of a tall main
 * viewer. Real product photography and (when supplied) a real product video are
 * shown; the main image magnifies under the cursor, and any slide expands into a
 * lightbox. When a product carries no video, no video slide is shown.
 */

const FILLER_POSTERS = ["velvet", "plum", "aurora", "blush", "gold", "mono", "mono-2"];
const MIN_SLIDES = 6;
/** How far the main image magnifies on hover. */
const ZOOM = 2.1;

interface Slide {
  src: string;
  alt: string;
  video?: string;
}

export function ProductGallery({
  images,
  title,
  video,
}: {
  images: Array<{ src: string; alt: string }>;
  title: string;
  video?: string;
}) {
  // Real images first; pad up to a tidy minimum with on-brand gradient posters.
  const imageSlides: Slide[] = Array.from(
    { length: Math.max(MIN_SLIDES, Math.min(images.length, 8)) },
    (_, i) => {
      const real = images[i];
      return {
        src: real?.src ?? FILLER_POSTERS[i % FILLER_POSTERS.length],
        alt: real?.alt ?? `${title} — view ${i + 1}`,
      };
    },
  );
  // The video, when present, rides as its own slide (poster = first real image).
  const slides: Slide[] = video
    ? [
        imageSlides[0],
        { src: images[0]?.src ?? imageSlides[0].src, alt: `${title} — video`, video },
        ...imageSlides.slice(1),
      ]
    : imageSlides;

  const [current, setCurrent] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [zooming, setZooming] = useState(false);

  const go = (dir: 1 | -1) => {
    setZooming(false);
    setCurrent((c) => (c + dir + slides.length) % slides.length);
  };

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

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };

  return (
    <div className="flex gap-3 sm:gap-4">
      {/* Thumbnail rail */}
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
        {active.video ? (
          <div className="overflow-hidden rounded-lg bg-ink">
            <video
              key={active.video}
              src={active.video}
              poster={/^https?:/.test(active.src) ? active.src : undefined}
              controls
              playsInline
              preload="metadata"
              className="aspect-[4/5] w-full bg-ink object-cover"
            />
          </div>
        ) : (
          <div
            className="relative cursor-zoom-in overflow-hidden rounded-lg"
            onMouseEnter={() => setZooming(true)}
            onMouseLeave={() => setZooming(false)}
            onMouseMove={onMove}
            onClick={() => setLightbox(true)}
          >
            <div
              className="transition-transform duration-200 ease-out"
              style={{ transform: zooming ? `scale(${ZOOM})` : "scale(1)", transformOrigin: origin }}
            >
              <ProductImage src={active.src} alt={active.alt} ratio="4 / 5" />
            </div>
          </div>
        )}

        {/* Prev / next */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous"
          className="absolute top-1/2 left-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink group-hover:opacity-100"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next"
          className="absolute top-1/2 right-3 z-[2] grid size-10 -translate-y-1/2 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-gold hover:text-ink group-hover:opacity-100"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </button>

        {/* Expand — images only (the video has its own controls) */}
        {!active.video && (
          <button
            type="button"
            onClick={() => setLightbox(true)}
            aria-label="Expand image"
            className="absolute right-3 bottom-3 z-[2] grid size-9 place-items-center rounded-full bg-ink/50 text-paper opacity-0 backdrop-blur-sm transition-all duration-300 hover:text-gold group-hover:opacity-100"
          >
            <Expand size={16} strokeWidth={1.75} />
          </button>
        )}

        <span className="pointer-events-none absolute bottom-3 left-3 z-[2] rounded bg-ink/55 px-2 py-0.5 text-[0.6875rem] text-paper tabular-nums backdrop-blur-sm">
          {current + 1} / {slides.length}
        </span>
      </div>

      {/* Lightbox — real video or full image */}
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
            {active.video ? (
              <video
                src={active.video}
                poster={/^https?:/.test(active.src) ? active.src : undefined}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] w-full bg-ink"
              />
            ) : (
              <div className="relative aspect-[4/5] max-h-[80vh] sm:aspect-video">
                <ProductImage src={active.src} alt={active.alt} ratio="16 / 9" className="h-full" />
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}
