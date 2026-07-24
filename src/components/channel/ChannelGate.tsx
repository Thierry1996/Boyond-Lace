"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Store, X } from "lucide-react";
import { useChannel, type Channel } from "@/lib/stores/channel";

/**
 * Channel chooser.
 *
 * Compulsory on the first visit: the shopper must say whether they are buying
 * for themselves or for a business before the store opens, and is then routed
 * to the storefront priced for them. There is deliberately no backdrop dismiss,
 * no Escape, and no bail-out link while `channel` is null — retail and wholesale
 * are genuinely different experiences (cart vs quote, single-unit vs MOQ), and
 * guessing wrong is worse than asking once.
 *
 * When re-opened later from the header switch a choice already exists, so that
 * pass IS dismissible — the shopper can look and keep what they had.
 */
export function ChannelGate() {
  const router = useRouter();
  const { channel, hydrated, chooserOpen, setChannel, closeChooser } = useChannel();

  // Show on first visit (chosen nothing yet) or whenever re-opened from the switch.
  const open = hydrated && (channel === null || chooserOpen);
  // The first, choice-less pass is mandatory; a re-open (channel already set) is not.
  const compulsory = channel === null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      // Escape only dismisses a non-compulsory re-open.
      if (e.key === "Escape" && !compulsory) closeChooser();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, compulsory]);

  if (!open) return null;

  function choose(c: Channel) {
    setChannel(c);
    router.push(c === "wholesale" ? "/wholesale/catalog" : "/shop");
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-[5vw]">
      <div
        // The backdrop closes a re-open, but is inert during the compulsory pass.
        onClick={compulsory ? undefined : closeChooser}
        className="absolute inset-0 bg-ink/80 backdrop-blur-sm"
        style={{ animation: "blFade 300ms cubic-bezier(0.16,1,0.3,1)" }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="How would you like to shop?"
        className="dark-island relative w-full max-w-2xl border border-gold/25 bg-neutral-900 p-8 shadow-[0_40px_120px_-30px_rgb(0_0_0/0.85)] sm:p-12"
        style={{ animation: "blMenuIn 420ms cubic-bezier(0.16,1,0.3,1)" }}
      >
        {/* Re-opens get a close control; the compulsory first pass does not. */}
        {!compulsory && (
          <button
            onClick={closeChooser}
            aria-label="Close"
            className="absolute top-5 right-5 grid size-9 place-items-center rounded-full text-neutral-400 transition-colors hover:bg-white/10 hover:text-gold"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        )}

        <p className="eyebrow mb-3 text-gold">
          {compulsory ? "Choose to continue" : "Change your view"}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.05] text-paper">
          How are you shopping with us?
        </h2>
        <p className="mt-4 max-w-lg text-[0.9375rem] leading-relaxed text-neutral-400">
          The same units, two ways to buy — pick the one that fits and we&apos;ll take you to the
          right store. You can switch whenever you like from the header.
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

        <p className="mt-7 text-[0.75rem] text-neutral-400">
          {compulsory
            ? "Pick one above to enter the store."
            : "Keeping your current view? Close this."}
        </p>
      </div>
    </div>
  );
}
