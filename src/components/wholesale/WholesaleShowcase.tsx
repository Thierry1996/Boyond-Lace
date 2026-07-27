"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";

/**
 * Video showcase — play tiles over on-brand gradient posters that open a
 * lightbox. No footage exists yet (the photographic system is locked to hair,
 * ProductImage.tsx), so the poster is a gradient field and the lightbox states
 * plainly that the reel is a placeholder pending the shoot. Used both for the
 * single factory feature and the multi-tile live product wall.
 */

export interface ShowcaseItem {
  src: string;
  label: string;
  note: string;
  ratio?: string;
}

export function WholesaleShowcase({
  items,
  variant = "grid",
}: {
  items: ShowcaseItem[];
  variant?: "grid" | "feature";
}) {
  const [open, setOpen] = useState<ShowcaseItem | null>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const gridClass =
    variant === "feature" ? "grid gap-6" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <>
      <div className={gridClass}>
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => setOpen(item)}
            className="group relative block w-full overflow-hidden rounded-lg text-left"
          >
            <ProductImage
              src={item.src}
              alt={item.label}
              ratio={item.ratio ?? (variant === "feature" ? "16 / 9" : "4 / 5")}
              className="transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid size-14 place-items-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                <Play size={20} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
              </span>
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/85 to-transparent p-5 pt-12">
              <span className="block text-[0.9375rem] text-paper">{item.label}</span>
              <span className="mt-0.5 block text-[0.75rem] text-neutral-300">{item.note}</span>
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[95] grid place-items-center bg-ink/90 p-[5vw] backdrop-blur-sm"
          onClick={() => setOpen(null)}
          style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-island relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900"
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-[2] grid size-9 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:text-gold"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            <div className="relative aspect-video">
              <ProductImage src={open.src} alt={open.label} ratio="16 / 9" className="h-full" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid size-16 place-items-center rounded-full bg-gold text-ink">
                  <Play size={24} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                </span>
              </span>
            </div>
            <div className="px-6 py-5">
              <p className="text-[0.9375rem] text-paper">{open.label}</p>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-neutral-400">{open.note}</p>
              <p className="mt-3 text-[0.6875rem] text-neutral-400">
                Video is an illustrative placeholder pending our factory and product shoot.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
