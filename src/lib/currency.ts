/**
 * Currency system. Prices are authored in USD (cents) throughout the catalog;
 * everything the shopper sees is converted client-side against live rates from
 * /api/rates (Frankfurter, cached), with the static table below as the offline
 * fallback so the storefront never shows a broken price.
 */

export interface Currency {
  code: string;
  symbol: string;
  /** Where the symbol sits and how it groups — Intl handles the rest. */
  locale: string;
  flag: string;
  label: string;
  /** Most currencies show 2 decimals; JPY/KRW show 0. */
  zeroDecimal?: boolean;
}

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", locale: "en-US", flag: "🇺🇸", label: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", flag: "🇪🇺", label: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", flag: "🇬🇧", label: "British Pound" },
  { code: "CAD", symbol: "$", locale: "en-CA", flag: "🇨🇦", label: "Canadian Dollar" },
  { code: "AUD", symbol: "$", locale: "en-AU", flag: "🇦🇺", label: "Australian Dollar" },
  { code: "NGN", symbol: "₦", locale: "en-NG", flag: "🇳🇬", label: "Nigerian Naira" },
  { code: "ZAR", symbol: "R", locale: "en-ZA", flag: "🇿🇦", label: "South African Rand" },
  {
    code: "JPY",
    symbol: "¥",
    locale: "ja-JP",
    flag: "🇯🇵",
    label: "Japanese Yen",
    zeroDecimal: true,
  },
];

export const CURRENCY_CODES = CURRENCIES.map((c) => c.code);

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
}

/**
 * Static USD→X fallback rates (approximate, mid-market, refreshed at build).
 * Only used when the live /api/rates fetch fails. Kept deliberately close to
 * real so a fallback is never wildly wrong.
 */
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.37,
  AUD: 1.51,
  NGN: 1580,
  ZAR: 18.4,
  JPY: 157,
};

/**
 * Converts a USD minor-unit amount into the target currency's major units and
 * formats it. `rate` is USD→target; pass live or fallback rates in.
 */
export function convertAndFormat(usdMinorUnits: number, code: string, rate: number): string {
  const currency = getCurrency(code);
  const major = (usdMinorUnits / 100) * rate;
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
    minimumFractionDigits: currency.zeroDecimal ? 0 : major % 1 === 0 ? 0 : 2,
    maximumFractionDigits: currency.zeroDecimal ? 0 : 2,
  }).format(major);
}

/** Maps a browser region (from navigator.language) to a sensible default currency. */
export function currencyForRegion(locale: string | undefined): string {
  if (!locale) return "USD";
  const region = locale.split("-")[1]?.toUpperCase();
  const map: Record<string, string> = {
    US: "USD",
    GB: "GBP",
    CA: "CAD",
    AU: "AUD",
    NG: "NGN",
    ZA: "ZAR",
    JP: "JPY",
    DE: "EUR",
    FR: "EUR",
    ES: "EUR",
    IT: "EUR",
    NL: "EUR",
    IE: "EUR",
    PT: "EUR",
  };
  return region && map[region] ? map[region] : "USD";
}
