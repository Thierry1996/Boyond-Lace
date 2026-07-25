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
 * `channel` is null until the visitor chooses, and the chosen channel persists
 * across sessions so the header label and routing remember it. The compulsory
 * chooser, however, is launched once per browser SESSION on app open — the
 * visitor confirms how they are shopping each time they open the app — tracked
 * separately in sessionStorage so a persisted channel does not suppress it.
 * The header switch can still re-open the chooser at any time.
 */

/** Session flag: has the visitor confirmed their channel this app-open? */
const SESSION_KEY = "bl.channel.session";

function sessionConfirmedNow(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function markSessionConfirmed() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    // Private mode or storage disabled — the gate simply re-asks next open.
  }
}

interface ChannelState {
  channel: Channel | null;
  hydrated: boolean;
  /** True once the visitor has confirmed a channel during this browser session. */
  sessionConfirmed: boolean;
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
      sessionConfirmed: false,
      chooserOpen: false,
      setChannel: (channel) => {
        markSessionConfirmed();
        set({ channel, sessionConfirmed: true, chooserOpen: false });
      },
      openChooser: () => set({ chooserOpen: true }),
      closeChooser: () => set({ chooserOpen: false }),
      // Seed the session flag from sessionStorage through `set` so components
      // actually observe it — a reload mid-session stays confirmed, a fresh app
      // open (empty sessionStorage) re-launches the compulsory gate.
      setHydrated: () => set({ hydrated: true, sessionConfirmed: sessionConfirmedNow() }),
    }),
    {
      name: "bl.channel.v1",
      storage: createJSONStorage(() => localStorage),
      // Only the choice persists — the session confirmation and overlay state
      // are deliberately transient, so the gate re-launches each app open.
      partialize: (s) => ({ channel: s.channel }),
      // Actions run on the rehydrated state, not the store binding, which is
      // still in TDZ during synchronous rehydration (same pattern as the other
      // persisted stores).
      onRehydrateStorage: () => (state) => {
        // setHydrated seeds sessionConfirmed from sessionStorage through `set`,
        // so a reload mid-session stays confirmed and a fresh open re-gates.
        state?.setHydrated();
      },
    },
  ),
);
