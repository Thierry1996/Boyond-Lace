"use client";

import { useEffect, useState } from "react";
import { X, Play, Plus, ImagePlus, Loader2 } from "lucide-react";
import { ProductImage } from "@/components/ui/ProductImage";
import type { SocialShot } from "@/lib/commerce";

/**
 * Social-proof gallery — a magazine masonry wall of customer photos and videos.
 *
 * Opens as an overlay from the reviews section ("view more"), and lazy-loads its
 * content on open (a brief loading pass, then the wall) so nothing renders until
 * the shopper asks for it. Video tiles play in a nested lightbox.
 *
 * New testimonials are directed here: the submit composer prepends the shot to
 * the wall optimistically and calls `onSubmit`, which the reviews section uses
 * to bump both the photo count and the review total on every upload. Uploads
 * are local demo submissions until the community backend lands.
 */
export function SocialProofGallery({
  open,
  onClose,
  title,
  shots,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  shots: SocialShot[];
  onSubmit: () => void;
}) {
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState<SocialShot[]>([]);
  const [lightbox, setLightbox] = useState<SocialShot | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);

  // Lazy "load" on open, and lock the body scroll behind the overlay.
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (lightbox) setLightbox(null);
      else if (composerOpen) setComposerOpen(false);
      else onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lightbox, composerOpen, onClose]);

  if (!open) return null;

  const all = [...added, ...shots];

  function submit(kind: "photo" | "video") {
    // Prepend the new submission and bump the counts on every upload.
    const shot: SocialShot = {
      id: `mine-${Date.now()}`,
      src: ["aurora", "blush", "velvet", "gold"][added.length % 4],
      ratio: kind === "video" ? "3 / 5" : "4 / 5",
      video: kind === "video",
    };
    setAdded((a) => [shot, ...a]);
    onSubmit();
    setComposerOpen(false);
  }

  return (
    <div
      className="fixed inset-0 z-[96] overflow-y-auto bg-ink/95 backdrop-blur-sm"
      style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-[2] border-b border-white/[0.08] bg-ink/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-[4vw] py-4">
          <div>
            <p className="eyebrow text-gold">Social proof</p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.25rem,2.4vw,1.875rem)] text-paper">
              {title} — in the wild
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.8125rem] text-neutral-400 tabular-nums sm:inline">
              {all.length} shots
            </span>
            <button
              type="button"
              onClick={() => setComposerOpen(true)}
              className="cta-primary px-5 py-2.5 text-[0.75rem] tracking-[0.12em] uppercase"
            >
              <span className="inline-flex items-center gap-1.5">
                <ImagePlus size={14} strokeWidth={1.75} />
                Share yours
              </span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close gallery"
              className="grid size-9 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-gold"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </div>

      {/* Masonry */}
      <div className="mx-auto max-w-[1600px] px-[4vw] py-8">
        {loading ? (
          <div className="grid place-items-center py-32 text-neutral-400">
            <Loader2 size={24} strokeWidth={1.75} className="animate-spin text-gold" />
            <p className="mt-3 text-[0.8125rem]">Loading the wall…</p>
          </div>
        ) : (
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 xl:columns-5 [&>*]:mb-4">
            {all.map((shot) => (
              <button
                key={shot.id}
                type="button"
                onClick={() => (shot.video ? setLightbox(shot) : setLightbox(shot))}
                className="group relative block w-full break-inside-avoid overflow-hidden rounded-lg"
              >
                <div style={{ aspectRatio: shot.ratio }}>
                  <ProductImage
                    src={shot.src}
                    alt={`${title} customer photo`}
                    ratio={shot.ratio}
                    className="h-full transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                </div>
                {shot.video && (
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-ink/45 text-paper backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <Play size={18} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                    </span>
                  </span>
                )}
                {shot.id.startsWith("mine-") && (
                  <span className="absolute top-2 left-2 rounded-full bg-gold px-2 py-0.5 text-[0.5625rem] tracking-[0.1em] text-ink uppercase">
                    Yours
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Submit composer */}
      {composerOpen && (
        <div
          className="fixed inset-0 z-[3] grid place-items-center bg-ink/70 p-[5vw]"
          onClick={() => setComposerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-island w-full max-w-md rounded-2xl border border-gold/25 bg-neutral-900 p-7"
            style={{ animation: "blMenuIn 360ms cubic-bezier(0.16,1,0.3,1)" }}
          >
            <p className="eyebrow mb-2 text-gold">Add your look</p>
            <h3 className="font-[family-name:var(--font-display)] text-xl text-paper">
              Share how it turned out
            </h3>
            <p className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-400">
              Your photo or video joins the wall and counts toward this unit&apos;s reviews once it
              clears a quick review.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => submit("photo")}
                className="flex flex-col items-center gap-2 rounded-lg border border-white/15 py-6 text-neutral-200 transition-colors hover:border-gold hover:text-gold"
              >
                <ImagePlus size={22} strokeWidth={1.5} />
                <span className="text-[0.8125rem]">Add a photo</span>
              </button>
              <button
                type="button"
                onClick={() => submit("video")}
                className="flex flex-col items-center gap-2 rounded-lg border border-white/15 py-6 text-neutral-200 transition-colors hover:border-gold hover:text-gold"
              >
                <Play size={22} strokeWidth={1.5} />
                <span className="text-[0.8125rem]">Add a video</span>
              </button>
            </div>
            <p className="mt-4 text-[0.6875rem] text-neutral-400">
              Demo upload — real submissions attach media once the community feature is live.
            </p>
          </div>
        </div>
      )}

      {/* Media lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[4] grid place-items-center bg-ink/90 p-[5vw]"
          onClick={() => setLightbox(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="dark-island relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gold/25 bg-neutral-900"
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute top-4 right-4 z-[2] grid size-9 place-items-center rounded-full bg-ink/60 text-paper transition-colors hover:text-gold"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
            <div className="relative aspect-[3/4] max-h-[80vh] sm:aspect-video">
              <ProductImage
                src={lightbox.src}
                alt={`${title} customer media`}
                ratio="16 / 9"
                className="h-full"
              />
              {lightbox.video && (
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid size-16 place-items-center rounded-full bg-gold text-ink">
                    <Play size={24} strokeWidth={1.75} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              )}
            </div>
            {lightbox.video && (
              <p className="px-6 py-4 text-[0.75rem] text-neutral-400">
                Customer video is an illustrative placeholder pending the community upload feature.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/** Small trigger tile used inside the reviews photo strip. */
export function SocialProofTrigger({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative grid place-items-center overflow-hidden rounded-lg bg-plum-900 text-paper"
      style={{ aspectRatio: "1 / 1" }}
    >
      <span className="flex flex-col items-center gap-1">
        <Plus size={20} strokeWidth={1.75} className="text-gold" />
        <span className="text-[0.8125rem] font-medium tabular-nums">{count}</span>
        <span className="text-[0.625rem] tracking-[0.1em] text-neutral-400 uppercase">photos</span>
      </span>
    </button>
  );
}
