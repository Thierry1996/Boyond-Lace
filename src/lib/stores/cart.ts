"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartLine } from "@/lib/commerce";

/**
 * Cart store — Zustand + persist, per the locked stack (Phase 1).
 * Replaces the earlier context provider; the `useCart` hook keeps the same
 * shape so consumers did not have to change their reads.
 */

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  hydrated: boolean;
  add: (line: Omit<CartLine, "id">) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
}

/** Stable line identity: same product + same selections collapses into one line. */
function lineKey(productId: string, selections: Record<string, string>): string {
  const encoded = Object.keys(selections)
    .sort()
    .map((k) => `${k}:${selections[k]}`)
    .join("|");
  return `${productId}__${encoded}`;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      isOpen: false,
      hydrated: false,
      add: (line) => {
        const id = lineKey(line.productId, line.selections);
        set((state) => {
          const existing = state.lines.find((l) => l.id === id);
          const lines = existing
            ? state.lines.map((l) =>
                l.id === id ? { ...l, quantity: l.quantity + line.quantity } : l,
              )
            : [...state.lines, { ...line, id }];
          return { lines, isOpen: true };
        });
      },
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      setQuantity: (id, quantity) =>
        set((s) => ({
          lines:
            quantity < 1
              ? s.lines.filter((l) => l.id !== id)
              : s.lines.map((l) => (l.id === id ? { ...l, quantity } : l)),
        })),
      clear: () => set({ lines: [] }),
      setOpen: (isOpen) => set({ isOpen }),
    }),
    {
      name: "bl.cart.v1",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ lines: s.lines }),
      onRehydrateStorage: () => (state) => {
        // Flag lets components avoid SSR/client markup mismatches.
        state?.setOpen(false);
        useCartStore.setState({ hydrated: true });
      },
    },
  ),
);

/** Same API surface the old context exposed. */
export function useCart() {
  const store = useCartStore();
  const subtotal = store.lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const count = store.lines.reduce((sum, l) => sum + l.quantity, 0);
  return { ...store, subtotal, count };
}
