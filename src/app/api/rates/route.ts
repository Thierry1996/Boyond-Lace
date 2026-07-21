import { NextResponse } from "next/server";
import { CURRENCY_CODES, FALLBACK_RATES } from "@/lib/currency";

export const runtime = "nodejs";
// Rates are refreshed at most hourly and shared across all shoppers.
export const revalidate = 3600;

/**
 * Live USD-based FX rates for the currency selector. Fetches Frankfurter (free,
 * no key, ECB data) and falls back to the committed static table if the network
 * is unavailable — the storefront must always be able to price a product.
 */
export async function GET() {
  const targets = CURRENCY_CODES.filter((c) => c !== "USD").join(",");

  try {
    const res = await fetch(`https://api.frankfurter.app/latest?from=USD&to=${targets}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) throw new Error(`rates upstream ${res.status}`);
    const data = (await res.json()) as { rates?: Record<string, number> };
    if (!data.rates) throw new Error("rates payload missing");

    return NextResponse.json({
      base: "USD",
      rates: { USD: 1, ...data.rates },
      live: true,
      fetchedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      base: "USD",
      rates: FALLBACK_RATES,
      live: false,
      fetchedAt: new Date().toISOString(),
    });
  }
}
