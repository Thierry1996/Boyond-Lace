import { mockAdapter } from "./mock-adapter";
import { medusaAdapter } from "./medusa-adapter";
import type { CommerceAdapter } from "./types";

/**
 * The single place the backend is chosen. Medusa is the live commerce engine
 * when MEDUSA_BACKEND_URL is set; otherwise the in-memory mock is used (tests,
 * offline). Every branded page reads through `commerce`, so this swap is all it
 * takes to go from mock data to the real Medusa catalogue.
 */
export const commerce: CommerceAdapter =
  process.env.MEDUSA_BACKEND_URL || process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
    ? medusaAdapter
    : mockAdapter;

export * from "./types";
export * from "./variations";
export * from "./details";
export * from "./reviews";

/** Formats minor units for display. Currency selector wires in here later. */
export function formatPrice(minorUnits: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100);
}
