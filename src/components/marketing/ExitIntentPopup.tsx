"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Zap, Check } from "lucide-react";
import { useCart } from "@/lib/stores/cart";

/**
 * Exit-intent offer. When a visitor who hasn't added anything to the bag moves
 * to leave (cursor darts to the top of the window), a single 20%-off Flash Sale
 * offer appears — once per session. Dropping an email captures the lead to
 * Supabase (source="exit-intent"); the code reveals inline so they can still buy
 * now, or later. Non-blocking and easy to dismiss.
 */

const SESSION_KEY = "bl.exitintent.v1";
const CODE = "FLASH20";

export function ExitIntentPopup() {
  const { count, hydrated } = useCart();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Only for visitors with an empty bag ("never made a purchase"), once/session.
    if (!hydrated || count > 0) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        trigger();
      }
    };
    // Small grace period so it can't fire on the very first paint.
    const armed = setTimeout(() => document.addEventListener("mouseout", onLeave), 4000);

    function trigger() {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      document.removeEventListener("mouseout", onLeave);
      setMounted(true);
      requestAnimationFrame(() => setOpen(true));
    }

    return () => {
      clearTimeout(armed);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [hydrated, count]);

  function close() {
    setOpen(false);
    setTimeout(() => setMounted(false), 350);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setBusy(true);
    try {
      await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          phone: "",
          consentMarketing: true,
          consentTerms: true,
          prize: `20% OFF (${CODE})`,
          source: "exit-intent",
          pagePath: typeof window !== "undefined" ? window.location.pathname : undefined,
        }),
      });
      setDone(true);
    } finally {
      setBusy(false);
    }
  }

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close offer"
        onClick={close}
        className={`absolute inset-0 bg-ink/55 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-label="20% off before you go"
        className={`relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-plum-900 to-ink p-8 text-center shadow-[0_30px_90px_-24px_rgba(0,0,0,0.85)] transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-gold"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        {done ? (
          <div>
            <p className="mb-2 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">
              <Check size={14} /> You&rsquo;re in
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl text-paper">
              Here&rsquo;s 20% off
            </h2>
            <p className="mt-2 text-[0.9375rem] text-blush-200/75">
              Use it now or later — we&rsquo;ve emailed it too.
            </p>
            <div className="mt-5 border border-dashed border-gold px-5 py-3 font-mono text-lg tracking-[0.25em] text-gold">
              {CODE}
            </div>
            <a
              href="/shop?sort=newest"
              onClick={close}
              className="cta-primary mt-6 inline-block px-8 py-3.5 text-[0.75rem] tracking-[0.14em] uppercase"
            >
              Shop the Flash Sale
            </a>
          </div>
        ) : (
          <>
            <p className="mb-2 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">
              <Zap size={14} className="fill-gold" /> Wait — before you go
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,5vw,2.5rem)] leading-tight text-paper">
              Take 20% off the Flash Sale
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-blush-200/75">
              Drop your email and we&rsquo;ll send a one-time code for 20% off any unit in the Flash
              Sale — yours to use whenever you&rsquo;re ready.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-3" noValidate>
              <input
                type="email"
                required
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none"
              />
              {error && <p className="text-[0.75rem] text-rose-400">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="cta-primary w-full px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase disabled:opacity-70"
              >
                {busy ? "Sending…" : "Send my 20% code"}
              </button>
            </form>
            <button
              type="button"
              onClick={close}
              className="mt-4 text-[0.6875rem] tracking-[0.08em] text-neutral-500 uppercase hover:text-neutral-300"
            >
              No thanks, I&rsquo;ll pay full price
            </button>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
