"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Crown, ChevronRight } from "lucide-react";

/**
 * "Welcome, Queen" — the Beyond Circle membership banner, cloned from a tested
 * competitor's high-conversion loyalty section and re-skinned to Beyond Lace.
 * A full-bleed, softly animated plum ground (drifting blush/gold blooms + a slow
 * gradient sheen) carries the welcome, a five-tier perk ladder, and a single CTA
 * into the members' space at /circle. Replaces the old proof-before-parcel block;
 * the voice stays aspirational, the mechanic stays the same.
 */

interface Tier {
  name: string;
  color: string;
}

// Entry → signature plum, mirroring the reference ladder in the brand palette.
const TIERS: Tier[] = [
  { name: "Beyond Fan", color: "#d8d2d4" },
  { name: "Bronze Queen", color: "#b87333" },
  { name: "Silver Queen", color: "#c8ced3" },
  { name: "Gold Queen", color: "#c9a66b" },
  { name: "Plum Queen", color: "#a877c0" },
];

export function JoinTheCircle() {
  const reduced = useReducedMotion();

  const float = (dx: number, dy: number, dur: number) =>
    reduced
      ? {}
      : {
          animate: { x: [0, dx, 0], y: [0, dy, 0], scale: [1, 1.12, 1] },
          transition: { duration: dur, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <section
      aria-label="Join the Beyond Circle"
      className="dark-island relative w-full overflow-hidden bg-gradient-to-br from-[#2a1122] via-plum-800 to-[#1a0b16]"
    >
      {/* Animated ground — drifting colour blooms + a slow gilded sheen */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-blush-400/20 blur-3xl"
        {...float(120, 60, 13)}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-32 h-[26rem] w-[26rem] rounded-full bg-gold/15 blur-3xl"
        {...float(-100, -50, 16)}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[22rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-500/20 blur-3xl"
        {...float(60, -30, 18)}
      />
      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(115deg, transparent 30%, rgba(201,166,107,0.14) 48%, transparent 66%)",
            backgroundSize: "220% 220%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <div className="relative mx-auto max-w-[1100px] px-[5vw] py-20 text-center sm:py-24">
        {/* Welcome */}
        <Crown size={34} className="mx-auto mb-5 text-gold" strokeWidth={1.5} />
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(2.4rem,6vw,4.25rem)] leading-[1.02] tracking-[0.04em] text-paper uppercase">
          Welcome, Queen
        </h2>
        <p className="mt-3 text-[0.9375rem] tracking-[0.08em] text-blush-200/80">
          Your Beyond Circle member space
        </p>
        <p className="mt-2 font-[family-name:var(--font-display)] text-[clamp(1.1rem,2.4vw,1.6rem)] text-gold">
          Luxury human hair, beyond the lace.
        </p>

        {/* Tier ladder */}
        <p className="mt-14 text-[0.75rem] font-semibold tracking-[0.2em] text-paper/90 uppercase sm:text-[0.8125rem]">
          The higher the tier, the more perks you get
        </p>
        <div className="mt-8 flex flex-wrap items-start justify-center gap-y-6">
          {TIERS.map((t, i) => (
            <div key={t.name} className="flex items-start">
              <motion.div
                className="flex w-[5.5rem] flex-col items-center gap-2.5 sm:w-28"
                initial={reduced ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-full ring-1 ring-white/15"
                  style={{
                    background: `radial-gradient(circle at 30% 25%, ${t.color}33, transparent 70%)`,
                  }}
                >
                  <Crown
                    size={i === TIERS.length - 1 ? 34 : 28}
                    strokeWidth={1.5}
                    style={{ color: t.color }}
                    className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                  />
                </span>
                <span className="text-[0.75rem] font-medium text-paper/90">{t.name}</span>
              </motion.div>
              {i < TIERS.length - 1 && (
                <ChevronRight size={16} className="mt-4 shrink-0 text-gold/50" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/circle"
          className="mt-12 inline-flex items-center gap-2 rounded-full bg-gold px-12 py-4 text-[0.8125rem] font-semibold tracking-[0.16em] text-ink uppercase shadow-[0_16px_40px_-12px_rgba(201,166,107,0.5)] transition-transform duration-300 hover:-translate-y-0.5"
        >
          Enter the Circle
          <ChevronRight size={16} strokeWidth={2.5} />
        </Link>
      </div>
    </section>
  );
}
