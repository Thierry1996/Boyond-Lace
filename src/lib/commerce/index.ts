import { mockAdapter } from "./mock-adapter";
import type { CommerceAdapter } from "./types";

/**
 * The single place the backend is chosen.
 *
 * When the commerce decision lands, implement CommerceAdapter for that vendor
 * and swap it here. Nothing else in the application should need to change.
 */
export const commerce: CommerceAdapter = mockAdapter;

export * from "./types";

/** Formats minor units for display. Currency selector wires in here later. */
export function formatPrice(minorUnits: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: minorUnits % 100 === 0 ? 0 : 2,
  }).format(minorUnits / 100);
}
