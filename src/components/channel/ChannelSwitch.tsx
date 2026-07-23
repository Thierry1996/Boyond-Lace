"use client";

import { User, Store, ChevronDown } from "lucide-react";
import { useChannel } from "@/lib/stores/channel";

/**
 * Header channel indicator. Shows which storefront the shopper is in and
 * re-opens the chooser on click — the promise that the option is always one
 * tap away, never buried. Mirrors the currency/language selector styling so the
 * preference cluster reads as one row.
 */
export function ChannelSwitch() {
  const { channel, hydrated, openChooser } = useChannel();

  // Before hydration, assume retail so the control's width is stable and there
  // is no layout shift when the persisted choice loads.
  const isWholesale = hydrated && channel === "wholesale";
  const Icon = isWholesale ? Store : User;

  return (
    <button
      type="button"
      onClick={openChooser}
      aria-label="Change how you shop"
      className="flex items-center gap-1.5 text-[0.6875rem] tracking-[0.1em] text-neutral-400 uppercase transition-colors duration-300 hover:text-gold"
    >
      <Icon size={14} strokeWidth={1.6} />
      <span className="hidden xl:inline">{isWholesale ? "Wholesale" : "Retail"}</span>
      <ChevronDown size={12} strokeWidth={1.6} className="opacity-70" />
    </button>
  );
}
