"use client";

import { useEffect, useState } from "react";

/**
 * Breakpoint-driven item count for the home carousels, so a rail shows a sane
 * number of cards on every screen — two on a phone, up to six on a 4K panel —
 * instead of a fixed count that crushes cards on mobile or wastes space on wide
 * displays.
 *
 * `steps` are ascending `{ min, count }` pairs (min = min viewport width in px).
 * The hook returns the count of the largest step whose `min` ≤ the viewport.
 * SSR-safe: it renders the top (widest) count on the server and the first client
 * paint, then settles to the real one after mount — so hydration never mismatches.
 */
export function useResponsiveCount(steps: { min: number; count: number }[]): number {
  const top = steps[steps.length - 1]?.count ?? 1;
  const [count, setCount] = useState(top);

  useEffect(() => {
    const pick = () => {
      const w = window.innerWidth;
      let c = steps[0]?.count ?? 1;
      for (const s of steps) if (w >= s.min) c = s.count;
      setCount(c);
    };
    pick();
    window.addEventListener("resize", pick, { passive: true });
    return () => window.removeEventListener("resize", pick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return count;
}
