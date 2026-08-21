"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Price refine — a draggable dual-range slider AND two editable inputs, kept in
 * sync. Server components can't own input state, so this small client control
 * reads min/max from the URL, lets the shopper drag the thumbs or type a value,
 * and pushes an updated query that preserves every other active filter.
 * Dragging applies on release; typing applies on Enter/blur or the button.
 */
const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n));

export function PriceFilter({ floor, ceil }: { floor: number; ceil: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const urlMin = params.get("min");
  const urlMax = params.get("max");
  const [lo, setLo] = useState(clamp(urlMin ? Number(urlMin) : floor, floor, ceil));
  const [hi, setHi] = useState(clamp(urlMax ? Number(urlMax) : ceil, floor, ceil));

  function apply(nextLo = lo, nextHi = hi) {
    const p = new URLSearchParams(params.toString());
    if (Math.round(nextLo) > floor) p.set("min", String(Math.round(nextLo)));
    else p.delete("min");
    if (Math.round(nextHi) < ceil) p.set("max", String(Math.round(nextHi)));
    else p.delete("max");
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const span = Math.max(1, ceil - floor);
  const leftPct = clamp(((lo - floor) / span) * 100, 0, 100);
  const rightPct = clamp(((hi - floor) / span) * 100, 0, 100);

  const thumb =
    "[&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-ink [&::-webkit-slider-thumb]:bg-gold [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-ink [&::-moz-range-thumb]:bg-gold";

  return (
    <div>
      {/* Draggable dual-range */}
      <div className="relative mb-5 h-4">
        <span className="pointer-events-none absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-white/12" />
        <span
          className="pointer-events-none absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-gold"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          min={floor}
          max={ceil}
          value={lo}
          onChange={(e) => setLo(Math.min(Number(e.target.value), hi))}
          onPointerUp={() => apply()}
          onKeyUp={(e) => e.key.startsWith("Arrow") && apply()}
          className={`pointer-events-none absolute inset-0 m-0 h-full w-full appearance-none bg-transparent focus:outline-none ${thumb}`}
        />
        <input
          type="range"
          aria-label="Maximum price"
          min={floor}
          max={ceil}
          value={hi}
          onChange={(e) => setHi(Math.max(Number(e.target.value), lo))}
          onPointerUp={() => apply()}
          onKeyUp={(e) => e.key.startsWith("Arrow") && apply()}
          className={`pointer-events-none absolute inset-0 m-0 h-full w-full appearance-none bg-transparent focus:outline-none ${thumb}`}
        />
      </div>

      {/* Editable inputs */}
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="sr-only">Minimum price</span>
          <div className="flex items-center gap-1 border border-white/15 px-3 py-2 focus-within:border-gold">
            <span className="text-[0.8125rem] text-neutral-400">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={floor}
              max={ceil}
              value={Math.round(lo)}
              onChange={(e) => setLo(clamp(Number(e.target.value) || floor, floor, hi))}
              onBlur={() => apply()}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="w-full bg-transparent text-[0.875rem] text-paper tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>
        <span className="text-neutral-400">–</span>
        <label className="flex-1">
          <span className="sr-only">Maximum price</span>
          <div className="flex items-center gap-1 border border-white/15 px-3 py-2 focus-within:border-gold">
            <span className="text-[0.8125rem] text-neutral-400">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={floor}
              max={ceil}
              value={Math.round(hi)}
              onChange={(e) => setHi(clamp(Number(e.target.value) || ceil, lo, ceil))}
              onBlur={() => apply()}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="w-full bg-transparent text-[0.875rem] text-paper tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={() => apply()}
        className="mt-4 w-full border border-gold/50 py-2 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
      >
        Apply price
      </button>
    </div>
  );
}
