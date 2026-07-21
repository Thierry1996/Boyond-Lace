"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  hydrated: boolean;
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  setHydrated: () => void;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      hydrated: false,
      toggle: (slug) =>
        set((s) => ({
          slugs: s.slugs.includes(slug) ? s.slugs.filter((x) => x !== slug) : [...s.slugs, slug],
        })),
      has: (slug) => get().slugs.includes(slug),
      clear: () => set({ slugs: [] }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "bl.wishlist.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ slugs: s.slugs }),
      // Action on the rehydrated state — the store binding is still in TDZ here.
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
