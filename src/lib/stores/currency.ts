"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CURRENCY_CODES, FALLBACK_RATES, currencyForRegion } from "@/lib/currency";

interface CurrencyState {
  code: string;
  rates: Record<string, number>;
  live: boolean;
  hydrated: boolean;
  /** User has explicitly picked — stops region auto-detect from overriding. */
  chosen: boolean;
  setCode: (code: string) => void;
  loadRates: () => Promise<void>;
  autoDetect: () => void;
  setHydrated: () => void;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      code: "USD",
      rates: FALLBACK_RATES,
      live: false,
      hydrated: false,
      chosen: false,
      setCode: (code) => {
        if (CURRENCY_CODES.includes(code)) set({ code, chosen: true });
      },
      setHydrated: () => set({ hydrated: true }),
      loadRates: async () => {
        try {
          const res = await fetch("/api/rates");
          const data = await res.json();
          // Merge over the fallback table: the upstream doesn't quote every
          // currency we sell in (e.g. NGN), and a missing rate must never
          // silently price a product at 1:1.
          if (data?.rates) set({ rates: { ...FALLBACK_RATES, ...data.rates }, live: !!data.live });
        } catch {
          // Keep whatever rates we have — fallback table is already loaded.
        }
      },
      autoDetect: () => {
        // Only when the shopper hasn't chosen: default to their browser region.
        if (get().chosen) return;
        const region = typeof navigator !== "undefined" ? navigator.language : undefined;
        set({ code: currencyForRegion(region) });
      },
    }),
    {
      name: "bl.currency.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ code: s.code, chosen: s.chosen }),
      // Actions are called on the rehydrated state, not on the store binding —
      // that binding is still in TDZ while persist rehydrates synchronously
      // from localStorage, so touching it here silently aborts the callback.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        state?.autoDetect();
        state?.loadRates();
      },
    },
  ),
);
