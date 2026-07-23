"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Store } from "lucide-react";
import { useChannel, type Channel } from "@/lib/stores/channel";

/**
 * Channel chooser.
 *
 * Appears once, on the first visit, before the shopper has told us how they buy
 * — and re-openable at any time from the header switch. Choosing routes to the
 * matching storefront so the very first product they see is priced for them.
 *
 * It is not a hard paywall: the backdrop and Escape both dismiss it onto the
 * retail side, because a shopper who ignores the question is a shopper, not a
 * wholesaler. The choice only ever *adds* the trade view; it never blocks the
 * store.
 */
export function ChannelGate() {
  const router = useRouter();
  const { channel, hydrated, chooserOpen, setChannel, closeChooser } = useChannel();

  // Show on first visit (chosen nothing yet) or whenever re-opened from the switch.
  const open = hydrated && (channel === null || chooserOpen);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  function choose(c: Channel) {
    setChannel(c);
    router.push(c === "wholesale" ? "/wholesale/catalog" : "/shop");
  }

  /** Dismissing without choosing defaults to retail but keeps the switch offering wholesale. */
  function dismiss() {
    if (channel === null) setChannel("retail");
    else closeChooser();
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-[5vw]">
      <div
        onClick={dismiss}
        className="absolute inset-0 bg-ink/75 backdrop-blur-sm"
        style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="How would you like to shop?"
        className="dark-island relative w-full max-w-2xl border border-gold/25 bg-neutral-900 p-8 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.85)] sm:p-12"
        style={{ animation: "blMenuIn 420ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        <p className="eyebrow mb-3 text-gold">Before you browse</p>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-paper">
          How are you shopping with us?
        </h2>
        <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-neutral-400">
          The same units, two ways to buy. Pick the one that fits — you can switch whenever you like
          from the header.
        </p>

        <div className="mt-9 grid gap-5 sm:grid-cols-2">
          <button
            onClick={() => choose("retail")}
            className="card-lift group flex flex-col items-start border border-white/12 p-6 text-left transition-colors hover:border-gold/50"
          >
            <User size={22} strokeWidth={1.5} className="text-gold" />
            <span className="mt-4 font-[family-name:var(--font-display)] text-xl text-paper">
              For myself
            </span>
            <span className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-400">
              Single units at retail, a bag, and checkout. The full storefront.
            </span>
            <span className="mt-5 text-[0.75rem] tracking-[0.14em] text-gold uppercase">
              Shop retail →
            </span>
          </button>

          <button
            onClick={() => choose("wholesale")}
            className="card-lift group flex flex-col items-start border border-white/12 p-6 text-left transition-colors hover:border-gold/50"
          >
            <Store size={22} strokeWidth={1.5} className="text-gold" />
            <span className="mt-4 font-[family-name:var(--font-display)] text-xl text-paper">
              For a salon or store
            </span>
            <span className="mt-2 text-[0.8125rem] leading-relaxed text-neutral-400">
              Per-unit trade pricing from 50 units, MAP-protected. Quote, not cart.
            </span>
            <span className="mt-5 text-[0.75rem] tracking-[0.14em] text-gold uppercase">
              Shop wholesale →
            </span>
          </button>
        </div>

        <button
          onClick={dismiss}
          className="mt-7 text-[0.75rem] tracking-[0.1em] text-neutral-400 uppercase underline-offset-4 transition-colors hover:text-paper hover:underline"
        >
          Just browsing — take me to retail
        </button>
      </div>
    </div>
  );
}
