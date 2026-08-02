"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Price refine — two bound inputs plus a visual range bar. Server components
 * cannot own input state, so this small client control reads the current
 * min/max from the URL, lets the shopper edit them, and pushes an updated query
 * that preserves every other active filter. The bar is presentational; the
 * inputs are the source of truth.
 */
export function PriceFilter({ floor, ceil }: { floor: number; ceil: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const [min, setMin] = useState(params.get("min") ?? "");
  const [max, setMax] = useState(params.get("max") ?? "");

  function apply() {
    const p = new URLSearchParams(params.toString());
    const setOrDel = (k: string, v: string) => (v.trim() ? p.set(k, v.trim()) : p.delete(k));
    setOrDel("min", min);
    setOrDel("max", max);
    const qs = p.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  const lo = min ? Number(min) : floor;
  const hi = max ? Number(max) : ceil;
  const span = Math.max(1, ceil - floor);
  const leftPct = Math.min(100, Math.max(0, ((lo - floor) / span) * 100));
  const rightPct = Math.min(100, Math.max(0, ((hi - floor) / span) * 100));

  return (
    <div>
      <div className="flex items-center gap-3">
        <label className="flex-1">
          <span className="sr-only">Minimum price</span>
          <div className="flex items-center gap-1 border border-white/15 px-3 py-2 focus-within:border-gold">
            <span className="text-[0.8125rem] text-neutral-400">$</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={String(floor)}
              value={min}
              onChange={(e) => setMin(e.target.value)}
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
              min={0}
              placeholder={String(ceil)}
              value={max}
              onChange={(e) => setMax(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && apply()}
              className="w-full bg-transparent text-[0.875rem] text-paper tabular-nums focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </label>
      </div>

      <div className="relative mt-4 h-[3px] rounded-full bg-white/12">
        <span
          className="absolute top-0 h-full rounded-full bg-gold"
          style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
        />
      </div>

      <button
        type="button"
        onClick={apply}
        className="mt-4 w-full border border-gold/50 py-2 text-[0.75rem] tracking-[0.12em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
      >
        Apply price
      </button>
    </div>
  );
}
