"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useCurrency } from "./currency";
import { currencyForRegion } from "@/lib/currency";

/**
 * Site locale. Detects the browser's region on first visit, sets <html lang>,
 * and drives the default currency. Full translated content is a separate
 * content pipeline (next-intl + message catalogs) — this store carries the
 * shopper's choice and region so that work can plug in without UI changes.
 */

export interface Locale {
  code: string; // BCP-47, e.g. "en-US"
  label: string;
  flag: string;
  translated: boolean; // true once a message catalog exists for it
}

export const LOCALES: Locale[] = [
  { code: "en-US", label: "English (US)", flag: "🇺🇸", translated: true },
  { code: "en-GB", label: "English (UK)", flag: "🇬🇧", translated: true },
  { code: "fr-FR", label: "Français", flag: "🇫🇷", translated: false },
  { code: "es-ES", label: "Español", flag: "🇪🇸", translated: false },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪", translated: false },
  { code: "ja-JP", label: "日本語", flag: "🇯🇵", translated: false },
];

interface LocaleState {
  code: string;
  hydrated: boolean;
  chosen: boolean;
  setCode: (code: string) => void;
  autoDetect: () => void;
  setHydrated: () => void;
}

function applyLang(code: string) {
  if (typeof document !== "undefined") document.documentElement.lang = code;
}

export const useLocale = create<LocaleState>()(
  persist(
    (set, get) => ({
      code: "en-US",
      hydrated: false,
      chosen: false,
      setHydrated: () => set({ hydrated: true }),
      setCode: (code) => {
        set({ code, chosen: true });
        applyLang(code);
        // Selecting a locale nudges the currency default to match its region,
        // unless the shopper has already picked a currency explicitly.
        const cur = useCurrency.getState();
        if (!cur.chosen) useCurrency.setState({ code: currencyForRegion(code) });
      },
      autoDetect: () => {
        if (get().chosen) return;
        const nav = typeof navigator !== "undefined" ? navigator.language : "en-US";
        // Match to the closest supported locale by region, else language, else en-US.
        const region = nav.split("-")[1]?.toUpperCase();
        const byRegion = LOCALES.find((l) => l.code.endsWith(`-${region}`));
        const byLang = LOCALES.find((l) => l.code.startsWith(nav.split("-")[0]));
        const chosen = byRegion ?? byLang ?? LOCALES[0];
        set({ code: chosen.code });
        applyLang(chosen.code);
      },
    }),
    {
      name: "bl.locale.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ code: s.code, chosen: s.chosen }),
      // Call actions on the rehydrated state — the store binding is still in
      // TDZ during synchronous localStorage rehydration.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
        state?.autoDetect();
        if (state?.chosen) applyLang(state.code);
      },
    },
  ),
);
