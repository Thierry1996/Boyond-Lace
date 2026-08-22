"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Sticky sidebar promo — a small auto-rotating gallery of promo/product images
 * dropped at public/media/images/sidebar/ (served from /media/images/sidebar/…).
 * Crossfades through them with dots. If a file is missing it's skipped; if none
 * load, an on-brand placeholder keeps the slot visible.
 */
const DEFAULT_IMAGES = [
  "/media/images/sidebar/26-8straight-bob-wig.jpg",
  "/media/images/sidebar/32-11bleach-knots-details-.jpg",
  "/media/images/sidebar/32-3upgrade-hair-texture-bone-stright-bob-wig-sdd-2.webp",
  "/media/images/sidebar/33-10bob-wig-versatile-look.jpg",
  "/media/images/sidebar/33-11bob-wig-different-length-different-effect-min.jpg",
];

export function SidebarPromo({
  images = DEFAULT_IMAGES,
  href = "/sale",
  alt = "Beyond Lace — shop the edit",
  intervalMs = 4000,
}: {
  images?: string[];
  href?: string;
  alt?: string;
  intervalMs?: number;
}) {
  const [idx, setIdx] = useState(0);
  const [failed, setFailed] = useState<Record<number, boolean>>({});
  const liveCount = images.length - Object.keys(failed).length;

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((n) => (n + 1) % images.length), intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs]);

  return (
    <Link
      href={href}
      aria-label={alt}
      className="mt-8 block overflow-hidden rounded-lg ring-1 ring-white/[0.08] transition-all duration-300 hover:ring-gold/50"
    >
      <div className="relative aspect-[4/5] bg-[linear-gradient(150deg,#46215A_0%,#5A2D67_45%,#895898_100%)]">
        {images.map((src, i) =>
          failed[i] ? null : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              aria-hidden={i !== idx}
              onError={() => setFailed((f) => ({ ...f, [i]: true }))}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                i === idx ? "opacity-100" : "opacity-0"
              }`}
            />
          ),
        )}

        {liveCount <= 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <span className="text-[0.625rem] tracking-[0.18em] text-blush-200/80 uppercase">
              Sidebar promo
            </span>
            <span className="text-[0.75rem] leading-snug text-paper/90">
              Drop images in
              <br />
              <code className="text-[0.6875rem] text-gold">/media/images/sidebar/</code>
            </span>
          </div>
        )}

        {liveCount > 1 && (
          <div className="pointer-events-none absolute bottom-2.5 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === idx ? "w-4 bg-gold" : "w-2 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
