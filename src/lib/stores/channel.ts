"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Channel } from "@/lib/channel";

// Re-exported so existing client imports of these from the store keep working.
export { WHOLESALE_MOQ, WHOLESALE_STEP } from "@/lib/channel";
export type { Channel } from "@/lib/channel";

/**
 * Shopping channel.
 *
 * Beyond Lace sells the same catalogue two ways, and the two must never bleed
 * into each other: a retail shopper sees single-unit prices and a cart; a trade
 * buyer sees per-unit wholesale pricing, a 50-unit minimum, and a quote flow
 * with no retail cart at all. Keeping them on separate routes and gating the
 * pricing behind this one flag is what prevents the channels from conflicting.
 *
 * `channel` is null until the visitor chooses, which is what triggers the
 * first-visit chooser. The choice persists, and the header switch lets them
 * change their mind at any time — the option is always present, never buried.
 */

interface ChannelState {
  channel: Channel | null;
  hydrated: boolean;
  /** Controls the chooser overlay independently of whether a choice exists. */
  chooserOpen: boolean;
  setChannel: (c: Channel) => void;
  openChooser: () => void;
  closeChooser: () => void;
  setHydrated: () => void;
}

export const useChannel = create<ChannelState>()(
  persist(
    (set) => ({
      channel: null,
      hydrated: false,
      chooserOpen: false,
      setChannel: (channel) => set({ channel, chooserOpen: false }),
      openChooser: () => set({ chooserOpen: true }),
      closeChooser: () => set({ chooserOpen: false }),
      setHydrated: () => set({ hydrated: true }),
    }),
    {
      name: "bl.channel.v1",
      storage: createJSONStorage(() => localStorage),
      // Only the choice persists — never the transient overlay state.
      partialize: (s) => ({ channel: s.channel }),
      // Actions run on the rehydrated state, not the store binding, which is
      // still in TDZ during synchronous rehydration (same pattern as the other
      // persisted stores).
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    },
  ),
);
