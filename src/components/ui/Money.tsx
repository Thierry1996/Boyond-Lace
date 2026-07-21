"use client";

import { useCurrency } from "@/lib/stores/currency";
import { convertAndFormat, getCurrency } from "@/lib/currency";
import { formatPrice } from "@/lib/commerce";

/**
 * Renders a USD-authored price (minor units) in the shopper's selected currency,
 * converted live. Before the store hydrates it shows the USD value, so the
 * server and first client paint agree — no hydration mismatch, no flash.
 */
export function Money({ usd, className }: { usd: number; className?: string }) {
  const { code, rates, hydrated } = useCurrency();

  if (!hydrated || code === "USD") {
    return <span className={className}>{formatPrice(usd)}</span>;
  }

  const rate = rates[code] ?? 1;
  return (
    <span className={className} title={`${getCurrency(code).label} · converted from USD`}>
      {convertAndFormat(usd, code, rate)}
    </span>
  );
}
