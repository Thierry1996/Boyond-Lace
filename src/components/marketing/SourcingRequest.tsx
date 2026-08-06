"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Search, Check, ArrowRight } from "lucide-react";

/**
 * "Can't find it? We'll source it." A discreet launcher opens a short, two-step
 * form: describe the unit and say whether it's for personal use or salon resale,
 * then leave an email (and optional phone). We source it and email when it's
 * found and ready to ship. Posts to /api/sourcing (ContactMessage, topic
 * sourcing). Non-blocking; the launcher stays out of the support widget's way.
 */
export function SourcingRequest() {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [useCase, setUseCase] = useState<"personal" | "salon" | "">("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (description.trim().length < 10) return setError("Tell us a little more about the unit.");
    if (!useCase) return setError("Personal use or salon resale?");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setError("Enter a valid email.");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/sourcing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim(), useCase, email, phone }),
      });
      if (res.ok) setDone(true);
      else setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher — bottom-left, clear of the support widget on the right */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 left-5 z-40 flex items-center gap-2 rounded-full border border-gold/40 bg-gradient-to-br from-plum-900 to-ink py-2.5 pr-4 pl-3 text-gold shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:-translate-y-0.5"
      >
        <Search size={15} strokeWidth={1.75} />
        <span className="text-[0.6875rem] font-semibold tracking-[0.12em] uppercase">
          Source a wig
        </span>
      </button>

      {open &&
        createPortal(
          <div className="fixed inset-0 z-[95] flex items-center justify-center p-4">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
            />
            <div
              role="dialog"
              aria-label="Source a custom wig"
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-gold/30 bg-gradient-to-br from-plum-900 to-ink p-7 shadow-[0_30px_90px_-24px_rgba(0,0,0,0.85)]"
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="absolute top-3 right-3 grid size-9 place-items-center rounded-full text-neutral-300 transition-colors hover:bg-white/10 hover:text-gold"
              >
                <X size={18} strokeWidth={1.75} />
              </button>

              {done ? (
                <div className="text-center">
                  <p className="mb-2 inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">
                    <Check size={14} /> Request received
                  </p>
                  <h2 className="font-[family-name:var(--font-display)] text-2xl text-paper">
                    We&rsquo;re on the hunt.
                  </h2>
                  <p className="mx-auto mt-2 max-w-xs text-[0.9375rem] leading-relaxed text-blush-200/75">
                    We&rsquo;ll email you the moment we find it and it&rsquo;s ready to ship — no
                    need to check back.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="cta-primary mt-6 px-8 py-3 text-[0.75rem] tracking-[0.14em] uppercase"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-[0.6875rem] font-semibold tracking-[0.14em] text-gold uppercase">
                    Can&rsquo;t find it?
                  </p>
                  <h2 className="mt-1 font-[family-name:var(--font-display)] text-2xl text-paper">
                    We&rsquo;ll source it for you.
                  </h2>
                  <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the unit — texture, length, lace, colour, density…"
                      className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.875rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      {(["personal", "salon"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setUseCase(u)}
                          className={`rounded-md border px-3 py-2.5 text-[0.75rem] font-semibold tracking-[0.08em] uppercase transition-colors ${
                            useCase === u
                              ? "border-gold bg-gold/15 text-gold"
                              : "border-white/15 text-blush-200/70 hover:border-gold/50"
                          }`}
                        >
                          {u === "personal" ? "Personal use" : "Salon resale"}
                        </button>
                      ))}
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email *"
                      className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone (optional)"
                      className="w-full rounded-md border border-white/15 bg-white/10 px-4 py-3 text-[0.9375rem] text-paper placeholder:text-blush-200/40 focus:border-gold focus:outline-none"
                    />
                    {error && <p className="text-[0.75rem] text-rose-400">{error}</p>}
                    <button
                      type="submit"
                      disabled={busy}
                      className="cta-primary flex w-full items-center justify-center gap-2 px-8 py-3.5 text-[0.8125rem] tracking-[0.14em] uppercase disabled:opacity-70"
                    >
                      {busy ? "Sending…" : "Source it for me"}
                      <ArrowRight size={14} strokeWidth={1.75} />
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
