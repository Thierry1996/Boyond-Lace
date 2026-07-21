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

const SLIDES = [
  {
    eyebrow: "Pillar 01 · Supply Chain Mastery",
    title: "Batch-perfect. Every run.",
    body: "Texture, tone, and density measured against the reference batch — your reorder matches the unit in your hand.",
    cta: { label: "The collection", href: "/shop" },
    bg: "radial-gradient(120% 90% at 50% 0%, #5A2D67 0%, #321528 55%, #090909 100%)",
  },
  {
    eyebrow: "Pillar 02 · Private Label Agility",
    title: "Your name. Our floor.",
    body: "Fifty-unit minimums, custom packaging, turnkey assets — Beyond Lace Pro puts salons in the manufacturing seat.",
    cta: { label: "Wholesale programme", href: "/wholesale" },
    bg: "linear-gradient(160deg, #5A2D67 0%, #321528 60%, #090909 100%)",
  },
  {
    eyebrow: "Pillar 03 · Dual Revenue",
    title: "Retail proves. Wholesale steadies.",
    body: "Two channels, one rule: neither undercuts the other. MAP is enforced, not suggested.",
    cta: { label: "Become a partner", href: "/wholesale#apply" },
    bg: "linear-gradient(120deg, #321528 0%, #5A2D67 45%, #A9834D 100%)",
  },
  {
    eyebrow: "Pillar 04 · Data-First",
    title: "Ninety seconds to your unit.",
    body: "Five questions, three ranked matches, and a shade sheet in your inbox. Stop guessing with $800.",
    cta: { label: "Take the quiz", href: "/learn/quiz" },
    bg: "linear-gradient(135deg, #46215A 0%, #5A2D67 30%, #DCA8B7 75%, #C9A66B 100%)",
  },
  {
    eyebrow: "Pillar 05 · The Ambassador Ecosystem",
    title: "Not gifting. Partnership.",
    body: "Three tiers, from micro-affiliate to celebrity stylist — every one trades real value both directions.",
    cta: { label: "The Beyond Circle", href: "/circle" },
    bg: "radial-gradient(120% 100% at 30% 0%, #71407F 0%, #46215A 50%, #321528 100%)",
  },
  {
    eyebrow: "Pillar 06 · Retention Engineering",
    title: "Returns, designed out.",
    body: "A $5 lace test, a monthly care ritual, a private community. The industry loses a third to returns — we don't.",
    cta: { label: "The Lace Test — $5", href: "/product/lace-test-kit" },
    bg: "linear-gradient(165deg, #2A252A 0%, #321528 55%, #090909 100%)",
  },
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
      <div className="relative min-h-[82vh] overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={slide.eyebrow}
            aria-hidden={i !== index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-[1200ms] ease-[var(--ease-editorial)] ${
              i === index ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
            style={{ background: slide.bg }}
          >
            {/* Centred, gilded — per the official wordmark reference. */}
            <div className="mx-auto max-w-4xl px-[6vw] pt-10 pb-24 text-center">
              <p className="eyebrow mb-7 !text-gold-300">{slide.eyebrow}</p>
              <h2
                className="font-[family-name:var(--font-display)] text-[clamp(2.75rem,7vw,6rem)] leading-[1.02]"
                style={{
                  background: "var(--grad-gilded)",
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {slide.title}
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-[#F8F5F1]/75">
                {slide.body}
              </p>
              <Link
                href={slide.cta.href}
                className="mt-10 inline-block border border-gold px-9 py-4 text-[0.8125rem] tracking-[0.14em] text-gold uppercase transition-all duration-500 hover:bg-gold hover:text-ink"
              >
                {slide.cta.label}
              </Link>
            </div>
          </div>
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
              key={s.eyebrow}
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
