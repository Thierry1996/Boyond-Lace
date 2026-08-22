"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BadgeCheck, Truck, RotateCcw, CreditCard } from "lucide-react";

/**
 * Homepage hero — a six-slide carousel, one slide per Empire Pillar, with the
 * slide text centred and rendered in the gilded-gold display serif per the
 * official logo reference. Slide fields are brand-gradient stand-ins until the
 * photographic system (hair only) delivers; swap `bg` for CDN images then.
 */

/**
 * Full designed hero banners (Canva art, ~1440×450). Each is shown edge-to-edge
 * as its own slide — no overlay text, since the artwork carries its own message —
 * and the whole banner links to a destination. Drop replacements/new ones in
 * public/media/images/hero and add a row here.
 */
const SLIDES = [
  { image: "/media/images/hero/hero-image-1.svg", href: "/shop", alt: "Beyond Lace human hair wig collection" },
  { image: "/media/images/hero/hero-image-2.svg", href: "/wholesale", alt: "Beyond Lace wholesale hair programme" },
  { image: "/media/images/hero/hero-image-3.svg", href: "/wholesale#apply", alt: "Beyond Lace partner programme" },
  { image: "/media/images/hero/hero-image-4.svg", href: "/circle", alt: "The Beyond Circle ambassador community" },
  { image: "/media/images/hero/hero-image-5.svg", href: "/product/lace-test-kit", alt: "Beyond Lace $5 lace test kit" },
];

const BENEFITS = [
  { icon: BadgeCheck, label: "100% Virgin Remy Human Hair" },
  { icon: Truck, label: "Free Worldwide Shipping $400+" },
  { icon: RotateCcw, label: "30-Day Returns, Lace Uncut" },
  { icon: CreditCard, label: "$5 Lace Test — Fully Redeemable" },
];

const INTERVAL_MS = 6500;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  const go = useCallback((next: number) => {
    setIndex(((next % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  // Always auto-advances — no hover pause, no reduced-motion gate. The fade
  // is gentle enough to keep, and a hero that stops reads as broken.
  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section aria-label="Beyond Lace highlights">
      <div className="grain relative aspect-[1440/450] overflow-hidden bg-plum-900">
        {SLIDES.map((slide, i) => (
          <Link
            key={slide.image}
            href={slide.href}
            aria-hidden={i !== index}
            aria-label={slide.alt}
            className={`absolute inset-0 block transition-opacity duration-[1200ms] ease-[var(--ease-editorial)] ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={slide.image} alt={slide.alt} className="h-full w-full object-cover" />
          </Link>
        ))}

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => go(index - 1)}
          className="absolute top-1/2 left-[3vw] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => go(index + 1)}
          className="absolute top-1/2 right-[3vw] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/40 text-gold backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>

        {/* Dots */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {SLIDES.map((s, i) => (
            <button
              key={s.image}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className={`h-[3px] transition-all duration-500 ${
                i === index ? "w-8 bg-gold" : "w-4 bg-[#F8F5F1]/25 hover:bg-[#F8F5F1]/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Benefits band — gilded strip, per the reference layout. */}
      <div style={{ background: "var(--grad-gilded)" }}>
        <div className="mx-auto grid max-w-[1440px] grid-cols-2 divide-x divide-ink/15 px-[2vw] lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.label} className="flex items-center justify-center gap-3 px-3 py-4">
              <b.icon size={18} strokeWidth={1.5} className="shrink-0 text-ink" />
              <span className="text-[0.8125rem] font-medium text-ink">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
